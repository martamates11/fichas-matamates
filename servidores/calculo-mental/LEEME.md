# Servidor del «Duelo galáctico» · Cálculo mental

Apps Script que recoge las partidas del duelo en una hoja de Google y sirve el panel en directo.

- `Codigo.gs` → se pega en `Código.gs` del proyecto de Apps Script.
- `Panel.html` → archivo HTML del proyecto llamado exactamente `Panel`.
- `appsscript.json` → manifiesto (zona horaria, ejecutar como la propietaria, acceso para cualquier usuario).

Una vez implementado como aplicación web, la URL `/exec` se pega en
`const URL_DUELOS = '…';` de `adaptaciones/calculo-mental.html`. Con esa misma URL se abre el panel.

Configuración (bloque `CONFIG` de `Codigo.gs`): 12 preguntas; familias Amigos del 10, Amigos del 20,
Amigos del 100, Amigos del 1000, Decimales, Tríos, Dobles, Objetivos y Múltiplos (mismo orden que
`FAMILIAS` en la ficha); tiempo mínimo 20 s.
Cada cambio del script exige *Implementar › Gestionar implementaciones › Nueva versión*.
