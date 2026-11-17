/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Funciones (pendientes de 1.º ESO).
   Mismos criterios que la ficha pendientes/primero/funciones-1.html: coordenadas
   enteras entre −6 y 6, recorridos distancia-tiempo de 20 en 20 minutos y de 100 en
   100 metros, y funciones lineales f(x) = mx + b con coeficientes enteros.
   Diferencias respecto a la ficha: en la tabla de valores, |m| + |b| ≤ 6 (la ficha admite m y b
   de −4 a 4) para que los tres puntos quepan en los ejes de −6 a 6; y en el recorrido
   distancia-tiempo nunca se vuelve a casa (0 m) a mitad de camino y siempre hay al menos una
   parada (en la ficha puede no haber ninguna y la distancia puede llegar a 0 antes del final). */
(function () {
  'use strict';
  const { tex, registrarFicha, pend } = window.EX;
  const { n } = tex;
  const { Lienzo } = pend;

  const abs = Math.abs;
  const menos = v => String(v).replace('-', '−');
  const LETRAS = ['A', 'B', 'C', 'D'];
  const coord = (x, y) => `(${n(x)},\\, ${n(y)})`;

  /* ---------- Ejes de coordenadas de −6 a 6 (cuadrícula de 12 px por unidad) ---------- */
  const D = 6, U = 12;
  function plano({ puntos = [], recta = null, etiqueta = 'Ejes de coordenadas' } = {}) {
    const L = Lienzo();
    const X = v => v * U, Y = v => -v * U;
    for (let i = -D; i <= D; i++) {
      if (i === 0) continue;
      L.linea(X(i), Y(-D), X(i), Y(D), { trazo: '#bdbdbd', grosor: 0.5 });
      L.linea(X(-D), Y(i), X(D), Y(i), { trazo: '#bdbdbd', grosor: 0.5 });
    }
    const fin = X(D) + 8;
    L.linea(X(-D) - 3, 0, fin, 0, { grosor: 1.1 }).linea(fin, 0, fin - 5, -3, { grosor: 1.1 }).linea(fin, 0, fin - 5, 3, { grosor: 1.1 });
    L.linea(0, Y(-D) + 3, 0, -fin, { grosor: 1.1 }).linea(0, -fin, -3, -fin + 5, { grosor: 1.1 }).linea(0, -fin, 3, -fin + 5, { grosor: 1.1 });
    L.texto(fin + 2, 3, 'x', { tam: 10, cursiva: true, ancla: 'start' }).texto(5, -fin + 3, 'y', { tam: 10, cursiva: true, ancla: 'start' });
    for (let i = -D; i <= D; i++) {
      if (i === 0) continue;
      L.texto(X(i) - (i < 0 ? 1.5 : 0), 8.5, menos(i), { tam: 7 });
      L.texto(-2.5, Y(i) + 2.4, menos(i), { tam: 7, ancla: 'end' });
    }
    L.texto(-2.5, 8.5, '0', { tam: 7, ancla: 'end' });
    if (recta) {
      const { m, b } = recta, ext = [];
      [-D, D].forEach(x => { const y = m * x + b; if (y >= -D && y <= D) ext.push([x, y]); });
      [-D, D].forEach(y => { const x = (y - b) / m; if (x >= -D && x <= D) ext.push([x, y]); });
      ext.sort((p, q) => p[0] - q[0]);
      const a = ext[0], c = ext[ext.length - 1];
      L.linea(X(a[0]), Y(a[1]), X(c[0]), Y(c[1]), { grosor: 1.5 });
    }
    puntos.forEach(({ x, y, letra }) => {
      L.punto(X(x), Y(y), 2.6);
      if (letra) {
        /* rótulo hacia el cuadrante opuesto a los ejes, para no pisarlos */
        const dx = x < 0 ? -1 : 1, dy = y < 0 ? 1 : -1;
        L.texto(X(x) + dx * 5, Y(y) + (dy < 0 ? -4 : 10), letra, { tam: 10, peso: 700, ancla: dx > 0 ? 'start' : 'end' });
      }
    });
    return L.cerrar('pend-fig', etiqueta);
  }

  const lista = arr => (arr.length > 1 ? arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1] : arr.join(''));
  const comoLlegar = (x, y) => {
    const h = x === 0 ? 'no nos movemos en horizontal' : `${abs(x)} ${abs(x) === 1 ? 'unidad' : 'unidades'} a la ${x > 0 ? 'derecha' : 'izquierda'}`;
    const v = y === 0 ? 'no nos movemos en vertical' : `${abs(y)} ${abs(y) === 1 ? 'unidad' : 'unidades'} hacia ${y > 0 ? 'arriba' : 'abajo'}`;
    return `${h} y ${v}`;
  };

  /* Puntos distintos, separados al menos 2 unidades (en x o en y) para que los rótulos no se pisen */
  function puntosDistintos(R, k) {
    const pts = [];
    while (pts.length < k) {
      const p = { x: R.int(-D, D), y: R.int(-D, D) };
      if (pts.every(q => Math.max(abs(q.x - p.x), abs(q.y - p.y)) >= 2)) pts.push(p);
    }
    return pts.map((p, i) => ({ ...p, letra: LETRAS[i] }));
  }

  /* ================= 1. Representar puntos ================= */
  function genSituar(R) {
    const pts = puntosDistintos(R, 3);
    const txt = lista(pts.map(p => `\\(${p.letra}${coord(p.x, p.y)}\\)`));
    return {
      html: true,
      enun: `<div class="pend-col"><span>${txt}</span>${plano()}</div>`,
      pasos: [
        { t: 'La primera coordenada (x) indica el desplazamiento horizontal desde el origen y la segunda (y), el vertical.' },
        ...pts.map(p => ({ t: `\\(${p.letra}${coord(p.x, p.y)}\\): desde el origen, ${comoLlegar(p.x, p.y)}.` })),
        { t: 'Puntos representados:', html: plano({ puntos: pts, etiqueta: 'Puntos representados' }) }
      ],
      res: pts.map(p => `${p.letra}${coord(p.x, p.y)}`).join(',\\quad '),
    };
  }

  /* ================= 2. Leer coordenadas ================= */
  function genLeer(R) {
    const pts = puntosDistintos(R, 3);
    const res = pts.map(p => `${p.letra}${coord(p.x, p.y)}`).join(',\\quad ');
    return {
      html: true,
      enun: `<div class="pend-col">${plano({ puntos: pts, etiqueta: 'Puntos en unos ejes de coordenadas' })}</div>`,
      pasos: [
        { t: 'Para cada punto contamos las unidades desde el origen: primero en horizontal (x, positiva a la derecha) y después en vertical (y, positiva hacia arriba).' },
        ...pts.map(p => ({ t: `Punto \\(${p.letra}\\): ${comoLlegar(p.x, p.y)}, luego \\(${p.letra}${coord(p.x, p.y)}\\).` }))
      ],
      res
    };
  }

  /* ================= 3. Gráfica distancia-tiempo ================= */
  /* Recorrido como el de la ficha (con las diferencias de la cabecera): tramos de 20 o 40 minutos, subidas y bajadas de 100 o 200 m,
     paradas de 20 o 40 minutos (al menos una). A mitad del recorrido nunca se vuelve a casa (0 m). */
  const ESCENARIOS = [
    { nombre: 'Marta', actividad: 'una excursión en bicicleta', lugar: 'por el carril bici del río', a: 'a' },
    { nombre: 'Pablo', actividad: 'un paseo a pie', lugar: 'por el parque', a: 'o' },
    { nombre: 'Lucía', actividad: 'una carrera de entrenamiento', lugar: 'por el polideportivo', a: 'a' },
    { nombre: 'Diego', actividad: 'un trayecto en patinete', lugar: 'por el barrio', a: 'o' }
  ];
  function recorrido(R) {
    const puntos = [{ t: 0, d: 0 }], paradas = [];
    let t = 0, d = 0;
    const subir = (min, paso) => { t += 20 * min; d = Math.min(800, d + 100 * paso); puntos.push({ t, d }); };
    const bajar = (min, paso) => { t += 20 * min; d = Math.max(0, d - 100 * paso); puntos.push({ t, d }); };
    const parar = min => { t += 20 * min; paradas.push({ t0: t - 20 * min, t1: t, d }); puntos.push({ t, d }); };
    const vueltas = R.int(2, 3);
    for (let i = 0; i < vueltas; i++) {
      subir(R.int(1, 2), R.int(1, 2));
      if (R.rand() < 0.7 || (i === vueltas - 1 && !paradas.length)) parar(R.int(1, 2));   // al menos una parada
      if (i < vueltas - 1 && R.rand() < 0.5 && d > 100) bajar(R.int(1, 2), Math.min(R.int(1, 2), d / 100 - 1));
    }
    while (d > 0) bajar(1, Math.min(3, Math.ceil(d / 100)));
    return { puntos, paradas, tMax: t };
  }
  const dEn = (p, t) => {
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], b = p[i + 1];
      if (t >= a.t && t <= b.t) return b.t === a.t ? a.d : a.d + (b.d - a.d) * (t - a.t) / (b.t - a.t);
    }
    return p[p.length - 1].d;
  };
  function graficaDT(rec) {
    const L = Lienzo(), dM = Math.max(400, Math.max(...rec.puntos.map(q => q.d)) + 100);
    const PX = 18, PY = 22;                  // px por 20 min y por 100 m
    const X = t => t / 20 * PX, Y = d => -d / 100 * PY, tM = rec.tMax;
    for (let t = 0; t <= tM; t += 20) {
      L.linea(X(t), Y(0), X(t), Y(dM), { trazo: '#c4c4c4', grosor: 0.5 });
      L.texto(X(t), 10, String(t), { tam: 7.5 });
    }
    for (let d = 0; d <= dM; d += 100) {
      L.linea(X(0), Y(d), X(tM), Y(d), { trazo: '#c4c4c4', grosor: 0.5 });
      L.texto(-3, Y(d) + 2.6, String(d), { tam: 7.5, ancla: 'end' });
    }
    L.linea(0, 0, X(tM) + 6, 0, { grosor: 1.1 }).linea(0, 0, 0, Y(dM) - 6, { grosor: 1.1 });
    L.texto(X(tM) / 2, 22, 'Tiempo (minutos)', { tam: 8.5 });
    L.texto(-22, Y(dM) - 10, 'Distancia (metros)', { tam: 8.5, ancla: 'start' });
    for (let i = 0; i < rec.puntos.length - 1; i++) {
      const a = rec.puntos[i], b = rec.puntos[i + 1];
      L.linea(X(a.t), Y(a.d), X(b.t), Y(b.d), { grosor: 2 });
    }
    rec.puntos.forEach(q => L.punto(X(q.t), Y(q.d), 1.8));
    return L.cerrar('pend-fig', 'Gráfica distancia-tiempo');
  }
  function genDT(R) {
    const esc = R.pick(ESCENARIOS), rec = recorrido(R), p = rec.puntos;
    const inst = []; for (let t = 20; t < rec.tMax; t += 20) inst.push(t);
    const tq = R.pick(inst), dq = Math.round(dEn(p, tq));
    const dMax = Math.max(...p.map(q => q.d)), tDeMax = p.find(q => q.d === dMax).t;
    const parado = rec.paradas.reduce((s, q) => s + (q.t1 - q.t0), 0);
    const preguntas = [
      `¿A qué distancia de casa estaba a los <b>${tq} minutos</b> de haber salido?`,
      '¿Cuál fue la <b>distancia máxima</b> a la que llegó de su casa?',
      '¿En qué <b>minuto</b> alcanzó por primera vez esa distancia máxima?',
      `¿Cuántos minutos en total estuvo <b>parad${esc.a}</b>?`,
      '¿Cuánto <b>tiempo total</b> estuvo fuera de casa?'
    ];
    const enun = `<div class="pend-col"><span class="pend-texto">${esc.nombre} sale de casa y hace ${esc.actividad} ${esc.lugar}. La gráfica muestra la distancia a su casa (en metros) según pasan los minutos.</span>${graficaDT(rec)}<ol class="pend-texto" style="margin:0;padding-left:6mm;display:grid;gap:2.5mm">${preguntas.map(q => `<li>${q}</li>`).join('')}</ol></div>`;
    const tramos = rec.paradas.map(q => `de ${q.t0} a ${q.t1} min (${q.t1 - q.t0} min)`);
    const pasos = [
      { t: `1) Desde el minuto ${tq} del eje horizontal subimos hasta la gráfica y leemos su altura: <b>${dq} m</b>.` },
      { t: `2) El punto más alto de la gráfica está a <b>${dMax} m</b>.` },
      { t: `3) Ese punto más alto se alcanza por primera vez en el minuto <b>${tDeMax}</b>.` },
      { t: `4) Los tramos horizontales son paradas (la distancia no cambia): ${lista(tramos)}. En total, <b>${parado} min</b>.` },
      { t: `5) Sale en el minuto 0 y la gráfica vuelve a 0 m en el minuto ${rec.tMax}: estuvo fuera <b>${rec.tMax} min</b>.` }
    ];
    return {
      html: true, enun, pasos,
      res: `${dq}\\text{ m}`,
      resHtml: `1) ${dq} m · 2) ${dMax} m · 3) minuto ${tDeMax} · 4) ${parado} min · 5) ${rec.tMax} min`
    };
  }

  /* ================= 4. Función lineal: pendiente, ordenada y monotonía ================= */
  /* Como en la ficha, se da la gráfica de la recta (m de −6 a 6 sin el 0, b de −6 a 6) y hay que
     leer en ella la pendiente y la ordenada. Siempre hay dos puntos de la recta con coordenadas
     enteras dentro de los ejes: (0, b) y (1, m + b) o (−1, b − m). */
  const fx = (m, b) => `f(x) = ${tex.poli([[m, 'x'], [b, '']])}`;
  function genLineal(R) {
    const m = R.nz(-D, D), b = R.int(-D, D);
    const crece = m > 0;
    const xq = abs(b + m) <= D ? 1 : -1, yq = m * xq + b;             // segundo punto de lectura
    const [x0, y0, x1, y1] = xq === 1 ? [0, b, 1, yq] : [-1, yq, 0, b];     // de izquierda a derecha
    const mov = `pasamos de \\(${coord(x0, y0)}\\) a \\(${coord(x1, y1)}\\), es decir, avanzamos 1 unidad a la derecha y la recta ${m > 0 ? 'sube' : 'baja'} ${abs(m)} ${abs(m) === 1 ? 'unidad' : 'unidades'}`;
    return {
      html: true,
      enun: `<div class="pend-col">${plano({ recta: { m, b }, etiqueta: 'Recta dibujada en unos ejes de coordenadas' })}</div>`,
      pasos: [
        { t: 'La ordenada en el origen \\(b\\) es la altura a la que la recta corta al eje Y (cuando \\(x = 0\\)):', m: `b = ${n(b)}` },
        { t: `La pendiente \\(m\\) es lo que sube (o baja) la recta al avanzar una unidad hacia la derecha: ${mov}.`, m: `m = ${n(m)}`,
          html: plano({ recta: { m, b }, puntos: [{ x: 0, y: b }, { x: xq, y: yq }], etiqueta: 'Puntos usados para leer la pendiente' }) },
        { t: `Como la recta ${crece ? 'sube' : 'baja'} de izquierda a derecha (pendiente ${crece ? 'positiva' : 'negativa'}), la función es <b>${crece ? 'creciente' : 'decreciente'}</b>.` }
      ],
      res: `m = ${n(m)},\\quad b = ${n(b)},\\quad \\text{${crece ? 'creciente' : 'decreciente'}}`,
      resHtml: `\\(${fx(m, b)}\\): pendiente \\(m = ${n(m)}\\), ordenada \\(b = ${n(b)}\\), ${crece ? 'creciente' : 'decreciente'}.`
    };
  }

  /* ================= 5. Tabla de valores y gráfica ================= */
  const celda = 'border:1px solid #444;padding:1mm 3mm;text-align:center;min-width:8mm';
  function tabla(ys) {
    const fila = (cab, vals) => `<tr><th style="${celda};font-weight:600">${cab}</th>${vals.map(v => `<td style="${celda}">${v}</td>`).join('')}</tr>`;
    return `<table style="border-collapse:collapse">${fila('\\(x\\)', ['\\(-1\\)', '\\(0\\)', '\\(1\\)'])}${fila('\\(y\\)', ys)}</table>`;
  }
  function genTabla(R) {
    let m, b;
    do { m = R.nz(-4, 4); b = R.int(-4, 4); } while (abs(m) + abs(b) > D);
    const xs = [-1, 0, 1], ys = xs.map(x => m * x + b);
    const expr = tex.poli([[m, 'x'], [b, '']]);
    const sust = x => {
      const mx = x === 0 ? `${n(m)} \\cdot 0` : m === 1 ? `${x < 0 ? `(${x})` : x}` : m === -1 ? `-${x < 0 ? `(${x})` : x}` : `${n(m)} \\cdot ${x < 0 ? `(${x})` : x}`;
      return b === 0 ? mx : `${mx} ${b > 0 ? '+' : '-'} ${abs(b)}`;
    };
    return {
      html: true,
      enun: `<div class="pend-col"><span>\\(${fx(m, b)}\\)</span>${tabla(['', '', ''])}${plano()}</div>`,
      pasos: [
        { t: 'Sustituimos cada valor de \\(x\\) en la fórmula:', m: xs.map((x, i) => `f(${n(x)}) = ${sust(x)} = ${n(ys[i])}`).join('\\qquad ') },
        { t: 'Tabla de valores:', html: tabla(ys.map(y => `\\(${n(y)}\\)`)) },
        { t: `Representamos los puntos ${lista(xs.map((x, i) => `\\(${coord(x, ys[i])}\\)`))} y los unimos con una recta:`, html: plano({ puntos: xs.map((x, i) => ({ x, y: ys[i] })), recta: { m, b }, etiqueta: `Gráfica de f(x) = ${expr}` }) }
      ],
      res: `f(-1) = ${n(ys[0])},\\quad f(0) = ${n(ys[1])},\\quad f(1) = ${n(ys[2])}`
    };
  }

  registrarFicha({
    id: 'pend1-funciones',
    titulo: 'Funciones',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/funciones-1.html',
    ejercicios: [
      { id: 'situar', nombre: 'Representar puntos en los ejes', peso: 0.75, columnas: 2,
        enunciado: ['Representa los siguientes puntos en los ejes de coordenadas:', 'Representa los siguientes puntos en los ejes de coordenadas:'], generar: genSituar },
      { id: 'leer', nombre: 'Leer las coordenadas de puntos', peso: 0.75, columnas: 2,
        enunciado: ['Escribe las coordenadas de los puntos representados:', 'Escribe las coordenadas de los puntos representados:'], generar: genLeer },
      { id: 'distancia-tiempo', nombre: 'Gráfica distancia-tiempo (5 preguntas)', peso: 2, columnas: 1,
        enunciado: ['Observa la gráfica y responde a las preguntas:', 'Observa cada gráfica y responde a las preguntas:'], generar: genDT },
      { id: 'lineal', nombre: 'Función lineal: pendiente, ordenada y monotonía', peso: 0.75, columnas: 3,
        enunciado: ['Indica la pendiente y la ordenada en el origen de la función y si es creciente o decreciente:', 'Indica la pendiente y la ordenada en el origen de cada función y si es creciente o decreciente:'], generar: genLineal },
      { id: 'tabla', nombre: 'Tabla de valores y gráfica de una función lineal', peso: 1.25, columnas: 2,
        enunciado: ['Completa la tabla de valores de la función y represéntala gráficamente:', 'Completa la tabla de valores de cada función y represéntala gráficamente:'], generar: genTabla }
    ]
  });
})();
