/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Distribución binomial (distribuciones/binomial.html).
   Mismos cinco tipos que la ficha: probabilidad exacta, «al menos», «a lo sumo», «entre k₁ y k₂»
   y probabilidad condicionada («entre k₁ y k₂ sabiendo que hay al menos k₁»), con los mismos
   contextos, n entre 5 y 14 y los mismos valores de p.
   Diferencias con la ficha:
   · El enunciado incluye un extracto de la tabla de la binomial, P(X = k) con cuatro decimales,
     para el n del problema y cuatro valores de p consecutivos (entre ellos el del problema), de
     modo que el alumno tiene que localizar la columna. Las soluciones trabajan con los valores
     de la tabla (sumas exactas de valores redondeados), que es lo que hará el alumno; cuando el
     camino alternativo (complementario o suma directa) da una diezmilésima distinta por el
     redondeo, se indica.
   · En «al menos» y «a lo sumo» se elige el camino con menos sumandos (la ficha usa siempre el
     complementario en «al menos» y la suma directa en «a lo sumo»).
   · Se evitan los resultados casi nulos (menores que 0,0010; en la tabla aparecerían como 0,0000 o 0,000x) y, en la condicionada, el caso k₂ = n
     (daría siempre 1).
   · Las frases se han revisado para que concuerden en número («exactamente 1 producto sea
     defectuoso», «entre 2 y 4 productos sean defectuosos») y el contexto del test indica que
     los alumnos se eligen al azar.
   · Se añade un sexto tipo, «problema completo», con una sola tabla y cuatro cuestiones. */
