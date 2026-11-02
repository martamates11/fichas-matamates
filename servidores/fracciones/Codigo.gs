/**
 * Duelo galáctico · plantilla común (skill duelo-galactico) configurada para La Isla de las Fracciones (reto entre alumnos)
 * Recoge los resultados de los duelos en esta hoja y sirve el panel para proyectar.
 *
 *  POST (desde la ficha)        → registra inicio, progreso, fin o abandono de cada partida.
 *  GET ?accion=ranking&codigo&id → clasificación de un duelo para la pantalla del alumno (JSON).
 *  GET sin parámetros            → panel para la pizarra digital (Panel.html).
 *
 * Reglas: solo cuenta el primer intento de cada alumno en cada código (abandonar también cuenta
 * como intento); se ordena por aciertos y, si hay empate, por menor tiempo; el pódium muestra
 * como máximo los tres primeros.
 */

/* ===================== Configuración de esta ficha ===================== */
// Es lo único que cambia de una ficha a otra (ver skill duelo-galactico).
const CONFIG = {
  FICHA: 'La Isla de las Fracciones',
  N_PREGUNTAS: 10,
  TIEMPO_MINIMO_MS: 20000,       // 10 preguntas de fracciones en menos de 20 s no es posible (propuesta: ajustar si rechaza resultados reales)
  // Qué significa cada bit de opciones del código: las zonas que entran en el reto (= RETO_NOMBRES de la ficha)
  OPCIONES: ['Equivalencias', 'Cantidades', 'Sumas', 'Multiplicar', 'Dividir'],
  textoOpciones: lista => lista.length === 5 ? 'Todas las zonas' : (lista.length === 1 ? 'Zona: ' : 'Zonas: ') + listaY(lista)
};

const HOJA = 'Partidas';
const CABECERA = ['id', 'inicio', 'fin', 'codigo', 'opciones', 'nombre', 'nombre_normalizado', 'intento', 'estado', 'respondidas', 'aciertos', 'fallos', 'tiempo_s', 'tiempo_ms'];
const C = { id: 0, inicio: 1, fin: 2, codigo: 3, opciones: 4, nombre: 5, norm: 6, intento: 7, estado: 8, respondidas: 9, aciertos: 10, fallos: 11, tiempo_s: 12, ms: 13 };
const MINUTOS_SIN_SENAL = 15;            // quien no da señales en este tiempo deja de aparecer como «jugando»
const ALFA = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const SEGUNDOS_CACHE_PANEL = 4;          // con el panel insertado en Sites, muchos alumnos lo consultan a la vez
const listaY = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1] : String(a[0] || '');

/* ===================== Entradas web ===================== */

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.accion === 'ranking') {
    try { return salidaJson(rankingAlumno(String(p.codigo || ''), String(p.id || ''))); }
    catch (err) { return salidaJson({ ok: false, error: String(err && err.message || err) }); }
  }
  return HtmlService.createHtmlOutputFromFile('Panel')
    .setTitle('Reto entre alumnos · ' + CONFIG.FICHA)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);   // permite insertarlo en Google Sites
}

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    return salidaJson(registrar(datos));
  } catch (err) {
    return salidaJson({ ok: false, error: String(err && err.message || err) });
  }
}

function salidaJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ===================== Registro ===================== */

function registrar(d) {
  const v = validar(d);
  if (!v.ok) {
    // Un fin con tiempo imposible se rechaza, pero se anota para que el alumno no siga figurando como «jugando».
    if (d && d.evento === 'fin' && v.error === 'Tiempo imposible') marcarRechazado(d.id);
    return v;
  }
  const cache = CacheService.getScriptCache();

  // El progreso solo sirve para el panel en directo: va a la caché (rápido, sin bloquear la hoja).
  if (d.evento === 'progreso') {
    cache.put('p_' + d.id, JSON.stringify({ r: d.respondidas, a: d.aciertos, t: Date.now() }), 21600);
    return { ok: true };
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = hoja();
    const ahora = new Date();
    let fila = buscarFila(sh, d.id);
    if (!fila) {
      const filas = leerFilas(sh);
      const norm = normalizar(d.nombre);
      const intento = filas.filter(f => f.codigo === d.codigo && f.norm === norm).length + 1;
      sh.appendRow([d.id, ahora, '', d.codigo, opcionesDe(d.codigo).join(', '), textoSeguro(d.nombre), norm, intento, 'en juego', 0, 0, 0, '', '']);
      fila = sh.getLastRow();
    }
    const estado = sh.getRange(fila, C.estado + 1).getValue();
    if ((d.evento === 'fin' || d.evento === 'abandono') && estado === 'en juego') {   // idempotente: un reenvío no duplica nada
      sh.getRange(fila, C.fin + 1).setValue(ahora);
      sh.getRange(fila, C.estado + 1, 1, 6).setValues([[
        d.evento === 'fin' ? 'terminado' : 'abandonado',
        d.respondidas, d.aciertos, d.respondidas - d.aciertos, Math.round(d.ms / 100) / 10, d.ms
      ]]);
      cache.remove('p_' + d.id);
    }
    const intento = Number(sh.getRange(fila, C.intento + 1).getValue());
    return { ok: true, intento: intento, cuenta: intento === 1 };
  } finally {
    lock.releaseLock();
  }
}

