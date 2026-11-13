# fichas-matamates
biblioteca con todas mis fichas interactivas y videos de matemátias

## Añadir una ficha nueva

1. Sube el archivo `.html` a la carpeta de su tema (sin espacios ni tildes en el nombre).
2. En `index.html`, copia una línea `<li>…</li>` del bloque correspondiente y cambia el enlace y el nombre.
3. Añade también la dirección en `sitemap.xml` y `llms.txt` para que buscadores e IA la encuentren.

## Generador de exámenes

La carpeta `examenes/` contiene una herramienta interna (no enlazada desde el índice ni indexada por buscadores) para montar exámenes con el encabezado del IES Castelar a partir de los ejercicios de las fichas, con su hoja de soluciones paso a paso.

Cada ficha disponible tiene su generador en `examenes/generadores/` (ecuaciones, sistemas, matrices, ecuaciones matriciales, programación lineal, radicales, racionalización, logaritmos, las cuatro fichas de límites y las cuatro de funciones: dominio, estudio de funciones racionales, interpretación de gráficas y tipos de funciones). Para incorporar una ficha nueva se añade un `registrarFicha({...})` con sus tipos de ejercicio y se enlaza el archivo en `examenes/index.html`.

## Licencia

© Marta López de Letona Sánchez. Todos los derechos reservados. Las fichas pueden usarse libremente en el aula **enlazando a la web original** (https://martamates11.github.io/fichas-matamates/). No está permitido copiarlas, alojarlas en otros sitios, modificarlas, venderlas ni usarlas para entrenar modelos de IA sin permiso escrito de la autora. Términos completos en [aviso-legal.html](aviso-legal.html).
