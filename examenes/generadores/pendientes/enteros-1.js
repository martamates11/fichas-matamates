/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Números enteros (pendientes de 1.º ESO).
   Los números se generan con los mismos criterios que la ficha interactiva
   pendientes/primero/enteros-1.html (salvo lo indicado en cada ejercicio). */
(function () {
  'use strict';
  const { tex, registrarFicha, pend } = window.EX;
  const { n, p } = tex;
  const { Lienzo } = pend;

  const abs = Math.abs;
  const signoTxt = x => (x > 0 ? 'positivo' : 'negativo');

  /* ================= 1. Recta numérica ================= */
  const PASO = 26;                      // separación entre marcas, en px de modelo
  function recta(puntos) {
    const L = Lienzo();
    const X = v => v * PASO;
    L.linea(X(-6) - 4, 0, X(6) + 4, 0, { grosor: 1.3 });
    L.linea(X(6) + 4, 0, X(6) - 3, -4, { grosor: 1.3 }).linea(X(6) + 4, 0, X(6) - 3, 4, { grosor: 1.3 });
    for (let v = -5; v <= 5; v++) L.linea(X(v), -5, X(v), 5, { grosor: v === 0 ? 1.6 : 1 });
    L.texto(X(0), 21, '0', { tam: 13 });
    if (puntos) puntos.forEach(v => { L.punto(X(v), 0, 3.2); L.texto(X(v), -10, n(v).replace('-', '−'), { tam: 13, peso: 600 }); });
    else L.texto(X(0), -12, ' ', { tam: 13 });          // reserva el mismo alto en el examen
    return L.cerrar('pend-recta', puntos ? 'Recta numérica con los números representados' : 'Recta numérica');
  }

  function genRecta(R) {
    const candidatos = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
    const nums = R.shuffle(candidatos).slice(0, 3);
    const lista = nums.map(v => `\\(${n(v)}\\)`).join(', ').replace(/, ([^,]*)$/, ' y $1');
    const orden = nums.slice().sort((a, b) => a - b);
    return {
      html: true,
      enun: `<div class="pend-col"><span>${lista}</span>${recta(null)}</div>`,
      pasos: [
        { t: 'Los números positivos se sitúan a la derecha del 0 y los negativos a la izquierda; cada marca es una unidad:', html: recta(nums) },
        { t: 'En la recta, un número es menor cuanto más a la izquierda está:', m: orden.map(n).join(' < ') }
      ],
      res: orden.map(n).join(' < ')
    };
  }

  /* ================= 2. Suma de enteros ================= */
  function genSuma(R) {
    const tipo = R.int(0, 2);
    const a = tipo === 2 ? R.int(1, 10) : -R.int(1, 10);
    const b = tipo === 1 ? R.int(1, 10) : -R.int(1, 10);
    const r = a + b;
    const enun = `${p(a)} + ${p(b)}`;
    const pasos = [];
    if (a < 0 && b < 0) {
      pasos.push({ t: 'Los dos sumandos son negativos: sumamos sus valores absolutos y el resultado es negativo.', m: `${abs(a)} + ${abs(b)} = ${abs(r)} \\;\\Rightarrow\\; ${enun} = ${n(r)}` });
    } else if (abs(a) === abs(b)) {
      pasos.push({ t: 'Los sumandos son opuestos (mismo valor absoluto y distinto signo), así que su suma es 0.', m: `${enun} = 0` });
    } else {
      const mayor = abs(a) > abs(b) ? a : b;
      pasos.push({
        t: `Los signos son distintos: restamos los valores absolutos y ponemos el signo del de mayor valor absoluto (\\(${n(mayor)}\\), ${signoTxt(mayor)}).`,
        m: `${Math.max(abs(a), abs(b))} - ${Math.min(abs(a), abs(b))} = ${abs(r)} \\;\\Rightarrow\\; ${enun} = ${n(r)}`
      });
    }
    return { enun, pasos, res: n(r) };
  }

  /* ================= 3. Paréntesis ================= */
  /* Ficha: a, b, c entre −4 y 4. Aquí se excluye el 0, que no aporta nada en un examen. */
  function genParentesis(R) {
    const a = R.nz(-4, 4), b = R.nz(-4, 4), c = R.nz(-4, 4);
    const fuera = R.pick(['+', '-']), dentro = R.pick(['+', '-']);
    const interior = dentro === '+' ? b + c : b - c;
    const r = fuera === '+' ? a + interior : a - interior;
    const enun = `${p(a)} ${fuera} \\left(${p(b)} ${dentro} ${p(c)}\\right)`;
    const quitar = fuera === '+'
      ? (interior < 0 ? `${p(a)} + (${n(interior)}) = ${n(a)} - ${abs(interior)}` : `${p(a)} + ${n(interior)}`)
      : (interior < 0 ? `${p(a)} - (${n(interior)}) = ${n(a)} + ${abs(interior)}` : `${p(a)} - ${n(interior)}`);
    const pasos = [
      { t: 'Primero resolvemos la operación del paréntesis:', m: `${p(b)} ${dentro} ${p(c)} = ${n(interior)}` },
      {
        t: fuera === '-'
          ? 'Un signo menos delante del paréntesis cambia el signo de lo que hay dentro:'
          : 'Un signo más delante del paréntesis deja el signo de lo que hay dentro:',
        m: `${quitar} = ${n(r)}`
      }
    ];
    return { enun, pasos, res: n(r) };
  }

  /* ================= 4. Multiplicación y división ================= */
  function genMultDiv(R) {
    const op = R.pick(['·', ':']);
    const tipo = R.int(0, 2);
    const s1 = tipo === 0 ? 1 : -1, s2 = tipo === 1 ? 1 : -1;
    let aP = R.int(2, 9), bP = R.int(1, 4);
    if (op === ':') { while (aP % bP !== 0) { aP = R.int(1, 12); bP = R.int(1, 4); } }
    const a = aP * s1, b = bP * s2;
    const r = op === '·' ? a * b : a / b;
    const opTeX = op === '·' ? '\\cdot' : ':';
    const iguales = s1 === s2;
    return {
      enun: `${p(a)} ${opTeX} ${p(b)}`,
      pasos: [
        { t: `Regla de los signos: ${iguales ? 'signos iguales, resultado positivo' : 'signos distintos, resultado negativo'}.` },
        { t: `${op === '·' ? 'Multiplicamos' : 'Dividimos'} los valores absolutos y ponemos el signo:`, m: `${aP} ${opTeX} ${bP} = ${abs(r)} \\;\\Rightarrow\\; ${p(a)} ${opTeX} ${p(b)} = ${n(r)}` }
      ],
      res: n(r)
    };
  }

  /* ================= 5. Operaciones combinadas ================= */
  /* Misma estructura que la ficha: m·[s + D : (d)] − (f)·(g).
     En la ficha d, f y g son siempre positivos; aquí pueden ser negativos para que
     el ejercicio practique de verdad la regla de los signos. */
  function genCombinadas(R) {
    const m = R.int(2, 4), s = R.int(5, 12);
    const dv = R.int(2, 4) * R.signo(), q = R.int(2, 6);
    const D = abs(dv) * q;                 // dividendo positivo, división exacta
    const cociente = D / dv;
    const f = R.int(2, 9) * R.signo(), g = R.int(2, 9) * R.signo();
    const corchete = s + cociente, izq = m * corchete, der = f * g, r = izq - der;
    const enun = `${m} \\cdot \\left[${s} + ${D} : ${p(dv)}\\right] - ${p(f)} \\cdot ${p(g)}`;
    const resta = der < 0 ? `${n(izq)} - (${n(der)}) = ${n(izq)} + ${abs(der)} = ${n(r)}` : `${n(izq)} - ${n(der)} = ${n(r)}`;
    return {
      enun,
      pasos: [
        { t: 'Dentro del corchete, primero la división:', m: `${D} : ${p(dv)} = ${n(cociente)}` },
        { t: 'Resolvemos el corchete:', m: cociente < 0 ? `${s} + (${n(cociente)}) = ${s} - ${abs(cociente)} = ${n(corchete)}` : `${s} + ${cociente} = ${n(corchete)}` },
        { t: 'Hacemos las multiplicaciones (regla de los signos):', m: `${m} \\cdot ${p(corchete)} = ${n(izq)} \\qquad ${p(f)} \\cdot ${p(g)} = ${n(der)}` },
        { t: 'Por último, la resta:', m: resta }
      ],
      res: n(r)
    };
  }

  /* ================= 6. Problema de deudas ================= */
  const NOMBRES = ['Lucía', 'Hugo', 'Martina', 'Daniel', 'Sara', 'Pablo', 'Carmen', 'Álvaro', 'Noa', 'Mario'];
  const PLANES = [['a merendar', 'la merienda'], ['al cine', 'el cine'], ['a comer', 'la comida'], ['a un helado', 'el helado'], ['a una pizza', 'la pizza']];
  function genDeuda(R) {
    const deuda = R.int(5, 20);
    let gasto; do { gasto = R.int(1, 22); } while (gasto === deuda && R.rand() < 0.7);
    const quien = R.pick(NOMBRES), [plan, cosa] = R.pick(PLANES);
    const r = -deuda + gasto;
    const enun = `${quien} debe ${deuda} € a un amigo. Para saldar la deuda, lo invita ${plan} y ${cosa} cuesta ${gasto} €. ¿Ha saldado su deuda? ¿Le sobra o le falta dinero? Justifícalo con una operación con números enteros.`;
    const conclusion = r > 0
      ? `Sí: ha saldado la deuda y además ha pagado ${r} € de más.`
      : r === 0 ? 'Sí: ha saldado la deuda justa, sin que sobre ni falte nada.'
        : `No: todavía debe ${abs(r)} €.`;
    return {
      html: true,
      enun: `<span class="pend-texto">${enun}</span>`,
      pasos: [
        { t: `Una deuda de ${deuda} € se representa con un número negativo, \\(-${deuda}\\); lo que paga, con un número positivo, \\(+${gasto}\\).` },
        { t: 'Sumamos:', m: `-${deuda} + ${gasto} = ${n(r)}` },
        { t: conclusion }
      ],
      res: `-${deuda} + ${gasto} = ${n(r)}`,
      resHtml: `\\(-${deuda} + ${gasto} = ${n(r)}\\). ${conclusion}`
    };
  }

  registrarFicha({
    id: 'pend1-enteros',
    titulo: 'Números enteros',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/enteros-1.html',
    ejercicios: [
      { id: 'recta', nombre: 'Representar en la recta y ordenar', peso: 1, columnas: 1,
        enunciado: ['Representa en la recta numérica los siguientes números y ordénalos de menor a mayor:', 'Representa en la recta numérica los siguientes números y ordénalos de menor a mayor:'],
        generar: genRecta },
      { id: 'suma', nombre: 'Suma de enteros', peso: 0.5, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genSuma },
      { id: 'parentesis', nombre: 'Sumas y restas con paréntesis', peso: 0.75, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genParentesis },
      { id: 'multdiv', nombre: 'Multiplicación y división', peso: 0.5, columnas: 3,
        enunciado: ['Calcula aplicando la regla de los signos:', 'Calcula aplicando la regla de los signos:'], generar: genMultDiv },
      { id: 'combinadas', nombre: 'Operaciones combinadas', peso: 1.25, columnas: 2,
        enunciado: ['Calcula respetando la jerarquía de las operaciones:', 'Calcula respetando la jerarquía de las operaciones:'], generar: genCombinadas },
      { id: 'deuda', nombre: 'Problema: deudas', peso: 1, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genDeuda }
    ]
  });
})();
