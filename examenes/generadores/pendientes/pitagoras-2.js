/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Teorema de Pitágoras (pendientes de 2.º ESO).
   Mismos tipos de ejercicio que la ficha pendientes/segundo/pitagoras-2.html.
   Pensado para hacer el examen sin calculadora: la hipotenusa, el cateto, la altura
   del triángulo isósceles, la diagonal del rectángulo y la altura del trapecio isósceles
   salen de ternas pitagóricas (resultados exactos; la ficha usa los mismos datos).
   La apotema del hexágono nunca es exacta: se pide dejar la raíz indicada. */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { dec, medida, Lienzo } = pend;

  const K = 120;                         // px de modelo para la dimensión mayor de la figura
  const cm = x => `${dec(x)}\\text{ cm}`;
  const figura = (svg, nota = '') => `<div class="pend-col">${svg}${nota ? `<span class="pend-nota">${nota}</span>` : ''}</div>`;
  const cuad = x => dec(x * x);          // cuadrado con coma: 3,5² → 12,25

  /* Ternas pitagóricas [cateto, cateto, hipotenusa] (las mismas que la ficha) */
  const TERNAS = [[3, 4, 5], [6, 8, 10], [9, 12, 15], [5, 12, 13], [8, 15, 17], [12, 16, 20], [7, 24, 25],
    [10, 24, 26], [15, 20, 25], [18, 24, 30], [20, 21, 29], [16, 30, 34], [12, 35, 37]];

  /* Rótulo junto al punto medio del segmento PQ, hacia fuera de la figura (lejos de C) */
  function rotuloFuera(L, [px, py], [qx, qy], [cx, cy], txt, tam = 13, sep = 7) {
    const lx = qx - px, ly = qy - py, l = Math.hypot(lx, ly), mx = (px + qx) / 2, my = (py + qy) / 2;
    let nx = ly / l, ny = -lx / l;
    if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
    L.rotulo(mx, my, nx, ny, txt, tam, sep);
  }

  /* Triángulo rectángulo con catetos b (horizontal) y a (vertical); falta: 'c' | 'b' | 'a' */
  function triRect(b, a, c, falta) {
    const s = K / Math.max(a, b), B = b * s, H = a * s, L = Lienzo();
    const P0 = [0, H], P1 = [B, H], P2 = [0, 0];
    L.poligono([P0, P1, P2]).anguloRecto(P0, [1, 0], [0, -1]);
    if (falta === 'c') L.linea(B, H, 0, 0, { grosor: 1.6, discontinua: true });
    L.cota(P0, P1, falta === 'b' ? 'b = ?' : `b = ${medida(b)}`, { lado: -1 })
      .cota(P2, P0, falta === 'a' ? 'a = ?' : `a = ${medida(a)}`, { lado: -1 });
    rotuloFuera(L, P1, P2, [B / 3, 2 * H / 3], falta === 'c' ? 'c = ?' : `c = ${medida(c)}`);
    return L.cerrar('pend-fig', 'Triángulo rectángulo');
  }

  /* ---------- 1. Hipotenusa ---------- */
  function hipotenusa(R) {
    const [p, q, c] = R.pick(TERNAS), [b, a] = R.rand() < 0.5 ? [p, q] : [q, p];
    return {
      html: true, enun: figura(triRect(b, a, c, 'c')),
      pasos: [
        { t: 'En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos:', m: 'c^2 = a^2 + b^2' },
        { t: 'Sustituimos y hacemos la raíz cuadrada:', m: `c = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${c * c}} = ${cm(c)}` }
      ],
      res: `c = ${cm(c)}`
    };
  }

  /* ---------- 2. Cateto ---------- */
  function cateto(R) {
    const [p, q, c] = R.pick(TERNAS), [b, a] = R.rand() < 0.5 ? [p, q] : [q, p];
    const falta = R.rand() < 0.5 ? 'b' : 'a', x = falta === 'b' ? b : a, k = falta === 'b' ? a : b, otra = falta === 'b' ? 'a' : 'b';
    return {
      html: true, enun: figura(triRect(b, a, c, falta)),
      pasos: [
        { t: 'Conocemos la hipotenusa y un cateto. Despejamos el cateto que falta en el teorema de Pitágoras:', m: `${falta}^2 = c^2 - ${otra}^2` },
        { t: 'Sustituimos (se resta: la hipotenusa es el lado mayor):', m: `${falta} = \\sqrt{${c}^2 - ${k}^2} = \\sqrt{${c * c} - ${k * k}} = \\sqrt{${x * x}} = ${cm(x)}` }
      ],
      res: `${falta} = ${cm(x)}`
    };
  }

  /* ---------- 3. Altura del triángulo isósceles ---------- */
  /* [semibase, altura, lado igual]: base par de 6 a 40 cm */
  const ISOS = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [9, 12, 15], [12, 9, 15], [5, 12, 13], [12, 5, 13],
    [8, 15, 17], [15, 8, 17], [7, 24, 25], [10, 24, 26], [12, 16, 20], [16, 12, 20], [15, 20, 25], [20, 15, 25],
    [18, 24, 30], [20, 21, 29], [16, 30, 34], [12, 35, 37]];
  function isosceles(R) {
    const [m, h, l] = R.pick(ISOS), base = 2 * m;
    const s = 1.25 * K / Math.max(base, h), X = m * s, H = h * s, L = Lienzo();
    L.poligono([[-X, H], [X, H], [0, 0]])
      .linea(0, 0, 0, H, { discontinua: true, grosor: 1 }).anguloRecto([0, H], [1, 0], [0, -1], 7)
      .cota([-X, H], [X, H], `b = ${medida(base)}`, { lado: -1 });
    /* marcas de lados iguales */
    [[-X, H], [X, H]].forEach(([vx, vy]) => {
      const mx = vx * 0.8, my = vy * 0.8, lx = vx, ly = vy, n = Math.hypot(lx, ly), tx = -ly / n * 4, ty = lx / n * 4;
      L.linea(mx - tx, my - ty, mx + tx, my + ty, { grosor: 1.2 });
    });
    rotuloFuera(L, [-X, H], [0, 0], [0, H / 2], `l = ${medida(l)}`);
    L.rotulo(0, H * 0.5, 1, 0, 'h = ?', 11, 3);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Triángulo isósceles')),
      pasos: [
        { t: 'La altura cae en el punto medio de la base y forma un triángulo rectángulo: la hipotenusa es el lado igual y un cateto es la mitad de la base.', m: `\\frac{b}{2} = \\frac{${base}}{2} = ${cm(m)}` },
        { t: 'Aplicamos el teorema de Pitágoras para el otro cateto, que es la altura:', m: `h = \\sqrt{l^2 - \\left(\\frac{b}{2}\\right)^2} = \\sqrt{${l}^2 - ${m}^2} = \\sqrt{${l * l} - ${m * m}} = \\sqrt{${h * h}} = ${cm(h)}` }
      ],
      res: `h = ${cm(h)}`
    };
  }

  /* ---------- 4. Diagonal del rectángulo ---------- */
  /* [base, altura, diagonal]: lados de 5 a 24 cm con diagonal entera */
  const RECT = [[6, 8, 10], [8, 6, 10], [9, 12, 15], [12, 9, 15], [12, 16, 20], [16, 12, 20], [15, 20, 25], [20, 15, 25],
    [24, 18, 30], [18, 24, 30], [5, 12, 13], [12, 5, 13], [24, 10, 26], [10, 24, 26], [8, 15, 17], [15, 8, 17],
    [24, 7, 25], [7, 24, 25], [21, 20, 29], [20, 21, 29]];
  function diagonal(R) {
    const [b, h, d] = R.pick(RECT), s = K / Math.max(b, h), B = b * s, H = h * s, L = Lienzo();
    L.poligono([[0, 0], [B, 0], [B, H], [0, H]]).anguloRecto([0, H], [1, 0], [0, -1])
      .linea(0, H, B, 0, { discontinua: true, grosor: 1.4 })
      .cota([0, H], [B, H], `b = ${medida(b)}`, { lado: -1 }).cota([0, 0], [0, H], `h = ${medida(h)}`, { lado: -1 });
    /* «d = ?» encima de la diagonal, en el triángulo superior izquierdo */
    const n = Math.hypot(B, H);
    L.rotulo(B / 2, H / 2, -H / n, -B / n, 'd = ?', 12, 10);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Rectángulo')),
      pasos: [
        { t: 'La diagonal divide el rectángulo en dos triángulos rectángulos: la diagonal es la hipotenusa y los lados son los catetos.', m: 'd^2 = b^2 + h^2' },
        { t: 'Sustituimos y hacemos la raíz:', m: `d = \\sqrt{${b}^2 + ${h}^2} = \\sqrt{${b * b} + ${h * h}} = \\sqrt{${d * d}} = ${cm(d)}` }
      ],
      res: `d = ${cm(d)}`
    };
  }

  /* ---------- 5. Apotema del hexágono regular (ficha: l 6–16; aquí 4–24) ---------- */
  function hexagono(R) {
    const l = R.int(4, 24), m = l / 2, rad = l * l - m * m;
    const s = 0.62 * K / l, Rr = l * s, L = Lienzo();
    const V = [0, 1, 2, 3, 4, 5].map(i => { const t = Math.PI * i / 3; return [Rr * Math.cos(t), Rr * Math.sin(t)]; });
    const M = [(V[1][0] + V[2][0]) / 2, (V[1][1] + V[2][1]) / 2];   // punto medio del lado inferior
    L.poligono(V).punto(0, 0, 2.2)
      .linea(0, 0, M[0], M[1], { discontinua: true, grosor: 1.1 })
      .anguloRecto(M, [1, 0], [0, -1], 6)
      .rotulo(M[0], M[1] * 0.45, 1, 0, 'a = ?', 12, 4)
      .cota(V[2], V[1], `l = ${medida(l)}`, { lado: -1 });
    const exacta = Number.isInteger(Math.sqrt(rad));
    const raiz = `\\sqrt{${dec(rad)}}`;
    const aprox = Math.sqrt(rad);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Hexágono regular'), 'Si la raíz no es exacta, déjala indicada.'),
      pasos: [
        { t: 'En el hexágono regular, el radio mide lo mismo que el lado (el triángulo central es equilátero). La apotema divide ese triángulo en dos triángulos rectángulos de hipotenusa el radio y cateto la mitad del lado:', m: `r = l = ${cm(l)},\\qquad \\frac{l}{2} = ${cm(m)}` },
        { t: 'Aplicamos el teorema de Pitágoras:', m: `a = \\sqrt{r^2 - \\left(\\frac{l}{2}\\right)^2} = \\sqrt{${l}^2 - ${dec(m)}^2} = \\sqrt{${l * l} - ${cuad(m)}} = ${raiz}\\text{ cm}` },
        ...(exacta ? [] : [{ t: 'La raíz no es exacta; si se quiere aproximar:', m: `a = ${raiz} \\approx ${cm(aprox)}` }])
      ],
      res: `a = ${raiz}\\text{ cm}${exacta ? '' : ` \\approx ${cm(aprox)}`}`
    };
  }

  /* ---------- 6. Altura del trapecio isósceles ---------- */
  /* [semidiferencia de las bases, altura, lado oblicuo]; base mayor par de 14 a 26 cm */
  const TRAP = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [6, 8, 10], [8, 6, 10]];
  function trapecio(R) {
    let o, h, l, B, b;
    do { [o, h, l] = R.pick(TRAP); B = 2 * R.int(7, 13); b = B - 2 * o; } while (b < 2 || B > 3.2 * h + 2 * o);
    const s = 1.2 * K / Math.max(B, h), Bw = B * s, H = h * s, O = o * s, L = Lienzo();
    L.poligono([[0, H], [Bw, H], [Bw - O, 0], [O, 0]])
      .linea(O, 0, O, H, { discontinua: true, grosor: 1 }).anguloRecto([O, H], [1, 0], [0, -1], 6)
      .rotulo(O, H * 0.5, 1, 0, 'h = ?', 12, 4)
      .cota([0, H], [Bw, H], `B = ${medida(B)}`, { lado: -1 })
      .cota([O, 0], [Bw - O, 0], `b = ${medida(b)}`, { lado: 1 });
    rotuloFuera(L, [Bw, H], [Bw - O, 0], [Bw / 2, H / 2], `l = ${medida(l)}`);
    [[0, H, O, 0], [Bw, H, Bw - O, 0]].forEach(([x1, y1, x2, y2]) => {      // marcas de lados iguales
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, n = Math.hypot(x2 - x1, y2 - y1), tx = -(y2 - y1) / n * 4, ty = (x2 - x1) / n * 4;
      L.linea(mx - tx, my - ty, mx + tx, my + ty, { grosor: 1.2 });
    });
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Trapecio isósceles')),
      pasos: [
        { t: 'Al trazar la altura se forma un triángulo rectángulo: la hipotenusa es el lado oblicuo y el cateto horizontal es la semidiferencia de las bases.', m: `\\frac{B - b}{2} = \\frac{${B} - ${b}}{2} = ${cm(o)}` },
        { t: 'Aplicamos el teorema de Pitágoras para la altura:', m: `h = \\sqrt{l^2 - \\left(\\frac{B - b}{2}\\right)^2} = \\sqrt{${l}^2 - ${o}^2} = \\sqrt{${l * l} - ${o * o}} = \\sqrt{${h * h}} = ${cm(h)}` }
      ],
      res: `h = ${cm(h)}`
    };
  }

  const tipo = (id, nombre, generar, enunciado, peso = 1) => ({ id, nombre, peso, columnas: 2, enunciado, generar });

  registrarFicha({
    id: 'pend2-pitagoras',
    titulo: 'Teorema de Pitágoras',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/pitagoras-2.html',
    ejercicios: [
      tipo('hipotenusa', 'Hipotenusa', hipotenusa, ['Calcula la hipotenusa del siguiente triángulo rectángulo:', 'Calcula la hipotenusa de cada triángulo rectángulo:']),
      tipo('cateto', 'Cateto que falta', cateto, ['Calcula el cateto que falta en el siguiente triángulo rectángulo:', 'Calcula el cateto que falta en cada triángulo rectángulo:']),
      tipo('isosceles', 'Altura del triángulo isósceles', isosceles, ['Calcula la altura del siguiente triángulo isósceles:', 'Calcula la altura de cada triángulo isósceles:'], 1.25),
      tipo('diagonal', 'Diagonal del rectángulo', diagonal, ['Calcula la diagonal del siguiente rectángulo:', 'Calcula la diagonal de cada rectángulo:']),
      tipo('hexagono', 'Apotema del hexágono regular', hexagono, ['Calcula la apotema del siguiente hexágono regular:', 'Calcula la apotema de cada hexágono regular:'], 1.25),
      tipo('trapecio', 'Altura del trapecio isósceles', trapecio, ['Calcula la altura del siguiente trapecio isósceles:', 'Calcula la altura de cada trapecio isósceles:'], 1.25)
    ]
  });
})();
