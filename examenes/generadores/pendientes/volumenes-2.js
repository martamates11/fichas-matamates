/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Cuerpos geométricos y volúmenes (pendientes de 2.º ESO).
   Mismos tipos y rangos que la ficha pendientes/segundo/volumenes-2.html, con datos
   pensados para hacer el examen sin calculadora:
   · Clasificar cuerpos: en la ficha se arrastran nombres; en papel se escribe el nombre y la clase.
   · Pirámide y cono: la apotema lateral h_ℓ y la generatriz g son enteras o con medio decimal
     (ternas pitagóricas), y el volumen (1/3 de algo) sale entero. Para tener variedad se admite
     también l = 5, 7, 9 (con h_ℓ = 6,5; 12,5; 7,5) y la unidad cm, dm o m.
   · Prisma, cilindro y esfera: rangos de la ficha (la esfera, con radio múltiplo de 3 para que
     el 4/3 se simplifique). Con π se usa π ≈ 3,14 y el resultado se da también en función de π.
   Los cuerpos se dibujan en perspectiva caballera sencilla (prisma, pirámide con medidas)
   o en proyección con giro suave (clasificación), con las aristas ocultas discontinuas. */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { dec, decTxt, medida, Lienzo, rd } = pend;

  const K = 120;                                   // px de modelo para la dimensión mayor
  const u1 = (x, u = 'cm') => `${dec(x)}\\text{ ${u}}`;
  const u2 = (x, u = 'cm') => `${dec(x)}\\text{ ${u}}^2`;
  const u3 = (x, u = 'cm') => `${dec(x)}\\text{ ${u}}^3`;
  const figura = (svg, texto = '', nota = '') =>
    `<div class="pend-col">${texto ? `<span class="pend-texto">${texto}</span>` : ''}${svg}${nota ? `<span class="pend-nota">${nota}</span>` : ''}</div>`;
  const NOTA_PI = 'Usa π ≈ 3,14';
  const kpi = k => `${dec(k)}\\pi`;
  const aprox = k => rd(3.14 * k, 2);
  const UNIDADES = ['cm', 'cm', 'dm', 'm'];

  /* ---------- Elipses ---------- */
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
  const hl = '<tspan font-style="italic">h</tspan><tspan dy="3" font-size="9">ℓ</tspan><tspan dy="-3">';

  /* ---------- Poliedros convexos con aristas ocultas ----------
     Vértices 3D (x derecha, y arriba, z hacia el fondo) y caras (listas de índices).
     La vista da la proyección y el vector w (de quien mira hacia el fondo):
     una cara se ve si su normal exterior apunta hacia el observador (n·w < 0). */
  const vistaCab = (k = 0.5, ang = Math.PI / 6) => ({
    proj: ([x, y, z]) => [x + k * z * Math.cos(ang), -(y + k * z * Math.sin(ang))],
    w: [-k * Math.cos(ang), -k * Math.sin(ang), 1]
  });
  const vistaOrto = (yaw = Math.PI / 6, pit = 0.4) => ({
    proj: ([x, y, z]) => { const x1 = x * Math.cos(yaw) - z * Math.sin(yaw), z1 = x * Math.sin(yaw) + z * Math.cos(yaw); return [x1, -(y * Math.cos(pit) + z1 * Math.sin(pit))]; },
    w: [Math.cos(pit) * Math.sin(yaw), -Math.sin(pit), Math.cos(pit) * Math.cos(yaw)]
  });
  const rest = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const media = pts => pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length, s[2] + p[2] / pts.length], [0, 0, 0]);
  const gris = v => { const h = Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); return `#${h}${h}${h}`; };

  /* Calcula la proyección a escala 1 y devuelve la caja (para elegir escala y colocar) */
  function cajaCuerpo(V, vista) {
    const Q = V.map(vista.proj);
    const xs = Q.map(q => q[0]), ys = Q.map(q => q[1]);
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  }
  /* Dibuja el poliedro. s = escala; (ox, oy) = dónde cae el punto de proyección (0,0,0).
     Devuelve los vértices proyectados. */
  function dibujaPoliedro(L, V, caras, vista, s, ox, oy) {
    const Q = V.map(v => { const q = vista.proj(v); return [ox + s * q[0], oy + s * q[1]]; });
    const c = media(V), luz = [-0.4, 0.8, -0.5];
    const aristas = {};
    const frente = caras.map(f => {
      let n = cruz(rest(V[f[1]], V[f[0]]), rest(V[f[2]], V[f[0]]));
      if (punto(n, rest(media(f.map(i => V[i])), c)) < 0) n = n.map(t => -t);
      const ln = Math.hypot(...n), vis = punto(n, vista.w) < -1e-9 * ln;
      f.forEach((a, i) => { const b = f[(i + 1) % f.length], key = Math.min(a, b) + '-' + Math.max(a, b); aristas[key] = aristas[key] || vis; });
      return { vis, tono: 232 + 22 * (punto(n, luz) / ln) };
    });
    caras.forEach((f, i) => { if (frente[i].vis) L.poligono(f.map(j => Q[j]), { relleno: gris(frente[i].tono), grosor: 1.6 }); });
    Object.keys(aristas).forEach(k => {
      if (aristas[k]) return;
      const [a, b] = k.split('-').map(Number);
      L.linea(Q[a][0], Q[a][1], Q[b][0], Q[b][1], { discontinua: true, grosor: 1 });
    });
    return Q;
  }
  /* Coloca el cuerpo con la base apoyada en y = 0 y centrado en cx; escala para que la dimensión mayor sea K */
  function poliedroAjustado(L, V, caras, vista, tam, cx) {
    const b = cajaCuerpo(V, vista), s = tam / Math.max(b.x1 - b.x0, b.y1 - b.y0);
    return dibujaPoliedro(L, V, caras, vista, s, cx - s * (b.x0 + b.x1) / 2, -s * b.y1);
  }

  /* Constructores de cuerpos (medidas relativas) */
  const prismaGen = (base, h, d = [0, 0]) => {
    const n = base.length, V = [...base.map(([x, z]) => [x, 0, z]), ...base.map(([x, z]) => [x + d[0], h, z + d[1]])];
    const caras = [base.map((_, i) => i), base.map((_, i) => n + i)];
    for (let i = 0; i < n; i++) caras.push([i, (i + 1) % n, n + (i + 1) % n, n + i]);
    return { V, caras };
  };
  const piramideGen = (base, apice) => {
    const n = base.length, V = [...base.map(([x, z]) => [x, 0, z]), apice];
    const caras = [base.map((_, i) => i)];
    for (let i = 0; i < n; i++) caras.push([i, (i + 1) % n, n]);
    return { V, caras };
  };
  const poligonoReg = (n, r = 1, fase = Math.PI / 2) => Array.from({ length: n }, (_, i) => [r * Math.cos(fase + 2 * Math.PI * i / n), r * Math.sin(fase + 2 * Math.PI * i / n)]);

  /* ================= 1. Clasificar cuerpos ================= */
  /* Cada cuerpo se dibuja con altura/ancho que quepan en una caja de tam px */
  const CUERPOS = {
    tetraedro: { nombre: 'Tetraedro', clase: 'poliedro regular', det: 'cuatro caras que son triángulos equiláteros iguales', dibujo: (L, cx, t) => { const g = piramideGen(poligonoReg(3, 1, Math.PI / 2 + 0.3), [0, Math.SQRT2, 0]); poliedroAjustado(L, g.V, g.caras, vistaOrto(0.5, 0.4), t, cx); } },
    cubo: { nombre: 'Cubo', clase: 'poliedro regular', det: 'seis caras que son cuadrados iguales', dibujo: (L, cx, t) => { const g = prismaGen([[-1, -1], [1, -1], [1, 1], [-1, 1]], 2); poliedroAjustado(L, g.V, g.caras, vistaOrto(0.5, 0.4), t, cx); } },
    prismaReg: { nombre: 'Prisma recto regular (hexagonal)', clase: 'prisma', det: 'dos bases que son hexágonos regulares iguales y caras laterales rectangulares', dibujo: (L, cx, t) => { const g = prismaGen(poligonoReg(6, 1, 0), 1.7); poliedroAjustado(L, g.V, g.caras, vistaOrto(0.45, 0.4), t, cx); } },
    prismaIrr: { nombre: 'Prisma recto irregular', clase: 'prisma', det: 'dos bases iguales que son polígonos irregulares y caras laterales rectangulares', dibujo: (L, cx, t) => { const g = prismaGen([[-1, -0.6], [0.2, -1], [1.1, -0.2], [0.7, 0.9], [-0.8, 0.7]], 1.5); poliedroAjustado(L, g.V, g.caras, vistaOrto(0.45, 0.4), t, cx); } },
    prismaObl: { nombre: 'Prisma oblicuo', clase: 'prisma', det: 'dos bases iguales y caras laterales que son paralelogramos inclinados', dibujo: (L, cx, t) => { const g = prismaGen([[-1, -0.7], [1, -0.7], [1, 0.7], [-1, 0.7]], 1.5, [1.1, 0]); poliedroAjustado(L, g.V, g.caras, vistaOrto(0.35, 0.4), t, cx); } },
    piramideReg: { nombre: 'Pirámide recta regular (pentagonal)', clase: 'pirámide', det: 'una base que es un pentágono regular y caras laterales triangulares que se juntan en un vértice', dibujo: (L, cx, t) => { const g = piramideGen(poligonoReg(5, 1, Math.PI / 2 + 0.3), [0, 1.8, 0]); poliedroAjustado(L, g.V, g.caras, vistaOrto(0.45, 0.4), t, cx); } },
    piramideIrr: { nombre: 'Pirámide recta irregular', clase: 'pirámide', det: 'una base que es un polígono irregular y caras laterales triangulares que se juntan en un vértice', dibujo: (L, cx, t) => { const g = piramideGen([[-1, -0.7], [1.1, -0.9], [0.9, 0.8], [-0.9, 0.6]], [0.05, 1.7, 0]); poliedroAjustado(L, g.V, g.caras, vistaOrto(0.45, 0.4), t, cx); } },
    cilindro: { nombre: 'Cilindro', clase: 'cuerpo de revolución', det: 'dos bases circulares y una superficie lateral curva', dibujo: (L, cx, t) => dibujaCilindro(L, cx, t) },
    cono: { nombre: 'Cono', clase: 'cuerpo de revolución', det: 'una base circular y una superficie lateral curva que termina en un vértice', dibujo: (L, cx, t) => dibujaCono(L, cx, t) },
    esfera: { nombre: 'Esfera', clase: 'cuerpo de revolución', det: 'una superficie curva cuyos puntos están todos a la misma distancia del centro', dibujo: (L, cx, t) => dibujaEsfera(L, cx, t) }
  };
  function dibujaCilindro(L, cx, t) {
    const Rx = t * 0.30, Ry = Rx * 0.32, Hh = t * 0.75 - Ry;
    L.poligono([[cx - Rx, -Hh - Ry], [cx - Rx, -Ry], ...ptsElipse(cx, -Ry, Rx, Ry, Math.PI, 0, 24), [cx + Rx, -Hh - Ry]], { relleno: '#e6e6e6', trazo: 'none' });
    L.linea(cx - Rx, -Hh - Ry, cx - Rx, -Ry, { grosor: 1.6 }).linea(cx + Rx, -Hh - Ry, cx + Rx, -Ry, { grosor: 1.6 });
    arcoElipse(L, cx, -Ry, Rx, Ry, 0, Math.PI);
    arcoElipse(L, cx, -Ry, Rx, Ry, Math.PI, 2 * Math.PI, { discontinua: true, grosor: 1 });
    L.poligono(ptsElipse(cx, -Hh - Ry, Rx, Ry), { relleno: '#f5f5f5' });
  }
  function dibujaCono(L, cx, t) {
    const Rx = t * 0.36, Ry = Rx * 0.32, Hh = t * 0.9 - Ry;
    L.poligono([[cx, -Hh - Ry], [cx - Rx, -Ry], ...ptsElipse(cx, -Ry, Rx, Ry, Math.PI, 0, 24), [cx + Rx, -Ry]], { relleno: '#ececec', trazo: 'none' });
    L.linea(cx, -Hh - Ry, cx - Rx, -Ry, { grosor: 1.6 }).linea(cx, -Hh - Ry, cx + Rx, -Ry, { grosor: 1.6 });
    arcoElipse(L, cx, -Ry, Rx, Ry, 0, Math.PI);
    arcoElipse(L, cx, -Ry, Rx, Ry, Math.PI, 2 * Math.PI, { discontinua: true, grosor: 1 });
  }
  function dibujaEsfera(L, cx, t) {
    const r = t * 0.4;
    L.circulo(cx, -r, r, { relleno: '#f0f0f0' });
    arcoElipse(L, cx, -r, r, r * 0.3, 0, Math.PI, { grosor: 1 });
    arcoElipse(L, cx, -r, r, r * 0.3, Math.PI, 2 * Math.PI, { discontinua: true, grosor: 0.9 });
  }

  function clasificar(R) {
    /* Tres cuerpos distintos, al menos de dos clases diferentes */
    const ids = Object.keys(CUERPOS);
    let tres;
    do { tres = R.shuffle(ids).slice(0, 3); } while (new Set(tres.map(i => CUERPOS[i].clase)).size < 2);
    const T = 104, SEP = 130, L = Lienzo(), letras = ['A', 'B', 'C'];
    tres.forEach((id, i) => {
      CUERPOS[id].dibujo(L, i * SEP, T);
      L.texto(i * SEP, 20, letras[i], { tam: 14, peso: 700 });
    });
    const lineas = letras.map(l => `<span class="pend-texto"><b>${l}</b>: ………………………………… · ………………………………</span>`).join('');
    const pasos = tres.map((id, i) => {
      const c = CUERPOS[id];
      const art = /^Pir/.test(c.nombre) ? 'una' : 'un', artC = c.clase === 'pirámide' ? 'una' : 'un';
      return { t: `<b>${letras[i]}.</b> Tiene ${c.det}: es ${art} ${c.nombre.toLowerCase()}, ${artC} ${c.clase}.` };
    });
    return {
      html: true,
      enun: `<div class="pend-col">${L.cerrar('pend-fig', 'Tres cuerpos geométricos')}<span class="pend-nota">Escribe, de cada uno, su nombre y su clase.</span>${lineas}</div>`,
      pasos,
      resHtml: tres.map((id, i) => `<b>${letras[i]}</b>: ${CUERPOS[id].nombre.toLowerCase()} · ${CUERPOS[id].clase}`).join('<br>'),
      res: '\\text{véase abajo}'
    };
  }

  /* ================= Ortoedro / prisma (proyección oblicua) ================= */
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

  /* ================= 2. Prisma (ficha: a, b, h de 4 a 12) ================= */
  function prisma(R) {
    const a = R.int(4, 12), b = R.int(4, 12), h = R.int(4, 12);
    const L = Lienzo(), { F, T } = ortoedro(L, a, b, h, escalaCaja(a, b, h));
    L.cota(F[0], F[1], `a = ${medida(a)}`, { lado: -1, d: 12 });
    L.rotulo((F[1][0] + T[1][0]) / 2, (F[1][1] + T[1][1]) / 2, 0.6, 0.8, `b = ${medida(b)}`, 12, 6);
    L.cota(F[3], F[0], `h = ${medida(h)}`, { lado: -1, d: 12 });
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

  /* ================= 3. Pirámide de base cuadrada (ficha: l 4–12, h 4–15; h_ℓ como dato) ================= */
  /* [l, h, h_ℓ]: (l/2)² + h² = h_ℓ², y l²·h divisible entre 3 */
  const PIRAMIDES = [[6, 4, 5], [8, 3, 5], [10, 12, 13], [12, 8, 10], [5, 6, 6.5], [7, 12, 12.5], [9, 6, 7.5]];
  function piramide(R) {
    const [l, h, apL] = R.pick(PIRAMIDES), u = R.pick(UNIDADES);
    const vista = vistaCab(0.5, Math.PI / 5);
    const g = piramideGen([[-l / 2, -l / 2], [l / 2, -l / 2], [l / 2, l / 2], [-l / 2, l / 2]], [0, h, 0]);
    const b = cajaCuerpo(g.V, vista), s = 1.15 * K / Math.max(b.x1 - b.x0, b.y1 - b.y0);
    const L = Lienzo(), Q = dibujaPoliedro(L, g.V, g.caras, vista, s, 0, 0);
    const base = vista.proj([0, 0, 0]), C = [s * base[0], s * base[1]], Ap = Q[4];
    const M = [(Q[0][0] + Q[1][0]) / 2, (Q[0][1] + Q[1][1]) / 2];
    L.linea(Ap[0], Ap[1], C[0], C[1], { discontinua: true, grosor: 1.2 }).punto(C[0], C[1], 2);
    L.linea(Ap[0], Ap[1], M[0], M[1], { grosor: 1.3 });
    L.cota(Q[0], Q[1], `l = ${medida(l, u)}`, { lado: -1, d: 12 });
    /* Rótulos fuera de la figura, unidos con un trazo fino al segmento que miden */
    const xMin = Math.min(...Q.map(q => q[0])), xMax = Math.max(...Q.map(q => q[0]));
    const mh = [(Ap[0] + C[0]) / 2, (Ap[1] + C[1]) / 2], ml = [(Ap[0] + M[0]) / 2, (Ap[1] + M[1]) / 2];
    L.linea(mh[0], mh[1], xMax + 10, mh[1], { trazo: '#555', grosor: 0.7 }).punto(mh[0], mh[1], 1.6)
      .texto(xMax + 13, mh[1] + 4, `h = ${medida(h, u)}`, { tam: 12, ancla: 'start' });
    L.linea(ml[0], ml[1], xMin - 10, ml[1], { trazo: '#555', grosor: 0.7 }).punto(ml[0], ml[1], 1.6)
      .texto(xMin - 13, ml[1] + 4, `${hl} = ${medida(apL, u)}</tspan>`, { tam: 12, ancla: 'end' });
    const vol = l * l * h / 3, Ab = l * l, Al = 2 * l * apL, At = Ab + Al;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Pirámide de base cuadrada')),
      pasos: [
        { t: 'Volumen: un tercio del área de la base por la altura.', m: `V = \\frac{l^2 \\cdot h}{3} = \\frac{${l}^2 \\cdot ${h}}{3} = \\frac{${dec(l * l * h)}}{3} = ${u3(vol, u)}` },
        { t: 'La base es un cuadrado y las caras laterales son cuatro triángulos de base \\(l\\) y altura \\(h_{\\ell}\\):', m: `A_{base} = ${l}^2 = ${u2(Ab, u)} \\qquad A_{lat} = 4 \\cdot \\frac{${l} \\cdot ${dec(apL)}}{2} = ${u2(Al, u)}` },
        { t: 'La pirámide tiene una sola base:', m: `A_{total} = ${Ab} + ${dec(Al)} = ${u2(At, u)}` }
      ],
      res: `V = ${u3(vol, u)},\\quad A_{total} = ${u2(At, u)}`
    };
  }

  /* ================= 4. Cilindro (ficha: r 3–10, h 4–15) ================= */
  function cilindro(R) {
    const r = R.int(3, 10), h = R.int(4, 15);
    const s = K / Math.max(2 * r, h + 0.6 * r), Rx = r * s, Ry = Rx * 0.3, Hh = h * s, L = Lienzo();
    L.poligono([[-Rx, -Hh], [-Rx, 0], ...ptsElipse(0, 0, Rx, Ry, Math.PI, 0, 24), [Rx, -Hh]], { relleno: '#e6e6e6', trazo: 'none' });
    L.linea(-Rx, -Hh, -Rx, 0, { grosor: 1.6 }).linea(Rx, -Hh, Rx, 0, { grosor: 1.6 });
    arcoElipse(L, 0, 0, Rx, Ry, 0, Math.PI);
    arcoElipse(L, 0, 0, Rx, Ry, Math.PI, 2 * Math.PI, { discontinua: true, grosor: 1 });
    L.poligono(ptsElipse(0, -Hh, Rx, Ry), { relleno: '#f5f5f5' });
    L.punto(0, -Hh, 2).linea(0, -Hh, Rx, -Hh, { grosor: 1.2 }).texto(Rx / 2, -Hh - Ry - 5, `r = ${medida(r)}`, { tam: 12 });
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

  /* ================= 5. Cono (ficha: r 3–10, h 4–15; generatriz como dato) ================= */
  /* [r, h, g] con r² + h² = g² y r²·h divisible entre 3 */
  const CONOS = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 5, 13], [12, 9, 15]];
  function cono(R) {
    const [r, h, g] = R.pick(CONOS), u = R.pick(UNIDADES);
    const s = K / Math.max(2 * r, h + 0.3 * r), Rx = r * s, Ry = Rx * 0.3, Hh = h * s, L = Lienzo();
    L.poligono([[0, -Hh], [-Rx, 0], ...ptsElipse(0, 0, Rx, Ry, Math.PI, 0, 24), [Rx, 0]], { relleno: '#ececec', trazo: 'none' });
    L.linea(0, -Hh, -Rx, 0, { grosor: 1.6 }).linea(0, -Hh, Rx, 0, { grosor: 1.6 });
    arcoElipse(L, 0, 0, Rx, Ry, 0, Math.PI);
    arcoElipse(L, 0, 0, Rx, Ry, Math.PI, 2 * Math.PI, { discontinua: true, grosor: 1 });
    L.linea(0, -Hh, 0, 0, { discontinua: true, grosor: 1.1 }).anguloRecto([0, 0], [1, 0], [0, -1], 5).punto(0, 0, 2).linea(0, 0, Rx, 0, { grosor: 1.2 });
    L.texto(Rx / 2, Ry + 14, `r = ${medida(r, u)}`, { tam: 12 });
    L.cota([-Rx - 8, 0], [-Rx - 8, -Hh], `h = ${medida(h, u)}`, { lado: 1, d: 6 });
    const lx = -Rx, ly = Hh, l = Math.hypot(lx, ly);
    L.rotulo(Rx / 2, -Hh / 2, ly / l, lx / l, `g = ${medida(g, u)}`, 12, 6);
    const kV = r * r * h / 3, kB = r * r, kL = r * g, kT = kB + kL;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Cono'), '', NOTA_PI),
      pasos: [
        { t: 'Volumen: un tercio del área de la base por la altura.', m: `V = \\frac{\\pi r^2 h}{3} = \\frac{\\pi \\cdot ${r}^2 \\cdot ${h}}{3} = \\frac{${r * r * h}\\pi}{3} = ${kpi(kV)} \\approx 3{,}14 \\cdot ${kV} = ${u3(aprox(kV), u)}` },
        { t: 'La base es un círculo; el área lateral es \\(\\pi r g\\), con \\(g\\) la generatriz:', m: `A_{base} = \\pi \\cdot ${r}^2 = ${kpi(kB)} \\qquad A_{lat} = \\pi \\cdot ${r} \\cdot ${g} = ${kpi(kL)}` },
        { t: 'El cono tiene una sola base:', m: `A_{total} = ${kpi(kB)} + ${kpi(kL)} = ${kpi(kT)} \\approx 3{,}14 \\cdot ${kT} = ${u2(aprox(kT), u)}` }
      ],
      res: `V \\approx ${u3(aprox(kV), u)},\\quad A_{total} \\approx ${u2(aprox(kT), u)}`
    };
  }

  /* ================= 6. Esfera (ficha: radio de 3 a 15; aquí múltiplo de 3) ================= */
  function esfera(R) {
    const r = R.pick([3, 6, 9, 12, 15]), u = R.pick(UNIDADES), conDiam = R.rand() < 0.35;
    const Rr = K / 2, L = Lienzo();
    L.circulo(0, 0, Rr, { relleno: '#f0f0f0' });
    arcoElipse(L, 0, 0, Rr, Rr * 0.28, 0, Math.PI, { grosor: 1 });
    arcoElipse(L, 0, 0, Rr, Rr * 0.28, Math.PI, 2 * Math.PI, { discontinua: true, grosor: 0.9 });
    if (conDiam) L.punto(0, 0, 2).linea(-Rr, 0, Rr, 0, { grosor: 1.3 }).texto(0, -Rr * 0.28 - 7, `d = ${medida(2 * r, u)}`, { tam: 12 });
    else L.punto(0, 0, 2).linea(0, 0, Rr, 0, { grosor: 1.3 }).texto(Rr / 2, -Rr * 0.28 - 7, `r = ${medida(r, u)}`, { tam: 12 });
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
    id: 'pend2-volumenes',
    titulo: 'Cuerpos geométricos y volúmenes',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/volumenes-2.html',
    ejercicios: [
      tipo('clasificar', 'Reconocer y clasificar cuerpos geométricos', clasificar, 1, ['Escribe el nombre de cada cuerpo y su clase (poliedro regular, prisma, pirámide o cuerpo de revolución):', 'Escribe el nombre de cada cuerpo y su clase (poliedro regular, prisma, pirámide o cuerpo de revolución):'], 1),
      tipo('prisma', 'Prisma: volumen y área total', prisma),
      tipo('piramide', 'Pirámide: volumen y área total', piramide, 1.25),
      tipo('cilindro', 'Cilindro: volumen y área total', cilindro),
      tipo('cono', 'Cono: volumen y área total', cono, 1.25),
      tipo('esfera', 'Esfera: volumen y superficie', esfera, 1, ['Calcula el volumen y la superficie de la esfera:', 'Calcula el volumen y la superficie de cada esfera:'])
    ]
  });
})();
