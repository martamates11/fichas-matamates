/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: determinantes y matriz inversa (2.º Bachillerato).
   Los números se generan con los mismos criterios que las fichas interactivas. */
(function () {
  'use strict';
  const { fr, tex, registrarFicha } = window.EX;
  const { n, frac, matriz } = tex;

  /* ---------- Polinomios en a (índice = exponente) ---------- */
  const G = 9;
  const P0 = () => new Array(G + 1).fill(0);
  const mono = (c, e) => { const q = P0(); q[e] = c; return q; };
  const suma = (x, y) => x.map((v, i) => v + y[i]);
  const resta = (x, y) => x.map((v, i) => v - y[i]);
  const prod = (x, y) => {
    const r = P0();
    for (let i = 0; i <= G; i++) if (x[i]) for (let j = 0; i + j <= G; j++) if (y[j]) r[i + j] += x[i] * y[j];
    return r;
  };
  const esCero = q => q.every(v => v === 0);
  const iguales = (x, y) => x.every((v, i) => v === y[i]);
  const grado = q => { for (let i = G; i >= 0; i--) if (q[i]) return i; return -1; };
  const nTerm = q => q.filter(v => v !== 0).length;

  function fmt(q) {
    const t = [];
    for (let e = G; e >= 0; e--) {
      const c = q[e]; if (!c) continue;
      const abs = Math.abs(c);
      const cuerpo = e === 0 ? String(abs) : (abs === 1 ? '' : abs) + 'a' + (e >= 2 ? `^{${e}}` : '');
      t.push((t.length ? (c < 0 ? ' - ' : ' + ') : (c < 0 ? '-' : '')) + cuerpo);
    }
    return t.length ? t.join('') : '0';
  }
  const fmtPar = q => { const s = fmt(q); return (nTerm(q) > 1 || s.startsWith('-')) ? `(${s})` : s; };
  /* Suma de valores escrita con signos naturales: −6 + 20 − 3 */
  function sumaTeX(lista) {
    return lista.map((q, i) => {
      if (i === 0) return fmt(q);
      if (nTerm(q) > 1) return ` + (${fmt(q)})`;
      const s = fmt(q);
      return s.startsWith('-') ? ` - ${s.slice(1)}` : ` + ${s}`;
    }).join('');
  }
  const total = lista => lista.reduce((acc, q) => suma(acc, q), P0());

  /* ---------- Sarrus ---------- */
  const MAS = [[[0, 0], [1, 1], [2, 2]], [[0, 1], [1, 2], [2, 0]], [[0, 2], [1, 0], [2, 1]]];
  const MENOS = [[[0, 2], [1, 1], [2, 0]], [[0, 0], [1, 2], [2, 1]], [[0, 1], [1, 0], [2, 2]]];
  const prodDe = (M, idx) => idx.reduce((acc, [r, c]) => prod(acc, M[r][c]), mono(1, 0));
  const factoresTeX = (M, idx) => idx.map(([r, c]) => fmtPar(M[r][c])).join(' \\cdot ');

  function pasosSarrus(M, etiqueta) {
    const sum = MAS.map(t => prodDe(M, t)), res = MENOS.map(t => prodDe(M, t));
    const S = total(sum), T = total(res), det = resta(S, T);
    const pasos = [
      { t: 'Regla de Sarrus. Productos que suman (diagonal principal y sus paralelas):',
        m: `\\begin{aligned} &${MAS.map(t => factoresTeX(M, t)).join(' + ')} \\\\ &= ${sumaTeX(sum)} = ${fmt(S)} \\end{aligned}` },
      { t: 'Productos que restan (diagonal secundaria y sus paralelas):',
        m: `\\begin{aligned} &${MENOS.map(t => factoresTeX(M, t)).join(' + ')} \\\\ &= ${sumaTeX(res)} = ${fmt(T)} \\end{aligned}` },
      { t: 'Restamos:', m: `${etiqueta ? etiqueta + ' = ' : ''}${fmtPar(S)} - ${fmtPar(T)} = ${fmt(det)}` }
    ];
    return { pasos, det, sum, res };
  }

  /* ---------- Determinantes (criterios de la ficha) ---------- */
  function det2x2(R) {
    for (let k = 0; k < 500; k++) {
      const cuantas = R.pick([1, 2, 2, 2, 3]);
      const conA = new Set(R.shuffle([0, 1, 2, 3]).slice(0, cuantas));
      const M = [[null, null], [null, null]];
      for (let i = 0; i < 4; i++) M[i >> 1][i % 2] = conA.has(i) ? mono(R.nz(-5, 5), 1) : mono(R.nz(-6, 6), 0);
      const pr = prod(M[0][0], M[1][1]), se = prod(M[0][1], M[1][0]), det = resta(pr, se);
      if (esCero(det) || grado(det) < 1 || iguales(pr, se)) continue;
      const vm = matriz(M, 'vmatrix', fmt);
      return {
        enun: vm,
        pasos: [{ t: 'Producto de la diagonal principal menos producto de la diagonal secundaria:',
          m: `${vm} = ${fmtPar(M[0][0])} \\cdot ${fmtPar(M[1][1])} - ${fmtPar(M[0][1])} \\cdot ${fmtPar(M[1][0])} = ${fmt(pr)} - ${fmtPar(se)} = ${fmt(det)}` }],
        res: fmt(det)
      };
    }
  }

  function det3x3(R, conParametro) {
    for (let k = 0; k < 2000; k++) {
      const M = [];
      let ceros = 0;
      const conA = conParametro ? new Set(R.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, R.int(3, 4))) : new Set();
      for (let r = 0; r < 3; r++) {
        M.push([]);
        for (let c = 0; c < 3; c++) {
          if (conA.has(r * 3 + c)) { M[r].push(mono(R.nz(-3, 3), 1)); continue; }
          const v = conParametro ? R.int(-4, 4) : R.int(-5, 5);
          if (v === 0) ceros++;
          M[r].push(mono(v, 0));
        }
      }
      if (ceros > 1) continue;
      const s = pasosSarrus(M);
      if (esCero(s.det)) continue;
      if (conParametro && (grado(s.det) < 2 || nTerm(s.det) < 2)) continue;
      return { enun: matriz(M, 'vmatrix', fmt), pasos: s.pasos, res: fmt(s.det) };
    }
  }

  registrarFicha({
    id: 'determinantes',
    titulo: 'Cálculo de determinantes',
    detalle: '2.º Bachillerato',
    grupo: 'Matrices y determinantes',
    enlace: '../matrices/determinantes.html',
    ejercicios: [
      { id: '2x2-parametro', nombre: 'Determinante 2×2 con parámetro', peso: 1, columnas: 3,
        enunciado: ['Calcula, en función de \\(a\\), el siguiente determinante:', 'Calcula, en función de \\(a\\), los siguientes determinantes:'],
        generar: det2x2 },
      { id: '3x3-enteros', nombre: 'Determinante 3×3 con números enteros', peso: 1.5, columnas: 3,
        enunciado: ['Calcula el siguiente determinante:', 'Calcula los siguientes determinantes:'],
        generar: R => det3x3(R, false) },
      { id: '3x3-parametro', nombre: 'Determinante 3×3 con parámetro', peso: 2, columnas: 2,
        enunciado: ['Calcula, en función de \\(a\\), el siguiente determinante:', 'Calcula, en función de \\(a\\), los siguientes determinantes:'],
        generar: R => det3x3(R, true) }
    ]
  });

  /* ---------- Matriz inversa 3×3 (criterios de la ficha) ---------- */
  const det2 = m => m[0][0] * m[1][1] - m[0][1] * m[1][0];
  const menor = (m, i, j) => m.filter((_, r) => r !== i).map(f => f.filter((_, c) => c !== j));
  const det3 = m => m[0][0] * det2(menor(m, 0, 0)) - m[0][1] * det2(menor(m, 0, 1)) + m[0][2] * det2(menor(m, 0, 2));
  const trasp = m => m[0].map((_, j) => m.map(f => f[j]));
  const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

  function inversa(R, indice) {
    let A = null;
    for (let k = 0; k < 50000 && !A; k++) {
      const M = [0, 1, 2].map(() => [0, 1, 2].map(() => R.int(-3, 3)));
      if (M.flat().filter(x => x === 0).length > 3) continue;
      const d = det3(M);
      if (d === 0 || Math.abs(d) > 6) continue;
      if (Math.abs(d) === 1 && R.rand() < 0.7) continue;
      A = M;
    }
    A = A || [[2, 1, 0], [1, 2, 1], [0, 1, 2]];
    const L = LETRAS[indice] || 'A';
    const d = det3(A);
    const s = pasosSarrus(A.map(f => f.map(v => mono(v, 0))), `|${L}|`);
    s.pasos[0].t = '1) Determinante por la regla de Sarrus. Productos que suman:';

    const adj = A.map((f, i) => f.map((_, j) => ((i + j) % 2 ? -1 : 1) * det2(menor(A, i, j)) + 0));
    const celdas = [];
    for (let i = 0; i < 3; i++) {
      const filas = [];
      for (let j = 0; j < 3; j++) {
        const sg = (i + j) % 2 ? '-' : '+';
        filas.push(`${L}_{${i + 1}${j + 1}} = ${sg}${matriz(menor(A, i, j), 'vmatrix')} = ${n(adj[i][j])}`);
      }
      celdas.push(filas.join(' & '));
    }
    const tra = trasp(adj);
    const inv = tra.map(f => f.map(v => fr(v, d)));
    return {
      enun: `${L} = ${matriz(A)}`,
      pasos: [
        ...s.pasos,
        { t: `Como \\(|${L}| = ${n(d)} \\neq 0\\), la matriz tiene inversa.` },
        { t: '2) Calculamos los adjuntos de cada elemento:', m: `\\begin{array}{lll} ${celdas.join(' \\\\[8pt] ')} \\end{array}` },
        { t: '3) Matriz adjunta y su traspuesta:', m: `\\text{Adj}(${L}) = ${matriz(adj)} \\qquad (\\text{Adj}\\,${L})^t = ${matriz(tra)}` },
        { t: '4) Dividimos entre el determinante:', m: `${L}^{-1} = \\frac{1}{|${L}|}\\,(\\text{Adj}\\,${L})^t = \\frac{1}{${n(d)}}${matriz(tra)} = ${matriz(inv, 'pmatrix', frac)}` }
      ],
      res: `${L}^{-1} = ${matriz(inv, 'pmatrix', frac)}`
    };
  }

  registrarFicha({
    id: 'inversa',
    titulo: 'Cálculo de la matriz inversa',
    detalle: '2.º Bachillerato',
    grupo: 'Matrices y determinantes',
    enlace: '../matrices/inversa.html',
    ejercicios: [
      { id: 'inversa-3x3', nombre: 'Inversa de una matriz 3×3 (adjuntos)', peso: 2.5, columnas: 2,
        enunciado: ['Calcula, si existe, la matriz inversa de:', 'Calcula, si existen, las matrices inversas de:'],
        generar: inversa }
    ]
  });
})();
