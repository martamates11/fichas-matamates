/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Estadística unidimensional (media, varianza, desviación típica y
   coeficiente de variación de una variable discreta dada en una tabla de frecuencias).
   Mismos conceptos y convenios que la ficha estadistica/est-media-varianz.html: tabla con
   x (valor) y f (frecuencia absoluta); media x̄ = Σ x·f / N; varianza POBLACIONAL
   σ² = Σ f·(x − x̄)² / N (se divide entre N, no entre N − 1); desviación típica σ = √σ²;
   coeficiente de variación CV = σ / |x̄|, en tanto por uno (y también en porcentaje).
   Las soluciones usan la misma tabla de cálculo que la ficha (x, f, x·f, x − x̄, (x − x̄)²,
   f·(x − x̄)²). Tipos: media, varianza y desviación típica, coeficiente de variación y el
   ejercicio completo de la ficha (los cuatro apartados encadenados).
   Diferencias con la ficha:
   · La ficha tiene 5 tablas fijas, sin contexto; aquí cada examen genera una tabla nueva
     (4 o 5 valores consecutivos de una progresión aritmética, como en la ficha, con N entre 16
     y 26) y la presenta en una situación real (10 contextos: notas, hermanos, goles, libros,
     horas de deporte, tallas de calzado, minutos de trayecto, edades, temperaturas, puntos).
   · Las frecuencias se eligen para que la media salga exacta con dos decimales como mucho y la
     varianza también (la ficha acepta cualquier resultado con tolerancia de 0,01). La
     desviación típica se pide redondeada a dos decimales y el CV a tres (en tanto por uno),
     lo que se indica en el enunciado; la ficha admite ±0,05 en σ y ±0,005 en el CV.
   · Se separan los apartados en tipos independientes: en «Varianza y desviación típica» se da
     la media (en la ficha se obtiene antes) y en «Coeficiente de variación» se dan x̄ y σ.
   · «Coeficiente de variación» incluye, además, un tipo de enunciado que la ficha no tiene:
     comparar dos distribuciones por su CV para decidir cuál es más homogénea.
   · En las soluciones de la varianza y del ejercicio completo se añade una comprobación con la
     fórmula equivalente σ² = Σ x²·f / N − x̄² (la ficha solo usa la definición). */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { dec, decTxt } = pend;

  const suma = a => a.reduce((s, v) => s + v, 0);

  /* ---------- Formato exacto a partir de enteros escalados ----------
     v / 10^k escrito con coma, sin ceros finales; tex: coma TeX y signo menos «-» */
  function fe(v, k, tex) {
    const neg = v < 0;
    let s = String(Math.abs(v));
    while (s.length <= k) s = '0' + s;
    const ent = s.slice(0, s.length - k), d = k ? s.slice(s.length - k).replace(/0+$/, '') : '';
    const r = ent + (d ? (tex ? '{,}' : ',') + d : '');
    return neg ? (tex ? '-' : '−') + r : r;
  }
  const T = (v, k) => fe(v, k, true);    // TeX
  const H = (v, k) => fe(v, k, false);   // texto / HTML
  const mdr = s => `<span style="text-decoration:overline">${s}</span>`;
  const XM = mdr('x');                   // x̄ en HTML

  /* Tabla en blanco y negro para el examen (estilos en línea: index.html no tiene estilos de tabla) */
  const CELDA = 'border:0.25mm solid #333;padding:0.8mm 2.5mm;text-align:center;min-width:9mm;height:5.5mm';
  function tabla(cab, filas, { ancho = '9mm', pie = false } = {}) {
    const th = cab.map(c => `<th style="${CELDA};font-weight:600;font-style:italic">${c}</th>`).join('');
    const tr = filas.map((f, i) => {
      const ult = pie && i === filas.length - 1;
      return `<tr>${f.map(c => `<td style="${CELDA};min-width:${ancho}${ult ? ';font-weight:600' : ''}">${c}</td>`).join('')}</tr>`;
    }).join('');
    return `<table style="border-collapse:collapse;margin:1mm 0;font-size:0.95em"><tr>${th}</tr>${tr}</table>`;
  }

  /* ---------- Contextos (variable discreta) ----------
     x = ini + paso·i. dist: de qué trata el estudio (para el tipo «CV»); m: rango de la media
     en ese enunciado; dm, ds: decimales de la media y de la desviación que se dan. */
  const CONTEXTOS = [
    { intro: 'Las notas de un grupo de alumnos en un examen de Matemáticas se han recogido en esta tabla.', cab: 'Nota',
      ini: [2, 3, 4], paso: 1, dist: 'las notas de un grupo de alumnos en un examen', m: [4.5, 8], dm: 1, ds: 2 },
    { intro: 'Se ha preguntado a los alumnos de una clase cuántos hermanos tiene cada uno.', cab: 'Hermanos',
      ini: [0, 1], paso: 1, dist: 'el número de hermanos de los alumnos de una clase', m: [1, 3], dm: 1, ds: 2 },
    { intro: 'Se ha anotado el número de goles que ha marcado un equipo en cada partido de la temporada.', cab: 'Goles',
      ini: [0, 1], paso: 1, dist: 'el número de goles por partido de un equipo', m: [1, 3], dm: 1, ds: 2 },
    { intro: 'Un grupo de amigos ha contado cuántos libros ha leído cada uno durante el trimestre.', cab: 'Libros',
      ini: [1, 2, 3], paso: 1, dist: 'el número de libros leídos por un grupo de amigos', m: [2, 6], dm: 1, ds: 2 },
    { intro: 'En una encuesta se ha preguntado cuántas horas semanales dedican al deporte los alumnos de un instituto.', cab: 'Horas',
      ini: [1, 2, 3], paso: 2, dist: 'las horas semanales de deporte de los alumnos de un instituto', m: [3, 8], dm: 1, ds: 2 },
    { intro: 'Una zapatería ha anotado el número de calzado de los pares vendidos en un día.', cab: 'Número de calzado',
      ini: [36, 37, 38], paso: 1, dist: 'el número de calzado de los pares vendidos en una zapatería', m: [37.5, 41], dm: 1, ds: 2 },
    { intro: 'Se ha medido el tiempo, en minutos, que tardan en llegar al instituto los alumnos de un grupo.', cab: 'Minutos',
      ini: [10, 15], paso: 5, dist: 'el tiempo, en minutos, que tardan en llegar al instituto los alumnos de un grupo', m: [15, 35], dm: 1, ds: 2 },
    { intro: 'Se han recogido las edades, en años, de los socios de un club de ajedrez.', cab: 'Edad (años)',
      ini: [10, 12, 14], paso: 2, dist: 'las edades, en años, de los socios de un club de ajedrez', m: [12, 20], dm: 1, ds: 2 },
    { intro: 'Se ha anotado la temperatura máxima, en grados centígrados, de los días de un mes de verano.', cab: 'Temperatura (°C)',
      ini: [24, 26, 28], paso: 2, dist: 'la temperatura máxima, en grados centígrados, de los días de un mes de verano', m: [26, 34], dm: 1, ds: 2 },
    { intro: 'Se han registrado los puntos anotados por un equipo de baloncesto en sus partidos de liga.', cab: 'Puntos',
      ini: [60, 65, 70], paso: 5, dist: 'los puntos anotados por un equipo de baloncesto en cada partido', m: [65, 85], dm: 1, ds: 2 }
  ];

  /* ---------- Generación de una distribución «limpia» ----------
     Todo con enteros escalados: m100 = 100·x̄, T4 = Σ f·(100x − m100)² (en unidades de 10⁻⁴) y
     v100 = 100·σ². Se exige media y varianza con dos decimales como mucho, y que el redondeo
     de σ (2 decimales) y del CV (3 decimales) no quede cerca de un empate. */
  const frac = x => x - Math.floor(x);
  function datos(R, c) {
    for (let t = 0; t < 20000; t++) {
      const n = R.pick([4, 5]), ini = R.pick(c.ini);
      const x = Array.from({ length: n }, (_, i) => ini + c.paso * i);
      const f = x.map(() => R.int(1, 9));
      const N = suma(f);
      if (N < 16 || N > 26) continue;
      const S = suma(x.map((v, i) => v * f[i]));
      if ((S * 100) % N) continue;
      const m100 = S * 100 / N;
      const T4 = suma(x.map((v, i) => f[i] * Math.pow(v * 100 - m100, 2)));
      if (T4 % (N * 100)) continue;
      const v100 = T4 / (N * 100);
      if (v100 === 0) continue;
      const varz = v100 / 100, sg = Math.sqrt(varz), media = m100 / 100;
      if (Math.abs(frac(sg * 100) - 0.5) < 0.06) continue;
      const sr = Math.round(sg * 100) / 100;
      const cv = sg / media;
      if (Math.abs(frac(cv * 1000) - 0.5) < 0.08) continue;
      const cvr = Math.round(cv * 1000);
      if (Math.round(sr / media * 1000) !== cvr) continue;
      return { x, f, N, S, m100, T4, v100, sg, sr100: Math.round(sg * 100), cv1000: cvr, Q: suma(x.map((v, i) => v * v * f[i])) };
    }
    throw new Error('Sin distribución válida');
  }

  /* x̄ = S/N en TeX (sin repetir si la división es entera) */
  function texMedia(d) {
    const v = T(d.m100, 2);
    return `\\bar{x} = \\frac{\\sum x_i f_i}{N} = \\frac{${d.S}}{${d.N}} = ${v}`;
  }
  const texSigma = d => {
    const exacta = Math.abs(d.sg * 100 - d.sr100) < 1e-9;
    return `\\sigma = \\sqrt{\\sigma^2} = \\sqrt{${T(d.v100, 2)}} ${exacta ? '=' : '\\approx'} ${T(d.sr100, 2)}`;
  };
  /* Frase de la tabla de datos con su contexto */
  function enunTabla(c, d, preguntas) {
    const tb = tabla([`${c.cab} (x)`, 'Frecuencia (f)'], d.x.map((v, i) => [v, d.f[i]]), { ancho: '18mm' });
    return `<div class="pend-col"><span class="pend-texto">${c.intro} ${preguntas}</span>${tb}</div>`;
  }

  /* ---------- Bloques de solución ---------- */
  function pasoMedia(d) {
    const xf = d.x.map((v, i) => v * d.f[i]);
    return [
      { t: 'La media es la suma de todos los datos entre el número de datos. Como cada valor \\(x_i\\) se repite \\(f_i\\) veces, añadimos la columna \\(x_i \\cdot f_i\\) y sumamos las columnas (\\(N\\) es el total de datos):',
        html: tabla(['x', 'f', 'x · f'], d.x.map((v, i) => [v, d.f[i], xf[i]]).concat([['Σ', d.N, d.S]]), { pie: true }) },
      { t: `Aplicamos la fórmula con \\(N = ${d.N}\\) y \\(\\sum x_i f_i = ${d.S}\\):`, m: texMedia(d) }
    ];
  }
  function pasoVarianza(d, conMedia) {
    const dif = d.x.map(v => v * 100 - d.m100);
    const filas = d.x.map((v, i) => [v, d.f[i], H(dif[i], 2), H(dif[i] * dif[i], 4), H(d.f[i] * dif[i] * dif[i], 4)])
      .concat([['Σ', d.N, '', '', H(d.T4, 4)]]);
    const pasos = [
      { t: 'La varianza es la media de los cuadrados de las desviaciones respecto de la media. Es la varianza poblacional: se divide entre \\(N\\) (no entre \\(N-1\\)).',
        m: '\\sigma^2 = \\frac{\\sum f_i\\,(x_i - \\bar{x})^2}{N}' },
      { t: `Con \\(\\bar{x} = ${T(d.m100, 2)}\\), calculamos en una tabla las diferencias \\(x - \\bar{x}\\), sus cuadrados y los productos por \\(f\\):`,
        html: tabla(['x', 'f', `x − ${XM}`, `(x − ${XM})²`, `f · (x − ${XM})²`], filas, { pie: true }) },
      { t: `Dividimos la suma entre \\(N = ${d.N}\\):`, m: `\\sigma^2 = \\frac{${T(d.T4, 4)}}{${d.N}} = ${T(d.v100, 2)}` }
    ];
    return pasos;
  }
  function pasoComprobacion(d) {
    const qn4 = d.v100 * 100 + d.m100 * d.m100;      // Q/N en unidades de 10⁻⁴
    return { t: 'Comprobación con la fórmula equivalente \\(\\sigma^2 = \\dfrac{\\sum x_i^2 f_i}{N} - \\bar{x}^2\\):',
      m: `\\sigma^2 = \\frac{${d.Q}}{${d.N}} - ${T(d.m100, 2)}^2 = ${T(qn4, 4)} - ${T(d.m100 * d.m100, 4)} = ${T(d.v100, 2)}` };
  }
  function pasoSigma(d) {
    return { t: 'La desviación típica es la raíz cuadrada de la varianza (tiene las mismas unidades que los datos):', m: texSigma(d) };
  }
  /* «=» si el cociente es exacto con tres decimales, «≈» si no */
  const sg = (s100, m100, c1000) => (c1000 * m100 === 1000 * s100 ? '=' : '\\approx');
  function pasoCV(sr100, m100, c1000, extra, pre) {
    return { t: `${pre || ''}El coeficiente de variación es el cociente entre la desviación típica y el valor absoluto de la media${extra || ''}. No tiene unidades, y multiplicado por 100 se expresa en porcentaje:`,
      m: `CV = \\frac{\\sigma}{|\\bar{x}|} = \\frac{${T(sr100, 2)}}{${T(m100, 2)}} ${sg(sr100, m100, c1000)} ${T(c1000, 3)} = ${T(c1000, 1)}\\,\\%` };
  }

  /* ================= 1. Media ================= */
  function genMedia(R) {
    const c = R.pick(CONTEXTOS), d = datos(R, c);
    return {
      html: true,
      enun: enunTabla(c, d, 'Calcula la media.'),
      pasos: pasoMedia(d),
      res: `\\bar{x} = ${T(d.m100, 2)}`
    };
  }

  /* ================= 2. Varianza y desviación típica ================= */
  function genVarianza(R) {
    const c = R.pick(CONTEXTOS), d = datos(R, c);
    return {
      html: true,
      enun: enunTabla(c, d, `La media de la distribución es \\(\\bar{x} = ${T(d.m100, 2)}\\). Calcula la varianza y la desviación típica (redondea la desviación típica a dos decimales).`),
      pasos: [...pasoVarianza(d), pasoComprobacion(d), pasoSigma(d)],
      res: `\\sigma^2 = ${T(d.v100, 2)}, \\quad \\sigma ${Math.abs(d.sg * 100 - d.sr100) < 1e-9 ? '=' : '\\approx'} ${T(d.sr100, 2)}`
    };
  }

  /* ================= 3. Coeficiente de variación ================= */
  /* Redondeos con enteros: devuelve {m100, s100, c1000} a partir de la media m y la desviación s */
  function dosDistribuciones(R, cm) {
    for (let t = 0; t < 5000; t++) {
      const vals = cm.grupos.map(() => {
        const media = cm.m[0] + R.rand() * (cm.m[1] - cm.m[0]);
        const cvObj = 0.07 + R.rand() * 0.33;
        const k = Math.pow(10, cm.dm), kd = Math.pow(10, cm.ds);
        const m = Math.round(media * k) / k;
        const s = Math.round(cvObj * m * kd) / kd;
        return { m, s, cv: s / m };
      });
      const [a, b] = vals;
      if (a.s <= 0 || b.s <= 0 || a.s === b.s) continue;
      if (Math.abs(a.m - b.m) / Math.max(a.m, b.m) < 0.25) continue;
      if (Math.abs(a.cv - b.cv) < 0.04) continue;
      if (vals.some(v => Math.abs(frac(v.cv * 1000) - 0.5) < 0.08)) continue;
      const trampa = (a.s > b.s) !== (a.cv > b.cv);
      if (cm.trampa !== undefined && trampa !== cm.trampa && t < 4000) continue;
      return vals;
    }
    throw new Error('Sin pareja válida');
  }
  const COMPARACIONES = [
    { intro: 'Dos clases han hecho el mismo examen de Matemáticas. Se han calculado la media y la desviación típica de las notas de cada una:',
      grupos: ['la clase A', 'la clase B'], m: [4.5, 8], dm: 1, ds: 2, u: '', pregunta: 'más homogénea' },
    { intro: 'Se comparan los puntos por partido de dos equipos de baloncesto durante la temporada:',
      grupos: ['el equipo A', 'el equipo B'], m: [55, 95], dm: 1, ds: 1, u: '', pregunta: 'más regular' },
    { intro: 'Se comparan las ventas diarias, en euros, de dos tiendas:',
      grupos: ['la tienda A', 'la tienda B'], m: [200, 900], dm: 0, ds: 0, u: ' €', pregunta: 'más regular' },
    { intro: 'Dos máquinas llenan paquetes de arroz. Se ha estudiado el peso de los paquetes, en gramos, que produce cada una:',
      grupos: ['la máquina A', 'la máquina B'], m: [250, 1000], dm: 0, ds: 1, u: ' g', pregunta: 'más precisa' },
    { intro: 'Dos corredores han anotado el tiempo, en minutos, que tardan en recorrer su circuito de entrenamiento:',
      grupos: ['el corredor A', 'el corredor B'], m: [20, 60], dm: 1, ds: 2, u: ' min', pregunta: 'más regular' },
    { intro: 'Se ha medido la altura, en centímetros, de las plantas de dos variedades de tomate:',
      grupos: ['la variedad A', 'la variedad B'], m: [40, 150], dm: 1, ds: 1, u: ' cm', pregunta: 'más homogénea' }
  ];
  /* Número con coma y los decimales fijos de cada contexto (TeX y texto) */
  const nd = (x, d) => ({ t: dec(x, d), h: decTxt(x, d) });
  const SIGLA = ['A', 'B'];

  function genCV(R) {
    if (R.rand() < 0.5) {
      /* Variante 1: media y desviación dadas, se pide el CV */
      const c = R.pick(CONTEXTOS);
      let m, s, cv;
      for (let t = 0; t < 1000; t++) {
        const k = Math.pow(10, c.dm), kd = Math.pow(10, c.ds);
        m = Math.round((c.m[0] + R.rand() * (c.m[1] - c.m[0])) * k) / k;
        s = Math.round((0.07 + R.rand() * 0.33) * m * kd) / kd;
        cv = s / m;
        if (s > 0 && Math.abs(frac(cv * 1000) - 0.5) >= 0.08) break;
      }
      const m100 = Math.round(m * 100), s100 = Math.round(s * 100), c1000 = Math.round(cv * 1000);
      return {
        html: true,
        enun: `<span class="pend-texto">En un estudio sobre ${c.dist} se han obtenido una media \\(\\bar{x} = ${dec(m, 2)}\\) y una desviación típica \\(\\sigma = ${dec(s, 2)}\\). Calcula el coeficiente de variación (en tanto por uno, con tres decimales, y en porcentaje).</span>`,
        pasos: [pasoCV(s100, m100, c1000)],
        res: `CV ${sg(s100, m100, c1000)} ${T(c1000, 3)} = ${T(c1000, 1)}\\,\\%`
      };
    }
    /* Variante 2: comparar dos distribuciones por su CV */
    const cm = R.pick(COMPARACIONES);
    const cmx = Object.assign({}, cm, { trampa: R.rand() < 0.5 });
    const [a, b] = dosDistribuciones(R, cmx);
    const info = [a, b].map(v => ({ m100: Math.round(v.m * 100), s100: Math.round(v.s * 100), c1000: Math.round(v.cv * 1000), ...v }));
    const mejor = info[0].cv < info[1].cv ? 0 : 1, peor = 1 - mejor;
    const txt = v => `\\(\\bar{x} = ${dec(v.m, 2)}\\), \\(\\sigma = ${dec(v.s, 2)}\\)`;
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    const g = cm.grupos;
    const mayorSigma = info[0].s > info[1].s ? 0 : 1;
    const nota = mayorSigma === mejor
      ? `Fíjate en que ${g[mejor]} tiene la desviación típica mayor, pero también la media mayor: por eso su dispersión relativa es menor. Conviene comparar el CV y no solo \\(\\sigma\\).`
      : `${cap(g[mejor])} tiene la desviación típica menor y, además, el CV menor.`;
    const enun = `<div class="pend-col"><span class="pend-texto">${cm.intro}</span>`
      + tabla(['', `${XM}`, 'σ'], info.map((v, i) => [cap(g[i]), decTxt(v.m, 2) + cm.u, decTxt(v.s, 2) + cm.u]), { ancho: '18mm' })
      + `<span class="pend-texto">Calcula el coeficiente de variación de cada distribución (en tanto por uno, con tres decimales) y decide cuál es ${cm.pregunta}.</span></div>`;
    return {
      html: true,
      enun,
      pasos: [
        { t: 'El coeficiente de variación mide la dispersión relativa, es decir, en proporción a la media, y no tiene unidades. Por eso sirve para comparar distribuciones con medias distintas:', m: 'CV = \\frac{\\sigma}{|\\bar{x}|}' },
        { t: `Calculamos el CV de cada distribución:`, multilinea: true,
          m: info.map((v, i) => `CV_{${SIGLA[i]}} = \\frac{${dec(v.s, 2)}}{${dec(v.m, 2)}} ${sg(v.s100, v.m100, v.c1000)} ${T(v.c1000, 3)} = ${T(v.c1000, 1)}\\,\\%`).join(' \\\\ ') },
        { t: `Tiene menor dispersión relativa la distribución de menor CV: \\(${T(info[mejor].c1000, 3)} < ${T(info[peor].c1000, 3)}\\). Por tanto, es ${cm.pregunta} ${g[mejor]}. ${nota}` }
      ],
      res: `CV_A ${sg(info[0].s100, info[0].m100, info[0].c1000)} ${T(info[0].c1000, 3)},\\quad CV_B ${sg(info[1].s100, info[1].m100, info[1].c1000)} ${T(info[1].c1000, 3)}`,
      resHtml: `\\(CV_A ${sg(info[0].s100, info[0].m100, info[0].c1000)} ${T(info[0].c1000, 3)}\\) y \\(CV_B ${sg(info[1].s100, info[1].m100, info[1].c1000)} ${T(info[1].c1000, 3)}\\). Es ${cm.pregunta} ${g[mejor]}.`
    };
  }

  /* ================= 4. Ejercicio completo ================= */
  function genCompleto(R) {
    const c = R.pick(CONTEXTOS), d = datos(R, c);
    const xf = d.x.map((v, i) => v * d.f[i]);
    const dif = d.x.map(v => v * 100 - d.m100);
    const filas = d.x.map((v, i) => [v, d.f[i], xf[i], H(dif[i], 2), H(dif[i] * dif[i], 4), H(d.f[i] * dif[i] * dif[i], 4)])
      .concat([['Σ', d.N, d.S, '', '', H(d.T4, 4)]]);
    const exacta = Math.abs(d.sg * 100 - d.sr100) < 1e-9;
    const preguntas = ['Calcula la media.', 'Calcula la varianza.', 'Calcula la desviación típica (redondeada a dos decimales).',
      'Calcula el coeficiente de variación (en tanto por uno, con tres decimales, y en porcentaje).'];
    const tb = tabla([`${c.cab} (x)`, 'Frecuencia (f)'], d.x.map((v, i) => [v, d.f[i]]), { ancho: '18mm' });
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${c.intro} A partir de la tabla:<br>${preguntas.map((q, k) => `${k + 1}) ${q}`).join('<br>')}</span>${tb}</div>`,
      pasos: [
        { t: '1) La media es la suma de los datos entre el número de datos. Con la columna \\(x \\cdot f\\) (en la tabla de más abajo) obtenemos \\(N = ' + d.N + '\\) y \\(\\sum x_i f_i = ' + d.S + '\\):', m: texMedia(d) },
        { t: '2) Con la media, completamos la tabla: diferencias \\(x - \\bar{x}\\), sus cuadrados y los productos por \\(f\\). La varianza (poblacional) es la suma de la última columna dividida entre \\(N\\), no entre \\(N-1\\):',
          html: tabla(['x', 'f', 'x · f', `x − ${XM}`, `(x − ${XM})²`, `f · (x − ${XM})²`], filas, { pie: true }),
          m: `\\sigma^2 = \\frac{\\sum f_i\\,(x_i - \\bar{x})^2}{N} = \\frac{${T(d.T4, 4)}}{${d.N}} = ${T(d.v100, 2)}` },
        pasoComprobacion(d),
        { t: '3) La desviación típica es la raíz cuadrada de la varianza:', m: texSigma(d) },
        pasoCV(d.sr100, d.m100, d.cv1000, null, '4) ')
      ],
      res: `\\bar{x} = ${T(d.m100, 2)},\\; \\sigma^2 = ${T(d.v100, 2)},\\; \\sigma ${exacta ? '=' : '\\approx'} ${T(d.sr100, 2)},\\; CV ${sg(d.sr100, d.m100, d.cv1000)} ${T(d.cv1000, 3)} = ${T(d.cv1000, 1)}\\,\\%`
    };
  }

  registrarFicha({
    id: 'est-media-varianz',
    titulo: 'Estadística unidimensional',
    detalle: 'Media, varianza, desviación típica y coeficiente de variación',
    grupo: 'Estadística',
    enlace: '../estadistica/est-media-varianz.html',
    ejercicios: [
      { id: 'media', nombre: 'Media', peso: 1, columnas: 2,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genMedia },
      { id: 'varianza', nombre: 'Varianza y desviación típica', peso: 1.5, columnas: 1,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genVarianza },
      { id: 'cv', nombre: 'Coeficiente de variación', peso: 1, columnas: 1,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genCV },
      { id: 'completo', nombre: 'Media, varianza, desviación típica y CV', peso: 2.5, columnas: 1,
        enunciado: ['Resuelve el siguiente ejercicio:', 'Resuelve los siguientes ejercicios:'], generar: genCompleto }
    ]
  });
})();
