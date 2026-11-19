/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Estadística bidimensional (ficha estadistica/est-bidimensional.html).
   Cubre los tres ejercicios de la ficha, con sus contextos:
   · Relacionar el coeficiente de correlación r con su nube de puntos (cuatro gráficas A-D).
   · Estimación gráfica: nube de puntos con su recta de regresión y valor estimado de y (5 contextos).
   · Recta de regresión que pasa por dos puntos: pendiente, ordenada y estimación (4 contextos).
   La ficha no pide calcular medias, covarianza ni r a partir de una tabla (eso es de
   «Estadística bidimensional II»), por eso aquí tampoco hay tablas de cálculo.
   Diferencias con la ficha (las únicas):
   · Las nubes se dibujan en blanco y negro con una rejilla que permite leer valores en papel.
   · Relacionar r: la ficha genera nubes al azar, cuyo r real se parece solo aproximadamente al
     indicado; aquí cada nube se ajusta para que su r sea exactamente el valor del enunciado.
     Además, los dos valores de r no «fuertes» son de categorías distintas y los de un mismo
     signo difieren al menos 0,15, para que la correspondencia se pueda decidir a ojo.
   · Estimación gráfica: la ficha dibuja la recta teórica sobre una nube con ruido; aquí los
     puntos se ajustan para que esa recta sea exactamente su recta de mínimos cuadrados. La
     abscisa por la que se pregunta varía entre tres valores por contexto (la ficha usa uno).
     Se pide leer el valor en la gráfica (en la solución se marca la lectura y se comprueba con
     la ecuación de la recta); en papel la lectura admite un pequeño margen.
   · Recta por dos puntos: la ficha elige pendiente y ordenada de un banco común a todos los
     contextos (y x1 hasta 200 con horas o años); aquí cada contexto tiene su propio banco con
     valores realistas (por ejemplo, salarios de 1000 a 2000 €/mes en vez de 24 €/mes) y los
     puntos P₁ y P₂ se eligen cerca de la abscisa pedida. La ficha corrige con tolerancia; aquí
     los valores son exactos, con a lo sumo dos decimales. */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { rd, dec, decTxt, Lienzo } = pend;

  const sumar = a => a.reduce((s, v) => s + v, 0);

  /* ---------- Azar gaussiano (Box-Muller) con el generador de la semilla ---------- */
  function normal(R) {
    let u = 0, v = 0;
    while (!u) u = R.rand();
    while (!v) v = R.rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  /* Resta a w su proyección sobre cada vector de la base (ortogonales entre sí) */
  function ortogonalizar(w, base) {
    return base.reduce((acc, b) => {
      const k = sumar(acc.map((t, i) => t * b[i])) / sumar(b.map(t => t * t));
      return acc.map((t, i) => t - k * b[i]);
    }, w);
  }
  const tipificar = a => {
    const m = sumar(a) / a.length;
    const s = Math.sqrt(sumar(a.map(t => (t - m) * (t - m))) / a.length);
    return a.map(t => (t - m) / s);
  };

  /* ================= 1. Relacionar r con su nube de puntos ================= */
  const R_POOLS = {
    fuertePos: [0.97, 0.95, 0.93, 0.92, 0.90],
    mediaPos: [0.78, 0.72, 0.68, 0.62, 0.58],
    mediaNeg: [-0.58, -0.62, -0.68, -0.72, -0.78],
    debilNeg: [-0.38, -0.34, -0.30, -0.26, -0.22],
    fuerteNeg: [-0.92, -0.93, -0.95, -0.97],
    casiNula: [0.04, -0.04, 0.08, -0.08, 0.12, -0.12]
  };
  function elegirR(R) {
    for (;;) {
      const otras = R.shuffle(['mediaPos', 'mediaNeg', 'debilNeg', 'casiNula']).slice(0, 2);
      const rs = [R.pick(R_POOLS.fuertePos), R.pick(R_POOLS.fuerteNeg), ...otras.map(c => R.pick(R_POOLS[c]))];
      let bien = true;
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
        if (rs[i] * rs[j] > 0 && Math.abs(rs[i] - rs[j]) < 0.15) bien = false;
      }
      if (bien) return R.shuffle(rs);
    }
  }
  /* 28 puntos con correlación muestral exactamente r, dentro de la escala −4…4 */
  function nube(R, r, n = 28) {
    for (;;) {
      const u = tipificar(Array.from({ length: n }, () => normal(R)));
      const v = tipificar(ortogonalizar(Array.from({ length: n }, () => normal(R)), [new Array(n).fill(1), u]));
      const k = Math.sqrt(1 - r * r);
      const pts = u.map((x, i) => [x, r * x + k * v[i]]);
      if (pts.every(([x, y]) => Math.abs(x) <= 3.4 && Math.abs(y) <= 3.4)) return pts;
    }
  }
  function dibujoNube(pts, letra) {
    const W = 120, H = 100, L = Lienzo();
    const X = x => (x + 4) / 8 * W, Y = y => H - (y + 4) / 8 * H;
    for (let i = 0; i <= 4; i++) {
      L.linea(i * W / 4, 0, i * W / 4, H, { trazo: '#c8c8c8', grosor: 0.5 });
      L.linea(0, i * H / 4, W, i * H / 4, { trazo: '#c8c8c8', grosor: 0.5 });
    }
    L.linea(0, 0, 0, H, { grosor: 1.2 }); L.linea(0, H, W, H, { grosor: 1.2 });
    pts.forEach(([x, y]) => L.punto(X(x), Y(y), 2.2));
    L.texto(W / 2, H + 17, `Gráfica ${letra}`, { tam: 12, peso: 600 });
    return L.cerrar('pend-fig', `Nube de puntos, gráfica ${letra}`);
  }
  function descripcionR(r) {
    const a = Math.abs(r);
    const signo = r > 0 ? 'positiva' : 'negativa';
    const camino = r > 0 ? 'suben' : 'bajan';
    if (a >= 0.9) return `correlación ${signo} y muy fuerte: los puntos ${camino} y están casi alineados`;
    if (a >= 0.55) return `correlación ${signo} y moderada: los puntos ${camino} en conjunto, con bastante dispersión`;
    if (a >= 0.2) return `correlación ${signo} y débil: los puntos ${camino} muy ligeramente y están muy dispersos`;
    return 'correlación casi nula: los puntos forman una nube sin dirección';
  }
  const LETRAS = ['A', 'B', 'C', 'D'];
  function genRelacionarR(R) {
    const rs = elegirR(R);
    const graf = rs.map((r, i) => dibujoNube(nube(R, r), LETRAS[i]));
    let orden;
    do { orden = R.shuffle([0, 1, 2, 3]); } while (orden.every((v, i) => v === i));
    const linea = i => `<span style="white-space:nowrap">\\(r = ${dec(rs[i])}\\) → Gráfica <span style="display:inline-block;width:11mm;border-bottom:0.25mm solid #888"></span></span>`;
    const enun = `<div class="pend-col"><span class="pend-texto">Las cuatro nubes de puntos tienen la misma escala.</span>` +
      `<div style="display:flex;flex-wrap:wrap;gap:2mm 5mm;align-items:flex-end">${graf.join('')}</div>` +
      `<div style="display:flex;flex-wrap:wrap;gap:1.5mm 8mm">${orden.map(linea).join('')}</div></div>`;
    return {
      html: true,
      enun,
      pasos: [
        { t: 'El <b>signo</b> de \\(r\\) indica la dirección de la nube: si \\(r > 0\\), al aumentar \\(x\\) aumenta \\(y\\) (los puntos suben); si \\(r < 0\\), al aumentar \\(x\\) disminuye \\(y\\) (los puntos bajan).' },
        { t: 'El <b>valor absoluto</b> \\(|r|\\) indica la fuerza: cuanto más cerca de 1, más alineados están los puntos; cerca de 0, la nube no tiene dirección.' },
        ...orden.map(i => ({ t: `\\(r = ${dec(rs[i])}\\): ${descripcionR(rs[i])}. Es la <b>gráfica ${LETRAS[i]}</b>.` }))
      ],
      res: rs.map((r, i) => `r = ${dec(r)} \\to ${LETRAS[i]}`).join(',\\; '),
      resHtml: [...Array(4).keys()].sort((a, b) => rs[b] - rs[a]).map(i => `\\(r = ${dec(rs[i])}\\) → ${LETRAS[i]}`).join(' · ')
    };
  }

  /* ================= 2. Estimación gráfica con la recta de regresión ================= */
  const CONTEXTOS_GRAFICA = [
    { x: 'Altura (cm)', y: 'Peso (kg)', xr: [155, 190], m: 0.8, b: -75, xq: [165, 175, 180], und: 'kg',
      txt: 'La gráfica relaciona la altura y el peso de un grupo de personas.',
      preg: q => `Estima el peso de una persona de ${q} cm de altura.` },
    { x: 'Horas de estudio', y: 'Nota (sobre 10)', xr: [1, 10], m: 0.7, b: 1.5, xq: [4, 6, 7], und: 'puntos',
      txt: 'La gráfica relaciona las horas de estudio de un grupo de alumnos con la nota que han sacado.',
      preg: q => `Estima la nota de un alumno que estudia ${q} horas.` },
    { x: 'Temperatura (°C)', y: 'Helados vendidos', xr: [18, 38], m: 4.5, b: -50, xq: [24, 30, 34], und: 'helados',
      txt: 'La gráfica relaciona la temperatura máxima de cada día con los helados vendidos en una heladería.',
      preg: q => `Estima los helados que se venderán un día con una temperatura de ${q} °C.` },
    { x: 'Publicidad (miles de €)', y: 'Ventas (miles de €)', xr: [1, 10], m: 6, b: 8, xq: [3, 6, 8], und: 'miles de €',
      txt: 'La gráfica relaciona la inversión en publicidad de una empresa con sus ventas.',
      preg: q => `Estima las ventas (en miles de euros) si se invierten ${q} miles de euros en publicidad.` },
    { x: 'Edad (años)', y: 'Presión sistólica (mmHg)', xr: [25, 70], m: 1.1, b: 78, xq: [35, 50, 60], und: 'mmHg',
      txt: 'La gráfica relaciona la edad de un grupo de personas con su presión arterial sistólica.',
      preg: q => `Estima la presión sistólica de una persona de ${q} años.` }
  ];
  function pasoNice(rango, maxMarcas) {
    const crudo = rango / maxMarcas, mag = Math.pow(10, Math.floor(Math.log10(crudo))), n = crudo / mag;
    return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag;
  }
  function ecuacionRecta(m, b) {
    const t = `y = ${dec(m)}x`;
    return b === 0 ? t : t + (b < 0 ? ' - ' : ' + ') + dec(Math.abs(b));
  }
  function dibujoRegresion(c, pts, xq, yq, guia) {
    const W = 250, H = 170, L = Lienzo();
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const px = pasoNice(Math.max(...xs) - Math.min(...xs), 7), py = pasoNice(Math.max(...ys) - Math.min(...ys), 7);
    const x0 = Math.floor(Math.min(...xs, xq) / px) * px, x1 = Math.ceil(Math.max(...xs, xq) / px) * px;
    const y0 = Math.floor(Math.min(...ys) / py) * py, y1 = Math.ceil(Math.max(...ys) / py) * py;
    const X = x => (x - x0) / (x1 - x0) * W, Y = y => H - (y - y0) / (y1 - y0) * H;
    for (let t = x0; t <= x1 + 1e-9; t += px) {
      L.linea(X(t), 0, X(t), H, { trazo: '#d0d0d0', grosor: 0.5 });
      L.texto(X(t), H + 13, decTxt(t, 1), { tam: 10 });
    }
    for (let t = y0; t <= y1 + 1e-9; t += py) {
      L.linea(0, Y(t), W, Y(t), { trazo: '#d0d0d0', grosor: 0.5 });
      L.texto(-5, Y(t) + 3.5, decTxt(t, 1), { ancla: 'end', tam: 10 });
    }
    L.linea(0, 0, 0, H, { grosor: 1.3 }); L.linea(0, H, W, H, { grosor: 1.3 });
    L.texto(W / 2, H + 28, c.x, { tam: 11 });
    L.texto(0, -8, c.y, { ancla: 'start', tam: 11 });
    /* Recta recortada al recuadro */
    let xa = x0, xb = x1;
    const f = x => c.m * x + c.b;
    if (f(xa) < y0) xa = (y0 - c.b) / c.m; else if (f(xa) > y1) xa = (y1 - c.b) / c.m;
    if (f(xb) > y1) xb = (y1 - c.b) / c.m; else if (f(xb) < y0) xb = (y0 - c.b) / c.m;
    L.linea(X(xa), Y(f(xa)), X(xb), Y(f(xb)), { grosor: 1.6 });
    pts.forEach(([x, y]) => L.punto(X(x), Y(y), 2.8));
    if (guia) {
      L.linea(X(xq), H, X(xq), Y(yq), { grosor: 1, discontinua: true });
      L.linea(X(xq), Y(yq), 0, Y(yq), { grosor: 1, discontinua: true });
      L.circulo(X(xq), Y(yq), 3.6, { relleno: '#fff', grosor: 1.4 });
    }
    return L.cerrar('pend-fig', 'Nube de puntos con su recta de regresión');
  }
  function genEstimacionGrafica(R) {
    const c = R.pick(CONTEXTOS_GRAFICA);
    const xq = R.pick(c.xq);
    const n = 18, amp = (c.m * (c.xr[1] - c.xr[0])) * 0.16;
    const xs = Array.from({ length: n }, () => rd(c.xr[0] + R.rand() * (c.xr[1] - c.xr[0]), 1));
    xs[0] = c.xr[0]; xs[1] = c.xr[1];
    let ruido = tipificar(ortogonalizar(Array.from({ length: n }, () => normal(R)), [new Array(n).fill(1), xs.map(x => x - sumar(xs) / n)]));
    ruido = ruido.map(e => e * amp);
    const pts = xs.map((x, i) => [x, c.m * x + c.b + ruido[i]]);
    const yq = rd(c.m * xq + c.b, 2);
    const yTxt = `${decTxt(yq)} ${c.und}`;
    const guiaSvg = dibujoRegresion(c, pts, xq, yq, true);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${c.txt} La recta dibujada es la recta de regresión de \\(y\\) sobre \\(x\\). ${c.preg(decTxt(xq))}</span>${dibujoRegresion(c, pts, xq, yq, false)}</div>`,
      pasos: [
        { t: `Buscamos en el eje horizontal \\(x = ${dec(xq)}\\) y subimos en vertical hasta cortar la recta de regresión.` },
        { t: 'Desde ese punto de la recta nos movemos en horizontal hasta el eje vertical y leemos el valor de \\(y\\).', html: guiaSvg },
        { t: `La recta de la gráfica es \\(${ecuacionRecta(c.m, c.b)}\\); la comprobamos:`, m: `y(${dec(xq)}) = ${dec(c.m)} \\cdot ${dec(xq)} ${c.b < 0 ? '-' : '+'} ${dec(Math.abs(c.b))} = ${dec(yq)}` },
        { t: `El valor \\(x = ${dec(xq)}\\) está dentro del rango de los datos (interpolación), así que la estimación es razonable.` }
      ],
      res: `y \\approx ${dec(yq)}\\ \\text{${c.und}}`,
      resHtml: `Aproximadamente ${yTxt} (en papel se admite un pequeño margen de lectura)`
    };
  }

  /* ================= 3. Recta de regresión por dos puntos ================= */
  const CONTEXTOS_RECTA = [
    { x: 'las horas trabajadas', y: 'de las ventas (en €)', a: [10, 12.5, 15, 20, 25], b: [20, 30, 50, 100], x1: [1, 2, 3, 4], dx: [2, 3, 4], xq: [6, 8, 10],
      preg: q => `Estima las ventas de un vendedor que trabaja ${q} horas.`, und: '€' },
    { x: 'la temperatura (en °C)', y: 'del consumo eléctrico (en kWh)', a: [1.5, 2, 2.5, 3, 4, 5], b: [10, 15, 20, 30, 50], x1: [20, 25, 30], dx: [2, 4, 5, 10], xq: [32, 35, 38],
      preg: q => `Estima el consumo eléctrico con una temperatura de ${q} °C.`, und: 'kWh' },
    { x: 'la inversión en publicidad (en €)', y: 'del número de clientes', a: [0.02, 0.03, 0.04, 0.05, 0.06], b: [20, 30, 50, 100, 200], x1: [100, 200, 300], dx: [100, 200, 300], xq: [400, 500, 600],
      preg: q => `Estima cuántos clientes se esperan con una inversión de ${q} € en publicidad.`, und: 'clientes' },
    { x: 'los años de experiencia', y: 'del salario (en €/mes)', a: [40, 50, 60, 80, 100, 120], b: [900, 1000, 1100, 1200, 1400], x1: [1, 2, 3, 4, 5], dx: [2, 3, 4, 5], xq: [7, 8, 10],
      preg: q => `Estima el salario de un empleado con ${q} años de experiencia.`, und: '€/mes' }
  ];
  const par = (x, y) => (Number.isInteger(x) && Number.isInteger(y)) ? `(${decTxt(x)}, ${decTxt(y)})` : `(${decTxt(x)}; ${decTxt(y)})`;
  function genRectaDosPuntos(R) {
    const c = R.pick(CONTEXTOS_RECTA);
    const a = R.pick(c.a), b = R.pick(c.b), xq = R.pick(c.xq);
    const x1 = R.pick(c.x1), x2 = x1 + R.pick(c.dx);
    const y1 = rd(a * x1 + b, 4), y2 = rd(a * x2 + b, 4), yq = rd(a * xq + b, 4);
    const dy = rd(y2 - y1, 4), dx = x2 - x1;
    const ax = rd(a * x1, 4);
    const eq = ecuacionRecta(a, b);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">La recta de regresión ${c.y} sobre ${c.x} pasa por los puntos \\(P_1\\) = ${par(x1, y1)} y \\(P_2\\) = ${par(x2, y2)}. Halla:<br>` +
        `i) La pendiente de la recta.<br>ii) La ordenada en el origen y la ecuación de la recta.<br>iii) ${c.preg(decTxt(xq))}</span></div>`,
      pasos: [
        { t: 'La pendiente es el cociente entre lo que aumenta \\(y\\) y lo que aumenta \\(x\\) entre los dos puntos:', m: `m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{${dec(y2)} - ${dec(y1)}}{${x2} - ${x1}} = \\frac{${dec(dy)}}{${dx}} = ${dec(a)}` },
        { t: `Escribimos la recta con \\(P_1\\): \\(y = ${dec(a)}x + n\\). Sustituimos \\(x = ${dec(x1)}\\), \\(y = ${dec(y1)}\\) y despejamos \\(n\\):`, m: `${dec(y1)} = ${dec(a)} \\cdot ${dec(x1)} + n \\;\\Rightarrow\\; n = ${dec(y1)} - ${dec(ax)} = ${dec(b)}` },
        { t: 'La ecuación de la recta de regresión es:', m: eq },
        { t: `Para estimar, sustituimos \\(x = ${dec(xq)}\\) en la ecuación:`, m: `y(${dec(xq)}) = ${dec(a)} \\cdot ${dec(xq)} + ${dec(b)} = ${dec(rd(a * xq, 4))} + ${dec(b)} = ${dec(yq)}` }
      ],
      res: `m = ${dec(a)},\\quad n = ${dec(b)},\\quad ${eq},\\quad y(${dec(xq)}) = ${dec(yq)}`,
      resHtml: `\\(m = ${dec(a)}\\); \\(n = ${dec(b)}\\); \\(${eq}\\). Estimación: ${decTxt(yq)} ${c.und}.`
    };
  }

  registrarFicha({
    id: 'est-bidimensional',
    titulo: 'Estadística bidimensional',
    detalle: 'Correlación · recta de regresión · estimación',
    grupo: 'Estadística',
    enlace: '../estadistica/est-bidimensional.html',
    ejercicios: [
      { id: 'relacionar-r', nombre: 'Relacionar r con su nube de puntos', peso: 1.25, columnas: 1,
        enunciado: ['Relaciona cada coeficiente de correlación con su diagrama de dispersión:', 'Relaciona cada coeficiente de correlación con su diagrama de dispersión:'], generar: genRelacionarR },
      { id: 'estimacion-grafica', nombre: 'Estimación con la recta de regresión (gráfica)', peso: 1, columnas: 1,
        enunciado: ['Observa la nube de puntos con su recta de regresión y estima:', 'Observa cada nube de puntos con su recta de regresión y estima:'], generar: genEstimacionGrafica },
      { id: 'recta-dos-puntos', nombre: 'Ecuación de la recta de regresión y estimación', peso: 1.25, columnas: 1,
        enunciado: ['Halla la ecuación de la recta de regresión y realiza una estimación:', 'Halla la ecuación de cada recta de regresión y realiza una estimación:'], generar: genRectaDosPuntos }
    ]
  });
})();
