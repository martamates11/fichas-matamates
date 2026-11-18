/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Potencias de números enteros (pendientes de 2.º ESO).
   Cada apartado reproduce un bloque de la ficha pendientes/segundo/potencias-2.html
   (normalmente sus cuatro casos), con los mismos rangos. En la ficha los ejercicios de
   desplegables (signo, motivo) se adaptan aquí a «calcula» o «indica el signo y justifica». */
(function () {
  'use strict';
  const { tex, registrarFicha, mcd } = window.EX;
  const { n, p } = tex;

  const P = b => (b < 0 ? `(${b})` : `${b}`);
  const pot = (b, e) => `${P(b)}^{${e}}`;
  const F = (a, b) => `\\frac{${a}}{${b}}`;
  const fila = l => l.map(x => `{${x}}`).join('\\qquad ');   // entre llaves: el «−» inicial no se lee como resta
  const lista = l => l.join(';\\quad ');
  const BASES = [2, 3, 4, 5, -2, -3, -4];
  /* Cuatro casos en orden aleatorio: cada caso es { e: enunciado, t: explicación, m: cálculo, r: resultado } */
  function grupo(R, casos, extra = {}) {
    const c = R.shuffle(casos);
    return Object.assign({
      enun: fila(c.map(x => x.e)),
      pasos: c.map(x => ({ t: x.t, m: x.m })),
      res: lista(c.map(x => x.r))
    }, extra);
  }

  /* ================= 1. Signo de la potencia ================= */
  function genSigno(R) {
    const b = R.int(2, 9), par = () => R.pick([2, 4, 6]), impar = () => R.pick([1, 3, 5]);
    const [e1, e2, e3, e4] = [par(), impar(), par(), impar()];
    const fuera = 'El signo menos está fuera: el exponente solo afecta al número, así que el resultado es negativo.';
    return grupo(R, [
      { e: `(-${b})^{${e1}}`, t: 'Base negativa y exponente par: positivo.', m: `(-${b})^{${e1}} > 0`, r: `(-${b})^{${e1}} > 0` },
      { e: `(-${b})^{${e2}}`, t: 'Base negativa y exponente impar: negativo.', m: `(-${b})^{${e2}} < 0`, r: `(-${b})^{${e2}} < 0` },
      { e: `-${b}^{${e3}}`, t: fuera, m: `-${b}^{${e3}} = -(${b}^{${e3}}) < 0`, r: `-${b}^{${e3}} < 0` },
      { e: `-${b}^{${e4}}`, t: fuera, m: `-${b}^{${e4}} = -(${b}^{${e4}}) < 0`, r: `-${b}^{${e4}} < 0` }
    ]);
  }

  /* ================= 2. Exponentes negativos ================= */
  /* Ficha: a y b entre 2 y 6; aquí (solo en el examen) distintos y primos entre sí,
     para que los resultados no se repitan y salgan simplificados. */
  function genExpNeg(R) {
    let a, b; do { a = R.int(2, 6); b = R.int(2, 6); } while (a === b || mcd(a, b) !== 1);
    const fr = `\\left(${F(a, b)}\\right)`;
    return grupo(R, [
      { e: `${fr}^{2}`, t: 'Exponente positivo: elevamos numerador y denominador.', m: `${fr}^{2} = ${F(`${a}^2`, `${b}^2`)} = ${F(a * a, b * b)}`, r: F(a * a, b * b) },
      { e: `${fr}^{-2}`, t: 'Exponente negativo: invertimos la fracción y el exponente pasa a ser positivo.', m: `${fr}^{-2} = \\left(${F(b, a)}\\right)^{2} = ${F(b * b, a * a)}`, r: F(b * b, a * a) },
      { e: `${a}^{-2}`, t: 'Exponente negativo: es el inverso de la potencia con exponente positivo.', m: `${a}^{-2} = ${F(1, `${a}^2`)} = ${F(1, a * a)}`, r: F(1, a * a) },
      { e: `-${b}^{2}`, t: 'El signo menos no se eleva: solo afecta al número.', m: `-${b}^{2} = -(${b} \\cdot ${b}) = -${b * b}`, r: `-${b * b}` }
    ]);
  }

  /* ================= 3. Calcular potencias ================= */
  function genCalcular(R) {
    const b1 = R.int(2, 4), e1 = R.int(2, 3), b2 = R.int(2, 4), b3 = R.int(2, 4), b4 = R.int(2, 4);
    return grupo(R, [
      { e: `${b1}^{${e1}}`, t: 'Multiplicamos la base por sí misma tantas veces como indica el exponente.', m: `${b1}^{${e1}} = ${Array(e1).fill(b1).join(' \\cdot ')} = ${Math.pow(b1, e1)}`, r: n(Math.pow(b1, e1)) },
      { e: `(-${b2})^{2}`, t: 'El signo está dentro del paréntesis: se eleva. Exponente par, resultado positivo.', m: `(-${b2})^{2} = (-${b2}) \\cdot (-${b2}) = ${b2 * b2}`, r: n(b2 * b2) },
      { e: `${b3}^{-2}`, t: 'Exponente negativo: inverso de la potencia con exponente positivo.', m: `${b3}^{-2} = ${F(1, `${b3}^2`)} = ${F(1, b3 * b3)}`, r: F(1, b3 * b3) },
      { e: `-${b4}^{2}`, t: 'El signo está fuera: no se eleva.', m: `-${b4}^{2} = -${b4 * b4}`, r: `-${b4 * b4}` }
    ]);
  }

  /* ================= 4. Producto y cociente de potencias de la misma base ================= */
  function genMismaBase(R) {
    const b = R.pick(BASES);
    const e1 = R.int(1, 3), e2 = R.int(1, 3), e3 = -R.int(1, 3), e4 = -R.int(1, 3);
    const e5 = R.int(3, 5), e6 = R.int(1, 2), e7 = -R.int(2, 4), e8 = -R.int(1, 2);
    const prod = (x, y) => ({ e: `${pot(b, x)} \\cdot ${pot(b, y)}`, t: 'Producto de potencias de la misma base: se deja la base y se suman los exponentes.', m: `${pot(b, x)} \\cdot ${pot(b, y)} = ${P(b)}^{${n(x)} + ${p(y)}} = ${pot(b, x + y)}`, r: pot(b, x + y) });
    const coc = (x, y) => ({ e: F(pot(b, x), pot(b, y)), t: 'Cociente de potencias de la misma base: se deja la base y se restan los exponentes.', m: `${F(pot(b, x), pot(b, y))} = ${P(b)}^{${n(x)} - ${p(y)}} = ${pot(b, x - y)}`, r: pot(b, x - y) });
    return grupo(R, [prod(e1, e2), prod(e3, e4), coc(e5, e6), coc(e7, e8)]);
  }

  /* ================= 5. Potencias de base 10 ================= */
  const miles = s => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s);   // 1000, 10\,000
  function genBase10(R) {
    const e1 = R.int(2, 5), e2 = R.int(2, 4);
    const pos = e => ({ e: `10^{${e}}`, t: 'Exponente positivo: un 1 seguido de tantos ceros como indica el exponente.', m: `10^{${e}} = ${miles('1' + '0'.repeat(e))}`, r: miles('1' + '0'.repeat(e)) });
    const neg = e => ({ e: `10^{-${e}}`, t: `Exponente negativo: \\(10^{-${e}} = ${F(1, `10^{${e}}`)}\\); es un número decimal con el 1 en la cifra decimal número ${e}.`, m: `10^{-${e}} = 0{,}${'0'.repeat(e - 1)}1`, r: `0{,}${'0'.repeat(e - 1)}1` });
    return grupo(R, [pos(e1), neg(e2), pos(1), neg(1)]);
  }

  /* ================= 6. Potencia de una potencia ================= */
  /* Ficha: base ±2..±5 (sin −5), exponentes ±1..3 y ±1..2; aquí (solo en el examen) se evita
     que el exponente final sea 1 o −1, que deja el ejercicio sin contenido. */
  function genPotPot(R) {
    let b, a, c;
    do { b = R.pick(BASES); a = R.int(1, 3) * R.signo(); c = R.int(1, 2) * R.signo(); } while (Math.abs(a * c) === 1);
    const e = a * c, par = b < 0 && e % 2 === 0;
    const final = pot(b, e) + (par ? ` = ${pot(-b, e)}` : '');
    return {
      enun: `\\left(${pot(b, a)}\\right)^{${c}}`,
      pasos: [
        { t: 'Potencia de una potencia: se deja la base y se multiplican los exponentes.', m: `\\left(${pot(b, a)}\\right)^{${c}} = ${P(b)}^{${n(a)} \\cdot ${p(c)}} = ${pot(b, e)}` },
        ...(par ? [{ t: 'Como la base es negativa y el exponente es par, también se puede escribir con la base positiva:', m: final }] : [])
      ],
      res: final
    };
  }

  /* ================= 7. Producto y cociente de potencias del mismo exponente ================= */
  const PARES_DIV = [];
  BASES.forEach(x => BASES.forEach(y => { if (x !== y && x % y === 0) PARES_DIV.push([x, y]); }));
  function genMismoExp(R) {
    const e = R.int(1, 3) * R.signo();
    const dos = () => { const i = R.int(0, BASES.length - 1); let j = R.int(0, BASES.length - 2); if (j >= i) j++; return [BASES[i], BASES[j]]; };
    const prod = ([x, y]) => ({ e: `${pot(x, e)} \\cdot ${pot(y, e)}`, t: 'Mismo exponente: se multiplican las bases y se deja el exponente.', m: `${pot(x, e)} \\cdot ${pot(y, e)} = \\left(${P(x)} \\cdot ${P(y)}\\right)^{${e}} = ${pot(x * y, e)}`, r: pot(x * y, e) });
    const coc = ([x, y]) => ({ e: F(pot(x, e), pot(y, e)), t: 'Mismo exponente: se dividen las bases y se deja el exponente.', m: `${F(pot(x, e), pot(y, e))} = \\left(${P(x)} : ${P(y)}\\right)^{${e}} = ${pot(x / y, e)}`, r: pot(x / y, e) });
    return grupo(R, [prod(dos()), prod(dos()), coc(R.pick(PARES_DIV)), coc(R.pick(PARES_DIV))]);
  }

  /* ================= 8. Notación científica ================= */
  /* Mismos números que la ficha; en el cuarto se evita una cifra final 0 (0,040 → 0,04…) */
  function genCientifica(R) {
    const mant = s => (/^0*$/.test(s.slice(1)) ? s[0] : `${s[0]}{,}${s.slice(1).replace(/0+$/, '')}`);
    const n1 = R.int(1, 9), c1 = R.int(3, 7);
    const n2 = R.int(1, 9), c2 = R.int(2, 5);
    const n3 = R.int(10, 108), c3 = R.int(2, 4);
    let n4; do { n4 = R.int(10, 108); } while (n4 % 10 === 0);
    const c4 = R.int(2, 4);
    const grande = (num, k) => {
      const s = String(num) + '0'.repeat(k), e = s.length - 1;
      return { e: miles(s), t: `Número grande: corremos la coma ${e} lugares a la izquierda, hasta dejar una sola cifra entera distinta de 0; el exponente es positivo.`, m: `${miles(s)} = ${mant(String(num))} \\cdot 10^{${e}}`, r: `${mant(String(num))} \\cdot 10^{${e}}` };
    };
    const peq = (num, k) => {
      const s = `0{,}${'0'.repeat(k - 1)}${num}`;
      return { e: s, t: `Número menor que 1: corremos la coma ${k} ${k === 1 ? 'lugar' : 'lugares'} a la derecha, hasta la primera cifra distinta de 0; el exponente es negativo.`, m: `${s} = ${mant(String(num))} \\cdot 10^{-${k}}`, r: `${mant(String(num))} \\cdot 10^{-${k}}` };
    };
    return grupo(R, [grande(n1, c1), peq(n2, c2), grande(n3, c3), peq(n4, c4)]);
  }

  /* ================= 9. Exponentes 0 y 1 ================= */
  function genEspeciales(R) {
    const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9);
    return grupo(R, [
      { e: `(-${a})^{0}`, t: 'Cualquier número distinto de 0 elevado a 0 es 1.', m: `(-${a})^{0} = 1`, r: '1' },
      { e: `-${a}^{0}`, t: 'El signo no se eleva, solo el número, y \\(' + a + '^0 = 1\\).', m: `-${a}^{0} = -1`, r: '-1' },
      { e: `${b}^{1}`, t: 'Cualquier número elevado a 1 es el mismo número.', m: `${b}^{1} = ${b}`, r: `${b}` },
      { e: `(-${c})^{1}`, t: 'Elevado a 1 queda el mismo número, con su signo.', m: `(-${c})^{1} = -${c}`, r: `-${c}` }
    ]);
  }

  /* ================= 10. Raíces de números negativos ================= */
  function genRaices(R) {
    const a = R.int(2, 6), b = R.int(2, 6), c = R.int(2, 6), d = c + 1;
    const par = (i, v) => { const raiz = `\\sqrt${i === 2 ? '' : `[${i}]`}{-${v}}`; return { e: raiz, t: 'Índice par y radicando negativo: ningún número real elevado a un exponente par da negativo.', m: `${raiz} \\text{ no existe en } \\mathbb{R}`, r: `${raiz} \\text{ no existe}` }; };
    const impar = k => { const raiz = `\\sqrt[3]{-${k * k * k}}`; return { e: raiz, t: 'Índice impar y radicando negativo: la raíz existe y es negativa.', m: `${raiz} = -${k} \\quad\\text{porque}\\quad (-${k})^3 = -${k * k * k}`, r: `${raiz} = -${k}` }; };
    return grupo(R, [par(2, a * a), par(4, Math.pow(b, 4)), impar(c), impar(d)]);
  }

  const E = (s, pl) => [s, pl || s];
  registrarFicha({
    id: 'pend2-potencias',
    titulo: 'Potencias de números enteros',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/potencias-2.html',
    ejercicios: [
      { id: 'signo', nombre: 'Signo de una potencia', peso: 0.75, columnas: 1,
        enunciado: E('Sin calcularlas, indica si cada potencia es positiva o negativa y explica por qué:'), generar: genSigno },
      { id: 'expneg', nombre: 'Exponentes negativos y fracciones', peso: 1, columnas: 1,
        enunciado: E('Calcula:'), generar: genExpNeg },
      { id: 'calcular', nombre: 'Calcular potencias', peso: 0.75, columnas: 1,
        enunciado: E('Calcula mentalmente:'), generar: genCalcular },
      { id: 'mismabase', nombre: 'Producto y cociente con la misma base', peso: 1, columnas: 1,
        enunciado: E('Expresa como una sola potencia:'), generar: genMismaBase },
      { id: 'base10', nombre: 'Potencias de base 10', peso: 0.5, columnas: 1,
        enunciado: E('Escribe el número que corresponde a cada potencia:'), generar: genBase10 },
      { id: 'potpot', nombre: 'Potencia de una potencia', peso: 0.5, columnas: 3,
        enunciado: E('Expresa como una sola potencia:'), generar: genPotPot },
      { id: 'mismoexp', nombre: 'Producto y cociente con el mismo exponente', peso: 1, columnas: 1,
        enunciado: E('Expresa como una sola potencia:'), generar: genMismoExp },
      { id: 'cientifica', nombre: 'Notación científica', peso: 1, columnas: 1,
        enunciado: E('Escribe en notación científica:'), generar: genCientifica },
      { id: 'especiales', nombre: 'Exponentes 0 y 1', peso: 0.5, columnas: 1,
        enunciado: E('Calcula y explica el resultado:'), generar: genEspeciales },
      { id: 'raices', nombre: 'Raíces de números negativos', peso: 0.75, columnas: 1,
        enunciado: E('Calcula, si existen, y justifica:'), generar: genRaices }
    ]
  });
})();
