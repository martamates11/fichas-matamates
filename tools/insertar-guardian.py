#!/usr/bin/env python3
"""Inserta (o actualiza) el guardián de autoría en todas las fichas.

Uso, desde la raíz del repositorio:
    python3 tools/insertar-guardian.py

- Toma el código comprimido de servidores/avisos/guardian.min.js
  (se genera a partir de guardian.js con terser).
- Sustituye el marcador de la URL por la URL /exec guardada en servidores/avisos/url.txt,
  codificada para que no aparezca a simple vista en el código de la ficha.
- Lo coloca justo antes de </body>. Si la ficha ya lo tenía, lo reemplaza.
- Se salta index.html, contacto.html, aviso-legal.html y los paneles de servidores/.
"""
import base64
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
AVISOS = RAIZ / 'servidores' / 'avisos'
EXCLUIR = {'index.html', 'contacto.html', 'aviso-legal.html'}
MARCA = '/*mm*/'
BLOQUE_RE = re.compile(r'<script>/\*mm\*/.*?</script>\n?', re.S)


def main():
    codigo = (AVISOS / 'guardian.min.js').read_text(encoding='utf-8').strip()
    url = (AVISOS / 'url.txt').read_text(encoding='utf-8').strip()
    if url and not re.fullmatch(r'https://script\.google\.com/macros/s/[\w-]+/exec', url):
        sys.exit('url.txt no contiene una URL /exec válida de Apps Script.')
    if '"__URL_AVISOS__"' not in codigo:
        sys.exit('guardian.min.js no contiene el marcador "__URL_AVISOS__".')
    valor = 'atob("%s")' % base64.b64encode(url.encode()).decode() if url else '""'
    bloque = '<script>%s%s</script>\n' % (MARCA, codigo.replace('"__URL_AVISOS__"', valor))

    cambiadas = 0
    for ruta in sorted(RAIZ.rglob('*.html')):
        rel = ruta.relative_to(RAIZ)
        if rel.parts[0] in ('servidores', '.git', 'node_modules') or str(rel) in EXCLUIR:
            continue
        html = ruta.read_text(encoding='utf-8')
        nuevo = BLOQUE_RE.sub('', html)
        pos = nuevo.lower().rfind('</body>')
        if pos == -1:
            print('  sin </body>, no se toca:', rel)
            continue
        nuevo = nuevo[:pos] + bloque + nuevo[pos:]
        if nuevo != html:
            ruta.write_text(nuevo, encoding='utf-8')
            cambiadas += 1
    print('Fichas actualizadas: %d · URL de avisos: %s' % (cambiadas, url or '(vacía: solo franja, sin avisos)'))


if __name__ == '__main__':
    main()
