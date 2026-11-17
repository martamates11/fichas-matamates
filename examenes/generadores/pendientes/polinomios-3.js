/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Polinomios (pendientes de 3.º ESO).
   Los datos se generan con los mismos criterios que la ficha interactiva
   pendientes/tercero/polinomios-3.html. En la ficha cada tanda trae dos frases o dos
   expresiones; aquí cada apartado es una sola, y el examen ya pone varios apartados.
   Diferencias con la ficha (que no se ha modificado): el banco de frases del lenguaje
   algebraico es de 20 en lugar de 10 (las 10 primeras son las de la ficha, con «disminuida
   en 8» en vez de «disminuido en 8» para evitar la ambigüedad), y en las identidades
   notables b va de 1 a 9 (en la ficha, de 1 a 4) para dar más variedad. */
(function () {
  'use strict';
  const { mcd, tex, registrarFicha } = window.EX;
  const { n, p, poli, por } = tex;

  /* ---------- Polinomios como { grado: coeficiente } ---------- */
  const potX = d => (d === 0 ? '' : d === 1 ? 'x' : `x^${d}`);
  const grados = m => Object.keys(m).map(Number).filter(d => m[d] !== 0).sort((a, b) => b - a);
  const pol = m => poli(grados(m).map(d => [m[d], potX(d)]));
  const mono = (c, d) => (d === 0 ? n(c) : por(c, potX(d)));
  const monoP = (c, d) => (c < 0 ? `(${mono(c, d)})` : mono(c, d));
  const escalar = (m, k) => { const r = {}; Object.keys(m).forEach(d => { r[d] = m[d] * k; }); return r; };
  const desplazar = (m, s) => { const r = {}; Object.keys(m).forEach(d => { r[Number(d) + s] = m[d]; }); return r; };
  const sumar = (...ms) => { const r = {}; ms.forEach(m => Object.keys(m).forEach(d => { r[d] = (r[d] || 0) + m[d]; })); return r; };

  /* ================= 1. Lenguaje algebraico ================= */
  /* Las 10 primeras son las de la ficha; las otras 10 son nuevas */
  const FRASES = [
    ['El doble de un número más tres unidades', '2x + 3', '«El doble» de \\(x\\) es \\(2x\\); «más tres unidades» suma 3.'],
    ['La tercera parte de un número, disminuida en 8', '\\frac{x}{3} - 8', 'La tercera parte es \\(\\frac{x}{3}\\); «disminuida en 8» le resta 8.'],
    ['El cuadrado de la suma de un número y uno', '(x + 1)^2', 'Primero la suma, \\(x + 1\\); después se eleva al cuadrado toda la suma, que va entre paréntesis.'],
    ['Un número más su mitad', 'x + \\frac{x}{2}', 'La mitad de \\(x\\) es \\(\\frac{x}{2}\\), y se suma al número.'],
    ['El triple de un número menos cinco', '3x - 5', '«El triple» es \\(3x\\); «menos cinco» resta 5.'],
    ['La suma de dos números consecutivos', 'x + (x + 1)', 'Si un número es \\(x\\), el siguiente (su consecutivo) es \\(x + 1\\).'],
    ['El producto de un número por sí mismo más cuatro', 'x^2 + 4', 'Un número por sí mismo es \\(x \\cdot x = x^2\\); después se suma 4.'],
    ['La diferencia entre el doble de un número y siete', '2x - 7', '«La diferencia entre A y B» es \\(A - B\\): el doble, \\(2x\\), menos 7.'],
    ['El cuadrado de un número más el triple del mismo', 'x^2 + 3x', 'El cuadrado es \\(x^2\\) y el triple, \\(3x\\); se suman.'],
    ['La raíz cuadrada de la suma de un número y nueve', '\\sqrt{x + 9}', 'Primero la suma, \\(x + 9\\); la raíz cuadrada abarca toda la suma.'],
    ['El doble de la suma de un número y cinco', '2(x + 5)', 'Primero la suma, \\(x + 5\\), entre paréntesis; después se multiplica por 2.'],
    ['La mitad de un número más su cuarta parte', '\\frac{x}{2} + \\frac{x}{4}', 'La mitad es \\(\\frac{x}{2}\\) y la cuarta parte, \\(\\frac{x}{4}\\); se suman.'],
    ['El cuadrado de un número menos su doble', 'x^2 - 2x', 'El cuadrado es \\(x^2\\) y el doble, \\(2x\\); se restan.'],
    ['El triple del cuadrado de un número', '3x^2', 'Primero el cuadrado, \\(x^2\\); después se multiplica por 3.'],
    ['La diferencia entre un número y su tercera parte', 'x - \\frac{x}{3}', 'Al número \\(x\\) se le resta su tercera parte, \\(\\frac{x}{3}\\).'],
    ['El producto de dos números consecutivos', 'x(x + 1)', 'Los números son \\(x\\) y \\(x + 1\\); se multiplican.'],
    ['La suma de tres números consecutivos', 'x + (x + 1) + (x + 2)', 'Los tres números son \\(x\\), \\(x + 1\\) y \\(x + 2\\); se suman.'],
    ['La mitad del cuadrado de un número', '\\frac{x^2}{2}', 'Primero el cuadrado, \\(x^2\\); después se divide entre 2.'],
    ['El cuadrado de la diferencia entre un número y tres', '(x - 3)^2', 'Primero la diferencia, \\(x - 3\\); después se eleva al cuadrado, con paréntesis.'],
    ['El doble de un número menos su mitad', '2x - \\frac{x}{2}', 'El doble es \\(2x\\) y la mitad, \\(\\frac{x}{2}\\); se restan.']
  ];
  function genLenguaje(R) {
    const [frase, res, expl] = R.pick(FRASES);
    return {
      html: true,
      enun: `<span class="pend-texto">${frase}.</span>`,
      pasos: [{ t: `Llamamos \\(x\\) al número. ${expl}`, m: res }],
      res
    };
  }

  /* ================= 2. Grado y término independiente ================= */
  /* Ficha: grado 2–5, coeficiente principal ±1..8, cada término intermedio con
     probabilidad 0,6 y término independiente nulo con probabilidad 1/3. */
  function genGrado(R) {
    const g = R.int(2, 5), m = { [g]: R.nz(-8, 8) };
    for (let d = g - 1; d >= 1; d--) if (R.rand() < 0.6) m[d] = R.nz(-8, 8);
    m[0] = R.rand() < 1 / 3 ? 0 : R.nz(-8, 8);
    const ti = m[0];
    return {
      enun: pol(m),
      pasos: [
        { t: `El grado es el mayor exponente de \\(x\\). El término de mayor grado es \\(${mono(m[g], g)}\\), así que el grado es ${g}.` },
        ti === 0
          ? { t: 'El término independiente es el que no lleva \\(x\\). Aquí no aparece ninguno, así que vale 0.' }
          : { t: `El término independiente es el que no lleva \\(x\\): \\(${n(ti)}\\).` }
      ],
      res: `\\text{Grado } ${g},\\quad \\text{término independiente } {${n(ti)}}`
    };
  }

  /* ================= 3. Monomio por binomio ================= */
  /* Ficha: m = ±1..5, x o x², binomio (x + c) con c = ±1..9 */
  function genMonomio(R) {
    const m = R.nz(-5, 5), e = R.pick([1, 2]), c = R.nz(-9, 9);
    const M = mono(m, e), MP = monoP(m, e);
    const r = { [e + 1]: m, [e]: m * c };
    return {
      enun: `${M}(${poli([[1, 'x'], [c, '']])})`,
      pasos: [
        { t: 'Propiedad distributiva: multiplicamos el monomio por cada término del paréntesis.', m: `${MP} \\cdot x + ${MP} \\cdot ${p(c)}` },
        { t: 'Multiplicamos los coeficientes (regla de los signos) y sumamos los exponentes de \\(x\\):', m: pol(r) }
      ],
      res: pol(r)
    };
  }

  /* ================= 4. Operaciones con polinomios ================= */
  /* Ficha: P, Q y R de grado 2 con todos los coeficientes en ±1..6 y una de seis combinaciones */
  const PLANTILLAS = [[1, -2, 1], [2, 1, -1], [1, 1, -3], [-1, 2, 1], [2, -1, -2], [1, -3, 2]];
  function genOperaciones(R) {
    const polis = [0, 1, 2].map(() => ({ 2: R.nz(-6, 6), 1: R.nz(-6, 6), 0: R.nz(-6, 6) }));
    const k = R.pick(PLANTILLAS), nombres = ['P', 'Q', 'R'];
    const opTeX = poli(k.map((c, i) => [c, `${nombres[i]}(x)`]));
    const escalados = polis.map((m, i) => escalar(m, k[i]));
    const total = sumar(...escalados);
    const def = polis.map((m, i) => `\\(${nombres[i]}(x) = ${pol(m)}\\)`).join('<br>');
    const linea = (i) => {
      const c = k[i];
      const izq = c === 1 ? `${nombres[i]}(x)` : `${c === -1 ? '-' : n(c)}${nombres[i]}(x)`;
      if (c === 1) return `${izq} = ${pol(escalados[i])}`;
      return `${izq} = ${c === -1 ? '-' : n(c)}(${pol(polis[i])}) = ${pol(escalados[i])}`;
    };
    const grupo = d => escalados.map(m => m[d]).map((v, i) => (i === 0 ? n(v) : (v < 0 ? ` - ${-v}` : ` + ${v}`))).join('');
    return {
      html: true,
      enun: `<div class="pend-col"><span>${def}</span><span>Calcula \\(${opTeX}\\).</span></div>`,
      pasos: [
        { t: 'Multiplicamos cada polinomio por su coeficiente (si es negativo, cambian todos los signos):', m: `\\begin{aligned} ${[0, 1, 2].map(i => '& ' + linea(i)).join(' \\\\ ')} \\end{aligned}` },
        { t: 'Sumamos los términos semejantes (los del mismo grado):', m: `(${grupo(2)})x^2 + (${grupo(1)})x + (${grupo(0)}) = ${pol(total)}` }
      ],
      res: pol(total)
    };
  }

  /* ================= 5. Identidades notables ================= */
  /* Ficha: (x + b)², (x − b)² y (x + b)(x − b), con b de 1 a 9 */
  function genIdentidades(R) {
    const tipo = R.pick(['suma', 'resta', 'dif']), b = R.int(1, 9);
    if (tipo === 'dif') {
      return {
        enun: `(x + ${b})(x - ${b})`,
        pasos: [{ t: 'Suma por diferencia: \\((a + b)(a - b) = a^2 - b^2\\).', m: `x^2 - ${b}^2 = x^2 - ${b * b}` }],
        res: `x^2 - ${b * b}`
      };
    }
    const s = tipo === 'suma' ? '+' : '-';
    const r = `x^2 ${s} ${2 * b}x + ${b * b}`;
    return {
      enun: `(x ${s} ${b})^2`,
      pasos: [{
        t: tipo === 'suma' ? 'Cuadrado de una suma: \\((a + b)^2 = a^2 + 2ab + b^2\\).' : 'Cuadrado de una diferencia: \\((a - b)^2 = a^2 - 2ab + b^2\\).',
        m: `x^2 ${s} 2 \\cdot x \\cdot ${b} + ${b}^2 = ${r}`
      }],
      res: r
    };
  }

  /* ================= 6. Factorización con identidades notables ================= */
  /* Ficha: x² ± 2bx + b² y x² − n², con b y n de 1 a 9 */
  function genFactorizar(R) {
    const b = R.int(1, 9);
    if (R.rand() < 1 / 3) {
      return {
        enun: `x^2 - ${b * b}`,
        pasos: [{ t: `Es una diferencia de cuadrados, \\(a^2 - b^2 = (a + b)(a - b)\\), con \\(a = x\\) y \\(b = ${b}\\), porque \\(${b * b} = ${b}^2\\):`, m: `x^2 - ${b}^2 = (x + ${b})(x - ${b})` }],
        res: `(x + ${b})(x - ${b})`
      };
    }
    const s = R.pick(['+', '-']);
    return {
      enun: `x^2 ${s} ${2 * b}x + ${b * b}`,
      pasos: [
        { t: `Los términos \\(x^2\\) y \\(${b * b} = ${b}^2\\) son cuadrados, y el término central es su doble producto: \\(2 \\cdot x \\cdot ${b} = ${2 * b}x\\).` },
        { t: s === '+' ? 'Es el desarrollo de un cuadrado de una suma, \\(a^2 + 2ab + b^2 = (a + b)^2\\):' : 'Es el desarrollo de un cuadrado de una diferencia, \\(a^2 - 2ab + b^2 = (a - b)^2\\):', m: `x^2 ${s} ${2 * b}x + ${b * b} = (x ${s} ${b})^2` }
      ],
      res: `(x ${s} ${b})^2`
    };
  }

  /* ================= 7. Factor común ================= */
  /* Ficha: factor numérico 2–6, potencia de x 0, 1 o 2 (más la que aporte el término
     de menor grado), y un paréntesis de 2 o 3 términos con el primer coeficiente ±1 */
  function genFactorComun(R) {
    let k = R.int(2, 6), pot = R.pick([0, 1, 1, 2]);
    let gs = R.shuffle([2, 1, 0]).slice(0, R.rand() < 0.5 ? 2 : 3).sort((a, b) => b - a);
    const minG = Math.min(...gs);
    if (minG > 0) { pot += minG; gs = gs.map(g => g - minG); }
    const inner = {};
    gs.forEach((g, i) => { inner[g] = i === 0 ? R.signo() : R.nz(-4, 4); });
    const orig = escalar(desplazar(inner, pot), k);
    const fac = mono(k, pot);
    const coefs = grados(orig).map(d => Math.abs(orig[d]));
    const lista = coefs.slice(0, -1).join(', ') + ' y ' + coefs[coefs.length - 1];
    const g = coefs.reduce((a, b) => mcd(a, b));
    const potTxt = pot === 0 ? 'No todos los términos llevan \\(x\\), así que no sale ninguna potencia de \\(x\\).'
      : `Todos los términos llevan \\(x\\); la menor potencia es \\(${potX(pot)}\\).`;
    const div = grados(orig).map(d => `\\frac{${mono(orig[d], d)}}{${fac}} = ${mono(orig[d] / k, d - pot)}`).join(',\\quad ');
    const res = `${fac}(${pol(inner)})`;
    const pasos = [
      { t: `El máximo común divisor de los coeficientes (${lista}) es ${g}. ${potTxt} El factor común es \\(${fac}\\).` },
      { t: 'Dividimos cada término entre el factor común:', m: div },
      { t: 'Escribimos el factor común fuera del paréntesis:', m: `${pol(orig)} = ${res}` }
    ];
    if (inner[gs[0]] < 0) pasos.push({ t: `También es correcto sacar \\(${mono(-k, pot)}\\): \\(${mono(-k, pot)}(${pol(escalar(inner, -1))})\\).` });
    return { enun: pol(orig), pasos, res };
  }

  registrarFicha({
    id: 'pend3-polinomios',
    titulo: 'Polinomios',
    detalle: '3.º ESO',
    grupo: 'Recuperación de 3.º ESO',
    enlace: '../pendientes/tercero/polinomios-3.html',
    ejercicios: [
      { id: 'lenguaje', nombre: 'Lenguaje algebraico', peso: 0.5, columnas: 2,
        enunciado: ['Expresa en lenguaje algebraico:', 'Expresa en lenguaje algebraico:'], generar: genLenguaje },
      { id: 'grado', nombre: 'Grado y término independiente', peso: 0.5, columnas: 2,
        enunciado: ['Indica el grado y el término independiente del polinomio:', 'Indica el grado y el término independiente de cada polinomio:'], generar: genGrado },
      { id: 'monomio', nombre: 'Monomio por binomio', peso: 0.5, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genMonomio },
      { id: 'operaciones', nombre: 'Operaciones con polinomios', peso: 1, columnas: 2,
        enunciado: ['Dados los polinomios, realiza la operación indicada:', 'Dados los polinomios, realiza la operación indicada en cada apartado:'], generar: genOperaciones },
      { id: 'identidades', nombre: 'Identidades notables', peso: 0.5, columnas: 3,
        enunciado: ['Desarrolla aplicando las identidades notables:', 'Desarrolla aplicando las identidades notables:'], generar: genIdentidades },
      { id: 'factorizar', nombre: 'Factorización con identidades notables', peso: 0.75, columnas: 3,
        enunciado: ['Factoriza utilizando las identidades notables:', 'Factoriza utilizando las identidades notables:'], generar: genFactorizar },
      { id: 'factor-comun', nombre: 'Factor común', peso: 0.75, columnas: 2,
        enunciado: ['Saca factor común:', 'Saca factor común:'], generar: genFactorComun }
    ]
  });
})();
