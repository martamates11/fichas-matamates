/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: sistemas de dos ecuaciones lineales con dos incógnitas
   (sustitución, igualación y reducción; niveles básico y medio).
   Los números se generan con los mismos criterios que las fichas interactivas. */
(function () {
  'use strict';
  const { mcm, tex, despejeLineal, registrarFicha } = window.EX;
  const { n, p, poli } = tex;

  /* ---------- Escritura ---------- */
  const ecTeX = q => `${poli([[q.x, 'x'], [q.y, 'y']])} = ${n(q.e)}`;
  const sistemaTeX = (q1, q2) => `\\begin{cases} ${ecTeX(q1)} \\\\ ${ecTeX(q2)} \\end{cases}`;
  const ord = i => (i === 1 ? '1.ª' : '2.ª');
  const otra = v => (v === 'x' ? 'y' : 'x');

  /* Término con signo; cuerpo = 'x' o '\cdot (−3)' */
  function termino(k, cuerpo, primero, conPunto) {
    const abs = Math.abs(k);
    const coef = abs === 1 && !conPunto ? '' : String(abs);
    const sep = conPunto ? ' \\cdot ' : '';
    const t = abs === 1 && conPunto ? cuerpo : coef + sep + cuerpo;
    if (primero) return (k < 0 ? '-' : '') + t;
    return (k < 0 ? ' - ' : ' + ') + t;
  }
  /* Ecuación con una incógnita ya sustituida por su valor */
  function sustituido(q, conocida, valor) {
    let s = '';
    ['x', 'y'].forEach((v, i) => {
      s += v === conocida ? termino(q[v], p(valor), i === 0, true) : termino(q[v], v, i === 0, false);
    });
    return `${s} = ${n(q.e)}`;
  }

  /* u = (K + M·v) / den, con den > 0 */
  function despejar(q, u) {
    const v = otra(u), cu = q[u], sg = cu < 0 ? -1 : 1;
    const K = sg * q.e, M = -sg * q[v], den = Math.abs(cu);
    const cuerpo = poli([[K, ''], [M, v]]);
    return { u, v, K, M, den, cuerpo, tex: den === 1 ? cuerpo : `\\frac{${cuerpo}}{${den}}` };
  }
  /* Valor de u = (K + M·v0)/den mostrando la sustitución */
  function evaluar(ex, v0) {
    let num = ex.K !== 0 ? n(ex.K) + termino(ex.M, p(v0), false, true) : termino(ex.M, p(v0), true, true);
    const val = (ex.K + ex.M * v0) / ex.den;
    let m = ex.den === 1 ? `${ex.u} = ${num} = ${n(val)}` : `${ex.u} = \\frac{${num}}{${ex.den}} = \\frac{${n(ex.K + ex.M * v0)}}{${ex.den}} = ${n(val)}`;
    return { m, val };
  }
  /* "k·(algo)" con k = ±1 sin escribir */
  const factor = k => (k === 1 ? '' : k === -1 ? '-' : n(k));

  function resultado(x0, y0) { return `x = ${n(x0)},\\quad y = ${n(y0)}`; }

  /* ---------- Generadores (criterios de las fichas) ---------- */
  const coefNoUnidad = R => R.int(2, 6) * R.signo();
  const coefEntero = R => R.int(1, 6) * R.signo();
  const armar = (a, b, c, d, x0, y0) => ({
    q1: { x: a, y: b, e: a * x0 + b * y0 },
    q2: { x: c, y: d, e: c * x0 + d * y0 },
    x0, y0
  });

  function genMedio(R) {
    let a, b, c, d, x0, y0, i = 0;
    do {
      i++; x0 = R.int(-6, 6); y0 = R.int(-6, 6);
      a = coefEntero(R); b = coefEntero(R); c = coefEntero(R); d = coefEntero(R);
    } while (a * d - b * c === 0 && i < 500);
    return armar(a, b, c, d, x0, y0);
  }

  function genSustitucion1(R) {
    let a, b, c, d, x0, y0, slot, den, i = 0;
    do {
      i++; x0 = R.int(-6, 6); y0 = R.int(-6, 6);
      slot = R.pick(['a', 'b', 'c', 'd']);
      const u = R.signo();
      a = slot === 'a' ? u : coefNoUnidad(R);
      b = slot === 'b' ? u : coefNoUnidad(R);
      c = slot === 'c' ? u : coefNoUnidad(R);
      d = slot === 'd' ? u : coefNoUnidad(R);
      den = a * d - b * c;
    } while (den === 0 && i < 300);
    return armar(a, b, c, d, x0, y0);
  }

  function genIgualacion1(R) {
    let a, b, c, d, x0, y0, i = 0;
    do {
      i++; x0 = R.int(-6, 6); y0 = R.int(-6, 6);
      const s1 = R.signo(), s2 = R.signo();
      if (R.rand() < 0.5) { a = s1; c = s2; b = coefNoUnidad(R); d = coefNoUnidad(R); }
      else { b = s1; d = s2; a = coefNoUnidad(R); c = coefNoUnidad(R); }
    } while (a * d - b * c === 0 && i < 500);
    return armar(a, b, c, d, x0, y0);
  }

  function genReduccion1(R) {
    let a, b, c, d, x0, y0, elim, i = 0;
    do {
      i++; x0 = R.int(-6, 6); y0 = R.int(-6, 6);
      elim = R.rand() < 0.5 ? 'x' : 'y';
      const k = R.int(1, 6) * R.signo();
      if (elim === 'x') { a = k; c = k; b = coefNoUnidad(R); d = coefNoUnidad(R); }
      else { b = k; d = k; a = coefNoUnidad(R); c = coefNoUnidad(R); }
    } while ((a * d - b * c === 0 || (elim === 'x' ? Math.abs(b) === Math.abs(d) : Math.abs(a) === Math.abs(c))) && i < 500);
    return armar(a, b, c, d, x0, y0);
  }

  /* ---------- Resolución por cada método ---------- */
  function porSustitucion(S) {
    // Se despeja la incógnita con menor coeficiente (preferentemente ±1)
    const opciones = [];
    [1, 2].forEach(i => ['x', 'y'].forEach(u => opciones.push({ i, u, k: Math.abs(S['q' + i][u]) })));
    const el = opciones.sort((A, B) => A.k - B.k)[0];
    const q = S['q' + el.i], qo = S['q' + (3 - el.i)];
    const u = el.u, v = otra(u);
    const ex = despejar(q, u);
    const pasos = [{ t: `Despejamos \\(${u}\\) en la ${ord(el.i)} ecuación:`, m: `${u} = ${ex.tex}` }];

    // Sustitución en la otra ecuación (respetando el orden x, y)
    const pu = qo[u], pv = qo[v];
    // Trozo «pu · (expresión)» con su signo; conFraccion indica si aún hay denominador
    const trozo = (primero, conFraccion) => {
      const sg = pu < 0 ? (primero ? '-' : ' - ') : (primero ? '' : ' + ');
      const abs = Math.abs(pu);
      if (conFraccion) return sg + (abs === 1 ? '' : abs + ' \\cdot ') + ex.tex;
      return sg + (abs === 1 ? '' : abs) + `(${ex.cuerpo})`;
    };
    const ordenado = (conFraccion, kv) => (u === 'x'
      ? trozo(true, conFraccion) + termino(kv, v, false, false)
      : termino(kv, v, true, false) + trozo(false, conFraccion));
    const D = ex.den;
    pasos.push({ t: `Sustituimos en la ${ord(3 - el.i)} ecuación:`, m: `${ordenado(D > 1, pv)} = ${n(qo.e)}` });
    if (D > 1) {
      pasos.push({ t: `Multiplicamos los dos miembros por ${D} para quitar el denominador:`,
        m: `${ordenado(false, pv * D)} = ${n(qo.e * D)}` });
    }
    const exp = [[pu * ex.K, ''], [pu * ex.M, v]];
    pasos.push({ t: 'Quitamos paréntesis:', m: `${poli(u === 'x' ? [...exp, [pv * D, v]] : [[pv * D, v], ...exp])} = ${n(qo.e * D)}` });
    const k = pu * ex.M + pv * D, r = qo.e * D - pu * ex.K;
    const lin = despejeLineal(k, r, v);
    pasos.push({ t: 'Agrupamos y despejamos:', m: lin.m });
    const v0 = v === 'x' ? S.x0 : S.y0;
    const ev = evaluar(ex, v0);
    pasos.push({ t: `Sustituimos \\(${v} = ${n(v0)}\\) en la expresión despejada:`, m: ev.m });
    return pasos;
  }

  function porIgualacion(S) {
    // Se despeja en las dos ecuaciones la incógnita más cómoda
    const coste = u => mcm(Math.abs(S.q1[u]), Math.abs(S.q2[u]));
    const u = coste('x') <= coste('y') ? 'x' : 'y', v = otra(u);
    const e1 = despejar(S.q1, u), e2 = despejar(S.q2, u);
    const pasos = [
      { t: `Despejamos \\(${u}\\) en las dos ecuaciones:`, m: `${u} = ${e1.tex} \\qquad ${u} = ${e2.tex}` },
      { t: 'Igualamos las dos expresiones:', m: `${e1.tex} = ${e2.tex}` }
    ];
    let k, r;
    if (e1.den === 1 && e2.den === 1) {
      pasos.push({ t: `Pasamos los términos en \\(${v}\\) a un miembro y los números al otro:`,
        m: `${poli([[e1.M, v], [-e2.M, v]])} = ${poli([[e2.K, ''], [-e1.K, '']])}` });
      k = e1.M - e2.M; r = e2.K - e1.K;
    } else {
      const fp = (k, c) => (k === 1 ? c : `${factor(k)}(${c})`);
      pasos.push({ t: 'Multiplicamos en cruz:', m: `${fp(e2.den, e1.cuerpo)} = ${fp(e1.den, e2.cuerpo)}` });
      pasos.push({ t: 'Quitamos paréntesis:', m: `${poli([[e2.den * e1.K, ''], [e2.den * e1.M, v]])} = ${poli([[e1.den * e2.K, ''], [e1.den * e2.M, v]])}` });
      pasos.push({ t: `Pasamos los términos en \\(${v}\\) a un miembro y los números al otro:`,
        m: `${poli([[e2.den * e1.M, v], [-e1.den * e2.M, v]])} = ${poli([[e1.den * e2.K, ''], [-e2.den * e1.K, '']])}` });
      k = e2.den * e1.M - e1.den * e2.M; r = e1.den * e2.K - e2.den * e1.K;
    }
    pasos.push({ t: 'Despejamos:', m: despejeLineal(k, r, v).m });
    const v0 = v === 'x' ? S.x0 : S.y0;
    pasos.push({ t: `Sustituimos \\(${v} = ${n(v0)}\\) en la primera expresión:`, m: evaluar(e1, v0).m });
    return pasos;
  }

  function porReduccion(S) {
    const coste = u => mcm(Math.abs(S.q1[u]), Math.abs(S.q2[u]));
    const u = coste('x') <= coste('y') ? 'x' : 'y', v = otra(u);
    const c1 = S.q1[u], c2 = S.q2[u];
    const pasos = [];
    let f1, f2;
    if (c1 === c2) { f1 = 1; f2 = -1; }
    else if (c1 === -c2) { f1 = 1; f2 = 1; }
    else {
      const L = mcm(Math.abs(c1), Math.abs(c2));
      f1 = L / Math.abs(c1); f2 = L / Math.abs(c2);
      if (Math.sign(c1) === Math.sign(c2)) f2 = -f2;
    }
    const m1 = { x: S.q1.x * f1, y: S.q1.y * f1, e: S.q1.e * f1 };
    const m2 = { x: S.q2.x * f2, y: S.q2.y * f2, e: S.q2.e * f2 };
    if (f1 === 1 && f2 === -1) {
      pasos.push({ t: `Los coeficientes de \\(${u}\\) son iguales: restamos las ecuaciones (1.ª − 2.ª) para eliminar \\(${u}\\):`,
        m: `${poli([[S.q1[v], v], [-S.q2[v], v]])} = ${n(S.q1.e)} - ${p(S.q2.e)}` });
    } else if (f1 === 1 && f2 === 1) {
      pasos.push({ t: `Los coeficientes de \\(${u}\\) son opuestos: sumamos las ecuaciones para eliminar \\(${u}\\):`,
        m: `${poli([[S.q1[v], v], [S.q2[v], v]])} = ${n(S.q1.e)} + ${p(S.q2.e)}` });
    } else {
      const txt = [f1 !== 1 ? `la 1.ª por \\(${n(f1)}\\)` : '', f2 !== 1 ? `la 2.ª por \\(${n(f2)}\\)` : ''].filter(Boolean).join(' y ');
      pasos.push({ t: `Para eliminar \\(${u}\\), multiplicamos ${txt}:`, m: sistemaTeX(m1, m2) });
      pasos.push({ t: 'Sumamos las dos ecuaciones:', m: `${poli([[m1[v], v], [m2[v], v]])} = ${n(m1.e)} + ${p(m2.e)}` });
    }
    const k = m1[v] + m2[v], r = m1.e + m2.e;
    pasos.push({ t: 'Despejamos:', m: despejeLineal(k, r, v).m });
    const v0 = v === 'x' ? S.x0 : S.y0;
    const r2 = S.q1.e - S.q1[v] * v0;
    pasos.push({ t: `Sustituimos \\(${v} = ${n(v0)}\\) en la 1.ª ecuación:`, m: sustituido(S.q1, v, v0) });
    pasos.push({ t: 'Despejamos:', m: despejeLineal(S.q1[u], r2, u).m });
    return pasos;
  }

  function ejercicio(gen, metodo) {
    return R => {
      const S = gen(R);
      return { enun: sistemaTeX(S.q1, S.q2), pasos: metodo(S), res: resultado(S.x0, S.y0) };
    };
  }

  const fichasSistemas = [
    ['sustitucion-1', 'sustitución', 'Nivel inicial', genSustitucion1, porSustitucion, 'Alguna incógnita con coeficiente ±1', 1.5],
    ['sustitucion-2', 'sustitución', 'Nivel medio', genMedio, porSustitucion, 'Coeficientes cualesquiera', 2],
    ['igualacion-1', 'igualación', 'Nivel básico', genIgualacion1, porIgualacion, 'La misma incógnita con coeficiente ±1', 1.5],
    ['igualacion-2', 'igualación', 'Nivel medio', genMedio, porIgualacion, 'Coeficientes cualesquiera', 2],
    ['reduccion-1', 'reducción', 'Nivel básico', genReduccion1, porReduccion, 'Una incógnita con el mismo coeficiente', 1.5],
    ['reduccion-2', 'reducción', 'Nivel medio', genMedio, porReduccion, 'Coeficientes cualesquiera', 2]
  ];
  fichasSistemas.forEach(([id, met, nivel, gen, res, nombre, peso]) => {
    registrarFicha({
      id,
      titulo: `Método de ${met}`,
      detalle: nivel,
      grupo: 'Sistemas de ecuaciones',
      enlace: `../sistemas/${id}.html`,
      ejercicios: [{
        id: 'sistema', nombre, peso, columnas: 3,
        enunciado: [`Resuelve por el método de ${met} el siguiente sistema:`, `Resuelve por el método de ${met} los siguientes sistemas:`],
        generar: ejercicio(gen, res)
      }]
    });
  });
})();
