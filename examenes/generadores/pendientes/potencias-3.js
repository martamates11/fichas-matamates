/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Potencias de exponente racional (pendientes de 3.º ESO).
   Los números se generan con los mismos criterios que la ficha interactiva
   pendientes/tercero/potencias-3.html. Los ejercicios de la ficha que se resuelven
   eligiendo en desplegables (signo, resultado y motivo) se adaptan a papel pidiendo
   el cálculo o el razonamiento. Cambios respecto a la ficha:
   · Exponentes negativos: a ≠ b (también en la ficha), para que (a/b)² no sea 1.
   · Misma base: ningún exponente fraccionario es en realidad entero (nada de 2/2
     ni 0/3), y un exponente negativo se escribe −5/3 (también en la ficha).
   · Notación científica: los decimales no acaban en cero (también en la ficha).
   · Para tener variedad suficiente en papel: en «Calcular potencias» las bases van
     de 2 a 6 (en la ficha, de 2 a 4); en «Base 10» cada apartado pide una potencia
     de exponente positivo y otra de exponente negativo; en «Raíces de números
     negativos» los radicandos llegan a −100 (índice 2) y −1000 (índice 3). */
(function () {
  'use strict';
  const { tex, registrarFicha } = window.EX;
  const { n, p } = tex;

  const abs = Math.abs;
  const mcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a; };
  /* Exponente fraccionario k/d en TeX, con el signo delante */
  const fexp = (k, d) => (k < 0 ? '-' : '') + `\\frac{${abs(k)}}{${d}}`;
  /* Base entre paréntesis si es negativa */
  const bp = b => (b < 0 ? `(${b})` : String(b));
  /* Número entero con espacios finos cada tres cifras a partir de 5 cifras: 3\,000\,000 */
  const miles = s => (s.length <= 4 ? s : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'));          // 4 cifras, sin separar (norma RAE)

  /* ================= 1. Signo de una potencia ================= */
  function genSigno(R, i) {
    const b = R.int(2, 9), e = R.int(1, 6);
    const dentro = (i + R.int(0, 1)) % 2 === 0;              // (−b)^e  o  −b^e
    const enun = dentro ? `(-${b})^{${e}}` : `-${b}^{${e}}`;
    const positivo = dentro && e % 2 === 0;
    const motivo = dentro
      ? `La base es negativa y el exponente es ${e % 2 === 0 ? 'par' : 'impar'}: ${e % 2 === 0 ? 'el resultado es positivo' : 'el resultado es negativo'}.`
      : `El signo menos no está dentro del paréntesis: no se eleva, solo afecta al número. Se calcula \\(${b}^{${e}}\\) y se le pone el signo menos delante.`;
    const val = dentro ? Math.pow(-b, e) : -Math.pow(b, e);
    return {
      enun,
      pasos: abs(val) <= 1000 ? [{ t: motivo }, { t: 'Lo comprobamos:', m: `${enun} = ${n(val)}` }] : [{ t: motivo }],
      res: `\\text{${positivo ? 'Positivo' : 'Negativo'}}`,
      resHtml: `${positivo ? 'Positivo' : 'Negativo'}: ${dentro ? `base negativa y exponente ${e % 2 === 0 ? 'par' : 'impar'}` : 'el signo no se eleva'}.`
    };
  }

  /* ================= 2. Exponentes negativos ================= */
  function genNegativos(R, i) {
    const a = R.int(2, 6); let b; do { b = R.int(2, 6); } while (b === a);
    const caso = (i + R.int(0, 3)) % 4;
    if (caso === 0) return {
      enun: `\\left(\\frac{${a}}{${b}}\\right)^{2}`,
      pasos: [{ t: 'Exponente positivo: se elevan el numerador y el denominador.', m: `\\left(\\frac{${a}}{${b}}\\right)^{2} = \\frac{${a}^2}{${b}^2} = \\frac{${a * a}}{${b * b}}` }],
      res: `\\frac{${a * a}}{${b * b}}`
    };
    if (caso === 1) return {
      enun: `\\left(\\frac{${a}}{${b}}\\right)^{-2}`,
      pasos: [{ t: 'Exponente negativo: se invierte la fracción y el exponente pasa a ser positivo.', m: `\\left(\\frac{${a}}{${b}}\\right)^{-2} = \\left(\\frac{${b}}{${a}}\\right)^{2} = \\frac{${b * b}}{${a * a}}` }],
      res: `\\frac{${b * b}}{${a * a}}`
    };
    if (caso === 2) return {
      enun: `${a}^{-2}`,
      pasos: [{ t: 'Exponente negativo: es el inverso de la potencia con exponente positivo.', m: `${a}^{-2} = \\frac{1}{${a}^2} = \\frac{1}{${a * a}}` }],
      res: `\\frac{1}{${a * a}}`
    };
    return {
      enun: `-${b}^{2}`,
      pasos: [{ t: 'El signo menos no está dentro del paréntesis: no se eleva, solo afecta al número.', m: `-${b}^{2} = -(${b} \\cdot ${b}) = -${b * b}` }],
      res: `-${b * b}`
    };
  }

  /* ================= 3. Exponente fraccionario → raíz ================= */
  function genFraccionario(R) {
    const a = R.int(2, 9), d = R.pick([2, 3, 4, 5]);
    let m; do { m = R.int(1, d + 1); } while (mcd(m, d) !== 1);
    const raiz = `\\sqrt${d === 2 ? '' : `[${d}]`}{${a}${m === 1 ? '' : `^{${m}}`}}`;
    return {
      enun: `${a}^{\\frac{${m}}{${d}}}`,
      pasos: [{ t: `El denominador de la fracción (${d}) es el índice de la raíz y el numerador (${m}) es el exponente del radicando${d === 2 ? '; el índice 2 no se escribe' : ''}:`, m: `a^{\\frac{m}{n}} = \\sqrt[n]{a^m} \\;\\Rightarrow\\; ${a}^{\\frac{${m}}{${d}}} = ${raiz}` }],
      res: raiz
    };
  }

  /* ================= 4. Calcular potencias ================= */
  function genCalcular(R, i) {
    const caso = (i + R.int(0, 3)) % 4, b = R.int(2, 6);
    if (caso === 0) {
      const r = R.int(2, 10);
      return { enun: `${r * r}^{\\frac{1}{2}}`, pasos: [{ t: 'Elevar a \\(\\frac{1}{2}\\) es hacer la raíz cuadrada:', m: `${r * r}^{\\frac{1}{2}} = \\sqrt{${r * r}} = ${r}` }], res: n(r) };
    }
    if (caso === 1) return { enun: `(-${b})^{2}`, pasos: [{ t: 'El signo está dentro del paréntesis, así que también se eleva; exponente par, resultado positivo:', m: `(-${b})^{2} = (-${b}) \\cdot (-${b}) = ${b * b}` }], res: n(b * b) };
    if (caso === 2) return { enun: `${b}^{-2}`, pasos: [{ t: 'Exponente negativo: inverso de la potencia con exponente positivo.', m: `${b}^{-2} = \\frac{1}{${b}^2} = \\frac{1}{${b * b}}` }], res: `\\frac{1}{${b * b}}` };
    return { enun: `-${b}^{2}`, pasos: [{ t: 'El signo está fuera del paréntesis: no se eleva.', m: `-${b}^{2} = -${b * b}` }], res: n(-b * b) };
  }

  /* ================= 5. Producto y cociente con la misma base ================= */
  /* Numerador de un exponente k/d que no sea entero (k no múltiplo de d) */
  const noEntero = (R, lo, hi, d) => { let k; do { k = R.int(lo, hi); } while (k % d === 0); return k; };
  function genMismaBase(R, i) {
    const a = R.pick([2, 3, 4, 5, 6, 7]);
    const caso = (i + R.int(0, 3)) % 4;
    let enun, pasoM, k;
    if (caso === 0) {                                           // producto, exponentes fraccionarios
      const d = R.pick([2, 3]), total = R.int(1, 3) * d;
      const e1 = noEntero(R, 1, total - 1, d), e2 = total - e1;
      k = total / d;
      enun = `${a}^{${fexp(e1, d)}} \\cdot ${a}^{${fexp(e2, d)}}`;
      pasoM = `${a}^{${fexp(e1, d)} + ${fexp(e2, d)}} = ${a}^{\\frac{${total}}{${d}}} = ${a}^{${k}}`;
    } else if (caso === 1) {                                    // producto, exponentes negativos
      const e1 = -R.int(1, 3), e2 = -R.int(1, 3); k = e1 + e2;
      enun = `${a}^{${e1}} \\cdot ${a}^{${e2}}`;
      pasoM = `${a}^{${e1} + (${e2})} = ${a}^{${k}}`;
    } else if (caso === 2) {                                    // cociente, exponentes fraccionarios
      const d = R.pick([2, 3]);
      k = R.pick([-2, -1, 1, 1, 2]);                             // como en la ficha: el 0 se cambia por 1
      const e2 = noEntero(R, 1, 4, d), e1 = e2 + k * d;
      enun = `\\frac{${a}^{${fexp(e1, d)}}}{${a}^{${fexp(e2, d)}}}`;
      pasoM = `${a}^{${fexp(e1, d)} - ${fexp(e2, d)}} = ${a}^{${fexp(e1 - e2, d)}} = ${a}^{${k}}`;
    } else {                                                    // cociente, exponentes negativos
      const e1 = -R.int(2, 4), e2 = -R.int(1, 2); k = e1 - e2;
      enun = `\\frac{${a}^{${e1}}}{${a}^{${e2}}}`;
      pasoM = `${a}^{${e1} - (${e2})} = ${a}^{${e1} + ${-e2}} = ${a}^{${k}}`;
    }
    const prod = caso < 2;
    return {
      enun,
      pasos: [
        { t: prod ? 'Producto de potencias de la misma base: se deja la base y se suman los exponentes (aunque sean fracciones).' : 'Cociente de potencias de la misma base: se deja la base y se restan los exponentes (aunque sean fracciones).', m: pasoM }
      ],
      res: `${a}^{${k}}`
    };
  }

  /* ================= 6. Potencias de base 10 ================= */
  const pot10 = e => (e >= 0 ? miles('1' + '0'.repeat(e)) : `0{,}${'0'.repeat(-e - 1)}1`);
  function genBase10(R) {
    const e1 = R.int(1, 6), e2 = R.int(1, 5);
    return {
      enun: `10^{${e1}} \\qquad 10^{-${e2}}`,
      pasos: [
        { t: `Exponente positivo: un 1 seguido de ${e1} ${e1 === 1 ? 'cero' : 'ceros'}.`, m: `10^{${e1}} = ${pot10(e1)}` },
        { t: `Exponente negativo: \\(10^{-${e2}} = \\frac{1}{10^{${e2}}}\\); se escribe «0,», ${e2 - 1} ${e2 - 1 === 1 ? 'cero' : 'ceros'} y un 1 (el 1 queda en la cifra decimal número ${e2}).`, m: `10^{-${e2}} = ${pot10(-e2)}` }
      ],
      res: `10^{${e1}} = ${pot10(e1)} \\qquad 10^{-${e2}} = ${pot10(-e2)}`
    };
  }

  /* ================= 7. Potencia de una potencia ================= */
  function genPotPot(R) {
    const b = R.pick([2, 3, 4, 5, -2, -3, -4]);
    const eA = R.int(1, 3) * R.signo(), eB = R.int(1, 2) * R.signo(), e = eA * eB;
    const pierde = b < 0 && e % 2 === 0;
    const base = pierde ? abs(b) : b;
    const pasos = [{ t: 'Potencia de una potencia: se deja la base y se multiplican los exponentes.', m: `\\left(${bp(b)}^{${eA}}\\right)^{${eB}} = ${bp(b)}^{${eA} \\cdot ${p(eB)}} = ${bp(b)}^{${e}}` }];
    if (b < 0) pasos.push(pierde
      ? { t: `La base es negativa y el exponente ${e} es par, así que el signo desaparece:`, m: `${bp(b)}^{${e}} = ${abs(b)}^{${e}}` }
      : { t: `La base es negativa y el exponente ${e} es impar, así que el signo se mantiene.` });
    return { enun: `\\left(${bp(b)}^{${eA}}\\right)^{${eB}}`, pasos, res: `${bp(base)}^{${e}}` };
  }

  /* ================= 8. Producto y cociente con el mismo exponente ================= */
  const BASES8 = [2, 3, 4, 5, -2, -3, -4];
  const PARES_DIV = [[4, 2], [4, -2], [-4, 2], [-4, -2]];
  function genMismoExp(R, i) {
    const e = R.int(1, 3) * R.signo();
    if ((i + R.int(0, 1)) % 2 === 0) {
      let a, b; do { a = R.pick(BASES8); b = R.pick(BASES8); } while (abs(a) === abs(b));
      const c = a * b;
      return {
        enun: `${bp(a)}^{${e}} \\cdot ${bp(b)}^{${e}}`,
        pasos: [{ t: 'Mismo exponente: se multiplican las bases y se deja el exponente.', m: `${bp(a)}^{${e}} \\cdot ${bp(b)}^{${e}} = \\left(${bp(a)} \\cdot ${bp(b)}\\right)^{${e}} = ${bp(c)}^{${e}}` }],
        res: `${bp(c)}^{${e}}`
      };
    }
    const [a, b] = R.pick(PARES_DIV), c = a / b;
    return {
      enun: `\\frac{${bp(a)}^{${e}}}{${bp(b)}^{${e}}}`,
      pasos: [{ t: 'Mismo exponente: se dividen las bases y se deja el exponente.', m: `\\frac{${bp(a)}^{${e}}}{${bp(b)}^{${e}}} = \\left(\\frac{${a}}{${b}}\\right)^{${e}} = ${bp(c)}^{${e}}` }],
      res: `${bp(c)}^{${e}}`
    };
  }

  /* ================= 9. Notación científica ================= */
  /* mantisa a partir de las cifras significativas «245» → 2{,}45 */
  const mantisa = cif => (cif.length === 1 ? cif : `${cif[0]}{,}${cif.slice(1)}`);
  function genCientifica(R, i) {
    const caso = (i + R.int(0, 3)) % 4;
    let cif, exp, numero;
    if (caso === 0) {                                           // a·10^k grande
      cif = String(R.int(1, 9)); const c = R.int(3, 7);
      numero = miles(cif + '0'.repeat(c)); exp = c;
    } else if (caso === 1) {                                    // a·10^−k pequeño
      cif = String(R.int(1, 9)); const c = R.int(2, 5);
      numero = `0{,}${'0'.repeat(c - 1)}${cif}`; exp = -c;
    } else if (caso === 2) {                                    // dos o tres cifras grande
      const k = R.int(10, 108), c = R.int(2, 4);
      cif = String(k).replace(/0+$/, '');
      numero = miles(k + '0'.repeat(c)); exp = String(k).length - 1 + c;
    } else {                                                    // dos o tres cifras pequeño (sin ceros finales)
      let k; do { k = R.int(10, 108); } while (k % 10 === 0);
      const c = R.int(2, 4);
      cif = String(k);
      numero = `0{,}${'0'.repeat(c - 1)}${k}`; exp = -c;
    }
    const sol = `${mantisa(cif)} \\cdot 10^{${exp}}`;
    return {
      enun: numero,
      pasos: [
        { t: `Se coloca la coma detrás de la primera cifra distinta de cero, para que la parte entera esté entre 1 y 9: \\(${mantisa(cif)}\\).` },
        { t: exp > 0 ? `La coma se ha movido ${exp} lugares hacia la izquierda: el exponente es positivo, ${exp}.` : `La coma se ha movido ${-exp} lugares hacia la derecha: el exponente es negativo, \\(${exp}\\).`, m: `${numero} = ${sol}` }
      ],
      res: sol
    };
  }

  /* ================= 10. Exponentes 0 y 1 ================= */
  function genEspeciales(R, i) {
    const k = R.int(2, 9), caso = (i + R.int(0, 3)) % 4;
    const C = [
      [`(-${k})^{0}`, '1', 'Cualquier número distinto de 0 elevado a 0 es 1 (el signo está dentro del paréntesis).'],
      [`-${k}^{0}`, '-1', `El signo no se eleva, solo el número: \\(${k}^0 = 1\\), así que queda \\(-1\\).`],
      [`${k}^{1}`, String(k), 'Cualquier número elevado a 1 es el mismo número.'],
      [`(-${k})^{1}`, `-${k}`, 'Cualquier número elevado a 1 es el mismo número, y el signo se mantiene.']
    ][caso];
    return { enun: C[0], pasos: [{ t: C[2], m: `${C[0]} = ${C[1]}` }], res: C[1] };
  }

  /* ================= 11. Raíces de números negativos ================= */
  function genRaices(R, i) {
    const caso = (i + R.int(0, 2)) % 3;                         // índice 2, 4 o 3 (este, el doble de veces)
    const ind = caso === 0 ? R.pick([2, 4]) : 3;
    const k = ind === 2 ? R.int(2, 10) : ind === 4 ? R.int(2, 5) : R.int(2, 10);
    const rad = Math.pow(k, ind);
    const raiz = `\\sqrt${ind === 2 ? '' : `[${ind}]`}{-${rad}}`;
    if (ind % 2 === 0) return {
      enun: raiz,
      pasos: [{ t: `El índice es par y el radicando es negativo: ningún número real elevado a ${ind} da un resultado negativo, así que la raíz no existe en \\(\\mathbb{R}\\).` }],
      res: '\\text{No existe en } \\mathbb{R}',
      resHtml: `No existe en \\(\\mathbb{R}\\) (índice par y radicando negativo).`
    };
    return {
      enun: raiz,
      pasos: [{ t: 'El índice es impar: la raíz de un número negativo existe y es negativa.', m: `(-${k})^{3} = -${rad} \\;\\Rightarrow\\; ${raiz} = -${k}` }],
      res: `-${k}`
    };
  }

  registrarFicha({
    id: 'pend3-potencias',
    titulo: 'Potencias de exponente racional',
    detalle: '3.º ESO',
    grupo: 'Recuperación de 3.º ESO',
    enlace: '../pendientes/tercero/potencias-3.html',
    ejercicios: [
      { id: 'signo', nombre: 'Signo de una potencia (sin calcular)', peso: 0.5, columnas: 4,
        enunciado: ['Indica, sin calcularla, si el resultado de la potencia es positivo o negativo, y explica por qué:', 'Indica, sin calcularlas, si el resultado de cada potencia es positivo o negativo, y explica por qué:'],
        generar: genSigno },
      { id: 'negativos', nombre: 'Exponentes negativos', peso: 0.5, columnas: 4,
        enunciado: ['Calcula:', 'Calcula:'], generar: genNegativos },
      { id: 'fraccionario', nombre: 'Exponente fraccionario como raíz', peso: 0.5, columnas: 4,
        enunciado: ['Escribe la potencia en forma de raíz:', 'Escribe cada potencia en forma de raíz:'], generar: genFraccionario },
      { id: 'calcular', nombre: 'Calcular potencias (½, −2, signo)', peso: 0.5, columnas: 4,
        enunciado: ['Calcula mentalmente:', 'Calcula mentalmente:'], generar: genCalcular },
      { id: 'mismabase', nombre: 'Producto y cociente con la misma base', peso: 0.75, columnas: 3,
        enunciado: ['Expresa como una sola potencia:', 'Expresa como una sola potencia:'], generar: genMismaBase },
      { id: 'base10', nombre: 'Potencias de base 10', peso: 0.5, columnas: 3,
        enunciado: ['Escribe el número que corresponde a cada potencia:', 'Escribe el número que corresponde a cada potencia:'], generar: genBase10 },
      { id: 'potpot', nombre: 'Potencia de una potencia', peso: 0.75, columnas: 3,
        enunciado: ['Expresa como una sola potencia:', 'Expresa como una sola potencia:'], generar: genPotPot },
      { id: 'mismoexp', nombre: 'Producto y cociente con el mismo exponente', peso: 0.75, columnas: 3,
        enunciado: ['Expresa como una sola potencia:', 'Expresa como una sola potencia:'], generar: genMismoExp },
      { id: 'cientifica', nombre: 'Notación científica', peso: 0.5, columnas: 3,
        enunciado: ['Escribe en notación científica:', 'Escribe en notación científica:'], generar: genCientifica },
      { id: 'especiales', nombre: 'Exponentes 0 y 1', peso: 0.5, columnas: 4,
        enunciado: ['Calcula:', 'Calcula:'], generar: genEspeciales },
      { id: 'raices', nombre: 'Raíces de números negativos', peso: 0.5, columnas: 4,
        enunciado: ['Calcula, si existe:', 'Calcula, si existen:'], generar: genRaices }
    ]
  });
})();
