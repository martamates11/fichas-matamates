#!/usr/bin/env node
/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Prueba de generadores de examen (herramienta interna, no se publica en la web).

   Uso:
     node tools/probar-generador.js pendientes/fracciones-1.js [otro.js …] [--semillas 2000] [--salida carpeta]

   Los archivos se indican relativos a examenes/generadores/. Hace dos cosas:
   1. Estrés en Node: genera cada tipo de ejercicio con N semillas y avisa de excepciones,
      de «NaN», «undefined», «Infinity» o «null» en el resultado, de signos dobles en el
      TeX («+ -», «- -», «+ +») y de tipos con poca variedad.
   2. Capturas en Chromium: monta exámenes con todos los tipos (2 apartados cada uno) en
      examenes/index.html, sin modificarlo (añade los scripts al vuelo), y guarda capturas
      de la hoja del examen y de la de soluciones en la carpeta de salida.

   MathJax: la red del entorno puede bloquear el CDN. Si existe la variable MATHJAX_DIR
   (carpeta del paquete npm «mathjax@3», la que contiene es5/), se sirve desde ahí. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const GEN = path.join(RAIZ, 'examenes', 'generadores');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const N = Number(opt('--semillas', 2000));
const SALIDA = path.resolve(opt('--salida', path.join(require('os').tmpdir(), 'probar-generador')));
const archivos = args.filter(a => a.endsWith('.js'));
if (!archivos.length) { console.error('Indica al menos un generador, p. ej. pendientes/enteros-1.js'); process.exit(1); }

/* ---------- 1. Estrés en Node ---------- */
const ctx = { console, Math, Number, String, Object, Array, Set, Map, JSON, Date };
ctx.window = ctx; vm.createContext(ctx);
const base = ['comun.js', 'pendientes/figuras.js'];
[...base, ...archivos.filter(a => !base.includes(a))].forEach(f => vm.runInContext(fs.readFileSync(path.join(GEN, f), 'utf8'), ctx, { filename: f }));
const EX = ctx.EX;
const nuevas = EX.fichas.filter(f => archivos.some(a => fs.readFileSync(path.join(GEN, a), 'utf8').includes(`'${f.id}'`)));
let problemas = 0;
const avisar = (...m) => { problemas++; if (problemas <= 60) console.log('  ✗', ...m); };
for (const f of nuevas) {
  console.log(`\n${f.grupo} · ${f.titulo} (${f.id})`);
  if (!f.enlace || !fs.existsSync(path.join(RAIZ, 'examenes', f.enlace))) avisar('enlace a la ficha inexistente:', f.enlace);
  for (const e of f.ejercicios) {
    const vistos = new Set(); let exc = 0;
    for (let s = 1; s <= N; s++) {
      let r;
      try { r = e.generar(EX.crearAzar((s * 2654435761) >>> 0), s % 6); }
      catch (x) { exc++; if (exc <= 3) avisar(`${e.id} semilla ${s}: excepción ${x.message}`); continue; }
      const todo = JSON.stringify(r);
      if (/NaN|undefined|Infinity|null/.test(todo)) avisar(`${e.id} semilla ${s}: valor no válido →`, todo.slice(0, 160));
      if (!r.enun || !Array.isArray(r.pasos) || !(r.res || r.resHtml)) avisar(`${e.id} semilla ${s}: falta enun, pasos o res`);
      const tex = [r.html ? '' : r.enun, r.res || '', ...r.pasos.map(p => p.m || '')].join(' ');
      if (/[+-]\s*[+-]\s*\d/.test(tex.replace(/\\[a-z]+/g, ' '))) avisar(`${e.id} semilla ${s}: posible signo doble →`, tex.slice(0, 160));
      vistos.add(r.enun);
    }
    const variedad = vistos.size;
    console.log(`  ${e.id.padEnd(18)} ${String(variedad).padStart(5)} enunciados distintos${variedad < 20 ? '  ⚠ poca variedad' : ''}${exc ? `  ✗ ${exc} excepciones` : ''}`);
  }
}
console.log(`\nEstrés: ${problemas ? problemas + ' problemas' : 'sin problemas'} (${N} semillas por tipo).`);

/* ---------- 2. Capturas ---------- */
(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('Playwright no disponible: se omiten las capturas.'); process.exit(problemas ? 1 : 0); }
  fs.mkdirSync(SALIDA, { recursive: true });
  const indice = fs.readFileSync(path.join(RAIZ, 'examenes', 'index.html'), 'utf8');
  const extra = archivos.filter(a => !indice.includes(`generadores/${a}"`)).map(a => `<script src="generadores/${a}"></script>\n`).join('');
  const marca = '<script src="generadores/pendientes/figuras.js"></script>\n';
  const html = indice.includes(marca) ? indice.replace(marca, marca + extra) : indice.replace('<script src="generadores/comun.js"></script>\n', m => m + extra);
  const nav = await chromium.launch();
  const pg = await nav.newPage({ viewport: { width: 1400, height: 1000 } });
  const errores = [];
  pg.on('pageerror', e => errores.push(e.message));
  const MJ = process.env.MATHJAX_DIR;
  await pg.route(/cdn\.jsdelivr\.net\/npm\/mathjax@[^/]+\/(.*)$/, r => {
    const m = r.request().url().match(/mathjax@[^/]+\/(.*)$/);
    if (MJ && fs.existsSync(path.join(MJ, m[1]))) r.fulfill({ path: path.join(MJ, m[1]) }); else r.abort();
  });
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const url = 'file://' + path.join(RAIZ, 'examenes', 'index.html');
  await pg.route(url, r => r.fulfill({ body: html, contentType: 'text/html; charset=utf-8' }));
  await pg.goto(url);
  let k = 0;
  for (const f of nuevas) {
    for (let i = 0; i < f.ejercicios.length; i += 5) {
      const tanda = f.ejercicios.slice(i, i + 5);
      const items = tanda.map((e, j) => ({ uid: j + 1, ficha: f.id, ej: e.id, n: Math.min(2, 6), puntos: 2, manual: false, semillas: [1000 + 17 * j + i, 2000 + 31 * j + i] }));
      await pg.evaluate(it => localStorage.setItem('martamates-examenes-v1', JSON.stringify({ borrador: { titulo: '', curso: '', fecha: '', modelo: 'A', verPts: true, plantilla: 'C', items: it }, guardados: [] })), items);
      await pg.reload(); await pg.waitForTimeout(MJ ? 3500 : 800);
      const nombre = `${f.id}-${String(++k).padStart(2, '0')}`;
      await pg.locator('#hoja-examen').screenshot({ path: path.join(SALIDA, nombre + '-examen.png') });
      await pg.click('#tab-sol'); await pg.waitForTimeout(MJ ? 2500 : 400);
      await pg.locator('#hoja-soluciones').screenshot({ path: path.join(SALIDA, nombre + '-soluciones.png') });
      await pg.click('#tab-examen');
    }
  }
  await nav.close();
  console.log(`Capturas en ${SALIDA}${MJ ? '' : ' (sin MathJax: las fórmulas se ven en TeX crudo; define MATHJAX_DIR para verlas compuestas)'}.`);
  if (errores.length) console.log('Errores de la página:', errores);
  process.exit(problemas || errores.length ? 1 : 0);
})();
