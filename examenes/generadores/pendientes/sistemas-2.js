/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Sistemas de ecuaciones (pendientes de 2.º ESO).
   Mismos criterios que la ficha pendientes/segundo/sistemas-2.html: soluciones enteras
   entre −6 y 6 (sin la solución trivial x = 0, y = 0, también excluida ahora en la ficha)
   y coeficientes preparados para cada método:
   - sustitución: una incógnita con coeficiente ±1;
   - igualación: la misma incógnita con coeficiente ±1 en las dos ecuaciones;
   - reducción: la misma incógnita con el mismo coeficiente en las dos ecuaciones,
     de modo que basta multiplicar una por −1 y sumar. */
(function () {
  'use strict';
  const { tex, registrarFicha, despejeLineal } = window.EX;
  const { n, p, poli } = tex;

  const abs = Math.abs;
  const ord = i => (i === 1 ? '1.ª' : '2.ª');
  const otra = v => (v === 'x' ? 'y' : 'x');
  const ecTeX = q => `${poli([[q.x, 'x'], [q.y, 'y']])} = ${n(q.e)}`;
  const sistemaTeX = (q1, q2) => `\\begin{cases} ${ecTeX(q1)} \\\\ ${ecTeX(q2)} \\end{cases}`;
  const resultado = (x0, y0) => `x = ${n(x0)},\\quad y = ${n(y0)}`;
  const coefNoUnidad = R => R.int(2, 6) * R.signo();
  const armar = (a, b, c, d, x0, y0) => ({
    q1: { x: a, y: b, e: a * x0 + b * y0 }, q2: { x: c, y: d, e: c * x0 + d * y0 }, x0, y0
  });
  const solucion = R => { let x0, y0; do { x0 = R.int(-6, 6); y0 = R.int(-6, 6); } while (x0 === 0 && y0 === 0); return [x0, y0]; };

  /* Término con signo; cuerpo = 'x' o un valor entre paréntesis (con punto de multiplicar) */
  function termino(k, cuerpo, primero, conPunto) {
    const a = abs(k);
    const t = a === 1 ? cuerpo : a + (conPunto ? ' \\cdot ' : '') + cuerpo;
    if (primero) return (k < 0 ? '-' : '') + t;
    return (k < 0 ? ' - ' : ' + ') + t;
  }
  /* u = K + M·v despejada de q (coeficiente de u = ±1) */
  function despejar(q, u) {
    const v = otra(u), s = q[u];
    const K = s * q.e, M = -s * q[v];
    return { u, v, K, M, tex: poli([[K, ''], [M, v]]) };
  }
  /* u = K + M·v0, mostrando la sustitución */
  function evaluar(ex, v0) {
    const prod = abs(ex.M) === 1 ? p(v0) : `${abs(ex.M)} \\cdot ${p(v0)}`;
    const cuerpo = ex.K !== 0 ? `${n(ex.K)} ${ex.M < 0 ? '-' : '+'} ${prod}` : `${ex.M < 0 ? '-' : ''}${prod}`;
    return `${ex.u} = ${cuerpo} = ${n(ex.K + ex.M * v0)}`;
  }

  /* k·u = e − cv → u, sin escribir «− 0» ni repetir la ecuación */
  function despejeFinal(k, e, cv, u) {
    const r = e - cv, lin = despejeLineal(k, r, u).m;
    if (cv === 0) return lin;
    const ini = `${poli([[k, u]])} = ${n(e)} ${cv < 0 ? '+' : '-'} ${abs(cv)}`;
    return k === 1 ? `${ini} = ${n(r)}` : `${ini} = ${n(r)} \\;\\Rightarrow\\; ${lin.replace(/^.*?\\Rightarrow\\; /, '')}`;
  }

  /* ================= Sustitución ================= */
  function genSustitucion(R) {
    let a, b, c, d, x0, y0, slot, i = 0;
    do {
      i++; [x0, y0] = solucion(R);
      slot = R.pick(['a', 'b', 'c', 'd']);
      const u = R.signo();
      a = slot === 'a' ? u : coefNoUnidad(R); b = slot === 'b' ? u : coefNoUnidad(R);
      c = slot === 'c' ? u : coefNoUnidad(R); d = slot === 'd' ? u : coefNoUnidad(R);
    } while (a * d - b * c === 0 && i < 300);
    const S = armar(a, b, c, d, x0, y0);
    const ie = slot === 'a' || slot === 'b' ? 1 : 2, u = slot === 'a' || slot === 'c' ? 'x' : 'y', v = otra(u);
    const q = S['q' + ie], qo = S['q' + (3 - ie)];
    const ex = despejar(q, u);
    const pu = qo[u], pv = qo[v];
    const trozo = primero => (pu < 0 ? (primero ? '-' : ' - ') : (primero ? '' : ' + ')) + abs(pu) + `(${ex.tex})`;
    const termV = primero => termino(pv, v, primero, false);
    const sustituida = u === 'x' ? trozo(true) + termV(false) : termV(true) + trozo(false);
    const exp = [[pu * ex.K, ''], [pu * ex.M, v]];
    const k = pu * ex.M + pv, r = qo.e - pu * ex.K;
    const v0 = v === 'x' ? x0 : y0;
    return {
      enun: sistemaTeX(S.q1, S.q2),
      pasos: [
        { t: `Despejamos \\(${u}\\) en la ${ord(ie)} ecuación, porque tiene coeficiente ${q[u]}:`.replace(/coeficiente -1/, 'coeficiente −1'), m: `${u} = ${ex.tex}` },
        { t: `Sustituimos en la ${ord(3 - ie)} ecuación:`, m: `${sustituida} = ${n(qo.e)}` },
        { t: 'Quitamos el paréntesis:', m: `${poli(u === 'x' ? [...exp, [pv, v]] : [[pv, v], ...exp])} = ${n(qo.e)}` },
        { t: 'Agrupamos y despejamos:', m: despejeFinal(k, qo.e, pu * ex.K, v) },
        { t: `Sustituimos \\(${v} = ${n(v0)}\\) en la expresión despejada:`, m: evaluar(ex, v0) }
      ],
      res: resultado(x0, y0)
    };
  }

  /* ================= Igualación ================= */
  function genIgualacion(R) {
    let a, b, c, d, x0, y0, u, i = 0;
    do {
      i++; [x0, y0] = solucion(R);
      u = R.rand() < 0.5 ? 'x' : 'y';
      const s1 = R.signo(), s2 = R.signo();
      if (u === 'x') { a = s1; c = s2; b = coefNoUnidad(R); d = coefNoUnidad(R); }
      else { b = s1; d = s2; a = coefNoUnidad(R); c = coefNoUnidad(R); }
    } while (a * d - b * c === 0 && i < 500);
    const S = armar(a, b, c, d, x0, y0), v = otra(u);
    const e1 = despejar(S.q1, u), e2 = despejar(S.q2, u);
    const k = e1.M - e2.M, r = e2.K - e1.K;
    const v0 = v === 'x' ? x0 : y0;
    return {
      enun: sistemaTeX(S.q1, S.q2),
      pasos: [
        { t: `Despejamos \\(${u}\\) en las dos ecuaciones (tiene coeficiente 1 o −1 en ambas):`, m: `${u} = ${e1.tex} \\qquad ${u} = ${e2.tex}` },
        { t: 'Igualamos las dos expresiones:', m: `${e1.tex} = ${e2.tex}` },
        { t: `Pasamos los términos en \\(${v}\\) a un miembro y los números al otro:`, m: `${poli([[e1.M, v], [-e2.M, v]])} = ${poli([[e2.K, ''], [-e1.K, '']])}` },
        { t: 'Operamos y despejamos:', m: despejeLineal(k, r, v).m },
        { t: `Sustituimos \\(${v} = ${n(v0)}\\) en la primera expresión:`, m: evaluar(e1, v0) }
      ],
      res: resultado(x0, y0)
    };
  }

  /* ================= Reducción ================= */
  function genReduccion(R) {
    let a, b, c, d, x0, y0, u, i = 0;
    do {
      i++; [x0, y0] = solucion(R);
      u = R.rand() < 0.5 ? 'x' : 'y';
      const k = R.int(1, 6) * R.signo();
      if (u === 'x') { a = k; c = k; b = coefNoUnidad(R); d = coefNoUnidad(R); }
      else { b = k; d = k; a = coefNoUnidad(R); c = coefNoUnidad(R); }
    } while ((a * d - b * c === 0 || (u === 'x' ? abs(b) === abs(d) : abs(a) === abs(c))) && i < 500);
    const S = armar(a, b, c, d, x0, y0), v = otra(u);
    const q1 = S.q1, m2 = { x: -S.q2.x, y: -S.q2.y, e: -S.q2.e };
    const kv = q1[v] + m2[v], ke = q1.e + m2.e;
    /* Suma en columnas: x, signo, y, =, término independiente */
    const fila = q => {
      const tx = poli([[q.x, 'x']]), ty = poli([[abs(q.y), 'y']]);
      return `${tx} & ${q.y < 0 ? '-' : '+'} & ${ty} & = & ${n(q.e)}`;
    };
    const suma = u === 'x' ? ` & & ${poli([[kv, 'y']])} & = & ${n(ke)}` : `${poli([[kv, 'x']])} & & & = & ${n(ke)}`;
    const cuenta = `\\begin{array}{rcrcr} ${fila(q1)} \\\\ ${fila(m2)} \\\\ \\hline ${suma} \\end{array}`;
    const v0 = v === 'x' ? x0 : y0, u0 = u === 'x' ? x0 : y0;
    // Se sustituye en la 1.ª ecuación: q1[u]·u + q1[v]·v0 = e1
    const cv = q1[v] * v0;
    const sust = (u === 'x'
      ? termino(q1.x, 'x', true, false) + termino(q1.y, p(v0), false, true)
      : termino(q1.x, p(v0), true, true) + termino(q1.y, 'y', false, false)) + ` = ${n(q1.e)}`;
    return {
      enun: sistemaTeX(S.q1, S.q2),
      pasos: [
        { t: `La incógnita \\(${u}\\) tiene el mismo coeficiente en las dos ecuaciones. Multiplicamos la 2.ª por \\(-1\\) y sumamos, así \\(${u}\\) se elimina:`, m: cuenta },
        { t: 'Despejamos:', m: despejeLineal(kv, ke, v).m },
        { t: `Sustituimos \\(${v} = ${n(v0)}\\) en la 1.ª ecuación:`, m: sust },
        { t: 'Despejamos:', m: despejeFinal(q1[u], q1.e, cv, u) }
      ],
      res: resultado(x0, y0)
    };
  }

  registrarFicha({
    id: 'pend2-sistemas',
    titulo: 'Sistemas de ecuaciones',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/sistemas-2.html',
    ejercicios: [
      { id: 'sustitucion', nombre: 'Método de sustitución', peso: 1, columnas: 2,
        enunciado: ['Resuelve por el método de sustitución:', 'Resuelve por el método de sustitución:'], generar: genSustitucion },
      { id: 'igualacion', nombre: 'Método de igualación', peso: 1, columnas: 2,
        enunciado: ['Resuelve por el método de igualación:', 'Resuelve por el método de igualación:'], generar: genIgualacion },
      { id: 'reduccion', nombre: 'Método de reducción', peso: 1, columnas: 2,
        enunciado: ['Resuelve por el método de reducción:', 'Resuelve por el método de reducción:'], generar: genReduccion }
    ]
  });
})();
