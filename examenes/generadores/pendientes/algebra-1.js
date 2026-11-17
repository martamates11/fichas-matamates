/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Álgebra (pendientes de 1.º ESO).
   Mismos criterios que la ficha interactiva pendientes/primero/algebra-1.html, con estos ajustes:
   - Lenguaje algebraico: la ficha pide dos frases a la vez (de un banco de 10); en el examen
     cada apartado es una frase y el banco se ha ampliado a 24 para que haya variedad.
     La frase «el cuadrado de la suma de un número más uno» se redacta sin ambigüedad.
   - El resto de tipos (valor numérico, elementos del monomio, suma y resta de monomios,
     multiplicación de monomios, ecuaciones sencillas, ecuaciones con paréntesis y problema)
     usan los mismos rangos que la ficha.
   - Problema: en la ficha se escribe primero la ecuación y luego la solución; en papel se pide
     «plantea la ecuación y resuélvela» y la solución muestra ambas cosas. */
(function () {
  'use strict';
  const { tex, registrarFicha } = window.EX;
  const { n, p, poli } = tex;

  const abs = Math.abs;

  /* Parte literal a partir de un mapa {letra: exponente}, en orden alfabético: xy^2 */
  const litTeX = mapa => Object.keys(mapa).filter(l => mapa[l] > 0).sort()
    .map(l => l + (mapa[l] > 1 ? `^${mapa[l]}` : '')).join('');
  /* Monomio coef·literal con coef = ±1 sin escribir */
  const monoTeX = (coef, mapa) => {
    const lit = litTeX(mapa);
    if (lit === '') return n(coef);
    return coef === 1 ? lit : coef === -1 ? '-' + lit : n(coef) + lit;
  };
  const potTeX = (l, e) => (e === 1 ? l : `${l}^${e}`);
  /* Suma o resta con signo limpio: «a + b», «a - b» (b siempre positivo) */
  const opTeX = (a, op, b) => `${n(a)} ${op} ${b}`;

  /* ================= 1. Lenguaje algebraico ================= */
  /* [frase, expresión en TeX, explicación] */
  const FRASES = [
    ['el doble de un número más tres unidades', '2x + 3', 'El doble es \\(2x\\); después se suman 3.'],
    ['la tercera parte de un número, disminuida en 8', '\\frac{x}{3} - 8', 'La tercera parte es \\(\\frac{x}{3}\\); después se restan 8.'],
    ['el cuadrado de la suma de un número y uno', '(x + 1)^2', 'Primero la suma \\(x + 1\\) y después se eleva al cuadrado: hace falta el paréntesis.'],
    ['un número más su mitad', 'x + \\frac{x}{2}', 'La mitad del número es \\(\\frac{x}{2}\\).'],
    ['el triple de un número menos cinco', '3x - 5', 'El triple es \\(3x\\); después se restan 5.'],
    ['la suma de dos números consecutivos', 'x + (x + 1)', 'El consecutivo de \\(x\\) es \\(x + 1\\). También vale \\(2x + 1\\).'],
    ['el producto de un número por sí mismo más cuatro', 'x^2 + 4', 'Un número por sí mismo es \\(x \\cdot x = x^2\\); después se suman 4.'],
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
      enun: `<span class="pend-texto">${frase.charAt(0).toUpperCase() + frase.slice(1)}.</span>`,
      pasos: [{ t: `Llamamos \\(x\\) al número. ${expl}` }],
      res
    };
  }

  /* ================= 2. Valor numérico ================= */
  /* Ficha: ax + b, ax − b o x² + b, con b de 1 a 9; a de ±2 a ±9 y x de ±1 a ±9
     (en x² + b, x de ±1 a ±6). */
  function genValor(R) {
    const forma = R.pick(['ax+b', 'ax-b', 'x^2+b']);
    const b = R.int(1, 9);
    let expr, sustit, calc, r, x;
    if (forma === 'x^2+b') {
      x = R.int(1, 6) * R.signo();
      r = x * x + b;
      expr = `x^2 + ${b}`;
      sustit = `${p(x)}^2 + ${b}`;
      calc = `${x * x} + ${b} = ${r}`;
    } else {
      const a = R.int(2, 9) * R.signo();
      x = R.int(1, 9) * R.signo();
      const op = forma === 'ax+b' ? '+' : '-';
      r = a * x + (op === '+' ? b : -b);
      expr = `${poli([[a, 'x']])} ${op} ${b}`;
      sustit = `${p(a)} \\cdot ${p(x)} ${op} ${b}`;
      calc = `${n(a * x)} ${op} ${b} = ${n(r)}`;
    }
    return {
      enun: `${expr} \\quad \\text{para } x = ${n(x)}`,
      pasos: [
        { t: `Sustituimos \\(x\\) por \\(${n(x)}\\) (si es negativo, entre paréntesis):`, m: sustit },
        { t: 'Hacemos primero la potencia o el producto (regla de los signos) y después la suma o la resta:', m: `${sustit} = ${calc}` }
      ],
      res: n(r)
    };
  }

  /* ================= 3. Elementos del monomio ================= */
  const LETRAS = ['x', 'y', 'z', 'a', 'b', 'm', 'n'];
  function genElementos(R) {
    const letras = R.shuffle(LETRAS).slice(0, R.int(1, 3));
    const mapa = {};
    letras.forEach(l => { mapa[l] = R.int(1, 4); });
    const coef = R.nz(-9, 10);
    const lit = litTeX(mapa);
    const grado = Object.values(mapa).reduce((s, v) => s + v, 0);
    const exps = Object.keys(mapa).sort().map(l => mapa[l]);
    const gradoTxt = exps.length > 1
      ? `${exps.join(' + ')} = ${grado}`
      : `${grado}`;
    const mono = monoTeX(coef, mapa);
    return {
      enun: mono,
      pasos: [
        { t: `El coeficiente es el número que multiplica a las letras, con su signo${abs(coef) === 1 ? ' (si no se ve ningún número, es \\(1\\) o \\(-1\\))' : ''}:`, m: `\\text{coeficiente} = ${n(coef)}` },
        { t: 'La parte literal son las letras con sus exponentes:', m: `\\text{parte literal} = ${lit}` },
        { t: `El grado es la suma de los exponentes de las letras${exps.some(e => e === 1) ? ' (una letra sin exponente tiene exponente 1)' : ''}:`, m: `\\text{grado} = ${gradoTxt}` }
      ],
      res: `${n(coef)},\\ ${lit},\\ ${grado}`,
      resHtml: `Coeficiente \\(${n(coef)}\\); parte literal \\(${lit}\\); grado \\(${grado}\\).`
    };
  }

  /* ================= 4. Suma y resta de monomios semejantes ================= */
  const LITERALES = [{ x: 1, y: 1 }, { a: 1, b: 1 }, { x: 2 }, { m: 1, n: 1 }, { y: 3 }, { x: 1 }, { a: 2, b: 1 }, { x: 1, y: 2 }, { m: 2, n: 1 }, { p: 1, q: 1 }];
  function genSumaMono(R) {
    let c1, c2, op, r;
    do {
      c1 = R.nz(-9, 12); c2 = R.int(1, 9); op = R.pick(['+', '-']);
      r = op === '+' ? c1 + c2 : c1 - c2;
    } while (r === 0);
    const mapa = R.pick(LITERALES), lit = litTeX(mapa);
    return {
      enun: `${monoTeX(c1, mapa)} ${op} ${monoTeX(c2, mapa)}`,
      pasos: [
        { t: `Los dos monomios son semejantes (misma parte literal, \\(${lit}\\)), así que se pueden sumar o restar: se operan los coeficientes y la parte literal se mantiene.`,
          m: `${opTeX(c1, op, c2)} = ${n(r)}` },
        { t: 'Escribimos el resultado con la misma parte literal:', m: monoTeX(r, mapa) }
      ],
      res: monoTeX(r, mapa)
    };
  }

  /* ================= 5. Multiplicación de monomios ================= */
  const GRUPOS_LETRAS = [['x'], ['a'], ['y'], ['x', 'y'], ['a', 'b'], ['m', 'n'], ['p']];
  function genMultMono(R) {
    const letras = R.pick(GRUPOS_LETRAS);
    const m1 = {}, m2 = {}, ms = {};
    letras.forEach(l => { m1[l] = R.int(1, 3); m2[l] = R.int(1, 3); ms[l] = m1[l] + m2[l]; });
    const c1 = R.nz(-6, 9), c2 = R.nz(-5, 8), c = c1 * c2;
    const t1 = monoTeX(c1, m1), t2 = monoTeX(c2, m2);
    const par = (c0, t) => (c0 < 0 ? `\\left(${t}\\right)` : t);
    const potencias = letras.map(l => `${potTeX(l, m1[l])} \\cdot ${potTeX(l, m2[l])} = ${l}^{${m1[l]} + ${m2[l]}} = ${potTeX(l, ms[l])}`).join(' \\qquad ');
    return {
      enun: `${par(c1, t1)} \\cdot ${par(c2, t2)}`,
      pasos: [
        { t: 'Multiplicamos los coeficientes (regla de los signos):', m: `${p(c1)} \\cdot ${p(c2)} = ${n(c)}` },
        { t: `Multiplicamos las letras: se suman los exponentes de cada letra (una letra sin exponente tiene exponente 1):`, m: potencias },
        { t: 'Juntamos el coeficiente y la parte literal:', m: monoTeX(c, ms) }
      ],
      res: monoTeX(c, ms)
    };
  }

  /* ================= 6. Ecuaciones sencillas ================= */
  function genSencilla(R) {
    const b = R.int(1, 12), sol = R.nz(-9, 15);
    const suma = R.rand() < 0.5;
    const c = suma ? sol + b : sol - b;
    const enun = `x ${suma ? '+' : '-'} ${b} = ${n(c)}`;
    return {
      enun,
      pasos: [
        { t: `El ${b} pasa al otro miembro con la operación contraria (${suma ? 'sumaba, resta' : 'restaba, suma'}):`, m: `x = ${n(c)} ${suma ? '-' : '+'} ${b} = ${n(sol)}` },
        { t: 'Comprobación: sustituimos \\(x\\) en la ecuación.', m: `${p(sol)} ${suma ? '+' : '-'} ${b} = ${n(c)}` }
      ],
      res: `x = ${n(sol)}`
    };
  }

  /* ================= 7. Ecuaciones con paréntesis ================= */
  function genParentesis(R) {
    const a = R.int(2, 7), b = R.int(1, 9);
    const suma = R.rand() < 0.5;
    const sol = suma ? R.int(1, 10) : b + R.int(1, 8);
    const c = suma ? a * (sol + b) : a * (sol - b);
    const ab = a * b, k = suma ? c - ab : c + ab;
    return {
      enun: `${a}(x ${suma ? '+' : '-'} ${b}) = ${c}`,
      pasos: [
        { t: `Quitamos el paréntesis multiplicando el ${a} por cada término:`, m: `${a}x ${suma ? '+' : '-'} ${ab} = ${c}` },
        { t: `Pasamos el ${ab} al otro miembro con la operación contraria:`, m: `${a}x = ${c} ${suma ? '-' : '+'} ${ab} = ${k}` },
        { t: `El ${a} está multiplicando a \\(x\\): pasa dividiendo.`, m: `x = \\frac{${k}}{${a}} = ${sol}` }
      ],
      res: `x = ${sol}`
    };
  }

  /* ================= 8. Problema: plantear y resolver ================= */
  const MULTIPLOS = { 2: 'doble', 3: 'triple', 4: 'cuádruple', 5: 'quíntuple' };
  function genProblema(R) {
    let a, c, x, b, d;
    do {
      a = R.int(3, 5); c = R.int(2, a - 1); x = R.int(2, 12); b = R.int(1, 9);
      d = (a - c) * x - b;
    } while (d < 1);
    const texto = `Halla un número cuyo ${MULTIPLOS[a]} menos ${b} sea igual a su ${MULTIPLOS[c]} más ${d}.`;
    const dif = a - c, rhs = d + b;
    return {
      html: true,
      enun: `<span class="pend-texto">${texto}</span>`,
      pasos: [
        { t: `Llamamos \\(x\\) al número. Su ${MULTIPLOS[a]} es \\(${a}x\\) y su ${MULTIPLOS[c]}, \\(${c}x\\). Planteamos la ecuación:`, m: `${a}x - ${b} = ${c}x + ${d}` },
        { t: `Pasamos las \\(x\\) a un miembro y los números al otro (cada término cambia de signo al cambiar de miembro):`, m: `${a}x - ${c}x = ${d} + ${b}` },
        { t: 'Reducimos:', m: `${poli([[dif, 'x']])} = ${rhs}` },
        ...(dif === 1 ? [] : [{ t: `El ${dif} está multiplicando a \\(x\\): pasa dividiendo.`, m: `x = \\frac{${rhs}}{${dif}} = ${x}` }]),
        { t: 'Comprobación:', m: `${a} \\cdot ${x} - ${b} = ${a * x - b} \\qquad ${c} \\cdot ${x} + ${d} = ${c * x + d}` }
      ],
      res: `${a}x - ${b} = ${c}x + ${d} \;\\Rightarrow\; x = ${x}`,
      resHtml: `Ecuación: \\(${a}x - ${b} = ${c}x + ${d}\\). El número es \\(${x}\\).`
    };
  }

  registrarFicha({
    id: 'pend1-algebra',
    titulo: 'Álgebra',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/algebra-1.html',
    ejercicios: [
      { id: 'lenguaje', nombre: 'Lenguaje algebraico', peso: 0.5, columnas: 2,
        enunciado: ['Escribe en lenguaje algebraico, llamando \\(x\\) al número:', 'Escribe en lenguaje algebraico, llamando \\(x\\) al número:'], generar: genLenguaje },
      { id: 'valor', nombre: 'Valor numérico', peso: 0.5, columnas: 3,
        enunciado: ['Calcula el valor numérico de la expresión:', 'Calcula el valor numérico de las expresiones:'], generar: genValor },
      { id: 'elementos', nombre: 'Elementos del monomio', peso: 0.5, columnas: 3,
        enunciado: ['Indica el coeficiente, la parte literal y el grado del monomio:', 'Indica el coeficiente, la parte literal y el grado de los monomios:'], generar: genElementos },
      { id: 'sumamono', nombre: 'Suma y resta de monomios', peso: 0.5, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genSumaMono },
      { id: 'multmono', nombre: 'Multiplicación de monomios', peso: 0.5, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genMultMono },
      { id: 'sencilla', nombre: 'Ecuaciones sencillas', peso: 0.5, columnas: 3,
        enunciado: ['Resuelve la ecuación:', 'Resuelve las ecuaciones:'], generar: genSencilla },
      { id: 'parentesis', nombre: 'Ecuaciones con paréntesis', peso: 0.75, columnas: 3,
        enunciado: ['Resuelve la ecuación:', 'Resuelve las ecuaciones:'], generar: genParentesis },
      { id: 'problema', nombre: 'Problema: plantear y resolver', peso: 1, columnas: 1,
        enunciado: ['Plantea una ecuación y resuélvela:', 'Plantea una ecuación y resuélvelas:'], generar: genProblema }
    ]
  });
})();
