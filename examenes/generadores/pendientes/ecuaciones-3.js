/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Ecuaciones (pendientes de 3.º ESO).
   Los datos se generan con los mismos criterios que la ficha interactiva
   pendientes/tercero/ecuaciones-3.html. Diferencias con la ficha (que no se ha modificado):
   los problemas de primer grado, que en la ficha son un banco fijo de seis enunciados, aquí
   son las mismas seis situaciones con números aleatorios; y en la ecuación con paréntesis
   y denominadores se descarta el caso r = 0 (el segundo miembro sería «0 + x/e»). */
(function () {
  'use strict';
  const { mcm, tex, resolverCuadratica, despejeLineal, registrarFicha } = window.EX;
  const { n, poli } = tex;

  const lin = (k, m) => poli([[k, 'x'], [m, '']]);

  /* ================= 1. Ecuaciones sencillas ================= */
  /* Ficha: x ± a = b, con x entre −15 y 15 y a entre 1 y 20 */
  function genSencilla(R) {
    const x = R.int(-15, 15), a = R.int(1, 20), op = R.pick(['+', '-']);
    const b = op === '+' ? x + a : x - a;
    return {
      enun: `x ${op} ${a} = ${n(b)}`,
      pasos: [{ t: `Pasamos el ${a} al otro miembro ${op === '+' ? 'restando' : 'sumando'} (cambia de signo):`, m: `x = ${n(b)} ${op === '+' ? '-' : '+'} ${a} = ${n(x)}` }],
      res: `x = ${n(x)}`
    };
  }

  /* ================= 2. Ecuaciones con paréntesis ================= */
  /* Ficha: a(x + b) = c, con a de 2 a 9, b entre −10 y 10 (no nulo) y x entre −12 y 12 */
  function genParentesis(R) {
    const x = R.int(-12, 12), a = R.int(2, 9), b = R.nz(-10, 10), c = a * (x + b);
    return {
      enun: `${a}(${lin(1, b)}) = ${n(c)}`,
      pasos: [
        { t: 'Quitamos el paréntesis (propiedad distributiva):', m: `${lin(a, a * b)} = ${n(c)}` },
        { t: `Pasamos el ${n(a * b).replace('-', '−')} al otro miembro cambiando de signo:`, m: `${a}x = ${n(c)} ${a * b > 0 ? '-' : '+'} ${Math.abs(a * b)} = ${n(c - a * b)}` },
        { t: 'Despejamos \\(x\\):', m: despejeLineal(a, c - a * b, 'x').m }
      ],
      res: `x = ${n(x)}`
    };
  }

  /* ================= 3. Problemas de primer grado ================= */
  /* Las seis situaciones de la ficha, con números aleatorios */
  const PAREJAS = [['Pedro', 'Juan'], ['Mario', 'Hugo'], ['Daniel', 'Álvaro'], ['Pablo', 'Iván']];
  const PROBLEMAS = [
    R => { // k1·x − A = k2·x + B
      const [k1, t1, t2] = R.pick([[3, 'El triple', 'doble'], [4, 'El cuádruple', 'triple']]);
      const A = R.int(1, 9), B = R.int(1, 9);
      return { txt: `${t1} de un número, menos ${A}, es igual al ${t2} del mismo número más ${B}. ¿Cuál es el número?`,
        izq: [k1, -A], der: [k1 - 1, B], sol: A + B };
    },
    R => { // x + k·x = S
      const [k, t] = R.pick([[2, 'doble'], [3, 'triple']]), x = R.int(3, 15);
      return { txt: `La suma de un número y su ${t} es igual a ${(k + 1) * x}. ¿Cuál es el número?`,
        ec: `x + ${k}x = ${(k + 1) * x}`, izq: [k + 1, 0], der: [0, (k + 1) * x], sol: x, agrupa: `${k + 1}x = ${(k + 1) * x}` };
    },
    R => { // k·x + A = B
      const [k, t] = R.pick([[2, 'doble'], [3, 'triple']]), x = R.int(2, 12), A = R.int(2, 12);
      return { txt: `Si al ${t} de un número le sumamos ${A}, obtenemos ${k * x + A}. ¿Cuál es el número?`,
        izq: [k, A], der: [0, k * x + A], sol: x };
    },
    R => { // 2x + A = 3x − B
      const A = R.int(1, 9), B = R.int(1, 9);
      return { txt: `El doble de un número, aumentado en ${A}, es igual al triple del mismo número disminuido en ${B}. ¿Cuál es el número?`,
        izq: [2, A], der: [3, -B], sol: A + B };
    },
    R => { // x − A = 2x
      const A = R.int(2, 15);
      return { txt: `Si a un número le restamos ${A}, el resultado es el doble de ese número. ¿Cuál es el número?`,
        izq: [1, -A], der: [2, 0], sol: -A };
    },
    R => { // x + (3x − A) = S
      const [u, v] = R.pick(PAREJAS), J = R.int(8, 16), A = R.int(2, 6), S = 4 * J - A;
      return { txt: `${u} tiene ${A} años menos que el triple de la edad de ${v}. Si entre los dos suman ${S} años, ¿cuántos años tiene cada uno?`,
        ec: `x + (3x - ${A}) = ${S}`, izq: [4, -A], der: [0, S], sol: J,
        agrupa: `4x - ${A} = ${S} \\;\\Rightarrow\\; 4x = ${S} + ${A} = ${S + A}`,
        incog: `Llamamos \\(x\\) a la edad de ${v}; la de ${u} es \\(3x - ${A}\\).`,
        final: `${v} tiene ${J} años y ${u}, ${3 * J - A} años.` };
    }
  ];
  function genProblema(R) {
    const P = R.pick(PROBLEMAS)(R);
    const ec = P.ec || `${lin(P.izq[0], P.izq[1])} = ${lin(P.der[0], P.der[1])}`;
    const k = P.izq[0] - P.der[0], r = P.der[1] - P.izq[1];
    const pasos = [
      { t: P.incog || 'Llamamos \\(x\\) al número y traducimos el enunciado:', m: ec },
      { t: 'Pasamos los términos con \\(x\\) a un miembro y los números al otro:', m: P.agrupa || `${poli([[P.izq[0], 'x'], [-P.der[0], 'x']])} = ${poli([[P.der[1], ''], [-P.izq[1], '']])} \\;\\Rightarrow\\; ${lin(k, 0)} = ${n(r)}` },
      { t: 'Despejamos \\(x\\):', m: despejeLineal(k, r, 'x').m }
    ];
    const final = P.final || `El número es ${n(P.sol).replace('-', '−')}.`;
    return {
      html: true,
      enun: `<span class="pend-texto">${P.txt}</span>`,
      pasos,
      res: `x = ${n(P.sol)}`,
      resHtml: `\\(${ec}\\) \\(\\;\\Rightarrow\\; x = ${n(P.sol)}\\). ${final}`
    };
  }

  /* ================= 4. Ecuaciones con fracciones ================= */
  /* Ficha: x/n1 ± x/n2 = b, con n1 ≠ n2 en {2, 3, 4, 6} y x = k·mcm, k = ±1..3 */
  function genFracciones(R) {
    const n1 = R.pick([2, 3, 4, 6]); let n2; do { n2 = R.pick([2, 3, 4, 6]); } while (n2 === n1);
    const L = mcm(n1, n2), x = R.nz(-3, 3) * L, op = R.pick(['+', '-']);
    const b = op === '+' ? x / n1 + x / n2 : x / n1 - x / n2;
    const c1 = L / n1, c2 = L / n2, k = op === '+' ? c1 + c2 : c1 - c2;
    return {
      enun: `\\frac{x}{${n1}} ${op} \\frac{x}{${n2}} = ${n(b)}`,
      pasos: [
        { t: `Multiplicamos los dos miembros por \\(\\text{m.c.m.}(${n1}, ${n2}) = ${L}\\) para quitar los denominadores:`, m: `${c1 === 1 ? '' : c1}x ${op} ${c2 === 1 ? '' : c2}x = ${n(b * L)}` },
        { t: 'Agrupamos y despejamos:', m: despejeLineal(k, b * L, 'x').m }
      ],
      res: `x = ${n(x)}`
    };
  }

  /* ================= 5. Paréntesis y denominadores ================= */
  /* Ficha: p + (x + q)/c = r + x/e, con c ≠ e en {2,…,6}, x = k·e (k = ±1..3), p de 1 a 5 */
  function genParDen(R) {
    let c, e, x, q, p0, r;
    do {
      c = R.int(2, 6); do { e = R.int(2, 6); } while (e === c);
      x = R.nz(-3, 3) * e;
      const resto = ((x % c) + c) % c, qPos = resto === 0 ? c : c - resto, qNeg = qPos - c;
      q = R.rand() < 0.5 ? qPos : (qNeg === 0 ? qPos : qNeg);
      p0 = R.int(1, 5);
      r = p0 + (x + q) / c - x / e;
    } while (r === 0);
    const L = mcm(c, e), Lc = L / c, Le = L / e;
    const k = Lc - Le, dcha = r * L - p0 * L - Lc * q;
    const fac = Lc === 1 ? `(${lin(1, q)})` : `${Lc}(${lin(1, q)})`;
    return {
      enun: `${p0} + \\frac{${lin(1, q)}}{${c}} = ${n(r)} + \\frac{x}{${e}}`,
      pasos: [
        { t: `Multiplicamos los dos miembros por \\(\\text{m.c.m.}(${c}, ${e}) = ${L}\\):`, m: `${p0 * L} + ${fac} = ${n(r * L)} + ${Le === 1 ? '' : Le}x` },
        { t: 'Quitamos el paréntesis:', m: `${p0 * L} + ${lin(Lc, Lc * q)} = ${n(r * L)} + ${Le === 1 ? '' : Le}x` },
        { t: 'Pasamos los términos con \\(x\\) a la izquierda y los números a la derecha:', m: `${poli([[Lc, 'x'], [-Le, 'x']])} = ${poli([[r * L, ''], [-p0 * L, ''], [-Lc * q, '']])} \\;\\Rightarrow\\; ${lin(k, 0)} = ${n(dcha)}` },
        ...(k === 1 ? [] : [{ t: 'Despejamos \\(x\\):', m: despejeLineal(k, dcha, 'x').m }])
      ],
      res: `x = ${n(x)}`
    };
  }

  /* ================= 6. Segundo grado incompleta ================= */
  /* Ficha: ax² − c = 0 (a de 1 a 4, raíces ±1..9) o ax² + bx = 0 (a de 1 a 5, raíz ±1..8) */
  function genIncompleta(R) {
    if (R.rand() < 0.5) {
      const rr = R.int(1, 9), a = R.int(1, 4), c = a * rr * rr;
      const pasos = [{ t: 'Falta el término en \\(x\\). Despejamos \\(x^2\\):', m: a === 1 ? `x^2 = ${c}` : `${a}x^2 = ${c} \\;\\Rightarrow\\; x^2 = \\frac{${c}}{${a}} = ${rr * rr}` }];
      pasos.push({ t: 'Hacemos la raíz cuadrada; hay dos soluciones opuestas:', m: `x = \\pm\\sqrt{${rr * rr}} = \\pm ${rr}` });
      return { enun: `${poli([[a, 'x^2'], [-c, '']])} = 0`, pasos, res: `x_1 = ${-rr},\\quad x_2 = ${rr}` };
    }
    const s = R.nz(-8, 8), a = R.int(1, 5), b = -a * s;
    const raices = [0, s].sort((u, v) => u - v);
    return {
      enun: `${poli([[a, 'x^2'], [b, 'x']])} = 0`,
      pasos: [
        { t: 'Falta el término independiente. Sacamos \\(x\\) factor común:', m: `x(${lin(a, b)}) = 0` },
        { t: 'Un producto es cero si lo es alguno de sus factores:', m: `x = 0 \\qquad \\text{o} \\qquad ${lin(a, b)} = 0 \\;\\Rightarrow\\; ${a === 1 ? `x = ${n(s)}` : `x = \\frac{${n(-b)}}{${a}} = ${n(s)}`}` }
      ],
      res: `x_1 = ${n(raices[0])},\\quad x_2 = ${n(raices[1])}`
    };
  }

  /* ================= 7. Segundo grado completa ================= */
  /* Ficha: x² + bx + c = 0 con raíces enteras distintas, no nulas ni opuestas, entre −8 y 8 */
  function genCompleta(R) {
    let r1, r2;
    do { r1 = R.int(-8, 8); r2 = R.int(-8, 8); } while (r1 === 0 || r2 === 0 || r1 === r2 || r1 === -r2);
    const b = -(r1 + r2), c = r1 * r2;
    const sol = resolverCuadratica(1, b, c);
    const rs = sol.raices.map(f => f.n / f.d).sort((u, v) => u - v);
    return {
      enun: `${poli([[1, 'x^2'], [b, 'x'], [c, '']])} = 0`,
      pasos: sol.pasos,
      res: `x_1 = ${n(rs[0])},\\quad x_2 = ${n(rs[1])}`
    };
  }

  const ENUN = ['Resuelve la siguiente ecuación:', 'Resuelve las siguientes ecuaciones:'];
  registrarFicha({
    id: 'pend3-ecuaciones',
    titulo: 'Ecuaciones',
    detalle: '3.º ESO',
    grupo: 'Recuperación de 3.º ESO',
    enlace: '../pendientes/tercero/ecuaciones-3.html',
    ejercicios: [
      { id: 'sencillas', nombre: 'Ecuaciones sencillas', peso: 0.5, columnas: 3, enunciado: ENUN, generar: genSencilla },
      { id: 'parentesis', nombre: 'Ecuaciones con paréntesis', peso: 0.75, columnas: 3, enunciado: ENUN, generar: genParentesis },
      { id: 'problema', nombre: 'Problema (primer grado)', peso: 1, columnas: 1,
        enunciado: ['Plantea una ecuación y resuelve el problema:', 'Plantea una ecuación y resuelve cada problema:'], generar: genProblema },
      { id: 'fracciones', nombre: 'Ecuaciones con fracciones', peso: 1, columnas: 3, enunciado: ENUN, generar: genFracciones },
      { id: 'parentesis-denominadores', nombre: 'Ecuación con paréntesis y denominadores', peso: 1.25, columnas: 2, enunciado: ENUN, generar: genParDen },
      { id: 'incompleta', nombre: 'Segundo grado incompleta', peso: 0.75, columnas: 3, enunciado: ENUN, generar: genIncompleta },
      { id: 'completa', nombre: 'Segundo grado completa', peso: 1, columnas: 2, enunciado: ENUN, generar: genCompleta }
    ]
  });
})();
