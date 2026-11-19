/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Distribución normal N(μ, σ) (distribuciones/normal.html).
   Mismos tipos que la ficha: P(X < a), P(X > a), P(X > a) con a < μ (simetría), P(a < X < b),
   desviación respecto de la media P(|X − μ| < d), y los inversos (valor que deja un porcentaje
   por debajo, por encima, o un porcentaje central), con los contextos de la ficha.
   Diferencias con la ficha:
   · El examen lleva una hoja anexa con la tabla de la N(0, 1): Φ(z) = P(Z ≤ z) para z de 0,00 a
     3,99, con cuatro decimales. Las soluciones trabajan con los valores de la tabla (tipificando y
     redondeando z a dos decimales), que es lo que hará el alumno.
   · Los valores a, b son «redondos» (enteros, medios o décimas según el contexto) y z se redondea
     a dos decimales, como en un examen; en la ficha z era siempre múltiplo de 0,25.
   · En los inversos se dan porcentajes redondos (90 %, 15 %…) y se toma el valor más próximo de
     la tabla; si la probabilidad buscada queda justo entre dos valores (por ejemplo 0,95), se toma
     el punto medio (z = 1,645), como es habitual. La ficha daba porcentajes como 84,13 %.
   · Se escribe |X − μ| < d (la ficha escribía |X| < kσ) y se unen los dos inversos simétricos
     de la ficha (margen k·σ y margen d), que son el mismo cálculo.
   · Se añade un tipo «problema completo» con un contexto y cuatro cuestiones (incluye el número
     esperado de individuos en un grupo).
   Este archivo expone en EX.normal la tabla, el anexo y los generadores de cuestiones, que
   reutiliza bin-norm-yates.js. */
