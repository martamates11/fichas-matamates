/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Estadística (pendientes de 2.º ESO).
   Bancos, contextos y rangos de la ficha pendientes/segundo/estadistica-2.html, con dos
   ajustes pensados para hacer el examen sin calculadora (aplicados también en la ficha):
   en la tabla de frecuencias el total N es 10, 20 o 25, así que las frecuencias relativas
   son decimales exactos, y en los ejercicios de media los datos dan una media exacta con
   dos decimales como mucho. */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { dec, decTxt, Lienzo } = pend;

  const suma = a => a.reduce((s, v) => s + v, 0);
  const lista = arr => arr.length > 1 ? arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1] : arr[0];
  const minus = s => s.charAt(0).toLowerCase() + s.slice(1);

  /* Tabla en blanco y negro para el examen (estilos en línea: index.html no tiene estilos de tabla) */
  const CELDA = 'border:0.25mm solid #333;padding:0.8mm 2.5mm;text-align:center;min-width:9mm;height:5.5mm';
  function tabla(cab, filas) {
    const th = cab.map(c => `<th style="${CELDA};font-weight:600;font-style:italic">${c}</th>`).join('');
    const tr = filas.map(f => `<tr>${f.map((c, j) => `<td style="${CELDA}${j === 0 && typeof c === 'string' && isNaN(c) ? ';text-align:left' : ''}">${c}</td>`).join('')}</tr>`).join('');
    return `<table style="border-collapse:collapse;margin:1mm 0;font-size:0.95em"><tr>${th}</tr>${tr}</table>`;
  }

  /* Reparte total en partes enteras entre lo y hi */
  function repartir(R, total, partes, lo, hi) {
    const a = new Array(partes).fill(lo);
    let resto = total - partes * lo;
    while (resto > 0) { const k = R.int(0, partes - 1); if (a[k] < hi) { a[k]++; resto--; } }
    return a;
  }

  /* ================= 1. Variables cualitativas y cuantitativas ================= */
  const BANCO = [
    ['El color del pelo.', 0], ['Los valores de la tirada de un dado.', 1], ['Las causas de los incendios forestales.', 0],
    ['La estatura de un determinado colectivo.', 1], ['Las notas obtenidas en un examen.', 1], ['La marca de coche que prefieren tus compañeros.', 0],
    ['El número de hermanos de cada alumno.', 1], ['El deporte favorito de los estudiantes.', 0], ['El peso de los paquetes enviados por una empresa.', 1],
    ['El estado civil de los trabajadores de una fábrica.', 0], ['El número de goles marcados en un partido.', 1], ['La profesión de los padres de los alumnos.', 0],
    ['El tiempo, en minutos, que se tarda en llegar al instituto.', 1], ['El tipo de música preferido.', 0], ['El número de libros leídos en un mes.', 1],
    ['La nacionalidad de los turistas de un hotel.', 0], ['La temperatura registrada cada día de agosto.', 1], ['El medio de transporte utilizado para ir al trabajo.', 0],
    ['El número de mensajes enviados al día.', 1], ['El color de ojos de un grupo de personas.', 0]
  ];
  const TIPO = ['cualitativa', 'cuantitativa'];
  function genVariables(R) {
    let it;
    do { it = R.shuffle(BANCO).slice(0, 4); } while (it.every(v => v[1] === it[0][1]));
    return {
      html: true,
      enun: `<span class="pend-texto">${it.map((v, k) => `${k + 1}. ${v[0]}`).join('<br>')}</span>`,
      pasos: [
        { t: 'Una variable es <b>cualitativa</b> si sus valores son cualidades o categorías, y <b>cuantitativa</b> si se expresa con números que miden o cuentan algo.' },
        ...it.map((v, k) => ({ t: `${k + 1}. ${v[0].replace(/\.$/, '')}: <b>${TIPO[v[1]]}</b> (${v[1] ? 'se mide o se cuenta con un número' : 'es una cualidad, no un número'}).` }))
      ],
      res: `\\text{${it.map((v, k) => `${k + 1}. ${TIPO[v[1]]}`).join(',\\; ')}}`,
      resHtml: it.map((v, k) => `${k + 1}. ${TIPO[v[1]]}`).join(' · ')
    };
  }

  /* ================= 2. Tabla de frecuencias ================= */
  const CONTEXTOS_TABLA = [
    ['Gloria ha estado esperando a su amiga y se ha entretenido anotando el color del vestido de las chicas que pasaban delante de ella.', ['Rojo', 'Azul', 'Verde', 'Negro']],
    ['En una heladería han anotado el sabor de helado elegido por los últimos clientes.', ['Fresa', 'Chocolate', 'Vainilla', 'Limón']],
    ['Un profesor ha anotado el medio de transporte que usan sus alumnos para llegar al instituto.', ['Andando', 'Autobús', 'Bicicleta', 'Coche']],
    ['En un cine se ha registrado el género de película elegido por los espectadores de una sesión.', ['Comedia', 'Terror', 'Acción', 'Drama']],
    ['En una tienda de mascotas se ha anotado el tipo de animal que compraban los clientes en una semana.', ['Perro', 'Gato', 'Pez', 'Pájaro']]
  ];
  function genTabla(R) {
    const [ctx, cats] = R.pick(CONTEXTOS_TABLA);
    const N = R.pick([10, 20, 25]);
    const f = repartir(R, N, 4, 2, 9);
    const F = [], h = [], H = [];
    f.forEach((v, i) => { F.push((F[i - 1] || 0) + v); h.push(v / N); H.push(F[i] / N); });
    const datos = lista(cats.map((c, i) => `${minus(c)}, ${f[i]}`));
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${ctx} Los resultados han sido: ${datos}. Completa la tabla de frecuencias.</span>${tabla(['x', 'f', 'F', 'h', 'H'], cats.map(c => [c, '', '', '', '']))}</div>`,
      pasos: [
        { t: `La frecuencia absoluta \\(f\\) es el dato de cada categoría; el total es \\(N = ${f.join(' + ')} = ${N}\\).` },
        { t: `La frecuencia acumulada \\(F\\) se obtiene sumando las \\(f\\) hasta esa fila; la relativa es \\(h = \\frac{f}{N}\\) (aquí, entre ${N}), y \\(H = \\frac{F}{N}\\) es la relativa acumulada. La última \\(F\\) es ${N} y la última \\(H\\) es 1.`,
          html: tabla(['x', 'f', 'F', 'h', 'H'], cats.map((c, i) => [c, f[i], F[i], decTxt(h[i]), decTxt(H[i])]).concat([['Total', N, '', '1', '']])) }
      ],
      res: `N = ${N};\\quad h: ${h.map(v => dec(v)).join(';\\ ')}`,
      resHtml: `\\(N = ${N}\\). \\(F\\): ${F.join('; ')}. \\(h\\): ${h.map(v => decTxt(v)).join('; ')}. \\(H\\): ${H.map(v => decTxt(v)).join('; ')}.`
    };
  }

  /* ================= 3. Diagrama de sectores ================= */
  const CONTEXTOS_SECTORES = [
    ['Un grupo de 2.º ESO ha votado su fruta favorita.', ['Manzana', 'Plátano', 'Fresa']],
    ['En una clase se ha preguntado por la asignatura favorita.', ['Matemáticas', 'Lengua', 'Ed. Física']],
    ['Se ha preguntado a un grupo de vecinos qué mascota tienen.', ['Perro', 'Gato', 'Ninguna']],
    ['Un grupo de amigos ha elegido su estación del año favorita.', ['Verano', 'Invierno', 'Primavera']],
    ['Se ha preguntado por el medio de transporte favorito para viajar.', ['Avión', 'Tren', 'Coche']]
  ];
  function sectores(cats, grados) {
    const L = Lienzo(), r = 52, rad = g => (g - 90) * Math.PI / 180;
    let a0 = 0;
    grados.forEach((g, i) => {
      const pts = [[0, 0]];
      for (let a = a0; a < a0 + g; a += 3) pts.push([r * Math.cos(rad(a)), r * Math.sin(rad(a))]);
      pts.push([r * Math.cos(rad(a0 + g)), r * Math.sin(rad(a0 + g))]);
      L.poligono(pts, { relleno: ['#fff', '#e4e4e4', '#bdbdbd'][i % 3], grosor: 1.2 });
      a0 += g;
    });
    a0 = 0;
    grados.forEach((g, i) => {
      const m = rad(a0 + g / 2), nx = Math.cos(m), ny = Math.sin(m);
      L.rotulo(r * nx, r * ny, nx, ny, `${cats[i]} (${g}°)`, 11, 5);
      a0 += g;
    });
    return L.cerrar('pend-fig', 'Diagrama de sectores');
  }
  function genSectores(R) {
    const [ctx, cats] = R.pick(CONTEXTOS_SECTORES);
    const N = R.pick([9, 10, 12, 15, 18, 20]);
    const f = repartir(R, N, 3, 1, N);
    const k = 360 / N, g = f.map(v => v * k);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${ctx} Calcula el total de datos y los grados que corresponden a cada sector, y dibuja el diagrama de sectores.</span>${tabla(['x', 'f'], cats.map((c, i) => [c, f[i]]))}</div>`,
      pasos: [
        { t: 'El total de datos es la suma de las frecuencias:', m: `N = ${f.join(' + ')} = ${N}` },
        { t: `Los ${N} datos ocupan los 360° del círculo, así que a cada dato le corresponden \\(360° : ${N} = ${k}°\\). Cada sector mide \\(f \\cdot ${k}°\\):`, m: cats.map((c, i) => `\\text{${c}: } ${f[i]} \\cdot ${k}° = ${g[i]}°`).join(' \\qquad ') },
        { t: `Comprobación: \\(${g.join('° + ')}° = 360°\\). Con el transportador se dibuja cada ángulo:`, html: sectores(cats, g) }
      ],
      res: `N = ${N};\\quad ` + cats.map((c, i) => `\\text{${c}: } ${g[i]}°`).join(',\\; ')
    };
  }

  /* ================= 4. Gráfico de barras ================= */
  /* Ficha: cuatro valores; aquí y en la ficha, entre 2 y 9 (con 1 salían frases como «1 familias») */
  const CONTEXTOS_BARRAS = [
    { cats: ['Canarias', 'Baleares', 'Pirineos', 'C. Valenciana'], eje: 'Familias',
      frase: v => `Rodríguez está muy contento con su nueva agencia de viajes. En la primera semana ha gestionado las vacaciones de ${v[0]} familias que irán a las islas Canarias; ${v[1]} han preferido las Baleares, ${v[2]} han optado por los Pirineos y ${v[3]} prefieren la Costa Valenciana.` },
    { cats: ['Novela', 'Cómic', 'Poesía', 'Ensayo'], eje: 'Libros',
      frase: v => `Esta semana la librería del barrio ha vendido ${v[0]} novelas, ${v[1]} cómics, ${v[2]} libros de poesía y ${v[3]} ensayos.` },
    { cats: ['Fútbol', 'Baloncesto', 'Natación', 'Atletismo'], eje: 'Alumnos',
      frase: v => `En el polideportivo se han apuntado ${v[0]} alumnos a fútbol, ${v[1]} a baloncesto, ${v[2]} a natación y ${v[3]} a atletismo.` },
    { cats: ['Manzanas', 'Naranjas', 'Plátanos', 'Peras'], eje: 'Kilos',
      frase: v => `Hoy la frutería ha vendido ${v[0]} kilos de manzanas, ${v[1]} de naranjas, ${v[2]} de plátanos y ${v[3]} de peras.` }
  ];
  /* Diagrama de barras: eje vertical de 0 a max, una unidad cada u px */
  function barras(cats, valores, max, { u = 11, sep = 58, ancho = 24, eje = '', tam = 11 } = {}) {
    const L = Lienzo(), H = max * u, W = cats.length * sep;
    for (let g = 0; g <= max; g++) {
      L.linea(0, -g * u, W, -g * u, { trazo: '#bbb', grosor: 0.5 });
      L.texto(-5, -g * u + 3.5, String(g), { ancla: 'end', tam: 9.5 });
    }
    L.linea(0, 0, W + 4, 0, { grosor: 1.2 }).linea(0, 0, 0, -H - 6, { grosor: 1.2 });
    if (eje) L.texto(0, -H - 10, eje, { ancla: 'middle', tam: 10, cursiva: true });
    cats.forEach((c, i) => {
      const x = sep * (i + 0.5);
      if (valores) L.poligono([[x - ancho / 2, 0], [x + ancho / 2, 0], [x + ancho / 2, -valores[i] * u], [x - ancho / 2, -valores[i] * u]], { relleno: '#d6d6d6', grosor: 1 });
      L.texto(x, 14, c, { tam });
    });
    return L.cerrar('pend-fig', 'Diagrama de barras');
  }
  function genBarras(R) {
    const c = R.pick(CONTEXTOS_BARRAS);
    const v = c.cats.map(() => R.int(2, 9));
    return {
      html: true,
      enun: `<span class="pend-texto">${c.frase(v)}</span>`,
      pasos: [
        { t: `En el eje horizontal van las categorías y en el vertical la frecuencia, con una escala que llegue al menos hasta ${Math.max(...v)}. La altura de cada barra es su frecuencia:`,
          html: barras(c.cats, v, 10, { eje: c.eje }) }
      ],
      res: `\\text{${c.cats.map((k, i) => `${k}: ${v[i]}`).join(',\\; ')}}`,
      resHtml: `Barras de altura ${c.cats.map((k, i) => `${k}, ${v[i]}`).join('; ')}.`
    };
  }

  /* ================= 5 y 6. Media ================= */
  /* Media exacta con dos decimales como máximo: Σxf · 100 debe ser múltiplo de N */
  function datosMedia(R, x, fmax) {
    let f;
    do { f = x.map(() => R.int(1, fmax)); } while ((suma(x.map((v, i) => v * f[i])) * 100) % suma(f) !== 0);
    return f;
  }
  function pasosMedia(x, f, intro) {
    const xf = x.map((v, i) => v * f[i]), N = suma(f), S = suma(xf), media = S / N;
    return {
      pasos: [
        ...intro,
        { t: 'Añadimos la columna \\(x \\cdot f\\) y sumamos las columnas:',
          html: tabla(['x', 'f', 'x · f'], x.map((v, i) => [v, f[i], xf[i]]).concat([['Total', N, S]])) },
        { t: 'La media es la suma de los productos entre el número total de datos:', m: `\\bar{x} = \\frac{\\sum x \\cdot f}{N} = \\frac{${S}}{${N}} = ${dec(media)}` }
      ],
      res: `\\bar{x} = ${dec(media)}`
    };
  }
  const CONTEXTOS_MEDIA = [
    ['En una clase se ha preguntado a los alumnos cuántos hermanos tiene cada uno.', 'número de hermanos', [0, 1, 2, 3, 4]],
    ['Se ha anotado el número de goles marcados por un equipo en sus últimos partidos.', 'goles marcados', [0, 1, 2, 3, 4]],
    ['Un grupo de amigos ha contado cuántos libros ha leído cada uno este trimestre.', 'libros leídos', [1, 2, 3, 4, 5]],
    ['En una encuesta se ha preguntado cuántas horas semanales dedican los alumnos al deporte.', 'horas de deporte', [1, 2, 3, 4, 5]]
  ];
  function genMedia(R) {
    const [ctx, variable, x] = R.pick(CONTEXTOS_MEDIA);
    const f = datosMedia(R, x, 9);
    const s = pasosMedia(x, f, []);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${ctx} Calcula la media.</span>${tabla([variable, 'f'], x.map((v, i) => [v, f[i]]))}</div>`,
      pasos: s.pasos, res: s.res
    };
  }
  const CONTEXTOS_MEDIA_GRAFICO = [
    ['El gráfico muestra el número de goles marcados en cada partido de una temporada.', 'Partidos', 'Goles', [0, 1, 2, 3]],
    ['El gráfico muestra el número de días de lluvia registrados cada semana de un mes.', 'Semanas', 'Días de lluvia', [1, 2, 3, 4]],
    ['El gráfico muestra el número de hermanos de los alumnos de una clase.', 'Alumnos', 'Hermanos', [0, 1, 2, 3]],
    ['El gráfico muestra el número de veces que un grupo de amigos ha ido al cine este mes.', 'Amigos', 'Veces', [0, 1, 2, 3]]
  ];
  function genMediaGrafico(R) {
    const [ctx, ejeY, ejeX, x] = R.pick(CONTEXTOS_MEDIA_GRAFICO);
    const f = datosMedia(R, x, 8);
    const graf = barras(x.map(String), f, 8, { u: 10, sep: 30, ancho: 16, eje: ejeY, tam: 11 });
    const s = pasosMedia(x, f, [{ t: `Leemos en el gráfico la frecuencia de cada valor (${ejeX.toLowerCase()}: ${x.join(', ')}).` }]);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${ctx} Construye la tabla de frecuencias y calcula la media.</span>${graf}<span class="pend-nota">En el eje horizontal: ${ejeX.toLowerCase()}.</span></div>`,
      pasos: s.pasos, res: s.res
    };
  }

  registrarFicha({
    id: 'pend2-estadistica',
    titulo: 'Estadística',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/estadistica-2.html',
    ejercicios: [
      { id: 'variables', nombre: 'Variables cualitativas y cuantitativas', peso: 0.75, columnas: 2,
        enunciado: ['Indica si cada variable estadística es cualitativa o cuantitativa:', 'Indica si cada variable estadística es cualitativa o cuantitativa:'], generar: genVariables },
      { id: 'tabla', nombre: 'Tabla de frecuencias', peso: 1.25, columnas: 1,
        enunciado: ['Resuelve:', 'Resuelve:'], generar: genTabla },
      { id: 'sectores', nombre: 'Diagrama de sectores', peso: 1.25, columnas: 1,
        enunciado: ['Resuelve:', 'Resuelve:'], generar: genSectores },
      { id: 'barras', nombre: 'Gráfico de barras', peso: 1, columnas: 1,
        enunciado: ['Representa los datos en un diagrama de barras:', 'Representa los datos de cada apartado en un diagrama de barras:'], generar: genBarras },
      { id: 'media', nombre: 'Media (tabla dada)', peso: 1, columnas: 2,
        enunciado: ['Resuelve:', 'Resuelve:'], generar: genMedia },
      { id: 'media-grafico', nombre: 'Media a partir de un gráfico', peso: 1.25, columnas: 2,
        enunciado: ['Resuelve:', 'Resuelve:'], generar: genMediaGrafico }
    ]
  });
})();
