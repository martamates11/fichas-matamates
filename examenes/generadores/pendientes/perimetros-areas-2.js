/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Perímetros y áreas (pendientes de 2.º ESO).
   Figuras y rangos de la ficha pendientes/segundo/perimetros-areas-2.html (rectángulo, triángulo
   rectángulo, paralelogramo, rombo, trapecio, pentágono regular, círculo y áreas compuestas),
   con cambios pensados para hacer el examen sin calculadora:
   · triángulo rectángulo y rombo: la hipotenusa y el lado salen de ternas pitagóricas;
   · trapecio: los lados oblicuos son enteros (altura y desplazamientos de ternas pitagóricas);
     
   · rombo de la figura compuesta: se exige D > d (en la ficha podía salir al revés);
   · pentágono: la apotema se da con un decimal (en la ficha, con dos);
   · π ≈ 3,14 (la ficha usa 3,14159) y se indica en el enunciado;
   · compuesta «pentágono con semicírculos»: como en la ficha, cinco semicírculos hacia fuera con
     diámetro igual al lado (no se solapan: junto a cada vértice ocupan 90° + 90° de los 252° exteriores).
     l par (6 a 14) para que el radio sea entero.
   · trapecio: se exige B ≤ 2,9·h para que el rótulo de la altura no choque con los lados.
   En las compuestas, lo que no cabe rotulado dentro de la figura (radio del semicírculo, apotema)
   va como letra o trazo en la figura y su valor en la nota inferior. */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { dec, medida, Lienzo, rd } = pend;

  const K = 120;                         // px de modelo para la dimensión mayor de la figura
  const cm = x => `${dec(x)}\\text{ cm}`;
  const cm2 = x => `${dec(x)}\\text{ cm}^2`;
  const resPA = (P, A, nomP = 'P') => `${nomP} = ${cm(P)},\\quad A = ${cm2(A)}`;
  const figura = (svg, nota = '') => `<div class="pend-col">${svg}${nota ? `<span class="pend-nota">${nota}</span>` : ''}</div>`;
  const PI = 3.14, GRIS = '#555';

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
    do { b = R.int(8, 22); h = R.int(4, 14); a = R.int(h + 2, h + 12); o = Math.sqrt(a * a - h * h); } while (o > 0.65 * b || b + o > 2.6 * h);
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

  /* ---------- Trapecio (ficha: B 14–26, b ≥ 4, h 5–14; los dos lados oblicuos son dato) ---------- */
  /* Alturas y desplazamientos que dan lados oblicuos enteros (ternas pitagóricas) */
  const DESPL = { 8: [6, 15], 12: [5, 9, 16] };
  function trapecio(R) {
    let h, oL, oR, b, B;
    do {
      h = R.pick([8, 8, 12, 12, 12]);
      oL = R.pick(DESPL[h]); oR = R.pick(DESPL[h]);
      b = R.int(4, 12); B = b + oL + oR;
    } while (B > 28 || B > 2.9 * h);
    const lL = Math.hypot(h, oL), lR = Math.hypot(h, oR);
    const s = 1.25 * K / Math.max(B, h), Bw = B * s, H = h * s, OL = oL * s, OR = oR * s, L = Lienzo();
    L.poligono([[0, H], [Bw, H], [Bw - OR, 0], [OL, 0]])
      .cota([0, H], [Bw, H], medida(B), { lado: -1 })
      .cota([OL, 0], [Bw - OR, 0], medida(b), { lado: 1 });
    const lateral = (px, py, qx, qy, txt) => {
      const lx = qx - px, ly = qy - py, l = Math.hypot(lx, ly), mx = (px + qx) / 2, my = (py + qy) / 2;
      let nx = ly / l, ny = -lx / l;
      if ((mx - Bw / 2) * nx + (my - H / 2) * ny < 0) { nx = -nx; ny = -ny; }
      L.rotulo(mx, my, nx, ny, txt, 13, 6);
    };
    lateral(0, H, OL, 0, medida(lL));
    lateral(Bw, H, Bw - OR, 0, medida(lR));
    const xIzq = 0.55 * OL, xDer = Bw - 0.55 * OR;
    const opciones = [[OL, 1, xDer - OL], [OL, -1, OL - xIzq], [Bw - OR, 1, xDer - (Bw - OR)], [Bw - OR, -1, Bw - OR - xIzq]];
    const [xh, lado] = opciones.reduce((a, o) => (o[2] > a[2] ? o : a));
    L.linea(xh, 0, xh, H, { discontinua: true, grosor: 1 }).anguloRecto([xh, H], [lado, 0], [0, -1], 6)
      .rotulo(xh, H * 0.45, lado, 0, `h = ${medida(h)}`, 12, 4);
    const P = B + b + lL + lR, A = (B + b) * h / 2;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Trapecio')),
      pasos: [
        { t: 'El perímetro es la suma de los cuatro lados:', m: `P = B + b + l_1 + l_2 = ${B} + ${b} + ${lL} + ${lR} = ${cm(P)}` },
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
      .texto(rr * 0.47, -6, `r = ${medida(r)}`, { tam: 11 });
    const Lc = rd(2 * PI * r, 2), A = rd(PI * r * r, 2);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Círculo'), 'Usa π ≈ 3,14'),
      pasos: [
        { t: 'Longitud de la circunferencia (su perímetro):', m: `L = 2 \\pi r \\approx 2 \\cdot 3{,}14 \\cdot ${r} = ${cm(Lc)}` },
        { t: 'Área del círculo:', m: `A = \\pi r^2 \\approx 3{,}14 \\cdot ${r}^2 = 3{,}14 \\cdot ${r * r} = ${cm2(A)}` }
      ],
      res: resPA(Lc, A, 'L')
    };
  }

  /* ================= Áreas compuestas (ficha, ejercicio 8) ================= */
  const KC = 135;
  const arco = (cx, cy, rad, t0, t1, ux, uy, vx, vy, N = 28) => {     // puntos cx + rad·(cos t·u + sin t·v)
    const pts = [];
    for (let i = 0; i <= N; i++) { const t = t0 + (t1 - t0) * i / N; pts.push([cx + rad * (Math.cos(t) * ux + Math.sin(t) * vx), cy + rad * (Math.cos(t) * uy + Math.sin(t) * vy)]); }
    return pts;
  };
  const BLANCO = { relleno: '#fff' };
  const resA = A => `A = ${cm2(A)}`;

  /* Casa: rectángulo + triángulo (ficha: b 6–16, hR 4–10, hT 3–9) */
  function compCasa(R) {
    const b = R.int(6, 16), hR = R.int(4, 10), hT = R.int(3, 9), s = KC / Math.max(b, hR + hT);
    const B = b * s, HR = hR * s, HT = hT * s, L = Lienzo();
    L.poligono([[0, HT], [B, HT], [B, HT + HR], [0, HT + HR]])
      .poligono([[0, HT], [B, HT], [B / 2, 0]])
      .linea(B / 2, 0, B, 0, { discontinua: true, grosor: 0.7, trazo: GRIS })
      .cota([0, HT + HR], [B, HT + HR], medida(b), { lado: -1 })
      .cota([0, HT], [0, HT + HR], medida(hR), { lado: -1 })
      .cota([B, 0], [B, HT], medida(hT), { lado: 1 });
    const Ar = b * hR, At = b * hT / 2, A = Ar + At;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Casa: rectángulo y triángulo')),
      pasos: [
        { t: 'Dividimos la figura en un rectángulo y un triángulo; hay que <b>sumar</b> sus áreas.' },
        { t: 'Rectángulo:', m: `A_{\\text{rect}} = b \\cdot h = ${b} \\cdot ${hR} = ${cm2(Ar)}` },
        { t: 'Triángulo (su base es la base de la casa):', m: `A_{\\text{tri}} = \\frac{b \\cdot h}{2} = \\frac{${b} \\cdot ${hT}}{2} = ${cm2(At)}` },
        { t: 'Área total:', m: `A = ${dec(Ar)} + ${dec(At)} = ${cm2(A)}` }
      ],
      res: resA(A)
    };
  }

  /* Círculo con un triángulo recortado (ficha: r 7–14, bt 4–r, ht 3–r−1) */
  function compCirculoTri(R) {
    const r = R.int(7, 14), bt = R.int(4, r), ht = R.int(3, r - 1);
    const rr = 70, s = rr / r, L = Lienzo();
    const yT = -ht * s / 2, yB = ht * s / 2, bx = bt * s / 2;
    L.circulo(0, 0, rr).poligono([[0, yT], [bx, yB], [-bx, yB]], { ...BLANCO, grosor: 1.4 })
      .punto(0, 0, 2).linea(0, 0, rr, 0, { discontinua: true, grosor: 1 }).texto(rr + 6, 4, `r = ${medida(r)}`, { ancla: 'start', tam: 12 })
      .cota([-bx, yB], [bx, yB], medida(bt), { lado: -1, d: 9, tam: 12 })
      .linea(0, yT, -rr - 6, yT, { trazo: GRIS, grosor: 0.7 }).linea(-bx, yB, -rr - 6, yB, { trazo: GRIS, grosor: 0.7 })
      .cota([-rr - 6, yT], [-rr - 6, yB], medida(ht), { lado: -1, d: 10 });
    const Ac = rd(PI * r * r, 2), At = bt * ht / 2, A = rd(Ac - At, 2);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Círculo con un triángulo recortado'), 'Usa π ≈ 3,14. Calcula el área de la parte sombreada.'),
      pasos: [
        { t: 'A la superficie del círculo hay que <b>restarle</b> el triángulo recortado.' },
        { t: 'Círculo:', m: `A_{\\text{círc}} = \\pi r^2 \\approx 3{,}14 \\cdot ${r}^2 = 3{,}14 \\cdot ${r * r} = ${cm2(Ac)}` },
        { t: 'Triángulo:', m: `A_{\\text{tri}} = \\frac{b \\cdot h}{2} = \\frac{${bt} \\cdot ${ht}}{2} = ${cm2(At)}` },
        { t: 'Área sombreada:', m: `A = ${dec(Ac)} - ${dec(At)} = ${cm2(A)}` }
      ],
      res: resA(A)
    };
  }

  /* Rombo con un semicírculo recortado (ficha: D 10–22, d 6–14, r 2…⌊d/3⌋) */
  function compRomboSemi(R) {
    let D, d, r;
    do { D = R.int(10, 22); d = R.int(6, 14); r = R.int(2, Math.max(2, Math.floor(d / 3))); } while (D < d + 2);
    const s = K * 1.1 / D, X = D * s / 2, Y = d * s / 2, rs = r * s, L = Lienzo();
    L.poligono([[-X, 0], [0, -Y], [X, 0], [0, Y]])
      .poligono(arco(0, 0, rs, 0, Math.PI, 1, 0, 0, -1), { ...BLANCO, grosor: 1.4 })
      .punto(0, 0, 2).linea(0, 0, rs * Math.cos(0.9), -rs * Math.sin(0.9), { discontinua: true, grosor: 1 })
      .cota([-X, 0], [X, 0], `D = ${medida(D)}`, { lado: -1, d: Y + 14 })
      .cota([0, -Y], [0, Y], `d = ${medida(d)}`, { lado: 1, d: X + 14 });
    const Ar = D * d / 2, Asm = rd(PI * r * r / 2, 2), A = rd(Ar - Asm, 2);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Rombo con un semicírculo recortado'), `Usa π ≈ 3,14. El semicírculo (en blanco) tiene radio ${medida(r)}. Calcula el área de la parte sombreada.`),
      pasos: [
        { t: 'Al área del rombo hay que <b>restarle</b> el semicírculo recortado.' },
        { t: 'Rombo:', m: `A_{\\text{rombo}} = \\frac{D \\cdot d}{2} = \\frac{${D} \\cdot ${d}}{2} = ${cm2(Ar)}` },
        { t: 'Semicírculo (la mitad de un círculo):', m: `A_{\\text{semi}} = \\frac{\\pi r^2}{2} \\approx \\frac{3{,}14 \\cdot ${r}^2}{2} = \\frac{3{,}14 \\cdot ${r * r}}{2} = ${cm2(Asm)}` },
        { t: 'Área sombreada:', m: `A = ${dec(Ar)} - ${dec(Asm)} = ${cm2(A)}` }
      ],
      res: resA(A)
    };
  }

  /* Pentágono regular con un semicírculo hacia fuera sobre cada lado (ficha: l 6–14). Los semicírculos
     no se solapan; l par para que el radio sea entero. */
  function compPentaSemis(R) {
    const l = R.pick([6, 8, 10, 12, 14]), ap = rd(l / (2 * Math.tan(Math.PI / 5)), 1);
    const Rc = l / (2 * Math.sin(Math.PI / 5)), apE = l / (2 * Math.tan(Math.PI / 5));
    const V0 = [0, 1, 2, 3, 4].map(i => { const t = -Math.PI / 2 + 2 * Math.PI * i / 5; return [Rc * Math.cos(t), Rc * Math.sin(t)]; });
    const semis = (s) => [0, 1, 2, 3, 4].map(i => {
      const A = V0[i], B = V0[(i + 1) % 5], Mx = (A[0] + B[0]) / 2, My = (A[1] + B[1]) / 2, m = Math.hypot(Mx, My);
      return arco(Mx * s, My * s, l * s / 2, 0, Math.PI, (B[0] - A[0]) / l, (B[1] - A[1]) / l, Mx / m, My / m);
    });
    const ext = semis(1).flat().concat(V0), xs = ext.map(q => q[0]), ys = ext.map(q => q[1]);
    const s = KC / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    const L = Lienzo();
    semis(s).forEach(pts => L.poligono(pts, { relleno: '#f6f6f6', grosor: 1.4 }));
    const V = V0.map(([x, y]) => [x * s, y * s]), Mb = [0, apE * s];
    L.poligono(V).punto(0, 0, 2).linea(0, 0, Mb[0], Mb[1], { discontinua: true, grosor: 1 }).anguloRecto(Mb, [1, 0], [0, -1], 6)
      .texto(5, Mb[1] * 0.5 + 4, 'a', { ancla: 'start', tam: 12, cursiva: true })
      .rotulo(0, Mb[1] + l * s / 2, 0, 1, `l = ${medida(l)}`, 12, 6);
    const k = l / 2, Ap = rd(5 * l * ap / 2, 2), As1 = rd(PI * k * k / 2, 2), As = rd(5 * As1, 2), A = rd(Ap + As, 2);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Pentágono regular con un semicírculo sobre cada lado'), `Usa π ≈ 3,14. Apotema a = ${medida(ap)}. Cada semicírculo tiene por diámetro un lado del pentágono.`),
      pasos: [
        { t: 'Hay que <b>sumar</b> el área del pentágono y la de los cinco semicírculos.' },
        { t: 'Pentágono: perímetro por apotema entre dos.', m: `P = 5 \\cdot ${l} = ${l * 5},\\qquad A_{\\text{pent}} = \\frac{P \\cdot a}{2} = \\frac{${l * 5} \\cdot ${dec(ap)}}{2} = ${cm2(Ap)}` },
        { t: `El diámetro de cada semicírculo es el lado, así que su radio es \\(r = ${l} : 2 = ${k}\\) cm:`, m: `A_{\\text{semi}} = \\frac{\\pi r^2}{2} \\approx \\frac{3{,}14 \\cdot ${k}^2}{2} = \\frac{3{,}14 \\cdot ${k * k}}{2} = ${cm2(As1)}` },
        { t: 'Los cinco semicírculos:', m: `5 \\cdot ${dec(As1)} = ${cm2(As)}` },
        { t: 'Área total:', m: `A = ${dec(Ap)} + ${dec(As)} = ${cm2(A)}` }
      ],
      res: resA(A)
    };
  }

  const COMPUESTAS = [compCasa, compCirculoTri, compRomboSemi, compPentaSemis];
  const compuesta = R => R.pick(COMPUESTAS)(R);
  const unaCompuesta = f => R => f(R);

  /* ---------- Figuras variadas: cada apartado, una figura distinta ---------- */
  const FIGURAS = { rectangulo, trianguloRect, paralelogramo, rombo, trapecio, pentagono, circulo };
  const TANDAS = [['rectangulo', 'paralelogramo'], ['trianguloRect', 'rombo'], ['trapecio', 'pentagono'], ['circulo'], ['paralelogramo', 'rombo'], ['trapecio', 'trianguloRect']];
  const variada = (R, i) => FIGURAS[R.pick(TANDAS[i % TANDAS.length])](R);
  /* Compuestas: en apartados consecutivos se evita repetir el modelo */
  const compuestaVaria = (R, i) => COMPUESTAS[(i + R.int(0, 3)) % 4](R);

  const ENUN = ['Calcula el perímetro y el área de la siguiente figura:',
    'Calcula el perímetro y el área de las siguientes figuras:'];
  const ENUN_C = ['Calcula el área de la siguiente figura:', 'Calcula el área de las siguientes figuras:'];
  const tipo = (id, nombre, generar, peso = 1, enunciado = ENUN) => ({ id, nombre, peso, columnas: 2, enunciado, generar });

  registrarFicha({
    id: 'pend2-perimetros-areas',
    titulo: 'Perímetros y áreas',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/perimetros-areas-2.html',
    ejercicios: [
      tipo('variada', 'Figuras variadas (una distinta en cada apartado)', variada, 1.25),
      tipo('triangulo', 'Triángulo rectángulo (con Pitágoras)', trianguloRect, 1.25),
      tipo('rectangulo', 'Rectángulo', rectangulo),
      tipo('paralelogramo', 'Paralelogramo', paralelogramo),
      tipo('rombo', 'Rombo (con Pitágoras)', rombo, 1.25),
      tipo('trapecio', 'Trapecio', trapecio),
      tipo('pentagono', 'Pentágono regular', pentagono),
      tipo('circulo', 'Círculo', circulo, 1, ['Calcula la longitud de la circunferencia y el área del círculo:', 'Calcula la longitud de la circunferencia y el área de cada círculo:']),
      tipo('compuestas', 'Áreas compuestas (variadas)', compuestaVaria, 1.5, ENUN_C),
      tipo('compCasa', 'Áreas compuestas: rectángulo + triángulo', unaCompuesta(compCasa), 1.25, ENUN_C),
      tipo('compCirculo', 'Áreas compuestas: círculo − triángulo', unaCompuesta(compCirculoTri), 1.5, ENUN_C),
      tipo('compRombo', 'Áreas compuestas: rombo − semicírculo', unaCompuesta(compRomboSemi), 1.5, ENUN_C),
      tipo('compPenta', 'Áreas compuestas: pentágono + 5 semicírculos', unaCompuesta(compPentaSemis), 1.5, ENUN_C)
    ]
  });
})();
