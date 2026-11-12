/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: ecuaciones (segundo grado, bicuadradas y tercer grado).
   Los números se generan con los mismos criterios que las fichas interactivas. */
(function () {
  'use strict';
  const { fr, tex, resolverCuadratica, divisores, registrarFicha } = window.EX;
  const { n, frac, poli, cuad, bin } = tex;

  const ordenar = rs => rs.slice().sort((u, v) => u.n / u.d - v.n / v.d);
  function resultadoRaices(raices, v = 'x') {
    if (!raices.length) return '\\text{No tiene soluciones reales}';
    if (raices.length === 1) return `${v} = ${frac(raices[0])} \\text{ (doble)}`;
    return ordenar(raices).map((r, i) => `${v}_${i + 1} = ${frac(r)}`).join(',\\quad ');
  }

  /* ================= Ecuaciones de segundo grado ================= */
  // Polinomio con raíces n1/d1 y n2/d2 (mismo criterio que la ficha)
  const factores = (d1, n1, d2, n2, s = 1) =>
    ({ a: s * d1 * d2 + 0, b: -s * (d1 * n2 + d2 * n1) + 0, c: s * n1 * n2 + 0 });

  function ec2FormaGeneral(R) {
    let r1, r2;
    // Solo ecuaciones completas (b ≠ 0 y c ≠ 0): las incompletas tienen su propia ficha.
    do { r1 = R.int(-6, 6); r2 = R.int(-6, 6); } while (r1 === 0 || r2 === 0 || r1 === -r2);
    const P = factores(1, r1, 1, r2);
    const sol = resolverCuadratica(P.a, P.b, P.c);
    return { enun: `${cuad(P.a, P.b, P.c)} = 0`, pasos: sol.pasos, res: resultadoRaices(sol.raices) };
  }

  function ec2AmbosMiembros(R) {
    let P;
    while (true) {
      const d1 = R.pick([1, 1, 2]), d2 = R.pick([1, 1, 1, 2]);
      const n1 = R.int(-5, 5), n2 = R.int(-5, 5);
      if (n1 === 0 || n2 === 0 || n1 * d2 === -n2 * d1) continue;   // evita c = 0 y b = 0
      P = factores(d1, n1, d2, n2, R.pick([1, 1, -1]));
      if (Math.abs(P.b) <= 30 && Math.abs(P.c) <= 30) break;
    }
    let Rm, L;
    do {
      Rm = [0, 0, 0];
      R.pick([[0], [1], [2], [0, 1], [0, 2], [1, 2], [1, 2], [0, 1, 2]])
        .forEach(i => { Rm[i] = i === 0 ? R.nz(-3, 3) : R.nz(-8, 8); });
      L = [P.a + Rm[0], P.b + Rm[1], P.c + Rm[2]];
    } while (L[0] === 0 && L[1] === 0);
    const sol = resolverCuadratica(P.a, P.b, P.c);
    return {
      enun: `${cuad(...L)} = ${cuad(...Rm)}`,
      pasos: [{ t: 'Pasamos todos los términos al primer miembro y agrupamos:', m: `${cuad(P.a, P.b, P.c)} = 0` }, ...sol.pasos],
      res: resultadoRaices(sol.raices)
    };
  }

  function plantillaParentesis(R, P) {
    for (let k = 0; k < 80; k++) {
      const T = R.pick(P.a === 1 ? ['T1', 'T2', 'T2', 'T3', 'T3'] : ['T4', 'T5', 'T5']);
      let L, p, q, izq, m, nn;
      if (T === 'T1') {                       // x(x + m) = q
        if (P.b === 0 || P.c === 0) continue;
        m = P.b; p = 0; q = -P.c; L = [1, m, 0];
        izq = `x(${bin(1, m)})`;
      } else if (T === 'T2') {                // (x + m)² = px + q
        m = R.nz(-5, 5); p = 2 * m - P.b; q = m * m - P.c; L = [1, 2 * m, m * m];
        izq = `(${bin(1, m)})^2`;
      } else if (T === 'T3') {                // (x + m)(x + n) = px + q
        m = R.nz(-5, 5); nn = R.nz(-5, 5); if (m === nn) continue;
        p = m + nn - P.b; q = m * nn - P.c; L = [1, m + nn, m * nn];
        izq = `(${bin(1, m)})(${bin(1, nn)})`;
      } else if (T === 'T4') {                // 2x(x + m) = px + q
        m = R.nz(-4, 4); p = 2 * m - P.b; q = -P.c; L = [2, 2 * m, 0];
        izq = `2x(${bin(1, m)})`;
      } else {                                // (2x + m)(x + n) = px + q
        m = R.nz(-5, 5); nn = R.nz(-5, 5);
        p = 2 * nn + m - P.b; q = m * nn - P.c; L = [2, 2 * nn + m, m * nn];
        izq = `(${bin(2, m)})(${bin(1, nn)})`;
      }
      if (p === 0 && q === 0) continue;
      if (Math.abs(p) > 25 || Math.abs(q) > 40) continue;
      return { L, Rm: [0, p, q], izq };
    }
    return null;
  }

  function ec2Parentesis(R) {
    for (let intento = 0; intento < 200; intento++) {
      const tipo = R.pick(['normal', 'normal', 'normal', 'normal', 'normal', 'neg', 'neg', 'neg', 'doble', 'doble']);
      let P;
      if (tipo === 'normal') {
        let n1, n2;
        do { n1 = R.int(-5, 5); n2 = R.int(-5, 5); } while (n1 === 0 || n2 === 0);
        P = factores(1, n1, R.pick([1, 1, 2]), n2);
      } else if (tipo === 'neg') {
        const a = R.pick([1, 1, 2]), b = R.nz(-6, 6);
        P = { a, b, c: Math.floor(b * b / (4 * a)) + R.int(1, 3) };
      } else {
        const r = R.nz(-5, 5);
        P = factores(1, r, 1, r);
      }
      if (P.b === 0 || P.c === 0) continue;   // solo ecuaciones completas
      const pl = plantillaParentesis(R, P);
      if (!pl) continue;
      const sol = resolverCuadratica(P.a, P.b, P.c);
      return {
        enun: `${pl.izq} = ${cuad(...pl.Rm)}`,
        pasos: [
          { t: 'Desarrollamos el primer miembro:', m: `${cuad(...pl.L)} = ${cuad(...pl.Rm)}` },
          { t: 'Pasamos todos los términos al primer miembro y agrupamos:', m: `${cuad(P.a, P.b, P.c)} = 0` },
          ...sol.pasos
        ],
        res: resultadoRaices(sol.raices)
      };
    }
    throw new Error('No se pudo generar la ecuación');
  }

  registrarFicha({
    id: 'ec-2-grado',
    titulo: 'Ecuaciones de segundo grado',
    detalle: 'Fórmula general',
    grupo: 'Polinomios y ecuaciones',
    enlace: '../ecuaciones/ec-2-grado.html',
    ejercicios: [
      { id: 'forma-general', nombre: 'Forma general', peso: 1, columnas: 3,
        enunciado: ['Resuelve la siguiente ecuación de segundo grado:', 'Resuelve las siguientes ecuaciones de segundo grado:'],
        generar: ec2FormaGeneral },
      { id: 'ambos-miembros', nombre: 'Términos en ambos miembros', peso: 1.25, columnas: 2,
        enunciado: ['Resuelve la siguiente ecuación:', 'Resuelve las siguientes ecuaciones:'],
        generar: ec2AmbosMiembros },
      { id: 'parentesis', nombre: 'Paréntesis y casos especiales', peso: 1.5, columnas: 2,
        enunciado: ['Resuelve la siguiente ecuación:', 'Resuelve las siguientes ecuaciones:'],
        generar: ec2Parentesis }
    ]
  });

  /* ================= Ecuaciones bicuadradas ================= */
  const POSITIVOS = [1, 4, 9, 16, 25];
  const NEGATIVOS = [-1, -2, -3, -4, -5, -6, -7, -8, -9];

  function bicuadrada(R) {
    const dos = lista => { const a = R.pick(lista); let b; do { b = R.pick(lista); } while (b === a); return [a, b]; };
    let t1, t2, k, A, B, C, intento = 0;
    do {
      intento++;
      const caso = R.pick(['ambosPositivos', 'mixto', 'ambosNegativos']);
      if (caso === 'ambosPositivos') [t1, t2] = dos(POSITIVOS);
      else if (caso === 'ambosNegativos') [t1, t2] = dos(NEGATIVOS);
      else { const pp = R.pick(POSITIVOS), nn = R.pick(NEGATIVOS); [t1, t2] = R.rand() < 0.5 ? [pp, nn] : [nn, pp]; }
      const r = R.rand();
      k = r < 0.6 ? 1 : (r < 0.85 ? 2 : 3);
      A = k; B = -k * (t1 + t2); C = k * t1 * t2;
    } while (intento < 300 && Math.abs(C) > 150);
    if (Math.abs(C) > 150) { t1 = 1; t2 = -4; A = 1; B = 3; C = -4; }

    // Presentación «desordenada», como en la ficha
    const X4 = 'x^4', X2 = 'x^2';
    const pl = R.pick([
      [[[A, X4], [B, X2]], [[-C, '']]],
      [[[A, X4]], [[-B, X2], [-C, '']]],
      [[[-C, '']], [[A, X4], [B, X2]]],
      [[[B, X2], [A, X4]], [[-C, '']]],
      [[[A, X4], [C, '']], [[-B, X2]]],
      [[[-B, X2]], [[A, X4], [C, '']]]
    ]);
    const lado = ts => (ts.every(([c]) => c === 0) ? '0' : poli(ts));
    const enun = `${lado(pl[0])} = ${lado(pl[1])}`;

    const sol = resolverCuadratica(A, B, C, 't');
    const pasos = [
      { t: 'Pasamos todo al primer miembro y ordenamos:', m: `${poli([[A, X4], [B, X2], [C, '']])} = 0` },
      { t: 'Hacemos el cambio de variable \\(t = x^2\\) (entonces \\(x^4 = t^2\\)):', m: `${cuad(A, B, C, 't')} = 0` },
      ...sol.pasos
    ];
    const xs = [];
    const deshacer = sol.raices.map(f => {
      const t = f.n / f.d;
      if (t > 0) {
        const r = Math.round(Math.sqrt(t)); xs.push(r);
        return `t = ${n(t)} \\;\\Rightarrow\\; x^2 = ${n(t)} \\;\\Rightarrow\\; x = \\pm\\sqrt{${n(t)}} = \\pm ${r}`;
      }
      return `t = ${n(t)} \\;\\Rightarrow\\; x^2 = ${n(t)} \\;\\Rightarrow\\; \\text{no hay solución real}`;
    });
    pasos.push({ t: 'Deshacemos el cambio de variable:', m: deshacer.join(' \\\\ '), multilinea: true });
    xs.sort((a, b) => a - b);
    const res = xs.length
      ? xs.map(r => `x = \\pm ${r}`).join(',\\quad ') + ` \\quad\\text{(${xs.length * 2} soluciones)}`
      : '\\text{No tiene soluciones reales}';
    return { enun, pasos, res };
  }

  registrarFicha({
    id: 'ec-bicuadrada',
    titulo: 'Ecuaciones bicuadradas',
    grupo: 'Polinomios y ecuaciones',
    enlace: '../ecuaciones/ec-bicuadrada.html',
    ejercicios: [
      { id: 'bicuadrada', nombre: 'Ecuación bicuadrada', peso: 1.5, columnas: 2,
        enunciado: ['Resuelve la siguiente ecuación bicuadrada:', 'Resuelve las siguientes ecuaciones bicuadradas:'],
        generar: bicuadrada }
    ]
  });

  /* ================= Ecuaciones de tercer grado (Ruffini) ================= */
  function tercerGrado(R) {
    const intentar = (lo, hi, pk) => {
      for (let i = 0; i < 500; i++) {
        const r1 = R.nz(lo, hi), r2 = R.nz(lo, hi), r3 = R.nz(lo, hi);
        const k = pk();
        const s2 = r2 + r3, p2 = r2 * r3;
        const A = k, B = k * (-(s2 + r1)), C = k * (p2 + s2 * r1), D = k * (-p2 * r1);
        if (r1 === r2 || r1 === r3 || r2 === r3 || D === 0 || Math.abs(D) >= 40) continue;
        return { A, B, C, D, raices: [r1, r2, r3] };
      }
      return null;
    };
    const ec = intentar(-5, 5, () => { const r = R.rand(); return r < 0.6 ? 1 : (r < 0.85 ? 2 : 3); })
      || intentar(-3, 3, () => (R.rand() < 0.7 ? 1 : 2));
    const { A, B, C, D } = ec;
    const pol = poli([[A, 'x^3'], [B, 'x^2'], [C, 'x'], [D, '']]);

    // Raíz que se prueba primero: la de menor valor absoluto (orden ±1, ±2, …)
    const r = ec.raices.slice().sort((u, v) => Math.abs(u) - Math.abs(v) || v - u)[0];
    const s0 = A, s1 = s0 * r + B, s2 = s1 * r + C;
    const divs = divisores(D).map(d => `\\pm ${d}`).join(',\\ ');
    const ruffini = `\\begin{array}{r|rrrr} & ${n(A)} & ${n(B)} & ${n(C)} & ${n(D)} \\\\ ${n(r)} & & ${n(s0 * r)} & ${n(s1 * r)} & ${n(s2 * r)} \\\\ \\hline & ${n(s0)} & ${n(s1)} & ${n(s2)} & 0 \\end{array}`;
    const sol = resolverCuadratica(s0, s1, s2);
    const todas = [fr(r, 1), ...sol.raices].sort((u, v) => u.n / u.d - v.n / v.d);
    return {
      enun: `${pol} = 0`,
      pasos: [
        { t: `Las posibles raíces enteras son los divisores del término independiente (${n(D).replace('-', '−')}):`, m: divs },
        { t: `Aplicamos la regla de Ruffini. Con \\(x = ${n(r)}\\) el resto es 0, así que es raíz:`, m: ruffini },
        { t: 'Factorizamos el polinomio:', m: `${pol} = (${bin(1, -r)})(${cuad(s0, s1, s2)})` },
        { t: `Resolvemos la ecuación de segundo grado \\(${cuad(s0, s1, s2)} = 0\\):` },
        ...sol.pasos
      ],
      res: todas.map((f, i) => `x_${i + 1} = ${frac(f)}`).join(',\\quad ')
    };
  }

  registrarFicha({
    id: 'ec-3-grado',
    titulo: 'Ecuaciones de tercer grado',
    detalle: 'Método de Ruffini',
    grupo: 'Polinomios y ecuaciones',
    enlace: '../ecuaciones/ec-3-grado.html',
    ejercicios: [
      { id: 'ruffini', nombre: 'Ecuación de tercer grado con Ruffini', peso: 2, columnas: 2,
        enunciado: ['Resuelve la siguiente ecuación de tercer grado:', 'Resuelve las siguientes ecuaciones de tercer grado:'],
        generar: tercerGrado }
    ]
  });
})();
