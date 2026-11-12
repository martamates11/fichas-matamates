/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: sistemas 3×3 de 2.º de Bachillerato.
   Fichas: método de Gauss, regla de Cramer y Rouché-Frobenius (SCD, SCI, SI).
   Los números se generan con los mismos criterios que las fichas interactivas. */
(function () {
  'use strict';
  const { fr, tex, registrarFicha } = window.EX;
  const { n, p, frac, poli, matriz } = tex;
  const VARS = ['x', 'y', 'z'];

  /* ---------- Fracciones exactas ---------- */
  const Q = {
    of: k => fr(k, 1),
    add: (a, b) => fr(a.n * b.d + b.n * a.d, a.d * b.d),
    sub: (a, b) => fr(a.n * b.d - b.n * a.d, a.d * b.d),
    mul: (a, b) => fr(a.n * b.n, a.d * b.d),
    div: (a, b) => fr(a.n * b.d, a.d * b.n),
    abs1: a => a.d === 1 && Math.abs(a.n) === 1,
    cero: a => a.n === 0
  };
  const fP = f => (f.n < 0 ? `\\left(${frac(f)}\\right)` : frac(f));

  /* ---------- Álgebra ---------- */
  const det3 = M => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  const sustCol = (A, b, k) => A.map((r, i) => r.map((v, j) => (j === k ? b[i] : v)));
  const mul = (L, U) => L.map(r => U[0].map((_, j) => r.reduce((s, v, k) => s + v * U[k][j], 0)));
  const dot = (r, x) => r.reduce((s, v, i) => s + v * x[i], 0);
  const maxAbs = a => Math.max(...a.map(Math.abs));
  const ceros = A => A.flat().filter(v => v === 0).length;

  /* ---------- Escritura ---------- */
  /* Sistema con cada incógnita en su columna y los signos en columnas propias */
  function filaTeX(r, bi) {
    const celdas = [];
    let primero = true;
    r.forEach((c, j) => {
      const cuerpo = c === 0 ? '' : (Math.abs(c) === 1 ? '' : Math.abs(c)) + VARS[j];
      if (j > 0) celdas.push(c === 0 || primero ? '' : `{}${c < 0 ? '-' : '+'}{}`);
      celdas.push(c === 0 ? '' : (primero && c < 0 ? '-' : '') + cuerpo);
      if (c !== 0) primero = false;
    });
    return `${celdas.join(' && ')} &&{}={}& {${n(bi)}}`;
  }
  const sistemaTeX = (A, b) => `\\left\\{\\begin{alignedat}{7} ${A.map((r, i) => filaTeX(r, b[i])).join(' \\\\ ')} \\end{alignedat}\\right.`;
  const ampTeX = M => `\\left(\\begin{array}{rrr|r} ${M.map(r => r.map(frac).join(' & ')).join(' \\\\ ')} \\end{array}\\right)`;
  const vm = M => matriz(M, 'vmatrix');
  /* |M| por Sarrus con los seis productos agrupados */
  function sarrus(M, nombre) {
    const P = [M[0][0] * M[1][1] * M[2][2], M[0][1] * M[1][2] * M[2][0], M[0][2] * M[1][0] * M[2][1]];
    const N = [M[0][2] * M[1][1] * M[2][0], M[0][0] * M[1][2] * M[2][1], M[0][1] * M[1][0] * M[2][2]];
    const sP = P[0] + P[1] + P[2], sN = N[0] + N[1] + N[2];
    return `${nombre} = ${vm(M)} = (${n(P[0])} + ${p(P[1])} + ${p(P[2])}) - (${n(N[0])} + ${p(N[1])} + ${p(N[2])}) = ${n(sP)} - ${p(sN)} = ${n(sP - sN)}`;
  }
  /* Operación elemental Fi ← Fi − k·Fj */
  function opTeX(i, k, j) {
    if (Q.cero(k)) return `F_${i}\\ \\text{se copia (ya tiene el 0)}`;
    const a = fr(Math.abs(k.n), k.d), c = Q.abs1(a) ? '' : frac(a) + '\\,';
    return `F_${i} \\leftarrow F_${i} ${k.n > 0 ? '-' : '+'} ${c}F_${j}`;
  }

  /* ---------- Eliminación de Gauss (criterios de la ficha) ----------
     Devuelve los pasos hasta la forma triangular y la matriz resultante (fracciones). */
  function escalonar(A, b) {
    const pasos = [];
    let M = A.map((r, i) => [...r, b[i]].map(Q.of));
    pasos.push({ t: 'Matriz ampliada del sistema:', m: ampTeX(M) });
    /* Pivote a11: mejor ±1; si no lo hay, el primer coeficiente de x no nulo */
    if (!Q.abs1(M[0][0])) {
      let k = M.findIndex(r => Q.abs1(r[0]));
      if (k === -1) k = M.findIndex(r => !Q.cero(r[0]));
      if (k > 0) {
        M = [M[k], ...M.filter((_, i) => i !== k)];
        pasos.push({ t: `Reordenamos las filas para que el pivote \\(a_{11}\\) ${Q.abs1(M[0][0]) ? 'valga ' + frac(M[0][0]) : 'no sea 0'}:`, m: ampTeX(M) });
      }
    }
    /* Paso 1 */
    const ops1 = [];
    for (let r = 1; r < 3; r++) {
      const f = Q.div(M[r][0], M[0][0]);
      ops1.push(opTeX(r + 1, f, 1));
      M[r] = M[r].map((v, c) => Q.sub(v, Q.mul(f, M[0][c])));
    }
    pasos.push({ t: 'Primera eliminación (pivote \\(a_{11}\\)): hacemos ceros en la columna de x.', m: `${ops1.join(', \\quad ')} \\qquad ${ampTeX(M)}` });
    /* Paso 2: se intercambian F2 y F3 si a22 = 0 o si así el pivote pasa a ser ±1 */
    const a22 = M[1][1], a32 = M[2][1];
    let swap = false;
    if (Q.cero(a22)) swap = !Q.cero(a32);
    else if (!Q.cero(a32) && !Q.abs1(a22) && Q.abs1(a32)) swap = true;
    if (swap) M = [M[0], M[2], M[1]];
    let op2;
    if (Q.cero(M[1][1])) op2 = 'F_3\\ \\text{se copia}';
    else {
      const f = Q.div(M[2][1], M[1][1]);
      op2 = opTeX(3, f, 2);
      M[2] = M[2].map((v, c) => Q.sub(v, Q.mul(f, M[1][c])));
    }
    pasos.push({ t: `Segunda eliminación (pivote \\(a_{22}\\)): hacemos cero en la columna de y de la fila 3${swap ? ', tras intercambiar las filas 2 y 3' : ''}.`,
      m: `${swap ? 'F_2 \\leftrightarrow F_3, \\quad ' : ''}${op2} \\qquad ${ampTeX(M)}` });
    return { pasos, M };
  }

  /* Ecuación de una fila triangular con las incógnitas ya conocidas sustituidas */
  function sustituida(fila, k, conocidas) {
    const t = [];
    for (let j = k; j < 3; j++) {
      const c = fila[j];
      if (Q.cero(c)) continue;
      const neg = c.n < 0, a = fr(Math.abs(c.n), c.d);
      let cuerpo;
      if (j === k) cuerpo = (Q.abs1(a) ? '' : frac(a)) + VARS[j];
      else cuerpo = (Q.abs1(a) ? '' : frac(a) + ' \\cdot ') + fP(conocidas[j]);
      t.push(t.length ? (neg ? ' - ' : ' + ') + cuerpo : (neg ? '-' : '') + cuerpo);
    }
    return `${t.join('')} = ${frac(fila[3])}`;
  }
  function sustitucionAtras(M) {
    const x = [];
    const lineas = [];
    for (let k = 2; k >= 0; k--) {
      let s = M[k][3];
      for (let j = k + 1; j < 3; j++) s = Q.sub(s, Q.mul(M[k][j], x[j]));
      x[k] = Q.div(s, M[k][k]);
      lineas.push(`${sustituida(M[k], k, x)} \\;\\Rightarrow\\; ${VARS[k]} = ${frac(x[k])}`);
    }
    return { paso: { t: 'Sustitución hacia atrás: despejamos z en la última ecuación, después y y, por último, x.', m: lineas.join(' \\\\ '), multilinea: true }, x };
  }
  const resSol = x => `x = ${frac(x[0])}, \\quad y = ${frac(x[1])}, \\quad z = ${frac(x[2])}`;

  /* ---------- Cramer ---------- */
  function pasosCramer(A, b) {
    const D = det3(A), Ds = [0, 1, 2].map(k => det3(sustCol(A, b, k)));
    const x = Ds.map(d => fr(d, D));
    return {
      pasos: [
        { t: 'Sustituimos cada columna de A por la de términos independientes y calculamos los determinantes:',
          m: [0, 1, 2].map(k => sarrus(sustCol(A, b, k), `|A_${VARS[k]}|`)).join(' \\\\ '), multilinea: true },
        { t: 'Regla de Cramer:',
          m: [0, 1, 2].map(k => `${VARS[k]} = \\frac{|A_${VARS[k]}|}{|A|} = \\frac{${n(Ds[k])}}{${n(D)}} = ${frac(x[k])}`).join(', \\qquad ') }
      ],
      x
    };
  }

  /* ================= Ficha: método de Gauss ================= */
  /* Banco de la ficha: 31 sistemas con a11 = 1 y 8 en los que conviene reordenar */
  const BANCO_GAUSS = [
    [[[1, 3, 1], [1, 2, 1], [1, 2, 3]], [10, 6, 6]], [[[1, 0, 1], [-2, 1, 3], [3, 2, 0]], [2, 0, 1]],
    [[[1, 1, 0], [1, 2, 1], [-2, 1, 0]], [-1, -2, 2]], [[[1, -2, 0], [-2, 1, -1], [-2, 3, -2]], [4, -11, -14]],
    [[[1, 1, -1], [2, 1, 3], [3, 2, 1]], [0, 9, 8]], [[[1, -1, 1], [-1, 3, 0], [0, 1, 2]], [1, -4, -3]],
    [[[1, 2, -1], [2, -1, 1], [1, 1, 2]], [5, 1, 8]], [[[1, -1, 1], [2, 1, 0], [1, 1, 3]], [2, 6, 10]],
    [[[1, 1, 3], [1, 1, -2], [2, 3, 0]], [4, 4, 9]], [[[1, 2, 1], [2, 3, 1], [1, 1, 2]], [8, 11, 7]],
    [[[1, -3, -2], [0, 1, -1], [1, 1, -1]], [0, -7, -8]], [[[1, -2, -2], [0, 1, 2], [-3, 1, -3]], [-2, 0, 4]],
    [[[1, 0, -1], [1, 1, -1], [1, -3, -3]], [2, 0, 12]], [[[1, 1, 2], [-2, -3, -2], [-1, -3, -2]], [3, -5, -5]],
    [[[1, 0, -2], [-2, -1, 0], [-3, -1, -1]], [2, -6, -8]], [[[1, -1, -1], [-1, 2, 2], [2, -1, 0]], [-5, 10, -1]],
    [[[1, -1, 1], [0, 3, -2], [-3, 2, -1]], [0, 11, -5]], [[[1, 2, 3], [-2, -2, 2], [0, 1, 0]], [8, -10, 3]],
    [[[1, -1, 2], [-2, 0, -1], [0, -1, -3]], [9, -6, -3]], [[[1, -1, -2], [0, -3, 2], [-1, 2, 0]], [-1, -9, 4]],
    [[[1, -1, 1], [-1, -1, -1], [2, -1, -2]], [3, -3, 10]], [[[1, -2, -3], [2, -1, -1], [1, -3, 1]], [2, -1, -2]],
    [[[1, 1, 0], [0, 3, -2], [-3, -2, 2]], [2, -7, -3]], [[[1, 0, 3], [-3, 2, -3], [0, -1, -1]], [-6, 14, -2]],
    [[[1, 2, -3], [1, 0, 3], [0, -1, 2]], [1, -5, -2]], [[[1, -1, -1], [-2, 0, -3], [-1, 2, -3]], [3, -4, -4]],
    [[[1, -1, -1], [-1, 1, -3], [-1, 2, 2]], [0, -4, 2]], [[[1, -1, 1], [-2, 2, -1], [-2, 3, 0]], [-7, 12, 12]],
    [[[1, 0, 1], [-1, 0, -2], [-1, 1, -2]], [1, -4, -2]], [[[1, -1, -1], [1, -1, 0], [0, -1, -3]], [0, 3, -6]],
    [[[1, 1, 3], [2, 2, -2], [1, 0, -2]], [-4, 0, 2]],
    [[[0, 1, 1], [1, -3, -2], [-3, 1, 3]], [2, -6, 12]], [[[0, -1, -3], [1, -1, -2], [2, 1, -2]], [9, 2, 5]],
    [[[0, 1, 2], [1, -3, 2], [2, 2, 3]], [3, 5, 0]],
    [[[2, 0, 1], [1, -1, -1], [-2, 3, -2]], [-2, 2, -7]], [[[2, -1, -3], [3, -1, -3], [-1, 1, 0]], [4, 7, -7]],
    [[[2, -3, 0], [-1, 1, 2], [-2, -2, 1]], [1, 1, 14]], [[[3, -1, -3], [1, -1, -2], [2, -3, 0]], [-11, -3, -5]],
    [[[3, 1, -1], [1, 0, -3], [-1, 2, -2]], [9, 5, 4]]
  ];
  function gauss(R) {
    const [A, b] = BANCO_GAUSS[R.int(0, BANCO_GAUSS.length - 1)];
    const esc = escalonar(A, b), atras = sustitucionAtras(esc.M);
    return { enun: sistemaTeX(A, b), pasos: [...esc.pasos, atras.paso], res: resSol(atras.x) };
  }
  registrarFicha({
    id: 'gauss',
    titulo: 'Método de Gauss',
    detalle: '2.º Bachillerato',
    grupo: 'Ecuaciones matriciales y sistemas',
    enlace: '../sistemas-ec-matriciales/gauss.html',
    ejercicios: [
      { id: 'gauss-3x3', nombre: 'Sistema 3×3 por el método de Gauss', peso: 2, columnas: 2,
        enunciado: ['Resuelve el siguiente sistema por el método de Gauss:', 'Resuelve los siguientes sistemas por el método de Gauss:'],
        generar: gauss }
    ]
  });

  /* ================= Ficha: regla de Cramer ================= */
  function cramer(R) {
    let A, b;
    for (let it = 0; it < 20000; it++) {
      const s = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)];
      if (s.filter(v => v === 0).length > 1 || (s[0] === s[1] && s[1] === s[2])) continue;
      const M = [0, 1, 2].map(() => [0, 1, 2].map(() => R.int(-4, 4)));
      if (ceros(M) > 1) continue;
      const D = det3(M);
      if (Math.abs(D) < 2 || Math.abs(D) > 40) continue;
      const bb = M.map(r => dot(r, s));
      if (maxAbs(bb) > 30) continue;
      A = M; b = bb; break;
    }
    const c = pasosCramer(A, b);
    return {
      enun: sistemaTeX(A, b),
      pasos: [
        { t: 'Determinante de la matriz de coeficientes (regla de Sarrus):', m: `${sarrus(A, '|A|')} \\neq 0` },
        { t: 'Como \\(|A| \\neq 0\\), el sistema es de Cramer: tiene solución única.' },
        ...c.pasos
      ],
      res: resSol(c.x)
    };
  }
  registrarFicha({
    id: 'cramer',
    titulo: 'Regla de Cramer',
    detalle: '2.º Bachillerato',
    grupo: 'Ecuaciones matriciales y sistemas',
    enlace: '../sistemas-ec-matriciales/cramer.html',
    ejercicios: [
      { id: 'cramer-3x3', nombre: 'Sistema 3×3 por la regla de Cramer', peso: 2, columnas: 2,
        enunciado: ['Resuelve el siguiente sistema por la regla de Cramer:', 'Resuelve los siguientes sistemas por la regla de Cramer:'],
        generar: cramer }
    ]
  });

  /* ================= Ficha: Rouché-Frobenius ================= */
  const NZ3 = [-3, -2, -1, 1, 2, 3], NZ2 = [-2, -1, 1, 2];
  /* SCD: A = L·U con L unitaria → |A| ≠ 0 y solución entera */
  function genSCD(R) {
    for (let k = 0; k < 20000; k++) {
      const l21 = R.int(-2, 2), l31 = R.int(-2, 2), l32 = R.pick(NZ2);
      if (l21 === 0 && l31 === 0) continue;
      const u12 = R.int(-3, 3), u13 = R.int(-3, 3), u22 = R.pick([-2, -1, -1, 1, 1, 2]), u23 = R.pick(NZ3), u33 = R.pick(NZ3);
      if (l32 * u23 + u33 === 0) continue;
      const A = mul([[1, 0, 0], [l21, 1, 0], [l31, l32, 1]], [[1, u12, u13], [0, u22, u23], [0, 0, u33]]);
      if (maxAbs(A.flat()) > 6 || ceros(A) > 2) continue;
      const sol = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)];
      if (sol.filter(v => v === 0).length > 1) continue;
      const b = A.map(r => dot(r, sol));
      if (maxAbs(b) > 20) continue;
      return { A, b };
    }
    return { A: [[1, 2, 1], [2, 3, 1], [1, 1, 2]], b: [8, 11, 7] };
  }
  /* Rango 2: F3 = α·F1 + β·F2; el menor de las filas 1-2 y columnas x, y vale ±1 */
  function genRango2(R) {
    for (let k = 0; k < 20000; k++) {
      const l21 = R.pick(NZ2), u12 = R.int(-3, 3), u13 = R.int(-3, 3), u22 = R.pick([-1, 1]), u23 = R.pick(NZ3), al = R.pick(NZ2), be = R.pick(NZ2);
      const R1 = [1, u12, u13], U2 = [0, u22, u23];
      const R2 = R1.map((v, j) => l21 * v + U2[j]);
      const R3 = R1.map((v, j) => al * v + be * R2[j]);
      const A = [R1, R2, R3];
      if (maxAbs(A.flat()) > 7 || ceros(A) > 2) continue;
      const q = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)];
      const b = [dot(R1, q), dot(R2, q), 0];
      b[2] = al * b[0] + be * b[1];
      if (maxAbs(b) > 20) continue;
      return { A, b };
    }
    return { A: [[1, 1, -1], [2, 1, 1], [3, 2, 0]], b: [2, 3, 5] };
  }
  const GEN = {
    SCD: genSCD,
    SCI: genRango2,
    SI: R => { const g = genRango2(R); g.b[2] += R.pick(NZ3); return g; }
  };

  function rouche(tipoFijo) {
    return R => {
      const tipo = tipoFijo === 'azar' ? R.pick(['SCD', 'SCI', 'SI']) : tipoFijo;
      const { A, b } = GEN[tipo](R);
      const D = det3(A);
      const pasos = [];
      if (tipo === 'SCD') {
        pasos.push({ t: 'Calculamos el determinante de la matriz de coeficientes A (regla de Sarrus):', m: `${sarrus(A, '|A|')} \\neq 0` });
        pasos.push({ t: 'Como \\(|A| \\neq 0\\), \\(\\text{rg}(A) = 3\\). La matriz ampliada \\(A^*\\) tiene 3 filas, así que \\(\\text{rg}(A^*) = 3\\). Por el teorema de Rouché-Frobenius, \\(\\text{rg}(A) = \\text{rg}(A^*) = 3 =\\) número de incógnitas: <b>sistema compatible determinado</b> (solución única). Lo resolvemos por la regla de Cramer.' });
        const c = pasosCramer(A, b);
        pasos.push(...c.pasos);
        return { enun: sistemaTeX(A, b), pasos, res: `\\text{SCD:}\\quad ${resSol(c.x)}` };
      }
      const m2 = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      const Ab = [0, 1, 2].map(i => [A[i][0], A[i][1], b[i]]);
      const dAb = det3(Ab);
      pasos.push({ t: 'Calculamos el determinante de la matriz de coeficientes A (regla de Sarrus):', m: sarrus(A, '|A|') });
      pasos.push({ t: 'Como \\(|A| = 0\\), \\(\\text{rg}(A) < 3\\). Buscamos un menor de orden 2 no nulo:',
        m: `${vm([[A[0][0], A[0][1]], [A[1][0], A[1][1]]])} = ${n(m2)} \\neq 0 \\;\\Rightarrow\\; \\text{rg}(A) = 2` });
      pasos.push({ t: 'Para el rango de \\(A^*\\), orlamos ese menor con la tercera fila y la columna de términos independientes (columnas de x, de y y de los términos independientes):',
        m: sarrus(Ab, '\\Delta') + (dAb === 0 ? '' : ' \\neq 0') });
      if (tipo === 'SI') {
        pasos.push({ t: `Como ese menor de orden 3 de \\(A^*\\) es distinto de 0, \\(\\text{rg}(A^*) = 3\\). Por el teorema de Rouché-Frobenius, \\(\\text{rg}(A) = 2 \\neq \\text{rg}(A^*) = 3\\): <b>sistema incompatible</b>, no tiene solución.` });
        return { enun: sistemaTeX(A, b), pasos, res: '\\text{SI: el sistema no tiene solución}' };
      }
      pasos.push({ t: 'Los menores de orden 3 que contienen al menor no nulo son \\(|A|\\) y este, y los dos valen 0, así que \\(\\text{rg}(A^*) = 2\\). Por el teorema de Rouché-Frobenius, \\(\\text{rg}(A) = \\text{rg}(A^*) = 2 < 3\\) incógnitas: <b>sistema compatible indeterminado</b>, con infinitas soluciones que dependen de \\(3 - 2 = 1\\) parámetro.' });
      /* Resolución por Gauss con las dos primeras ecuaciones (la tercera depende de ellas) */
      const F2 = [...A[1], b[1]].map((v, j) => v - A[1][0] * [...A[0], b[0]][j]);
      const c22 = F2[1], c23 = F2[2], d2 = F2[3];
      const y0 = d2 / c22, yt = -c23 / c22;
      const u12 = A[0][1], u13 = A[0][2];
      const x0 = b[0] - u12 * y0, xt = -u12 * yt - u13;
      const yE = poli([[y0, ''], [yt, 't']]), xE = poli([[x0, ''], [xt, 't']]);
      const M2 = [[...A[0], b[0]], F2].map(r => r.map(Q.of));
      pasos.push({ t: 'Nos quedamos con las dos primeras ecuaciones (la tercera es combinación lineal de ellas) y escalonamos por Gauss:',
        m: `${opTeX(2, Q.of(A[1][0]), 1)} \\qquad ${ampTeX(M2)}` });
      const sg = (k, cuerpo) => (k === 0 ? '' : ` ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${cuerpo}`);
      const linX = `x${sg(u12, `\\left(${yE}\\right)`)}${sg(u13, 't')} = ${n(b[0])}`;
      pasos.push({ t: 'Hacemos \\(z = t\\) y despejamos de abajo arriba:',
        m: `${poli([[c22, 'y'], [c23, 't']])} = ${n(d2)} \\;\\Rightarrow\\; y = ${yE} \\\\ ${linX} \\;\\Rightarrow\\; x = ${xE}`, multilinea: true });
      return { enun: sistemaTeX(A, b), pasos, res: `\\text{SCI:}\\quad x = ${xE}, \\quad y = ${yE}, \\quad z = t, \\quad t \\in \\mathbb{R}` };
    };
  }
  const ENUN_R = ['Discute el siguiente sistema mediante el teorema de Rouché-Frobenius y, si es compatible, resuélvelo:',
    'Discute los siguientes sistemas mediante el teorema de Rouché-Frobenius y, si son compatibles, resuélvelos:'];
  registrarFicha({
    id: 'rouche',
    titulo: 'Rouché-Frobenius, Cramer y Gauss',
    detalle: '2.º Bachillerato',
    grupo: 'Ecuaciones matriciales y sistemas',
    enlace: '../sistemas-ec-matriciales/rouche.html',
    ejercicios: [
      { id: 'rouche-azar', nombre: 'Discutir y resolver (tipo al azar: SCD, SCI o SI)', peso: 2.5, columnas: 2, enunciado: ENUN_R, generar: rouche('azar') },
      { id: 'rouche-scd', nombre: 'Discutir y resolver: compatible determinado', peso: 2.5, columnas: 2, enunciado: ENUN_R, generar: rouche('SCD') },
      { id: 'rouche-sci', nombre: 'Discutir y resolver: compatible indeterminado', peso: 2.5, columnas: 2, enunciado: ENUN_R, generar: rouche('SCI') },
      { id: 'rouche-si', nombre: 'Discutir: incompatible', peso: 1.5, columnas: 2, enunciado: ENUN_R, generar: rouche('SI') }
    ]
  });
})();
