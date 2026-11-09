/**
 * Avisos de copias · Martamates
 *
 * Recibe una señal cuando una ficha se abre fuera de https://martamates11.github.io
 * y la anota en la hoja «Avisos». Si es una copia (la ficha está alojada en otro sitio),
 * envía un e-mail a la autora: como máximo uno por dominio y día, y nunca más de
 * MAX_CORREOS_DIA en total, para que nadie pueda llenar el buzón a propósito.
 *
 * Tipos de señal (parámetro k):
 *   copia       → la ficha está alojada en otro dominio. Se anota y se avisa por e-mail.
 *   incrustada  → la ficha se carga desde tu web dentro de otra página (iframe).
 *                 Está permitido por los términos de uso: solo se anota, sin e-mail.
 *
 * No se recoge ningún dato del alumnado: solo dominio, dirección, título y página de origen.
 */

const EMAIL = 'marta11@educarex.es';
const HOJA = 'Avisos';
const CABECERA = ['Fecha', 'Tipo', 'Dominio', 'Dirección', 'Título de la ficha', 'Página de origen'];
const MAX_CORREOS_DIA = 20;
const ZONA = 'Europe/Madrid';

function doGet(e) {
  const p = (e && e.parameter) || {};
  const tipo = p.k === 'incrustada' ? 'incrustada' : 'copia';
  const dominio = limpiar(p.h, 120).toLowerCase();
  if (!dominio) return respuesta();

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(8000)) return respuesta();
  try {
    hoja().appendRow([new Date(), tipo, celda(dominio), celda(limpiar(p.u, 400)),
                      celda(limpiar(p.t, 200)), celda(limpiar(p.r, 400))]);
    if (tipo === 'copia') avisar(dominio, limpiar(p.u, 400), limpiar(p.t, 200), limpiar(p.r, 400));
  } finally {
    lock.releaseLock();
  }
  return respuesta();
}

function avisar(dominio, url, titulo, origen) {
  const props = PropertiesService.getScriptProperties();
  const hoy = Utilities.formatDate(new Date(), ZONA, 'yyyy-MM-dd');
  let registro = {};
  try { registro = JSON.parse(props.getProperty('correos') || '{}'); } catch (err) {}
  if (registro.dia !== hoy) registro = { dia: hoy, dominios: [] };   // cada día empieza de cero
  if (registro.dominios.indexOf(dominio) !== -1) return;              // ya avisado hoy de este dominio
  if (registro.dominios.length >= MAX_CORREOS_DIA) return;            // tope diario
  registro.dominios.push(dominio);
  props.setProperty('correos', JSON.stringify(registro));

  const hojaUrl = SpreadsheetApp.getActive().getUrl();
  MailApp.sendEmail({
    to: EMAIL,
    subject: 'Copia de una ficha en ' + dominio,
    htmlBody:
      '<div style="font-family:Georgia,serif;color:#2c2c2c;max-width:560px">' +
      '<p style="color:#b8922a;letter-spacing:.1em;text-transform:uppercase;font-size:12px;margin:0 0 8px">Martamates · aviso de copia</p>' +
      '<h2 style="color:#1a2744;margin:0 0 16px">Se ha abierto una copia de una de tus fichas</h2>' +
      '<table style="border-collapse:collapse;font-size:14px;line-height:1.6">' +
      fila('Dominio', esc(dominio)) +
      fila('Ficha', esc(titulo || '(sin título)')) +
      fila('Dirección', url ? '<a href="' + esc(url) + '">' + esc(url) + '</a>' : '—') +
      fila('Llegó desde', origen ? esc(origen) : '—') +
      '</table>' +
      '<p style="font-size:13px;color:#5a5550;margin-top:18px">Solo recibirás un aviso al día por cada dominio. ' +
      'El registro completo está en <a href="' + hojaUrl + '">la hoja de avisos</a>.</p></div>'
  });
}

/* ───────── utilidades ───────── */

function hoja() {
  const ss = SpreadsheetApp.getActive();
  let h = ss.getSheetByName(HOJA);
  if (!h) {
    h = ss.insertSheet(HOJA);
    h.appendRow(CABECERA);
    h.setFrozenRows(1);
    h.getRange(1, 1, 1, CABECERA.length).setFontWeight('bold');
  }
  return h;
}

function limpiar(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
}

// Evita que un texto malicioso se interprete como fórmula en la hoja.
function celda(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function fila(etiqueta, valor) {
  return '<tr><td style="padding:4px 14px 4px 0;color:#5a5550;vertical-align:top">' + etiqueta +
         '</td><td style="padding:4px 0">' + valor + '</td></tr>';
}

function respuesta() {
  return ContentService.createTextOutput('ok');
}

/**
 * Ejecuta esta función una vez desde el editor (botón ▶) para conceder los permisos
 * y comprobar que el correo llega.
 */
function probarAviso() {
  avisar('prueba.example', 'https://prueba.example/ficha.html', 'Ficha de prueba', '');
  hoja();
}
