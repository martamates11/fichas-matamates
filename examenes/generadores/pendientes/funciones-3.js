/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Funciones (pendientes de 3.º ESO).
   Las funciones y gráficas se generan con los mismos criterios que la ficha interactiva
   pendientes/tercero/funciones-3.html: dominio [−6, 6], coordenadas enteras en los puntos
   que hay que leer, raíces enteras en los cortes y convenio cóncava = ∪, convexa = ∩.
   Las gráficas son SVG en blanco y negro con cuadrícula, pensadas para fotocopiar. */
(function () {
  'use strict';
  const { tex, registrarFicha, pend, resolverCuadratica, despejeLineal } = window.EX;
  const { n, p, poli, cuad, bin } = tex;
  const { Lienzo } = pend;

  const abs = Math.abs;
  const menos = v => n(v).replace('-', '−');                  // número en texto con signo menos real
  const intTeX = arr => arr.map(([a, b]) => `(${n(a)}, ${n(b)})`).join(' \\cup ');
  const ptTeX = (x, y) => `(${n(x)}, ${n(y)})`;
  const ptTxt = (x, y) => `(${menos(x)}, ${menos(y)})`;
  const figura = (svg, extra = '') => `<div class="pend-col">${svg}${extra}</div>`;

  /* ================= Gráficas en cuadrícula [−6, 6] × [−6, 6] ================= */
  const U = 12, LIM = 6;                       // px de modelo por unidad (12 · 12 = 144 px)
  const X = x => x * U, Y = y => -y * U;
  const GRIS_CUAD = '#c4c4c4';

  function cuadricula() {
    const L = Lienzo();
    for (let i = -LIM; i <= LIM; i++) {
      L.linea(X(i), Y(-LIM), X(i), Y(LIM), { trazo: GRIS_CUAD, grosor: 0.45 });
      L.linea(X(-LIM), Y(i), X(LIM), Y(i), { trazo: GRIS_CUAD, grosor: 0.45 });
    }
    const f = 5;                                // flechas de los ejes
    L.linea(X(-LIM) - 3, 0, X(LIM) + 7, 0, { grosor: 1 })
      .linea(X(LIM) + 7, 0, X(LIM) + 7 - f, -3, { grosor: 1 }).linea(X(LIM) + 7, 0, X(LIM) + 7 - f, 3, { grosor: 1 });
    L.linea(0, Y(-LIM) + 3, 0, Y(LIM) - 7, { grosor: 1 })
      .linea(0, Y(LIM) - 7, -3, Y(LIM) - 7 + f, { grosor: 1 }).linea(0, Y(LIM) - 7, 3, Y(LIM) - 7 + f, { grosor: 1 });
    for (let i = -LIM; i <= LIM; i++) {
      if (!i) continue;
      L.texto(X(i), 8.5, menos(i), { tam: 7 });
      L.texto(-2.5, Y(i) + 2.5, menos(i), { tam: 7, ancla: 'end' });
    }
    L.texto(-2.5, 8.5, '0', { tam: 7, ancla: 'end' });
    L.texto(X(LIM) + 8, 11, 'x', { tam: 10, cursiva: true, ancla: 'end' });
    L.texto(5, Y(LIM) - 3, 'y', { tam: 10, cursiva: true, ancla: 'start' });
    return L;
  }

  /* Polilínea recortada a la franja |y| ≤ LIM */
  function polilinea(L, pts, opc = {}) {
    const o = Object.assign({ grosor: 1.7 }, opc);
    const dentro = y => y >= -LIM && y <= LIM;
    for (let i = 0; i < pts.length - 1; i++) {
      let [xa, ya] = pts[i], [xb, yb] = pts[i + 1];
      if (!dentro(ya) && !dentro(yb) && (ya - LIM) * (yb - LIM) > 0 && (ya + LIM) * (yb + LIM) > 0) continue;
      const corta = (x1, y1, x2, y2) => {      // lleva (x1, y1) al borde si está fuera
        const borde = y1 > LIM ? LIM : -LIM;
        return [x1 + (x2 - x1) * (borde - y1) / (y2 - y1), borde];
      };
      if (!dentro(ya)) [xa, ya] = corta(xa, ya, xb, yb);
      if (!dentro(yb)) [xb, yb] = corta(xb, yb, xa, ya);
      L.linea(X(xa), Y(ya), X(xb), Y(yb), o);
    }
    return L;
  }
  const curva = (L, f, a = -LIM, b = LIM, paso = 0.1) => {
    const pts = [];
    for (let x = a; x <= b + 1e-9; x += paso) pts.push([x, f(x)]);
    return polilinea(L, pts);
  };
  const cerrarGraf = (L, etq = 'Gráfica de la función') => L.cerrar('pend-fig', etq);

  /* ================= 1. Puntos de corte con los ejes ================= */
  /* Ficha: recta y = m·x + m·t (m, t ≠ 0, |m| ≤ 3, |t| ≤ 4, |m·t| ≤ 5) o parábola
     y = ±(x − r₁)(x − r₂) con raíces enteras entre −5 y 5 y |c| ≤ 6. */
  function genCortes(R) {
    if (R.rand() < 0.5) {
      let m, t;
      do { m = R.nz(-3, 3); t = R.nz(-4, 4); } while (abs(m * t) > 5);
      const b = m * t, raiz = -t, expr = bin(m, b);
      const dsp = despejeLineal(m, -b, 'x');
      return {
        enun: `f(x) = ${expr}`,
        pasos: [
          { t: 'Corte con el eje Y: sustituimos \\(x = 0\\).', m: `f(0) = ${n(b)} \\;\\Rightarrow\\; ${ptTeX(0, b)}` },
          { t: 'Corte con el eje X: resolvemos \\(f(x) = 0\\).', m: `${expr} = 0 \\;\\Rightarrow\\; ${dsp.m}` }
        ],
        res: `\\text{Eje } Y: ${ptTeX(0, b)}; \\quad \\text{eje } X: ${ptTeX(raiz, 0)}`
      };
    }
    let a, r1, r2, b, c;
    do {
      a = R.pick([1, -1]); r1 = R.int(-5, 4); r2 = r1 + R.int(1, 4);
      b = -a * (r1 + r2); c = a * r1 * r2;
    } while (r2 > 5 || abs(c) > 6);
    const expr = cuad(a, b, c);
    const pasos = [{ t: 'Corte con el eje Y: sustituimos \\(x = 0\\); solo queda el término independiente.', m: `f(0) = ${n(c)} \\;\\Rightarrow\\; ${ptTeX(0, c)}` }];
    pasos.push({ t: 'Corte con el eje X: resolvemos la ecuación de segundo grado \\(f(x) = 0\\).', m: `${expr} = 0` });
    if (c === 0) {
      const otra = r1 === 0 ? r2 : r1;
      pasos.push({ t: 'Es incompleta (sin término independiente): sacamos factor común \\(x\\).', m: `x\\,(${bin(a, b)}) = 0 \\;\\Rightarrow\\; x = 0 \\;\\text{ o }\\; ${bin(a, b)} = 0 \\;\\Rightarrow\\; x = ${n(otra)}` });
    } else if (b === 0) {
      const k = -c / a;
      pasos.push({ t: 'Es incompleta (sin término en \\(x\\)): despejamos \\(x^2\\).', m: `x^2 = ${k} \\;\\Rightarrow\\; x = \\pm\\sqrt{${k}} = \\pm ${Math.round(Math.sqrt(k))}` });
    } else {
      resolverCuadratica(a, b, c).pasos.forEach(q => pasos.push(q));
    }
    pasos.push({ t: 'Cada solución da un punto del eje X, de la forma \\((x, 0)\\).' });
    return {
      enun: `f(x) = ${expr}`,
      pasos,
      res: `\\text{Eje } Y: ${ptTeX(0, c)}; \\quad \\text{eje } X: ${ptTeX(r1, 0)} \\text{ y } ${ptTeX(r2, 0)}`
    };
  }

  /* ================= 2. Crecimiento y decrecimiento ================= */
  /* Ficha: poligonal de 3 o 4 tramos en [−6, 6], vértices de coordenadas enteras, |y| ≤ 5,
     tramos alternos que suben y bajan entre 2 y 6 unidades. */
  function tramos(R) {
    for (;;) {
      const nT = R.int(3, 4), interiores = [];
      let x = R.int(-4, -2);
      for (let i = 0; i < nT - 1; i++) { interiores.push(x); x += R.int(2, 4); }
      if (interiores[interiores.length - 1] > 4) continue;
      const xs = [-6, ...interiores, 6], sube0 = R.rand() < 0.5, ys = [R.int(-5, 5)];
      let ok = true;
      for (let i = 0; i < nT; i++) {
        const sube = (i % 2 === 0) === sube0;
        const y = ys[i] + R.int(2, 6) * (sube ? 1 : -1);
        if (abs(y) > 5) { ok = false; break; }
        ys.push(y);
      }
      if (!ok) continue;
      return { xs, ys, tipos: xs.slice(0, -1).map((_, i) => ((i % 2 === 0) === sube0 ? 'crece' : 'decrece')) };
    }
  }
  const intervalosDe = (xs, tipos, t) => tipos.map((u, i) => (u === t ? [xs[i], xs[i + 1]] : null)).filter(Boolean);
  function graficaTramos(g) {
    const L = cuadricula();
    polilinea(L, g.xs.map((x, i) => [x, g.ys[i]]));
    g.xs.forEach((x, i) => L.punto(X(x), Y(g.ys[i]), 2.2));
    return cerrarGraf(L);
  }
  function genMonotonia(R) {
    const g = tramos(R);
    const C = intervalosDe(g.xs, g.tipos, 'crece'), D = intervalosDe(g.xs, g.tipos, 'decrece');
    const lectura = g.tipos.map((t, i) => `de \\(x = ${n(g.xs[i])}\\) a \\(x = ${n(g.xs[i + 1])}\\) ${t === 'crece' ? 'sube' : 'baja'}`).join('; ');
    return {
      html: true,
      enun: figura(graficaTramos(g)),
      pasos: [
        { t: `Leemos la gráfica de izquierda a derecha: ${lectura}.` },
        { t: 'Crece donde sube y decrece donde baja. Los intervalos se escriben abiertos y con valores de \\(x\\):', m: `\\text{Crece: } ${intTeX(C)} \\qquad \\text{Decrece: } ${intTeX(D)}` }
      ],
      res: `\\text{Crece en } ${intTeX(C)}; \\quad \\text{decrece en } ${intTeX(D)}`
    };
  }

  /* ================= 3. Concavidad y convexidad ================= */
  /* Ficha: uno o dos puntos de inflexión de abscisa entera (entre −4 y 4), curva hecha de
     arcos de parábola unidos sin picos; convenio cóncava = ∪, convexa = ∩. */
  function curvatura(R) {
    let inflex;
    if (R.rand() < 0.5) inflex = [R.int(-3, 3)];
    else { const q = R.int(-4, 1); inflex = [q, R.int(q + 2, Math.min(4, q + 5))]; }
    const xs = [-6, ...inflex, 6], s0 = R.rand() < 0.5 ? 1 : -1;
    const signos = xs.slice(0, -1).map((_, i) => (i % 2 === 0 ? s0 : -s0));
    const N = 600, dx = 12 / N, raw = [];
    let fp = (R.rand() * 2 - 1) * 3, f = 0;
    for (let i = 0; i <= N; i++) {
      const x = -6 + i * dx;
      raw.push({ x, y: f });
      const xm = x + dx / 2;
      let k = 0; while (k < signos.length - 1 && xm > xs[k + 1]) k++;
      fp += signos[k] * (6 / (xs[k + 1] - xs[k])) * dx;
      f += fp * dx;
    }
    const pend0 = (raw[N].y - raw[0].y) / 12, alpha = R.rand() * 0.8;
    raw.forEach(q => { q.y -= alpha * pend0 * q.x; });
    const ymin = Math.min(...raw.map(q => q.y)), ymax = Math.max(...raw.map(q => q.y));
    const mid = (ymin + ymax) / 2, esc = 4.5 / ((ymax - ymin) / 2 || 1), desp = R.rand() * 2 - 1;
    const pts = raw.map(q => [q.x, (q.y - mid) * esc + desp]);
    const yEn = x => pts[Math.round((x + 6) / dx)][1];
    return { pts: pts.filter((_, i) => i % 5 === 0), xs, inflex: inflex.map(x => [x, yEn(x)]), tipos: signos.map(s => (s > 0 ? 'concava' : 'convexa')) };
  }
  function genCurvatura(R) {
    const g = curvatura(R), L = cuadricula();
    g.inflex.forEach(([x]) => L.linea(X(x), Y(-LIM), X(x), Y(LIM), { grosor: 0.8, discontinua: true, trazo: '#555' }));
    polilinea(L, g.pts);
    g.inflex.forEach(([x, y]) => L.punto(X(x), Y(y), 2.4));
    const Cc = intervalosDe(g.xs, g.tipos, 'concava'), Cx = intervalosDe(g.xs, g.tipos, 'convexa');
    const lectura = g.tipos.map((t, i) => `entre \\(x = ${n(g.xs[i])}\\) y \\(x = ${n(g.xs[i + 1])}\\) tiene forma de ${t === 'concava' ? '∪ (cóncava)' : '∩ (convexa)'}`).join('; ');
    const inflTxt = g.inflex.length === 1 ? `el punto de inflexión \\(x = ${n(g.inflex[0][0])}\\)` : `los puntos de inflexión \\(x = ${n(g.inflex[0][0])}\\) y \\(x = ${n(g.inflex[1][0])}\\)`;
    return {
      html: true,
      enun: figura(cerrarGraf(L)),
      pasos: [
        { t: `Nos fijamos en la forma de la curva, no en si sube o baja. Los tramos se separan en ${inflTxt}: ${lectura}.` },
        { t: 'Escribimos los intervalos abiertos, con valores de \\(x\\):', m: `\\text{Cóncava } (\\cup): ${intTeX(Cc)} \\qquad \\text{Convexa } (\\cap): ${intTeX(Cx)}` }
      ],
      res: `\\text{Cóncava en } ${intTeX(Cc)}; \\quad \\text{convexa en } ${intTeX(Cx)}`
    };
  }

  /* ================= 4. Máximos y mínimos ================= */
  /* Ficha: 3 o 4 extremos relativos alternos en abscisas enteras (de −5 a 5, separadas 2 o 3),
     ordenadas enteras |y| ≤ 5 con un único máximo y un único mínimo absolutos; los extremos
     del dominio quedan estrictamente entre ambos. Curva de Hermite con pendiente 0 en los nodos. */
  function curvaPorNodos(kx, ky) {
    const k = kx.length;
    const m = kx.map((_, i) => (i === 0 ? (ky[1] - ky[0]) / (kx[1] - kx[0]) : i === k - 1 ? (ky[k - 1] - ky[k - 2]) / (kx[k - 1] - kx[k - 2]) : 0));
    return x => {
      let i = 0; while (i < k - 2 && x > kx[i + 1]) i++;
      const h = kx[i + 1] - kx[i], t = (x - kx[i]) / h, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * ky[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ky[i + 1] + (t3 - t2) * h * m[i + 1];
    };
  }
  function extremos(R) {
    for (;;) {
      const k = R.int(3, 4), xsT = [];
      let x = R.int(-5, -3);
      for (let i = 0; i < k; i++) { xsT.push(x); x += R.int(2, 3); }
      if (xsT[k - 1] > 5) continue;
      const empiezaMax = R.rand() < 0.5;
      const clase = xsT.map((_, i) => ((i % 2 === 0) === empiezaMax ? 'max' : 'min'));
      const ys = xsT.map(() => R.int(-5, 5));
      let ok = true;
      for (let i = 1; i < k; i++) {
        if (abs(ys[i] - ys[i - 1]) < 2) ok = false;
        if (clase[i] === 'max' && ys[i] <= ys[i - 1]) ok = false;
        if (clase[i] === 'min' && ys[i] >= ys[i - 1]) ok = false;
      }
      if (!ok) continue;
      const gmax = Math.max(...ys), gmin = Math.min(...ys);
      if (ys.filter(v => v === gmax).length !== 1 || ys.filter(v => v === gmin).length !== 1) continue;
      const extremo = (c, yv) => {
        const lo = c === 'max' ? gmin + 1 : yv + 1, hi = c === 'max' ? yv - 1 : gmax - 1;
        return lo > hi ? null : R.int(lo, hi);
      };
      const y0 = extremo(clase[0], ys[0]), yN = extremo(clase[k - 1], ys[k - 1]);
      if (y0 === null || yN === null) continue;
      const puntos = xsT.map((xx, i) => ({
        x: xx, y: ys[i], letra: 'ABCD'[i],
        tipo: clase[i] === 'max' ? (ys[i] === gmax ? 'maxAbs' : 'maxRel') : (ys[i] === gmin ? 'minAbs' : 'minRel')
      }));
      return { kx: [-6, ...xsT, 6], ky: [y0, ...ys, yN], puntos };
    }
  }
  const NOMBRE_EXT = { maxAbs: 'máximo relativo y absoluto', maxRel: 'máximo relativo', minAbs: 'mínimo relativo y absoluto', minRel: 'mínimo relativo' };
  function genExtremos(R) {
    const g = extremos(R), L = cuadricula(), fn = curvaPorNodos(g.kx, g.ky);
    curva(L, fn, -6, 6, 0.08);
    L.punto(X(-6), Y(g.ky[0]), 2.2).punto(X(6), Y(g.ky[g.ky.length - 1]), 2.2);
    g.puntos.forEach(q => {
      L.punto(X(q.x), Y(q.y), 2.6);
      const esMax = q.tipo.startsWith('max');
      if (q.x === 0) L.texto(X(q.x) + 5, Y(q.y) + (esMax ? -4 : 11), q.letra, { tam: 10, peso: 700, ancla: 'start' });   // no tapar el eje Y
      else L.texto(X(q.x), Y(q.y) + (esMax ? -5 : 12), q.letra, { tam: 10, peso: 700 });
    });
    const pMax = g.puntos.find(q => q.tipo === 'maxAbs'), pMin = g.puntos.find(q => q.tipo === 'minAbs');
    const lineas = g.puntos.map(q => {
      const esMax = q.tipo.startsWith('max');
      const motivo = esMax ? 'pasa de crecer a decrecer' : 'pasa de decrecer a crecer';
      const abso = q.tipo === 'maxAbs' ? '; además es el punto más alto de toda la gráfica' : q.tipo === 'minAbs' ? '; además es el punto más bajo de toda la gráfica' : '';
      return `<b>${q.letra}</b>${ptTxt(q.x, q.y)}: la función ${motivo}, así que es un ${NOMBRE_EXT[q.tipo]}${abso}.`;
    });
    return {
      html: true,
      enun: figura(cerrarGraf(L, 'Gráfica de la función con puntos señalados')),
      pasos: [
        { t: lineas.join('<br>') },
        { t: 'Un extremo relativo es más alto (o más bajo) que los puntos de su alrededor; el absoluto es el más alto (o más bajo) de toda la gráfica. Los extremos del dominio, \\(x = -6\\) y \\(x = 6\\), quedan entre ambos valores.', m: `\\text{Máximo absoluto: } ${ptTeX(pMax.x, pMax.y)} \\qquad \\text{Mínimo absoluto: } ${ptTeX(pMin.x, pMin.y)}` }
      ],
      res: `\\text{Máx. absoluto } ${ptTeX(pMax.x, pMax.y)}, \\; \\text{mín. absoluto } ${ptTeX(pMin.x, pMin.y)}`,
      resHtml: g.puntos.map(q => `${q.letra}: ${NOMBRE_EXT[q.tipo]}`).join('; ') + `.<br>Máximo absoluto en \\(${ptTeX(pMax.x, pMax.y)}\\); mínimo absoluto en \\(${ptTeX(pMin.x, pMin.y)}\\).`
    };
  }

  /* ================= 5. Función lineal ================= */
  /* Ficha: f(x) = m·x + n con m entre −6 y 6 (no nula) y n entre −6 y 6. */
  function genLineal(R) {
    const m = R.nz(-6, 6), b = R.int(-6, 6);
    const mono = m > 0 ? 'creciente' : 'decreciente';
    return {
      enun: `f(x) = ${bin(m, b)}`,
      pasos: [
        { t: 'En \\(f(x) = mx + n\\), la pendiente \\(m\\) es el número que multiplica a \\(x\\) y la ordenada en el origen \\(n\\) es el término independiente (el valor de \\(f(0)\\)):', m: `m = ${n(m)}, \\qquad n = ${n(b)}` },
        { t: `La pendiente es ${m > 0 ? 'positiva' : 'negativa'}, así que la recta es ${mono}.` }
      ],
      res: `m = ${n(m)}, \\; n = ${n(b)}, \\; \\text{${mono}}`
    };
  }

  /* ================= 6. Elige la función correcta ================= */
  /* Ficha: parábola a(x − h)² + k con a ∈ {±1, ±2}, |h| ≤ 3 y vértice dentro de la cuadrícula;
     dos distractores con el coeficiente de x² de signo contrario (uno es la misma expresión
     cambiando ese signo). Los términos de cada opción aparecen en orden aleatorio. */
  const LETRAS = ['A', 'B', 'C'];
  function genEleccion(R) {
    let a, b, c, ops;
    for (;;) {
      a = R.pick([1, -1, 2, -2]);
      const h = R.int(-3, 3), k = a > 0 ? R.int(-5, 1) : R.int(-1, 5);
      b = -2 * a * h; c = a * h * h + k;
      const d1 = { a: -a, b, c };
      const d2 = { a: -Math.sign(a) * R.int(1, 3), b: R.int(-4, 4), c: R.int(-6, 6) };
      const clave = f => `${f.a},${f.b},${f.c}`;
      if (new Set([clave({ a, b, c }), clave(d1), clave(d2)]).size < 3) continue;
      ops = R.shuffle([{ a, b, c, ok: true }, Object.assign({ ok: false }, d1), Object.assign({ ok: false }, d2)])
        .map(o => Object.assign(o, { tex: poli(R.shuffle([[o.a, 'x^2'], [o.b, 'x'], [o.c, '']])) }));
      break;
    }
    const L = cuadricula();
    curva(L, x => a * x * x + b * x + c, -6, 6, 0.05);
    const iOk = ops.findIndex(o => o.ok), conc = a > 0;
    const opciones = ops.map((o, i) => `<span>${LETRAS[i]}) \\(f(x) = ${o.tex}\\)</span>`).join('');
    return {
      html: true,
      enun: figura(cerrarGraf(L, 'Gráfica de una parábola'), opciones),
      pasos: [
        { t: `a) La parábola se abre hacia ${conc ? 'arriba (∪), así que es <b>cóncava</b>' : 'abajo (∩), así que es <b>convexa</b>'}.` },
        { t: `b) En \\(f(x) = ax^2 + bx + c\\), la parábola es cóncava si \\(a > 0\\) y convexa si \\(a < 0\\). Miramos el coeficiente de \\(x^2\\) de cada opción, esté donde esté escrito:`, m: ops.map((o, i) => `\\text{${LETRAS[i]})}\\; a = ${n(o.a)}`).join(' \\qquad ') },
        { t: `Solo la opción ${LETRAS[iOk]}) tiene el coeficiente de \\(x^2\\) ${conc ? 'positivo' : 'negativo'}.` }
      ],
      res: `\\text{a) ${conc ? 'Cóncava' : 'Convexa'};}\\quad \\text{b) ${LETRAS[iOk]})}\\; f(x) = ${ops[iOk].tex}`
    };
  }

  /* ================= 7. Tabla de valores y gráfica de una parábola ================= */
  /* Ficha: f(x) = ax² + bx + c con a ∈ {±1, ±2}, b entre −3 y 3 (b = 0 menos a menudo),
     c entre −5 y 5 y los cinco valores f(−2), …, f(2) con |y| ≤ 5. */
  const XS7 = [-2, -1, 0, 1, 2];
  function tablaTeX(ys) {
    const hueco = '\\phantom{-00}';
    return `\\begin{array}{|c|c|c|c|c|c|} \\hline x & ${XS7.map(n).join(' & ')} \\\\ \\hline f(x) & ${XS7.map((_, i) => (ys ? n(ys[i]) : hueco)).join(' & ')} \\\\ \\hline \\end{array}`;
  }
  /* Sustitución escrita: a·(x)² + b·(x) + c = … */
  function sustitucion(a, b, c, x) {
    if (x === 0) return `f(0) = ${n(c)}`;
    const coef = (k, s, primero) => {
      const signo = k < 0 ? (primero ? '-' : ' - ') : (primero ? '' : ' + ');
      return signo + (abs(k) === 1 ? '' : `${abs(k)} \\cdot `) + s;
    };
    const xs = x < 0 ? `(${n(x)})` : n(x);           // el negativo, entre paréntesis
    let t = coef(a, `${a === -1 ? `(${n(x)})` : xs}^2`, true);   // con a = −1, «−(1)²» y no «−1²»
    if (b) t += coef(b, xs, false);
    if (c) t += (c < 0 ? ' - ' : ' + ') + abs(c);
    const nums = poli([[a * x * x, ''], [b * x, ''], [c, '']]);
    const v = a * x * x + b * x + c;
    const cuantos = [a * x * x, b * x, c].filter(k => k !== 0).length;
    return `f(${n(x)}) = ${t} = ${cuantos > 1 ? `${nums} = ` : ''}${n(v)}`;
  }
  function genTabla(R) {
    let a, b, c, ys;
    for (;;) {
      a = R.pick([1, -1, 1, -1, 2, -2]); b = R.int(-3, 3); c = R.int(-5, 5);
      if (b === 0 && R.rand() < 0.6) continue;
      ys = XS7.map(x => a * x * x + b * x + c);
      if (ys.some(y => abs(y) > 5)) continue;
      break;
    }
    const vacia = cuadricula();
    const llena = cuadricula();
    curva(llena, x => a * x * x + b * x + c, -6, 6, 0.05);
    XS7.forEach((x, i) => llena.punto(X(x), Y(ys[i]), 2.4));
    return {
      html: true,
      enun: figura(`<span>\\(f(x) = ${cuad(a, b, c)}\\)</span><span>\\(${tablaTeX(null)}\\)</span>${cerrarGraf(vacia, 'Cuadrícula para dibujar la gráfica')}`),
      pasos: [
        { t: 'Sustituimos cada valor de \\(x\\); el número negativo va entre paréntesis y primero se calcula la potencia:', m: `\\begin{array}{l} ${XS7.map(x => sustitucion(a, b, c, x)).join(' \\\\ ')} \\end{array}` },
        { t: 'Tabla de valores:', m: tablaTeX(ys) },
        { t: `Cada columna \\((x, y)\\) es un punto. Los unimos con una curva suave: es una parábola ${a > 0 ? 'cóncava ∪, porque \\(a > 0\\)' : 'convexa ∩, porque \\(a < 0\\)'}.`, html: cerrarGraf(llena, 'Gráfica de la parábola con los puntos de la tabla') }
      ],
      res: tablaTeX(ys)
    };
  }

  registrarFicha({
    id: 'pend3-funciones',
    titulo: 'Funciones',
    detalle: '3.º ESO',
    grupo: 'Recuperación de 3.º ESO',
    enlace: '../pendientes/tercero/funciones-3.html',
    ejercicios: [
      { id: 'cortes', nombre: 'Puntos de corte con los ejes', peso: 1, columnas: 2,
        enunciado: ['Calcula los puntos de corte con los ejes de la función:', 'Calcula los puntos de corte con los ejes de cada función:'], generar: genCortes },
      { id: 'monotonia', nombre: 'Crecimiento y decrecimiento (gráfica)', peso: 1, columnas: 2,
        enunciado: ['La gráfica representa una función definida en [−6, 6]. Escribe los intervalos en los que crece y en los que decrece:', 'Cada gráfica representa una función definida en [−6, 6]. Escribe los intervalos en los que crece y en los que decrece:'], generar: genMonotonia },
      { id: 'curvatura', nombre: 'Concavidad y convexidad (gráfica)', peso: 1, columnas: 2,
        enunciado: ['Los puntos marcados son puntos de inflexión. Escribe los intervalos en los que la función es cóncava (∪) y en los que es convexa (∩):', 'Los puntos marcados son puntos de inflexión. Escribe los intervalos en los que cada función es cóncava (∪) y en los que es convexa (∩):'], generar: genCurvatura },
      { id: 'extremos', nombre: 'Máximos y mínimos (gráfica)', peso: 1, columnas: 2,
        enunciado: ['La gráfica representa una función definida en [−6, 6]. Clasifica los puntos señalados (máximo o mínimo, relativo o absoluto) y escribe las coordenadas del máximo y del mínimo absolutos:', 'Cada gráfica representa una función definida en [−6, 6]. Clasifica los puntos señalados (máximo o mínimo, relativo o absoluto) y escribe las coordenadas del máximo y del mínimo absolutos:'], generar: genExtremos },
      { id: 'lineal', nombre: 'Función lineal: pendiente y ordenada', peso: 0.5, columnas: 3,
        enunciado: ['Indica la pendiente, la ordenada en el origen y si la función es creciente o decreciente:', 'Indica la pendiente, la ordenada en el origen y si cada función es creciente o decreciente:'], generar: genLineal },
      { id: 'eleccion', nombre: 'Elige la función de la parábola', peso: 1, columnas: 2,
        enunciado: ['Observa la parábola. a) ¿Es cóncava o convexa? b) ¿Cuál de las tres funciones le corresponde? Justifícalo.', 'Observa cada parábola. a) ¿Es cóncava o convexa? b) ¿Cuál de las tres funciones le corresponde? Justifícalo.'], generar: genEleccion },
      { id: 'tabla', nombre: 'Tabla de valores y gráfica de una parábola', peso: 1.25, columnas: 2,
        enunciado: ['Completa la tabla de valores y representa la función en la cuadrícula:', 'Completa la tabla de valores y representa cada función en la cuadrícula:'], generar: genTabla }
    ]
  });
})();
