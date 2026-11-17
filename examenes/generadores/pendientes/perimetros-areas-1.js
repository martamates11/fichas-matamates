/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Perímetros y áreas (pendientes de 1.º ESO).
   Figuras y rangos de medidas de la ficha pendientes/primero/perimetros-areas-1.html,
   con un cambio pensado para hacer el examen sin calculadora: cuando hace falta
   Pitágoras (triángulo rectángulo y rombo) se usan ternas pitagóricas, y en el
   trapecio los lados oblicuos son enteros. En el círculo se usa π ≈ 3,14. */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { dec, medida, Lienzo, rd } = pend;

  const K = 120;                         // px de modelo para la dimensión mayor de la figura
  const cm = x => `${dec(x)}\\text{ cm}`;
  const cm2 = x => `${dec(x)}\\text{ cm}^2`;
  const resPA = (P, A, nomP = 'P') => `${nomP} = ${cm(P)},\\quad A = ${cm2(A)}`;
  const figura = (svg, nota = '') => `<div class="pend-col">${svg}${nota ? `<span class="pend-nota">${nota}</span>` : ''}</div>`;

  /* ---------- Rectángulo (ficha: b 5–25, h 3–15) ---------- */
  function rectangulo(R) {
    const b = R.int(5, 25), h = R.int(3, 15), s = K / Math.max(b, h);
    const B = b * s, H = h * s, L = Lienzo();
    L.poligono([[0, 0], [B, 0], [B, H], [0, H]]).anguloRecto([0, H], [1, 0], [0, -1])
      .cota([0, H], [B, H], medida(b), { lado: -1 }).cota([0, 0], [0, H], medida(h), { lado: -1 });
    const P = 2 * b + 2 * h, A = b * h;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Rectángulo')),
      pasos: [
        { t: 'El rectángulo tiene dos lados de cada medida:', m: `P = 2 \\cdot b + 2 \\cdot h = 2 \\cdot ${b} + 2 \\cdot ${h} = ${cm(P)}` },
        { t: 'Área: base por altura.', m: `A = b \\cdot h = ${b} \\cdot ${h} = ${cm2(A)}` }
      ],
      res: resPA(P, A)
    };
  }

  /* ---------- Triángulo rectángulo (ficha: catetos 4–20 y 3–18) ---------- */
  const TERNAS_TRI = [[3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20], [5, 12, 13], [8, 15, 17], [15, 20, 25], [12, 9, 15], [4, 3, 5], [8, 6, 10], [16, 12, 20], [12, 5, 13], [15, 8, 17]];
  function trianguloRect(R) {
    const [b, a, c] = R.pick(TERNAS_TRI), s = K / Math.max(a, b);
    const B = b * s, H = a * s, L = Lienzo();
    L.poligono([[0, H], [B, H], [0, 0]]).anguloRecto([0, H], [1, 0], [0, -1])
      .cota([0, H], [B, H], medida(b), { lado: -1 }).cota([0, 0], [0, H], medida(a), { lado: -1 });
    const P = a + b + c, A = a * b / 2;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Triángulo rectángulo')),
      pasos: [
        { t: 'Para el perímetro falta la hipotenusa; la calculamos con el teorema de Pitágoras:', m: `c = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${c * c}} = ${cm(c)}` },
        { t: 'Perímetro: suma de los tres lados.', m: `P = ${a} + ${b} + ${c} = ${cm(P)}` },
        { t: 'Área: los catetos son la base y la altura.', m: `A = \\frac{b \\cdot h}{2} = \\frac{${b} \\cdot ${a}}{2} = ${cm2(A)}` }
      ],
      res: resPA(P, A)
    };
  }

  /* ---------- Paralelogramo (ficha: b 8–22, h 4–14, lado oblicuo h+2 a h+12) ---------- */
  function paralelogramo(R) {
    let b, h, a, o;
    do { b = R.int(8, 22); h = R.int(4, 14); a = R.int(h + 2, h + 12); o = Math.sqrt(a * a - h * h); } while (o > 0.65 * b || b + o > 2.6 * h);   // ni muy inclinado ni muy aplanado: la altura debe poder rotularse
    const s = 1.25 * K / Math.max(b + o, h), B = b * s, H = h * s, O = o * s, L = Lienzo();
    L.poligono([[0, H], [B, H], [B + O, 0], [O, 0]])
      .linea(O, 0, O, H, { discontinua: true, grosor: 1 }).anguloRecto([O, H], [1, 0], [0, -1], 7)
      .rotulo(O, H * 0.45, 1, 0, `h = ${medida(h)}`, 12, 4)
      .cota([0, H], [B, H], medida(b), { lado: -1 });
    const lx = O, ly = -H, l = Math.hypot(lx, ly);
    L.rotulo(B + O / 2, H / 2, -ly / l, lx / l, medida(a), 13, 8);
    const P = 2 * (b + a), A = b * h;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Paralelogramo')),
      pasos: [
        { t: 'Tiene dos pares de lados iguales:', m: `P = 2 \\cdot (b + a) = 2 \\cdot (${b} + ${a}) = ${cm(P)}` },
        { t: 'El área usa la altura (perpendicular a la base), no el lado oblicuo:', m: `A = b \\cdot h = ${b} \\cdot ${h} = ${cm2(A)}` }
      ],
      res: resPA(P, A)
    };
  }

  /* ---------- Rombo (ficha: D 8–24, d 4–14) ---------- */
  /* Semidiagonales que forman terna pitagórica con el lado */
  const SEMIDIAG = [[4, 3], [8, 6], [12, 9], [16, 12], [12, 5], [15, 8], [20, 15]];
  function rombo(R) {
    const [m, k] = R.pick(SEMIDIAG);
    const D = 2 * m, d = 2 * k, lado = Math.hypot(m, k), s = K / D;
    const X = D * s / 2, Y = d * s / 2, L = Lienzo();
    L.poligono([[-X, 0], [0, -Y], [X, 0], [0, Y]])
      .linea(-X, 0, X, 0, { discontinua: true, grosor: 1 }).linea(0, -Y, 0, Y, { discontinua: true, grosor: 1 })
      .anguloRecto([0, 0], [1, 0], [0, -1], 6)
      .cota([-X, 0], [X, 0], `D = ${medida(D)}`, { lado: -1, d: Y + 14 })
      .cota([0, -Y], [0, Y], `d = ${medida(d)}`, { lado: 1, d: X + 14 });
    const P = 4 * lado, A = D * d / 2;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Rombo')),
      pasos: [
        { t: 'Las diagonales se cortan en ángulo recto y por la mitad. El lado es la hipotenusa de un triángulo rectángulo cuyos catetos son las semidiagonales:', m: `l = \\sqrt{${m}^2 + ${k}^2} = \\sqrt{${m * m} + ${k * k}} = \\sqrt{${lado * lado}} = ${cm(lado)}` },
        { t: 'Los cuatro lados son iguales:', m: `P = 4 \\cdot l = 4 \\cdot ${lado} = ${cm(P)}` },
        { t: 'Área: la mitad del producto de las diagonales.', m: `A = \\frac{D \\cdot d}{2} = \\frac{${D} \\cdot ${d}}{2} = ${cm2(A)}` }
      ],
      res: resPA(P, A)
    };
  }

  /* ---------- Trapecio (ficha: B 14–26, h 5–14; lados oblicuos como dato) ---------- */
  /* Desplazamientos horizontales que, con la altura h, dan lados oblicuos enteros */
  const DESPL = { 4: [0, 3], 6: [0, 8], 8: [0, 6, 15], 12: [0, 5, 9, 16], 9: [0, 12] };
  function trapecio(R) {
    let h, oL, oR, b, B;
    do {
      h = R.pick([4, 6, 8, 8, 9, 12, 12]);
      oL = R.pick(DESPL[h]); oR = R.pick(DESPL[h]);
      b = R.int(6, 12); B = b + oL + oR;
    } while ((oL === 0 && oR === 0) || B > 2.6 * h);   // evita trapecios demasiado aplanados
    const lL = Math.hypot(h, oL), lR = Math.hypot(h, oR);
    const s = 1.25 * K / Math.max(B, h), Bw = B * s, H = h * s, OL = oL * s, OR = oR * s, L = Lienzo();
    L.poligono([[0, H], [Bw, H], [Bw - OR, 0], [OL, 0]])
      .cota([0, H], [Bw, H], medida(B), { lado: -1 })
      .cota([OL, 0], [Bw - OR, 0], medida(b), { lado: 1 });
    const lateral = (px, py, qx, qy, txt) => {          // rótulo hacia fuera del lado PQ
      const lx = qx - px, ly = qy - py, l = Math.hypot(lx, ly), mx = (px + qx) / 2, my = (py + qy) / 2;
      let nx = ly / l, ny = -lx / l;
      if ((mx - Bw / 2) * nx + (my - H / 2) * ny < 0) { nx = -nx; ny = -ny; }
      L.rotulo(mx, my, nx, ny, txt, 13, 6);
    };
    /* Trapecio rectángulo: el lado vertical es la altura y se rotula como tal.
       Si no, altura discontinua desde el vértice superior izquierdo, rotulada en el lado con más hueco. */
    if (oL === 0) { L.anguloRecto([0, H], [1, 0], [0, -1], 7); lateral(0, H, 0, 0, `h = ${medida(h)}`); }
    else lateral(0, H, OL, 0, medida(lL));
    if (oR === 0) { L.anguloRecto([Bw, H], [-1, 0], [0, -1], 7); lateral(Bw, H, Bw, 0, `h = ${medida(h)}`); }
    else lateral(Bw, H, Bw - OR, 0, medida(lR));
    if (oL !== 0 && oR !== 0) {
      /* Altura desde el vértice superior izquierdo o el derecho, con el rótulo donde haya más hueco
         (hueco medido a media altura, entre la altura y el lado oblicuo más cercano) */
      const xIzq = 0.55 * OL, xDer = Bw - 0.55 * OR;
      const opciones = [[OL, 1, xDer - OL], [OL, -1, OL - xIzq], [Bw - OR, 1, xDer - (Bw - OR)], [Bw - OR, -1, Bw - OR - xIzq]];
      const [xh, lado] = opciones.reduce((a, o) => (o[2] > a[2] ? o : a));
      L.linea(xh, 0, xh, H, { discontinua: true, grosor: 1 }).anguloRecto([xh, H], [lado, 0], [0, -1], 6)
        .rotulo(xh, H * 0.45, lado, 0, `h = ${medida(h)}`, 12, 4);
    }
    const P = B + b + lL + lR, A = (B + b) * h / 2;
    const recto = oL === 0 || oR === 0;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Trapecio')),
      pasos: [
        { t: recto ? 'Es un trapecio rectángulo: el lado perpendicular a las bases es la altura. El perímetro es la suma de los cuatro lados:' : 'El perímetro es la suma de los cuatro lados:', m: `P = B + b + l_1 + l_2 = ${B} + ${b} + ${lL} + ${lR} = ${cm(P)}` },
        { t: 'Área: la semisuma de las bases por la altura.', m: `A = \\frac{(B + b) \\cdot h}{2} = \\frac{(${B} + ${b}) \\cdot ${h}}{2} = \\frac{${B + b} \\cdot ${h}}{2} = ${cm2(A)}` }
      ],
      res: resPA(P, A)
    };
  }

  /* ---------- Pentágono regular (ficha: l 5–18; apotema como dato) ---------- */
  function pentagono(R) {
    const l = R.int(5, 18), ap = rd(l / (2 * Math.tan(Math.PI / 5)), 1);
    const Rc = l / (2 * Math.sin(Math.PI / 5)), s = 1.25 * K / (2 * Rc), L = Lienzo();
    const V = [0, 1, 2, 3, 4].map(i => { const t = -Math.PI / 2 + 2 * Math.PI * i / 5; return [Rc * s * Math.cos(t), Rc * s * Math.sin(t)]; });
    const M = [(V[2][0] + V[3][0]) / 2, (V[2][1] + V[3][1]) / 2];
    L.poligono(V).punto(0, 0, 2.2).linea(0, 0, M[0], M[1], { discontinua: true, grosor: 1 })
      .anguloRecto(M, [1, 0], [0, -1], 6)
      .rotulo(0, M[1] * 0.18, 1, 0, `a = ${medida(ap)}`, 11, 4)
      .cota(V[3], V[2], medida(l), { lado: -1 });
    const P = 5 * l, A = rd(P * ap / 2, 2);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Pentágono regular')),
      pasos: [
        { t: 'Los cinco lados son iguales:', m: `P = 5 \\cdot l = 5 \\cdot ${l} = ${cm(P)}` },
        { t: 'Área de un polígono regular: perímetro por apotema entre dos.', m: `A = \\frac{P \\cdot a}{2} = \\frac{${P} \\cdot ${dec(ap)}}{2} = ${cm2(A)}` }
      ],
      res: resPA(P, A)
    };
  }

  /* ---------- Círculo (ficha: r 3–18) ---------- */
  function circulo(R) {
    const r = R.int(3, 18), rr = K / 2, L = Lienzo();
    L.circulo(0, 0, rr).punto(0, 0, 2.2).linea(0, 0, rr, 0, { discontinua: true, grosor: 1 })
      .texto(rr / 2, -6, `r = ${medida(r)}`, { tam: 12 });
    const Lc = rd(2 * 3.14 * r, 2), A = rd(3.14 * r * r, 2);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Círculo'), 'Usa π ≈ 3,14'),
      pasos: [
        { t: 'Longitud de la circunferencia (su perímetro):', m: `L = 2 \\pi r \\approx 2 \\cdot 3{,}14 \\cdot ${r} = ${cm(Lc)}` },
        { t: 'Área del círculo:', m: `A = \\pi r^2 \\approx 3{,}14 \\cdot ${r}^2 = 3{,}14 \\cdot ${r * r} = ${cm2(A)}` }
      ],
      res: resPA(Lc, A, 'L')
    };
  }

  /* ---------- Figuras variadas: cada apartado, una figura distinta ---------- */
  const FIGURAS = { rectangulo, trianguloRect, paralelogramo, rombo, trapecio, pentagono, circulo };
  const TANDAS = [['rectangulo', 'paralelogramo'], ['trianguloRect', 'rombo'], ['trapecio', 'pentagono'], ['circulo'], ['paralelogramo', 'rombo'], ['trapecio', 'trianguloRect']];
  const variada = (R, i) => FIGURAS[R.pick(TANDAS[i % TANDAS.length])](R);

  const ENUN = ['Calcula el perímetro y el área de la siguiente figura:',
    'Calcula el perímetro y el área de las siguientes figuras:'];
  const tipo = (id, nombre, generar, peso = 1, enunciado = ENUN) => ({ id, nombre, peso, columnas: 2, enunciado, generar });

  registrarFicha({
    id: 'pend1-perimetros-areas',
    titulo: 'Perímetros y áreas',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/perimetros-areas-1.html',
    ejercicios: [
      tipo('variada', 'Figuras variadas (una distinta en cada apartado)', variada, 1.25),
      tipo('rectangulo', 'Rectángulo', rectangulo),
      tipo('triangulo', 'Triángulo rectángulo (con Pitágoras)', trianguloRect, 1.25),
      tipo('paralelogramo', 'Paralelogramo', paralelogramo),
      tipo('rombo', 'Rombo (con Pitágoras)', rombo, 1.25),
      tipo('trapecio', 'Trapecio', trapecio),
      tipo('pentagono', 'Pentágono regular', pentagono),
      tipo('circulo', 'Círculo', circulo, 1, ['Calcula la longitud de la circunferencia y el área del círculo:', 'Calcula la longitud de la circunferencia y el área de cada círculo:'])
    ]
  });
})();