(function () {
  'use strict';
  const EX = window.EX;

  /* ---------- Tabla de la N(0, 1): Φ(i/100) en diezmilésimas, i = 0…399 ---------- */
  const TN = (function () {
    const f = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
    const t = [5000];
    let acc = 0.5;
    for (let i = 0; i < 399; i++) {                     // Simpson en cada intervalo de 0,01
      const a = i / 100, h = 0.01 / 20;
      let s = f(a) + f(a + 0.01);
      for (let j = 1; j < 20; j++) s += (j % 2 ? 4 : 2) * f(a + j * h);
      acc += s * h / 3;
      t.push(Math.round(acc * 10000));
    }
    return t;
  })();
  /* Φ(z) en diezmilésimas para z con dos decimales (z ≥ 4 → 1) */
  const phiT = z => {
    const i = Math.round(Math.abs(z) * 100);
    const v = i > 399 ? 10000 : TN[i];
    return z < 0 ? 10000 - v : v;
  };

  /* ---------- Formato ---------- */
  const r2 = x => Math.round(x * 100) / 100;
  const limpio = (x, d = 4) => String(Number(x.toFixed(d)));           // sin ceros sobrantes
  const N = (x, d) => limpio(x, d).replace('.', '{,}');                  // TeX
  const H = (x, d) => limpio(x, d).replace('-', '−').replace('.', ',');   // texto
  const Z = z => z.toFixed(2).replace('.', '{,}');                         // z con dos decimales (TeX)
  const D = u => (u / 10000).toFixed(4).replace('.', '{,}');              // diezmilésimas → TeX
  const pct = p => `${H(p * 100, 2)} %`;
  const igual = (exacto, redondeado) => (Math.abs(exacto - redondeado) < 1e-9 ? '=' : '\\approx');

  /* ---------- Hoja anexa: tabla de la N(0, 1) ---------- */
  function anexo() {
    const cols = Array.from({ length: 10 }, (_, j) => j);
    const cab = `<tr><th class="tn-z">z</th>${cols.map(j => `<th>0,0${j}</th>`).join('')}</tr>`;
    const filas = Array.from({ length: 40 }, (_, i) =>
      `<tr${i % 5 === 0 && i ? ' class="tn-blq"' : ''}><th class="tn-z">${(i / 10).toFixed(1).replace('.', ',')}</th>${cols.map(j =>
        `<td>${(TN[i * 10 + j] / 10000).toFixed(4).replace('.', ',')}</td>`).join('')}</tr>`).join('');
    /* Campana con el área Φ(z) sombreada */
    const px = z => 10 + (z + 3.4) / 6.8 * 150, py = z => 54 - Math.exp(-z * z / 2) * 46;
    const curva = [], area = [`${px(-3.4)},54`];
    for (let z = -3.4; z <= 3.401; z += 0.1) curva.push(`${px(z).toFixed(1)},${py(z).toFixed(1)}`);
    for (let z = -3.4; z <= 0.901; z += 0.1) area.push(`${px(z).toFixed(1)},${py(z).toFixed(1)}`);
    area.push(`${px(0.9).toFixed(1)},54`);
    const svg = `<svg class="tn-fig" viewBox="0 0 170 66" aria-hidden="true">
      <polygon points="${area.join(' ')}" fill="#d9d9d9"/>
      <polyline points="${curva.join(' ')}" fill="none" stroke="#000" stroke-width="1"/>
      <line x1="6" y1="54" x2="164" y2="54" stroke="#000" stroke-width=".7"/>
      <line x1="${px(0.9).toFixed(1)}" y1="54" x2="${px(0.9).toFixed(1)}" y2="${py(0.9).toFixed(1)}" stroke="#000" stroke-width=".7"/>
      <text x="${px(0.9).toFixed(1)}" y="63" text-anchor="middle" font-size="8" font-style="italic">z</text>
      <text x="${px(-0.6).toFixed(1)}" y="46" text-anchor="middle" font-size="7.5">Φ(<tspan font-style="italic">z</tspan>)</text></svg>`;
    return [`<div class="anx-cab"><span class="anx-etq">Anexo</span><h2 class="anx-tit">Tabla de la distribución normal <i>N</i>(0, 1)</h2>`
      + `<p class="anx-sub">Valores de Φ(<i>z</i>) = <i>P</i>(<i>Z</i> ≤ <i>z</i>), redondeados a cuatro decimales.</p></div>`
      + `<div class="tn-intro">${svg}<p>La fila da la unidad y la primera cifra decimal de <i>z</i>; la columna, la segunda cifra decimal.<br>`
      + `Para valores negativos: Φ(−<i>z</i>) = 1 − Φ(<i>z</i>). &nbsp; Para <i>z</i> ≥ 4: Φ(<i>z</i>) ≈ 1.</p></div>`
      + `<table class="tb-nor"><thead>${cab}</thead><tbody>${filas}</tbody></table>`];
  }

  /* ---------- Contextos (los de la ficha) ---------- */
  /* desc: la variable; corto + uno: «la duración de una batería elegida al azar»; un: unidad;
     paso: redondeo de los valores a, b del enunciado; ind: «de los …» para porcentajes y recuentos */
  const CONTEXTOS = [
    { desc: 'la duración de las baterías de un modelo de teléfono móvil', corto: 'la duración', uno: 'una batería elegida al azar', un: 'horas', mu: [18, 20, 24, 30, 36], sg: [2, 3, 4, 5], paso: 0.5, ind: 'las baterías' },
    { desc: 'el peso de los paquetes gestionados por una empresa de mensajería', corto: 'el peso', uno: 'un paquete elegido al azar', un: 'kg', mu: [2, 3, 4, 5], sg: [0.4, 0.5, 0.8, 1], paso: 0.1, ind: 'los paquetes' },
    { desc: 'el tiempo de reacción de los conductores ante un obstáculo imprevisto', corto: 'el tiempo de reacción', uno: 'un conductor elegido al azar', un: 'ms', mu: [250, 280, 300, 320], sg: [20, 25, 30, 40], paso: 1, ind: 'los conductores' },
    { desc: 'el nivel de colesterol en una población adulta', corto: 'el nivel de colesterol', uno: 'un adulto elegido al azar', un: 'mg/dl', mu: [180, 190, 200, 210], sg: [15, 20, 25], paso: 1, ind: 'los adultos' },
    { desc: 'la puntuación obtenida en un test de aptitud', corto: 'la puntuación', uno: 'un participante elegido al azar', un: 'puntos', mu: [100, 105, 110], sg: [10, 12, 15], paso: 1, ind: 'los participantes' },
    { desc: 'el consumo de combustible de un modelo de coche', corto: 'el consumo', uno: 'un coche de ese modelo elegido al azar', un: 'l/100 km', mu: [5, 6, 7, 8], sg: [0.5, 0.8, 1], paso: 0.1, ind: 'los coches' },
    { desc: 'la altura de los estudiantes de un centro', corto: 'la altura', uno: 'un estudiante elegido al azar', un: 'cm', mu: [165, 168, 170, 172, 175], sg: [5, 6, 7, 8], paso: 1, ind: 'los estudiantes' },
    { desc: 'la duración de los electrodomésticos de una marca', corto: 'la duración', uno: 'un aparato elegido al azar', un: 'años', mu: [6, 7, 8, 9, 10], sg: [1.5, 2], paso: 0.5, ind: 'los aparatos' },
    { desc: 'el tiempo de entrega de los pedidos de una tienda en línea', corto: 'el tiempo de entrega', uno: 'un pedido elegido al azar', un: 'horas', mu: [24, 36, 48, 72], sg: [4, 5, 6, 8], paso: 1, ind: 'los pedidos' }
  ];

  function datos(R, ctxs = CONTEXTOS) {
    const c = R.pick(ctxs);
    return { c, mu: R.pick(c.mu), sg: R.pick(c.sg) };
  }
  const enunBase = d => `Se sabe que ${d.c.desc} sigue una distribución normal de media ${H(d.mu)} ${d.c.un} y desviación típica ${H(d.sg)} ${d.c.un}.`;
  const sujeto = d => `${d.c.corto} de ${d.c.uno}`;
  const indef = c => c.corto.replace(/^el /, 'un ').replace(/^la /, 'una ');      // «una duración»
  const plural = c => c.ind.replace(/^(los|las) /, '');                             // «baterías»
  const pasoModelo = d => ({
    t: `Sea \\(X\\) = «${d.c.corto.replace(/^(el|la) /, '')}», en ${d.c.un}. Según el enunciado:`,
    m: `X \\sim N(${N(d.mu)};\\ ${N(d.sg)})`
  });

  /* Valor «redondo» a = μ + k·σ, con |z| entre zmin y zmax y del signo pedido (+1, −1 o 0 = cualquiera) */
  function valorA(R, d, signo, zmin = 0.2, zmax = 2.4) {
    for (let t = 0; t < 80; t++) {
      const s = signo || R.signo();
      const k = zmin + R.rand() * (zmax - zmin);
      const a = Math.round((d.mu + s * k * d.sg) / d.c.paso) * d.c.paso;
      const z = r2((a - d.mu) / d.sg);
      if (Math.abs(z) < zmin || Math.abs(z) > zmax || Math.sign(z) !== s) continue;
      return { a: Number(a.toFixed(4)), z, zEx: (a - d.mu) / d.sg };
    }
    return null;
  }
  const tipif = (d, v, nombre = 'z') => ({ m: `${nombre} = \\frac{${N(v.a)} - ${N(d.mu)}}{${N(d.sg)}} ${igual(v.zEx, v.z)} ${Z(v.z)}` });

  /* Pasos para obtener Φ(z) de la tabla (con simetría si z < 0) */
  function pasosPhi(z) {
    if (z >= 0) return [];
    return [{ t: `La tabla solo tiene valores positivos de \\(z\\); por simetría:`, m: `P(Z \\le ${Z(z)}) = 1 - P(Z \\le ${Z(-z)}) = 1 - ${D(phiT(-z))} = ${D(phiT(z))}` }];
  }

  /* ---------- Cuestiones directas: { txt, pasos, res, valor } ---------- */
  function qMenor(R, d) {
    const v = valorA(R, d, 0); if (!v) return null;
    const val = phiT(v.z);
    return {
      txt: `Calcula la probabilidad de que ${sujeto(d)} sea inferior a ${H(v.a)} ${d.c.un}.`,
      pasos: [
        { t: `Se pide \\(P(X < ${N(v.a)})\\). Tipificamos con \\(Z = \\dfrac{X - \\mu}{\\sigma} \\sim N(0, 1)\\):`, ...tipif(d, v) },
        ...pasosPhi(v.z),
        { t: 'Con la tabla:', m: `P(X < ${N(v.a)}) = P(Z < ${Z(v.z)}) = ${D(val)}` }
      ],
      res: `P(X < ${N(v.a)}) = ${D(val)}`, valor: val, a: v.a
    };
  }
  function qMayor(R, d, signo = 1) {
    const v = valorA(R, d, signo); if (!v) return null;
    const val = 10000 - phiT(v.z);
    const pasos = [{ t: `Se pide \\(P(X > ${N(v.a)})\\). Tipificamos:`, ...tipif(d, v) }];
    if (v.z > 0) pasos.push({ t: 'Pasamos al suceso contrario y usamos la tabla:', m: `P(X > ${N(v.a)}) = P(Z > ${Z(v.z)}) = 1 - P(Z \\le ${Z(v.z)}) = 1 - ${D(phiT(v.z))} = ${D(val)}` });
    else pasos.push({ t: `Como \\(${Z(v.z)} < 0\\), por la simetría de la curva respecto de 0:`, m: `P(X > ${N(v.a)}) = P(Z > ${Z(v.z)}) = P(Z < ${Z(-v.z)}) = ${D(val)}` });
    return {
      txt: `Calcula la probabilidad de que ${sujeto(d)} sea superior a ${H(v.a)} ${d.c.un}.`,
      pasos, res: `P(X > ${N(v.a)}) = ${D(val)}`, valor: val, a: v.a
    };
  }
  const qMayorNeg = (R, d) => qMayor(R, d, -1);

  function qEntre(R, d) {
    for (let t = 0; t < 40; t++) {
      const mismoLado = R.rand() < 0.3;
      let va, vb;
      if (mismoLado) {
        const s = R.signo();
        const v1 = valorA(R, d, s, 0.2, 2.4), v2 = valorA(R, d, s, 0.2, 2.4);
        if (!v1 || !v2 || Math.abs(v1.z - v2.z) < 0.3) continue;
        [va, vb] = v1.a < v2.a ? [v1, v2] : [v2, v1];
      } else {
        va = valorA(R, d, -1, 0.3, 2.2); vb = valorA(R, d, 1, 0.3, 2.2);
        if (!va || !vb) continue;
      }
      const pb = phiT(vb.z), pa = phiT(va.z), val = pb - pa;
      if (val < 100) continue;
      const pasos = [
        { t: `Se pide \\(P(${N(va.a)} < X < ${N(vb.a)})\\). Tipificamos los dos extremos:`, m: `z_1 = \\frac{${N(va.a)} - ${N(d.mu)}}{${N(d.sg)}} ${igual(va.zEx, va.z)} ${Z(va.z)} \\qquad z_2 = \\frac{${N(vb.a)} - ${N(d.mu)}}{${N(d.sg)}} ${igual(vb.zEx, vb.z)} ${Z(vb.z)}` },
        ...pasosPhi(va.z), ...pasosPhi(vb.z),
        { t: 'Restamos las dos áreas acumuladas:', m: `P(${N(va.a)} < X < ${N(vb.a)}) = P(${Z(va.z)} < Z < ${Z(vb.z)}) = P(Z < ${Z(vb.z)}) - P(Z < ${Z(va.z)}) \\\\ = ${D(pb)} - ${D(pa)} = ${D(val)}`, multilinea: true }
      ];
      return {
        txt: `Calcula la probabilidad de que ${sujeto(d)} esté entre ${H(va.a)} y ${H(vb.a)} ${d.c.un}.`,
        lim: [va.a, vb.a],
        pasos, res: `P(${N(va.a)} < X < ${N(vb.a)}) = ${D(val)}`, valor: val
      };
    }
    return null;
  }

  function qDesvio(R, d) {
    for (let t = 0; t < 40; t++) {
      const k = 0.5 + R.rand() * 1.8;
      const dd = Math.round(k * d.sg / d.c.paso) * d.c.paso;
      const kz = r2(dd / d.sg);
      if (kz < 0.4 || kz > 2.4) continue;
      const p = phiT(kz), val = 2 * p - 10000;
      return {
        txt: `Calcula la probabilidad de que ${sujeto(d)} se desvíe de la media menos de ${H(dd)} ${d.c.un}.`,
        pasos: [
          { t: `Se pide \\(P(|X - ${N(d.mu)}| < ${N(dd)})\\), es decir, \\(P(${N(d.mu - dd)} < X < ${N(d.mu + dd)})\\). Al tipificar:`, m: `P\\left(\\left|\\frac{X - \\mu}{\\sigma}\\right| < \\frac{${N(dd)}}{${N(d.sg)}}\\right) = P(-${Z(kz)} < Z < ${Z(kz)})` },
          { t: 'El intervalo es simétrico respecto de 0, así que:', m: `P(-${Z(kz)} < Z < ${Z(kz)}) = 2\\,P(Z < ${Z(kz)}) - 1 = 2 \\cdot ${D(p)} - 1 = ${D(val)}` }
        ],
        res: `P(|X - ${N(d.mu)}| < ${N(dd)}) = ${D(val)}`, valor: val
      };
    }
    return null;
  }

  /* ---------- Inversos ---------- */
  /* z (≥ 0) con Φ(z) más próxima a la probabilidad buscada (en diezmilésimas); empate → punto medio */
  function buscarZ(u, nom = 'z') {
    let i = 0;
    while (i < 399 && TN[i + 1] <= u) i++;
    if (TN[i] === u) return { z: i / 100, txt: `En la tabla aparece exactamente \\(${D(u)}\\), en \\(${nom} = ${Z(i / 100)}\\).` };
    const j = i + 1, di = u - TN[i], dj = TN[j] - u;
    if (di === dj) {
      const z = (i + j) / 200;
      return { z, txt: `\\(${D(u)}\\) queda justo entre \\(\\Phi(${Z(i / 100)}) = ${D(TN[i])}\\) y \\(\\Phi(${Z(j / 100)}) = ${D(TN[j])}\\); tomamos el punto medio, \\(${nom} = ${N(z, 3)}\\).`, tres: true };
    }
    const k = di < dj ? i : j;
    return { z: k / 100, txt: `El valor más próximo de la tabla es \\(\\Phi(${Z(k / 100)}) = ${D(TN[k])}\\) (entre \\(${D(TN[i])}\\) y \\(${D(TN[j])}\\)), luego \\(${nom} \\approx ${Z(k / 100)}\\).` };
  }
  const zTex = b => (b.tres ? N(b.z, 3) : Z(b.z));

  /* Porcentaje de valores por debajo (dir = 'bajo') o por encima ('alto') de x₀ */
  const PCT_COLA = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.97, 0.98, 0.99];
  function qInvCola(R, d, dir) {
    dir = dir || (R.rand() < 0.5 ? 'bajo' : 'alto');
    const p = R.pick(PCT_COLA);
    const izq = dir === 'bajo' ? p : Math.round((1 - p) * 100) / 100;   // P(X < x₀)
    const u = Math.round(izq * 10000);
    const pasos = [];
    pasos.push({ t: `Buscamos \\(x_0\\) tal que \\(P(X ${dir === 'bajo' ? '<' : '>'} x_0) = ${N(p)}\\).${dir === 'alto' ? ` Equivale a \\(P(X < x_0) = 1 - ${N(p)} = ${N(izq)}\\).` : ''} Tipificando, \\(P(Z < z_0) = ${N(izq)}\\), con \\(z_0 = \\dfrac{x_0 - ${N(d.mu)}}{${N(d.sg)}}\\).` });
    let b, z0;
    if (izq >= 0.5) { b = buscarZ(u, 'z_0'); z0 = b.z; pasos.push({ t: b.txt }); }
    else {
      b = buscarZ(10000 - u, '-z_0'); z0 = -b.z;
      pasos.push({ t: `Como \\(${N(izq)} < 0{,}5\\), \\(z_0\\) es negativo. Por simetría, \\(P(Z < -z_0) = 1 - ${N(izq)} = ${N(1 - izq)}\\). ${b.txt}` });
      pasos.push({ t: `Por tanto, \\(z_0 ${b.tres ? '=' : '\\approx'} -${zTex(b)}\\).` });
    }
    const x0 = d.mu + z0 * d.sg;
    pasos.push({ t: 'Deshacemos la tipificación:', m: `x_0 = \\mu + z_0 \\cdot \\sigma = ${N(d.mu)} + ${z0 < 0 ? `(${N(z0, 3)})` : N(z0, 3)} \\cdot ${N(d.sg)} ${igual(x0, r2(x0))} ${N(r2(x0), 2)}` });
    const txt = dir === 'bajo'
      ? `Halla el valor \\(x_0\\) tal que el ${pct(p)} de ${d.c.ind} tiene ${indef(d.c)} inferior a \\(x_0\\).`
      : `Halla el valor \\(x_0\\) tal que el ${pct(p)} de ${d.c.ind} tiene ${indef(d.c)} superior a \\(x_0\\).`;
    return { txt, pasos, res: `x_0 \\approx ${N(r2(x0), 2)}\\ \\text{${d.c.un}}`, valor: r2(x0) };
  }
  const qInvBajo = (R, d) => qInvCola(R, d, 'bajo');
  const qInvAlto = (R, d) => qInvCola(R, d, 'alto');

  /* Porcentaje central: P(μ − c < X < μ + c) = p */
  const PCT_CEN = [0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.98, 0.99];
  function qInvCentral(R, d) {
    const p = R.pick(PCT_CEN);
    const izq = Math.round((1 + p) / 2 * 10000);
    const b = buscarZ(izq, 'k');
    const c = b.z * d.sg;
    return {
      txt: `Halla el valor \\(c\\) tal que el ${pct(p)} central de ${d.c.ind} tiene ${indef(d.c)} entre \\(${N(d.mu)} - c\\) y \\(${N(d.mu)} + c\\).`,
      pasos: [
        { t: `Buscamos \\(c\\) con \\(P(\\mu - c < X < \\mu + c) = ${N(p)}\\). Tipificando, \\(P(-k < Z < k) = ${N(p)}\\) con \\(k = c/\\sigma\\):`, m: `2\\,P(Z < k) - 1 = ${N(p)} \\;\\Rightarrow\\; P(Z < k) = \\frac{1 + ${N(p)}}{2} = ${D(izq)}` },
        { t: b.txt },
        { t: 'Deshacemos la tipificación:', m: `c = k \\cdot \\sigma = ${zTex(b)} \\cdot ${N(d.sg)} ${igual(c, r2(c))} ${N(r2(c), 2)}` },
        { t: `El intervalo es \\((${N(r2(d.mu - c), 2)};\\ ${N(r2(d.mu + c), 2)})\\).` }
      ],
      res: `c \\approx ${N(r2(c), 2)}\\ \\text{${d.c.un}}`, valor: r2(c)
    };
  }

  /* ---------- Ejercicio de una sola cuestión ---------- */
  const caja = txt => `<div class="pend-col"><span class="pend-texto">${txt}</span></div>`;
  function ejercicio(fq, ctxs) {
    return function (R) {
      for (let t = 0; t < 40; t++) {
        const d = datos(R, ctxs), Q = fq(R, d);
        if (!Q) continue;
        return { html: true, enun: caja(`${enunBase(d)} ${Q.txt}`), pasos: [pasoModelo(d), ...Q.pasos], res: Q.res };
      }
      throw new Error('Sin datos válidos');
    };
  }

  /* ---------- Problema completo: cuatro cuestiones con el mismo contexto ---------- */
  function genCompleto(R) {
    for (let t = 0; t < 40; t++) {
      const d = datos(R);
      const q1 = (R.rand() < 0.5 ? qMenor : qMayor)(R, d), q2 = qEntre(R, d);
      const q4 = qInvCola(R, d);
      if (!q1 || !q2) continue;
      const M = R.pick([200, 250, 400, 500, 800, 1000]);
      const esp = M * q2.valor / 10000;
      const q3 = {
        txt: `Si se eligen al azar ${M} ${plural(d.c)}, ¿${/^las /.test(d.c.ind) ? 'cuántas' : 'cuántos'} cabe esperar que tengan ${indef(d.c)} entre ${H(q2.lim[0])} y ${H(q2.lim[1])} ${d.c.un}?`,
        pasos: [{ t: `Con la probabilidad del apartado 2, el número esperado es \\(n \\cdot p\\):`, m: `${M} \\cdot ${D(q2.valor)} = ${N(esp, 2)} \\approx ${Math.round(esp)}` }],
        res: `\\approx ${Math.round(esp)}`
      };
      const qs = [q1, q2, q3, q4];
      const lista = [q1, q2].map((x, i) => `${i + 1}. ${x.txt.replace(/^Calcula la probabilidad de que /, 'Probabilidad de que ')}`)
        .concat([`3. ${q3.txt}`, `4. ${q4.txt}`]).join('<br>');
      const pasos = [pasoModelo(d)];
      qs.forEach((x, i) => { pasos.push({ t: `<b>${i + 1}.</b>` }); pasos.push(...x.pasos); });
      return {
        html: true,
        enun: caja(`${enunBase(d)}<br>${lista}`),
        pasos,
        resHtml: `<span>${qs.map((x, i) => `${i + 1})&nbsp;\\(${x.res}\\)`).join('<br>')}</span>`
      };
    }
    throw new Error('Sin datos válidos');
  }

  EX.normal = { TN, phiT, anexo, buscarZ, datos, enunBase, pasoModelo, caja, ejercicio, qMenor, qMayor, qEntre, qInvCola, fmt: { N, H, Z, D, r2, igual, pct } };

  const ENUN = ['Resuelve el siguiente problema con ayuda de la tabla de la distribución normal (anexo):',
                'Resuelve los siguientes problemas con ayuda de la tabla de la distribución normal (anexo):'];
  EX.registrarFicha({
    id: 'normal',
    titulo: 'Distribución normal N(μ, σ)',
    detalle: 'Tipificación y tabla de la N(0, 1) (hoja anexa)',
    grupo: 'Distribuciones de probabilidad',
    enlace: '../distribuciones/normal.html',
    anexo,
    ejercicios: [
      { id: 'menor', nombre: 'P(X < a)', peso: 1, columnas: 1, enunciado: ENUN, generar: ejercicio(qMenor) },
      { id: 'mayor', nombre: 'P(X > a)', peso: 1, columnas: 1, enunciado: ENUN, generar: ejercicio(qMayor) },
      { id: 'mayorneg', nombre: 'P(X > a) con a < μ (simetría)', peso: 1, columnas: 1, enunciado: ENUN, generar: ejercicio(qMayorNeg) },
      { id: 'entre', nombre: 'P(a < X < b)', peso: 1, columnas: 1, enunciado: ENUN, generar: ejercicio(qEntre) },
      { id: 'desvio', nombre: 'Desviación respecto de la media P(|X − μ| < d)', peso: 1, columnas: 1, enunciado: ENUN, generar: ejercicio(qDesvio) },
      { id: 'invbajo', nombre: 'Inversa: valor que deja un porcentaje por debajo', peso: 1.25, columnas: 1, enunciado: ENUN, generar: ejercicio(qInvBajo) },
      { id: 'invalto', nombre: 'Inversa: valor que deja un porcentaje por encima', peso: 1.25, columnas: 1, enunciado: ENUN, generar: ejercicio(qInvAlto) },
      { id: 'invcentral', nombre: 'Inversa: intervalo central con un porcentaje', peso: 1.25, columnas: 1, enunciado: ENUN, generar: ejercicio(qInvCentral) },
      { id: 'completo', nombre: 'Problema completo (cuatro cuestiones)', peso: 2.5, columnas: 1, enunciado: ENUN, generar: genCompleto }
    ]
  });
})();
