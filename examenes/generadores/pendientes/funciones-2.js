/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Funciones (pendientes de 2.º ESO).
   Mismos criterios que la ficha interactiva pendientes/segundo/funciones-2.html:
   cuadrícula de −6 a 6, rectas con cortes enteros, gráficas por tramos, recorridos
   distancia-tiempo de 20 en 20 minutos y 100 en 100 metros, y tabla de valores de
   f(x) = a/(x − h) + k en x = −1, 0, 1 con resultados enteros.
   En el recorrido, los tramos de regreso intermedios no llegan a casa (como en la ficha
   corregida), para que «tiempo fuera de casa» no sea ambiguo. */
(function () {
  'use strict';
  const { tex, registrarFicha, mcm, pend } = window.EX;
  const { n, p, bin } = tex;
  const { Lienzo } = pend;

  const D = 6, U = 12;                                   // dominio −6..6, 12 px de modelo por unidad
  const menos = v => String(v).replace('-', '−');
  const X = v => v * U, Y = v => -v * U;
  const GRIS = '#c4c4c4';
  const punto = (x, y) => `(${n(x)},\\ {${n(y)}})`;

  /* Cuadrícula cartesiana de −6 a 6 con los ejes numerados */
  function cuadricula() {
    const L = Lienzo();
    for (let v = -D; v <= D; v++) {
      if (v === 0) continue;
      L.linea(X(v), Y(-D), X(v), Y(D), { trazo: GRIS, grosor: 0.5 });
      L.linea(X(-D), Y(v), X(D), Y(v), { trazo: GRIS, grosor: 0.5 });
    }
    L.linea(X(-D) - 3, 0, X(D) + 5, 0, { grosor: 1.1 }).linea(0, Y(-D) + 3, 0, Y(D) - 5, { grosor: 1.1 });
    L.linea(X(D) + 5, 0, X(D) + 1, -2.5, { grosor: 1.1 }).linea(X(D) + 5, 0, X(D) + 1, 2.5, { grosor: 1.1 });
    L.linea(0, Y(D) - 5, -2.5, Y(D) - 1, { grosor: 1.1 }).linea(0, Y(D) - 5, 2.5, Y(D) - 1, { grosor: 1.1 });
    for (let v = -D; v <= D; v += 2) {
      if (v === 0) continue;
      L.texto(X(v), 9.5, menos(v), { tam: 7.5 });
      L.texto(-2.5, Y(v) + 2.6, menos(v), { tam: 7.5, ancla: 'end' });
    }
    L.texto(X(D) + 6, -3.5, '<tspan font-style="italic">x</tspan>', { tam: 8, ancla: 'start' });
    L.texto(3, Y(D) - 4, '<tspan font-style="italic">y</tspan>', { tam: 8, ancla: 'start' });
    return L;
  }
  /* Segmento de la recta y = m·x + b dentro de la cuadrícula */
  function recta(L, m, b) {
    let pts = [];
    [-D, D].forEach(x => { const y = m * x + b; if (y >= -D && y <= D) pts.push([x, y]); });
    [-D, D].forEach(y => { const x = (y - b) / m; if (x >= -D && x <= D) pts.push([x, y]); });
    pts.sort((a, c) => a[0] - c[0]);
    const a = pts[0], c = pts[pts.length - 1];
    L.linea(X(a[0]), Y(a[1]), X(c[0]), Y(c[1]), { grosor: 1.8 });
    return L;
  }
  const figura = (L, etiqueta) => L.cerrar('pend-fig', etiqueta);

  /* ================= 1. Leer coordenadas ================= */
  /* Ficha: un punto de coordenadas enteras entre −6 y 6. En papel se piden cuatro puntos. */
  function genCoordenadas(R) {
    const pts = [];
    while (pts.length < 4) {
      const q = [R.int(-D, D), R.int(-D, D)];
      if (pts.every(o => Math.max(Math.abs(o[0] - q[0]), Math.abs(o[1] - q[1])) >= 2)) pts.push(q);
    }
    const L = cuadricula(), nom = 'ABCD';
    /* Rótulo en la diagonal con más hueco: lejos de los otros puntos, de los números de los ejes y del borde */
    pts.forEach(([x, y], i) => {
      L.punto(X(x), Y(y), 2.4);
      let mejor = null;
      [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sy]) => {
        const cx = x + sx * 0.55, cy = y + sy * 0.55;           // centro aproximado del rótulo, en unidades
        let coste = 0;
        if (Math.abs(cx) > D - 0.1 || Math.abs(cy) > D - 0.1) coste += 3;
        if (cy < 0 && cy > -1.1) coste += 2;                      // números del eje X (debajo del eje)
        if (cx < 0 && cx > -1.3) coste += 2;                      // números del eje Y (a la izquierda del eje)
        if (Math.abs(cy) < 0.35 || Math.abs(cx) < 0.35) coste += 1;
        pts.forEach((o, j) => { if (j !== i && Math.hypot(o[0] - cx, o[1] - cy) < 1) coste += 4; });
        if (sy < 0) coste += 0.1;
        if (!mejor || coste < mejor.coste) mejor = { coste, sx, sy };
      });
      L.texto(X(x) + mejor.sx * 3.5, Y(y) - mejor.sy * 3.5 + (mejor.sy > 0 ? 0 : 7), nom[i], { tam: 9.5, peso: 700, ancla: mejor.sx > 0 ? 'start' : 'end' });
    });
    const lista = pts.map(([x, y], i) => `${nom[i]}${punto(x, y)}`);
    return {
      html: true, enun: `<div class="pend-col">${figura(L, 'Cuadrícula con los puntos A, B, C y D')}</div>`,
      pasos: [
        { t: 'Desde el origen contamos las casillas en horizontal (la x: positiva a la derecha, negativa a la izquierda) y después en vertical (la y: positiva hacia arriba, negativa hacia abajo):' },
        { t: '', m: lista.join(' \\qquad ') }
      ],
      res: lista.join(',\\ ')
    };
  }

  /* ================= 2. Puntos de corte con los ejes ================= */
  /* Ficha: m entre −3 y 3 (no nulo), corte con el eje X en x = −t, t entre −4 y 4 (no nulo), |b| ≤ 5 */
  function genCortes(R) {
    let m, t, b;
    do { m = R.nz(-3, 3); t = R.nz(-4, 4); b = m * t; } while (Math.abs(b) > 5);
    const xi = -t, f = `f(x) = ${bin(m, b)}`;
    const L = recta(cuadricula(), m, b);
    L.punto(0, Y(b), 2.4).punto(X(xi), 0, 2.4);
    const mx = m === 1 ? 'x' : m === -1 ? '-x' : `${m}x`;
    return {
      enun: f,
      pasos: [
        { t: 'Corte con el eje Y (ordenadas): sustituimos \\(x = 0\\).', m: `f(0) = ${p(m)} \\cdot 0 ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${n(b)} \\;\\Rightarrow\\; ${punto(0, b)}` },
        { t: 'Corte con el eje X (abscisas): igualamos \\(f(x) = 0\\) y despejamos.', m: `${mx} ${b < 0 ? '-' : '+'} ${Math.abs(b)} = 0 \\;\\Rightarrow\\; ${mx} = ${n(-b)} \\;\\Rightarrow\\; x = ${m === 1 ? n(xi) : `\\frac{${n(-b)}}{${n(m)}} = ${n(xi)}`} \\;\\Rightarrow\\; ${punto(xi, 0)}` },
        { t: 'Comprobación en la gráfica:', html: `<div class="pend-col">${figura(L, 'Gráfica de la recta con sus puntos de corte')}</div>` }
      ],
      res: `\\text{Eje Y: } ${punto(0, b)},\\quad \\text{eje X: } ${punto(xi, 0)}`
    };
  }

  /* ================= 3. Crecimiento, decrecimiento y constancia ================= */
  /* Ficha: vértices en x = −6, xA (−4..−1), xB (xA+2..4), 6; alturas de −5 a 5; tramos consecutivos de distinto tipo */
  function genTramos(R) {
    const xA = R.int(-4, -1), xB = R.int(xA + 2, 4), xs = [-D, xA, xB, D];
    let ys, tipos;
    do {
      ys = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)];
      tipos = [0, 1, 2].map(i => Math.sign(ys[i + 1] - ys[i]));
    } while (tipos[0] === tipos[1] || tipos[1] === tipos[2]);
    const L = cuadricula();
    for (let i = 0; i < 3; i++) L.linea(X(xs[i]), Y(ys[i]), X(xs[i + 1]), Y(ys[i + 1]), { grosor: 1.8 });
    xs.forEach((x, i) => L.punto(X(x), Y(ys[i]), 2.2));
    const iv = i => `(${n(xs[i])},\\ ${n(xs[i + 1])})`;
    const NOMBRE = { 1: 'creciente', '-1': 'decreciente', 0: 'constante' };
    const grupo = s => [0, 1, 2].filter(i => tipos[i] === s).map(iv).join(' \\cup ');
    const res = [1, -1, 0].filter(s => tipos.includes(s)).map(s => `\\text{${NOMBRE[s][0].toUpperCase() + NOMBRE[s].slice(1)}: } ${grupo(s)}`);
    return {
      html: true, enun: `<div class="pend-col">${figura(L, 'Gráfica de una función por tramos')}</div>`,
      pasos: [
        { t: `Los cambios de tendencia están en \\(x = ${n(xA)}\\) y \\(x = ${n(xB)}\\). Recorremos la gráfica de izquierda a derecha: si sube, crece; si baja, decrece; si es horizontal, es constante.` },
        ...[0, 1, 2].map(i => ({ t: `En \\(${iv(i)}\\) pasa de \\(y = ${n(ys[i])}\\) a \\(y = ${n(ys[i + 1])}\\): es <b>${NOMBRE[tipos[i]]}</b>.` }))
      ],
      res: res.join(';\\quad ')
    };
  }

  /* ================= 4. Gráfica distancia-tiempo ================= */
  const ESCENARIOS = [
    { nombre: 'Marta', actividad: 'una excursión en bicicleta', lugar: 'por el carril bici del río', parado: 'parada' },
    { nombre: 'Pablo', actividad: 'un paseo a pie', lugar: 'por el parque', parado: 'parado' },
    { nombre: 'Lucía', actividad: 'una carrera de entrenamiento', lugar: 'por el polideportivo', parado: 'parada' },
    { nombre: 'Diego', actividad: 'un trayecto en patinete', lugar: 'por el barrio', parado: 'parado' }
  ];
  function recorrido(R) {
    const puntos = [{ t: 0, d: 0 }], paradas = [];
    let t = 0, d = 0;
    const subir = (min, paso) => { t += 20 * min; d += 100 * paso; puntos.push({ t, d }); };
    const bajar = (min, paso) => { t += 20 * min; d = Math.max(0, d - 100 * paso); puntos.push({ t, d }); };
    const parar = min => { t += 20 * min; paradas.push({ t0: t - 20 * min, t1: t }); puntos.push({ t, d }); };
    const vueltas = R.int(2, 3);
    for (let i = 0; i < vueltas; i++) {
      subir(R.int(1, 2), R.int(1, 2));
      if (R.rand() < 0.7) parar(R.int(1, 2));
      if (i < vueltas - 1 && R.rand() < 0.5) {
        const min = R.int(1, 2), paso = Math.min(R.int(1, 2), d / 100 - 1);   // un regreso intermedio no llega a casa
        if (paso > 0) bajar(min, paso);
      }
    }
    while (d > 0) bajar(1, Math.min(3, Math.ceil(d / 100)));
    return { puntos, paradas, tMax: t };
  }
  const dEn = (pt, t) => { for (let i = 0; i < pt.length - 1; i++) { const a = pt[i], b = pt[i + 1]; if (t >= a.t && t <= b.t) return b.t === a.t ? a.d : a.d + (b.d - a.d) * (t - a.t) / (b.t - a.t); } return pt[pt.length - 1].d; };
  function graficaDT(rec) {
    const tM = Math.ceil(rec.tMax / 20) * 20, dM = Math.max(...rec.puntos.map(q => q.d)) + 100;
    const sx = Math.min(36, 400 / (tM / 20)), sy = 22;
    const XT = t => t / 20 * sx, YD = d => -d / 100 * sy, L = Lienzo();
    for (let t = 0; t <= tM; t += 20) { L.linea(XT(t), 0, XT(t), YD(dM), { trazo: GRIS, grosor: 0.5 }); L.texto(XT(t), 10, String(t), { tam: 9 }); }
    for (let d = 0; d <= dM; d += 100) { L.linea(0, YD(d), XT(tM), YD(d), { trazo: GRIS, grosor: 0.5 }); if (d) L.texto(-3, YD(d) + 3, String(d), { tam: 9, ancla: 'end' }); }
    L.linea(0, 0, XT(tM) + 4, 0, { grosor: 1.1 }).linea(0, 0, 0, YD(dM) - 4, { grosor: 1.1 });
    L.texto(XT(tM) / 2, 24, 'Tiempo (minutos)', { tam: 10 });
    L.texto(0, YD(dM) - 9, 'Distancia (metros)', { tam: 10, ancla: 'start' });
    for (let i = 0; i < rec.puntos.length - 1; i++) {
      const a = rec.puntos[i], b = rec.puntos[i + 1];
      L.linea(XT(a.t), YD(a.d), XT(b.t), YD(b.d), { grosor: 2 });
    }
    rec.puntos.forEach(q => L.punto(XT(q.t), YD(q.d), 2.4));
    return L.cerrar('pend-fig', 'Gráfica distancia-tiempo');
  }
  function genDistanciaTiempo(R) {
    const esc = R.pick(ESCENARIOS), rec = recorrido(R), pt = rec.puntos;
    const inst = []; for (let t = 20; t < rec.tMax; t += 20) inst.push(t);
    const tq = R.pick(inst), dq = Math.round(dEn(pt, tq));
    const dMax = Math.max(...pt.map(q => q.d)), tDeMax = pt.find(q => q.d === dMax).t;
    const parado = rec.paradas.reduce((s, q) => s + q.t1 - q.t0, 0);
    const preguntas = [
      `¿A qué distancia de casa estaba a los ${tq} minutos de haber salido?`,
      '¿Cuál fue la distancia máxima a la que llegó de su casa durante todo el recorrido?',
      '¿En qué minuto llegó por primera vez a esa distancia máxima?',
      `¿Cuántos minutos en total estuvo ${esc.parado}?`,
      '¿Cuánto tiempo total estuvo fuera de casa?'
    ];
    const enun = `<div class="pend-col"><span class="pend-texto">${esc.nombre} sale de casa y hace ${esc.actividad} ${esc.lugar}. La gráfica muestra la distancia a su casa (en metros) según pasan los minutos.</span>${graficaDT(rec)}<ol class="pend-texto" style="margin:0;padding-left:6mm">${preguntas.map(q => `<li>${q}</li>`).join('')}</ol></div>`;
    const paradasTxt = rec.paradas.length
      ? `Los tramos horizontales son paradas: ${rec.paradas.map(q => `de ${q.t0} a ${q.t1} min`).join(', ').replace(/, ([^,]*)$/, ' y $1')}. En total, <b>${parado} min</b>.`
      : 'No hay tramos horizontales: no se paró nunca (<b>0 min</b>).';
    return {
      html: true, enun,
      pasos: [
        { t: `1) Desde el minuto ${tq} subimos hasta la gráfica y leemos la altura: <b>${dq} m</b>.` },
        { t: `2) El punto más alto de la gráfica está a <b>${dMax} m</b>.` },
        { t: `3) Llega a ese punto más alto por primera vez en el minuto <b>${tDeMax}</b>.` },
        { t: `4) ${paradasTxt}` },
        { t: `5) Vuelve a estar a 0 m (en casa) en el minuto ${rec.tMax}: estuvo fuera <b>${rec.tMax} min</b>.` }
      ],
      resHtml: `1) ${dq} m · 2) ${dMax} m · 3) minuto ${tDeMax} · 4) ${parado} min · 5) ${rec.tMax} min`
    };
  }

  /* ================= 5. Función lineal ================= */
  /* Ficha: pendiente entre −6 y 6 (no nula), ordenada entre −6 y 6 */
  function genLineal(R) {
    const m = R.nz(-D, D), b = R.int(-D, D);
    const L = recta(cuadricula(), m, b);
    L.punto(0, Y(b), 2.4);
    if (Math.abs(m + b) <= D) L.punto(X(1), Y(m + b), 2.4);
    const crece = m > 0;
    return {
      enun: `f(x) = ${bin(m, b)}`,
      pasos: [
        { t: `En \\(f(x) = mx + b\\), la pendiente es el número que multiplica a la \\(x\\) y la ordenada en el origen es el término independiente (el valor de \\(f(0)\\)):`, m: `m = ${n(m)},\\qquad b = ${n(b)}` },
        { t: `Como la pendiente es ${crece ? 'positiva' : 'negativa'}, la recta es <b>${crece ? 'creciente' : 'decreciente'}</b>: por cada unidad que avanza \\(x\\), \\(y\\) ${crece ? 'sube' : 'baja'} ${Math.abs(m)} ${Math.abs(m) === 1 ? 'unidad' : 'unidades'}.` },
        { t: `Gráfica (pasa por \\(${punto(0, b)}\\)${Math.abs(m + b) <= D ? ` y \\(${punto(1, m + b)}\\)` : ''}):`, html: `<div class="pend-col">${figura(L, 'Gráfica de la recta')}</div>` }
      ],
      res: `m = ${n(m)},\\quad b = ${n(b)},\\quad \\text{${crece ? 'creciente' : 'decreciente'}}`
    };
  }

  /* ================= 6. Tabla de valores y gráfica ================= */
  /* Ficha: f(x) = a/(x − h) + k con h ∈ {±2, ±3, ±4}, a múltiplo de mcm de los denominadores
     en x = −1, 0, 1 (≤ 18), y valores enteros entre −5 y 5, distintos */
  function racional(R) {
    for (let i = 0; i < 300; i++) {
      const h = R.pick([-4, -3, -2, 2, 3, 4]), den = [-1 - h, -h, 1 - h];
      const Lm = mcm(mcm(den[0], den[1]), den[2]);
      if (Lm > 18) continue;
      const a = R.signo() * R.int(1, 2) * Lm, raw = den.map(d => a / d);
      const kMin = Math.ceil(-5 - Math.min(...raw)), kMax = Math.floor(5 - Math.max(...raw));
      if (kMin > kMax) continue;
      const k = R.int(kMin, kMax), ys = raw.map(r => r + k);
      if (new Set(ys).size < 3) continue;
      return { a, h, k, ys, den };
    }
    throw new Error('Sin función racional');
  }
  function genTabla(R) {
    const { a, h, k, ys, den } = racional(R), xs = [-1, 0, 1];
    const fx = `f(x) = ${a < 0 ? '-' : ''}\\dfrac{${Math.abs(a)}}{${bin(1, -h)}}${k ? (k > 0 ? ` + ${k}` : ` - ${-k}`) : ''}`;
    const tabla = vals => `\\begin{array}{|c|c|c|c|} \\hline x & -1 & 0 & 1 \\\\ \\hline f(x) & ${vals.join(' & ')} \\\\ \\hline \\end{array}`;
    const Lv = cuadricula(), Ls = cuadricula();
    xs.forEach((x, i) => { Ls.punto(X(x), Y(ys[i]), 2.6); Ls.texto(X(x) + (x < 0 ? -3.5 : 3.5), Y(ys[i]) - 3.5, `(${menos(x)}, ${menos(ys[i])})`, { tam: 7.5, ancla: x < 0 ? 'end' : 'start' }); });
    const linea = (x, i) => {
      const q = a / den[i];
      return `f(${n(x)}) = \\frac{${n(a)}}{${n(x)} ${h > 0 ? '-' : '+'} ${Math.abs(h)}}${k ? (k > 0 ? ` + ${k}` : ` - ${-k}`) : ''} = \\frac{${n(a)}}{${n(den[i])}}${k ? (k > 0 ? ` + ${k}` : ` - ${-k}`) : ''} = ${k ? `${n(q)} ${k > 0 ? '+' : '-'} ${Math.abs(k)} = ` : ''}${n(ys[i])}`;
    };
    return {
      html: true,
      enun: `<div class="pend-col"><span>\\(${fx}\\)</span><span>\\(${tabla(['\\hphantom{-00}', '\\hphantom{-00}', '\\hphantom{-00}'])}\\)</span>${figura(Lv, 'Cuadrícula para representar los puntos')}</div>`,
      pasos: [
        { t: 'Sustituimos cada valor de \\(x\\): primero el denominador, después la división y por último la suma o resta.', m: `\\begin{gathered} ${xs.map(linea).join(' \\\\ ')} \\end{gathered}` },
        { t: 'Tabla y puntos representados:', m: tabla(ys.map(n)), html: `<div class="pend-col">${figura(Ls, 'Puntos de la tabla representados')}</div>` }
      ],
      res: xs.map((x, i) => `f(${n(x)}) = ${n(ys[i])}`).join(',\\ ')
    };
  }

  registrarFicha({
    id: 'pend2-funciones',
    titulo: 'Funciones',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/funciones-2.html',
    ejercicios: [
      { id: 'coordenadas', nombre: 'Leer coordenadas (cuatro puntos)', peso: 0.75, columnas: 2,
        enunciado: ['Escribe las coordenadas de los puntos A, B, C y D:', 'Escribe las coordenadas de los puntos A, B, C y D de cada cuadrícula:'], generar: genCoordenadas },
      { id: 'cortes', nombre: 'Puntos de corte con los ejes', peso: 0.75, columnas: 2,
        enunciado: ['Calcula los puntos de corte con los ejes de la función:', 'Calcula los puntos de corte con los ejes de las funciones:'], generar: genCortes },
      { id: 'tramos', nombre: 'Crecimiento, decrecimiento y constancia', peso: 1, columnas: 2,
        enunciado: ['Indica los intervalos en los que la función es creciente, decreciente o constante:', 'Indica, en cada gráfica, los intervalos en los que la función es creciente, decreciente o constante:'], generar: genTramos },
      { id: 'distancia-tiempo', nombre: 'Gráfica distancia-tiempo (5 preguntas)', peso: 1.5, columnas: 1,
        enunciado: ['Observa la gráfica y responde a las preguntas:', 'Observa cada gráfica y responde a las preguntas:'], generar: genDistanciaTiempo },
      { id: 'lineal', nombre: 'Función lineal: pendiente, ordenada y monotonía', peso: 0.75, columnas: 2,
        enunciado: ['Indica la pendiente, la ordenada en el origen y si es creciente o decreciente:', 'Indica la pendiente, la ordenada en el origen y si es creciente o decreciente:'], generar: genLineal },
      { id: 'tabla', nombre: 'Tabla de valores y gráfica', peso: 1, columnas: 2,
        enunciado: ['Completa la tabla de valores y representa los puntos:', 'Completa cada tabla de valores y representa los puntos:'], generar: genTabla }
    ]
  });
})();
