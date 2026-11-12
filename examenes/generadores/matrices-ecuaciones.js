/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: ecuación matricial XAB = A + XB (ficha ecuacion-matricial)
   e inversa con parámetro (ficha matrices-y-determinantes, tipo 3).
   Los números se generan con los mismos criterios que las fichas interactivas. */
(function () {
  'use strict';
  const { fr, tex, registrarFicha } = window.EX;
  const { n, p, frac, poli, matriz } = tex;

  /* ---------- Álgebra de matrices ---------- */
  const randMat = (R, f, c, lo, hi) => Array.from({ length: f }, () => Array.from({ length: c }, () => R.int(lo, hi)));
  const eye = k => Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => (i === j ? 1 : 0)));
  const mul = (A, B) => A.map(f => B[0].map((_, j) => f.reduce((s, x, k) => s + x * B[k][j], 0)));
  const sub = (A, B) => A.map((f, i) => f.map((x, j) => x - B[i][j]));
  const esc = (k, A) => A.map(f => f.map(x => k * x));
  const det2 = M => M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const adjT2 = M => [[M[1][1], -M[0][1] + 0], [-M[1][0] + 0, M[0][0]]];
  const maxAbs = M => Math.max(...M.flat().map(Math.abs));
  const ceros = M => M.flat().filter(x => x === 0).length;
  const iguales = (A, B) => A.every((f, i) => f.every((x, j) => Math.abs(x - B[i][j]) < 1e-9));
  const esEntera = M => M.every(f => f.every(x => Math.abs(x - Math.round(x)) < 1e-9));
  const noTrivial2 = M => ceros(M) <= 1 && (M[0][1] !== 0 || M[1][0] !== 0) && !iguales(M, eye(2)) && !iguales(M, esc(-1, eye(2)));
  const pm = (M, cel) => matriz(M, 'pmatrix', cel);

  /* ================= XAB = A + XB ================= */
  function xabAxb(R) {
    let A, B, M, X, d;
    for (let t = 0; t < 20000; t++) {
      A = randMat(R, 2, 2, -2, 3);
      B = randMat(R, 2, 2, -2, 3);
      if (!noTrivial2(A) || !noTrivial2(B)) continue;
      M = sub(mul(A, B), B);
      d = det2(M);
      if (![1, -1, 2, -2, 3, -3].includes(d) || maxAbs(M) > 10 || ceros(M) > 1) continue;
      X = esc(1 / d, mul(A, adjT2(M)));
      if (!esEntera(X)) continue;
      X = X.map(f => f.map(x => Math.round(x) + 0));
      if (maxAbs(X) > 10 || maxAbs(X) === 0 || ceros(X) > 1) continue;
      if (iguales(esc(1 / d, mul(adjT2(M), A)), X)) continue;
      break;
    }
    const AB = mul(A, B), aT = adjT2(M);
    const inv = aT.map(f => f.map(x => fr(x, d)));
    const fracDet = d === 1 ? '' : d === -1 ? '-' : (d < 0 ? '-' : '') + `\\frac{1}{${Math.abs(d)}}`;
    return {
      enun: `XAB = A + XB, \\quad \\text{siendo} \\quad A = ${pm(A)}, \\quad B = ${pm(B)}`,
      pasos: [
        { t: 'Despejamos X. Pasamos XB al primer miembro y sacamos X factor común por la izquierda:',
          m: `XAB - XB = A \\;\\Rightarrow\\; X(AB - B) = A \\;\\Rightarrow\\; X = A\\,(AB - B)^{-1}` },
        { t: 'Calculamos AB y, después, AB − B:', m: `AB = ${pm(A)}${pm(B)} = ${pm(AB)} \\qquad AB - B = ${pm(M)}` },
        { t: 'Determinante (si fuera 0, no existiría la inversa):',
          m: `|AB - B| = ${p(M[0][0])} \\cdot ${p(M[1][1])} - ${p(M[0][1])} \\cdot ${p(M[1][0])} = ${n(d)} \\neq 0` },
        { t: 'Traspuesta de la adjunta (se intercambia la diagonal principal y se cambia de signo la secundaria) e inversa:',
          m: `\\text{Adj}(AB - B)^t = ${pm(aT)} \\qquad (AB - B)^{-1} = ${d === 1 ? pm(inv, frac) : `${fracDet}${pm(aT)} = ${pm(inv, frac)}`}` },
        { t: 'Multiplicamos A por la inversa, en este orden:', m: `X = A\\,(AB - B)^{-1} = ${pm(A)}${pm(inv, frac)} = ${pm(X)}` }
      ],
      res: `X = ${pm(X)}`
    };
  }

  registrarFicha({
    id: 'ecuacion-matricial',
    titulo: 'Ecuaciones matriciales',
    detalle: '2.º Bachillerato',
    grupo: 'Ecuaciones matriciales y sistemas',
    enlace: '../sistemas-ec-matriciales/ecuacion-matricial.html',
    ejercicios: [
      { id: 'xab-a-xb', nombre: 'XAB = A + XB', peso: 2.5, columnas: 1,
        enunciado: ['Resuelve la siguiente ecuación matricial:', 'Resuelve las siguientes ecuaciones matriciales:'],
        generar: xabAxb }
    ]
  });

  /* ================= Inversa con parámetro (3×3, Sarrus) ================= */
  const SARRUS = [[1, [[0, 0], [1, 1], [2, 2]]], [1, [[0, 1], [1, 2], [2, 0]]], [1, [[0, 2], [1, 0], [2, 1]]],
                  [-1, [[0, 2], [1, 1], [2, 0]]], [-1, [[0, 0], [1, 2], [2, 1]]], [-1, [[0, 1], [1, 0], [2, 2]]]];
  function construir(v, pos, modo, obj) {
    let cof = 0, rest = 0;
    for (const [sg, cells] of SARRUS) {
      let prod = sg, conK = false;
      for (const [i, j] of cells) { if (i * 3 + j === pos) conK = true; else prod *= v[i * 3 + j]; }
      if (conK) cof += prod; else rest += prod;
    }
    return { v, pos, modo, obj, cof, rest, k: cof !== 0 ? fr(obj - rest, cof) : null };
  }
  function generarT3(R) {
    for (let t = 0; t < 800; t++) {
      const v = Array.from({ length: 9 }, () => R.int(-3, 3)), pos = R.int(0, 8);
      if (v.filter((x, i) => i !== pos && x === 0).length > 2) continue;
      const modo = R.rand() < 0.7 ? 'inv' : 'det', obj = modo === 'det' ? R.nz(-4, 4) : 0;
      const d = construir(v, pos, modo, obj);
      if (d.cof === 0 || Math.abs(d.cof) > 12) continue;
      if (d.rest === obj) continue;
      if (Math.abs(d.k.n / d.k.d) > 12 || d.k.d > 6) continue;
      return d;
    }
    return construir([1, 2, 3, 4, 5, 6, 7, 8, 0], 8, 'inv', 0);
  }
  const lin = (c, r) => poli([[c, 'k'], [r, '']]);

  function inversaParametro(R) {
    const d = generarT3(R);
    const { v, pos, cof, rest, modo, obj, k } = d;
    const celda = (i, j) => (i * 3 + j === pos ? 'k' : n(v[i * 3 + j]));
    const M = [0, 1, 2].map(i => [0, 1, 2].map(j => celda(i, j)));
    const fac = (i, j) => (i * 3 + j === pos ? 'k' : p(v[i * 3 + j]));
    const P = [0, 0], N = [0, 0];
    const lineas = SARRUS.map(([sg, cells]) => {
      let prod = 1, conK = false;
      for (const [i, j] of cells) { if (i * 3 + j === pos) conK = true; else prod *= v[i * 3 + j]; }
      const acc = sg > 0 ? P : N; if (conK) acc[0] += prod; else acc[1] += prod;
      const val = conK ? lin(prod, 0) : n(prod);
      return `${sg > 0 ? '+' : '-'}\\;\\; & ${cells.map(([i, j]) => fac(i, j)).join(' \\cdot ')} = ${val}`;
    });
    const despeje = cof === 1 ? '' : ` \\;\\Rightarrow\\; k = ${frac(k)}`;
    const pregunta = modo === 'inv'
      ? '¿para qué valor de \\(k\\) la matriz \\(A\\) no tiene inversa?'
      : `¿para qué valor de \\(k\\) se cumple que \\(|A| = ${n(obj)}\\)?`;
    const pasos = [
      { t: 'Regla de Sarrus: los tres primeros productos se suman y los tres últimos se restan.',
        m: `\\begin{array}{rl} ${lineas.join(' \\\\ ')} \\end{array}` },
      { t: 'Agrupamos:', m: `|A| = (${lin(P[0], P[1])}) - (${lin(N[0], N[1])}) = ${lin(cof, rest)}` }
    ];
    if (modo === 'inv') {
      pasos.push({ t: 'A no tiene inversa si y solo si |A| = 0:', m: `${lin(cof, rest)} = 0 \\;\\Rightarrow\\; ${lin(cof, 0)} = ${n(-rest)}${despeje}` });
      pasos.push({ t: `Para cualquier otro valor de \\(k\\), \\(|A| \\neq 0\\) y A sí tiene inversa.` });
    } else {
      pasos.push({ t: `Igualamos el determinante a ${n(obj).replace('-', '−')}:`, m: `${lin(cof, rest)} = ${n(obj)} \\;\\Rightarrow\\; ${lin(cof, 0)} = ${n(obj - rest)}${despeje}` });
    }
    return {
      html: true,
      enun: `<span>Dada la matriz \\(A = ${pm(M)}\\), ${pregunta}</span>`,
      pasos,
      res: `k = ${frac(k)}`
    };
  }

  registrarFicha({
    id: 'matrices-y-determinantes',
    titulo: 'Matrices y determinantes',
    detalle: '2.º Bachillerato',
    grupo: 'Matrices y determinantes',
    enlace: '../matrices/matrices-y-determinantes.html',
    ejercicios: [
      { id: 'inversa-parametro', nombre: 'Inversa con parámetro', peso: 1.5, columnas: 2,
        enunciado: ['Responde a la siguiente cuestión:', 'Responde a las siguientes cuestiones:'],
        generar: inversaParametro }
    ]
  });
})();