function marcarRechazado(id) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;
  try {
    const sh = hoja(), fila = buscarFila(sh, String(id || ''));
    if (fila && sh.getRange(fila, C.estado + 1).getValue() === 'en juego') {
      sh.getRange(fila, C.fin + 1).setValue(new Date());
      sh.getRange(fila, C.estado + 1).setValue('rechazado');
    }
  } finally { lock.releaseLock(); }
}

/* ===================== Lectura ===================== */

function rankingAlumno(codigo, id) {
  if (!leerCodigo(codigo)) return { ok: false, error: 'Código no válido' };
  const filas = leerFilas(hoja()).filter(f => f.codigo === codigo);
  const progreso = leerProgreso(filas);
  const r = resumenDuelo(filas, progreso, Date.now(), id);
  return {
    ok: true,
    podio: r.podio.map(p => ({ nombre: p.nombre, aciertos: p.aciertos, fallos: p.fallos, ms: p.ms, yo: p.yo })),
    terminados: r.terminados, enJuego: r.enJuego.length, tu: r.tu
  };
}

/** Lo llama el panel con google.script.run. desde y hasta en milisegundos. */
function obtenerPanel(desde, hasta) {
  // Caché corta: todos los paneles abiertos con el mismo intervalo comparten una sola lectura de la hoja.
  const cache = CacheService.getScriptCache();
  const clave = 'panel_' + Math.floor(desde / 60000) + '_' + Math.floor(hasta / 60000);
  const guardado = cache.get(clave);
  if (guardado) return JSON.parse(guardado);
  const res = calcularPanel(desde, hasta);
  try { cache.put(clave, JSON.stringify(res), SEGUNDOS_CACHE_PANEL); } catch (e) { }
  return res;
}
function calcularPanel(desde, hasta) {
  const todas = leerFilas(hoja());
  const enRango = todas.filter(f => f.inicio >= desde && f.inicio <= hasta);
  const codigos = [...new Set(enRango.map(f => f.codigo))];
  // Para cada duelo se usan todas sus partidas (aunque alguna empezara justo antes del rango),
  // así el intento y la clasificación son siempre los mismos que ve el alumno.
  const filasDe = c => todas.filter(f => f.codigo === c);
  const progreso = leerProgreso(todas.filter(f => codigos.includes(f.codigo) && f.estado === 'en juego'));
  const ahora = Date.now();
  const duelos = codigos.map(c => resumenDuelo(filasDe(c), progreso, ahora, null))
    .sort((a, b) => b.ultimaActividad - a.ultimaActividad);
  return { ok: true, ahora: ahora, ficha: CONFIG.FICHA, n: CONFIG.N_PREGUNTAS, duelos: duelos };
}

/* ===================== Lógica pura (sin servicios de Google) ===================== */

function resumenDuelo(filas, progreso, ahora, idAlumno) {
  const codigo = filas.length ? filas[0].codigo : '';
  const primeros = filas.filter(f => f.intento === 1);
  const ordenar = (a, b) => b.aciertos - a.aciertos || a.ms - b.ms || a.fin - b.fin;
  const terminados = primeros.filter(f => f.estado === 'terminado').sort(ordenar);
  const enJuego = primeros.filter(f => f.estado === 'en juego').map(f => {
    const p = progreso[f.id];
    return { nombre: f.nombre, respondidas: p ? p.r : 0, ultima: p ? p.t : f.inicio };
  }).filter(x => ahora - x.ultima < MINUTOS_SIN_SENAL * 60000)
    .sort((a, b) => b.respondidas - a.respondidas || a.nombre.localeCompare(b.nombre, 'es'));
  const podio = terminados.slice(0, 3).map(f => ({ nombre: f.nombre, aciertos: f.aciertos, fallos: f.fallos, ms: f.ms, fin: f.fin, yo: !!idAlumno && f.id === idAlumno }));
  let tu = null;
  if (idAlumno) {
    const mia = filas.find(f => f.id === idAlumno);
    if (mia) {
      const pos = terminados.findIndex(f => f.id === idAlumno);
      tu = { intento: mia.intento, cuenta: mia.intento === 1, posicion: pos >= 0 ? pos + 1 : null, estado: mia.estado };
    }
  }
  const tiempos = filas.map(f => Math.max(f.inicio, f.fin || 0));
  const enJuegoIds = new Set(primeros.filter(f => f.estado === 'en juego').map(f => f.id));
  const ultimos = Object.keys(progreso).filter(id => enJuegoIds.has(id)).map(id => progreso[id].t);
  return {
    codigo: codigo,
    opciones: opcionesDe(codigo),
    textoOpciones: codigo ? CONFIG.textoOpciones(opcionesDe(codigo)) : '',
    inicio: filas.length ? Math.min(...filas.map(f => f.inicio)) : 0,
    ultimaActividad: Math.max(0, ...tiempos, ...ultimos),
    participantes: primeros.length,
    terminados: terminados.length,
    abandonos: primeros.filter(f => f.estado === 'abandonado').length,
    rechazados: primeros.filter(f => f.estado === 'rechazado').length,
    repetidos: filas.filter(f => f.intento > 1).length,
    enJuego: enJuego,
    podio: podio,
    tu: tu
  };
}

