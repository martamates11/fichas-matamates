/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Ecuaciones (pendientes de 2.º ESO).
   Mismos criterios que la ficha pendientes/segundo/ecuaciones-2.html. Los problemas,
   que en la ficha eran un banco fijo de seis, se generan ahora con plantillas de datos
   variables (el mismo cambio se ha hecho en la ficha). */
(function () {
  'use strict';
  const { tex, registrarFicha, despejeLineal, mcm } = window.EX;
  const { n, p, poli } = tex;

  const abs = Math.abs;
  const menos = s => String(s).replace(/-/g, '−');

  /* ================= 1. Ecuaciones sencillas: x ± a = b ================= */
  /* Ficha: x entre −15 y 15, a entre 1 y 20 */
  function genSencilla(R) {
    const x = R.int(-15, 15), a = R.int(1, 20), op = R.pick(['+', '-']);
    const b = op === '+' ? x + a : x - a;
    const enun = `x ${op} ${a} = ${n(b)}`;
    const paso = op === '+'
      ? { t: `El ${a} está sumando: pasa al otro miembro restando.`, m: `x = ${n(b)} - ${a} = ${n(x)}` }
      : { t: `El ${a} está restando: pasa al otro miembro sumando.`, m: `x = ${n(b)} + ${a} = ${n(x)}` };
    return { enun, pasos: [paso], res: `x = ${n(x)}` };
  }

  /* ================= 2. Ecuaciones con paréntesis: a(x + b) = c ================= */
  /* Ficha: x entre −12 y 12, a entre 2 y 9, b entre −10 y 10 sin el 0 */
  function genParentesis(R) {
    const x = R.int(-12, 12), a = R.int(2, 9), b = R.nz(-10, 10);
    const c = a * (x + b), ab = a * b;
    const enun = `${a}(${poli([[1, 'x'], [b, '']])}) = ${n(c)}`;
    const ax = c - ab;
    return {
      enun,
      pasos: [
        { t: `Quitamos el paréntesis multiplicando el ${a} por cada término:`, m: `${poli([[a, 'x'], [ab, '']])} = ${n(c)}` },
        { t: `Pasamos el ${abs(ab)} al otro miembro ${ab > 0 ? 'restando' : 'sumando'}:`, m: `${a}x = ${n(c)} ${ab > 0 ? '-' : '+'} ${abs(ab)} = ${n(ax)}` },
        { t: `Pasamos el ${a}, que multiplica, al otro miembro dividiendo:`, m: despejeLineal(a, ax, 'x').m }
      ],
      res: `x = ${n(x)}`
    };
  }

  /* ================= 3. Problemas de primer grado ================= */
  /* Plantillas con datos variables. La misma función está en la ficha (generarProblema),
     que comprueba la ecuación planteada comparando coeficientes, así que se escribe
     siempre en forma desarrollada (sin paréntesis). */
  const MULT = { 2: 'doble', 3: 'triple', 4: 'cuádruple', 5: 'quíntuple' };
  const NOMBRES = [['Pedro', 'Juan'], ['Lucía', 'Marta'], ['Hugo', 'Daniel'], ['Sara', 'Noa'], ['Pablo', 'Álvaro'], ['Carmen', 'Irene']];
  function generarProblema(R) {
    const t = R.int(0, 6);
    let x, A, B, k, k2;
    switch (t) {
      case 0: {   // m1·x − A = m2·x + B (m1 > m2)
        k2 = R.pick([2, 3]); k = k2 + R.pick([1, 1, 2]);
        do { x = R.int(2, 15); A = R.int(1, 12); B = (k - k2) * x - A; } while (B < 1);
        return {
          texto: `El ${MULT[k]} de un número, menos ${A}, es igual al ${MULT[k2]} del mismo número más ${B}. Plantea la ecuación y halla el número.`,
          ecuacion: `${k}x-${A}=${k2}x+${B}`, tex: `${k}x - ${A} = ${k2}x + ${B}`, L: [k, -A], D: [k2, B], x,
          planteo: `Llamamos \\(x\\) al número: su ${MULT[k]} es \\(${k}x\\) y su ${MULT[k2]}, \\(${k2}x\\).`,
          conclusion: `El número es ${menos(x)}.`
        };
      }
      case 1: {   // x + k·x = S
        k = R.pick([2, 3]); x = R.int(2, 15);
        return {
          texto: `La suma de un número y su ${MULT[k]} es igual a ${(k + 1) * x}. Plantea la ecuación y halla el número.`,
          ecuacion: `x+${k}x=${(k + 1) * x}`, tex: `x + ${k}x = ${(k + 1) * x}`, simpl: `${k + 1}x = ${(k + 1) * x}`, L: [k + 1, 0], D: [0, (k + 1) * x], x,
          planteo: `Llamamos \\(x\\) al número; su ${MULT[k]} es \\(${k}x\\).`,
          conclusion: `El número es ${x}.`
        };
      }
      case 2: {   // k·x ± A = B
        k = R.pick([2, 3, 4]); const suma = R.rand() < 0.5;
        do { x = R.int(1, 15); A = R.int(1, 12); B = suma ? k * x + A : k * x - A; } while (B < 1);
        return {
          texto: suma ? `Si al ${MULT[k]} de un número le sumamos ${A}, obtenemos ${B}. Plantea la ecuación y halla el número.`
            : `Si al ${MULT[k]} de un número le restamos ${A}, obtenemos ${B}. Plantea la ecuación y halla el número.`,
          ecuacion: `${k}x${suma ? '+' : '-'}${A}=${B}`, tex: `${k}x ${suma ? '+' : '-'} ${A} = ${B}`, L: [k, suma ? A : -A], D: [0, B], x,
          planteo: `Llamamos \\(x\\) al número; su ${MULT[k]} es \\(${k}x\\).`,
          conclusion: `El número es ${x}.`
        };
      }
      case 3: {   // m1·x + A = m2·x − B (m1 < m2)
        k = R.pick([2, 3]); k2 = k + R.pick([1, 1, 2]);
        do { x = R.int(2, 15); A = R.int(1, 12); B = (k2 - k) * x - A; } while (B < 1);
        return {
          texto: `El ${MULT[k]} de un número, aumentado en ${A}, es igual al ${MULT[k2]} del mismo número disminuido en ${B}. Plantea la ecuación y halla el número.`,
          ecuacion: `${k}x+${A}=${k2}x-${B}`, tex: `${k}x + ${A} = ${k2}x - ${B}`, L: [k, A], D: [k2, -B], x,
          planteo: `Llamamos \\(x\\) al número: su ${MULT[k]} es \\(${k}x\\) y su ${MULT[k2]}, \\(${k2}x\\).`,
          conclusion: `El número es ${x}.`
        };
      }
      case 4: {   // x − A = k·x (solución negativa)
        k = R.pick([2, 3]);
        do { A = R.int(2, 12); } while (A % (k - 1) !== 0);
        x = -A / (k - 1);
        return {
          texto: `Si a un número le restamos ${A}, el resultado es el ${MULT[k]} de ese número. Plantea la ecuación y halla el número.`,
          ecuacion: `x-${A}=${k}x`, tex: `x - ${A} = ${k}x`, L: [1, -A], D: [k, 0], x,
          planteo: `Llamamos \\(x\\) al número; su ${MULT[k]} es \\(${k}x\\).`,
          conclusion: `El número es ${menos(x)}.`
        };
      }
      case 5: {   // edades: x + (k·x ± A) = S
        const [P, J] = R.pick(NOMBRES); k = R.pick([2, 3]); const mas = R.rand() < 0.4;
        x = R.int(6, 15); A = R.int(1, 6);
        const S = (k + 1) * x + (mas ? A : -A);
        return {
          texto: `${P} tiene ${A} ${A === 1 ? 'año' : 'años'} ${mas ? 'más' : 'menos'} que el ${MULT[k]} de la edad de ${J}. Si entre los dos suman ${S} años, llama x a la edad de ${J}, plantea la ecuación en su forma desarrollada (sin paréntesis) y halla la edad de ${J}.`,
          ecuacion: `x+${k}x${mas ? '+' : '-'}${A}=${S}`, tex: `x + ${k}x ${mas ? '+' : '-'} ${A} = ${S}`, simpl: `${k + 1}x ${mas ? '+' : '-'} ${A} = ${S}`,
          L: [k + 1, mas ? A : -A], D: [0, S], x,
          planteo: `Edad de ${J}: \\(x\\). Edad de ${P}: \\(${k}x ${mas ? '+' : '-'} ${A}\\). Entre los dos suman ${S}.`,
          conclusion: `${J} tiene ${x} años (y ${P}, ${k * x + (mas ? A : -A)}).`
        };
      }
      default: {  // números consecutivos
        const tres = R.rand() < 0.6; x = R.int(2, 30);
        const S = tres ? 3 * x + 3 : 2 * x + 1;
        return {
          texto: `La suma de ${tres ? 'tres' : 'dos'} números consecutivos es ${S}. Llama x al menor, plantea la ecuación en su forma desarrollada (sin paréntesis) y halla los números.`,
          ecuacion: tres ? `x+x+1+x+2=${S}` : `x+x+1=${S}`, tex: tres ? `x + x + 1 + x + 2 = ${S}` : `x + x + 1 = ${S}`,
          simpl: tres ? `3x + 3 = ${S}` : `2x + 1 = ${S}`, L: tres ? [3, 3] : [2, 1], D: [0, S], x,
          planteo: tres ? 'Si el menor es \\(x\\), los siguientes son \\(x + 1\\) y \\(x + 2\\).' : 'Si el menor es \\(x\\), el siguiente es \\(x + 1\\).',
          conclusion: tres ? `Los números son ${x}, ${x + 1} y ${x + 2}.` : `Los números son ${x} y ${x + 1}.`
        };
      }
    }
  }

  /* Resolución de p·x + q = r·x + s, con la ecuación ya simplificada */
  function resolverLineal([pc, q], [r, s]) {
    const pasos = [];
    const k = pc - r, d = s - q;
    if (r !== 0 || q !== 0) {
      pasos.push({
        t: 'Pasamos los términos con \\(x\\) a un miembro y los números al otro:',
        m: `${poli([[pc, 'x'], [-r, 'x']])} = ${poli([[s, ''], [-q, '']])}`
      });
    }
    pasos.push({ t: r !== 0 || q !== 0 ? 'Operamos y despejamos:' : 'Despejamos:', m: despejeLineal(k, d, 'x').m });
    return pasos;
  }

  function genProblema(R) {
    const P = generarProblema(R);
    const pasos = [
      { t: P.planteo },
      { t: 'Planteamos la ecuación:', m: P.tex }
    ];
    if (P.simpl) pasos.push({ t: 'Agrupamos los términos semejantes:', m: P.simpl });
    pasos.push(...resolverLineal(P.L, P.D));
    pasos.push({ t: P.conclusion });
    return {
      html: true,
      enun: `<span class="pend-texto">${P.texto.replace(/\bx\b/g, '\\(x\\)')}</span>`,
      pasos,
      res: `${P.tex} \\;\\Rightarrow\\; x = ${n(P.x)}`,
      resHtml: `\\(${P.tex} \\;\\Rightarrow\\; x = ${n(P.x)}\\). ${P.conclusion}`
    };
  }

  /* ================= 4. Ecuaciones con fracciones: x/n1 ± x/n2 = b ================= */
  /* Ficha: denominadores distintos de {2, 3, 4, 6}; x = k·m.c.m. con k entre −3 y 3 sin el 0 */
  function genFracciones(R) {
    const n1 = R.pick([2, 3, 4, 6]);
    let n2; do { n2 = R.pick([2, 3, 4, 6]); } while (n2 === n1);
    const L = mcm(n1, n2), x = R.nz(-3, 3) * L, op = R.pick(['+', '-']);
    const b = op === '+' ? x / n1 + x / n2 : x / n1 - x / n2;
    const c1 = L / n1, c2 = L / n2, k = op === '+' ? c1 + c2 : c1 - c2;
    const enun = `\\frac{x}{${n1}} ${op} \\frac{x}{${n2}} = ${n(b)}`;
    const cx = c => (c === 1 ? 'x' : c + 'x');
    return {
      enun,
      pasos: [
        { t: `Quitamos denominadores multiplicando los dos miembros por \\(\\text{m.c.m.}(${n1}, ${n2}) = ${L}\\):`, m: `${L} \\cdot \\frac{x}{${n1}} ${op} ${L} \\cdot \\frac{x}{${n2}} = ${L} \\cdot ${p(b)}` },
        { t: 'Simplificamos cada término:', m: `${cx(c1)} ${op} ${cx(c2)} = ${n(L * b)}` },
        { t: 'Agrupamos y despejamos:', m: despejeLineal(k, L * b, 'x').m }
      ],
      res: `x = ${n(x)}`
    };
  }

  /* ================= 5. Segundo grado incompletas ================= */
  /* Ficha: a·x² − c = 0 con raíces ±r (r de 1 a 9, a de 1 a 4) o
     a·x² + b·x = 0 con raíces 0 y r (r de −8 a 8 sin el 0, a de 1 a 5) */
  function genIncompleta(R) {
    if (R.rand() < 0.5) {
      const r = R.int(1, 9), a = R.int(1, 4), c = a * r * r;
      const pasos = [{ t: 'No tiene término en \\(x\\): despejamos \\(x^2\\).', m: `${a === 1 ? '' : a}x^2 = ${c}${a === 1 ? '' : ` \\;\\Rightarrow\\; x^2 = \\frac{${c}}{${a}} = ${r * r}`}` }];
      pasos.push({ t: 'Hacemos la raíz cuadrada; hay dos soluciones opuestas:', m: `x = \\pm\\sqrt{${r * r}} = \\pm ${r}` });
      return { enun: `${poli([[a, 'x^2'], [-c, '']])} = 0`, pasos, res: `x_1 = ${r},\\quad x_2 = -${r}` };
    }
    const r = R.nz(-8, 8), a = R.int(1, 5), b = -a * r;
    const factor = poli([[a, 'x'], [b, '']]);
    return {
      enun: `${poli([[a, 'x^2'], [b, 'x']])} = 0`,
      pasos: [
        { t: 'No tiene término independiente: sacamos \\(x\\) factor común.', m: `x(${factor}) = 0` },
        { t: 'Un producto vale 0 si alguno de los factores es 0:', m: `x = 0 \\qquad\\text{o}\\qquad ${factor} = 0 \\;\\Rightarrow\\; ${a === 1 ? `x = ${n(r)}` : `${a}x = ${n(-b)} \\;\\Rightarrow\\; x = \\frac{${n(-b)}}{${a}} = ${n(r)}`}` }
      ],
      res: `x_1 = 0,\\quad x_2 = ${n(r)}`
    };
  }

  registrarFicha({
    id: 'pend2-ecuaciones',
    titulo: 'Ecuaciones',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/ecuaciones-2.html',
    ejercicios: [
      { id: 'sencillas', nombre: 'Ecuaciones sencillas', peso: 0.5, columnas: 3,
        enunciado: ['Resuelve la ecuación:', 'Resuelve las ecuaciones:'], generar: genSencilla },
      { id: 'parentesis', nombre: 'Ecuaciones con paréntesis', peso: 0.75, columnas: 3,
        enunciado: ['Resuelve la ecuación:', 'Resuelve las ecuaciones:'], generar: genParentesis },
      { id: 'problema', nombre: 'Problema (primer grado)', peso: 1.25, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genProblema },
      { id: 'fracciones', nombre: 'Ecuaciones con fracciones', peso: 1, columnas: 3,
        enunciado: ['Resuelve la ecuación:', 'Resuelve las ecuaciones:'], generar: genFracciones },
      { id: 'incompletas', nombre: 'Segundo grado incompletas', peso: 1, columnas: 3,
        enunciado: ['Resuelve la ecuación de segundo grado:', 'Resuelve las ecuaciones de segundo grado:'], generar: genIncompleta }
    ]
  });
})();
