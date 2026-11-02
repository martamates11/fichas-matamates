# Servidor del «Reto entre alumnos» · La Isla de las Fracciones

Apps Script que recoge las partidas del reto en una hoja de Google y sirve el panel en directo.

- `Codigo.gs` → se pega en `Código.gs` del proyecto de Apps Script.
- `Panel.html` → archivo HTML del proyecto llamado exactamente `Panel`.
- `appsscript.json` → manifiesto (zona horaria, ejecutar como la propietaria, acceso para cualquier usuario).

Una vez implementado como aplicación web, la URL `/exec` se pega en
`const URL_DUELOS = '…';` de `adaptaciones/fracciones.html`. Con esa misma URL se abre el panel.

Configuración (bloque `CONFIG` de `Codigo.gs`): 10 preguntas; zonas Equivalencias, Cantidades,
Sumas, Multiplicar y Dividir (mismo orden que `RETO_NOMBRES` en la ficha); tiempo mínimo 20 s.
Cada cambio del script exige *Implementar › Gestionar implementaciones › Nueva versión*.
