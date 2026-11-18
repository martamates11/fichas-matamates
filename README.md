# fichas-matamates
biblioteca con todas mis fichas interactivas y videos de matemátias

## Añadir una ficha nueva

1. Sube el archivo `.html` a la carpeta de su tema (sin espacios ni tildes en el nombre).
2. En `index.html`, copia una línea `<li>…</li>` del bloque correspondiente y cambia el enlace y el nombre.
3. Añade también la dirección en `sitemap.xml` y `llms.txt` para que buscadores e IA la encuentren.

## Generador de exámenes

La carpeta `examenes/` contiene una herramienta interna (no enlazada desde el índice ni indexada por buscadores) para montar exámenes con el encabezado del IES Castelar a partir de los ejercicios de las fichas, con su hoja de soluciones paso a paso.

Cada ficha disponible tiene su generador en `examenes/generadores/` (ecuaciones, sistemas, matrices, ecuaciones matriciales, programación lineal, radicales, racionalización, logaritmos, las cuatro fichas de límites y las cuatro de funciones: dominio, estudio de funciones racionales, interpretación de gráficas y tipos de funciones; las cuatro de derivadas, las tres de integrales y las cuatro de matemática financiera: interés simple, interés compuesto, anualidades de capitalización y anualidades de amortización; y las cinco de probabilidad, agrupadas como «Probabilidad y combinatoria»: probabilidad, probabilidad de sucesos en contexto, diagramas de árbol, tablas de contingencia y combinatoria; y la distribución binomial, como «Distribuciones de probabilidad», que añade al examen una hoja anexa con la tabla completa de la binomial). Una ficha puede aportar hojas anexas con `anexo: () => [html, …]` en su `registrarFicha`: cada elemento es un folio que se ve debajo del examen y se imprime detrás de él, una sola vez aunque haya varios ejercicios de esa ficha. Para incorporar una ficha nueva se añade un `registrarFicha({...})` con sus tipos de ejercicio y se enlaza el archivo en `examenes/index.html`.

Las fichas de recuperación de pendientes (`pendientes/primero`, `segundo` y `tercero`) tienen sus generadores en `examenes/generadores/pendientes/`, uno por ficha, con el nombre del archivo de la ficha. Todos usan `pendientes/figuras.js` (decimales con coma y figuras SVG en blanco y negro con cotas) y se agrupan en el catálogo como «Recuperación de 1.º ESO», «Recuperación de 2.º ESO» y «Recuperación de 3.º ESO». Están enlazados los 34 generadores (11 de 1.º, 13 de 2.º y 10 de 3.º, 238 tipos de ejercicio). Cada archivo explica en su comentario de cabecera en qué se diferencia de su ficha (datos ajustados para resolver el examen sin calculadora, más variedad, etc.).

Para probar un generador: `node tools/probar-generador.js pendientes/<archivo>.js` (estrés con miles de semillas y capturas del examen y las soluciones).

## Licencia

© Marta López de Letona Sánchez. Todos los derechos reservados. Las fichas pueden usarse libremente en el aula **enlazando a la web original** (https://martamates11.github.io/fichas-matamates/). No está permitido copiarlas, alojarlas en otros sitios, modificarlas, venderlas ni usarlas para entrenar modelos de IA sin permiso escrito de la autora. Términos completos en [aviso-legal.html](aviso-legal.html).
