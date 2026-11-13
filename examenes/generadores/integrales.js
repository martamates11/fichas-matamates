/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: integrales (2.º Bachillerato).
   Corresponden a las fichas de integrales/: integrales inmediatas, integrales inmediatas II
   (nivel avanzado) y cálculo de áreas (área entre una curva y el eje OX, y límite de
   integración conocida el área).
   Las fichas de integrales inmediatas trabajan con bancos fijos; aquí se generan integrales
   del mismo tipo con coeficientes al azar. Cada apartado lleva una comprobación numérica
   interna (chk: la derivada de la primitiva es el integrando). */
(function () {
  'use strict';
  const { registrarFicha, tex, resolverCuadratica } = window.EX;
  const { poli } = tex;
  const GRUPO = 'Integrales';
  const SEN = '\\operatorname{sen}';

  /* ================= Fracciones ================= */
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
  class Fr {
    constructor(n, d = 1) {
      if (d < 0) { n = -n; d = -d; }
      const g = mcd(n, d); this.n = n / g + 0; this.d = d / g;
      if (Object.is(this.n, -0)) this.n = 0;
    }
    get v() { return this.n / this.d; }
    mas(o) { o = F(o); return new Fr(this.n * o.d + o.n * this.d, this.d * o.d); }
    menos(o) { o = F(o); return this.mas(new Fr(-o.n, o.d)); }
    por(o) { o = F(o); return new Fr(this.n * o.n, this.d * o.d); }
    entre(o) { o = F(o); return new Fr(this.n * o.d, this.d * o.n); }
    abs() { return new Fr(Math.abs(this.n), this.d); }
    tex() { return this.d === 1 ? String(this.n) : (this.n < 0 ? '-' : '') + `\\frac{${Math.abs(this.n)}}{${this.d}}`; }
    texP() { return this.n < 0 ? `\\left(${this.tex()}\\right)` : this.tex(); }
  }
  const F = x => (x instanceof Fr ? x : new Fr(x));
  const dec = x => (Math.round(x * 100) / 100).toLocaleString('es-ES', { maximumFractionDigits: 2 }).replace(',', '{,}');

  /* ================= Términos del integrando =================
     { k: 'pot', c: Fr, e: Fr, forma?: 'pot' }  c·x^e   (e ≠ −1; si e no es entero se escribe como raíz salvo forma 'pot')
     { k: 'inv', c: Fr }                         c/x
     { k: 'exp', c: Fr, a: 'e' | número }        c·a^x
     { k: 'sen' | 'cos', c: Fr }                 c·sen x, c·cos x                                   */
  const P = (c, e, forma) => ({ k: 'pot', c: F(c), e: F(e), forma });
  const xpot = e => (e === 1 ? 'x' : `x^{${e}}`);
  const raiz = (p, q) => (q === 2 ? `\\sqrt{${xpot(p)}}` : `\\sqrt[${q}]{${xpot(p)}}`);
  const expoTex = e => (e.d === 1 ? String(e.n) : `${e.n < 0 ? '-' : ''}${Math.abs(e.n)}/${e.d}`);

  /* Valor absoluto del término en TeX (el signo lo pone quien lo une) */
  function cuerpo(t) {
    const c = t.c.abs();
    const coefDelante = lit => (c.d === 1 ? (c.n === 1 ? lit : `${c.n}${lit}`) : `\\frac{${c.n}}{${c.d}}${lit}`);
    const sobre = den => `\\frac{${c.n}}{${c.d === 1 ? '' : c.d}${den}}`;
    switch (t.k) {
      case 'pot': {
        const e = t.e;
        if (e.n === 0) return c.tex();
        if (t.forma === 'pot' || (e.d === 1 && e.n > 0)) return coefDelante(e.d === 1 && e.n === 1 ? 'x' : `x^{${expoTex(e)}}`);
        if (e.d === 1) return sobre(xpot(-e.n));
        return e.n > 0 ? coefDelante(raiz(e.n, e.d)) : sobre(raiz(-e.n, e.d));
      }
      case 'inv': return sobre('x');
      case 'exp': return t.a === 'e' ? coefDelante('e^{x}') : (c.d === 1 && c.n === 1 ? `${t.a}^{x}` : `${coefDelante('')}\\cdot ${t.a}^{x}`);
      case 'sen': return coefDelante(`${SEN} x`);
      case 'cos': return coefDelante('\\cos x');
    }
  }
  function suma(ts) {
    return ts.map((t, i) => (t.c.n < 0 ? (i ? ' - ' : '-') : (i ? ' + ' : '')) + cuerpo(t)).join('') || '0';
  }
  /* Primitiva de cada término (como términos de la misma forma, salvo exp de base a y ln) */
  function primitiva(t) {
    switch (t.k) {
      case 'pot': { const e1 = t.e.mas(1); return [{ k: 'pot', c: t.c.entre(e1), e: e1 }]; }
      case 'inv': return [{ k: 'ln', c: t.c }];
      case 'exp': return [t.a === 'e' ? { k: 'exp', c: t.c, a: 'e' } : { k: 'expa', c: t.c, a: t.a }];
      case 'sen': return [{ k: 'cos', c: t.c.por(-1) }];
      case 'cos': return [{ k: 'sen', c: t.c }];
    }
  }
  function cuerpoPrim(t) {
    const c = t.c.abs();
    const coefDelante = lit => (c.d === 1 ? (c.n === 1 ? lit : `${c.n}${lit}`) : `\\frac{${c.n}}{${c.d}}${lit}`);
    if (t.k === 'ln') return coefDelante('\\ln|x|');
    if (t.k === 'expa') return `\\frac{${c.d === 1 && c.n === 1 ? '' : (c.d === 1 ? c.n + '\\cdot ' : `\\frac{${c.n}}{${c.d}}\\cdot `)}${t.a}^{x}}{\\ln ${t.a}}`;
    return cuerpo(t);
  }
  const sumaPrim = ts => ts.map((t, i) => (t.c.n < 0 ? (i ? ' - ' : '-') : (i ? ' + ' : '')) + cuerpoPrim(t)).join('');

  /* Paso intermedio: cada término integrado con su regla, antes de simplificar */
  function intermedio(t) {
    const c = t.c.abs();
    const k = c.d === 1 ? (c.n === 1 ? '' : `${c.n}\\cdot `) : `\\frac{${c.n}}{${c.d}}\\cdot `;
    switch (t.k) {
      case 'pot': {
        if (t.e.n === 0) return c.d === 1 ? `${c.n === 1 ? '' : c.n}x` : `\\frac{${c.n}}{${c.d}}x`;
        const e1 = t.e.mas(1); const E = e1.d === 1 ? String(e1.n) : `${e1.n}/${e1.d}`; return `${k}\\frac{x^{${E}}}{${e1.tex()}}`; }
      case 'inv': return `${k}\\ln|x|`;
      case 'exp': return t.a === 'e' ? `${k}e^{x}` : `${k}\\frac{${t.a}^{x}}{\\ln ${t.a}}`;
      case 'sen': return `${k}(-\\cos x)`;
      case 'cos': return `${k}${SEN} x`;
    }
  }
  const REGLA = {
    pot: '\\int x^{n}\\,dx = \\frac{x^{n+1}}{n+1}', inv: '\\int \\frac{1}{x}\\,dx = \\ln|x|',
    exp: '\\int e^{x}\\,dx = e^{x}', expa: '\\int a^{x}\\,dx = \\frac{a^{x}}{\\ln a}',
    sen: `\\int ${SEN} x\\,dx = -\\cos x`, cos: `\\int \\cos x\\,dx = ${SEN} x`
  };
  const val = (t, x) => {
    const c = t.c.v;
    switch (t.k) {
      case 'pot': return c * Math.pow(x, t.e.v);
      case 'inv': return c / x;
      case 'ln': return c * Math.log(Math.abs(x));
      case 'exp': return c * Math.pow(t.a === 'e' ? Math.E : t.a, x);
      case 'expa': return c * Math.pow(t.a, x) / Math.log(t.a);
      case 'sen': return c * Math.sin(x);
      case 'cos': return c * Math.cos(x);
    }
  };

  /* Construye el apartado completo a partir de la lista de términos */
  function integral(ts) {
    const enunT = suma(ts);
    const enun = `\\int ${ts.length > 1 ? `\\left(${enunT}\\right)` : enunT}\\,dx`;
    const prim = ts.flatMap(primitiva);
    const res = `${sumaPrim(prim)} + C`;
    const tipos = [...new Set(ts.map(t => (t.k === 'exp' && t.a !== 'e' ? 'expa' : t.k)))];
    const pasos = [];
    pasos.push({ t: ts.length > 1 ? 'La integral de una suma es la suma de las integrales y las constantes salen fuera. Usamos:' : 'Usamos la integral inmediata:', m: tipos.map(k => REGLA[k] + (k === 'pot' ? '\\;(n \\ne -1)' : '')).join(',\\qquad ') });
    const hayRaiz = ts.some(t => t.k === 'pot' && (t.e.n < 0 || t.e.d > 1) && t.forma !== 'pot');
    if (hayRaiz) {
      pasos.push({ t: 'Escribimos las raíces y las fracciones como potencias de \\(x\\):', m: `\\int ${ts.length > 1 ? '\\left(' : ''}${suma(ts.map(t => (t.k === 'pot' ? { ...t, forma: 'pot' } : t)))}${ts.length > 1 ? '\\right)' : ''}\\,dx` });
    }
    const inter = ts.map((t, i) => (t.c.n < 0 ? (i ? ' - ' : '-') : (i ? ' + ' : '')) + intermedio(t)).join('');
    const potForma = sumaPrim(prim.map(t => (t.k === 'pot' ? { ...t, forma: 'pot' } : t)));
    pasos.push({ t: 'Integramos término a término:', m: `${inter} = ${potForma} + C` });
    if (potForma !== sumaPrim(prim)) pasos.push({ t: 'Volvemos a escribir las potencias como raíces o fracciones:', m: res });
    return { enun, pasos, res, chk: { f: x => prim.reduce((s, t) => s + val(t, x), 0), d: x => ts.reduce((s, t) => s + val(t, x), 0) } };
  }

  /* =====================================================================
     INTEGRALES INMEDIATAS (integrales-1)
     ===================================================================== */
  const DIST = (R, lo, hi, excl) => { let v; do { v = R.int(lo, hi); } while (excl.includes(v)); return v; };
  function pesado(R, lista) {
    const tot = lista.reduce((s, [w]) => s + w, 0);
    let r = R.rand() * tot;
    for (const [w, f] of lista) { r -= w; if (r < 0) return f(R); }
    return lista[lista.length - 1][1](R);
  }
  function polTerms(R, gmin, gmax, nt, coef) {
    const g = R.int(gmin, gmax);
    const es = [g, ...R.shuffle([...Array(g).keys()]).slice(0, nt - 1)].sort((a, b) => b - a);
    return es.map(e => P(coef(R), e));
  }
  const cEnt = R => R.nz(-9, 9);
  const otroTermino = R => R.pick([() => P(R.nz(-6, 6), R.int(1, 3)), () => P(R.nz(-9, 9), 0)])();

  function inmPolinomio(R) { return integral(polTerms(R, 2, 7, R.int(3, 4), cEnt)); }
  function inmRaiz(R) {
    return pesado(R, [
      [3, () => integral([P(R.pick([1, 1, 2, 3, 4, 5]), new Fr(1, R.pick([2, 2, 3, 4])))])],
      [2, () => integral([P(R.pick([1, 2, 3, 4, 5]), new Fr(-1, R.pick([2, 2, 3])))])],
      [1, () => integral([P(1, new Fr(R.pick([3, 5, 7]), 2), 'pot')])],
      [2, () => integral([P(R.int(1, 4), new Fr(1, 2)), P(R.nz(-4, 4), new Fr(-1, 2))])],
      [1.5, () => integral([P(R.nz(-5, 5), new Fr(1, R.pick([2, 3]))), otroTermino(R)])]
    ]);
  }
  function inmExponencial(R) {
    const a = R.pick([2, 3, 5, 10]);
    return pesado(R, [
      [1, () => integral([{ k: 'exp', c: F(DIST(R, -7, 9, [0, 1])), a: 'e' }])],
      [1, () => integral([{ k: 'exp', c: F(1), a }])],
      [2, () => integral(R.shuffle([{ k: 'exp', c: F(R.nz(-5, 6)), a: 'e' }, otroTermino(R)]))],
      [2, () => integral([{ k: 'exp', c: F(R.int(1, 5)), a: 'e' }, { k: 'exp', c: F(R.pick([1, 1, -1, 2])), a }])]
    ]);
  }
  function inmLogaritmo(R) {
    return pesado(R, [
      [1, () => integral([{ k: 'inv', c: F(R.pick([1, 2, 3, 4, 5, 7, -2, -3])) }])],
      [3, () => integral(R.shuffle([{ k: 'inv', c: F(R.nz(-7, 7)) }, R.rand() < 0.7 ? P(R.nz(-6, 6), R.int(1, 3)) : { k: 'exp', c: F(R.nz(-3, 3)), a: 'e' }]))]
    ]);
  }
  function inmSenCos(R) {
    return pesado(R, [
      [1, () => integral([{ k: R.pick(['sen', 'cos']), c: F(R.pick([1, 2, 3, 4, 5, -1, -2, -3])) }])],
      [3, () => integral(R.shuffle([{ k: 'sen', c: F(R.nz(-5, 5)) }, { k: 'cos', c: F(R.nz(-5, 5)) }]))],
      [1.5, () => integral(R.shuffle([{ k: R.pick(['sen', 'cos']), c: F(R.nz(-5, 5)) }, R.rand() < 0.5 ? { k: 'exp', c: F(R.nz(-3, 3)), a: 'e' } : P(R.nz(-6, 6), R.int(1, 2))]))]
    ]);
  }
  const mezcla1 = R => pesado(R, [[1, inmPolinomio], [1, inmRaiz], [1, inmExponencial], [1, inmLogaritmo], [1, inmSenCos]]);

  /* =====================================================================
     INTEGRALES INMEDIATAS II (integrales-2)
     ===================================================================== */
  const cFr = R => new Fr(R.nz(-7, 7), R.pick([1, 2, 3, 4, 5]));
  function avPolinomio(R) {
    for (;;) {
      const ts = polTerms(R, 2, 6, R.int(3, 4), cFr);
      if (ts.filter(t => t.c.d > 1).length >= 2) return integral(ts);
    }
  }
  function avRaiz(R) {
    const raizAzar = () => { for (;;) { const q = R.pick([2, 3, 3, 4, 5]), p = R.int(2, 7); if (p % q && mcd(p, q) === 1) return new Fr(p, q); } };
    return pesado(R, [
      [3, () => integral([P(R.pick([1, 1, 2, 3, 4, 5]), raizAzar())])],
      [2, () => integral([P(R.pick([1, 2, 3, 5]), raizAzar().por(-1))])],
      [2, () => integral(R.shuffle([P(R.nz(-4, 4), raizAzar()), otroTermino(R)]))]
    ]);
  }
  function avExponencial(R) {
    const a = R.pick([2, 3, 4, 5, 7, 10]);
    const ts = R.shuffle([{ k: 'exp', c: F(R.nz(-5, 6)), a: 'e' }, { k: 'exp', c: F(R.pick([1, 1, -1, 2, 3, -2])), a }]);
    if (R.rand() < 0.6) ts.push(P(R.nz(-9, 9), 0));
    return integral(ts);
  }
  function avLogaritmo(R) {
    const ts = [{ k: 'inv', c: F(R.nz(-9, 9)) }, P(R.nz(-6, 6), -R.int(2, 3))];
    if (R.rand() < 0.6) ts.push(P(R.nz(-5, 5), ts[1].e.n === -2 ? -3 : -2));
    if (R.rand() < 0.5) ts.push(P(R.nz(-6, 6), R.int(1, 2)));
    return integral(R.shuffle(ts));
  }
  function avFraccion(R) {
    return pesado(R, [
      [3, () => integral([P(R.pick([1, 2, 3, 4, 5, 6, -2, -3]), -R.int(2, 6))])],
      [2, () => integral(R.shuffle([P(R.nz(-6, 6), -R.int(2, 4)), P(R.nz(-6, 6), R.int(1, 3))]))]
    ]);
  }
  function avSenCos(R) {
    const ts = R.shuffle([{ k: 'sen', c: F(R.nz(-6, 6)) }, { k: 'cos', c: F(R.nz(-6, 6)) }]);
    ts.push(R.rand() < 0.5 ? P(R.nz(-9, 9), 0) : { k: 'exp', c: F(R.nz(-4, 4)), a: 'e' });
    return integral(ts);
  }
  const mezcla2 = R => pesado(R, [[1, avPolinomio], [1, avRaiz], [1, avExponencial], [1, avLogaritmo], [1, avFraccion], [1, avSenCos]]);

  /* =====================================================================
     CÁLCULO DE ÁREAS (calculo-de-area)
     ===================================================================== */
  const pEval = (a, x) => a.reduce((s, c, i) => s + c * Math.pow(x, i), 0);
  const pTex = a => poli(a.map((c, i) => [c, i === 0 ? '' : i === 1 ? 'x' : `x^{${i}}`]).reverse());
  /* Primitiva exacta: F(x) = Σ c_i/(i+1)·x^{i+1} */
  const primF = (a, x) => a.reduce((s, c, i) => s.mas(new Fr(c, i + 1).por(new Fr(x ** (i + 1)))), new Fr(0));
  function primTex(a) {
    const t = a.map((c, i) => ({ k: 'pot', c: new Fr(c, i + 1), e: F(i + 1) })).filter(t => t.c.n !== 0).reverse();
    return suma(t);
  }
  const factorX = r => (r === 0 ? 'x' : r > 0 ? `(x - ${r})` : `(x + ${-r})`);

  /* Gráfica de la región (solo en la hoja de soluciones) */
  function grafArea(a, A, B, raices) {
    const xs = [A, B, ...raices];
    const x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 1;
    let y0 = 0, y1 = 0;
    for (let i = 0; i <= 200; i++) { const y = pEval(a, x0 + (x1 - x0) * i / 200); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const lim = Math.max(y1 - y0, 1) * 0.12; y0 -= lim; y1 += lim;
    const W = 300, H = 170, mx = 14, my = 10;
    const X = x => mx + (x - x0) / (x1 - x0) * (W - 2 * mx), Y = y => my + (y1 - y) / (y1 - y0) * (H - 2 * my);
    const curva = [], region = [`${X(A).toFixed(1)},${Y(0).toFixed(1)}`];
    for (let i = 0; i <= 200; i++) { const x = x0 + (x1 - x0) * i / 200; curva.push(`${X(x).toFixed(1)},${Y(pEval(a, x)).toFixed(1)}`); }
    for (let i = 0; i <= 120; i++) { const x = A + (B - A) * i / 120; region.push(`${X(x).toFixed(1)},${Y(pEval(a, x)).toFixed(1)}`); }
    region.push(`${X(B).toFixed(1)},${Y(0).toFixed(1)}`);
    const marcas = [...new Set(xs)].sort((p, q) => p - q).map(x => `<line x1="${X(x).toFixed(1)}" y1="${(Y(0) - 3).toFixed(1)}" x2="${X(x).toFixed(1)}" y2="${(Y(0) + 3).toFixed(1)}" stroke="#333" stroke-width="1"/><text x="${X(x).toFixed(1)}" y="${(Y(0) + 13).toFixed(1)}" font-size="10" text-anchor="middle" fill="#333">${x}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" style="display:block;width:70mm;max-width:100%;height:auto" role="img" aria-label="Región cuya área se calcula" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">` +
      `<polygon points="${region.join(' ')}" fill="#b8922a" fill-opacity=".28" stroke="none"/>` +
      `<line x1="${mx - 6}" y1="${Y(0).toFixed(1)}" x2="${W - mx + 6}" y2="${Y(0).toFixed(1)}" stroke="#333" stroke-width="1"/>` +
      (x0 < 0 && x1 > 0 ? `<line x1="${X(0).toFixed(1)}" y1="${my - 6}" x2="${X(0).toFixed(1)}" y2="${H - my + 6}" stroke="#999" stroke-width=".8"/>` : '') +
      `<polyline points="${curva.join(' ')}" fill="none" stroke="#1a2744" stroke-width="1.8"/>${marcas}</svg>`;
  }

  function areaCurva(R) {
    let a, raices, A, B, nombre;
    const tipo = R.pick(['recta', 'parabola', 'parabola', 'cubica', 'cubica']);
    if (tipo === 'recta') {
      const m = R.nz(-4, 4), r = R.int(-3, 3);
      a = [-m * r, m]; raices = [r]; A = r - R.int(1, 3); B = r + R.int(1, 3); nombre = 'recta';
    } else if (tipo === 'parabola') {
      let r1, r2; do { r1 = R.int(-4, -1); r2 = R.int(1, 4); } while (Math.abs(r1) === Math.abs(r2));
      const s = R.pick([1, -1]); a = [s * r1 * r2, -s * (r1 + r2), s]; raices = [r1, r2]; nombre = 'parábola';
      if (R.rand() < 0.6) { A = r1; B = r2; } else { A = R.int(r1 + 1, r2 - 1); B = r2 + R.int(1, 2); }
    } else {
      let r1, r2, r3; do { r1 = R.int(-4, -1); r2 = R.int(r1 + 1, 1); r3 = R.int(r2 + 1, 4); } while (Math.abs(r1) === Math.abs(r3));
      const s = R.pick([1, -1]);
      a = [-s * r1 * r2 * r3, s * (r1 * r2 + r1 * r3 + r2 * r3), -s * (r1 + r2 + r3), s]; raices = [r1, r2, r3]; nombre = 'cúbica';
      A = r1; B = r3;
    }
    const cortes = [A, ...raices.filter(r => r > A && r < B), B];
    const trozos = cortes.slice(1).map((b, i) => ({ a: cortes[i], b, I: primF(a, b).menos(primF(a, cortes[i])) }));
    const total = trozos.reduce((s, t) => s.mas(t.I.abs()), new Fr(0));
    const s = a[a.length - 1];
    const fact = `${s === 1 ? '' : s === -1 ? '-' : s}${[...raices].sort((p, q) => (p === 0 ? -1 : q === 0 ? 1 : 0)).map(factorX).join('')}`;
    const dentro = raices.filter(r => r > A && r < B);
    const enunHtml = `\\(f(x) = ${pTex(a)}\\), entre \\(x = ${A}\\) y \\(x = ${B}\\)`;
    const pasos = [
      { t: 'Buscamos los puntos de corte con el eje OX, porque en ellos la función puede cambiar de signo:', m: `f(x) = ${tipo === 'recta' ? pTex(a) : fact} = 0 \\;\\Rightarrow\\; ${raices.map(r => `x = ${r}`).join(',\\; ')}` },
      { t: dentro.length
          ? `Dentro de \\((${A}, ${B})\\) ${dentro.length === 1 ? 'está' : 'están'} ${dentro.map(r => `\\(x = ${r}\\)`).join(' y ')}: hay que integrar por separado en ${(l => l.slice(0, -1).join(', ') + ' y ' + l[l.length - 1])(trozos.map(t => `\\([${t.a}, ${t.b}]\\)`))} y sumar los valores absolutos.`
          : `No hay cortes dentro de \\((${A}, ${B})\\): basta una integral.` },
      { t: 'Primitiva:', m: `F(x) = ${primTex(a)}` },
      ...trozos.map((t, i) => ({ t: `Regla de Barrow en \\([${t.a}, ${t.b}]\\):`, m: `I_{${i + 1}} = \\int_{${t.a}}^{${t.b}} f(x)\\,dx = F(${t.b}) - F(${t.a}) = ${primF(a, t.b).tex()} - ${primF(a, t.a).texP()} = ${t.I.tex()}` })),
      { t: trozos.length > 1 ? 'El área es la suma de los valores absolutos (las integrales negativas corresponden a tramos bajo el eje):' : 'El área es el valor absoluto de la integral:',
        m: `A = ${trozos.map((t, i) => `|I_{${i + 1}}|`).join(' + ')} = ${trozos.map(t => t.I.abs().tex()).join(' + ')}${trozos.length > 1 ? ' = ' + total.tex() : ''}\\;\\text{u}^2${total.d > 1 ? ` \\approx ${dec(total.v)}\\;\\text{u}^2` : ''}` },
      { t: 'Región cuya área hemos calculado:', html: grafArea(a, A, B, raices) }
    ];
    return { html: true, enun: enunHtml, pasos, res: `A = ${total.tex()}\\;\\text{u}^2`, chkArea: [a, A, B, total.v] };
  }

  function areaLimite(R) {
    if (R.rand() < 0.6) {
      const a = R.int(1, 4), b = R.int(1, 6), m = R.int(2, 8);
      const S = new Fr(a * m * m, 2).mas(b * m);
      const f = [b, a];
      /* a/2·m² + b·m = S con coeficientes enteros (×2 si a es impar) y simplificada */
      const L = a % 2 ? 2 : 1, g = mcd(mcd(a * L / 2, b * L), (a * m * m + 2 * b * m) * L / 2);
      const [ca, cb, cc] = [a * L / 2 / g, b * L / g, -(a * m * m + 2 * b * m) * L / 2 / g];
      const sol = resolverCuadratica(ca, cb, cc, 'm');
      const pos = new Fr(...(r => [r.n, r.d])(sol.raices.find(r => r.n > 0))), neg = new Fr(...(r => [r.n, r.d])(sol.raices.find(r => r.n < 0)));
      const enun = `\\(f(x) = ${pTex(f)}\\), entre \\(x = 0\\) y \\(x = m\\), con área \\(${S.tex()}\\;\\text{u}^2\\)`;
      return { html: true, enun, res: `m = ${pos.tex()}`, chkArea: [f, 0, pos.v, S.v], pasos: [
        { t: `Para \\(x \\ge 0\\) la función es positiva, así que el área coincide con la integral:`, m: `A = \\int_{0}^{m} (${pTex(f)})\\,dx` },
        { t: 'Primitiva y regla de Barrow:', m: `F(x) = ${primTex(f)} \\;\\Rightarrow\\; F(m) - F(0) = ${primTex(f).replace(/x/g, 'm')}` },
        { t: `Igualamos al área${L > 1 ? ', multiplicamos por 2 para quitar denominadores' : ''}${g > 1 ? ', simplificamos' : ''} y pasamos todo a un miembro:`, m: `${primTex(f).replace(/x/g, 'm')} = ${S.tex()} \\;\\Rightarrow\\; ${pTex([cc, cb, ca]).replace(/x/g, 'm')} = 0` },
        ...sol.pasos,
        { t: `Como \\(m > 0\\), descartamos la solución negativa \\(m = ${neg.tex()}\\).` }
      ] };
    }
    const a = R.int(1, 3), b = R.int(0, 4), m0 = R.int(2, 4);
    const f = [0, b, a];
    const S = new Fr(a * m0 ** 3, 3).mas(new Fr(b * m0 * m0, 2));
    /* a/3·m³ + b/2·m² = S multiplicada por el m.c.m. de los denominadores y simplificada */
    const L = [new Fr(a, 3).d, new Fr(b, 2).d, S.d].reduce((x, y) => x * y / mcd(x, y), 1);
    let c3 = new Fr(a, 3).por(L).v, c2 = new Fr(b, 2).por(L).v, c0 = -S.por(L).v;
    const g = mcd(mcd(c3, c2), c0); c3 /= g; c2 /= g; c0 /= g;
    const q1 = c2 + c3 * m0, q0 = q1 * m0;
    const ecu = pTex([c0, 0, c2, c3]).replace(/x/g, 'm');
    const enun = `\\(f(x) = ${pTex(f)}\\), entre \\(x = 0\\) y \\(x = m\\), con área \\(${S.tex()}\\;\\text{u}^2\\)`;
    return { html: true, enun, res: `m = ${m0}`, chkArea: [f, 0, m0, S.v], pasos: [
      { t: 'Para \\(x \\ge 0\\) la función es positiva (o nula), así que el área coincide con la integral:', m: `A = \\int_{0}^{m} (${pTex(f)})\\,dx` },
      { t: 'Primitiva y regla de Barrow:', m: `F(x) = ${primTex(f)} \\;\\Rightarrow\\; F(m) - F(0) = ${primTex(f).replace(/x/g, 'm')}` },
      { t: `Igualamos al área${L > 1 ? `, multiplicamos por ${L} para quitar denominadores` : ''}${g > 1 ? ', simplificamos' : ''} y pasamos todo a un miembro:`, m: `${primTex(f).replace(/x/g, 'm')} = ${S.tex()} \\;\\Rightarrow\\; ${ecu} = 0` },
      { t: `Es una ecuación de tercer grado. Probamos con los divisores del término independiente (regla de Ruffini): \\(m = ${m0}\\) es raíz.`, m: `${ecu} = (m - ${m0})(${pTex([q0, q1, c3]).replace(/x/g, 'm')})` },
      { t: 'El segundo factor tiene todos sus coeficientes positivos, así que no se anula para \\(m > 0\\). La única solución válida es la obtenida.' }
    ] };
  }

  /* ================= Registro ================= */
  const ENUN = ['Calcula la integral:', 'Calcula las siguientes integrales:'];
  registrarFicha({
    id: 'integrales-1', titulo: 'Integrales inmediatas', detalle: 'Potencias, raíces, exponenciales, 1/x, seno y coseno', grupo: GRUPO,
    enlace: '../integrales/integrales-1.html',
    ejercicios: [
      { id: 'mezcla', nombre: 'Integrales variadas (sin decir el tipo)', peso: 0.75, columnas: 2, enunciado: ENUN, generar: mezcla1 },
      { id: 'polinomio', nombre: 'Polinomios', peso: 0.75, columnas: 2, enunciado: ENUN, generar: inmPolinomio },
      { id: 'raiz', nombre: 'Raíces y potencias de exponente fraccionario', peso: 0.75, columnas: 2, enunciado: ENUN, generar: inmRaiz },
      { id: 'exponencial', nombre: 'Exponenciales', peso: 0.5, columnas: 2, enunciado: ENUN, generar: inmExponencial },
      { id: 'logaritmo', nombre: 'Del tipo 1/x (logaritmo)', peso: 0.5, columnas: 2, enunciado: ENUN, generar: inmLogaritmo },
      { id: 'sencos', nombre: 'Seno y coseno', peso: 0.5, columnas: 2, enunciado: ENUN, generar: inmSenCos }
    ]
  });
  registrarFicha({
    id: 'integrales-2', titulo: 'Integrales inmediatas II', detalle: 'Nivel avanzado', grupo: GRUPO,
    enlace: '../integrales/integrales-2.html',
    ejercicios: [
      { id: 'mezcla', nombre: 'Integrales variadas (sin decir el tipo)', peso: 1, columnas: 2, enunciado: ENUN, generar: mezcla2 },
      { id: 'polinomio', nombre: 'Polinomios con coeficientes fraccionarios', peso: 1, columnas: 2, enunciado: ENUN, generar: avPolinomio },
      { id: 'raiz', nombre: 'Raíces de potencias', peso: 1, columnas: 2, enunciado: ENUN, generar: avRaiz },
      { id: 'exponencial', nombre: 'Exponenciales de distintas bases', peso: 0.75, columnas: 2, enunciado: ENUN, generar: avExponencial },
      { id: 'logaritmo', nombre: 'Logaritmo combinado con potencias negativas', peso: 1, columnas: 2, enunciado: ENUN, generar: avLogaritmo },
      { id: 'fraccion', nombre: 'Fracciones k/xⁿ', peso: 0.75, columnas: 2, enunciado: ENUN, generar: avFraccion },
      { id: 'sencos', nombre: 'Seno, coseno y constantes', peso: 0.75, columnas: 2, enunciado: ENUN, generar: avSenCos }
    ]
  });
  registrarFicha({
    id: 'integrales-area', titulo: 'Cálculo de áreas', detalle: 'Regla de Barrow', grupo: GRUPO,
    enlace: '../integrales/calculo-de-area.html',
    ejercicios: [
      { id: 'area', nombre: 'Área entre una curva y el eje OX', peso: 2, columnas: 1,
        enunciado: ['Calcula el área de la región limitada por la gráfica de la función, el eje OX y las rectas verticales indicadas:', 'Calcula, en cada caso, el área de la región limitada por la gráfica de la función, el eje OX y las rectas verticales indicadas:'],
        generar: areaCurva },
      { id: 'limite', nombre: 'Hallar m conocida el área', peso: 2, columnas: 1,
        enunciado: ['Halla el valor de \\(m > 0\\) para que el área de la región limitada por la gráfica de la función, el eje OX y las rectas verticales indicadas sea la que se da:', 'Halla, en cada caso, el valor de \\(m > 0\\) para que el área de la región limitada por la gráfica de la función, el eje OX y las rectas verticales indicadas sea la que se da:'],
        generar: areaLimite }
    ]
  });
})();
