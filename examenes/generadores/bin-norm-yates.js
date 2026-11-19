/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Binomial, normal y aproximación (distribuciones/bin-norm-yates.html).
   Mismos bloques que la ficha, con sus contextos extremeños:
   · Binomial: probabilidad de un valor exacto con la fórmula (n de 5 a 12, p con dos decimales).
   · Normal: probabilidades (menor, mayor, entre) y valor que deja un porcentaje (percentil).
   · Aproximación de la binomial por la normal con la corrección de continuidad de Yates:
     «menos de k», «más de k» y «entre k₁ y k₂ (ambos incluidos)».
   · Tipo añadido (no está en la ficha): «exactamente k» por aproximación, P(k − 0,5 < Y < k + 0,5),
     con el valor exacto de la binomial al final para comparar.
   Diferencias con la ficha:
   · La ficha es de opción múltiple; en el examen la respuesta es abierta y la solución trabaja con
     la tabla de la N(0, 1) de la hoja anexa (la misma que la de la ficha de la normal; si las dos
     fichas están en el examen, la tabla se imprime una sola vez).
   · En la aproximación se comprueba que n·p ≥ 5 y n·q ≥ 5 y se añaden «a lo sumo k» y «al menos k»,
     que son las otras dos correcciones de Yates; n de 60 a 500 y p de 0,10 a 0,90 de 0,05 en 0,05.
   · Concordancias corregidas («exactamente 3 de ellos prueben…», «un estudiante», no «un
     estudiantes») y medias y desviaciones realistas para cada contexto (la ficha tomaba μ entre 50
     y 180 para cualquier contexto, por ejemplo cerezas de 120 kg).
   · Se añade un «problema completo» de tipo EBAU: binomial exacta con n pequeño y aproximación
     con n grande en el mismo contexto. */
