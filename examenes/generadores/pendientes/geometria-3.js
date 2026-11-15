/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Geometría (pendientes de 3.º ESO).
   Mismos tipos y rangos que la ficha pendientes/tercero/geometria-3.html, con datos
   pensados para hacer el examen sin calculadora (y aplicados también en la ficha):
   · Sombras: la altura y la sombra del objeto son un múltiplo entero de las de la persona.
   · Diagonal: ortoedro cuyas dos diagonales (de la base y del cuerpo) son enteras.
   · Pirámide, cono y esfera: el volumen lleva un 1/3 que se simplifica (datos múltiplos de 3).
   · Con π se usa π ≈ 3,14 y el resultado se da también en función de π. */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { dec, decTxt, medida, Lienzo, rd } = pend;

  const K = 120;                                   // px de modelo para la dimensión mayor
  const GRIS = '#555';
  const u1 = (x, u = 'cm') => `${dec(x)}\\text{ ${u}}`;
  const u2 = (x, u = 'cm') => `${dec(x)}\\text{ ${u}}^2`;
  const u3 = (x, u = 'cm') => `${dec(x)}\\text{ ${u}}^3`;
  const figura = (svg, texto = '', nota = '') =>
    `<div class="pend-col">${texto ? `<span class="pend-texto">${texto}</span>` : ''}${svg}${nota ? `<span class="pend-nota">${nota}</span>` : ''}</div>`;
  const NOTA_PI = 'Usa π ≈ 3,14';
  /* k·π con k entero o decimal: "48\pi" */
  const kpi = k => `${dec(k)}\\pi`;
  const aprox = k => rd(3.14 * k, 2);

  /* Elipse con trazo (segmentos), entre los ángulos t0 y t1 (radianes, sentido horario en pantalla) */
  function arcoElipse(L, cx, cy, rx, ry, t0, t1, op = {}) {
    const n = Math.max(8, Math.round(Math.abs(t1 - t0) / (Math.PI / 24)));
    let px = cx + rx * Math.cos(t0), py = cy + ry * Math.sin(t0);
    for (let i = 1; i <= n; i++) {
      const t = t0 + (t1 - t0) * i / n, x = cx + rx * Math.cos(t), y = cy + ry * Math.sin(t);
      L.linea(px, py, x, y, Object.assign({ grosor: 1.6 }, op));
      px = x; py = y;
    }
  }
  const ptsElipse = (cx, cy, rx, ry, t0 = 0, t1 = 2 * Math.PI, n = 48) =>
    Array.from({ length: n + 1 }, (_, i) => { const t = t0 + (t1 - t0) * i / n; return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)]; });
  /* Texto con subíndice: h_ℓ */
  const hl = '<tspan font-style="italic">h</tspan><tspan dy="3" font-size="9">ℓ</tspan><tspan dy="-3">';

  /* ================= 1. Semejanza: sombras ================= */
  const OBJETOS = [
    { un: 'una torre', Un: 'Una torre', el: 'la torre', min: 18, max: 45, tipo: 'torre' },
    { un: 'un árbol', Un: 'Un árbol', el: 'el árbol', min: 5, max: 14, tipo: 'arbol' },
    { un: 'un edificio', Un: 'Un edificio', el: 'el edificio', min: 12, max: 40, tipo: 'edificio' },
    { un: 'una farola', Un: 'Una farola', el: 'la farola', min: 4, max: 9, tipo: 'farola' }
  ];
  const REFS = ['un niño', 'una niña'];
  const ALTURAS = [1.2, 1.4, 1.5, 1.6, 1.8];                  // persona (ficha: 1,10–1,80 m)
  const SOMBRAS = [0.8, 1, 1.2, 1.5, 2, 2.4, 2.5];            // su sombra (ficha: 0,80–2,50 m)

  function figSombras(d) {
    const L = Lienzo(), Ho = 78, Hp = 26, r = Math.max(0.5, Math.min(1.8, d.s / d.h));
    const so = Ho * r, xp = so + 46, sp = Hp * r;
    L.linea(-26, 0, xp + sp + 16, 0, { grosor: 1.4 });
    /* objeto */
    if (d.o.tipo === 'arbol') {
      L.poligono([[-3, 0], [3, 0], [3, -Ho * 0.55], [-3, -Ho * 0.55]], { grosor: 1.2 }).circulo(0, -Ho * 0.72, Ho * 0.28, { grosor: 1.2 });
    } else if (d.o.tipo === 'farola') {
      L.linea(0, 0, 0, -Ho, { grosor: 2.6 }).poligono([[-6, -Ho + 2], [6, -Ho + 2], [4, -Ho - 6], [-4, -Ho - 6]], { grosor: 1.1 });
    } else {
      const w = d.o.tipo === 'torre' ? 9 : 12;
      L.poligono([[-w, 0], [w, 0], [w, -Ho], [-w, -Ho]], { grosor: 1.2 });
    }
    /* persona */
    L.circulo(xp, -Hp + 3.5, 3.5, { relleno: '#fff', grosor: 1.1 }).linea(xp, -Hp + 7, xp, -9, { grosor: 1.4 })
      .linea(xp - 4.5, -16, xp + 4.5, -16, { grosor: 1.2 }).linea(xp, -9, xp - 3.5, 0, { grosor: 1.2 }).linea(xp, -9, xp + 3.5, 0, { grosor: 1.2 });
    /* rayos y sombras */
    L.linea(0, -Ho, so, 0, { discontinua: true, grosor: 1 }).linea(xp, -Hp, xp + sp, 0, { discontinua: true, grosor: 1 });
    L.linea(0, 0, so, 0, { grosor: 4, trazo: GRIS }).linea(xp, 0, xp + sp, 0, { grosor: 4, trazo: GRIS });
    /* rótulos */
    const etH = d.pide === 'altura' ? 'H = ?' : `${decTxt(d.H)} m`;
    const etS = d.pide === 'altura' ? `${decTxt(d.S)} m` : 'S = ?';
    L.cota([0, 0], [0, -Ho], etH, { lado: 1, d: 18 });
    L.texto(so / 2, 16, etS, { tam: 12 });
    L.texto(xp + sp / 2 + 2, 16, `${decTxt(d.s)} m`, { tam: 12 });
    L.texto(xp + 9, -Hp / 2 - 2, `${decTxt(d.h)} m`, { tam: 12, ancla: 'start' });
    return L.cerrar('pend-fig', 'Objeto y persona con sus sombras');
  }

  function sombras(R) {
    const o = R.pick(OBJETOS), ref = R.pick(REFS), h = R.pick(ALTURAS);
    let s; do { s = R.pick(SOMBRAS); } while (Math.abs(s - h) < 0.1);
    const kMin = Math.ceil(o.min / h), kMax = Math.floor(o.max / h);
    const k = R.int(kMin, kMax), H = rd(k * h, 2), S = rd(k * s, 2);
    const pide = R.rand() < 0.5 ? 'altura' : 'sombra';
    const d = { o, h, s, H, S, pide };
    const texto = pide === 'altura'
      ? `¿Cuál es la altura de ${o.un} que proyecta una sombra de ${decTxt(S)} m, en el mismo momento en que ${ref} de ${decTxt(h)} m de altura proyecta una sombra de ${decTxt(s)} m?`
      : `${o.Un} mide ${decTxt(H)} m de altura. ¿Qué longitud tiene su sombra en el mismo momento en que ${ref} de ${decTxt(h)} m proyecta una sombra de ${decTxt(s)} m?`;
    const sem = { t: 'Los rayos del sol llegan paralelos: el objeto con su sombra y la persona con la suya forman dos triángulos rectángulos semejantes, así que sus lados son proporcionales.' };
    const pasos = pide === 'altura'
      ? [sem,
        { t: 'Planteamos la proporción altura/sombra:', m: `\\frac{H}{${dec(S)}} = \\frac{${dec(h)}}{${dec(s)}}` },
        { t: 'Despejamos \\(H\\); la sombra del objeto es justo ' + k + ' veces la de la persona:', m: `H = ${dec(h)} \\cdot \\frac{${dec(S)}}{${dec(s)}} = ${dec(h)} \\cdot ${k} = ${u1(H, 'm')}` }]
      : [sem,
        { t: 'Planteamos la proporción altura/sombra:', m: `\\frac{${dec(H)}}{S} = \\frac{${dec(h)}}{${dec(s)}}` },
        { t: 'Despejamos \\(S\\); el objeto es justo ' + k + ' veces más alto que la persona:', m: `S = \\frac{${dec(H)}}{${dec(h)}} \\cdot ${dec(s)} = ${k} \\cdot ${dec(s)} = ${u1(S, 'm')}` }];
    return { html: true, enun: figura(figSombras(d), texto), pasos, res: pide === 'altura' ? `H = ${u1(H, 'm')}` : `S = ${u1(S, 'm')}` };
  }

  /* ================= Ortoedro / prisma (proyección oblicua) ================= */
  /* Devuelve los vértices en pantalla: frente F[0..3] (abajo-izq, abajo-der, arriba-der, arriba-izq) y fondo T = F + o */
  function ortoedro(L, a, b, c, escala) {
    const A = a * escala, C = c * escala, B = b * escala * 0.55;
    const o = [B * Math.cos(Math.PI / 6), -B * Math.sin(Math.PI / 6)];
    const F = [[0, C], [A, C], [A, 0], [0, 0]], T = F.map(([x, y]) => [x + o[0], y + o[1]]);
    L.poligono([F[3], F[2], T[2], T[3]], { relleno: '#f5f5f5' })
      .poligono([F[1], T[1], T[2], F[2]], { relleno: '#dcdcdc' })
      .poligono(F, { relleno: '#ececec' });
    [[T[0], F[0]], [T[0], T[1]], [T[0], T[3]]].forEach(([p, q]) => L.linea(p[0], p[1], q[0], q[1], { discontinua: true, grosor: 1 }));
    return { F, T, o };
  }
  const escalaCaja = (a, b, c) => K / Math.max(a + 0.48 * b, c + 0.28 * b);

  /* ================= 2. Diagonal del ortoedro ================= */
  /* Base a × b con diagonal entera d, y altura c con diagonal del cuerpo D entera */
  const CADENAS = [[3, 4, 12, 5, 13], [6, 8, 24, 10, 26], [9, 12, 8, 15, 17], [9, 12, 20, 15, 25], [12, 16, 15, 20, 25], [12, 16, 21, 20, 29], [18, 24, 16, 30, 34]];
  function diagonal(R) {
    let [a, b, c, d, D] = R.pick(CADENAS);
    if (R.rand() < 0.5) [a, b] = [b, a];
    const u = R.pick(['cm', 'cm', 'dm', 'm']);
    const L = Lienzo(), { F, T } = ortoedro(L, a, b, c, escalaCaja(a, b, c));
    L.linea(F[0][0], F[0][1], T[1][0], T[1][1], { discontinua: true, grosor: 1.3 })
      .linea(F[0][0], F[0][1], T[2][0], T[2][1], { grosor: 1.4 })
      .anguloRecto(T[1], [F[0][0] - T[1][0], F[0][1] - T[1][1]], [0, -1], 6)
      .punto(F[0][0], F[0][1], 2).punto(T[2][0], T[2][1], 2);
    L.cota(F[0], F[1], medida(a, u), { lado: -1, d: 12 });
    L.rotulo((F[1][0] + T[1][0]) / 2, (F[1][1] + T[1][1]) / 2, 0.6, 0.8, medida(b, u), 12, 6);
    L.rotulo(T[1][0], (T[1][1] + T[2][1]) / 2, 1, 0, medida(c, u), 12, 6);
    const md = [(F[0][0] + T[1][0]) / 2, (F[0][1] + T[1][1]) / 2], mD = [(F[0][0] + T[2][0]) * 0.42, F[0][1] + (T[2][1] - F[0][1]) * 0.42];
    L.texto(md[0] + 4, md[1] - 4, 'd', { tam: 12, cursiva: true });
    L.texto(mD[0] - 5, mD[1] - 3, 'D', { tam: 12, cursiva: true, ancla: 'end' });
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Ortoedro con la diagonal de la base y la del cuerpo')),
      pasos: [
        { t: 'La diagonal de la base es la hipotenusa de un triángulo rectángulo cuyos catetos son las aristas de la base:', m: `d = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${d * d}} = ${u1(d, u)}` },
        { t: 'La diagonal del ortoedro es la hipotenusa del triángulo rectángulo que forman \\(d\\) y la altura \\(c\\):', m: `D = \\sqrt{d^2 + c^2} = \\sqrt{${d}^2 + ${c}^2} = \\sqrt{${d * d} + ${c * c}} = \\sqrt{${D * D}} = ${u1(D, u)}` }
      ],
      res: `d = ${u1(d, u)},\\quad D = ${u1(D, u)}`
    };
  }

  /* ================= 3. Prisma de base rectangular (ficha: a, b, h de 4 a 12) ================= */
  function prisma(R) {
    const a = R.int(4, 12), b = R.int(4, 12), h = R.int(4, 12);
    const L = Lienzo(), { F, T } = ortoedro(L, a, b, h, escalaCaja(a, b, h));
    L.cota(F[0], F[1], `a = ${medida(a)}`, { lado: -1, d: 12 });
    L.rotulo((F[1][0] + T[1][0]) / 2, (F[1][1] + T[1][1]) / 2, 0.6, 0.8, `b = ${medida(b)}`, 12, 6);
    L.cota(F[3], F[0], `h = ${medida(h)}`, { lado: 1, d: 12 });
    const V = a * b * h, Ab = a * b, Al = 2 * (a + b) * h, At = 2 * Ab + Al;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Prisma de base rectangular')),
      pasos: [
        { t: 'Volumen: área de la base por la altura.', m: `V = a \\cdot b \\cdot h = ${a} \\cdot ${b} \\cdot ${h} = ${u3(V)}` },
        { t: 'Área de cada base y área lateral (cuatro rectángulos de altura \\(h\\)):', m: `A_{base} = ${a} \\cdot ${b} = ${u2(Ab)} \\qquad A_{lat} = 2 \\cdot (${a} + ${b}) \\cdot ${h} = ${u2(Al)}` },
        { t: 'El prisma tiene dos bases:', m: `A_{total} = 2 \\cdot ${Ab} + ${Al} = ${u2(At)}` }
      ],
      res: `V = ${u3(V)},\\quad A_{total} = ${u2(At)}`
    };
  }

  /* ================= 4. Pirámide de base cuadrada (ficha: l 4–12, h 4–15; h_ℓ como dato) ================= */
  function piramide(R) {
    let l, h; do { l = R.int(4, 12); h = R.int(4, 15); } while ((l * h) % 3 !== 0);    // volumen entero
    const apL = rd(Math.sqrt(h * h + l * l / 4), 1);
    const s = K / Math.max(l * 1.1, h + l * 0.2), X = l * s * 0.55, Y = l * s * 0.17, Hh = h * s, L = Lienzo();
    const izq = [-X, 0], fr = [0, Y], der = [X, 0], fon = [0, -Y], V = [0, -Hh];
    L.poligono([izq, fr, der, fon], { relleno: '#dcdcdc', grosor: 1.2 })
      .poligono([V, izq, fr], { relleno: '#f2f2f2' }).poligono([V, fr, der], { relleno: '#e2e2e2' });
    L.linea(V[0], V[1], fon[0], fon[1], { discontinua: true, grosor: 1 }).linea(izq[0], izq[1], fon[0], fon[1], { discontinua: true, grosor: 1 }).linea(fon[0], fon[1], der[0], der[1], { discontinua: true, grosor: 1 });
    L.linea(0, -Hh, 0, 0, { discontinua: true, grosor: 1.2 }).anguloRecto([0, 0], [1, 0], [0, -1], 5);
    const M = [(izq[0] + fr[0]) / 2, (izq[1] + fr[1]) / 2];
    L.linea(V[0], V[1], M[0], M[1], { grosor: 1.3 });
    L.rotulo(2, -Hh * 0.62, 1, 0, `h = ${medida(h)}`, 12, 4);
    L.texto((V[0] + M[0]) / 2 - 7, (V[1] + M[1]) / 2, `${hl} = ${medida(apL)}</tspan>`, { tam: 12, ancla: 'end' });
    L.cota(fr, der, `l = ${medida(l)}`, { lado: -1, d: 10 });
    const vol = l * l * h / 3, Ab = l * l, Al = rd(2 * l * apL, 2), At = rd(Ab + Al, 2);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Pirámide de base cuadrada')),
      pasos: [
        { t: 'Volumen: un tercio del área de la base por la altura.', m: `V = \\frac{l^2 \\cdot h}{3} = \\frac{${l}^2 \\cdot ${h}}{3} = \\frac{${l * l * h}}{3} = ${u3(vol)}` },
        { t: 'La base es un cuadrado y las caras laterales son cuatro triángulos de base \\(l\\) y altura \\(h_{\\ell}\\):', m: `A_{base} = ${l}^2 = ${u2(Ab)} \\qquad A_{lat} = 4 \\cdot \\frac{${l} \\cdot ${dec(apL)}}{2} = ${u2(Al)}` },
        { t: 'La pirámide tiene una sola base:', m: `A_{total} = ${Ab} + ${dec(Al)} = ${u2(At)}` }
      ],
      res: `V = ${u3(vol)},\\quad A_{total} = ${u2(At)}`
    };
  }

  /* ================= 5. Cilindro (ficha: r 3–10, h 4–15) ================= */
  function cilindro(R) {
    const r = R.int(3, 10), h = R.int(4, 15);
    const s = K / Math.max(2 * r, h + 0.6 * r), Rx = r * s, Ry = Rx * 0.3, Hh = h * s, L = Lienzo();
    L.poligono([[-Rx, -Hh], [-Rx, 0], ...ptsElipse(0, 0, Rx, Ry, Math.PI, 0, 24), [Rx, -Hh]], { relleno: '#e6e6e6', trazo: 'none' });
    L.linea(-Rx, -Hh, -Rx, 0, { grosor: 1.6 }).linea(Rx, -Hh, Rx, 0, { grosor: 1.6 });
    arcoElipse(L, 0, 0, Rx, Ry, 0, Math.PI);
    arcoElipse(L, 0, 0, Rx, Ry, Math.PI, 2 * Math.PI, { discontinua: true, grosor: 1 });
    L.poligono(ptsElipse(0, -Hh, Rx, Ry), { relleno: '#f5f5f5' });
    L.punto(0, -Hh, 2).linea(0, -Hh, Rx, -Hh, { grosor: 1.2 }).texto(Rx / 2, -Hh - 5, `r = ${medida(r)}`, { tam: 12 });
    L.cota([Rx, 0], [Rx, -Hh], `h = ${medida(h)}`, { lado: -1, d: 12 });
    const kV = r * r * h, kB = r * r, kL = 2 * r * h, kT = 2 * kB + kL;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Cilindro'), '', NOTA_PI),
      pasos: [
        { t: 'Volumen: área de la base (un círculo) por la altura.', m: `V = \\pi r^2 h = \\pi \\cdot ${r}^2 \\cdot ${h} = ${kpi(kV)} \\approx 3{,}14 \\cdot ${kV} = ${u3(aprox(kV))}` },
        { t: 'Cada base es un círculo y la superficie lateral, desarrollada, es un rectángulo de lados \\(2\\pi r\\) y \\(h\\):', m: `A_{base} = \\pi \\cdot ${r}^2 = ${kpi(kB)} \\qquad A_{lat} = 2\\pi \\cdot ${r} \\cdot ${h} = ${kpi(kL)}` },
        { t: 'El cilindro tiene dos bases:', m: `A_{total} = 2 \\cdot ${kpi(kB)} + ${kpi(kL)} = ${kpi(kT)} \\approx 3{,}14 \\cdot ${kT} = ${u2(aprox(kT))}` }
      ],
      res: `V \\approx ${u3(aprox(kV))},\\quad A_{total} \\approx ${u2(aprox(kT))}`
    };
  }

  /* ================= 6. Cono (ficha: r 3–10, h 4–15; generatriz como dato) ================= */
  function cono(R) {
    let r, h; do { r = R.int(3, 10); h = R.int(4, 15); } while ((r * h) % 3 !== 0);    // volumen: k·π con k entero
    const g = rd(Math.sqrt(r * r + h * h), 1);
    const s = K / Math.max(2 * r, h + 0.3 * r), Rx = r * s, Ry = Rx * 0.3, Hh = h * s, L = Lienzo();
    L.poligono([[0, -Hh], [-Rx, 0], ...ptsElipse(0, 0, Rx, Ry, Math.PI, 0, 24), [Rx, 0]], { relleno: '#ececec', trazo: 'none' });
    L.linea(0, -Hh, -Rx, 0, { grosor: 1.6 }).linea(0, -Hh, Rx, 0, { grosor: 1.6 });
    arcoElipse(L, 0, 0, Rx, Ry, 0, Math.PI);
    arcoElipse(L, 0, 0, Rx, Ry, Math.PI, 2 * Math.PI, { discontinua: true, grosor: 1 });
    L.linea(0, -Hh, 0, 0, { discontinua: true, grosor: 1.1 }).anguloRecto([0, 0], [1, 0], [0, -1], 5).punto(0, 0, 2).linea(0, 0, Rx, 0, { grosor: 1.2 });
    L.texto(Rx / 2, 14 + Ry * 0.2, `r = ${medida(r)}`, { tam: 12 });
    L.rotulo(-2, -Hh * 0.55, -1, 0, `h = ${medida(h)}`, 12, 4);
    const lx = -Rx, ly = Hh, l = Math.hypot(lx, ly);
    L.rotulo(Rx / 2, -Hh / 2, ly / l, lx / l * -1, `g = ${medida(g)}`, 12, 6);
    const kV = r * r * h / 3, kB = r * r, kL = rd(r * g, 1), kT = rd(kB + kL, 1);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Cono'), '', NOTA_PI),
      pasos: [
        { t: 'Volumen: un tercio del área de la base por la altura.', m: `V = \\frac{\\pi r^2 h}{3} = \\frac{\\pi \\cdot ${r}^2 \\cdot ${h}}{3} = \\frac{${r * r * h}\\pi}{3} = ${kpi(kV)} \\approx 3{,}14 \\cdot ${kV} = ${u3(aprox(kV))}` },
        { t: 'La base es un círculo; el área lateral es \\(\\pi r g\\), con \\(g\\) la generatriz:', m: `A_{base} = \\pi \\cdot ${r}^2 = ${kpi(kB)} \\qquad A_{lat} = \\pi \\cdot ${r} \\cdot ${dec(g)} = ${kpi(kL)}` },
        { t: 'El cono tiene una sola base:', m: `A_{total} = ${kpi(kB)} + ${kpi(kL)} = ${kpi(kT)} \\approx 3{,}14 \\cdot ${dec(kT)} = ${u2(aprox(kT))}` }
      ],
      res: `V \\approx ${u3(aprox(kV))},\\quad A_{total} \\approx ${u2(aprox(kT))}`
    };
  }

  /* ================= 7. Esfera (ficha: radio múltiplo de 3, de 3 a 15) ================= */
  function esfera(R) {
    const r = R.pick([3, 6, 9, 12, 15]), u = R.pick(['cm', 'cm', 'dm', 'm']), conDiam = R.rand() < 0.35;
    const Rr = K / 2, L = Lienzo();
    L.circulo(0, 0, Rr, { relleno: '#f0f0f0' });
    arcoElipse(L, 0, 0, Rr, Rr * 0.28, 0, Math.PI, { grosor: 1 });
    arcoElipse(L, 0, 0, Rr, Rr * 0.28, Math.PI, 2 * Math.PI, { discontinua: true, grosor: 0.9 });
    if (conDiam) L.punto(0, 0, 2).linea(-Rr, 0, Rr, 0, { grosor: 1.3 }).texto(0, -6, `d = ${medida(2 * r, u)}`, { tam: 12 });
    else L.punto(0, 0, 2).linea(0, 0, Rr, 0, { grosor: 1.3 }).texto(Rr / 2, -6, `r = ${medida(r, u)}`, { tam: 12 });
    const kV = 4 * r * r * r / 3, kA = 4 * r * r;
    const pasos = [];
    if (conDiam) pasos.push({ t: 'El radio es la mitad del diámetro:', m: `r = \\frac{${2 * r}}{2} = ${u1(r, u)}` });
    pasos.push(
      { t: 'Volumen de la esfera:', m: `V = \\frac{4}{3}\\pi r^3 = \\frac{4 \\cdot ${r}^3}{3}\\pi = \\frac{${4 * r * r * r}}{3}\\pi = ${kpi(kV)} \\approx 3{,}14 \\cdot ${kV} = ${u3(aprox(kV), u)}` },
      { t: 'La esfera no tiene bases ni cara lateral: su superficie es cuatro veces el área de un círculo máximo.', m: `A = 4\\pi r^2 = 4 \\cdot ${r}^2 \\cdot \\pi = ${kpi(kA)} \\approx 3{,}14 \\cdot ${kA} = ${u2(aprox(kA), u)}` });
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Esfera'), '', NOTA_PI), pasos,
      res: `V \\approx ${u3(aprox(kV), u)},\\quad A \\approx ${u2(aprox(kA), u)}`
    };
  }

  const VA = ['Calcula el volumen y el área total del siguiente cuerpo:', 'Calcula el volumen y el área total de los siguientes cuerpos:'];
  const tipo = (id, nombre, generar, peso = 1, enunciado = VA, columnas = 2) => ({ id, nombre, peso, columnas, enunciado, generar });

  registrarFicha({
    id: 'pend3-geometria',
    titulo: 'Geometría',
    detalle: '3.º ESO',
    grupo: 'Recuperación de 3.º ESO',
    enlace: '../pendientes/tercero/geometria-3.html',
    ejercicios: [
      tipo('sombras', 'Semejanza: el problema de las sombras', sombras, 1, ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:']),
      tipo('diagonal', 'Diagonal del ortoedro (Pitágoras en el espacio)', diagonal, 1, ['Calcula la diagonal de la base, d, y la diagonal del ortoedro, D:', 'Calcula, en cada ortoedro, la diagonal de la base, d, y la diagonal del ortoedro, D:']),
      tipo('prisma', 'Prisma: volumen y área total', prisma),
      tipo('piramide', 'Pirámide: volumen y área total', piramide, 1.25),
      tipo('cilindro', 'Cilindro: volumen y área total', cilindro),
      tipo('cono', 'Cono: volumen y área total', cono, 1.25),
      tipo('esfera', 'Esfera: volumen y superficie', esfera, 1, ['Calcula el volumen y la superficie de la esfera:', 'Calcula el volumen y la superficie de cada esfera:'])
    ]
  });
})();