function validar(d) {
  if (!d || typeof d !== 'object') return { ok: false, error: 'Datos vacíos' };
  if (['inicio', 'progreso', 'fin', 'abandono'].indexOf(d.evento) < 0) return { ok: false, error: 'Evento desconocido' };
  if (typeof d.id !== 'string' || !/^[A-Za-z0-9-]{8,40}$/.test(d.id)) return { ok: false, error: 'Identificador no válido' };
  if (!leerCodigo(d.codigo)) return { ok: false, error: 'Código de duelo no válido' };
  const nombre = String(d.nombre || '').trim();
  if (!nombre || nombre.length > 60) return { ok: false, error: 'Nombre no válido' };
  if (d.evento === 'inicio') return { ok: true };
  const entero = (x, min, max) => Number.isInteger(x) && x >= min && x <= max;
  if (!entero(d.respondidas, 0, CONFIG.N_PREGUNTAS)) return { ok: false, error: 'Número de respuestas no válido' };
  if (!entero(d.aciertos, 0, d.respondidas)) return { ok: false, error: 'Número de aciertos no válido' };
  if (d.evento === 'progreso') return { ok: true };
  if (!entero(d.ms, 0, 4 * 3600000)) return { ok: false, error: 'Tiempo no válido' };
  if (d.evento === 'fin' && d.respondidas !== CONFIG.N_PREGUNTAS) return { ok: false, error: 'Duelo incompleto' };
  if (d.evento === 'fin' && d.ms < CONFIG.TIEMPO_MINIMO_MS) return { ok: false, error: 'Tiempo imposible' };
  return { ok: true };
}

function normalizar(nombre) {
  return String(nombre || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Evita que un nombre como «=HYPERLINK(...)» se interprete como fórmula en la hoja. */
function textoSeguro(t) {
  const s = String(t || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/* Mismo formato de código que la ficha: 6 caracteres + 1 de control (pesos impares). */
function digitoControl(s) {
  let acc = 0;
  for (let i = 0; i < s.length; i++) acc += ALFA.indexOf(s[i]) * (2 * i + 1);
  return ALFA[acc % 32];
}
function leerCodigo(txt) {
  const s = String(txt || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (s.length !== 7) return null;
  for (const c of s) if (ALFA.indexOf(c) < 0) return null;
  if (digitoControl(s.slice(0, 6)) !== s[6]) return null;
  let v = 0;
  for (const c of s.slice(0, 6)) v = v * 32 + ALFA.indexOf(c);
  const mascara = Math.floor(v / Math.pow(2, 21));
  if (mascara >= (1 << CONFIG.OPCIONES.length)) return null;   // igual que la ficha: bits fuera de rango = código no válido
  const opciones = CONFIG.OPCIONES.filter((_, i) => mascara & (1 << i));
  return opciones.length ? { codigo: s, opciones: opciones } : null;
}
function opcionesDe(codigo) { const d = leerCodigo(codigo); return d ? d.opciones : []; }

/* ===================== Hoja y caché ===================== */

function hoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let sh = libro.getSheetByName(HOJA);
  if (!sh) {
    sh = libro.insertSheet(HOJA);
    sh.getRange(1, 1, 1, CABECERA.length).setValues([CABECERA]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function buscarFila(sh, id) {
  if (sh.getLastRow() < 2) return null;
  const celda = sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
  return celda ? celda.getRow() : null;
}

function leerFilas(sh) {
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, CABECERA.length).getValues()
    .filter(r => r[C.id])
    .map(r => ({
      id: String(r[C.id]),
      inicio: r[C.inicio] instanceof Date ? r[C.inicio].getTime() : 0,
      fin: r[C.fin] instanceof Date ? r[C.fin].getTime() : 0,
      codigo: String(r[C.codigo]),
      nombre: String(r[C.nombre]).replace(/^'/, ''),
      norm: String(r[C.norm]),
      intento: Number(r[C.intento]),
      estado: String(r[C.estado]),
      respondidas: Number(r[C.respondidas]) || 0,
      aciertos: Number(r[C.aciertos]) || 0,
      fallos: Number(r[C.fallos]) || 0,
      ms: Number(r[C.ms]) || 0
    }));
}

function leerProgreso(filas) {
  const ids = filas.filter(f => f.estado === 'en juego').map(f => 'p_' + f.id);
  if (!ids.length) return {};
  const crudo = CacheService.getScriptCache().getAll(ids);
  const out = {};
  Object.keys(crudo).forEach(k => { try { out[k.slice(2)] = JSON.parse(crudo[k]); } catch (e) { } });
  return out;
}

/** Ejecútala una vez desde el editor para crear la hoja y autorizar el script. */
function prepararHoja() {
  hoja();
  SpreadsheetApp.getActiveSpreadsheet().setSpreadsheetTimeZone('Europe/Madrid');
}
