/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Estadística descriptiva (Bachillerato / 4.º ESO).
   Mismos tipos que la ficha estadistica/est-descriptiva.html: media aritmética, mediana, moda,
   rango, varianza, desviación típica, coeficiente de variación, cuartiles (Q1, Q2, Q3) y
   percentiles (P25, P50, P75). Mismos criterios que la ficha: varianza y desviación típica
   poblacionales (se divide entre n), mediana de un número par de datos = media de los dos
   centrales, cuartiles por mitades (si n es impar, el dato central no entra en ninguna mitad;
   Q1 y Q3 son las medianas de la mitad inferior y superior) y P25 = Q1, P50 = Me, P75 = Q3.
   Diferencias con la ficha (las reales):
   · La ficha da los datos ya ordenados y sin contexto; aquí aparecen desordenados, dentro de un
     contexto con su unidad (minutos, euros, temperaturas…), y el rango de valores depende del
     contexto en lugar de ser fijo (1-25, 2-30 o 5-30 según el tipo).
   · Para hacerlo en papel, los datos se eligen para que la media sea exacta (a lo sumo con dos
     decimales); en la varianza, la desviación y el coeficiente de variación la media es
     siempre entera y las desviaciones x - media también, así la tabla sale con números enteros.
     La ficha acepta medias con cualquier decimal en media, cuartiles y CV, y exige media entera
     solo en la tabla de frecuencias de varianza y desviación.
   · Varianza y desviación típica: la ficha pide completar a mano una tabla de seis columnas con
     datos sueltos que se agrupan; el examen da directamente la tabla x_i, f_i (con el mismo
     banco: 4 a 6 valores en progresión, frecuencias de 2 a 6) y en la solución se rellenan las
     columnas. La ficha enlaza el cálculo de la desviación con el de la varianza anterior; aquí
     cada ejercicio es independiente.
   · Coeficiente de variación: se calcula a partir de σ redondeada a tres decimales (comprobando
     que el resultado a dos decimales coincide con el de la σ exacta) y se indica también en %;
     la ficha lo pide solo como decimal.
   · Cuartiles y percentiles: la ficha elige al azar el cuartil (o el percentil 25, 50 o 75);
     aquí se hace igual, un único valor por ejercicio.
   · No hay pistas ni autocorrección: las soluciones van paso a paso con las fórmulas en TeX. */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { dec, decTxt } = pend;

  const suma = a => a.reduce((s, v) => s + v, 0);
  const asc = a => a.slice().sort((x, y) => x - y);
  const lista = a => a.join(',\\ ');                      // lista de números en TeX
  const llaves = a => `{${a.join(', ')}}`;                // lista de datos en el enunciado
  const sumandos = a => a.join(' + ');
  /* Número con coma en HTML plano; los enteros se dejan tal cual */
  const num = x => decTxt(x, 4);

  /* Tabla en blanco y negro (estilos en línea: index.html no tiene estilos de tabla) */
  const CELDA = 'border:0.25mm solid #333;padding:0.8mm 2.5mm;text-align:center;min-width:9mm;height:5.5mm';
  function tabla(cab, filas, { total = false } = {}) {
    const th = cab.map(c => `<th style="${CELDA};font-weight:600">${c}</th>`).join('');
    const tr = filas.map((f, i) => {
      const neg = total && i === filas.length - 1 ? ';font-weight:700;border-top:0.5mm solid #333' : '';
      return `<tr>${f.map(c => `<td style="${CELDA}${neg}">${c}</td>`).join('')}</tr>`;
    }).join('');
    return `<table style="border-collapse:collapse;margin:1mm 0;font-size:0.95em"><tr>${th}</tr>${tr}</table>`;
  }
  /* Tabla horizontal (para la moda): una columna por valor */
  function tablaH(x, f) {
    const fila = (cab, v) => `<tr><th style="${CELDA};font-weight:600;font-style:italic">${cab}</th>${v.map(c => `<td style="${CELDA}">${c}</td>`).join('')}</tr>`;
    return `<table style="border-collapse:collapse;margin:1mm 0;font-size:0.95em">${fila('x', x)}${fila('f', f)}</table>`;
  }
  const texto = s => `<span class="pend-texto">${s}</span>`;
  const mal = s => s.replace(/-/g, '−');

  /* ---------- Contextos de datos sueltos: [frase(n), mínimo, máximo] ---------- */
  const CONTEXTOS = [
    [n => `Los minutos que han tardado ${n} alumnos en llegar al instituto`, 5, 30],
    [n => `Las edades, en años, de ${n} participantes en un taller de teatro`, 12, 30],
    [n => `Los kilos de fruta vendidos en una frutería durante ${n} días`, 5, 30],
    [n => `Las temperaturas máximas, en grados, registradas durante ${n} días de verano`, 14, 34],
    [n => `Los puntos anotados por un jugador de baloncesto en ${n} partidos`, 2, 30],
    [n => `Los euros que han gastado ${n} clientes en una librería`, 5, 30],
    [n => `Los minutos que han dedicado ${n} estudiantes a hacer los deberes de Matemáticas`, 5, 30],
    [n => `Los clientes atendidos cada día en una panadería durante ${n} días`, 10, 30],
    [n => `Las páginas que ha leído Lucía en cada uno de los últimos ${n} días`, 4, 30],
    [n => `Los mensajes recibidos por Álvaro cada día, durante ${n} días consecutivos,`, 1, 30]
  ];
  /* n valores distintos del intervalo [lo, hi], desordenados */
  function distintos(R, n, lo, hi) {
    const v = []; for (let k = lo; k <= hi; k++) v.push(k);
    return R.shuffle(v).slice(0, n);
  }
  const ordenado = a => a.every((v, i) => !i || a[i - 1] <= v);
  /* Datos sueltos de un contexto con una condición sobre la lista */
  function datosContexto(R, cond, { distinto = true, extra } = {}) {
    const [fr, lo, hi] = R.pick(CONTEXTOS), n = R.int(6, 9);
    let d, k = 0;
    do {
      d = distintos(R, n, lo, hi);
      k++;
    } while (k < 5000 && (!cond(d, n) || ordenado(d)));
    return { d, n, frase: fr(n), lo, hi };
  }
  const enunDatos = (c, pregunta) => `<span class="pend-texto">${c.frase} son: <b>${llaves(c.d)}</b>. ${pregunta}</span>`;

  /* ================= 1. Media ================= */
  function genMedia(R) {
    const exacta = R.rand() < 0.5;
    const c = datosContexto(R, (d, n) => (exacta ? suma(d) % n === 0 : (suma(d) * 100) % n === 0 && suma(d) % n !== 0));
    const S = suma(c.d), m = S / c.n;
    return {
      html: true,
      enun: enunDatos(c, 'Calcula la media aritmética.'),
      pasos: [
        { t: `La media aritmética es la suma de todos los datos dividida entre el número de datos. Aquí hay \\(n = ${c.n}\\) datos.`, m: `\\bar{x} = \\frac{\\sum x_i}{n} = \\frac{${sumandos(c.d)}}{${c.n}}` },
        { t: `Sumamos los datos (\\(\\sum x_i = ${S}\\)) y dividimos:`, m: `\\bar{x} = \\frac{${S}}{${c.n}} = ${dec(m)}` }
      ],
      res: `\\bar{x} = ${dec(m)}`
    };
  }

  /* ================= 2. Mediana ================= */
  /* Pasos de la mediana de una lista ya ordenada (devuelve el paso y el valor) */
  function medianaDe(s, nombre = 'Me') {
    const n = s.length;
    if (n % 2) {
      const k = (n + 1) / 2;
      return { v: s[k - 1], t: `Hay ${n} datos (número impar): la mediana es el dato central, el de la posición \\(\\frac{${n}+1}{2} = ${k}\\).`, m: `${nombre} = ${s[k - 1]}` };
    }
    const k = n / 2, a = s[k - 1], b = s[k], v = (a + b) / 2;
    return { v, t: `Hay ${n} datos (número par): la mediana es la media de los dos centrales, los de las posiciones ${k} y ${k + 1}.`, m: `${nombre} = \\frac{${a} + ${b}}{2} = \\frac{${a + b}}{2} = ${dec(v)}` };
  }
  function genMediana(R) {
    const c = datosContexto(R, () => true);
    const s = asc(c.d), r = medianaDe(s);
    return {
      html: true,
      enun: enunDatos(c, 'Calcula la mediana.'),
      pasos: [
        { t: 'Para calcular la mediana primero hay que ordenar los datos de menor a mayor:', m: lista(s) },
        { t: r.t, m: r.m }
      ],
      res: `Me = ${dec(r.v)}`
    };
  }

  /* ================= 3. Moda ================= */
  /* n-1 valores distintos y uno de ellos repetido: la moda es única (como en la ficha) */
  function genModa(R) {
    const [fr, lo, hi] = R.pick(CONTEXTOS), n = R.int(6, 9);
    let d;
    do {
      const base = distintos(R, n - 1, lo, hi);
      d = R.shuffle(base.concat([R.pick(base)]));
    } while (ordenado(d));
    const s = asc(d), xs = [...new Set(s)], fs = xs.map(v => s.filter(w => w === v).length);
    const mo = xs[fs.indexOf(Math.max(...fs))];
    return {
      html: true,
      enun: enunDatos({ frase: fr(n), d }, 'Calcula la moda.'),
      pasos: [
        { t: 'La moda es el valor que más veces se repite. Contamos las veces (frecuencia \\(f\\)) que aparece cada valor:', html: tablaH(xs, fs) },
        { t: `El valor con mayor frecuencia es ${mo}, que aparece ${Math.max(...fs)} veces.`, m: `Mo = ${mo}` }
      ],
      res: `Mo = ${mo}`
    };
  }

  /* ================= 4. Rango ================= */
  function genRango(R) {
    const c = datosContexto(R, () => true);
    const mx = Math.max(...c.d), mn = Math.min(...c.d);
    return {
      html: true,
      enun: enunDatos(c, 'Calcula el rango.'),
      pasos: [
        { t: `El rango es la diferencia entre el dato mayor y el menor. El mayor es \\(x_{\\max} = ${mx}\\) y el menor es \\(x_{\\min} = ${mn}\\).` },
        { t: 'Restamos:', m: `R = x_{\\max} - x_{\\min} = ${mx} - ${mn} = ${mx - mn}` }
      ],
      res: `R = ${mx - mn}`
    };
  }

  /* ================= 5 y 6. Varianza y desviación típica (tabla de frecuencias) ================= */
  const CONTEXTOS_TABLA = [
    [N => `Una profesora ha anotado los minutos que han tardado los ${N} alumnos de su clase en terminar una prueba.`, 'Minutos', 3],
    [N => `En un concurso de preguntas, ${N} participantes han obtenido las siguientes puntuaciones.`, 'Puntos', 2],
    [N => `Una frutería ha anotado los kilos de naranjas que ha vendido a ${N} clientes.`, 'Kilos', 2],
    [N => `Se han anotado las edades de ${N} personas que asisten a un curso de cocina.`, 'Edad en años', 14],
    [N => `Un entrenador ha cronometrado los segundos que tardan ${N} nadadores en hacer un largo.`, 'Segundos', 20],
    [N => `Una biblioteca ha registrado el número de libros que han sacado ${N} socios este mes.`, 'Libros', 1]
  ];
  /* Banco de la ficha: 4 a 6 valores en progresión aritmética (paso 2 a 5) y frecuencias de 2 a 6,
     con media exacta. Se prefiere (60 %) que Σf(x-x̄)²/N tenga a lo sumo dos decimales. */
  function genTablaFrec(R, lo) {
    const quiere = R.rand() < 0.6;
    let mejor = null;
    for (let k = 0; k < 600; k++) {
      const nv = R.pick([4, 5, 6]), base = R.int(lo, lo + 8), paso = R.pick([2, 3, 4, 5]);
      const x = [], f = [];
      for (let i = 0; i < nv; i++) { x.push(base + i * paso); f.push(R.int(2, 6)); }
      const N = suma(f), S = suma(x.map((v, i) => v * f[i]));
      if (S % N) continue;
      const m = S / N, SS = suma(x.map((v, i) => f[i] * (v - m) * (v - m)));
      mejor = { x, f, N, S, m, SS };
      if (!quiere || (SS * 100) % N === 0) return mejor;
    }
    return mejor;
  }
  function pasosTabla(t) {
    const { x, f, N, S, m, SS } = t;
    const d = x.map(v => v - m), d2 = d.map(v => v * v), fd2 = d2.map((v, i) => v * f[i]);
    const filas = x.map((v, i) => [v, f[i], v * f[i], mal(String(d[i])), d2[i], fd2[i]]);
    filas.push(['Σ', N, S, '', '', SS]);
    return {
      pasos: [
        { t: `Calculamos primero la media. Añadimos la columna \\(x_i \\cdot f_i\\) y sumamos las frecuencias (\\(n = ${N}\\)) y los productos:`, m: `\\bar{x} = \\frac{\\sum x_i f_i}{n} = \\frac{${S}}{${N}} = ${dec(m)}` },
        { t: `Completamos las columnas con las desviaciones \\(x_i - \\bar{x}\\), sus cuadrados y los cuadrados multiplicados por la frecuencia:`,
          html: tabla(['\\(x_i\\)', '\\(f_i\\)', '\\(x_i \\cdot f_i\\)', '\\(x_i - \\bar{x}\\)', '\\((x_i - \\bar{x})^2\\)', '\\(f_i (x_i - \\bar{x})^2\\)'], filas, { total: true }) },
        { t: 'La varianza es la suma de la última columna dividida entre el número de datos:', m: `\\sigma^2 = \\frac{\\sum f_i (x_i - \\bar{x})^2}{n} = \\frac{${SS}}{${N}} = ${dec(SS / N, 4)}` }
      ]
    };
  }
  function enunTabla(R, t, ctx, pregunta) {
    const [fr, nombre] = ctx;
    return `<div class="pend-col">${texto(`${fr(t.N)} ${pregunta}`)}${tabla([`\\(x_i\\) (${nombre.toLowerCase()})`, '\\(f_i\\)'], t.x.map((v, i) => [v, t.f[i]]))}</div>`;
  }
  function genVarianza(R) {
    const ctx = R.pick(CONTEXTOS_TABLA), t = genTablaFrec(R, ctx[2]);
    const v = t.SS / t.N, pasos = pasosTabla(t).pasos;
    const exacta = Math.abs(v * 100 - Math.round(v * 100)) < 1e-9;
    if (!exacta) pasos.push({ t: 'Redondeamos a dos decimales:', m: `\\sigma^2 \\approx ${dec(v, 2)}` });
    return {
      html: true,
      enun: enunTabla(R, t, ctx, 'Calcula la varianza (redondea a dos decimales si no es exacta).'),
      pasos, res: exacta ? `\\sigma^2 = ${dec(v, 2)}` : `\\sigma^2 \\approx ${dec(v, 2)}`
    };
  }
  function genDesv(R) {
    const ctx = R.pick(CONTEXTOS_TABLA), t = genTablaFrec(R, ctx[2]);
    const v = t.SS / t.N, s = Math.sqrt(v), pasos = pasosTabla(t).pasos;
    const sq = Math.round(s * 100) / 100;
    const exacta = Math.abs(s - sq) < 1e-9;
    pasos.push({ t: 'La desviación típica es la raíz cuadrada de la varianza:', m: `\\sigma = \\sqrt{\\sigma^2} = \\sqrt{${dec(v, 4)}} ${exacta ? '=' : '\\approx'} ${dec(s, 2)}` });
    return {
      html: true,
      enun: enunTabla(R, t, ctx, 'Calcula la desviación típica (redondea a dos decimales si no es exacta).'),
      pasos, res: `\\sigma ${exacta ? '=' : '\\approx'} ${dec(s, 2)}`
    };
  }

  /* ================= 7. Coeficiente de variación ================= */
  function genCV(R) {
    const c = datosContexto(R, (d, n) => {
      if (suma(d) % n) return false;
      const m = suma(d) / n, SS = suma(d.map(v => (v - m) * (v - m))), s = Math.sqrt(SS / n);
      const s3 = Math.round(s * 1000) / 1000;
      return Math.round(s / m * 100) === Math.round(s3 / m * 100) && Math.round(s / m * 100) > 0;
    });
    const n = c.n, m = suma(c.d) / n, dd = c.d.map(v => v - m), d2 = dd.map(v => v * v), SS = suma(d2);
    const s = Math.sqrt(SS / n), s3 = Math.round(s * 1000) / 1000, cv = Math.round(s3 / m * 100) / 100;
    const ex = Math.abs(s - s3) < 1e-9;
    const filas = c.d.map((v, i) => [v, mal(String(dd[i])), d2[i]]).concat([['Σ', '', SS]]);
    return {
      html: true,
      enun: enunDatos(c, 'Calcula el coeficiente de variación (con dos decimales).'),
      pasos: [
        { t: `La media es la suma de los datos entre \\(n = ${n}\\):`, m: `\\bar{x} = \\frac{${sumandos(c.d)}}{${n}} = \\frac{${suma(c.d)}}{${n}} = ${m}` },
        { t: 'Hallamos las desviaciones respecto de la media, sus cuadrados y los sumamos:', html: tabla(['\\(x_i\\)', '\\(x_i - \\bar{x}\\)', '\\((x_i - \\bar{x})^2\\)'], filas, { total: true }) },
        { t: 'Varianza y desviación típica (se divide entre \\(n\\)):', m: `\\sigma^2 = \\frac{${SS}}{${n}} = ${dec(SS / n, 4)} \\qquad \\sigma = \\sqrt{${dec(SS / n, 4)}} ${ex ? '=' : '\\approx'} ${dec(s3, 3)}`, multilinea: false },
        { t: 'El coeficiente de variación es el cociente entre la desviación típica y la media:', m: `CV = \\frac{\\sigma}{\\bar{x}} = \\frac{${dec(s3, 3)}}{${m}} \\approx ${dec(cv, 2)}` },
        { t: `Dicho en porcentaje, la dispersión es de aproximadamente un ${decTxt(cv * 100, 0)} %.` }
      ],
      res: `CV \\approx ${dec(cv, 2)}`,
      resHtml: `\\(CV \\approx ${dec(cv, 2)}\\), es decir, un ${decTxt(cv * 100, 0)} %`
    };
  }

  /* ================= 8 y 9. Cuartiles y percentiles ================= */
  /* Criterio de la ficha: mitades de los datos ordenados; si n es impar, el dato central no
     entra en ninguna. Devuelve los pasos de cálculo del cuartil q (1, 2 o 3). */
  function pasosCuartil(s, q) {
    const n = s.length, mid = Math.floor(n / 2);
    const inf = s.slice(0, mid), sup = s.slice(n % 2 ? mid + 1 : mid);
    const pasos = [{ t: 'Ordenamos los datos de menor a mayor:', m: lista(s) }];
    if (q === 2) {
      const r = medianaDe(s, 'Q_2 = Me');
      pasos.push({ t: `El segundo cuartil coincide con la mediana. ${r.t}`, m: r.m });
      return { pasos, v: r.v, nombre: 'Q_2' };
    }
    const mitad = q === 1 ? inf : sup, cual = q === 1 ? 'inferior' : 'superior';
    pasos.push({
      t: n % 2
        ? `Como \\(n = ${n}\\) es impar, el dato central (${s[mid]}) no se incluye en ninguna mitad. Dividimos el resto en dos mitades de ${mid} datos:`
        : `Como \\(n = ${n}\\) es par, dividimos los datos en dos mitades de ${mid} datos:`,
      m: `\\underbrace{${lista(inf)}}_{\\text{mitad inferior}}${n % 2 ? `,\\ \\boxed{${s[mid]}},\\ ` : ',\\ '}\\underbrace{${lista(sup)}}_{\\text{mitad superior}}`
    });
    const r = medianaDe(mitad, `Q_${q}`);
    pasos.push({
      t: `\\(Q_${q}\\) es la mediana de la mitad ${cual}. ${r.t.replace('Hay ' + mitad.length + ' datos', 'Esta mitad tiene ' + mitad.length + ' datos')}`,
      m: r.m
    });
    return { pasos, v: r.v, nombre: `Q_${q}` };
  }
  function genCuartil(R) {
    const c = datosContexto(R, () => true), q = R.pick([1, 2, 3]);
    const r = pasosCuartil(asc(c.d), q);
    return {
      html: true,
      enun: enunDatos(c, `Calcula el cuartil \\(Q_${q}\\).`),
      pasos: r.pasos, res: `Q_${q} = ${dec(r.v)}`
    };
  }
  function genPercentil(R) {
    const c = datosContexto(R, () => true), p = R.pick([25, 50, 75]), q = p / 25;
    const r = pasosCuartil(asc(c.d), q);
    const eq = q === 2 ? 'Me' : `Q_${q}`;
    const pasos = [{ t: `Los cuartiles dividen los datos en cuatro partes iguales, así que \\(P_{${p}} = ${q === 2 ? 'Q_2 = Me' : eq}\\) (deja por debajo el ${p} % de los datos).` }, ...r.pasos];
    return {
      html: true,
      enun: enunDatos(c, `Calcula el percentil \\(P_{${p}}\\).`),
      pasos, res: `P_{${p}} = ${dec(r.v)}`
    };
  }

  registrarFicha({
    id: 'est-descriptiva',
    titulo: 'Estadística descriptiva',
    detalle: 'Media, mediana, moda, cuartiles y desviación',
    grupo: 'Estadística',
    enlace: '../estadistica/est-descriptiva.html',
    ejercicios: [
      { id: 'media', nombre: 'Media aritmética', peso: 0.75, columnas: 2,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genMedia },
      { id: 'mediana', nombre: 'Mediana', peso: 0.75, columnas: 2,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genMediana },
      { id: 'moda', nombre: 'Moda', peso: 0.5, columnas: 2,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genModa },
      { id: 'rango', nombre: 'Rango', peso: 0.5, columnas: 2,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genRango },
      { id: 'varianza', nombre: 'Varianza (tabla de frecuencias)', peso: 1.25, columnas: 1,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genVarianza },
      { id: 'desv', nombre: 'Desviación típica (tabla de frecuencias)', peso: 1.25, columnas: 1,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genDesv },
      { id: 'cv', nombre: 'Coeficiente de variación', peso: 1.25, columnas: 1,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genCV },
      { id: 'cuartil', nombre: 'Cuartiles', peso: 1, columnas: 2,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genCuartil },
      { id: 'percentil', nombre: 'Percentiles', peso: 1, columnas: 2,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genPercentil }
    ]
  });
})();
