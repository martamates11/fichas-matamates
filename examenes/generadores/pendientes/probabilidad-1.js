/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Probabilidad (pendientes de 1.º ESO).
   Mismos tipos y criterios que la ficha interactiva pendientes/primero/probabilidad-1.html:
   conceptos, verdadero o falso, tabla de casos (regla de Laplace) y urna de tres colores.
   Diferencias respecto a la ficha: los bancos de «conceptos» (6 → 10) y «verdadero o falso»
   (6 → 13 afirmaciones) están ampliados para que haya variedad; las probabilidades se piden
   como fracción irreducible (la ficha acepta decimales con ≈ 0,01 de margen), pensando en un
   examen sin calculadora; y la tabla de la ficha (5 filas) se reparte aquí en un suceso por
   apartado. */
(function () {
  'use strict';
  const { tex, registrarFicha, fr, pend } = window.EX;
  const { frac } = tex;
  const { Lienzo } = pend;

  const MAYUS = 'ABCDEFGH';
  /* P = a/b, simplificada si se puede */
  const laplace = (a, b) => {
    const f = fr(a, b);
    return `\\frac{${a}}{${b}}` + (f.n !== a || f.d !== b ? ` = ${frac(f)}` : '');
  };
  const lista = arr => arr.length > 1 ? arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1] : arr[0];

  /* ================= 1. Conceptos ================= */
  /* Banco de 10. La ficha usa 6: espacio muestral, suceso, suceso elemental, suceso contrario,
     suceso seguro y suceso imposible; los otros cuatro se añaden aquí. En cada apartado salen 4. */
  const CONCEPTOS = [
    ['Experimento aleatorio', 'Experimento cuyo resultado no se puede predecir, aunque se repita en las mismas condiciones.'],
    ['Espacio muestral', 'Conjunto de todos los resultados posibles de un experimento aleatorio.'],
    ['Suceso', 'Subconjunto del espacio muestral.'],
    ['Suceso elemental', 'Suceso que consta de un único resultado.'],
    ['Suceso compuesto', 'Suceso formado por dos o más resultados.'],
    ['Suceso contrario', 'Suceso que ocurre cuando NO ocurre el suceso A.'],
    ['Suceso seguro', 'Suceso que ocurre siempre, con probabilidad 1.'],
    ['Suceso imposible', 'Suceso que nunca ocurre, con probabilidad 0.'],
    ['Sucesos equiprobables', 'Sucesos que tienen la misma probabilidad.'],
    ['Experimento determinista', 'Experimento cuyo resultado se conoce de antemano.']
  ];
  function genConceptos(R) {
    const elegidos = R.shuffle(CONCEPTOS.map((_, i) => i)).slice(0, 4);
    const defs = R.shuffle(elegidos);
    const col1 = elegidos.map((c, i) => `${i + 1}. ${CONCEPTOS[c][0]}`).join('<br>');
    const col2 = defs.map((c, j) => `${MAYUS[j]}. ${CONCEPTOS[c][1]}`).join('<br>');
    const pares = elegidos.map((c, i) => `${i + 1}–${MAYUS[defs.indexOf(c)]}`);
    return {
      html: true,
      enun: `<div class="pend-texto" style="display:grid;grid-template-columns:auto 1fr;gap:1mm 8mm;align-items:start"><span>${col1}</span><span>${col2}</span></div>`,
      pasos: [
        { t: 'Cada concepto con su definición:', html: `<span class="pend-texto">${elegidos.map((c, i) => `${i + 1}. <i>${CONCEPTOS[c][0]}</i> → ${MAYUS[defs.indexOf(c)]}. ${CONCEPTOS[c][1]}`).join('<br>')}</span>` }
      ],
      res: `\\text{${pares.join(',\\quad ')}}`,
      resHtml: pares.join(' · ')
    };
  }

  /* ================= 2. Verdadero o falso ================= */
  /* Las 6 primeras de la ficha (reformuladas) más 7 añadidas aquí; tres afirmaciones por apartado */
  const FRASES = [
    ['La probabilidad de un suceso siempre es menor o igual que 1.', true, 'La probabilidad siempre está entre 0 y 1, ambos incluidos.'],
    ['Si P(A) > P(B), entonces es más fácil que ocurra B.', false, 'Si P(A) > P(B), es A el que tiene más probabilidad: es más fácil que ocurra A.'],
    ['Cuanto más difícil es que ocurra un suceso, más se acerca su probabilidad a 1.', false, 'Cuanto más difícil es un suceso, más se acerca su probabilidad a 0.'],
    ['Una probabilidad cercana a 0 significa que es casi seguro que el suceso ocurra.', false, 'Una probabilidad cercana a 0 indica que es muy poco probable que ocurra.'],
    ['Dos sucesos equiprobables tienen la misma probabilidad.', true, 'Equiprobable significa precisamente eso: igual de probable.'],
    ['Según la regla de Laplace, la probabilidad de un suceso es el número de casos favorables entre el número de casos posibles.', true, 'Es la regla de Laplace, válida cuando todos los resultados son igual de probables.'],
    ['Al tirar un dado de 6 caras, sacar un 7 es un suceso imposible.', true, 'Ninguna cara tiene el 7: el suceso nunca ocurre y su probabilidad es 0.'],
    ['La probabilidad de un suceso puede ser 1,5.', false, 'Una probabilidad nunca es mayor que 1.'],
    ['La probabilidad de un suceso más la de su suceso contrario siempre suma 1.', true, 'Uno de los dos ocurre siempre: P(A) + P(no A) = 1.'],
    ['Al tirar una moneda, salir cara y salir cruz son sucesos equiprobables.', true, 'Los dos tienen probabilidad 1/2.'],
    ['Si P(A) = 0,3, la probabilidad del suceso contrario de A también es 0,3.', false, 'P(no A) = 1 − 0,3 = 0,7.'],
    ['Un suceso seguro tiene probabilidad 0.', false, 'El suceso seguro ocurre siempre: su probabilidad es 1. La probabilidad 0 es la del suceso imposible.'],
    ['Al sacar una carta de la baraja española, sacar oros y sacar un as son sucesos equiprobables.', false, 'Hay 10 oros y solo 4 ases: P(oros) = 10/40 y P(as) = 4/40.']
  ];
  /* Fracciones y números con formato de examen dentro del texto */
  const TEX = [
    ['P(no A) = 1 − 0,3 = 0,7', '\\(P(\\text{no } A) = 1 - 0{,}3 = 0{,}7\\)'],
    ['P(A) + P(no A) = 1', '\\(P(A) + P(\\text{no } A) = 1\\)'],
    ['P(A) > P(B)', '\\(P(A) > P(B)\\)'],
    ['P(A) = 0,3', '\\(P(A) = 0{,}3\\)'],
    ['P(oros) = 10/40 y P(as) = 4/40', '\\(P(\\text{oros}) = \\frac{10}{40}\\) y \\(P(\\text{as}) = \\frac{4}{40}\\)'],
    ['probabilidad 1/2', 'probabilidad \\(\\frac{1}{2}\\)']
  ];
  const texto = s => TEX.reduce((a, [de, a2]) => a.split(de).join(a2), s);
  /* Apartados pares e impares toman las frases de mitades distintas del banco: no se repiten */
  function genVF(R, i) {
    const mitad = FRASES.map((_, k) => k).filter(k => (k < 7) === (i % 2 === 0));
    let idx;
    do { idx = R.shuffle(mitad).slice(0, 3); } while (idx.every(i => FRASES[i][1]) || idx.every(i => !FRASES[i][1]));
    const vf = idx.map(i => (FRASES[i][1] ? 'V' : 'F'));
    return {
      html: true,
      enun: `<span class="pend-texto">${idx.map((i, k) => `${k + 1}. ${texto(FRASES[i][0])}`).join('<br>')}</span>`,
      pasos: idx.map((i, k) => ({ t: `${k + 1}. <b>${FRASES[i][1] ? 'Verdadera' : 'Falsa'}</b>. ${texto(FRASES[i][2])}` })),
      res: `\\text{${vf.map((v, k) => `${k + 1}. ${v}`).join(',\\quad ')}}`,
      resHtml: vf.map((v, k) => `${k + 1}. ${v}`).join(' · ')
    };
  }

  /* ================= 3. Casos posibles, favorables y probabilidad ================= */
  /* Repertorio de sucesos de la ficha (dado, moneda, bombo, baraja y bolsa) */
  const PALOS = ['oros', 'copas', 'espadas', 'bastos'];
  function sucesos(R) {
    const k = R.int(1, 6), m = R.int(2, 5), nn = R.int(2, 5);
    const dado = [
      { s: `Sacar un ${k} al tirar un dado de 6 caras.`, pos: 6, fav: 1, e: `Un dado tiene 6 caras, del 1 al 6, y solo una tiene el ${k}.` },
      { s: `Sacar un número ${R.pick(['par', 'impar'])} al tirar un dado de 6 caras.`, pos: 6, fav: 3, e: 'Los pares son 2, 4 y 6; los impares, 1, 3 y 5: tres de cada.' },
      { s: `Sacar un número menor que ${m} al tirar un dado de 6 caras.`, pos: 6, fav: m - 1, e: `Los números menores que ${m} son ${lista(Array.from({ length: m - 1 }, (_, i) => String(i + 1)))}.` },
      { s: `Sacar un número mayor que ${nn} al tirar un dado de 6 caras.`, pos: 6, fav: 6 - nn, e: `Los números mayores que ${nn} son ${lista(Array.from({ length: 6 - nn }, (_, i) => String(nn + 1 + i)))}.` },
      { s: 'Sacar un múltiplo de 3 al tirar un dado de 6 caras.', pos: 6, fav: 2, e: 'Los múltiplos de 3 del dado son el 3 y el 6.' },
      { s: 'Sacar un número primo al tirar un dado de 6 caras.', pos: 6, fav: 3, e: 'Los primos del dado son 2, 3 y 5 (el 1 no es primo).' },
      { s: 'Sacar un divisor de 6 al tirar un dado de 6 caras.', pos: 6, fav: 4, e: 'Los divisores de 6 son 1, 2, 3 y 6.' }
    ];
    const palo = R.pick(PALOS);
    const carta = R.pick(['el rey', 'el caballo', 'el as', 'el siete']);
    const baraja = [
      { s: `Sacar una carta de ${palo} de una baraja española de 40 cartas.`, pos: 40, fav: 10, e: 'La baraja tiene 4 palos de 10 cartas cada uno.' },
      { s: 'Sacar un as de una baraja española de 40 cartas.', pos: 40, fav: 4, e: 'Hay un as en cada uno de los 4 palos.' },
      { s: 'Sacar una figura (sota, caballo o rey) de una baraja española de 40 cartas.', pos: 40, fav: 12, e: 'Cada palo tiene 3 figuras y hay 4 palos: \\(3 \\cdot 4 = 12\\).' },
      { s: `Sacar ${carta} de ${R.pick(PALOS)} de una baraja española de 40 cartas.`, pos: 40, fav: 1, e: 'Esa carta concreta solo está una vez en la baraja.' }
    ];
    const COL = [['roja', 'rojas'], ['azul', 'azules'], ['verde', 'verdes'], ['amarilla', 'amarillas']];
    const ci = R.int(0, 3); let cj = R.int(0, 2); if (cj >= ci) cj++;
    const x = R.int(2, 9), y = R.int(2, 9);
    const bolsa = { s: `Sacar una bola ${COL[ci][0]} de una bolsa con ${x} bolas ${COL[ci][1]} y ${y} bolas ${COL[cj][1]}.`, pos: x + y, fav: x, e: `Hay \\(${x} + ${y} = ${x + y}\\) bolas y ${x} son ${COL[ci][1]}.` };
    const total = R.pick([10, 12, 20, 30]);
    const bombo = [
      { s: `Sacar un número par de un bombo con bolas numeradas del 1 al ${total}.`, pos: total, fav: total / 2, e: `Del 1 al ${total}, la mitad son pares: ${total / 2}.` },
      { s: `Sacar un múltiplo de 5 de un bombo con bolas numeradas del 1 al ${total}.`, pos: total, fav: Math.floor(total / 5), e: `Los múltiplos de 5 son ${lista(Array.from({ length: Math.floor(total / 5) }, (_, i) => String(5 * (i + 1))))}.` },
      { s: `Sacar un número de una cifra de un bombo con bolas numeradas del 1 al ${total}.`, pos: total, fav: 9, e: 'Los números de una cifra son del 1 al 9: son 9.' }
    ];
    const moneda = { s: `Salir ${R.pick(['cara', 'cruz'])} al tirar una moneda.`, pos: 2, fav: 1, e: 'La moneda tiene dos resultados posibles, cara y cruz, y solo uno es el que buscamos.' };
    return [R.rand() < 0.3 ? moneda : R.pick(bombo), R.pick(dado), R.pick(baraja), bolsa];
  }
  function genTabla(R, i) {
    const grupos = sucesos(R);
    const su = grupos[(i + R.int(0, 3)) % 4];
    return {
      html: true,
      enun: `<span class="pend-texto">${su.s}</span>`,
      pasos: [
        { t: su.e },
        { t: `Casos posibles: ${su.pos}. Casos favorables: ${su.fav}. Aplicamos la regla de Laplace:`, m: `P = \\frac{\\text{casos favorables}}{\\text{casos posibles}} = ${laplace(su.fav, su.pos)}` }
      ],
      res: `\\text{posibles: } ${su.pos},\\quad \\text{favorables: } ${su.fav},\\quad P = ${frac(fr(su.fav, su.pos))}`
    };
  }

  /* ================= 4. Urna con bolas de tres colores ================= */
  /* Ficha: total entre 12 y 24, repartido al azar en tres grupos de al menos una bola */
  function urna(grupos) {
    const L = Lienzo(), porFila = 6, paso = 21, r = 8.5;
    const bolas = []; grupos.forEach(([k, letra]) => { for (let j = 0; j < k; j++) bolas.push(letra); });
    const filas = Math.ceil(bolas.length / porFila), W = porFila * paso + 10, H = filas * paso + 12;
    L.poligono([[0, 0], [0, H], [W, H], [W, 0]], { relleno: '#fff', grosor: 1.4 });
    bolas.forEach((letra, j) => {
      const x = 5 + paso / 2 + (j % porFila) * paso, y = 6 + paso / 2 + Math.floor(j / porFila) * paso;
      L.circulo(x, y, r, { relleno: '#fff', grosor: 1 }).texto(x, y + 3.8, letra, { tam: 10.5, peso: 600 });
    });
    return L.cerrar('pend-fig', 'Urna con bolas rojas (R), verdes (V) y azules (A)');
  }
  const bolasTxt = (k, s, p) => `${k} ${k === 1 ? 'bola ' + s : 'bolas ' + p}`;
  function genUrna(R) {
    const total = R.int(12, 24);
    const c1 = R.int(1, total - 1); let c2; do { c2 = R.int(1, total - 1); } while (c2 === c1);
    const [rojas, verdes, azules] = R.shuffle([Math.min(c1, c2), Math.abs(c2 - c1), total - Math.max(c1, c2)]);
    const preguntas = [['sea roja', rojas, 'roja'], ['sea verde', verdes, 'verde'], ['sea azul', azules, 'azul'], ['no sea roja', verdes + azules, 'no roja']];
    const fig = urna([[rojas, 'R'], [verdes, 'V'], [azules, 'A']]);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">En una urna hay ${bolasTxt(rojas, 'roja', 'rojas')}, ${bolasTxt(verdes, 'verde', 'verdes')} y ${bolasTxt(azules, 'azul', 'azules')}. Se saca una bola al azar. Calcula la probabilidad de que la bola sea roja, de que sea verde, de que sea azul y de que no sea roja.</span>${fig}</div>`,
      pasos: [
        { t: `Casos posibles: todas las bolas, \\(${rojas} + ${verdes} + ${azules} = ${total}\\).` },
        { t: 'Casos favorables: las bolas de cada color. Regla de Laplace:', m: preguntas.slice(0, 3).map(q => `P(\\text{${q[2]}}) = ${laplace(q[1], total)}`).join(' \\qquad ') },
        { t: `Las bolas que no son rojas son las verdes y las azules: \\(${verdes} + ${azules} = ${verdes + azules}\\).`, m: `P(\\text{no roja}) = ${laplace(verdes + azules, total)}` },
        { t: 'Otra forma: la probabilidad de «no roja» es lo que le falta a la de «roja» para llegar a 1:', m: `P(\\text{no roja}) = 1 - ${frac(fr(rojas, total))} = ${frac(fr(verdes + azules, total))}` }
      ],
      res: preguntas.map(q => `P(\\text{${q[2]}}) = ${frac(fr(q[1], total))}`).join(',\\quad ')
    };
  }

  registrarFicha({
    id: 'pend1-probabilidad',
    titulo: 'Probabilidad',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/probabilidad-1.html',
    ejercicios: [
      { id: 'conceptos', nombre: 'Relacionar conceptos y definiciones', peso: 1, columnas: 1,
        enunciado: ['Relaciona cada concepto con su definición:', 'Relaciona cada concepto con su definición:'], generar: genConceptos },
      { id: 'vf', nombre: 'Verdadero o falso', peso: 1, columnas: 1,
        enunciado: ['Indica si cada afirmación es verdadera (V) o falsa (F) y justifica tu respuesta:', 'Indica si cada afirmación es verdadera (V) o falsa (F) y justifica tu respuesta:'], generar: genVF },
      { id: 'laplace', nombre: 'Casos posibles, favorables y probabilidad', peso: 0.75, columnas: 2,
        enunciado: ['Indica el número de casos posibles y de casos favorables, y calcula la probabilidad del suceso:', 'Indica el número de casos posibles y de casos favorables, y calcula la probabilidad de cada suceso:'], generar: genTabla },
      { id: 'urna', nombre: 'Problema: urna con bolas', peso: 1.25, columnas: 2,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genUrna }
    ]
  });
})();
