/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Probabilidad (pendientes de 3.º ESO).
   Mismos tipos y rangos que la ficha pendientes/tercero/probabilidad-3.html: extracción
   simple de una bolsa, dos extracciones con y sin reemplazamiento (diagrama de árbol)
   y baraja española de 40 cartas. Las probabilidades se dan como fracción irreducible. */
(function () {
  'use strict';
  const { tex, registrarFicha, fr, pend } = window.EX;
  const { frac } = tex;
  const { Lienzo } = pend;

  /* a/b y, si se puede, su simplificación */
  const fs = (a, b) => {
    const f = fr(a, b);
    return `\\frac{${a}}{${b}}` + (f.n !== a || f.d !== b ? ` = ${frac(f)}` : '');
  };
  const F = (a, b) => frac(fr(a, b));
  const preguntas = arr => `<span class="pend-texto">${arr.map((q, k) => `${k + 1}. ${q}`).join('<br>')}</span>`;
  const resLista = arr => arr.map((v, k) => `${k + 1})\\ ${v}`).join(',\\quad ');

  /* ================= 1. Extracción simple de una bolsa ================= */
  /* Ficha: rojas 3–8, verdes 2–7, amarillas 2–6, las tres cantidades distintas */
  function genBolsa(R) {
    let r, v, a;
    do { r = R.int(3, 8); v = R.int(2, 7); a = R.int(2, 6); } while (new Set([r, v, a]).size < 3);
    const t = r + v + a;
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">Una bolsa contiene ${r} bolas rojas, ${v} verdes y ${a} amarillas. Se extrae una bola al azar. Calcula la probabilidad de que la bola:</span>${preguntas(['sea roja.', 'no sea roja.', 'sea roja o verde.', 'no sea ni roja ni verde.'])}</div>`,
      pasos: [
        { t: `Casos posibles: todas las bolas, \\(${r} + ${v} + ${a} = ${t}\\). La regla de Laplace cuenta bolas, no colores.` },
        { t: `1. Hay ${r} rojas:`, m: `P(\\text{roja}) = ${fs(r, t)}` },
        { t: '2. Es el suceso contrario de «roja»:', m: `P(\\text{no roja}) = 1 - \\frac{${r}}{${t}} = ${fs(v + a, t)}` },
        { t: `3. Una bola no puede ser roja y verde a la vez, así que se suman los casos favorables: \\(${r} + ${v} = ${r + v}\\).`, m: `P(\\text{roja o verde}) = ${fs(r + v, t)}` },
        { t: `4. «Ni roja ni verde» significa amarilla (${a} bolas); es el contrario del apartado 3:`, m: `P = ${fs(a, t)}` }
      ],
      res: resLista([F(r, t), F(v + a, t), F(r + v, t), F(a, t)])
    };
  }

  /* ================= 2 y 3. Dos extracciones: diagrama de árbol ================= */
  /* Ficha: blancas y negras entre 2 y 7, distintas; se preguntan 3 de los 4 caminos */
  const NOMBRE = { B: 'blanca', N: 'negra' }, PLURAL = { B: 'blancas', N: 'negras' };
  const textoCamino = c => (c[0] === c[1] ? `las dos bolas sean ${PLURAL[c[0]]}.` : `la 1.ª bola sea ${NOMBRE[c[0]]} y la 2.ª ${NOMBRE[c[1]]}.`);
  function arbol(p1, p2, marcados) {
    const L = Lienzo(), X1 = 62, X2 = 140, Y1 = 46, Y2 = 22;
    const nodos = [];
    const rama = (xa, ya, xb, yb, [a, b], arriba, dx = 0) => {
      L.linea(xa, ya, xb, yb, { grosor: 1.1 });
      L.texto((xa + xb) / 2 + (arriba ? -4 : 4) + dx, (ya + yb) / 2 + (arriba ? -5 : 13), `${a}/${b}`, { tam: 11 });
    };
    ['B', 'N'].forEach((X, i) => {
      const y1 = i === 0 ? -Y1 : Y1;
      rama(0, 0, X1, y1, p1(X), i === 0, i === 0 ? -6 : -14);
      nodos.push([X1, y1, X]);
      ['B', 'N'].forEach((Y, j) => {
        const y2 = y1 + (j === 0 ? -Y2 : Y2);
        rama(X1 + 9, y1, X2, y2, p2(X, Y), j === 0);
        nodos.push([X2, y2, Y]);
        const c = X + Y;
        L.texto(X2 + 14, y2 + 4, marcados[c] ? `${c} (${marcados[c]})` : c, { ancla: 'start', tam: 11, peso: marcados[c] ? 600 : 400 });
      });
    });
    L.punto(0, 0, 2.5);
    nodos.forEach(([x, y, l]) => L.circulo(x, y, 8, { relleno: l === 'B' ? '#fff' : '#d0d0d0', grosor: 1 }).texto(x, y + 4, l, { tam: 10.5, peso: 600 }));
    return L.cerrar('pend-fig', 'Diagrama de árbol de las dos extracciones');
  }
  function genDos(R, reemp) {
    let b, n;
    do { b = R.int(2, 7); n = R.int(2, 7); } while (b === n);
    const t = b + n, cuenta = { B: b, N: n };
    const p1 = X => [cuenta[X], t];
    const p2 = (X, Y) => (reemp ? [cuenta[Y], t] : [cuenta[Y] - (X === Y ? 1 : 0), t - 1]);
    const elegidos = R.shuffle(['BB', 'BN', 'NB', 'NN']).slice(0, 3);
    const marcados = {}; elegidos.forEach((c, k) => { marcados[c] = k + 1; });
    const lineas = elegidos.map((c, k) => {
      const [a1, d1] = p1(c[0]), [a2, d2] = p2(c[0], c[1]);
      return { m: `${k + 1})\\; P(${c}) = \\frac{${a1}}{${d1}} \\cdot \\frac{${a2}}{${d2}} = ${fs(a1 * a2, d1 * d2)}`, r: F(a1 * a2, d1 * d2) };
    });
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">Una bolsa tiene ${b} bolas blancas y ${n} negras. Se sacan dos bolas, una detrás de otra, <b>${reemp ? 'con' : 'sin'} reemplazamiento</b> (${reemp ? 'la primera bola se devuelve a la bolsa antes de sacar la segunda' : 'la primera bola no se devuelve'}). Ayúdate de un diagrama de árbol y calcula la probabilidad de que:</span>${preguntas(elegidos.map(textoCamino))}</div>`,
      pasos: [
        { t: reemp
          ? `En la 1.ª extracción hay ${t} bolas. Como la bola se devuelve, en la 2.ª la bolsa está igual: las ramas de la 2.ª extracción son las mismas que las de la 1.ª (sucesos independientes).`
          : `En la 1.ª extracción hay ${t} bolas. Como no se devuelve, en la 2.ª quedan ${t - 1} bolas y una menos del color que salió (sucesos dependientes).`,
          html: arbol(p1, p2, marcados) },
        { t: 'La probabilidad de cada camino es el producto de las probabilidades de sus ramas:', m: lineas.map(l => l.m).join(' \\\\ '), multilinea: true }
      ],
      res: resLista(lineas.map(l => l.r))
    };
  }

  /* ================= 4. Baraja española ================= */
  /* Ficha: rey, sota, caballo y as; se añaden el siete y el cinco (también en la ficha) para dar más variedad */
  const PALOS = ['oros', 'copas', 'espadas', 'bastos'];
  const CARTAS = [
    { un: 'un rey', el: 'el rey', nombre: 'rey', plural: 'reyes' },
    { un: 'una sota', el: 'la sota', nombre: 'sota', plural: 'sotas' },
    { un: 'un caballo', el: 'el caballo', nombre: 'caballo', plural: 'caballos' },
    { un: 'un as', el: 'el as', nombre: 'as', plural: 'ases' },
    { un: 'un siete', el: 'el siete', nombre: 'siete', plural: 'sietes' },
    { un: 'un cinco', el: 'el cinco', nombre: 'cinco', plural: 'cincos' }
  ];
  function genBaraja(R) {
    const palo = R.pick(PALOS), c = R.pick(CARTAS);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">De una baraja española de 40 cartas (4 palos de 10 cartas: del 1 al 7, sota, caballo y rey) se extrae una carta al azar. Calcula la probabilidad de:</span>${preguntas([`sacar una carta de ${palo}.`, `sacar ${c.un}.`, `sacar ${c.el} de ${palo}.`, `sacar ${c.un} o una carta de ${palo}.`])}</div>`,
      pasos: [
        { t: `1. Cada palo tiene 10 cartas:`, m: `P(\\text{${palo}}) = ${fs(10, 40)}` },
        { t: `2. Hay ${c.nombre === 'sota' ? 'una' : 'uno'} en cada palo: 4 ${c.plural}.`, m: `P(\\text{${c.nombre}}) = ${fs(4, 40)}` },
        { t: `3. Solo una carta es a la vez ${c.nombre} y de ${palo}:`, m: `P = \\frac{1}{40}` },
        { t: `4. ${c.plural[0].toUpperCase() + c.plural.slice(1)}: 4; cartas de ${palo}: 10. ${c.el[0].toUpperCase() + c.el.slice(1)} de ${palo} está en los dos grupos y no se cuenta dos veces: \\(10 + 4 - 1 = 13\\).`, m: `P = \\frac{13}{40}` }
      ],
      res: resLista([F(10, 40), F(4, 40), F(1, 40), F(13, 40)])
    };
  }

  const ENUN = ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'];
  registrarFicha({
    id: 'pend3-probabilidad',
    titulo: 'Probabilidad',
    detalle: '3.º ESO',
    grupo: 'Recuperación de 3.º ESO',
    enlace: '../pendientes/tercero/probabilidad-3.html',
    ejercicios: [
      { id: 'bolsa', nombre: 'Extracción simple de una bolsa', peso: 1, columnas: 2, enunciado: ENUN, generar: genBolsa },
      { id: 'con', nombre: 'Dos extracciones con reemplazamiento', peso: 1.25, columnas: 2, enunciado: ENUN, generar: R => genDos(R, true) },
      { id: 'sin', nombre: 'Dos extracciones sin reemplazamiento', peso: 1.25, columnas: 2, enunciado: ENUN, generar: R => genDos(R, false) },
      { id: 'baraja', nombre: 'Baraja española', peso: 1, columnas: 2, enunciado: ENUN, generar: genBaraja }
    ]
  });
})();
