# Avisos de copias · Martamates

Cuando una ficha se abre alojada fuera de `martamates11.github.io`, aparece una franja de autoría
y llega un aviso a este Apps Script, que lo anota en una hoja y envía un e-mail a
marta11@educarex.es (uno por dominio y día; máximo 20 al día).

| Situación | Franja | Se anota | E-mail |
|---|---|---|---|
| Tu web, abierta normalmente | no | no | no |
| Archivo guardado en el ordenador (`file://`) | no | no | no |
| Tu web incrustada en otra página (iframe) | no | sí | no |
| Copia alojada en otro dominio | sí | sí | sí |

## Archivos

- `Codigo.gs` → se pega en `Código.gs` del proyecto de Apps Script.
- `appsscript.json` → manifiesto (zona horaria, ejecutar como la propietaria, acceso para cualquiera).
- `guardian.js` → código legible que va en las fichas. `guardian.min.js` es su versión comprimida.
- `url.txt` → URL `/exec` de la aplicación web.

## Poner en marcha

1. Crea una hoja de cálculo nueva en Google Drive (p. ej. «Avisos Martamates»).
2. *Extensiones › Apps Script*. Borra lo que haya y pega `Codigo.gs`.
3. Ejecuta la función `probarAviso` (botón ▶), concede los permisos y comprueba que llega el e-mail de prueba.
4. *Implementar › Nueva implementación › Aplicación web*: ejecutar como «Yo», acceso «Cualquier usuario».
5. Copia la URL que termina en `/exec` en `url.txt` y ejecuta, desde la raíz del repositorio:
   `python3 tools/insertar-guardian.py`

## Fichas nuevas o cambios en el guardián

- Ficha nueva: ejecuta `python3 tools/insertar-guardian.py` (no duplica nada en las que ya lo tienen).
- Cambio en `guardian.js`: regenera `guardian.min.js` con
  `npx terser servidores/avisos/guardian.js -c -m --comments false -o servidores/avisos/guardian.min.js`
  y vuelve a ejecutar el script.
