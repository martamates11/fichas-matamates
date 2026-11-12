/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: los cinco tipos de la ficha ecuacion-matricial
   (AX = B de orden 3, XA = B, AX = B − kX, XAB = A + XB y AXB = C)
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
  const maxAbs = M => Math.max(...M.flat().map(Math.abs));
  const ceros = M => M.flat().filter(x => x === 0).length;
  const iguales = (A, B) => A.every((f, i) => f.every((x, j) => Math.abs(x - B[i][j]) < 1e-9));
  const esEntera = M => M.every(f => f.every(x => Math.abs(x - Math.round(x)) < 1e-9));
  const noTrivial2 = M => ceros(M) <= 1 && (M[0][1] !== 0 || M[1][0] !== 0) && !iguales(M, eye(2)) && !iguales(M, esc(-1, eye(2)));
  const pm = (M, cel) => matriz(M, 'pmatrix', cel);

  /* ---------- Álgebra general (órdenes 2 y 3) ---------- */
  const add = (A, B) => A.map((f, i) => f.map((x, j) => x + B[i][j]));
  const tr = M => M[0].map((_, j) => M.map(f => f[j]));
  const quitar = (M, i, j) => M.filter((_, r) => r !== i).map(f => f.filter((_, c) => c !== j));
  const det = M => (M.length === 2 ? det2(M) : M[0].reduce((s, x, j) => s + (j % 2 ? -1 : 1) * x * det2(quitar(M, 0, j)), 0));
  const menorC = (M, i, j) => (M.length === 2 ? M[1 - i][1 - j] : det2(quitar(M, i, j)));
  const adjuntos = M => M.map((f, i) => f.map((_, j) => ((i + j) % 2 ? -1 : 1) * menorC(M, i, j) + 0));
  const adjT = M => tr(adjuntos(M));
  const noTrivial3 = M => ceros(M) <= 3 && M.flat().filter((x, k) => k % 4 !== 0 && x !== 0).length >= 3;
  const DETS = [1, -1, 2, -2, 3, -3];
  function genInvertible2(R, lo, hi, dets) {
    for (let t = 0; t < 5000; t++) {
      const M = randMat(R, 2, 2, lo, hi);
      if (dets.includes(det2(M)) && noTrivial2(M)) return M;
    }
    return [[2, 1], [1, 1]];
  }
  function genX(R, f, c, lo, hi) {
    for (let t = 0; t < 1000; t++) {
      const X = randMat(R, f, c, lo, hi);
      if (ceros(X) <= 1 && maxAbs(X) > 1) return X;
    }
    return randMat(R, f, c, 1, 3);
  }
  const redondear = M => M.map(f => f.map(x => Math.round(x) + 0));

  /* Pasos para invertir M: determinante, traspuesta de la adjunta e inversa.
     nom es el nombre en TeX (A, A + 2I, AB - B…). */
  function pasosInversa(M, nom) {
    const d = det(M), aT = adjT(M), inv = aT.map(f => f.map(x => fr(x, d)));
    const et = nom.length > 1 ? `(${nom})` : nom;
    const pasos = [];
    if (M.length === 2) {
      pasos.push({ t: `Determinante de \\(${nom}\\) (si fuera 0, no existiría la inversa):`,
        m: `|${nom}| = ${p(M[0][0])} \\cdot ${p(M[1][1])} - ${p(M[0][1])} \\cdot ${p(M[1][0])} = ${n(d)} \\neq 0` });
      pasos.push({ t: 'Traspuesta de la adjunta (se intercambia la diagonal principal y se cambia de signo la secundaria):',
        m: `\\text{Adj}(${nom})^t = ${pm(aT)}` });
    } else {
      const P = [M[0][0] * M[1][1] * M[2][2], M[0][1] * M[1][2] * M[2][0], M[0][2] * M[1][0] * M[2][1]];
      const N = [M[0][2] * M[1][1] * M[2][0], M[0][0] * M[1][2] * M[2][1], M[0][1] * M[1][0] * M[2][2]];
      const sP = P[0] + P[1] + P[2], sN = N[0] + N[1] + N[2];
      pasos.push({ t: `Determinante de \\(${nom}\\) por la regla de Sarrus (si fuera 0, no existiría la inversa):`,
        m: `|${nom}| = (${n(P[0])} + ${p(P[1])} + ${p(P[2])}) - (${n(N[0])} + ${p(N[1])} + ${p(N[2])}) = ${n(sP)} - ${p(sN)} = ${n(d)} \\neq 0` });
      pasos.push({ t: 'Matriz de adjuntos, \\(A_{ij} = (-1)^{i+j} M_{ij}\\), y su traspuesta:',
        m: `\\text{Adj}(${nom}) = ${pm(adjuntos(M))} \\qquad \\text{Adj}(${nom})^t = ${pm(aT)}` });
    }
    const fracDet = d === 1 ? '' : d === -1 ? '-' : (d < 0 ? '-' : '') + `\\frac{1}{${Math.abs(d)}}`;
    pasos.push({ t: 'Inversa:',
      m: `${et}^{-1} = \\frac{1}{|${nom}|}\\,\\text{Adj}(${nom})^t = ${d === 1 ? pm(inv, frac) : `${fracDet}${pm(aT)} = ${pm(inv, frac)}`}` });
    return { pasos, inv };
  }

  /* ================= Tipo 1: AX = B (orden 3) ================= */
  function axB3(R) {
    let A, X, B;
    for (let t = 0; t < 20000; t++) {
      A = randMat(R, 3, 3, -2, 3);
      if (![1, -1, 2, -2].includes(det(A)) || !noTrivial3(A) || maxAbs(adjT(A)) > 9) continue;
      X = genX(R, 3, 2, -3, 4);
      B = mul(A, X);
      if (maxAbs(B) <= 16) break;
    }
    const inv = pasosInversa(A, 'A');
    return {
      enun: `AX = B, \\quad \\text{siendo} \\quad A = ${pm(A)}, \\quad B = ${pm(B)}`,
      pasos: [
        { t: 'Despejamos X multiplicando por \\(A^{-1}\\) por la izquierda en ambos miembros:',
          m: `A^{-1}AX = A^{-1}B \\;\\Rightarrow\\; X = A^{-1}B` },
        ...inv.pasos,
        { t: 'Multiplicamos la inversa por B, en este orden:', m: `X = A^{-1}B = ${pm(inv.inv, frac)}${pm(B)} = ${pm(X)}` }
      ],
      res: `X = ${pm(X)}`
    };
  }

  /* ================= Tipo 2: XA = B ================= */
  function xaB(R) {
    let A, X, B, d;
    for (let t = 0; t < 5000; t++) {
      A = genInvertible2(R, -3, 4, DETS); d = det2(A);
      X = genX(R, 2, 2, -3, 4);
      B = mul(X, A);
      if (maxAbs(B) <= 20 && !iguales(esc(1 / d, mul(adjT(A), B)), X)) break;
    }
    const inv = pasosInversa(A, 'A');
    return {
      enun: `XA = B, \\quad \\text{siendo} \\quad A = ${pm(A)}, \\quad B = ${pm(B)}`,
      pasos: [
        { t: 'Despejamos X multiplicando por \\(A^{-1}\\) por la derecha en ambos miembros:',
          m: `XAA^{-1} = BA^{-1} \\;\\Rightarrow\\; X = B\\,A^{-1}` },
        ...inv.pasos,
        { t: 'Multiplicamos B por la inversa, en este orden:', m: `X = B\\,A^{-1} = ${pm(B)}${pm(inv.inv, frac)} = ${pm(X)}` }
      ],
      res: `X = ${pm(X)}`
    };
  }

  /* ================= Tipo 3: AX = B − kX ================= */
  function axBkX(R) {
    let A, M, X, B, k, d;
    for (let t = 0; t < 5000; t++) {
      k = R.int(1, 3);
      A = randMat(R, 2, 2, -3, 3);
      if (!noTrivial2(A)) continue;
      M = add(A, esc(k, eye(2)));
      d = det2(M);
      if (!DETS.includes(d) || det2(A) === d || ceros(M) > 1) continue;
      X = genX(R, 2, 2, -3, 4);
      B = mul(M, X);
      if (maxAbs(B) <= 20 && !iguales(esc(1 / d, mul(B, adjT(M))), X)) break;
    }
    const kX = k === 1 ? 'X' : `${k}X`, kI = k === 1 ? 'I' : `${k}I`, nom = `A + ${kI}`;
    const inv = pasosInversa(M, nom);
    return {
      enun: `AX = B - ${kX}, \\quad \\text{siendo} \\quad A = ${pm(A)}, \\quad B = ${pm(B)}`,
      pasos: [
        { t: `Pasamos \\(${kX}\\) al primer miembro y sacamos X factor común por la derecha (\\(${kX} = ${kI}\\,X\\)):`,
          m: `AX + ${kX} = B \\;\\Rightarrow\\; (${nom})\\,X = B \\;\\Rightarrow\\; X = (${nom})^{-1}B` },
        { t: `Calculamos \\(${nom}\\) (\\(${kI}\\) solo suma en la diagonal principal):`,
          m: `${nom} = ${pm(A)} + ${pm(esc(k, eye(2)))} = ${pm(M)}` },
        ...inv.pasos,
        { t: 'Multiplicamos la inversa por B, en este orden:', m: `X = (${nom})^{-1}B = ${pm(inv.inv, frac)}${pm(B)} = ${pm(X)}` }
      ],
      res: `X = ${pm(X)}`
    };
  }

  /* ================= Tipo 4: XAB = A + XB ================= */
  function xabAxb(R) {
    let A, B, M, X, d;
    for (let t = 0; t < 20000; t++) {
      A = randMat(R, 2, 2, -2, 3);
      B = randMat(R, 2, 2, -2, 3);
      if (!noTrivial2(A) || !noTrivial2(B)) continue;
      M = sub(mul(A, B), B);
      d = det2(M);
      if (!DETS.includes(d) || maxAbs(M) > 10 || ceros(M) > 1) continue;
      X = esc(1 / d, mul(A, adjT(M)));
      if (!esEntera(X)) continue;
      X = redondear(X);
      if (maxAbs(X) > 10 || maxAbs(X) === 0 || ceros(X) > 1) continue;
      if (iguales(esc(1 / d, mul(adjT(M), A)), X)) continue;
      break;
    }
    const AB = mul(A, B), inv = pasosInversa(M, 'AB - B');
    return {
      enun: `XAB = A + XB, \\quad \\text{siendo} \\quad A = ${pm(A)}, \\quad B = ${pm(B)}`,
      pasos: [
        { t: 'Despejamos X. Pasamos XB al primer miembro y sacamos X factor común por la izquierda:',
          m: `XAB - XB = A \\;\\Rightarrow\\; X(AB - B) = A \\;\\Rightarrow\\; X = A\\,(AB - B)^{-1}` },
        { t: 'Calculamos AB y, después, AB − B:', m: `AB = ${pm(A)}${pm(B)} = ${pm(AB)} \\qquad AB - B = ${pm(M)}` },
        ...inv.pasos,
        { t: 'Multiplicamos A por la inversa, en este orden:', m: `X = A\\,(AB - B)^{-1} = ${pm(A)}${pm(inv.inv, frac)} = ${pm(X)}` }
      ],
      res: `X = ${pm(X)}`
    };
  }

  /* ================= Tipo 5: AXB = C ================= */
  function axbC(R) {
    let A, B, X, C;
    for (let t = 0; t < 5000; t++) {
      A = genInvertible2(R, -2, 3, [1, -1, 2, -2]);
      B = genInvertible2(R, -2, 3, [1, -1, 2, -2]);
      if (iguales(A, B)) continue;
      X = genX(R, 2, 2, -2, 3);
      C = mul(mul(A, X), B);
      const alReves = esc(1 / (det2(A) * det2(B)), mul(mul(adjT(B), C), adjT(A)));
      if (maxAbs(C) <= 30 && !iguales(alReves, X)) break;
    }
    const iA = pasosInversa(A, 'A'), iB = pasosInversa(B, 'B');
    const dA = det2(A), AiCf = mul(adjT(A), C).map(f => f.map(x => fr(x, dA)));
    return {
      enun: `AXB = C, \\quad \\text{siendo} \\quad A = ${pm(A)}, \\quad B = ${pm(B)}, \\quad C = ${pm(C)}`,
      pasos: [
        { t: 'Despejamos X: multiplicamos por \\(A^{-1}\\) por la izquierda y por \\(B^{-1}\\) por la derecha en ambos miembros:',
          m: `A^{-1}AXBB^{-1} = A^{-1}CB^{-1} \\;\\Rightarrow\\; X = A^{-1}\\,C\\,B^{-1}` },
        ...iA.pasos,
        ...iB.pasos,
        { t: 'Multiplicamos en este orden: primero \\(A^{-1}C\\) y el resultado por \\(B^{-1}\\):',
          m: `A^{-1}C = ${pm(iA.inv, frac)}${pm(C)} = ${pm(AiCf, frac)} \\qquad X = ${pm(AiCf, frac)}${pm(iB.inv, frac)} = ${pm(X)}` }
      ],
      res: `X = ${pm(X)}`
    };
  }

  const ENUN = ['Resuelve la siguiente ecuación matricial:', 'Resuelve las siguientes ecuaciones matriciales:'];
  registrarFicha({
    id: 'ecuacion-matricial',
    titulo: 'Ecuaciones matriciales',
    detalle: '2.º Bachillerato',
    grupo: 'Ecuaciones matriciales y sistemas',
    enlace: '../sistemas-ec-matriciales/ecuacion-matricial.html',
    ejercicios: [
      { id: 'ax-b-3', nombre: 'AX = B (orden 3)', peso: 2.5, columnas: 1, enunciado: ENUN, generar: axB3 },
      { id: 'xa-b', nombre: 'XA = B', peso: 1.5, columnas: 1, enunciado: ENUN, generar: xaB },
      { id: 'ax-b-kx', nombre: 'AX = B − kX', peso: 2, columnas: 1, enunciado: ENUN, generar: axBkX },
      { id: 'xab-a-xb', nombre: 'XAB = A + XB', peso: 2.5, columnas: 1, enunciado: ENUN, generar: xabAxb },
      { id: 'axb-c', nombre: 'AXB = C', peso: 2.5, columnas: 1, enunciado: ENUN, generar: axbC }
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
