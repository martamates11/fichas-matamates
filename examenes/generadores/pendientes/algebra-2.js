/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Expresiones algebraicas (pendientes de 2.º ESO).
   Mismos criterios que la ficha pendientes/segundo/algebra-2.html, con una diferencia:
   el banco de frases del lenguaje algebraico es de 24 en lugar de las 10 de la ficha
   (las 10 primeras son las de la ficha), para que los exámenes no se repitan, y en la
   2.ª se ha aclarado la redacción («disminuida en 8» en vez de «disminuido en 8»). La
   ficha no se ha modificado. */
(function () {
  'use strict';
  const { tex, registrarFicha, mcd } = window.EX;
  const { n, p, poli } = tex;

  const abs = Math.abs;
  /* Variable con exponente: 'x', 'x^2', '' */
  const xv = g => (g === 0 ? '' : g === 1 ? 'x' : `x^${g}`);
  /* Polinomio a partir de un mapa {grado: coef}, de mayor a menor grado */
  const poliMap = m => poli(Object.keys(m).map(Number).sort((a, b) => b - a).map(g => [m[g], xv(g)]));
  /* Monomio k·x^g (con k = ±1 sin escribir) */
  const mono = (k, g) => poli([[k, xv(g)]]);
  /* Lista de números con sus signos: [4, −3, 1] → 4 - 3 + 1 */
  const sumaNums = arr => arr.map((v, i) => (i === 0 ? n(v) : (v < 0 ? ` - ${abs(v)}` : ` + ${v}`))).join('');

  /* ================= 1. Lenguaje algebraico ================= */
  /* [frase, expresión en TeX, explicación] — el mismo banco que la ficha */
  const FRASES = [
    ['el doble de un número más tres unidades', '2x + 3', 'El doble es \\(2x\\); después se suman 3.'],
    ['la tercera parte de un número, disminuida en 8', '\\frac{x}{3} - 8', 'La tercera parte es \\(\\frac{x}{3}\\); después se restan 8.'],
    ['el cuadrado de la suma de un número y uno', '(x + 1)^2', 'Primero la suma \\(x + 1\\) y después se eleva al cuadrado: hace falta el paréntesis.'],
    ['un número más su mitad', 'x + \\frac{x}{2}', 'La mitad del número es \\(\\frac{x}{2}\\).'],
    ['el triple de un número menos cinco', '3x - 5', 'El triple es \\(3x\\); después se restan 5.'],
    ['la suma de dos números consecutivos', 'x + (x + 1)', 'El consecutivo de \\(x\\) es \\(x + 1\\). También vale \\(2x + 1\\).'],
    ['el producto de un número por sí mismo, más cuatro', 'x^2 + 4', 'Un número por sí mismo es \\(x \\cdot x = x^2\\); después se suman 4.'],
    ['la diferencia entre el doble de un número y siete', '2x - 7', 'El doble es \\(2x\\) y se le restan 7.'],
    ['el cuadrado de un número más el triple del mismo', 'x^2 + 3x', 'El cuadrado es \\(x^2\\) y el triple, \\(3x\\).'],
    ['la raíz cuadrada de la suma de un número y nueve', '\\sqrt{x + 9}', 'La raíz abarca toda la suma \\(x + 9\\).'],
    ['el doble de la suma de un número y cinco', '2(x + 5)', 'Primero la suma \\(x + 5\\) y después se multiplica por 2: hace falta el paréntesis.'],
    ['la mitad de un número más seis', '\\frac{x}{2} + 6', 'La mitad es \\(\\frac{x}{2}\\); después se suman 6.'],
    ['el cuadrado de un número menos su doble', 'x^2 - 2x', 'El cuadrado es \\(x^2\\) y el doble, \\(2x\\).'],
    ['el triple del número anterior a un número', '3(x - 1)', 'El anterior de \\(x\\) es \\(x - 1\\) y se multiplica entero por 3.'],
    ['la cuarta parte de un número', '\\frac{x}{4}', 'La cuarta parte es dividir entre 4.'],
    ['un número menos su tercera parte', 'x - \\frac{x}{3}', 'La tercera parte del número es \\(\\frac{x}{3}\\).'],
    ['el triple del cuadrado de un número', '3x^2', 'Primero el cuadrado, \\(x^2\\), y después se multiplica por 3.'],
    ['el cuadrado del triple de un número', '(3x)^2', 'Primero el triple, \\(3x\\), y después se eleva al cuadrado: \\((3x)^2 = 9x^2\\).'],
    ['la suma de un número y su cuadrado', 'x + x^2', 'El cuadrado del número es \\(x^2\\).'],
    ['la mitad del número siguiente a un número', '\\frac{x + 1}{2}', 'El siguiente de \\(x\\) es \\(x + 1\\) y se divide entero entre 2.'],
    ['el producto de dos números consecutivos', 'x(x + 1)', 'El consecutivo de \\(x\\) es \\(x + 1\\) y se multiplican.'],
    ['el cubo de un número menos uno', 'x^3 - 1', 'El cubo es \\(x^3\\); después se resta 1.'],
    ['el doble de un número menos su cuarta parte', '2x - \\frac{x}{4}', 'El doble es \\(2x\\) y la cuarta parte, \\(\\frac{x}{4}\\).'],
    ['la quinta parte de la diferencia entre un número y dos', '\\frac{x - 2}{5}', 'Primero la diferencia \\(x - 2\\) y después se divide entera entre 5.']
  ];
  function genLenguaje(R) {
    const [frase, res, expl] = R.pick(FRASES);
    return {
      html: true,
      enun: `<span class="pend-texto">${frase.charAt(0).toUpperCase() + frase.slice(1)}</span>`,
      pasos: [{ t: `Llamamos \\(x\\) al número. ${expl}` }],
      res
    };
  }

  /* ================= 2. Suma y resta de monomios ================= */
  /* Ficha: 4 o 5 términos de grados 2, 1 y 0, con al menos dos del mismo grado;
     coeficientes entre −9 y 9 sin el 0 */
  function genMonomios(R) {
    const num = R.pick([4, 5]);
    const gA = R.pick([2, 1, 0]);
    let gB; do { gB = R.pick([2, 1, 0]); } while (gB === gA);
    const grados = [gA, gA, gB];
    while (grados.length < num) grados.push(R.pick([2, 1, 0]));
    const terminos = R.shuffle(grados).map(g => [R.nz(-9, 9), g]);
    const enun = poli(terminos.map(([k, g]) => [k, xv(g)]));
    const grupos = [], total = {};
    [2, 1, 0].forEach(g => {
      const ks = terminos.filter(t => t[1] === g).map(t => t[0]);
      if (!ks.length) return;
      total[g] = ks.reduce((a, b) => a + b, 0);
      grupos.push(ks.length === 1 ? { k: ks[0], g } : { cuerpo: `(${sumaNums(ks)})${xv(g)}` });
    });
    const agrupado = grupos.map((G, i) => (G.cuerpo ? (i ? ' + ' : '') + G.cuerpo
      : (i ? (G.k < 0 ? ' - ' : ' + ') : (G.k < 0 ? '-' : '')) + (abs(G.k) === 1 && G.g ? '' : abs(G.k)) + xv(G.g))).join('');
    const res = poliMap(total);
    return {
      enun,
      pasos: [
        { t: 'Solo se pueden sumar los términos semejantes (los que tienen la misma parte literal). Los agrupamos:', m: agrupado },
        { t: 'Sumamos los coeficientes de cada grupo:', m: res }
      ],
      res
    };
  }

  /* ================= 3. Monomio por binomio ================= */
  /* Ficha: m·x^p·(x + c) con m entre −5 y 5 sin el 0, p = 1 o 2, c entre −9 y 9 sin el 0 */
  function genMonoBin(R) {
    const m = R.nz(-5, 5), pw = R.pick([1, 2]), c = R.int(1, 9) * R.signo();
    const M = mono(m, pw), Mp = m < 0 ? `(${M})` : M;
    const res = poli([[m, xv(pw + 1)], [m * c, xv(pw)]]);
    return {
      enun: `${M}(${poli([[1, 'x'], [c, '']])})`,
      pasos: [
        { t: 'Multiplicamos el monomio por cada término del paréntesis (propiedad distributiva):', m: `${Mp} \\cdot x + ${Mp} \\cdot ${p(c)}` },
        { t: `Multiplicamos coeficientes y sumamos los exponentes de \\(x\\) (\\(${pw === 1 ? 'x' : 'x^2'} \\cdot x = x^{${pw + 1}}\\)):`, m: res }
      ],
      res
    };
  }

  /* ================= 4. Operaciones con polinomios ================= */
  /* Ficha: P, Q y R de grado 2 con coeficientes entre −6 y 6 sin el 0, y una de seis combinaciones */
  const PLANTILLAS = [[1, -2, 1], [2, 1, -1], [1, 1, -3], [-1, 2, 1], [2, -1, -2], [1, -3, 2]];
  function genOperaciones(R) {
    const polis = [0, 1, 2].map(() => ({ 2: R.nz(-6, 6), 1: R.nz(-6, 6), 0: R.nz(-6, 6) }));
    const t = R.pick(PLANTILLAS), nom = ['P', 'Q', 'R'];
    const op = poli(t.map((k, i) => [k, `${nom[i]}(x)`]));
    const esc = polis.map((P, i) => ({ 2: t[i] * P[2], 1: t[i] * P[1], 0: t[i] * P[0] }));
    const total = { 2: 0, 1: 0, 0: 0 };
    esc.forEach(E => [2, 1, 0].forEach(g => { total[g] += E[g]; }));
    const res = poliMap(total);
    const lineas = polis.map((P, i) => `\\(${nom[i]}(x) = ${poliMap(P)}\\)`).join('<br>');
    const escritos = esc.map((E, i) => `${poli([[t[i], nom[i] + '(x)']])} = ${poliMap(E)}`).join(' \\qquad ');
    const agrupado = [2, 1, 0].map((g, i) => `${i ? ' + ' : ''}(${sumaNums(esc.map(E => E[g]))})${xv(g)}`).join('');
    return {
      html: true,
      enun: `<div class="pend-col"><span>${lineas}</span><span>Calcula \\(${op}\\).</span></div>`,
      pasos: [
        { t: 'Multiplicamos cada polinomio por su coeficiente (cambiando todos los signos si es negativo):', m: escritos },
        { t: 'Sumamos los términos semejantes:', m: `${agrupado} = ${res}` }
      ],
      res: `${op} = ${res}`
    };
  }

  /* ================= 5. Identidades notables ================= */
  /* Ficha: un cuadrado (x ± b)² y una suma por diferencia (x + c)(x − c), con b y c entre 1 y 4 */
  function genIdentidades(R) {
    const b = R.int(1, 4), s = R.signo(), c = R.int(1, 4);
    const cuad = `(x ${s > 0 ? '+' : '-'} ${b})^2`, sd = `(x + ${c})(x - ${c})`;
    const r1 = poli([[1, 'x^2'], [2 * s * b, 'x'], [b * b, '']]), r2 = poli([[1, 'x^2'], [-c * c, '']]);
    return {
      enun: `${cuad} \\qquad\\qquad ${sd}`,
      pasos: [
        { t: `Cuadrado de una ${s > 0 ? 'suma' : 'diferencia'}: \\((a ${s > 0 ? '+' : '-'} b)^2 = a^2 ${s > 0 ? '+' : '-'} 2ab + b^2\\).`, m: `${cuad} = x^2 ${s > 0 ? '+' : '-'} 2 \\cdot x \\cdot ${b} + ${b}^2 = ${r1}` },
        { t: 'Suma por diferencia: \\((a + b)(a - b) = a^2 - b^2\\).', m: `${sd} = x^2 - ${c}^2 = ${r2}` }
      ],
      res: `${r1}; \\qquad ${r2}`
    };
  }

  /* ================= 6. Factor común ================= */
  /* Ficha: factor k·x^q (k de 2 a 6) y paréntesis de 2 o 3 términos cuyo primer coeficiente es ±1
     y los demás entre −4 y 4 sin el 0 */
  function genFactorComun(R) {
    const k = R.int(2, 6);
    let q = R.pick([0, 1, 1, 2]);
    let grados = R.shuffle([2, 1, 0]).slice(0, R.pick([2, 3])).sort((a, b) => b - a);
    const minG = Math.min(...grados);
    if (minG > 0) { q += minG; grados = grados.map(g => g - minG); }
    const dentro = {};
    grados.forEach((g, i) => { dentro[g] = i === 0 ? R.signo() : R.nz(-4, 4); });
    const orig = {};
    grados.forEach(g => { orig[g + q] = k * dentro[g]; });
    const coefs = Object.values(orig).map(abs);
    const fc = mono(k, q), ext = poliMap(dentro);
    const res = `${fc}(${ext})`;
    const neg = dentro[grados[0]] < 0;
    return {
      enun: poliMap(orig),
      pasos: [
        { t: `Máximo común divisor de los coeficientes: \\(\\text{m.c.d.}(${coefs.join(', ')}) = ${coefs.reduce(mcd)}\\). ${q === 0 ? 'No todos los términos llevan \\(x\\), así que no sale ninguna potencia de \\(x\\).' : `Menor potencia de \\(x\\) común a todos los términos: \\(${xv(q)}\\).`}` },
        { t: `Sacamos \\(${fc}\\) factor común y dividimos cada término entre \\(${fc}\\):`, m: `${poliMap(orig)} = ${res}` },
        ...(neg ? [{ t: `También es correcto sacar \\(${mono(-k, q)}\\): \\(${mono(-k, q)}(${poliMap(Object.fromEntries(Object.entries(dentro).map(([g, c]) => [g, -c])))})\\).` }] : [])
      ],
      res
    };
  }

  registrarFicha({
    id: 'pend2-algebra',
    titulo: 'Expresiones algebraicas',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/algebra-2.html',
    ejercicios: [
      { id: 'lenguaje', nombre: 'Lenguaje algebraico', peso: 0.75, columnas: 2,
        enunciado: ['Expresa en lenguaje algebraico:', 'Expresa en lenguaje algebraico:'], generar: genLenguaje },
      { id: 'monomios', nombre: 'Suma y resta de monomios', peso: 0.75, columnas: 2,
        enunciado: ['Reduce la expresión:', 'Reduce las expresiones:'], generar: genMonomios },
      { id: 'monobin', nombre: 'Monomio por binomio', peso: 0.75, columnas: 3,
        enunciado: ['Multiplica:', 'Multiplica:'], generar: genMonoBin },
      { id: 'operaciones', nombre: 'Operaciones con polinomios', peso: 1.25, columnas: 2,
        enunciado: ['Dados los polinomios, calcula:', 'Dados los polinomios, calcula en cada caso:'], generar: genOperaciones },
      { id: 'identidades', nombre: 'Identidades notables', peso: 1, columnas: 2,
        enunciado: ['Desarrolla aplicando las identidades notables:', 'Desarrolla aplicando las identidades notables:'], generar: genIdentidades },
      { id: 'factor', nombre: 'Factor común', peso: 1, columnas: 2,
        enunciado: ['Saca factor común:', 'Saca factor común:'], generar: genFactorComun }
    ]
  });
})();
