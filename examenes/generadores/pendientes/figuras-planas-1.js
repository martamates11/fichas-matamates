/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Figuras planas (pendientes de 1.º ESO).
   Mismos contenidos que la ficha pendientes/primero/figuras-planas-1.html. Los ejercicios
   de arrastrar y unir se adaptan a papel: el alumno escribe el nombre de la figura, del
   elemento o del punto notable. Las figuras llevan las marcas habituales (rayitas en los
   lados iguales, cuadradito en los ángulos rectos, flechas en las bases paralelas) para
   que se puedan clasificar sin medir. Los ángulos se generan con los rangos de la ficha. */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { Lienzo } = pend;

  const K = 120;                                   // px de modelo para la dimensión mayor
  const rad = g => g * Math.PI / 180;
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
  const len = v => Math.hypot(v[0], v[1]);
  const uni = v => { const l = len(v); return [v[0] / l, v[1] / l]; };
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const figura = (svg, nota = '') => `<div class="pend-col">${svg}${nota ? `<span class="pend-nota">${nota}</span>` : ''}</div>`;
  const lista = arr => (arr.length > 1 ? arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1] : arr.join(''));

  /* ---------- Marcas sobre el lienzo ---------- */
  /* k rayitas perpendiculares en el punto medio de PQ (lados iguales) */
  function rayitas(L, P, Q, k) {
    const u = uni(sub(Q, P)), nn = [-u[1], u[0]], M = mid(P, Q);
    for (let i = 0; i < k; i++) {
      const s = (i - (k - 1) / 2) * 3.5, c = [M[0] + u[0] * s, M[1] + u[1] * s];
      L.linea(c[0] - nn[0] * 4.5, c[1] - nn[1] * 4.5, c[0] + nn[0] * 4.5, c[1] + nn[1] * 4.5, { grosor: 1.1 });
    }
  }
  /* Flecha «>» en el punto medio de PQ (lados paralelos) */
  function flechaParalela(L, P, Q) {
    const u = uni(sub(Q, P)), nn = [-u[1], u[0]], M = mid(P, Q), c = [M[0] + u[0] * 3, M[1] + u[1] * 3];
    L.linea(c[0], c[1], c[0] - u[0] * 5 + nn[0] * 4, c[1] - u[1] * 5 + nn[1] * 4, { grosor: 1.1 })
      .linea(c[0], c[1], c[0] - u[0] * 5 - nn[0] * 4, c[1] - u[1] * 5 - nn[1] * 4, { grosor: 1.1 });
  }
  /* Arco de centro C y radio r entre las direcciones (ángulos en radianes, sentido de la pantalla) */
  function arco(L, C, r, a0, a1, grosor = 0.9) {
    let d = a1 - a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const N = Math.max(4, Math.ceil(Math.abs(d) / 0.15));
    for (let i = 0; i < N; i++) {
      const t0 = a0 + d * i / N, t1 = a0 + d * (i + 1) / N;
      L.linea(C[0] + r * Math.cos(t0), C[1] + r * Math.sin(t0), C[0] + r * Math.cos(t1), C[1] + r * Math.sin(t1), { grosor });
    }
    return a0 + d / 2;
  }
  const dir = v => Math.atan2(v[1], v[0]);

  /* Triángulo con ángulos A (abajo a la izquierda), B (abajo a la derecha) y C (arriba), en grados.
     Devuelve los vértices en coordenadas de pantalla, escalados a K. */
  function trianguloDeAngulos(A, B, C, k = K) {
    const b = Math.sin(rad(B)) / Math.sin(rad(C));
    let P = [[0, 0], [1, 0], [b * Math.cos(rad(A)), -b * Math.sin(rad(A))]];
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    const s = k / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    return P.map(p => [p[0] * s, p[1] * s]);
  }
  /* Rótulo de ángulo en el vértice i (con arco). Si el ángulo es pequeño, el rótulo va fuera. */
  function rotuloAngulo(L, V, i, txt, conArco = true) {
    const P = V[i], Q = V[(i + 1) % 3], S = V[(i + 2) % 3];
    const u1 = uni(sub(Q, P)), u2 = uni(sub(S, P));
    const th = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1])));
    const bis = uni([u1[0] + u2[0], u1[1] + u2[1]]);
    if (conArco) arco(L, P, 10, dir(u1), dir(u2));
    const tam = 10.5;
    if (th < rad(32)) {                                   // ángulo muy cerrado: rótulo por fuera
      const ancla = -bis[0] > 0.35 ? 'start' : -bis[0] < -0.35 ? 'end' : 'middle';
      L.texto(P[0] - bis[0] * 7, P[1] - bis[1] * 7 + (-bis[1] > 0.35 ? tam * 0.8 : -bis[1] < -0.35 ? -1 : 3.5), txt, { tam, ancla });
    } else {
      const d = Math.min(40, Math.max(19, 12 / Math.sin(th / 2)));
      L.texto(P[0] + bis[0] * d, P[1] + bis[1] * d + 3.6, txt, { tam });
    }
  }

  /* ================= 1. Clasificación de triángulos ================= */
  const TIPOS_TRI = [
    ['equilatero', 'acutangulo'], ['isosceles', 'acutangulo'], ['isosceles', 'rectangulo'], ['isosceles', 'obtusangulo'],
    ['escaleno', 'acutangulo'], ['escaleno', 'rectangulo'], ['escaleno', 'obtusangulo']
  ];
  const NOM_LADOS = { equilatero: 'equilátero', isosceles: 'isósceles', escaleno: 'escaleno' };
  const NOM_ANG = { acutangulo: 'acutángulo', rectangulo: 'rectángulo', obtusangulo: 'obtusángulo' };
  function angulosTri(R, lados, angs) {
    if (lados === 'equilatero') return [60, 60, 60];
    if (lados === 'isosceles') {
      if (angs === 'rectangulo') return [45, 45, 90];
      let a; do { a = angs === 'acutangulo' ? 2 * R.int(15, 42) : 2 * R.int(50, 70); } while (a === 60);
      return [(180 - a) / 2, (180 - a) / 2, a];         // el ángulo desigual, arriba
    }
    for (;;) {
      let t;
      if (angs === 'rectangulo') { const a = R.int(25, 65); t = [a, 90 - a, 90]; }
      else if (angs === 'obtusangulo') { const o = R.int(100, 140), a = R.int(15, 180 - o - 15); t = [a, 180 - o - a, o]; }
      else { const a = R.int(35, 85), b = R.int(35, 85); t = [a, b, 180 - a - b]; }
      const ok = t.every(x => x >= 15 && (angs !== 'acutangulo' || (x >= 35 && x < 90))) && new Set(t).size === 3 &&
        Math.abs(t[0] - t[1]) >= 5 && Math.abs(t[1] - t[2]) >= 5 && Math.abs(t[0] - t[2]) >= 5;
      if (!ok) continue;
      /* El ángulo recto u obtuso puede ir abajo o arriba; los demás, en orden aleatorio */
      return R.shuffle(t);
    }
  }
  function genTriangulo(R) {
    const [lados, angs] = R.pick(TIPOS_TRI);
    let t = angulosTri(R, lados, angs);
    if (lados !== 'isosceles' && t[2] >= 90 && R.rand() < 0.6) t = [t[2], t[0], t[1]];   // recto/obtuso abajo a veces
    if (t[0] + t[1] < 25) t = [t[2], t[0], t[1]];
    const V = trianguloDeAngulos(t[0], t[1], t[2]);
    const L = Lienzo().poligono(V);
    const lado = i => len(sub(V[(i + 1) % 3], V[i]));      // lado i: de V[i] a V[i+1]
    const iguales = [0, 1, 2].filter(i => [0, 1, 2].some(j => j !== i && Math.abs(lado(i) - lado(j)) < 1e-6));
    iguales.forEach(i => rayitas(L, V[i], V[(i + 1) % 3], 1));
    t.forEach((g, i) => {
      if (g === 90) { const P = V[i]; L.anguloRecto(P, sub(V[(i + 1) % 3], P), sub(V[(i + 2) % 3], P), 9); }
      else rotuloAngulo(L, V, i, `${g}°`);
    });
    const tLados = { equilatero: 'tiene los tres lados iguales (los tres llevan la misma marca)', isosceles: 'tiene dos lados iguales (los dos marcados) y uno distinto', escaleno: 'tiene los tres lados distintos (ninguno lleva marca)' }[lados];
    const mayor = Math.max(...t);
    const tAng = { acutangulo: `tiene los tres ángulos agudos, menores de 90° (el mayor mide ${mayor}°)`, rectangulo: 'tiene un ángulo recto, de 90° (el cuadradito)', obtusangulo: `tiene un ángulo obtuso, mayor de 90° (${mayor}°)` }[angs];
    const res = `Triángulo ${NOM_LADOS[lados]} y ${NOM_ANG[angs]}`;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Triángulo')),
      pasos: [
        { t: `Según sus lados: ${tLados}, así que es <b>${NOM_LADOS[lados]}</b>.` },
        { t: `Según sus ángulos: ${tAng}, así que es <b>${NOM_ANG[angs]}</b>.` }
      ],
      res: `\\text{${res}}`, resHtml: res + '.'
    };
  }

  /* ================= 2. Clasificación de cuadriláteros ================= */
  const CUAD = {
    cuadrado: { nombre: 'Cuadrado', grupo: 'paralelogramo', exp: 'tiene los cuatro lados iguales y los cuatro ángulos rectos' },
    rectangulo: { nombre: 'Rectángulo', grupo: 'paralelogramo', exp: 'tiene los cuatro ángulos rectos y los lados opuestos iguales, pero los lados contiguos son distintos' },
    rombo: { nombre: 'Rombo', grupo: 'paralelogramo', exp: 'tiene los cuatro lados iguales, pero sus ángulos no son rectos (dos agudos y dos obtusos)' },
    romboide: { nombre: 'Romboide', grupo: 'paralelogramo', exp: 'tiene los lados opuestos iguales y paralelos, sin ángulos rectos ni los cuatro lados iguales' },
    trap_rect: { nombre: 'Trapecio rectángulo', grupo: 'trapecio', exp: 'tiene solo un par de lados paralelos (las bases) y dos ángulos rectos: uno de los lados no paralelos es perpendicular a las bases' },
    trap_isos: { nombre: 'Trapecio isósceles', grupo: 'trapecio', exp: 'tiene solo un par de lados paralelos (las bases) y los dos lados no paralelos iguales' },
    trap_esc: { nombre: 'Trapecio escaleno', grupo: 'trapecio', exp: 'tiene solo un par de lados paralelos (las bases), los lados no paralelos distintos y ningún ángulo recto' },
    trapezoide: { nombre: 'Trapezoide', grupo: 'trapezoide', exp: 'no tiene ningún par de lados paralelos' }
  };
  const GRUPO = { paralelogramo: 'Es un paralelogramo: tiene dos pares de lados paralelos.', trapecio: 'Es un trapecio: tiene un solo par de lados paralelos.', trapezoide: 'No es ni paralelogramo ni trapecio.' };
  function angDir(P, Q) { let a = Math.atan2(Q[1] - P[1], Q[0] - P[0]) * 180 / Math.PI; a = ((a % 180) + 180) % 180; return a; }
  const casiParalelos = (a, b) => { const d = Math.abs(a - b); return Math.min(d, 180 - d) < 12; };
  function cuadrilatero(R, tipo) {
    const L = Lienzo(); let V;
    const rectos = i => { const P = V[i]; L.anguloRecto(P, sub(V[(i + 1) % 4], P), sub(V[(i + 3) % 4], P), 8); };
    const bases = () => { flechaParalela(L, V[0], V[1]); flechaParalela(L, V[3], V[2]); };
    if (tipo === 'cuadrado') {
      const s = R.int(75, 100); V = [[0, 0], [s, 0], [s, s], [0, s]];
      L.poligono(V); [0, 1, 2, 3].forEach(i => { rectos(i); rayitas(L, V[i], V[(i + 1) % 4], 1); });
    } else if (tipo === 'rectangulo') {
      const w = R.int(105, 130), h = R.int(50, 75); V = [[0, 0], [w, 0], [w, h], [0, h]];
      L.poligono(V); [0, 1, 2, 3].forEach(i => { rectos(i); rayitas(L, V[i], V[(i + 1) % 4], i % 2 ? 2 : 1); });
    } else if (tipo === 'rombo') {
      const D = R.int(100, 130), d = R.int(55, 80); V = [[0, d / 2], [D / 2, 0], [D, d / 2], [D / 2, d]];
      L.poligono(V); [0, 1, 2, 3].forEach(i => rayitas(L, V[i], V[(i + 1) % 4], 1));
    } else if (tipo === 'romboide') {
      let b, h, o; do { b = R.int(80, 105); h = R.int(45, 65); o = R.int(25, 42); } while (Math.abs(Math.hypot(o, h) - b) < 18);
      V = [[o, 0], [o + b, 0], [b, h], [0, h]];
      L.poligono(V); [0, 1, 2, 3].forEach(i => rayitas(L, V[i], V[(i + 1) % 4], i % 2 ? 2 : 1));
    } else if (tipo === 'trap_rect') {
      const B = R.int(105, 130), b = R.int(55, 80), h = R.int(50, 70);
      V = R.rand() < 0.5 ? [[0, 0], [b, 0], [B, h], [0, h]] : [[B - b, 0], [B, 0], [B, h], [0, h]];
      L.poligono(V); bases(); if (V[0][0] === 0) { rectos(0); rectos(3); } else { rectos(1); rectos(2); }
    } else if (tipo === 'trap_isos') {
      const B = R.int(105, 130), b = R.int(50, 80), h = R.int(50, 70), o = (B - b) / 2;
      V = [[o, 0], [o + b, 0], [B, h], [0, h]];
      L.poligono(V); bases(); rayitas(L, V[1], V[2], 1); rayitas(L, V[3], V[0], 1);
    } else if (tipo === 'trap_esc') {
      let B, b, h, o; do { B = R.int(105, 130); b = R.int(45, 70); h = R.int(50, 70); o = R.int(8, B - b - 8); } while (Math.abs(o - (B - b - o)) < 22);
      V = [[o, 0], [o + b, 0], [B, h], [0, h]];
      L.poligono(V); bases();
    } else {
      for (;;) {
        V = [[R.int(0, 20), R.int(0, 18)], [R.int(85, 110), R.int(-12, 10)], [R.int(100, 128), R.int(60, 82)], [R.int(10, 40), R.int(62, 85)]];
        const a = [0, 1, 2, 3].map(i => angDir(V[i], V[(i + 1) % 4]));
        if (!casiParalelos(a[0], a[2]) && !casiParalelos(a[1], a[3])) break;
      }
      L.poligono(V);
    }
    return L.cerrar('pend-fig', 'Cuadrilátero');
  }
  function genCuadrilatero(R) {
    const tipo = R.pick(Object.keys(CUAD)), c = CUAD[tipo];
    return {
      html: true, enun: figura(cuadrilatero(R, tipo)),
      pasos: [{ t: GRUPO[c.grupo] }, { t: `Se trata de un <b>${c.nombre.toLowerCase()}</b>: ${c.exp}.` }],
      res: `\\text{${c.nombre}}`, resHtml: c.nombre + '.'
    };
  }

  /* ================= 3. Tercer ángulo de un triángulo ================= */
  /* Ficha: un ángulo entre 30° y 84° y el otro entre 10° y 139° − el primero */
  function genTercerAngulo(R) {
    const a1 = R.int(30, 84), a2 = R.int(10, 139 - a1), a3 = 180 - a1 - a2;
    const pos = R.int(0, 2);                                   // vértice del ángulo desconocido
    const t = [0, 1, 2].map(i => (i === pos ? a3 : null));
    const otros = R.shuffle([a1, a2]); let k = 0;
    for (let i = 0; i < 3; i++) if (t[i] === null) t[i] = otros[k++];
    const V = trianguloDeAngulos(t[0], t[1], t[2]);
    const L = Lienzo().poligono(V);
    t.forEach((g, i) => rotuloAngulo(L, V, i, i === pos ? '?' : `${g}°`));
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Triángulo con dos ángulos conocidos')),
      pasos: [
        { t: 'Los tres ángulos de cualquier triángulo suman 180°. Restamos a 180° los dos ángulos conocidos:', m: `180^\\circ - ${a1}^\\circ - ${a2}^\\circ = ${a3}^\\circ` }
      ],
      res: `${a3}^\\circ`
    };
  }

  /* ================= 4. Ángulo desconocido de un polígono ================= */
  const POLIGONOS = [['cuadrilátero', 4], ['pentágono', 5], ['hexágono', 6], ['heptágono', 7], ['octógono', 8]];
  function genPoligono(R) {
    const ANG_MIN = 60, ANG_MAX = 170;                          // mismos límites que la ficha (polígono convexo)
    const [nombre, nl] = R.pick(POLIGONOS), suma = (nl - 2) * 180, k = nl - 1;
    const fMin = Math.max(ANG_MIN, suma - k * ANG_MAX), fMax = Math.min(ANG_MAX, suma - k * ANG_MIN);
    const falta = R.int(fMin, fMax);
    const ang = Array(k).fill(ANG_MIN);
    let extra = suma - falta - k * ANG_MIN;
    while (extra > 0) {
      const libres = ang.map((x, i) => i).filter(i => ang[i] < ANG_MAX), i = R.pick(libres);
      const paso = Math.min(extra, ANG_MAX - ang[i], R.int(1, 20));
      ang[i] += paso; extra -= paso;
    }
    const r = 62, L = Lienzo();
    const V = [...Array(nl)].map((_, i) => { const a = -Math.PI / 2 + 2 * Math.PI * i / nl; return [r * Math.cos(a), r * Math.sin(a)]; });
    L.poligono(V);
    V.forEach((p, i) => {
      const d = nl <= 5 ? 20 : 17, u = uni([-p[0], -p[1]]);
      L.texto(p[0] + u[0] * d, p[1] + u[1] * d + 3.6, i === 0 ? '?' : `${ang[i - 1]}°`, { tam: nl >= 7 ? 9.5 : 10.5, peso: i === 0 ? 700 : 400 });
    });
    const sumaC = ang.reduce((a, b) => a + b, 0);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', `${nombre} con un ángulo desconocido`), `${nombre[0].toUpperCase() + nombre.slice(1)} (figura no a escala)`),
      pasos: [
        { t: `Un ${nombre} tiene \\(n = ${nl}\\) lados. La suma de sus ángulos interiores es:`, m: `180^\\circ \\cdot (n - 2) = 180^\\circ \\cdot ${nl - 2} = ${suma}^\\circ` },
        { t: 'Sumamos los ángulos conocidos:', m: `${ang.map(a => `${a}^\\circ`).join(' + ')} = ${sumaC}^\\circ` },
        { t: 'El ángulo desconocido es lo que falta hasta la suma total:', m: `${suma}^\\circ - ${sumaC}^\\circ = ${falta}^\\circ` }
      ],
      res: `${falta}^\\circ`
    };
  }

  /* ================= 5. Elementos de la circunferencia ================= */
  const LETRAS = ['A', 'B', 'C', 'D'];
  const NOM_EL = { cuerda: 'cuerda', diametro: 'diámetro', radio: 'radio', arco: 'arco' };
  const ART_EL = { cuerda: 'una', diametro: 'el', radio: 'un', arco: 'un' };
  const EXP_EL = {
    cuerda: 'segmento que une dos puntos de la circunferencia sin pasar por el centro',
    diametro: 'cuerda que pasa por el centro; es la más larga y mide el doble que el radio',
    radio: 'segmento que va del centro a un punto de la circunferencia',
    arco: 'trozo de la propia circunferencia (una línea curva, no un segmento)'
  };
  function genCircunferencia(R) {
    /* Misma construcción que la ficha (radio 90 px allí; aquí 60 px) */
    const tipos = R.shuffle(['cuerda', 'diametro', 'radio', 'arco']);
    const letraDe = {}; tipos.forEach((t, i) => { letraDe[t] = LETRAS[i]; });
    const t0 = R.int(0, 179), phi = t0 + R.int(50, 80), mC = t0 - 90 + R.int(-15, 15), hC = R.int(40, 55);
    const aA = t0 + R.int(110, 125), sA = R.int(35, 50);
    const r = 60, pt = (g, d) => [d * Math.cos(rad(g)), d * Math.sin(rad(g))];
    const L = Lienzo().circulo(0, 0, r, { relleno: '#fff', grosor: 1.2 });
    const rot = (tipo, p) => L.texto(p[0], p[1] + 4.5, letraDe[tipo], { tam: 12, peso: 700 });
    arco(L, [0, 0], r, rad(aA), rad(aA + sA), 3);
    rot('arco', pt(aA + sA / 2, r + 10));
    L.linea(...pt(mC - hC, r), ...pt(mC + hC, r), { grosor: 2 });
    rot('cuerda', pt(mC, r * (1 + Math.cos(rad(hC))) / 2 + 1));   // en el hueco entre la cuerda y la circunferencia
    L.linea(...pt(t0, r), ...pt(t0 + 180, r), { grosor: 2 });
    const ld = pt(t0 + 180, 0.6 * r), od = pt(t0 + 90, 9);
    rot('diametro', [ld[0] + od[0], ld[1] + od[1]]);
    L.linea(0, 0, ...pt(phi, r), { grosor: 2 });
    const lr = pt(phi, 0.55 * r), orr = pt(phi - 90, 9);
    rot('radio', [lr[0] + orr[0], lr[1] + orr[1]]);
    L.punto(0, 0, 2.4);
    const sol = LETRAS.map(l => `${l}: ${NOM_EL[tipos[LETRAS.indexOf(l)]]}`);
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Circunferencia con cuatro elementos señalados')),
      pasos: LETRAS.map((l, i) => ({ t: `<b>${l}</b> es ${ART_EL[tipos[i]]} <b>${NOM_EL[tipos[i]]}</b>: ${EXP_EL[tipos[i]]}.` })),
      res: `\\text{${sol.join(', ')}}`, resHtml: sol.join(' · ')
    };
  }

  /* ================= 6. Rectas y puntos notables del triángulo ================= */
  const NOTABLES = {
    alturas: { recta: 'alturas', punto: 'ortocentro', def: 'la altura es el segmento perpendicular que va de un vértice al lado opuesto (o a su prolongación)' },
    bisectrices: { recta: 'bisectrices', punto: 'incentro', def: 'la bisectriz de un ángulo es la recta que lo divide en dos ángulos iguales' },
    mediatrices: { recta: 'mediatrices', punto: 'circuncentro', def: 'la mediatriz de un lado es la recta perpendicular a él que pasa por su punto medio' }
  };
  const corte = (P, u, Q, v) => {          // intersección de P + s·u con Q + t·v
    const det = u[0] * v[1] - u[1] * v[0], w = sub(Q, P), s = (w[0] * v[1] - w[1] * v[0]) / det;
    return [P[0] + s * u[0], P[1] + s * u[1]];
  };
  function genNotables(R) {
    let t;
    do { const a = R.int(45, 75), b = R.int(45, 75); t = [a, b, 180 - a - b]; }
    while (t[2] < 45 || t[2] > 80 || Math.abs(t[0] - t[1]) < 8 || Math.abs(t[1] - t[2]) < 8 || Math.abs(t[0] - t[2]) < 8);
    const V = trianguloDeAngulos(...t, 130), clave = R.pick(Object.keys(NOTABLES)), N = NOTABLES[clave];
    const L = Lienzo().poligono(V, { relleno: '#f4f4f4' });
    const op = { discontinua: true, grosor: 1 };
    let X;
    if (clave === 'alturas') {
      const pies = V.map((P, i) => {
        const Q = V[(i + 1) % 3], S = V[(i + 2) % 3], u = uni(sub(S, Q)), w = sub(P, Q), k = w[0] * u[0] + w[1] * u[1];
        return [Q[0] + u[0] * k, Q[1] + u[1] * k];
      });
      V.forEach((P, i) => { const F = pies[i]; L.linea(P[0], P[1], F[0], F[1], op).anguloRecto(F, sub(P, F), sub(V[(i + 1) % 3], F), 6); });
      X = corte(V[0], sub(pies[0], V[0]), V[1], sub(pies[1], V[1]));
    } else if (clave === 'bisectrices') {
      V.forEach((P, i) => {
        const Q = V[(i + 1) % 3], S = V[(i + 2) % 3], u1 = uni(sub(Q, P)), u2 = uni(sub(S, P));
        const b = uni([u1[0] + u2[0], u1[1] + u2[1]]), D = corte(P, b, Q, sub(S, Q));
        L.linea(P[0], P[1], D[0], D[1], op);
        const m1 = arco(L, P, 16, dir(u1), dir(b)), m2 = arco(L, P, 16, dir(b), dir(u2));
        [m1, m2].forEach(m => L.linea(P[0] + 13 * Math.cos(m), P[1] + 13 * Math.sin(m), P[0] + 19 * Math.cos(m), P[1] + 19 * Math.sin(m), { grosor: 0.9 }));
      });
      const b0 = (i) => { const P = V[i], u1 = uni(sub(V[(i + 1) % 3], P)), u2 = uni(sub(V[(i + 2) % 3], P)); return [u1[0] + u2[0], u1[1] + u2[1]]; };
      X = corte(V[0], b0(0), V[1], b0(1));
    } else {
      const M = V.map((P, i) => mid(P, V[(i + 1) % 3]));
      const nrm = i => { const u = sub(V[(i + 1) % 3], V[i]); return [-u[1], u[0]]; };
      X = corte(M[0], nrm(0), M[1], nrm(1));
      M.forEach((Mi, i) => {
        const u = uni(sub(X, Mi)), far = len(sub(X, Mi)) + 16;
        L.linea(Mi[0] - u[0] * 14, Mi[1] - u[1] * 14, Mi[0] + u[0] * far, Mi[1] + u[1] * far, op)
          .anguloRecto(Mi, u, sub(V[(i + 1) % 3], Mi), 6);
        rayitas(L, V[i], Mi, 1); rayitas(L, Mi, V[(i + 1) % 3], 1);
      });
    }
    L.punto(X[0], X[1], 3);
    const res = `${N.recta[0].toUpperCase() + N.recta.slice(1)}; se cortan en el ${N.punto}`;
    return {
      html: true, enun: figura(L.cerrar('pend-fig', 'Triángulo con tres rectas notables')),
      pasos: [
        { t: `Las marcas lo indican: ${{ alturas: 'cada recta sale de un vértice y llega perpendicular (cuadradito) al lado opuesto', bisectrices: 'cada recta sale de un vértice y divide su ángulo en dos partes iguales (arcos marcados igual)', mediatrices: 'cada recta corta un lado en su punto medio (rayitas iguales) y es perpendicular a él (cuadradito)' }[clave]}. Son las <b>${N.recta}</b>: ${N.def}.` },
        { t: `El punto donde se cortan las tres ${N.recta} se llama <b>${N.punto}</b>.` }
      ],
      res: `\\text{${res}}`, resHtml: res + '.'
    };
  }

  registrarFicha({
    id: 'pend1-figuras-planas',
    titulo: 'Figuras planas',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/figuras-planas-1.html',
    ejercicios: [
      { id: 'triangulos', nombre: 'Clasificar triángulos por lados y por ángulos', peso: 0.5, columnas: 3,
        enunciado: ['Clasifica el triángulo según sus lados y según sus ángulos (las rayitas iguales señalan lados iguales):', 'Clasifica cada triángulo según sus lados y según sus ángulos (las rayitas iguales señalan lados iguales):'], generar: genTriangulo },
      { id: 'cuadrilateros', nombre: 'Nombrar cuadriláteros', peso: 0.5, columnas: 3,
        enunciado: ['Escribe el nombre del cuadrilátero (las rayitas iguales señalan lados iguales y las flechas, lados paralelos):', 'Escribe el nombre de cada cuadrilátero (las rayitas iguales señalan lados iguales y las flechas, lados paralelos):'], generar: genCuadrilatero },
      { id: 'tercer-angulo', nombre: 'Tercer ángulo de un triángulo', peso: 0.5, columnas: 3,
        enunciado: ['Calcula el ángulo desconocido del triángulo:', 'Calcula el ángulo desconocido de cada triángulo:'], generar: genTercerAngulo },
      { id: 'poligono', nombre: 'Ángulo desconocido de un polígono', peso: 1, columnas: 2,
        enunciado: ['Calcula el ángulo desconocido del polígono:', 'Calcula el ángulo desconocido de cada polígono:'], generar: genPoligono },
      { id: 'circunferencia', nombre: 'Elementos de la circunferencia', peso: 0.75, columnas: 2,
        enunciado: ['Indica qué elemento de la circunferencia (radio, diámetro, cuerda o arco) señala cada letra:', 'Indica qué elemento de la circunferencia (radio, diámetro, cuerda o arco) señala cada letra:'], generar: genCircunferencia },
      { id: 'notables', nombre: 'Rectas y puntos notables del triángulo', peso: 0.75, columnas: 2,
        enunciado: ['¿Qué rectas notables se han trazado en el triángulo? ¿Cómo se llama el punto donde se cortan?', '¿Qué rectas notables se han trazado en cada triángulo? ¿Cómo se llama el punto donde se cortan?'], generar: genNotables }
    ]
  });
})();