(function () {
  'use strict';
  const { registrarFicha } = window.EX;

  const PS = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.7];

  /* ---------- Cálculo: probabilidades en diezmilésimas enteras ---------- */
  function comb(n, k) {
    if (k < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    let r = 1;
    for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1);
    return Math.round(r);
  }
  const pmf = (n, k, p) => comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  /* Columna de la tabla: T[k] = P(X = k) redondeada a 4 decimales, en diezmilésimas */
  const columna = (n, p) => Array.from({ length: n + 1 }, (_, k) => Math.round(pmf(n, k, p) * 10000));
  const suma = (T, a, b) => { let s = 0; for (let i = a; i <= b; i++) s += T[i]; return s; };

  /* ---------- Formato ---------- */
  const D = u => (u / 10000).toFixed(4).replace('.', '{,}');          // diezmilésimas → TeX
  const Dh = u => (u / 10000).toFixed(4).replace('.', ',');           // diezmilésimas → texto
  const pT = p => String(p).replace('.', '{,}');
  const pH = p => String(p).replace('.', ',');
  const qOf = p => Math.round((1 - p) * 100) / 100;

  /* ---------- Contextos (los de la ficha, con singular y plural) ---------- */
  /* uno/varios: sustantivo; s/pl: verbo en subjuntivo singular/plural; X: descripción de la variable */
  const CONTEXTOS = [
    { sg: 'producto', pl: 'productos', vs: 'sea defectuoso', vp: 'sean defectuosos', X: 'número de productos defectuosos',
      enun: (n, p) => `En un proceso de fabricación, la probabilidad de que un producto sea defectuoso es ${pH(p)}. Se seleccionan al azar ${n} productos.` },
    { sg: 'paciente', pl: 'pacientes', vs: 'mejore', vp: 'mejoren', X: 'número de pacientes que mejoran',
      enun: (n, p) => `Un tratamiento médico tiene una probabilidad de éxito de ${pH(p)}. Se aplica a ${n} pacientes, de forma independiente.` },
    { sg: 'alumno', pl: 'alumnos', vs: 'apruebe', vp: 'aprueben', X: 'número de alumnos que aprueban',
      enun: (n, p) => `La probabilidad de que un alumno apruebe un test es ${pH(p)}. Se escogen al azar ${n} alumnos.` },
    { sg: 'semilla', pl: 'semillas', vs: 'germine', vp: 'germinen', X: 'número de semillas que germinan', fem: true,
      enun: (n, p) => `La probabilidad de germinación de una semilla es ${pH(p)}. Se plantan ${n} semillas de forma independiente.` },
    { sg: 'tiro', pl: 'tiros', vs: 'sea encestado', vp: 'sean encestados', X: 'número de tiros encestados',
      enun: (n, p) => `Un jugador de baloncesto encesta un tiro libre con probabilidad ${pH(p)}. Lanza ${n} tiros libres de forma independiente.` },
    { sg: 'pieza', pl: 'piezas', vs: 'esté fuera de tolerancia', vp: 'estén fuera de tolerancia', X: 'número de piezas fuera de tolerancia', fem: true,
      enun: (n, p) => `En un lote industrial, la probabilidad de que una pieza esté fuera de tolerancia es ${pH(p)}. Se inspeccionan ${n} piezas al azar.` },
    { sg: 'persona', pl: 'personas', vs: 'esté a favor', vp: 'estén a favor', X: 'número de personas a favor', fem: true,
      enun: (n, p) => `En una encuesta, el ${Math.round(p * 100)} % de los ciudadanos apoya una medida. Se pregunta a ${n} personas elegidas al azar.` }
  ];
  /* «exactamente 1 producto sea defectuoso» / «exactamente 3 productos sean defectuosos» */
  const frase = (c, k) => (k === 1 ? `1 ${c.sg} ${c.vs}` : `${k} ${c.pl} ${c.vp}`);
  const ningun = c => (c.fem ? 'ninguna' : 'ningún');

  /* ---------- Tabla de la binomial (blanco y negro, sobria) ---------- */
  function tablaHTML(n, cols, pMarca) {
    const B = 'border:.25mm solid #000;';
    const celda = 'padding:.35mm 2mm;text-align:center;font-variant-numeric:tabular-nums;';
    const head = cols.map(p => `<th style="${B}${celda}font-weight:600">${pH(p)}</th>`).join('');
    const filas = Array.from({ length: n + 1 }, (_, k) =>
      `<tr><th style="${B}${celda}font-weight:600">${k}</th>${cols.map(p => `<td style="${B}${celda}">${Dh(columna(n, p)[k])}</td>`).join('')}</tr>`).join('');
    return `<table class="bin-tabla" data-p="${pMarca}" style="border-collapse:collapse;font-size:.8em;line-height:1.25;flex:none">`
      + `<caption style="caption-side:top;font-size:.95em;padding-bottom:.8mm;text-align:center">Tabla de la binomial: \\(P(X = k)\\), \\(n = ${n}\\)</caption>`
      + `<thead><tr><th style="${B}${celda}font-weight:600">\\(k \\,\\backslash\\, p\\)</th>${head}</tr></thead><tbody>${filas}</tbody></table>`;
  }
  /* Cuatro valores consecutivos de la lista que contienen p, en posición al azar */
  function columnas(R, p) {
    const i = PS.indexOf(p);
    const ini = R.int(Math.max(0, i - 3), Math.min(i, PS.length - 4));
    return PS.slice(ini, ini + 4);
  }
  const caja = (txt, n, cols, p) =>
    `<div class="bin-ap"><span class="bin-txt pend-texto">${txt}</span>${tablaHTML(n, cols, p)}</div>`;

  /* ---------- Planteamiento común ---------- */
  function datos(R) {
    const n = R.int(5, 14), p = R.pick(PS), c = R.pick(CONTEXTOS);
    return { n, p, q: qOf(p), c, T: columna(n, p), cols: columnas(R, p) };
  }
  const pasoModelo = d => ({
    t: `Sea \\(X\\) = «${d.c.X}». Cada uno de los ${d.n} ${d.c.pl} es un ensayo independiente con dos resultados y la misma probabilidad de éxito, \\(p = ${pT(d.p)}\\). Por tanto, \\(X\\) sigue una distribución binomial (en la tabla, columna \\(p = ${pT(d.p)}\\)):`,
    m: `X \\sim B(${d.n};\\ ${pT(d.p)})`
  });
  /* Escribe P(X=a) + … + P(X=b) y sus valores de la tabla */
  const listaP = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => `P(X = ${a + i})`).join(' + ');
  const listaV = (T, a, b) => Array.from({ length: b - a + 1 }, (_, i) => D(T[a + i])).join(' + ');
  /* Paso {m} con la suma «izq = P(X=a)+…+P(X=b) = valores = total»; con tres o más sumandos, en tres líneas */
  function sumaPaso(izq, T, a, b) {
    if (a === b) return { m: `${izq} = P(X = ${a}) = ${D(T[a])}` };
    if (b - a < 2) return { m: `${izq} = ${listaP(a, b)} = ${listaV(T, a, b)} = ${D(suma(T, a, b))}` };
    return { m: `${izq} = ${listaP(a, b)} \\\\ = ${listaV(T, a, b)} \\\\ = ${D(suma(T, a, b))}`, multilinea: true };
  }

  /* ---------- Cada tipo de pregunta: { txt, pasos, res, valor } ---------- */
  function qExacta(R, d) {
    const { n, p, q, c, T } = d;
    let k, t = 0;
    do { k = R.int(0, Math.min(n, 5)); t++; } while (T[k] < 10 && t < 50);
    if (T[k] < 10) return null;
    return {
      txt: k === 0 ? `Calcula la probabilidad de que ${ningun(c)} ${c.sg} ${c.vs}.` : `Calcula la probabilidad de que exactamente ${frase(c, k)}.`,
      pasos: [
        { t: `Se pide \\(P(X = ${k})\\). Por la fórmula de la binomial:`, m: `P(X = ${k}) = \\binom{${n}}{${k}} \\cdot ${pT(p)}^{${k}} \\cdot ${pT(q)}^{${n - k}} = ${comb(n, k)} \\cdot ${pT(p)}^{${k}} \\cdot ${pT(q)}^{${n - k}} \\approx ${D(T[k])}` },
        { t: `Es el valor de la tabla en la fila \\(k = ${k}\\), columna \\(p = ${pT(p)}\\).` }
      ],
      res: `P(X = ${k}) = ${D(T[k])}`, valor: T[k]
    };
  }

  /* P(X ≥ k): por el complementario o sumando directamente (el camino más corto) */
  function pasosAlMenos(T, n, k) {
    const directo = suma(T, k, n), compl = 10000 - suma(T, 0, k - 1);
    const usaCompl = k <= n - k + 1;
    const pasos = usaCompl
      ? [{ t: 'Es más corto pasar al suceso contrario:', m: `P(X \\ge ${k}) = 1 - P(X \\le ${k - 1}) = 1 - [${listaP(0, k - 1)}]` },
         { t: 'Con los valores de la tabla:', m: `P(X \\le ${k - 1}) = ${k - 1 === 0 ? D(T[0]) : `${listaV(T, 0, k - 1)} = ${D(suma(T, 0, k - 1))}`} \\\\ P(X \\ge ${k}) = 1 - ${D(suma(T, 0, k - 1))} = ${D(compl)}`, multilinea: true }]
      : [{ t: `Hay pocos valores desde ${k} hasta ${n}, así que sumamos directamente con los valores de la tabla:`, ...sumaPaso(`P(X \\ge ${k})`, T, k, n) }];
    const valor = usaCompl ? compl : directo, otro = usaCompl ? directo : compl;
    if (otro !== valor) pasos.push({ t: `(${usaCompl ? 'Sumando directamente' : 'Por el complementario'} se obtiene \\(${D(otro)}\\); la diferencia de una diezmilésima se debe al redondeo de la tabla y ambas respuestas son válidas.)` });
    return { pasos, valor };
  }
  function qAlMenos(R, d) {
    const { n, c, T } = d;
    for (let t = 0; t < 50; t++) {
      const k = R.int(1, Math.min(n, 4));
      const { pasos, valor } = pasosAlMenos(T, n, k);
      if (valor < 10) continue;
      return { txt: `Calcula la probabilidad de que al menos ${frase(c, k)}.`, pasos: [{ t: `Se pide \\(P(X \\ge ${k})\\).` }, ...pasos], res: `P(X \\ge ${k}) = ${D(valor)}`, valor };
    }
    return null;
  }

  /* P(X ≤ k): sumando directamente o por el complementario */
  function qASumo(R, d) {
    const { n, c, T } = d;
    for (let t = 0; t < 50; t++) {
      const k = R.int(1, Math.min(n - 1, 5));
      const directo = suma(T, 0, k), compl = 10000 - suma(T, k + 1, n);
      const usaDirecto = k + 1 <= n - k;
      const valor = usaDirecto ? directo : compl, otro = usaDirecto ? compl : directo;
      if (valor < 10 || valor > 9990) continue;
      const pasos = usaDirecto
        ? [{ t: `Se pide \\(P(X \\le ${k})\\): sumamos las probabilidades desde 0 hasta ${k} con los valores de la tabla:`, ...sumaPaso(`P(X \\le ${k})`, T, 0, k) }]
        : [{ t: `Se pide \\(P(X \\le ${k})\\). Es más corto pasar al suceso contrario:`, m: `P(X \\le ${k}) = 1 - P(X \\ge ${k + 1}) = 1 - [${listaP(k + 1, n)}]` },
           { t: 'Con los valores de la tabla:', m: `P(X \\ge ${k + 1}) = ${k + 1 === n ? D(T[n]) : `${listaV(T, k + 1, n)} = ${D(suma(T, k + 1, n))}`} \\\\ P(X \\le ${k}) = 1 - ${D(suma(T, k + 1, n))} = ${D(compl)}`, multilinea: true }];
      if (otro !== valor) pasos.push({ t: `(${usaDirecto ? 'Por el complementario' : 'Sumando directamente'} se obtiene \\(${D(otro)}\\); la diferencia de una diezmilésima se debe al redondeo de la tabla y ambas respuestas son válidas.)` });
      return { txt: `Calcula la probabilidad de que a lo sumo ${frase(c, k)}.`, pasos, res: `P(X \\le ${k}) = ${D(valor)}`, valor };
    }
    return null;
  }

  function qEntre(R, d) {
    const { n, c, T } = d;
    for (let t = 0; t < 50; t++) {
      const k1 = R.int(1, Math.floor(n / 2)), k2 = R.int(k1 + 1, Math.min(n, k1 + 4));
      const valor = suma(T, k1, k2);
      if (valor < 10) continue;
      return {
        txt: `Calcula la probabilidad de que entre ${k1} y ${k2} ${c.pl} ${c.vp} (ambos inclusive).`,
        pasos: [{ t: `Se pide \\(P(${k1} \\le X \\le ${k2})\\): sumamos las probabilidades desde ${k1} hasta ${k2} con los valores de la tabla:`, ...sumaPaso(`P(${k1} \\le X \\le ${k2})`, T, k1, k2) }],
        res: `P(${k1} \\le X \\le ${k2}) = ${D(valor)}`, valor
      };
    }
    return null;
  }

  function qCondic(R, d) {
    const { n, c, T } = d;
    for (let t = 0; t < 60; t++) {
      const k1 = R.int(1, Math.min(n - 1, 3)), k2 = R.int(k1 + 1, Math.min(n - 1, k1 + 3));
      if (k2 <= k1) continue;
      const A = suma(T, k1, k2);
      const B = pasosAlMenos(T, n, k1);
      if (A < 50 || B.valor < 100) continue;
      const cociente = Math.round(A / B.valor * 10000);
      if (cociente >= 10000) continue;
      return {
        txt: `Calcula la probabilidad de que entre ${k1} y ${k2} ${c.pl} ${c.vp}, sabiendo que al menos ${frase(c, k1)}.`,
        pasos: [
          { t: `Llamamos \\(A\\) = «\\(${k1} \\le X \\le ${k2}\\)» y \\(B\\) = «\\(X \\ge ${k1}\\)». Se pide \\(P(A \\mid B)\\). Como todo resultado de \\(A\\) está en \\(B\\), \\(A \\cap B = A\\):`, m: `P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{P(${k1} \\le X \\le ${k2})}{P(X \\ge ${k1})}` },
          { t: 'Numerador, con los valores de la tabla:', ...sumaPaso(`P(${k1} \\le X \\le ${k2})`, T, k1, k2) },
          { t: `Denominador, \\(P(X \\ge ${k1})\\):` },
          ...B.pasos,
          { t: 'Dividimos:', m: `P(A \\mid B) = \\frac{${D(A)}}{${D(B.valor)}} \\approx ${D(cociente)}` }
        ],
        res: `P(A \\mid B) \\approx ${D(cociente)}`, valor: cociente
      };
    }
    return null;
  }

  /* ---------- Ejercicio de una sola pregunta ---------- */
  function ejercicio(fq) {
    return function (R) {
      for (let t = 0; t < 40; t++) {
        const d = datos(R), Q = fq(R, d);
        if (!Q) continue;
        return {
          html: true,
          enun: caja(`${d.c.enun(d.n, d.p)} ${Q.txt}`, d.n, d.cols, d.p),
          pasos: [pasoModelo(d), ...Q.pasos],
          res: Q.res
        };
      }
      throw new Error('Sin datos válidos');
    };
  }

  /* ---------- Problema completo: una tabla y cuatro cuestiones ---------- */
  function genCompleto(R) {
    for (let t = 0; t < 40; t++) {
      const d = datos(R);
      if (d.n < 7) continue;                                   // hace falta margen para cuatro preguntas
      const segunda = R.rand() < 0.5 ? qAlMenos : qASumo;
      const qs = [qExacta(R, d), segunda(R, d), qEntre(R, d), qCondic(R, d)];
      if (qs.some(x => !x)) continue;
      const lista = qs.map((x, i) => `${i + 1}. ${x.txt.replace(/^Calcula la probabilidad de que /, '').replace(/^./, m => m.toUpperCase())}`).join('<br>');
      const pasos = [pasoModelo(d)];
      qs.forEach((x, i) => { pasos.push({ t: `<b>${i + 1}.</b>` }); pasos.push(...x.pasos); });
      return {
        html: true,
        enun: caja(`${d.c.enun(d.n, d.p)} Calcula la probabilidad de que:<br>${lista}`, d.n, d.cols, d.p),
        pasos,
        resHtml: `<span>${qs.map((x, i) => `${i + 1})&nbsp;\\(${x.res}\\)`).join('<br>')}</span>`
      };
    }
    throw new Error('Sin datos válidos');
  }

  const ENUN = ['Resuelve el siguiente problema con ayuda de la tabla de la distribución binomial:',
                'Resuelve los siguientes problemas con ayuda de la tabla de la distribución binomial:'];
  registrarFicha({
    id: 'binomial',
    titulo: 'Distribución binomial',
    detalle: 'Probabilidades con la tabla de la binomial',
    grupo: 'Distribuciones de probabilidad',
    enlace: '../distribuciones/binomial.html',
    ejercicios: [
      { id: 'exacta', nombre: 'Probabilidad de un valor exacto', peso: 1, columnas: 1, enunciado: ENUN, generar: ejercicio(qExacta) },
      { id: 'almenos', nombre: 'Al menos k éxitos', peso: 1, columnas: 1, enunciado: ENUN, generar: ejercicio(qAlMenos) },
      { id: 'asumo', nombre: 'A lo sumo k éxitos', peso: 1, columnas: 1, enunciado: ENUN, generar: ejercicio(qASumo) },
      { id: 'entre', nombre: 'Entre k₁ y k₂ éxitos', peso: 1, columnas: 1, enunciado: ENUN, generar: ejercicio(qEntre) },
      { id: 'condic', nombre: 'Probabilidad condicionada', peso: 1.5, columnas: 1, enunciado: ENUN, generar: ejercicio(qCondic) },
      { id: 'completo', nombre: 'Problema completo (una tabla, cuatro cuestiones)', peso: 2.5, columnas: 1, enunciado: ENUN, generar: genCompleto }
    ]
  });
})();
