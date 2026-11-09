/*
 * Guardián de las fichas · Martamates  (versión legible, NO se enlaza desde las fichas)
 *
 * En las fichas va una versión comprimida de este código, insertada justo antes de </body>
 * por el script tools/insertar-guardian.py. Si cambias algo aquí, vuelve a ejecutar ese script.
 *
 * Qué hace:
 *  - En martamates11.github.io, abierta normalmente → nada.
 *  - Archivo guardado en el ordenador (file://), localhost o red local → nada.
 *  - Traducción automática de Google de tu propia web → nada.
 *  - Tu web incrustada en otra página (iframe) → lo anota en la hoja, sin e-mail ni franja
 *    (está permitido en los términos de uso).
 *  - Alojada en cualquier otro dominio → aviso (e-mail) + franja visible de autoría.
 *  Cada navegador envía como máximo una señal al día por página, para no saturar el servidor.
 */
(function () {
  var URL_AVISOS = '__URL_AVISOS__';         // URL /exec del Apps Script (servidores/avisos)
  var ORIGINAL = 'martamates11.github.io';
  var BASE = 'https://martamates11.github.io/fichas-matamates/';

  var host = location.hostname;
  if (location.protocol === 'file:' || !host || host === 'localhost' ||
      /^(127\.|10\.|192\.168\.|\[)/.test(host)) return;
  if (/^martamates11-github-io\.translate\.goog$/.test(host)) return;

  var enMarco;
  try { enMarco = window.top !== window; } catch (e) { enMarco = true; }

  var tipo;
  if (host === ORIGINAL) {
    if (!enMarco) return;
    var padre = (location.ancestorOrigins && location.ancestorOrigins[0]) || document.referrer || '';
    if (padre.indexOf(ORIGINAL) !== -1) return;   // tu propia web incrustándose a sí misma
    tipo = 'incrustada';
  } else {
    tipo = 'copia';
  }

  // Señal al servidor (una por navegador, página y día)
  try {
    var clave = 'mm-g-' + location.pathname + '-' + new Date().toISOString().slice(0, 10);
    var yaEnviada = false;
    try { yaEnviada = localStorage.getItem(clave) === '1'; } catch (e) {}
    if (!yaEnviada && URL_AVISOS.indexOf('https://') === 0) {
      try { localStorage.setItem(clave, '1'); } catch (e) {}
      var datos = 'k=' + tipo +
        '&h=' + encodeURIComponent(host) +
        '&u=' + encodeURIComponent(location.href.slice(0, 400)) +
        '&t=' + encodeURIComponent(document.title.slice(0, 200)) +
        '&r=' + encodeURIComponent((document.referrer || '').slice(0, 400));
      new Image().src = URL_AVISOS + '?' + datos;
    }
  } catch (e) {}

  if (tipo !== 'copia') return;

  // Franja de autoría (dentro de un shadow DOM para que los estilos de la página no la alteren)
  var canon = document.querySelector('link[rel="canonical"]');
  var enlace = canon && canon.href.indexOf(BASE) === 0 ? canon.href : BASE;

  function franja() {
    if (document.getElementById('mm-autoria')) return;
    var cont = document.createElement('div');
    cont.id = 'mm-autoria';
    cont.style.cssText = 'all:initial;position:fixed;left:0;right:0;bottom:0;z-index:2147483647;';
    var raiz = cont.attachShadow ? cont.attachShadow({ mode: 'closed' }) : cont;
    raiz.innerHTML =
      '<style>' +
      '.f{box-sizing:border-box;width:100%;background:#1a2744;border-top:2px solid #b8922a;color:#f7f4ee;' +
      'font:15px/1.5 Georgia,"Times New Roman",serif;padding:12px 16px;text-align:center;' +
      'box-shadow:0 -4px 18px rgba(0,0,0,.18)}' +
      '.e{display:block;font:600 11px/1.4 Georgia,serif;letter-spacing:.12em;text-transform:uppercase;color:#d4aa4a;margin-bottom:2px}' +
      'a{color:#d4aa4a;font-weight:700;text-decoration:none;border-bottom:1px solid rgba(212,170,74,.5)}' +
      'a:hover{border-bottom-color:#d4aa4a}' +
      '@media(max-width:520px){.f{font-size:13.5px;padding:10px 14px}}' +
      '</style>' +
      '<div class="f" role="note"><span class="e">Copia no autorizada</span>' +
      'Esta ficha es obra de <b>Marta López de Letona</b>. Úsala gratis en su web original: ' +
      '<a href="' + enlace + '" target="_blank" rel="noopener">martamates11.github.io/fichas-matamates</a></div>';
    document.body.appendChild(cont);
    var alto = cont.getBoundingClientRect().height || 80;
    document.body.style.paddingBottom = Math.ceil(alto + 8) + 'px';
  }

  function iniciar() {
    franja();
    setInterval(franja, 4000);   // si alguien la borra desde el navegador, vuelve a aparecer
  }
  if (document.body) iniciar();
  else document.addEventListener('DOMContentLoaded', iniciar);
})();