(function () {
  'use strict';
  const EX = window.EX, NO = EX.normal;
  const { N, H, Z, D, r2, igual } = NO.fmt;

  /* ---------- Binomial: combinatorio y probabilidad ---------- */
  function comb(n, k) {
    if (k < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    let r = 1;
    for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
    return Math.round(r);
  }
  const pmf = (n, k, p) => comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);

  /* ---------- Contextos de la ficha (con singular y plural) ---------- */
  /* intro(p): frase con la probabilidad; sg/pl: sustantivo; vs/vp: verbo en subjuntivo; X: variable */
  const CTX_BIN = [
    { sg: 'visitante', pl: 'visitantes', vs: 'pruebe la torta de la Serena', vp: 'prueben la torta de la Serena', X: 'número de visitantes que prueban la torta de la Serena',
      intro: p => `En la Feria de San Juan de Badajoz, la probabilidad de que un visitante pruebe la torta de la Serena es ${H(p)}.` },
    { sg: 'asistente', pl: 'asistentes', vs: 'se disfrace', vp: 'se disfracen', X: 'número de asistentes que se disfrazan',
      intro: p => `En el Carnaval de Badajoz, la probabilidad de que un asistente se disfrace es ${H(p)}.` },
    { sg: 'peregrino', pl: 'peregrinos', vs: 'lleve traje tradicional', vp: 'lleven traje tradicional', X: 'número de peregrinos con traje tradicional',
      intro: p => `En la romería de la Virgen de la Montaña, en Cáceres, la probabilidad de que un peregrino lleve traje tradicional es ${H(p)}.` },
    { sg: 'jornalero', pl: 'jornaleros', vs: 'sea de la comarca', vp: 'sean de la comarca', X: 'número de jornaleros de la comarca',
      intro: p => `En la recogida de la aceituna en la Sierra de Tentudía, la probabilidad de que un jornalero sea de la comarca es ${H(p)}.` },
    { sg: 'visitante', pl: 'visitantes', vs: 'compre cerezas directamente al agricultor', vp: 'compren cerezas directamente al agricultor', X: 'número de visitantes que compran cerezas al agricultor',
      intro: p => `En plena temporada de la cereza en el Valle del Jerte, la probabilidad de que un visitante compre cerezas directamente al agricultor es ${H(p)}.` },
    { sg: 'empresa', pl: 'empresas', vs: 'exporte sus productos', vp: 'exporten sus productos', X: 'número de empresas que exportan', fem: true,
      intro: p => `Según la Cámara de Comercio de Cáceres, la probabilidad de que una empresa extremeña exporte sus productos es ${H(p)}.` },
    { sg: 'extremeño', pl: 'extremeños', vs: 'haya asistido a la Feria del Queso de Trujillo', vp: 'hayan asistido a la Feria del Queso de Trujillo', X: 'número de personas que han asistido a la Feria del Queso',
      intro: p => `Un estudio de la Junta de Extremadura indica que la probabilidad de que un extremeño haya asistido alguna vez a la Feria del Queso de Trujillo es ${H(p)}.` },
    { sg: 'visitante', pl: 'visitantes', vs: 'sea estudiante de arte', vp: 'sean estudiantes de arte', X: 'número de visitantes que son estudiantes de arte',
      intro: p => `En el Museo Vostell de Malpartida de Cáceres, la probabilidad de que un visitante sea estudiante de arte es ${H(p)}.` },
    { sg: 'asistente', pl: 'asistentes', vs: 'venga de fuera de la ciudad', vp: 'vengan de fuera de la ciudad', X: 'número de asistentes que vienen de fuera',
      intro: p => `En la celebración de Los Palomos de Badajoz, la probabilidad de que un asistente venga de fuera de la ciudad es ${H(p)}.` },
    { sg: 'visitante', pl: 'visitantes', vs: 'haga senderismo', vp: 'hagan senderismo', X: 'número de visitantes que hacen senderismo',
      intro: p => `En la Reserva de la Biosfera de La Siberia, la probabilidad de que un visitante haga senderismo es ${H(p)}.` }
  ];
  const frase = (c, k) => (k === 1 ? `1 ${c.sg} ${c.vs}` : `${k} ${c.pl} ${c.vp}`);
  const elige = (c, n) => `Se eligen al azar ${n} ${c.pl}.`;

  const CTX_NOR = [
    { desc: 'la estatura de los estudiantes extremeños de 2.º de Bachillerato', corto: 'la estatura', uno: 'un estudiante elegido al azar', un: 'cm', mu: [168, 170, 172], sg: [6, 7, 8], paso: 1, ind: 'los estudiantes' },
    { desc: 'el peso de las cerezas del Valle del Jerte', corto: 'el peso', uno: 'una cereza elegida al azar', un: 'g', mu: [9, 10, 11, 12], sg: [1.5, 2], paso: 0.5, ind: 'las cerezas' },
    { desc: 'el tiempo de espera en las paradas del autobús urbano de Mérida', corto: 'el tiempo de espera', uno: 'un usuario elegido al azar', un: 'minutos', mu: [8, 10, 12, 15], sg: [2, 3, 4], paso: 0.5, ind: 'los usuarios' },
    { desc: 'el consumo anual de vino de los habitantes de Almendralejo', corto: 'el consumo anual', uno: 'un habitante elegido al azar', un: 'litros', mu: [20, 25, 30], sg: [4, 5, 6], paso: 0.5, ind: 'los habitantes' },
    { desc: 'la altura de los alcornoques del Parque Nacional de Monfragüe', corto: 'la altura', uno: 'un alcornoque elegido al azar', un: 'm', mu: [8, 10, 12], sg: [1.5, 2, 2.5], paso: 0.5, ind: 'los alcornoques' }
  ];

  const caja = NO.caja;

  /* ---------- Binomial exacta con la fórmula ---------- */
  function qBinExacta(R, c, n, p) {
    for (let t = 0; t < 40; t++) {
      const k = R.int(1, n - 1), v = pmf(n, k, p);
      if (v < 0.01) continue;
      const q = Math.round((1 - p) * 100) / 100;
      return {
        txt: `Calcula la probabilidad de que exactamente ${frase(c, k)}.`,
        pasos: [
          { t: `Sea \\(X\\) = «${c.X}». Cada uno de los ${n} ${c.pl} es un ensayo independiente con dos resultados y probabilidad de éxito constante, luego:`, m: `X \\sim B(${n};\\ ${N(p)})` },
          { t: `Se pide \\(P(X = ${k})\\). Con la fórmula de la binomial:`, m: `P(X = ${k}) = \\binom{${n}}{${k}} \\cdot ${N(p)}^{${k}} \\cdot ${N(q)}^{${n - k}} = ${comb(n, k)} \\cdot ${N(Math.pow(p, k), 5)} \\cdot ${N(Math.pow(q, n - k), 5)} \\approx ${v.toFixed(4).replace('.', '{,}')}` }
        ],
        res: `P(X = ${k}) \\approx ${v.toFixed(4).replace('.', '{,}')}`
      };
    }
    return null;
  }
  function genBinExacta(R) {
    for (let t = 0; t < 40; t++) {
      const c = R.pick(CTX_BIN), n = R.pick([5, 6, 7, 8, 9, 10, 12]), p = R.int(20, 85) / 100;
      const Q = qBinExacta(R, c, n, p);
      if (!Q) continue;
      return { html: true, enun: caja(`${c.intro(p)} ${elige(c, n)} ${Q.txt}`), pasos: Q.pasos, res: Q.res };
    }
    throw new Error('Sin datos válidos');
  }

  /* ---------- Normal: probabilidad y percentil (cuestiones de normal.js con contextos extremeños) ---------- */
  const qNorProb = (R, d) => R.pick([NO.qMenor, NO.qMayor, NO.qEntre])(R, d);
  const qNorInv = (R, d) => NO.qInvCola(R, d);

  /* ---------- Aproximación B → N con corrección de Yates ---------- */
  const NS = [60, 80, 100, 120, 150, 200, 250, 300, 400, 500];
  function datosAprox(R) {
    const c = R.pick(CTX_BIN), n = R.pick(NS), p = R.int(2, 18) * 5 / 100;
    const q = Math.round((1 - p) * 100) / 100, mu = n * p, sg = Math.sqrt(n * p * q);
    return { c, n, p, q, mu, sg };
  }
  const sg4 = d => Math.round(d.sg * 10000) / 10000;
  const pasoAprox = d => [
    { t: `Sea \\(X\\) = «${d.c.X}». Cada ${d.c.sg} es un ensayo independiente con probabilidad de éxito \\(p = ${N(d.p)}\\), luego \\(X \\sim B(${d.n};\\ ${N(d.p)})\\).` },
    { t: `Como \\(n\\) es grande y \\(n \\cdot p = ${N(d.mu, 2)} \\ge 5\\), \\(n \\cdot q = ${N(d.n * d.q, 2)} \\ge 5\\), aproximamos por una normal con la misma media y desviación típica:`,
      m: `\\mu = n p = ${d.n} \\cdot ${N(d.p)} = ${N(d.mu, 2)} \\qquad \\sigma = \\sqrt{n p q} = \\sqrt{${d.n} \\cdot ${N(d.p)} \\cdot ${N(d.q)}} = \\sqrt{${N(d.n * d.p * d.q, 4)}} ${igual(d.sg, sg4(d))} ${sg4(d).toFixed(4).replace('.', '{,}')} \\\\ X \\approx Y \\sim N(${N(d.mu, 2)};\\ ${sg4(d).toFixed(4).replace('.', '{,}')})`, multilinea: true }
  ];
  /* z de un extremo corregido x (k ± 0,5) */
  const zDe = (d, x) => r2((x - d.mu) / d.sg);
  const tipifY = (d, x, z, nom = 'z') => `${nom} = \\frac{${N(x)} - ${N(d.mu, 2)}}{${sg4(d).toFixed(4).replace('.', '{,}')}} \\approx ${Z(z)}`;
  const simetria = z => (z < 0 ? [{ t: 'Por simetría (la tabla solo tiene valores positivos):', m: `P(Z < ${Z(z)}) = 1 - P(Z < ${Z(-z)}) = 1 - ${D(NO.phiT(-z))} = ${D(NO.phiT(z))}` }] : []);

  /* Cola izquierda: «menos de k» (X ≤ k − 1 → Y < k − 0,5) o «a lo sumo k» (X ≤ k → Y < k + 0,5) */
  function qIzq(R, d, modo) {
    modo = modo || R.pick(['menos', 'asumo']);
    for (let t = 0; t < 40; t++) {
      const k = Math.round(d.mu + (R.rand() * 2.6 - 1.8) * d.sg);
      if (k < 1 || k >= d.n) continue;
      const x = modo === 'menos' ? k - 0.5 : k + 0.5, z = zDe(d, x);
      if (Math.abs(z) < 0.1 || Math.abs(z) > 2.8) continue;
      const val = NO.phiT(z);
      const lado = modo === 'menos' ? `P(X < ${k}) = P(X \\le ${k - 1})` : `P(X \\le ${k})`;
      return {
        txt: `Calcula la probabilidad de que ${modo === 'menos' ? 'menos de' : 'a lo sumo'} ${frase(d.c, k)}.`,
        pasos: [
          { t: `Corrección de continuidad: cada valor entero \\(j\\) de la binomial pasa a ser el intervalo \\((j - 0{,}5;\\ j + 0{,}5)\\) de la normal.`, m: `${lado} \\approx P(Y < ${N(x)})` },
          { t: 'Tipificamos:', m: tipifY(d, x, z) },
          ...simetria(z),
          { t: 'Con la tabla:', m: `P(Y < ${N(x)}) = P(Z < ${Z(z)}) = ${D(val)}` }
        ],
        res: `${modo === 'menos' ? `P(X < ${k})` : `P(X \\le ${k})`} \\approx ${D(val)}`, valor: val
      };
    }
    return null;
  }
  /* Cola derecha: «más de k» (X ≥ k + 1 → Y > k + 0,5) o «al menos k» (X ≥ k → Y > k − 0,5) */
  function qDer(R, d, modo) {
    modo = modo || R.pick(['mas', 'almenos']);
    for (let t = 0; t < 40; t++) {
      const k = Math.round(d.mu + (R.rand() * 2.6 - 0.8) * d.sg);
      if (k < 1 || k >= d.n) continue;
      const x = modo === 'mas' ? k + 0.5 : k - 0.5, z = zDe(d, x);
      if (Math.abs(z) < 0.1 || Math.abs(z) > 2.8) continue;
      const val = 10000 - NO.phiT(z);
      const lado = modo === 'mas' ? `P(X > ${k}) = P(X \\ge ${k + 1})` : `P(X \\ge ${k})`;
      const fin = z > 0
        ? { t: 'Pasamos al suceso contrario y usamos la tabla:', m: `P(Y > ${N(x)}) = P(Z > ${Z(z)}) = 1 - P(Z < ${Z(z)}) = 1 - ${D(NO.phiT(z))} = ${D(val)}` }
        : { t: 'Por la simetría de la curva:', m: `P(Y > ${N(x)}) = P(Z > ${Z(z)}) = P(Z < ${Z(-z)}) = ${D(val)}` };
      return {
        txt: `Calcula la probabilidad de que ${modo === 'mas' ? 'más de' : 'al menos'} ${frase(d.c, k)}.`,
        pasos: [
          { t: `Corrección de continuidad: cada valor entero \\(j\\) de la binomial pasa a ser el intervalo \\((j - 0{,}5;\\ j + 0{,}5)\\) de la normal.`, m: `${lado} \\approx P(Y > ${N(x)})` },
          { t: 'Tipificamos:', m: tipifY(d, x, z) },
          fin
        ],
        res: `${modo === 'mas' ? `P(X > ${k})` : `P(X \\ge ${k})`} \\approx ${D(val)}`, valor: val
      };
    }
    return null;
  }
  /* Entre k₁ y k₂, ambos incluidos: Y entre k₁ − 0,5 y k₂ + 0,5 */
  function qEntreY(R, d) {
    for (let t = 0; t < 40; t++) {
      const k1 = Math.round(d.mu - (0.3 + R.rand() * 1.4) * d.sg), k2 = Math.round(d.mu + (0.3 + R.rand() * 1.4) * d.sg);
      if (k1 < 1 || k2 >= d.n || k2 - k1 < 2) continue;
      const x1 = k1 - 0.5, x2 = k2 + 0.5, z1 = zDe(d, x1), z2 = zDe(d, x2);
      const p1 = NO.phiT(z1), p2 = NO.phiT(z2), val = p2 - p1;
      if (val < 100) continue;
      return {
        txt: `Calcula la probabilidad de que entre ${k1} y ${k2} ${d.c.pl} ${d.c.vp} (ambos incluidos).`,
        pasos: [
          { t: 'Corrección de continuidad: se amplía media unidad por cada extremo, porque los dos están incluidos.', m: `P(${k1} \\le X \\le ${k2}) \\approx P(${N(x1)} < Y < ${N(x2)})` },
          { t: 'Tipificamos los dos extremos:', m: `${tipifY(d, x1, z1, 'z_1')} \\\\ ${tipifY(d, x2, z2, 'z_2')}`, multilinea: true },
          ...simetria(z1), ...simetria(z2),
          { t: 'Restamos las áreas acumuladas:', m: `P(${Z(z1)} < Z < ${Z(z2)}) = P(Z < ${Z(z2)}) - P(Z < ${Z(z1)}) = ${D(p2)} - ${D(p1)} = ${D(val)}` }
        ],
        res: `P(${k1} \\le X \\le ${k2}) \\approx ${D(val)}`, valor: val
      };
    }
    return null;
  }

  /* Exactamente k: Y entre k − 0,5 y k + 0,5 (la normal da probabilidad 0 a un punto) */
  const lpmf = (n, k, p) => {                      // P(X = k) en escala logarítmica (n grande)
    let l = k * Math.log(p) + (n - k) * Math.log(1 - p);
    for (let i = 0; i < k; i++) l += Math.log(n - i) - Math.log(i + 1);
    return Math.exp(l);
  };
  function qExactaY(R, d) {
    for (let t = 0; t < 40; t++) {
      const k = Math.round(d.mu + (R.rand() * 2.4 - 1.2) * d.sg);
      if (k < 1 || k >= d.n) continue;
      const x1 = k - 0.5, x2 = k + 0.5, z1 = zDe(d, x1), z2 = zDe(d, x2);
      if (z1 === z2) continue;
      const p1 = NO.phiT(z1), p2 = NO.phiT(z2), val = p2 - p1;
      if (val < 50) continue;
      const exacto = lpmf(d.n, k, d.p);
      return {
        txt: `Calcula la probabilidad de que exactamente ${frase(d.c, k)}.`,
        pasos: [
          { t: `En una distribución continua la probabilidad de un único valor es 0, así que, con la corrección de continuidad, el valor ${k} pasa a ser el intervalo \\((${N(x1)};\\ ${N(x2)})\\):`, m: `P(X = ${k}) \\approx P(${N(x1)} < Y < ${N(x2)})` },
          { t: 'Tipificamos los dos extremos:', m: `${tipifY(d, x1, z1, 'z_1')} \\\\ ${tipifY(d, x2, z2, 'z_2')}`, multilinea: true },
          ...simetria(z1), ...simetria(z2),
          { t: 'Restamos las áreas acumuladas:', m: `P(${Z(z1)} < Z < ${Z(z2)}) = P(Z < ${Z(z2)}) - P(Z < ${Z(z1)}) = ${D(p2)} - ${D(p1)} = ${D(val)}` },
          { t: `(Con la fórmula de la binomial se obtendría \\(P(X = ${k}) \\approx ${exacto.toFixed(4).replace('.', '{,}')}\\), valor con el que se puede comparar; la aproximación evita calcular \\(\\binom{${d.n}}{${k}}\\).)` }
        ],
        res: `P(X = ${k}) \\approx ${D(val)}`, valor: val
      };
    }
    return null;
  }

  function ejAprox(fq) {
    return function (R) {
      for (let t = 0; t < 40; t++) {
        const d = datosAprox(R), Q = fq(R, d);
        if (!Q) continue;
        return { html: true, enun: caja(`${d.c.intro(d.p)} ${elige(d.c, d.n)} ${Q.txt}`), pasos: [...pasoAprox(d), ...Q.pasos], res: Q.res };
      }
      throw new Error('Sin datos válidos');
    };
  }

  /* ---------- Problema completo (tipo EBAU) ---------- */
  function genCompleto(R) {
    for (let t = 0; t < 40; t++) {
      const d = datosAprox(R);
      const nP = R.pick([6, 8, 10]);
      const q1 = qBinExacta(R, d.c, nP, d.p);
      const q2 = (R.rand() < 0.5 ? qIzq : qDer)(R, d), q3 = qEntreY(R, d);
      if (!q1 || !q2 || !q3) continue;
      const enun = `${d.c.intro(d.p)}<br>1. Si se eligen al azar ${nP} ${d.c.pl}, calcula la probabilidad de que exactamente ${frase(d.c, Number(q1.res.match(/X = (\d+)/)[1]))}.`
        + `<br>Se eligen ahora al azar ${d.n} ${d.c.pl}. Justificando la aproximación que utilices, calcula la probabilidad de que:`
        + `<br>2. ${q2.txt.replace(/^Calcula la probabilidad de que /, '').replace(/^./, m => m.toUpperCase()).replace(/\.$/, ';')}`
        + `<br>3. ${q3.txt.replace(/^Calcula la probabilidad de que /, '').replace(/^./, m => m.toUpperCase())}`;
      const pasos = [{ t: '<b>1.</b>' }, ...q1.pasos, { t: '<b>2.</b>' }, ...pasoAprox(d), ...q2.pasos, { t: '<b>3.</b> Con la misma aproximación:' }, ...q3.pasos];
      return {
        html: true, enun: caja(enun), pasos,
        resHtml: `<span>${[q1, q2, q3].map((x, i) => `${i + 1})&nbsp;\\(${x.res}\\)`).join('<br>')}</span>`
      };
    }
    throw new Error('Sin datos válidos');
  }

  const ENUN = ['Resuelve el siguiente problema (la tabla de la distribución normal está en el anexo):',
                'Resuelve los siguientes problemas (la tabla de la distribución normal está en el anexo):'];
  EX.registrarFicha({
    id: 'bin-norm-yates',
    titulo: 'Binomial, normal y aproximación',
    detalle: 'Corrección de Yates · EBAU (tabla de la N(0, 1) en hoja anexa)',
    grupo: 'Distribuciones de probabilidad',
    enlace: '../distribuciones/bin-norm-yates.html',
    anexo: NO.anexo,
    ejercicios: [
      { id: 'binexacta', nombre: 'Binomial: probabilidad de un valor exacto (fórmula)', peso: 1, columnas: 1, enunciado: ENUN, generar: genBinExacta },
      { id: 'norprob', nombre: 'Normal: probabilidad (menor, mayor o entre)', peso: 1, columnas: 1, enunciado: ENUN, generar: NO.ejercicio(qNorProb, CTX_NOR) },
      { id: 'norinv', nombre: 'Normal: valor que deja un porcentaje', peso: 1.25, columnas: 1, enunciado: ENUN, generar: NO.ejercicio(qNorInv, CTX_NOR) },
      { id: 'aproxizq', nombre: 'Aproximación: menos de k / a lo sumo k', peso: 1.5, columnas: 1, enunciado: ENUN, generar: ejAprox(qIzq) },
      { id: 'aproxder', nombre: 'Aproximación: más de k / al menos k', peso: 1.5, columnas: 1, enunciado: ENUN, generar: ejAprox(qDer) },
      { id: 'aproxentre', nombre: 'Aproximación: entre k₁ y k₂', peso: 1.5, columnas: 1, enunciado: ENUN, generar: ejAprox(qEntreY) },
      { id: 'aproxexacta', nombre: 'Aproximación: exactamente k', peso: 1.5, columnas: 1, enunciado: ENUN, generar: ejAprox(qExactaY) },
      { id: 'completo', nombre: 'Problema completo tipo EBAU (binomial y aproximación)', peso: 2.5, columnas: 1, enunciado: ENUN, generar: genCompleto }
    ]
  });
})();
