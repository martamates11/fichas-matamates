/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Tablas de contingencia (Probabilidad y combinatoria).
   Mismos tipos y contextos que la ficha probabilidad/tabla-contingencia.html: a partir de los
   datos de un enunciado se completa una tabla de doble entrada 2×2 con sus totales y se
   responden cinco preguntas (suceso contrario, probabilidad total, probabilidad condicionada,
   unión/intersección e independencia).
   Diferencias con la ficha: en lugar de 15 ejercicios fijos, cada examen genera números nuevos
   (población de 200 a 1000 y frecuencias «redondas») para que las cuentas se hagan sin
   calculadora; las probabilidades se piden como fracción irreducible (con su decimal cuando es
   exacto). Se separa la ficha en tres tipos: solo la tabla, solo las preguntas (tabla dada) y el
   ejercicio completo. En la pregunta 5 se alternan casos de sucesos independientes y
   dependientes, y en las preguntas 3 y 4 se añaden condiciones sobre el suceso contrario
   («sabiendo que no…», «solo uno de los dos»), que en la ficha aparecen solo en algunos
   ejercicios. */
(function () {
  'use strict';
  const { registrarFicha, fr } = window.EX;
  const { frac } = window.EX.tex;

  /* ---------- Formato ---------- */
  /* Decimal exacto con coma en TeX (null si la fracción no tiene expansión decimal finita) */
  function decExacto(a, b) {
    const f = fr(a, b);
    let d = f.d, c2 = 0, c5 = 0;
    while (d % 2 === 0) { d /= 2; c2++; }
    while (d % 5 === 0) { d /= 5; c5++; }
    if (d !== 1) return null;
    const k = Math.max(c2, c5);
    const esc = f.n * Math.pow(10, k) / f.d;          // entero exacto (números pequeños)
    let s = String(Math.round(esc));
    if (k === 0) return s;
    while (s.length <= k) s = '0' + s;
    return s.slice(0, s.length - k) + '{,}' + s.slice(s.length - k);
  }
  /* a/b = fracción irreducible = decimal (solo se escribe lo que aporta algo nuevo) */
  function fs(a, b) {
    const f = fr(a, b);
    let t = `\\frac{${a}}{${b}}`;
    if (f.n !== a || f.d !== b) t += ` = ${frac(f)}`;
    const d = decExacto(a, b);
    if (d !== null && f.d !== 1) t += ` = ${d}`;
    return t;
  }
  /* Resultado final: irreducible y decimal si es exacto */
  function F(a, b) {
    const f = fr(a, b), d = decExacto(a, b);
    return frac(f) + (d !== null && f.d !== 1 ? ` = ${d}` : '');
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const numeradas = arr => `<span class="pend-texto">${arr.map((q, k) => `${k + 1}. ${q}`).join('<br>')}</span>`;

  /* ---------- Contextos (los de la ficha, con las acciones en tres formas) ---------- */
  /* pl: tercera persona del plural; s: singular; sj: subjuntivo singular («de que…»). */
  const CONTEXTOS = [
    { marco: N => `En un instituto hay ${N} estudiantes`, un: 'un estudiante',
      A: { pl: 'practican deporte', s: 'practica deporte', sj: 'practique deporte' },
      B: { pl: 'aprueban Matemáticas', s: 'aprueba Matemáticas', sj: 'apruebe Matemáticas' } },
    { marco: N => `Se ha preguntado a ${N} personas de una ciudad cómo se desplazan`, un: 'una persona', fem: true,
      A: { pl: 'usan el transporte público', s: 'usa el transporte público', sj: 'use el transporte público' },
      B: { pl: 'llegan puntuales', s: 'llega puntual', sj: 'llegue puntual' } },
    { marco: N => `Una clínica ha analizado a ${N} pacientes`, un: 'un paciente',
      A: { pl: 'fuman', s: 'fuma', sj: 'fume' },
      B: { pl: 'tienen hipertensión', s: 'tiene hipertensión', sj: 'tenga hipertensión' } },
    { marco: N => `Se ha realizado una encuesta a ${N} jóvenes`, un: 'un joven',
      A: { pl: 'usan Instagram', s: 'usa Instagram', sj: 'use Instagram' },
      B: { pl: 'usan Facebook', s: 'usa Facebook', sj: 'use Facebook' } },
    { marco: N => `En un barrio hay ${N} hogares`, un: 'un hogar',
      A: { pl: 'tienen perro', s: 'tiene perro', sj: 'tenga perro' },
      B: { pl: 'tienen gato', s: 'tiene gato', sj: 'tenga gato' } },
    { marco: N => `Se ha encuestado a ${N} personas sobre sus bebidas habituales`, un: 'una persona', fem: true,
      A: { pl: 'toman café', s: 'toma café', sj: 'tome café' },
      B: { pl: 'toman té', s: 'toma té', sj: 'tome té' } },
    { marco: N => `Se ha estudiado la situación de ${N} personas adultas de una localidad`, un: 'una persona', fem: true,
      A: { pl: 'tienen título universitario', s: 'tiene título universitario', sj: 'tenga título universitario' },
      B: { pl: 'tienen empleo', s: 'tiene empleo', sj: 'tenga empleo' } },
    { marco: N => `Una empresa tiene ${N} empleados`, un: 'un empleado',
      A: { pl: 'trabajan en remoto', s: 'trabaja en remoto', sj: 'trabaje en remoto' },
      B: { pl: 'están satisfechos', s: 'está satisfecho', sj: 'esté satisfecho' } },
    { marco: N => `A un concierto asisten ${N} personas`, un: 'una persona', fem: true,
      A: { pl: 'escuchan rock', s: 'escucha rock', sj: 'escuche rock' },
      B: { pl: 'escuchan pop', s: 'escucha pop', sj: 'escuche pop' } }
  ];

  /* ---------- Datos de la tabla ---------- */
  /* Población N de 200 a 1000; A = a/10 de N y B = b/10 de N; A∩B es múltiplo de N/50
     (así todas las probabilidades de la tabla tienen decimal exacto). Todas las celdas ≥ 1. */
  function datos(R) {
    const N = R.pick([200, 250, 300, 400, 500, 600, 800, 1000]);
    const s = N / 50;
    for (let intento = 0; intento < 200; intento++) {
      const a = R.int(3, 7), b = R.int(2, 7);
      const A = N / 10 * a, B = N / 10 * b;
      const indep = R.rand() < 0.3 && (a * b) % 2 === 0;
      const k = indep ? a * b / 2 : R.int(1, Math.floor(Math.min(A, B) / s));
      const AB = s * k;
      if (!indep && 2 * k === a * b) continue;
      if (AB < 1 || A - AB < 1 || B - AB < 1 || N - A - B + AB < 1) continue;
      return { N, A, B, AB };
    }
    return { N: 200, A: 100, B: 80, AB: 50 };
  }
  /* Tabla completa: c[i][j], i = A / no A, j = B / no B */
  function tabla({ N, A, B, AB }) {
    return { N, rowT: [A, N - A], colT: [B, N - B], c: [[AB, A - AB], [B - AB, N - A - B + AB]] };
  }

  /* ---------- Tabla HTML sobria (blanco y negro) ---------- */
  const BORDE = 'border:.3mm solid #000;';
  function tablaHTML(ctx, T, vacia) {
    const th = t => `<th style="${BORDE}padding:1.2mm 3mm;font-weight:600;text-align:center">${t}</th>`;
    const td = (v, neg) => `<td style="${BORDE}padding:1.2mm 3mm;text-align:center;min-width:19mm;height:7mm${neg ? ';font-weight:600' : ''}">${vacia ? '' : v}</td>`;
    const rh = t => `<td style="${BORDE}padding:1.2mm 3mm;font-weight:600;text-align:left">${t}</td>`;
    const fila = (lab, v, tot) => `<tr>${rh(lab)}${td(v[0])}${td(v[1])}${td(tot, true)}</tr>`;
    return `<table style="border-collapse:collapse;font-size:.95em;margin:1mm 0"><thead><tr><th style="padding:1.2mm 3mm"></th>${th(cap(ctx.B.s))}${th('No ' + ctx.B.s)}${th('Total')}</tr></thead><tbody>`
      + fila(cap(ctx.A.s), T.c[0], T.rowT[0])
      + fila('No ' + ctx.A.s, T.c[1], T.rowT[1])
      + `<tr>${rh('Total')}${td(T.colT[0], true)}${td(T.colT[1], true)}${td(T.N, true)}</tr></tbody></table>`;
  }

  /* ---------- Sucesos y frases ---------- */
  /* Un suceso es { at: 'A' | 'B', neg: bool } */
  const sj = (ctx, e) => (e.neg ? 'no ' : '') + ctx[e.at].sj;
  const ind = (ctx, e) => (e.neg ? 'no ' : '') + ctx[e.at].s;
  const sim = e => (e.neg ? `\\overline{${e.at}}` : e.at);
  const tot = (T, e) => (e.at === 'A' ? T.rowT : T.colT)[e.neg ? 1 : 0];
  const celda = (T, e1, e2) => {                       // intersección de dos sucesos de atributos distintos
    const ea = e1.at === 'A' ? e1 : e2, eb = e1.at === 'A' ? e2 : e1;
    return T.c[ea.neg ? 1 : 0][eb.neg ? 1 : 0];
  };
  const otro = at => (at === 'A' ? 'B' : 'A');
  const interSim = (e1, e2) => { const ea = e1.at === 'A' ? e1 : e2, eb = e1.at === 'A' ? e2 : e1; return `${sim(ea)} \\cap ${sim(eb)}`; };

  /* ---------- Las cinco preguntas ---------- */
  function preguntas(R, ctx, T) {
    const { N } = T;
    const at1 = R.pick(['A', 'B']);
    const qs = [];

    /* 1. Suceso contrario */
    {
      const e = { at: at1, neg: true }, d = { at: at1, neg: false };
      const fav = tot(T, e);
      qs.push({
        txt: `La probabilidad de que ${sj(ctx, e)}.`,
        paso: { t: `Es el suceso contrario de «${ind(ctx, d)}». Casos favorables: ${fav} (fila o columna «No»); casos posibles: ${N}. También vale \\(1 - P(${sim(d)})\\).`,
          m: `P(${sim(e)}) = ${fs(fav, N)}` },
        res: F(fav, N)
      });
    }
    /* 2. Probabilidad de un suceso (marginal) */
    {
      const e = { at: otro(at1), neg: false }, fav = tot(T, e);
      qs.push({
        txt: `La probabilidad de que ${sj(ctx, e)}.`,
        paso: { t: `Casos favorables: los que ${ctx[e.at].pl} (${fav}); casos posibles: ${N}.`, m: `P(${sim(e)}) = ${fs(fav, N)}` },
        res: F(fav, N)
      });
    }
    /* 3. Probabilidad condicionada */
    {
      const ax = R.pick(['A', 'B']);
      const x = { at: ax, neg: false }, y = { at: otro(ax), neg: R.rand() < 0.35 };
      const fav = celda(T, x, y), pos = tot(T, y);
      qs.push({
        txt: `La probabilidad de que ${sj(ctx, x)}, sabiendo que ${ind(ctx, y)}.`,
        paso: { t: `Nos quedamos solo con los casos en que ${ind(ctx, y)}: ${pos}. De ellos, ${fav} cumplen también «${ind(ctx, x)}».`,
          m: `P(${sim(x)} \\mid ${sim(y)}) = \\frac{P(${interSim(x, y)})}{P(${sim(y)})} = ${fs(fav, pos)}` },
        res: F(fav, pos)
      });
    }
    /* 4. Unión, intersección, ninguno o solo uno */
    {
      const tipo = R.pick(['union', 'inter', 'ninguno', 'solo']);
      const eA = { at: 'A', neg: false }, eB = { at: 'B', neg: false };
      let txt, paso, fav;
      if (tipo === 'union') {
        fav = T.rowT[0] + T.colT[0] - T.c[0][0];
        txt = `La probabilidad de que ${sj(ctx, eA)} o ${sj(ctx, eB)} (o ambas cosas).`;
        paso = { t: `Unión de sucesos: sumamos los dos totales y restamos la intersección, que se ha contado dos veces. (Otra forma: \\(${N} - ${T.c[1][1]}\\), quitando los que no cumplen ninguno.)`,
          m: `P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = \\frac{${T.rowT[0]} + ${T.colT[0]} - ${T.c[0][0]}}{${N}} = ${fs(fav, N)}` };
      } else if (tipo === 'inter') {
        fav = T.c[0][0];
        txt = `La probabilidad de que ${sj(ctx, eA)} y ${sj(ctx, eB)}.`;
        paso = { t: `Es la intersección: la celda donde se cruzan «${ind(ctx, eA)}» y «${ind(ctx, eB)}» (${fav} casos).`, m: `P(A \\cap B) = ${fs(fav, N)}` };
      } else if (tipo === 'ninguno') {
        fav = T.c[1][1];
        txt = `La probabilidad de que no ${ctx.A.sj} ni ${ctx.B.sj}.`;
        paso = { t: `Es la celda donde se cruzan «No ${ctx.A.s}» y «No ${ctx.B.s}» (${fav} casos).`, m: `P(\\overline{A} \\cap \\overline{B}) = ${fs(fav, N)}` };
      } else {
        const sa = R.pick(['A', 'B']);
        const e1 = { at: sa, neg: false }, e2 = { at: otro(sa), neg: true };
        fav = celda(T, e1, e2);
        txt = `La probabilidad de que ${sj(ctx, e1)} pero ${sj(ctx, e2)}.`;
        paso = { t: `Es la celda donde se cruzan «${ind(ctx, e1)}» y «${ind(ctx, e2)}» (${fav} casos).`, m: `P(${interSim(e1, e2)}) = ${fs(fav, N)}` };
      }
      qs.push({ txt, paso, res: F(fav, N) });
    }
    /* 5. Independencia */
    {
      const A = T.rowT[0], B = T.colT[0], AB = T.c[0][0];
      const indep = A * B === N * AB;
      const dA = decExacto(A, N), dB = decExacto(B, N), dAB = decExacto(AB, N), dP = decExacto(A * B, N * N);
      qs.push({
        txt: `¿Son independientes los sucesos «${ctx.A.s}» y «${ctx.B.s}»? Justifica la respuesta.`,
        paso: { t: `Dos sucesos son independientes si \\(P(A \\cap B) = P(A) \\cdot P(B)\\). Calculamos cada probabilidad y comparamos:`,
          m: `P(A) = \\frac{${A}}{${N}} = ${dA} \\qquad P(B) = \\frac{${B}}{${N}} = ${dB} \\\\ P(A) \\cdot P(B) = ${dA} \\cdot ${dB} = ${dP} \\\\ P(A \\cap B) = \\frac{${AB}}{${N}} = ${dAB} \\\\ ${dP} ${indep ? '=' : '\\neq'} ${dAB}`,
          multilinea: true,
          extra: indep ? 'Los dos valores coinciden: los sucesos son independientes.' : 'Los dos valores no coinciden: los sucesos son dependientes.' },
        res: indep ? '\\text{Sí}' : '\\text{No}'
      });
    }
    return qs;
  }
  /* Pasos de solución de las preguntas */
  function pasosPreguntas(ctx, qs) {
    const pasos = [{ t: `Llamamos \\(A\\) al suceso «${ctx.A.s}» y \\(B\\) al suceso «${ctx.B.s}». Para cada pregunta se usa la regla de Laplace sobre los datos de la tabla.` }];
    qs.forEach((q, k) => {
      pasos.push({ t: `${k + 1}. ${q.paso.t}`, m: q.paso.m, multilinea: q.paso.multilinea });
      if (q.paso.extra) pasos.push({ t: q.paso.extra });
    });
    return pasos;
  }
  const resumen = qs => qs.map((q, k) => `${k + 1})\\ ${q.res}`).join(',\\quad ');
  const enunPreguntas = (ctx, qs) => `<span class="pend-texto">Se elige ${ctx.un} al azar. Calcula:</span>${numeradas(qs.map(q => q.txt))}`;

  /* ---------- Enunciado con los datos (tres redacciones equivalentes) ---------- */
  function textoDatos(R, ctx, D) {
    const { N, A, B, AB } = D;
    const forma = R.int(1, 3);
    const marco = ctx.marco(N);
    const ellos = ctx.fem ? 'ellas' : 'ellos', estos = ctx.fem ? 'estas' : 'estos';
    if (forma === 1) {
      return { forma, txt: `${marco}. De ${ellos}, ${A} ${ctx.A.pl}, ${B} ${ctx.B.pl} y ${AB} ${ctx.A.pl} y ${ctx.B.pl} a la vez.` };
    }
    if (forma === 2) {
      return { forma, nB: N - B, txt: `${marco}. De ${ellos}, ${A} ${ctx.A.pl}, y de ${estos} ${AB} también ${ctx.B.pl}. Además, ${N - B} no ${ctx.B.pl}.` };
    }
    return { forma, x: B - AB, txt: `${marco}. De ${ellos}, ${A} ${ctx.A.pl}, y de ${estos} ${AB} también ${ctx.B.pl}. Entre ${ctx.fem ? 'las' : 'los'} que no ${ctx.A.pl}, ${B - AB} ${ctx.B.pl}.` };
  }
  /* Pasos para completar la tabla */
  function pasosTabla(ctx, T, D, td) {
    const { N, A, B, AB } = D;
    const A_ = ctx.A.pl, B_ = ctx.B.pl;
    const pasos = [];
    if (td.forma === 1) {
      pasos.push({ t: `Colocamos los datos: total general \\(${N}\\), total de «${A_}» (${A}), total de «${B_}» (${B}) y la casilla de los que cumplen ambas cosas (${AB}).` });
    } else if (td.forma === 2) {
      pasos.push({ t: `Colocamos los datos: total general \\(${N}\\), total de «${A_}» (${A}) y la casilla de ambas cosas (${AB}). Los ${td.nB} que no ${B_} forman el total de la columna «No»; el resto son los que ${B_}:`, m: `${N} - ${td.nB} = ${B}` });
    } else {
      pasos.push({ t: `Colocamos los datos: total general \\(${N}\\), total de «${A_}» (${A}), la casilla de ambas cosas (${AB}) y la de los que no ${A_} pero ${B_} (${td.x}). El total de «${B_}» es la suma de la columna:`, m: `${AB} + ${td.x} = ${B}` });
    }
    pasos.push({ t: `Los que ${A_} pero no ${B_}: al total de la fila le quitamos los que ${B_} también.`, m: `${A} - ${AB} = ${T.c[0][1]}` });
    if (td.forma !== 3) pasos.push({ t: `Los que no ${A_} pero ${B_}: al total de la columna le quitamos los que ya hemos contado en la primera fila.`, m: `${B} - ${AB} = ${T.c[1][0]}` });
    pasos.push({ t: `Total de los que no ${A_}: al total general le quitamos los que ${A_}.`, m: `${N} - ${A} = ${T.rowT[1]}` });
    pasos.push({ t: `Total de los que no ${B_}:`, m: `${N} - ${B} = ${T.colT[1]}` });
    pasos.push({ t: `Los que no ${A_} y no ${B_}: al total de su fila le quitamos los que ${B_}. (Comprobación: \\(${T.colT[1]} - ${T.c[0][1]} = ${T.c[1][1]}\\).)`, m: `${T.rowT[1]} - ${T.c[1][0]} = ${T.c[1][1]}` });
    pasos.push({ t: 'Tabla completa (cada fila y cada columna suman su total):', html: tablaHTML(ctx, T, false) });
    return pasos;
  }

  /* ================= 1. Completar la tabla ================= */
  function genTabla(R) {
    const ctx = R.pick(CONTEXTOS), D = datos(R), T = tabla(D), td = textoDatos(R, ctx, D);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${td.txt} Construye la tabla de contingencia correspondiente, con los totales de filas y columnas.</span></div>`,
      pasos: pasosTabla(ctx, T, D, td),
      resHtml: tablaHTML(ctx, T, false)
    };
  }

  /* ================= 2. Probabilidades con la tabla dada ================= */
  function genPreguntas(R) {
    const ctx = R.pick(CONTEXTOS), D = datos(R), T = tabla(D), qs = preguntas(R, ctx, T);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${ctx.marco(D.N)}. Sus datos se recogen en la tabla de contingencia siguiente:</span>${tablaHTML(ctx, T, false)}${enunPreguntas(ctx, qs)}</div>`,
      pasos: pasosPreguntas(ctx, qs),
      res: resumen(qs)
    };
  }

  /* ================= 3. Ejercicio completo (tabla + preguntas) ================= */
  function genCompleto(R) {
    const ctx = R.pick(CONTEXTOS), D = datos(R), T = tabla(D), td = textoDatos(R, ctx, D), qs = preguntas(R, ctx, T);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${td.txt} Construye la tabla de contingencia correspondiente, con los totales de filas y columnas, y, con ella, resuelve las cuestiones siguientes.</span>${enunPreguntas(ctx, qs)}</div>`,
      pasos: [{ t: '<b>Tabla de contingencia.</b>' }, ...pasosTabla(ctx, T, D, td), { t: '<b>Cuestiones.</b>' }, ...pasosPreguntas(ctx, qs)],
      resHtml: `${tablaHTML(ctx, T, false)}<span>\\(${resumen(qs)}\\)</span>`
    };
  }

  const ENUN = ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'];
  registrarFicha({
    id: 'tabla-contingencia',
    titulo: 'Tablas de contingencia',
    detalle: 'Tablas de doble entrada y probabilidad',
    grupo: 'Probabilidad y combinatoria',
    enlace: '../probabilidad/tabla-contingencia.html',
    ejercicios: [
      { id: 'tabla', nombre: 'Completar una tabla de contingencia', peso: 1, columnas: 1, enunciado: ENUN, generar: genTabla },
      { id: 'prob', nombre: 'Probabilidades a partir de la tabla', peso: 1.5, columnas: 1, enunciado: ENUN, generar: genPreguntas },
      { id: 'completo', nombre: 'Tabla de contingencia y cinco preguntas', peso: 2, columnas: 1, enunciado: ENUN, generar: genCompleto }
    ]
  });
})();
