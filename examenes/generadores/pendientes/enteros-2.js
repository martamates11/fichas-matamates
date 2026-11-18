/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Números enteros (pendientes de 2.º ESO).
   Los números se generan con los mismos criterios que la ficha interactiva
   pendientes/segundo/enteros-2.html (salvo lo indicado en cada ejercicio). */
(function () {
  'use strict';
  const { tex, registrarFicha } = window.EX;
  const { n, p } = tex;

  const abs = Math.abs;
  /* «a − b» o «a − (−b) = a + b», «a + b» o «a + (−b) = a − b»: quitar el paréntesis de un número */
  const sumarTxt = (a, b) => (b < 0 ? `${n(a)} + (${n(b)}) = ${n(a)} - ${abs(b)}` : `${n(a)} + ${n(b)}`);
  const restarTxt = (a, b) => (b < 0 ? `${n(a)} - (${n(b)}) = ${n(a)} + ${abs(b)}` : `${n(a)} - ${n(b)}`);
  const operarTxt = (a, op, b) => (op === '+' ? sumarTxt(a, b) : restarTxt(a, b));

  /* ================= 1. Suma de cuatro sumandos ================= */
  /* Ficha: cuatro sumandos entre −9 y 9 sin el 0, con al menos uno negativo */
  function genSuma4(R) {
    const nums = [R.nz(-9, 9), R.nz(-9, 9), R.nz(-9, 9), R.nz(-9, 9)];
    if (nums.every(v => v > 0)) nums[R.int(0, 3)] *= -1;
    const r = nums.reduce((a, b) => a + b, 0);
    const pos = nums.filter(v => v > 0), neg = nums.filter(v => v < 0);
    const P = pos.reduce((a, b) => a + b, 0), N = neg.reduce((a, b) => a + b, 0);
    const pasos = [];
    if (!pos.length) {
      pasos.push({ t: 'Todos los sumandos son negativos: sumamos sus valores absolutos y el resultado es negativo.', m: `${neg.map(v => abs(v)).join(' + ')} = ${abs(N)} \\;\\Rightarrow\\; ${n(N)}` });
    } else {
      pasos.push({
        t: 'Agrupamos por un lado los positivos y por otro los negativos:',
        m: `${pos.length > 1 ? pos.join(' + ') + ' = ' : ''}${P} \\qquad ${neg.map(p).join(' + ')}${neg.length > 1 ? ' = ' + n(N) : ''}`
      });
      pasos.push({
        t: r === 0 ? 'Son opuestos, así que la suma es 0:'
          : `Signos distintos: restamos los valores absolutos y ponemos el signo del de mayor valor absoluto:`,
        m: `${P} + (${n(N)}) = ${P} - ${abs(N)} = ${n(r)}`
      });
    }
    return { enun: nums.map(p).join(' + '), pasos, res: n(r) };
  }

  /* ================= 2. Paréntesis con cinco números ================= */
  /* Ficha: a, b, c, d, e entre −4 y 4 sin el 0; cuatro estructuras de signos */
  const ESTRUCTURAS = [['-', '-', '+', '-'], ['+', '-', '-', '+'], ['-', '+', '+', '-'], ['+', '+', '-', '-']];
  function genParentesis(R) {
    const [a, b, c, d, e] = [R.nz(-4, 4), R.nz(-4, 4), R.nz(-4, 4), R.nz(-4, 4), R.nz(-4, 4)];
    const [f1, d1, f2, d2] = R.pick(ESTRUCTURAS);           // signo fuera / dentro de cada paréntesis
    const p1 = d1 === '+' ? b + c : b - c, p2 = d2 === '+' ? d + e : d - e;
    const t1 = f1 === '+' ? a + p1 : a - p1, r = f2 === '+' ? t1 + p2 : t1 - p2;
    const enun = `${p(a)} ${f1} \\left(${p(b)} ${d1} ${p(c)}\\right) ${f2} \\left(${p(d)} ${d2} ${p(e)}\\right)`;
    return {
      enun,
      pasos: [
        { t: 'Primero resolvemos cada paréntesis:', m: `${p(b)} ${d1} ${p(c)} = ${n(p1)} \\qquad ${p(d)} ${d2} ${p(e)} = ${n(p2)}` },
        { t: 'Sustituimos y operamos de izquierda a derecha (un signo menos delante cambia el signo del número):', m: `${p(a)} ${f1} ${p(p1)} ${f2} ${p(p2)}` },
        { t: 'Primera operación:', m: `${operarTxt(a, f1, p1)} = ${n(t1)}` },
        { t: 'Segunda operación:', m: `${operarTxt(t1, f2, p2)} = ${n(r)}` }
      ],
      res: n(r)
    };
  }

  /* ================= 3. Multiplicación y división con tres números ================= */
  /* Ficha: siempre una multiplicación y una división (en cualquier orden), divisiones
     exactas, al menos un factor negativo. */
  function genMultDiv3(R) {
    const divPrimero = R.rand() < 0.5;
    const op1 = divPrimero ? ':' : '·', op2 = divPrimero ? '·' : ':';
    const b = R.int(2, 5);
    const a = op1 === ':' ? b * R.int(2, 7) : R.int(2, 9);
    const i1 = op1 === '·' ? a * b : a / b;
    let c;
    if (op2 === ':') { const divs = []; for (let k = 2; k <= 9; k++) if (i1 % k === 0) divs.push(k); c = R.pick(divs); }
    else c = R.int(2, 5);
    const sg = [R.signo(), R.signo(), R.signo()];
    if (sg.every(s => s === 1)) sg[R.int(0, 2)] = -1;
    const A = a * sg[0], B = b * sg[1], C = c * sg[2];
    const T = o => (o === '·' ? '\\cdot' : ':');
    const paso1 = op1 === '·' ? A * B : A / B, r = op2 === '·' ? paso1 * C : paso1 / C;
    const regla = (x, y) => ((x > 0) === (y > 0) ? 'signos iguales, positivo' : 'signos distintos, negativo');
    return {
      enun: `${p(A)} ${T(op1)} ${p(B)} ${T(op2)} ${p(C)}`,
      pasos: [
        { t: `Multiplicaciones y divisiones tienen la misma prioridad: se hacen de izquierda a derecha. Primero (${regla(A, B)}):`, m: `${p(A)} ${T(op1)} ${p(B)} = ${n(paso1)}` },
        { t: `Después (${regla(paso1, C)}):`, m: `${p(paso1)} ${T(op2)} ${p(C)} = ${n(r)}` }
      ],
      res: n(r)
    };
  }

  /* ================= 4. Operaciones combinadas ================= */
  /* Estructura de la ficha: m·[s + D : (d)] − (f)·(g). La ficha de 2.º usa d (1–4), f y g
     siempre positivos; aquí, como en la ficha de 1.º ESO, d (±2 a ±4), f y g (±2 a ±9) pueden
     ser negativos para que se practique la regla de los signos (cambio solo del examen). */
  function genCombinadas(R) {
    const m = R.int(2, 4), s = R.int(5, 12);
    const dv = R.int(2, 4) * R.signo(), q = R.int(2, 6);
    const D = abs(dv) * q, cociente = D / dv;
    const f = R.int(2, 9) * R.signo(), g = R.int(2, 9) * R.signo();
    const corchete = s + cociente, izq = m * corchete, der = f * g, r = izq - der;
    return {
      enun: `${m} \\cdot \\left[${s} + ${D} : ${p(dv)}\\right] - ${p(f)} \\cdot ${p(g)}`,
      pasos: [
        { t: 'Dentro del corchete, primero la división:', m: `${D} : ${p(dv)} = ${n(cociente)}` },
        { t: 'Resolvemos el corchete:', m: `${sumarTxt(s, cociente)} = ${n(corchete)}` },
        { t: 'Hacemos las multiplicaciones (regla de los signos):', m: `${m} \\cdot ${p(corchete)} = ${n(izq)} \\qquad ${p(f)} \\cdot ${p(g)} = ${n(der)}` },
        { t: 'Por último, la resta:', m: `${restarTxt(izq, der)} = ${n(r)}` }
      ],
      res: n(r)
    };
  }

  /* ================= 5. Problemas ================= */
  /* Tipo saldo (deuda 8–25, pagos 1–15) y tipo préstamo (2–9 € a cada persona), como en la ficha */
  const NOMBRES = ['Daniel', 'Marta', 'Laura', 'Pablo', 'Sara', 'Iván', 'Elena', 'Carlos', 'Noa', 'Hugo'];
  const GRUPO1 = [['padres', 2, 2], ['tíos', 2, 4], ['hermanos', 1, 3]];
  const GRUPO2 = [['abuelos', 2, 4], ['primos', 3, 6], ['vecinos', 2, 5]];
  const MOTIVOS = ['irse de excursión', 'comprar material para el instituto', 'organizar una fiesta de cumpleaños', 'apuntarse a un campamento de verano', 'comprarse unas zapatillas nuevas'];

  function genProblema(R) {
    const quien = R.pick(NOMBRES);
    if (R.rand() < 0.5) {
      const deuda = R.int(8, 25), p1 = R.int(1, 15), p2 = R.int(1, 15), r = p1 + p2 - deuda;
      const conclusion = r > 0 ? `Ha saldado la deuda y le sobran ${r} €.` : r < 0 ? `Todavía debe ${abs(r)} €.` : 'La deuda queda saldada exactamente.';
      const op = `-${deuda} + ${p1} + ${p2} = ${n(r)}`;
      return {
        html: true,
        enun: `<span class="pend-texto">${quien} debe ${deuda} € y, para saldar su deuda, paga primero ${p1} € y más tarde otros ${p2} €. Calcula su saldo final con una operación con números enteros (negativo si todavía debe, positivo si le sobra dinero) e interpreta el resultado.</span>`,
        pasos: [
          { t: `La deuda es un número negativo, \\(-${deuda}\\); cada pago es positivo.` },
          { t: 'Sumamos:', m: op },
          { t: conclusion }
        ],
        res: op,
        resHtml: `\\(${op}\\). ${conclusion}`
      };
    }
    const [g1, a1, b1] = R.pick(GRUPO1), [g2, a2, b2] = R.pick(GRUPO2);
    const k = R.int(2, 9), c1 = R.int(a1, b1), c2 = R.int(a2, b2), personas = c1 + c2, r = -k * personas;
    const t1 = g1 === 'padres' ? 'sus padres' : (c1 === 1 ? `su ${g1 === 'hermanos' ? 'hermano' : g1}` : `sus ${c1} ${g1}`);
    const op = `-${k} \\cdot (${c1} + ${c2}) = -${k} \\cdot ${personas} = ${n(r)}`;
    const cada = c1 === 1 ? `a ${t1}` : `a cada uno de ${t1}`;
    return {
      html: true,
      enun: `<span class="pend-texto">${quien} pide prestados ${k} € ${cada} y a cada uno de sus ${c2} ${g2} para ${R.pick(MOTIVOS)}. Expresa su deuda total con un número entero y escribe la operación.</span>`,
      pasos: [
        { t: `Pide dinero a \\(${c1} + ${c2} = ${personas}\\) personas, y a cada una le debe \\(${k}\\) €, que se representa como \\(-${k}\\).` },
        { t: 'Multiplicamos:', m: op },
        { t: `Debe ${abs(r)} €; su deuda se representa con \\(${n(r)}\\).` }
      ],
      res: op,
      resHtml: `\\(${op}\\). Debe ${abs(r)} €.`
    };
  }

  registrarFicha({
    id: 'pend2-enteros',
    titulo: 'Números enteros',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/enteros-2.html',
    ejercicios: [
      { id: 'suma4', nombre: 'Suma de cuatro sumandos', peso: 0.5, columnas: 2,
        enunciado: ['Calcula:', 'Calcula:'], generar: genSuma4 },
      { id: 'parentesis', nombre: 'Sumas y restas con paréntesis (cinco números)', peso: 0.75, columnas: 2,
        enunciado: ['Calcula:', 'Calcula:'], generar: genParentesis },
      { id: 'multdiv', nombre: 'Multiplicación y división con tres números', peso: 0.5, columnas: 3,
        enunciado: ['Calcula aplicando la regla de los signos:', 'Calcula aplicando la regla de los signos:'], generar: genMultDiv3 },
      { id: 'combinadas', nombre: 'Operaciones combinadas', peso: 1.25, columnas: 2,
        enunciado: ['Calcula respetando la jerarquía de las operaciones:', 'Calcula respetando la jerarquía de las operaciones:'], generar: genCombinadas },
      { id: 'problema', nombre: 'Problema: deudas y saldos', peso: 1, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genProblema }
    ]
  });
})();
