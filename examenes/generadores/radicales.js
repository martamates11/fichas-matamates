/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: operaciones con radicales y racionalización de denominadores.
   Los números se generan con los mismos criterios que las fichas interactivas. */
(function () {
  'use strict';
  const { mcd, registrarFicha } = window.EX;
  const mcm = (a, b) => a / mcd(a, b) * b;
  const GRUPO = 'Radicales y logaritmos';

  /* ---------- Utilidades ---------- */
  function factorizar(n) {
    const f = {}; let d = 2;
    while (d * d <= n) { while (n % d === 0) { f[d] = (f[d] || 0) + 1; n /= d; } d++; }
    if (n > 1) f[n] = (f[n] || 0) + 1;
    return f;
  }
  const coprimoCon = (R, a) => { const op = []; for (let s = 1; s < a; s++) if (mcd(s, a) === 1) op.push(s); return R.pick(op); };
  /* N = k²·m con m libre de cuadrados */
  function partirCuadrado(N) {
    let k = 1, m = 1;
    const f = factorizar(N);
    Object.keys(f).forEach(p => { k *= Math.pow(+p, Math.floor(f[p] / 2)); m *= Math.pow(+p, f[p] % 2); });
    return { k, m };
  }

  /* ---------- TeX ---------- */
  const tRaiz = (n, dentro) => (n === 2 ? `\\sqrt{${dentro}}` : `\\sqrt[${n}]{${dentro}}`);
  const tPot = (b, e) => (e === 1 ? `${b}` : `${b}^{${e}}`);
  function tCR(c, n, r) {
    const Rd = tRaiz(n, r);
    if (c === 1) return Rd;
    if (c === -1) return '-' + Rd;
    return `${c}${Rd}`;
  }
  function tFact(n) {
    if (n === 1) return '1';
    const f = factorizar(n);
    return Object.keys(f).map(p => tPot(p, f[p])).join('\\cdot ');
  }
  /* Coeficiente·√r sobre q (q > 0), ya simplificado */
  function tCRsobre(c, n, r, q) {
    const num = tCR(c, n, r);
    return q === 1 ? num : `\\frac{${num}}{${q}}`;
  }

  /* ================================================================
     OPERACIONES CON RADICALES
     ================================================================ */

  /* ---------- Extraer factores ---------- */
  function extraer(R) {
    let n, m, k, a, N;
    for (;;) {
      n = R.rand() < 0.62 ? 2 : 3;
      if (n === 2) { m = R.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]); k = R.int(2, 12); a = R.rand() < 0.4 ? R.int(2, 5) : 1; }
      else { m = R.pick([2, 3, 4, 5, 6, 7, 9, 10]); k = R.int(2, 6); a = R.rand() < 0.35 ? R.int(2, 3) : 1; }
      N = Math.pow(k, n) * m;
      if (N <= 1200) break;
    }
    const C = a * k;
    const enun = tCR(a, n, N);
    const f = factorizar(N), fuera = [], dentro = [];
    Object.keys(f).forEach(p => {
      const q = Math.floor(f[p] / n), r = f[p] % n;
      if (q > 0) fuera.push(tPot(p, q));
      if (r > 0) dentro.push(tPot(p, r));
    });
    const aPref = a > 1 ? `${a}\\cdot ` : '';
    return {
      enun,
      pasos: [
        { t: 'Descomponemos el radicando en factores primos:', m: `${enun} = ${aPref}${tRaiz(n, tFact(N))}` },
        { t: `Dividimos cada exponente entre el índice (${n}): el cociente es el exponente con el que el factor sale fuera y el resto, el que se queda dentro.`,
          m: `${aPref}${tRaiz(n, tFact(N))} = ${aPref}${fuera.join('\\cdot ')}${tRaiz(n, dentro.join('\\cdot ') || '1')} = ${tCR(C, n, m)}` }
      ],
      res: tCR(C, n, m)
    };
  }

  /* ---------- Introducir factores ---------- */
  function introducir(R) {
    let n, a, b, Rd;
    for (;;) {
      const u = R.rand();
      n = u < 0.6 ? 2 : (u < 0.9 ? 3 : 4);
      if (n === 2) { a = R.int(2, 9); b = R.pick([2, 3, 5, 6, 7, 10, 11]); }
      else if (n === 3) { a = R.int(2, 5); b = R.pick([2, 3, 4, 5, 6, 7, 9]); }
      else { a = R.int(2, 3); b = R.pick([2, 3, 5]); }
      Rd = Math.pow(a, n) * b;
      if (Rd <= 800) break;
    }
    const enun = tCR(a, n, b);
    return {
      enun,
      pasos: [{ t: `El factor entra en el radical elevado al índice (${n}) y multiplica al radicando:`,
        m: `${enun} = ${tRaiz(n, `${tPot(a, n)}\\cdot ${b}`)} = ${tRaiz(n, `${Math.pow(a, n)}\\cdot ${b}`)} = ${tRaiz(n, Rd)}` }],
      res: tRaiz(n, Rd)
    };
  }

  /* ---------- Simplificar radicales ---------- */
  function simplificar(R) {
    let np, ep, d, p, n, e;
    for (;;) {
      np = R.int(2, 5); ep = R.int(1, np - 1);
      if (mcd(np, ep) !== 1) continue;
      d = R.int(2, 4); n = np * d; if (n > 20) continue;
      e = ep * d; p = R.pick([2, 3, 5, 7]);
      break;
    }
    const val = Math.pow(p, e);
    const comoNumero = val <= 2000 && R.rand() < 0.5;
    const enun = tRaiz(n, comoNumero ? val : tPot(p, e));
    const pasos = [];
    if (comoNumero) pasos.push({ t: 'Escribimos el radicando como potencia de un número primo:', m: `${enun} = ${tRaiz(n, tPot(p, e))}` });
    pasos.push({ t: `El m.c.d. del índice (${n}) y del exponente (${e}) es ${d}: dividimos ambos entre ${d}.`,
      m: `${tRaiz(n, tPot(p, e))} = \\sqrt[${n}:${d}]{${p}^{${e}:${d}}} = ${tRaiz(np, tPot(p, ep))}` });
    return { enun, pasos, res: tRaiz(np, tPot(p, ep)) };
  }

  /* ---------- Productos y cocientes con índices distintos ---------- */
  const PARES = [[2, 3], [2, 4], [2, 6], [3, 4], [3, 6], [4, 6]];
  const radicandoTex = (p, s, comoNumero) => (comoNumero ? String(Math.pow(p, s)) : tPot(p, s));
  const juntar = (op, x, y) => (op === 'prod' ? `${x}\\cdot ${y}` : `\\dfrac{${x}}{${y}}`);

  function mismaBase(op, a, b, s1, s2, p, comoNumero) {
    const Mc = mcm(a, b), X = Mc / a * s1, Y = Mc / b * s2;
    const E = op === 'prod' ? X + Y : X - Y;
    const g = mcd(E, Mc), E2 = E / g, M2 = Mc / g;
    const enun = juntar(op, tRaiz(a, radicandoTex(p, s1, comoNumero)), tRaiz(b, radicandoTex(p, s2, comoNumero)));
    const comoPot = juntar(op, tRaiz(a, tPot(p, s1)), tRaiz(b, tPot(p, s2)));
    const pasos = [];
    if (comoNumero) pasos.push({ t: `Escribimos los radicandos como potencias de ${p}:`, m: `${enun} = ${comoPot}` });
    pasos.push({ t: `Reducimos a índice común, \\(\\text{m.c.m.}(${a},${b}) = ${Mc}\\); cada exponente se multiplica por lo mismo que su índice:`,
      m: `${comoPot} = ${juntar(op, tRaiz(Mc, tPot(p, X)), tRaiz(Mc, tPot(p, Y)))}` });
    pasos.push({ t: op === 'prod'
      ? 'Con el mismo índice multiplicamos los radicandos; al ser potencias de la misma base, los exponentes se suman:'
      : 'Con el mismo índice dividimos los radicandos; al ser potencias de la misma base, los exponentes se restan:',
    m: `= ${tRaiz(Mc, `${p}^{${X}${op === 'prod' ? '+' : '-'}${Y}}`)} = ${tRaiz(Mc, tPot(p, E))}` });
    if (g > 1) pasos.push({ t: `Simplificamos dividiendo índice y exponente entre ${g}:`, m: `${tRaiz(Mc, tPot(p, E))} = ${tRaiz(M2, tPot(p, E2))}` });
    return { enun, pasos, res: tRaiz(M2, tPot(p, E2)) };
  }

  function dosBases(op, a, b, s1, s2, p, q) {
    const Mc = mcm(a, b), X = Mc / a * s1, Y = Mc / b * s2;
    const enun = juntar(op, tRaiz(a, tPot(p, s1)), tRaiz(b, tPot(q, s2)));
    const dentro = juntar(op, tPot(p, X), tPot(q, Y));
    return {
      enun,
      pasos: [
        { t: `Reducimos a índice común, \\(\\text{m.c.m.}(${a},${b}) = ${Mc}\\). El primer índice se multiplica por ${Mc / a} y su exponente también; el segundo, por ${Mc / b}:`,
          m: `${enun} = ${juntar(op, tRaiz(Mc, tPot(p, X)), tRaiz(Mc, tPot(q, Y)))}` },
        { t: op === 'prod' ? 'Con el mismo índice, el producto de raíces es la raíz del producto:' : 'Con el mismo índice, el cociente de raíces es la raíz del cociente:',
          m: `= ${tRaiz(Mc, dentro)}` }
      ],
      res: tRaiz(Mc, dentro)
    };
  }

  function producto(R) {
    for (;;) {
      let [a, b] = R.pick(PARES); if (R.rand() < 0.5) [a, b] = [b, a];
      const s1 = coprimoCon(R, a), s2 = coprimoCon(R, b), Mc = mcm(a, b);
      if (R.rand() < 0.35) {
        const E = Mc / a * s1 + Mc / b * s2, g = mcd(E, Mc);
        if (E >= Mc || Mc / g < 2) continue;
        return mismaBase('prod', a, b, s1, s2, R.pick([2, 3, 5, 7]), false);
      }
      const p = R.pick([2, 3, 5, 7]), q = R.pick([2, 3, 5, 7]);
      if (p === q) continue;
      const X = Mc / a * s1, Y = Mc / b * s2;
      if (mcd(mcd(X, Y), Mc) !== 1) continue;
      return dosBases('prod', a, b, s1, s2, p, q);
    }
  }

  function cociente(R) {
    for (;;) {
      let [a, b] = R.pick(PARES); if (R.rand() < 0.5) [a, b] = [b, a];
      const Mc = mcm(a, b);
      if (R.rand() < 0.65) {
        const p = R.pick([2, 3, 5]), s1 = R.int(1, 6), s2 = R.int(1, 6);
        if (Math.pow(p, s1) > 1000 || Math.pow(p, s2) > 1000) continue;
        if (s1 >= a || s2 >= b) continue;
        const E = Mc / a * s1 - Mc / b * s2;
        if (E <= 0) continue;
        const g = mcd(E, Mc), E2 = E / g, M2 = Mc / g;
        if (M2 < 2 || E2 >= M2) continue;
        return mismaBase('quot', a, b, s1, s2, p, true);
      }
      const s1 = coprimoCon(R, a), s2 = coprimoCon(R, b);
      const p = R.pick([2, 3, 5, 7]), q = R.pick([2, 3, 5, 7]);
      if (p === q) continue;
      const X = Mc / a * s1, Y = Mc / b * s2;
      if (mcd(mcd(X, Y), Mc) !== 1) continue;
      return dosBases('quot', a, b, s1, s2, p, q);
    }
  }

  /* ---------- Sumas de radicales ---------- */
  function sumaTex(terminos, n, rad) {
    return terminos.map((t, idx) => {
      const abs = Math.abs(t.c);
      const cuerpo = (abs === 1 ? '' : abs) + tRaiz(n, rad(t));
      if (idx === 0) return (t.c < 0 ? '-' : '') + cuerpo;
      return (t.c < 0 ? ' - ' : ' + ') + cuerpo;
    }).join('');
  }
  function suma(R) {
    for (;;) {
      const n = R.rand() < 0.72 ? 2 : 3;
      const m = n === 2 ? R.pick([2, 3, 5, 6, 7, 10]) : R.pick([2, 3, 4, 5]);
      const lim = n === 2 ? 600 : 700;
      const T = R.int(3, 4);
      const opciones = [];
      for (let s = 1; s <= 8; s++) if (Math.pow(s, n) * m <= lim) opciones.push(s);
      if (opciones.length < T) continue;
      const ss = R.shuffle(opciones).slice(0, T);
      if (ss.filter(s => s > 1).length < 2) continue;
      const terminos = ss.map(s => ({ c: R.nz(-5, 5), s, rad: Math.pow(s, n) * m }));
      const C = terminos.reduce((acc, t) => acc + t.c * t.s, 0);
      if (C === 0 && R.rand() < 0.85) continue;
      if (Math.abs(C) > 40) continue;
      const enun = sumaTex(terminos, n, t => t.rad);
      const extracciones = terminos.filter(t => t.s > 1)
        .map(t => `${tRaiz(n, t.rad)} = ${tRaiz(n, `${tPot(t.s, n)}\\cdot ${m}`)} = ${t.s}${tRaiz(n, m)}`).join(' \\\\ ');
      const semejantes = sumaTex(terminos.map(t => ({ c: t.c * t.s })), n, () => m);
      const resTex = C === 0 ? '0' : tCR(C, n, m);
      return {
        enun,
        pasos: [
          { t: 'Extraemos factores en cada término:', m: extracciones, multilinea: true },
          { t: `Todos los términos quedan con \\(${tRaiz(n, m)}\\): son radicales semejantes y sumamos sus coeficientes.`,
            m: `${enun} = ${semejantes} = ${resTex}` }
        ],
        res: resTex
      };
    }
  }

  registrarFicha({
    id: 'radicales',
    titulo: 'Operaciones con radicales',
    grupo: GRUPO,
    enlace: '../raices/radicales.html',
    ejercicios: [
      { id: 'extraer', nombre: 'Extraer factores', peso: 1, columnas: 3,
        enunciado: ['Extrae del radical todos los factores posibles:', 'Extrae de cada radical todos los factores posibles:'],
        generar: extraer },
      { id: 'introducir', nombre: 'Introducir factores', peso: 1, columnas: 3,
        enunciado: ['Introduce el factor dentro del radical:', 'Introduce los factores dentro de los radicales:'],
        generar: introducir },
      { id: 'simplificar', nombre: 'Simplificar radicales', peso: 1, columnas: 3,
        enunciado: ['Simplifica el radical:', 'Simplifica los siguientes radicales:'],
        generar: simplificar },
      { id: 'productos', nombre: 'Productos de radicales', peso: 1.25, columnas: 2,
        enunciado: ['Reduce a índice común y escribe el producto como un único radical simplificado:', 'Reduce a índice común y escribe cada producto como un único radical simplificado:'],
        generar: producto },
      { id: 'cocientes', nombre: 'Cocientes de radicales', peso: 1.25, columnas: 2,
        enunciado: ['Reduce a índice común y escribe el cociente como un único radical simplificado:', 'Reduce a índice común y escribe cada cociente como un único radical simplificado:'],
        generar: cociente },
      { id: 'sumas', nombre: 'Sumas de radicales', peso: 1.5, columnas: 2,
        enunciado: ['Extrae factores y opera:', 'Extrae factores y opera:'],
        generar: suma }
    ]
  });

  /* ================================================================
     RACIONALIZACIÓN DE DENOMINADORES
     ================================================================ */

  /* ---------- Raíz cuadrada en el denominador: a / (c√b) ---------- */
  function racCuadrada(R) {
    for (;;) {
      const conFactor = R.rand() < 0.2;      // denominador del tipo √8, √12, √50…
      let b, c;
      if (conFactor) { b = R.pick([2, 3, 5, 6, 7]); c = R.pick([2, 3]); if (c * c * b > 75) continue; }
      else { b = R.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]); c = R.rand() < 0.7 ? 1 : R.pick([2, 3]); }
      const a = R.int(1, 12);
      const den = c * b, g = mcd(a, den), p = a / g, q = den / g;
      const dc = tCR(c, 2, b);                                // c√b
      const enun = `\\dfrac{${a}}{${conFactor ? `\\sqrt{${c * c * b}}` : dc}}`;
      const pasos = [];
      if (conFactor) pasos.push({ t: 'Extraemos factores del radical del denominador:', m: `${enun} = \\dfrac{${a}}{${dc}}` });
      const numA = a === 1 ? `\\sqrt{${b}}` : `${a}\\sqrt{${b}}`;
      const denPaso = c === 1 ? `${b}` : `${c}\\cdot ${b}`;
      let m = `\\dfrac{${a}}{${dc}}\\cdot\\dfrac{\\sqrt{${b}}}{\\sqrt{${b}}} = \\dfrac{${numA}}{${denPaso}}`;
      if (c !== 1) m += ` = \\dfrac{${numA}}{${den}}`;
      pasos.push({ t: `Multiplicamos numerador y denominador por \\(\\sqrt{${b}}\\), porque \\(\\sqrt{${b}}\\cdot\\sqrt{${b}} = ${b}\\):`, m });
      const res = tCRsobre(p, 2, b, q);
      if (g > 1) pasos.push({ t: 'Simplificamos la fracción:', m: `\\dfrac{${numA}}{${den}} = ${res}` });
      return { enun, pasos, res };
    }
  }

  /* ---------- Raíz de índice mayor que 2: a / ⁿ√(p^k) ---------- */
  function racIndice(R) {
    for (;;) {
      const n = R.rand() < 0.6 ? 3 : R.pick([4, 5]);
      const p = R.pick([2, 3, 5, 7]), k = R.int(1, n - 1);
      const V = Math.pow(p, n - k);
      if (Math.pow(p, k) > 125 || V > 625) continue;
      const a = R.int(1, 10);
      const comoPot = k > 1 && R.rand() < 0.3;
      const enunRad = comoPot ? tPot(p, k) : String(Math.pow(p, k));
      const enun = `\\dfrac{${a}}{${tRaiz(n, enunRad)}}`;
      const g = mcd(a, p), c = a / g, q = p / g;
      const numA = (a === 1 ? '' : a) + tRaiz(n, V);
      const pasos = [];
      if (!comoPot && k > 1) pasos.push({ t: `Escribimos el radicando como potencia de ${p}:`, m: `${enun} = \\dfrac{${a}}{${tRaiz(n, tPot(p, k))}}` });
      pasos.push({
        t: `Para que el exponente de ${p} llegue al índice (${n}), multiplicamos numerador y denominador por \\(${tRaiz(n, tPot(p, n - k))}\\):`,
        m: `\\dfrac{${a}}{${tRaiz(n, tPot(p, k))}}\\cdot\\dfrac{${tRaiz(n, tPot(p, n - k))}}{${tRaiz(n, tPot(p, n - k))}} = \\dfrac{${numA}}{${tRaiz(n, tPot(p, n))}} = \\dfrac{${numA}}{${p}}`
      });
      const res = tCRsobre(c, n, V, q);
      if (g > 1) pasos.push({ t: 'Simplificamos:', m: `\\dfrac{${numA}}{${p}} = ${res}` });
      return { enun, pasos, res };
    }
  }

  /* ---------- Binomio en el denominador: conjugado ----------
     Un término es { c, r }: c·√r (r libre de cuadrados; r = 1 indica un entero). */
  const termTex = t => (t.r === 1 ? String(Math.abs(t.c)) : (Math.abs(t.c) === 1 ? '' : Math.abs(t.c)) + `\\sqrt{${t.r}}`);
  function sumaTerm(lista) {
    return lista.map((t, i) => (i === 0 ? (t.c < 0 ? '-' : '') : (t.c < 0 ? ' - ' : ' + ')) + termTex(t)).join('');
  }
  const cuadrado = t => t.c * t.c * t.r;
  const cuadradoTex = t => (t.r === 1 ? `${Math.abs(t.c)}^2` : `\\left(${termTex(t)}\\right)^2`);
  function multTerm(x, y) {
    const { k, m } = partirCuadrado(x.r * y.r);
    return { c: x.c * y.c * k, r: m };
  }
  function agrupar(lista) {
    const r = [];
    lista.forEach(t => { const e = r.find(u => u.r === t.r); if (e) e.c += t.c; else r.push({ ...t }); });
    return r.filter(t => t.c !== 0);
  }

  const LIBRES = [2, 3, 5, 6, 7, 10, 11, 13];
  function racBinomio(R, i) {
    for (;;) {
      const forma = ['raices', 'raizEntero', 'enteroRaiz', 'raices', 'coefRaiz'][(i + R.int(0, 4)) % 5];
      let U, V;
      if (forma === 'raices') {
        const b = R.pick([2, 3, 5, 6, 7, 10, 11]), c = R.pick([2, 3, 5, 6, 7, 10, 11]);
        if (b <= c) continue;
        U = { c: 1, r: b }; V = { c: 1, r: c };
      } else if (forma === 'raizEntero') {
        const b = R.pick(LIBRES), k = R.int(1, 3);
        if (k * k >= b) continue;
        U = { c: 1, r: b }; V = { c: k, r: 1 };
      } else if (forma === 'enteroRaiz') {
        const k = R.int(2, 4), b = R.pick(LIBRES);
        if (b >= k * k) continue;
        U = { c: k, r: 1 }; V = { c: 1, r: b };
      } else {
        const c = R.pick([2, 3]), b = R.pick([2, 3, 5]), k = R.int(1, 4);
        if (c * c * b <= k * k || mcd(c, k) > 1) continue;
        U = { c, r: b }; V = { c: k, r: 1 };
      }
      const D = cuadrado(U) - cuadrado(V);
      if (D < 1 || D > 20) continue;
      const s = R.signo();
      // Numerador: entero (a veces múltiplo de D) o √d si el denominador lleva un entero
      let num;
      if (forma !== 'raices' && R.rand() < 0.25) {
        const d = R.pick([2, 3, 5].filter(x => x !== U.r && x !== V.r));
        num = { c: 1, r: d };
      } else {
        const a = (D > 1 && D <= 8 && R.rand() < 0.4) ? D * R.int(1, 2) : R.int(1, 6);
        num = { c: a, r: 1 };
      }

      const Vs = { c: s * V.c, r: V.r }, Vc = { c: -s * V.c, r: V.r };
      const den = sumaTerm([U, Vs]), conj = sumaTerm([U, Vc]);
      const numTex = num.r === 1 ? String(num.c) : `\\sqrt{${num.r}}`;
      const enun = `\\dfrac{${numTex}}{${den}}`;
      const numPorConj = num.r === 1 && num.c === 1 ? conj : `${numTex}\\left(${conj}\\right)`;

      // Numerador desarrollado y simplificación
      const prod = agrupar([multTerm(num, U), multTerm(num, Vc)]);
      const g = prod.reduce((acc, t) => mcd(acc, t.c), D);
      const fin = prod.map(t => ({ c: t.c / g, r: t.r })), D2 = D / g;
      const h = fin.length > 1 ? fin.reduce((acc, t) => mcd(acc, t.c), 0) : 1;
      let numFin;
      if (h > 1) numFin = `${h}\\left(${sumaTerm(fin.map(t => ({ c: t.c / h, r: t.r })))}\\right)`;
      else numFin = sumaTerm(fin);
      const res = D2 === 1 ? numFin : `\\dfrac{${numFin}}{${D2}}`;

      const pasos = [
        { t: `Multiplicamos numerador y denominador por el conjugado del denominador, \\(${conj}\\):`,
          m: `${enun} = \\dfrac{${numPorConj}}{\\left(${den}\\right)\\left(${conj}\\right)}` },
        { t: 'En el denominador hay una suma por diferencia, \\((A+B)(A-B) = A^2 - B^2\\):',
          m: `= \\dfrac{${numPorConj}}{${cuadradoTex(U)} - ${cuadradoTex(V)}} = \\dfrac{${numPorConj}}{${cuadrado(U)} - ${cuadrado(V)}} = \\dfrac{${numPorConj}}{${D}}` }
      ];
      if (num.r !== 1) pasos.push({ t: 'Multiplicamos en el numerador (extrayendo factores si se puede):', m: `= \\dfrac{${sumaTerm(prod)}}{${D}}` });
      const ultimo = num.r !== 1 ? `\\dfrac{${sumaTerm(prod)}}{${D}}` : `\\dfrac{${numPorConj}}{${D}}`;
      if (ultimo !== res) pasos.push({ t: 'Simplificamos:', m: `= ${res}` });
      return { enun, pasos, res };
    }
  }

  registrarFicha({
    id: 'racionalizar',
    titulo: 'Racionalización de denominadores',
    grupo: GRUPO,
    enlace: '../raices/racionalizar.html',
    ejercicios: [
      { id: 'cuadrada', nombre: 'Raíz cuadrada en el denominador', peso: 1, columnas: 3,
        enunciado: ['Racionaliza y simplifica:', 'Racionaliza y simplifica:'],
        generar: racCuadrada },
      { id: 'indice', nombre: 'Raíz de índice mayor que 2', peso: 1.25, columnas: 3,
        enunciado: ['Racionaliza y simplifica:', 'Racionaliza y simplifica:'],
        generar: racIndice },
      { id: 'binomio', nombre: 'Suma o resta de raíces (conjugado)', peso: 1.5, columnas: 3,
        enunciado: ['Racionaliza y simplifica:', 'Racionaliza y simplifica:'],
        generar: racBinomio }
    ]
  });
})();
