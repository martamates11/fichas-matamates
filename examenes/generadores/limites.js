/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: límites y continuidad (1.º y 2.º Bachillerato).
   Corresponden a las fichas de limites/: concepto de límite, tipos de discontinuidad,
   resolución de indeterminaciones y aplicaciones (asíntotas y continuidad con parámetro).
   Los números se generan con los mismos criterios que las fichas interactivas; las fichas
   de lectura de gráficas usan aquí gráficas con valores al azar (en las fichas son fijas). */
(function () {
  'use strict';
  const { registrarFicha } = window.EX;
  const GRUPO = 'Límites y continuidad';

  /* ================= Utilidades ================= */
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
  class Fr {
    constructor(n, d = 1) {
      if (d < 0) { n = -n; d = -d; }
      const g = mcd(n, d);
      this.n = n / g + 0; this.d = d / g;
      if (Object.is(this.n, -0)) this.n = 0;
    }
    get v() { return this.n / this.d; }
    tex() { return this.d === 1 ? String(this.n) : (this.n < 0 ? '-' : '') + '\\frac{' + Math.abs(this.n) + '}{' + this.d + '}'; }
  }
  const NUM = (n, d = 1) => ({ k: 'num', f: new Fr(n, d) });
  const INF = s => ({ k: 'inf', s: s > 0 ? 1 : -1 });
  const solTex = s => (s.k === 'inf' ? (s.s > 0 ? '+\\infty' : '-\\infty') : s.f.tex());

  const co = c => (c === 1 ? '' : c === -1 ? '-' : String(c));
  const xp = e => (e === 0 ? '' : e === 1 ? 'x' : `x^{${e}}`);
  function sumaTex(terms) {
    let s = '';
    for (const [c, b] of terms) {
      if (c === 0) continue;
      const abs = Math.abs(c);
      const core = b === '' ? String(abs) : (abs === 1 ? '' : abs) + b;
      s += s === '' ? (c < 0 ? '-' : '') + core : (c < 0 ? ' - ' : ' + ') + core;
    }
    return s || '0';
  }
  const polyTex = terms => sumaTex(terms.map(([c, e]) => [c, xp(e)]));
  const polyEval = (terms, x) => terms.reduce((acc, [c, e]) => acc + c * Math.pow(x, e), 0);
  const xMenos = a => (a === 0 ? 'x' : a > 0 ? `x - ${a}` : `x + ${-a}`);
  const par = s => (/^[a-z]$/.test(s) ? s : `(${s})`);
  const pp = x => (x < 0 ? `(${x})` : String(x));
  const resta = (a, b) => (b === 0 ? String(a) : b < 0 ? `${a} + ${-b}` : `${a} - ${b}`);
  const restaIgual = (a, b) => (b === 0 ? String(a) : `${resta(a, b)} = ${a - b}`);
  const fq = (n, d) => (d === 1 ? String(n) : `\\frac{${n}}{${d}}`);
  function fracIgual(n, d) {
    const f = new Fr(n, d);
    return (d > 0 && f.n === n && f.d === d) ? f.tex() : `${fq(n, d)} = ${f.tex()}`;
  }
  /* Coeficiente fraccionario delante de una parte literal: 1 y −1 no se escriben */
  function coefFr(f, lit) {
    if (f.d === 1 && f.n === 1) return lit;
    if (f.d === 1 && f.n === -1) return '-' + lit;
    return f.tex() + lit;
  }
  const LIM_INF = '\\lim_{x \\to +\\infty}';
  const LIM_P = x0 => `\\lim_{x \\to ${x0}}`;
  const DIST = (R, a, b, excl) => { let v; do { v = R.int(a, b); } while (excl.includes(v)); return v; };
  function pesado(R, lista) {
    const tot = lista.reduce((s, [w]) => s + w, 0);
    let r = R.rand() * tot;
    for (const [w, f] of lista) { r -= w; if (r < 0) return f(R); }
    return lista[lista.length - 1][1](R);
  }
  const conRes = o => { o.res = `${o.enun} = ${solTex(o.sol)}`; return o; };

  /* =====================================================================
     RESOLUCIÓN DE INDETERMINACIONES
     ===================================================================== */

  /* ---------- ∞/∞ ---------- */
  function genA_poly(R) {
    const p = R.int(1, 4), q = R.int(1, 4);
    const a = R.pick([1, 2, 3, 4, 5, 6, 7, -1, -2, -3, -5]), c = R.int(1, 7);
    const num = [[a, p]], den = [[c, q]];
    for (let e = p - 1; e >= 0; e--) if (R.rand() < 0.45) num.push([R.nz(-9, 9), e]);
    for (let e = q - 1; e >= 0; e--) if (R.rand() < 0.45) den.push([R.nz(-9, 9), e]);
    if (num.length === 1) num.push([R.nz(-9, 9), 0]);
    if (den.length === 1) den.push([R.nz(-9, 9), 0]);
    const sol = p > q ? INF(a) : p === q ? NUM(a, c) : NUM(0);
    const lider = `${LIM_INF} \\frac{${polyTex([[a, p]])}}{${polyTex([[c, q]])}}`;
    let t, m;
    if (p > q) {
      t = 'El grado del numerador es mayor que el del denominador: el límite es infinito, con el signo del cociente de los coeficientes principales.';
      m = `${lider} = ${LIM_INF} ${coefFr(new Fr(a, c), xp(p - q))} = ${solTex(sol)}`;
    } else if (p === q) {
      t = 'Los grados son iguales: el límite es el cociente de los coeficientes principales.';
      m = `${lider} = ${fracIgual(a, c)}`;
    } else {
      t = 'El grado del denominador es mayor: el denominador crece mucho más deprisa y el límite es 0.';
      m = `${lider} = ${LIM_INF} \\frac{${a}}{${co(c)}${xp(q - p)}} = 0`;
    }
    return conRes({
      enun: `${LIM_INF} \\frac{${polyTex(num)}}{${polyTex(den)}}`, sol,
      pasos: [
        { t: `Al sustituir aparece \\(\\frac{\\infty}{\\infty}\\): indeterminación. Comparamos grados: el numerador tiene grado ${p} y el denominador, grado ${q}. Solo cuentan los términos de mayor grado:` , m: lider },
        { t, m }
      ]
    });
  }
  function genA_raiz(R) {
    const n = R.int(1, 3), a = R.int(1, 5), c = R.int(1, 6), k = R.int(0, 2 * n - 1), b = R.nz(-9, 9), d = R.nz(-9, 9);
    const rad = [[a * a, 2 * n], [b, k]], den = [[c, n], [d, 0]];
    const Rt = polyTex(rad), lider = polyTex([[a * a, 2 * n]]);
    return conRes({
      enun: `${LIM_INF} \\frac{\\sqrt{${Rt}}}{${polyTex(den)}}`, sol: NUM(a, c),
      pasos: [
        { t: 'Aparece \\(\\frac{\\infty}{\\infty}\\). Dentro de la raíz manda el término de mayor grado:', m: `\\sqrt{${Rt}} \\approx \\sqrt{${lider}} = ${polyTex([[a, n]])}` },
        { t: `El grado efectivo del numerador es \\(\\tfrac{${2 * n}}{2} = ${n}\\), igual que el del denominador: el límite es el cociente de los coeficientes principales.`,
          m: `${LIM_INF} \\frac{${polyTex([[a, n]])}}{${polyTex([[c, n]])}} = ${fracIgual(a, c)}` }
      ]
    });
  }
  function genA_raizGrado(R) {
    const n = R.int(1, 3), m = DIST(R, 1, 4, [n]), a = R.int(1, 5), c = R.int(1, 6), k = R.int(0, 2 * n - 1), b = R.nz(-9, 9), d = R.nz(-9, 9);
    const rad = [[a * a, 2 * n], [b, k]], den = [[c, m], [d, 0]];
    const Rt = polyTex(rad), lider = polyTex([[a * a, 2 * n]]);
    const sol = m > n ? NUM(0) : INF(1);
    return conRes({
      enun: `${LIM_INF} \\frac{\\sqrt{${Rt}}}{${polyTex(den)}}`, sol,
      pasos: [
        { t: 'Aparece \\(\\frac{\\infty}{\\infty}\\). Dentro de la raíz manda el término de mayor grado:', m: `\\sqrt{${Rt}} \\approx \\sqrt{${lider}} = ${polyTex([[a, n]])}` },
        { t: m > n
            ? `El grado efectivo del numerador es ${n} y el del denominador, ${m}, mayor: el denominador crece más deprisa y el límite es 0.`
            : `El grado efectivo del numerador es ${n} y el del denominador, ${m}, menor: el numerador crece más deprisa y, como ambos son positivos, el límite es \\(+\\infty\\).`,
          m: `${LIM_INF} \\frac{${polyTex([[a, n]])}}{${polyTex([[c, m]])}} = ${solTex(sol)}` }
      ]
    });
  }
  function genA_raizX(R) {
    const a = R.pick([1, 2, 3, 4, 5, 6, 7, -2, -3]), b = R.nz(-6, 6), c = R.int(1, 6), d = R.nz(-6, 6);
    const sobre = (k, v) => `${k < 0 ? ' - ' : ' + '}\\frac{${Math.abs(k)}}{${v}}`;
    return conRes({
      enun: `${LIM_INF} \\frac{${sumaTex([[a, 'x'], [b, '\\sqrt{x}']])}}{${sumaTex([[c, 'x'], [d, '\\sqrt{x}']])}}`, sol: NUM(a, c),
      pasos: [
        { t: 'Aparece \\(\\frac{\\infty}{\\infty}\\). Dividimos numerador y denominador entre \\(x\\), la potencia que manda (\\(\\sqrt{x}\\) tiene grado \\(\\tfrac12\\)):',
          m: `${LIM_INF} \\frac{${a}${sobre(b, '\\sqrt{x}')}}{${c}${sobre(d, '\\sqrt{x}')}}` },
        { t: 'Como \\(\\frac{1}{\\sqrt{x}} \\to 0\\), quedan solo los coeficientes de \\(x\\):', m: `= ${fracIgual(a, c)}` }
      ]
    });
  }
  const genA = R => pesado(R, [[3, genA_poly], [3, genA_raiz], [1, genA_raizGrado], [1, genA_raizX]]);

  /* ---------- ∞ − ∞ ---------- */
  function genB_punto(R) {
    const a = R.int(1, 6), m = R.int(1, 4), k = 2 * a * m, inv = R.rand() < 0.35;
    const f1 = `\\frac{${m}}{${xMenos(a)}}`, f2 = `\\frac{${k}}{x^2 - ${a * a}}`;
    const den = `(x - ${a})(x + ${a})`;
    const numer = inv ? `${k} - ${co(m)}(x + ${a})` : `${co(m)}(x + ${a}) - ${k}`;
    const exp = inv ? polyTex([[-m, 1], [k - m * a, 0]]) : polyTex([[m, 1], [m * a - k, 0]]);
    const simpl = inv ? (m === 1 ? '-' : `-${m}`) : co(m);
    const fin = inv ? -m : m;
    return conRes({
      enun: `${LIM_P(a)} \\left( ${inv ? f2 + ' - ' + f1 : f1 + ' - ' + f2} \\right)`, sol: NUM(fin, 2 * a),
      pasos: [
        { t: `Al sustituir \\(x = ${a}\\), los dos sumandos tienden a infinito: indeterminación \\(\\infty - \\infty\\). Como \\(x^2 - ${a * a} = ${den}\\), hacemos común denominador:`,
          m: `\\frac{${numer}}{${den}} = \\frac{${exp}}{${den}} = \\frac{${simpl}(x - ${a})}{${den}}` },
        { t: `Simplificamos el factor \\((x - ${a})\\) y sustituimos:`, m: `${LIM_P(a)} \\frac{${fin}}{x + ${a}} = ${fracIgual(fin, 2 * a)}` }
      ]
    });
  }
  function genB_cubica(R) {
    const a = R.int(1, 3), m = R.int(1, 3), k = 3 * a * a * m;
    const tri = polyTex([[1, 2], [a, 1], [a * a, 0]]), tri2 = polyTex([[1, 2], [a, 1], [-2 * a * a, 0]]);
    const den = `(x - ${a})(${tri})`;
    return conRes({
      enun: `${LIM_P(a)} \\left( \\frac{${m}}{x - ${a}} - \\frac{${k}}{x^3 - ${a ** 3}} \\right)`, sol: NUM(m, a),
      pasos: [
        { t: `Al sustituir \\(x = ${a}\\) aparece \\(\\infty - \\infty\\). Como \\(x^3 - ${a ** 3} = ${den}\\), ese es el común denominador:`,
          m: `\\frac{${co(m)}(${tri}) - ${k}}{${den}} = \\frac{${co(m)}(${tri2})}{${den}} = \\frac{${co(m)}(x - ${a})(x + ${2 * a})}{${den}}` },
        { t: `Simplificamos \\((x - ${a})\\) y sustituimos:`,
          m: `${LIM_P(a)} \\frac{${co(m)}(x + ${2 * a})}{${tri}} = \\frac{${3 * a * m}}{${3 * a * a}} = ${new Fr(m, a).tex()}` }
      ]
    });
  }
  function genB_infRaiz(R) {
    const a = R.int(1, 4), b = R.nz(-9, 9), c = R.int(0, 9);
    const Rt = polyTex([[a * a, 2], [b, 1], [c, 0]]);
    const conj = `\\sqrt{${Rt}} + ${co(a)}x`;
    return conRes({
      enun: `${LIM_INF} \\left( \\sqrt{${Rt}} - ${co(a)}x \\right)`, sol: NUM(b, 2 * a),
      pasos: [
        { t: `Los dos términos tienden a \\(+\\infty\\): indeterminación \\(\\infty - \\infty\\). Multiplicamos y dividimos por el conjugado \\(${conj}\\):`,
          m: `${LIM_INF} \\frac{(${Rt}) - ${polyTex([[a * a, 2]])}}{${conj}} = ${LIM_INF} \\frac{${polyTex([[b, 1], [c, 0]])}}{${conj}}` },
        { t: `Ahora es \\(\\frac{\\infty}{\\infty}\\) con grados iguales. La raíz se comporta como \\(${co(a)}x\\), así que el denominador se comporta como \\(${2 * a}x\\):`,
          m: `${LIM_INF} \\frac{${co(b)}x}{${2 * a}x} = ${fracIgual(b, 2 * a)}` }
      ]
    });
  }
  function genB_infRaizInf(R) {
    const a = R.int(1, 4), c = DIST(R, 1, 6, [a]), b = R.nz(-9, 9);
    const Rt = polyTex([[a * a, 2], [b, 1]]);
    const sol = INF(a - c);
    return conRes({
      enun: `${LIM_INF} \\left( \\sqrt{${Rt}} - ${co(c)}x \\right)`, sol,
      pasos: [
        { t: `Parece \\(\\infty - \\infty\\), pero la raíz se comporta como \\(\\sqrt{${polyTex([[a * a, 2]])}} = ${co(a)}x\\):`,
          m: `${LIM_INF} \\left( \\sqrt{${Rt}} - ${co(c)}x \\right) = ${LIM_INF} \\left( ${co(a)}x - ${co(c)}x \\right) = ${LIM_INF} ${co(a - c)}x = ${solTex(sol)}` },
        { t: 'Como los coeficientes de \\(x\\) no coinciden, no hay cancelación y el límite es infinito.' }
      ]
    });
  }
  function genB_dosRaices(R) {
    const a = R.int(1, 3), b = R.nz(-9, 9), d = DIST(R, -9, 9, [0, b]);
    const R1 = polyTex([[a * a, 2], [b, 1]]), R2 = polyTex([[a * a, 2], [d, 1]]);
    const conj = `\\sqrt{${R1}} + \\sqrt{${R2}}`;
    return conRes({
      enun: `${LIM_INF} \\left( \\sqrt{${R1}} - \\sqrt{${R2}} \\right)`, sol: NUM(b - d, 2 * a),
      pasos: [
        { t: `Aparece \\(\\infty - \\infty\\). Multiplicamos y dividimos por el conjugado \\(${conj}\\):`,
          m: `${LIM_INF} \\frac{(${R1}) - (${R2})}{${conj}} = ${LIM_INF} \\frac{${polyTex([[b - d, 1]])}}{${conj}}` },
        { t: `Cada raíz se comporta como \\(${co(a)}x\\), así que el denominador se comporta como \\(${2 * a}x\\):`,
          m: `${LIM_INF} \\frac{${co(b - d)}x}{${2 * a}x} = ${fracIgual(b - d, 2 * a)}` }
      ]
    });
  }
  const genB = R => pesado(R, [[4, genB_punto], [1, genB_cubica], [3, genB_infRaiz], [1, genB_infRaizInf], [1, genB_dosRaices]]);

  /* ---------- 0/0 por factorización ---------- */
  const CERO = a => `Al sustituir \\(x = ${a}\\) sale \\(\\frac{0}{0}\\): indeterminación.`;
  function genC_dif(R) {
    const a = R.nz(-6, 6);
    return conRes({
      enun: `${LIM_P(a)} \\frac{x^2 - ${a * a}}{${xMenos(a)}}`, sol: NUM(2 * a),
      pasos: [
        { t: `${CERO(a)} Factorizamos la diferencia de cuadrados y simplificamos el factor que se anula:`,
          m: `\\frac{x^2 - ${a * a}}{${xMenos(a)}} = \\frac{(${xMenos(a)})(${xMenos(-a)})}{${xMenos(a)}} = ${xMenos(-a)}` },
        { t: 'Sustituimos:', m: `${LIM_P(a)} (${xMenos(-a)}) = ${resta(a, -a)} = ${2 * a}` }
      ]
    });
  }
  function genC_trin(R) {
    const a = R.nz(-5, 5), b = DIST(R, -5, 5, [a, 0]);
    const num = polyTex([[1, 2], [-(a + b), 1], [a * b, 0]]);
    return conRes({
      enun: `${LIM_P(a)} \\frac{${num}}{${xMenos(a)}}`, sol: NUM(a - b),
      pasos: [
        { t: `${CERO(a)} Como \\(x = ${a}\\) anula el numerador, \\((${xMenos(a)})\\) es un factor suyo (por Ruffini o resolviendo la ecuación de segundo grado):`,
          m: `\\frac{${num}}{${xMenos(a)}} = \\frac{(${xMenos(a)})(${xMenos(b)})}{${xMenos(a)}} = ${xMenos(b)}` },
        { t: 'Sustituimos:', m: `${LIM_P(a)} (${xMenos(b)}) = ${restaIgual(a, b)}` }
      ]
    });
  }
  function genC_trinTrin(R) {
    const a = R.nz(-5, 5), b = DIST(R, -5, 5, [a, 0]), c = DIST(R, -5, 5, [a, b, 0]);
    const num = polyTex([[1, 2], [-(a + b), 1], [a * b, 0]]), den = polyTex([[1, 2], [-(a + c), 1], [a * c, 0]]);
    return conRes({
      enun: `${LIM_P(a)} \\frac{${num}}{${den}}`, sol: NUM(a - b, a - c),
      pasos: [
        { t: `${CERO(a)} Los dos polinomios tienen el factor \\((${xMenos(a)})\\). Factorizamos ambos y simplificamos:`,
          m: `\\frac{${num}}{${den}} = \\frac{(${xMenos(a)})(${xMenos(b)})}{(${xMenos(a)})(${xMenos(c)})} = \\frac{${xMenos(b)}}{${xMenos(c)}}` },
        { t: 'Sustituimos:', m: `${LIM_P(a)} \\frac{${xMenos(b)}}{${xMenos(c)}} = \\frac{${resta(a, b)}}{${resta(a, c)}} = ${fracIgual(a - b, a - c)}` }
      ]
    });
  }
  function genC_cubica(R) {
    const a = R.pick([1, 2, 3, -1, -2]);
    const num = polyTex([[1, 3], [-(a ** 3), 0]]), tri = polyTex([[1, 2], [a, 1], [a * a, 0]]);
    return conRes({
      enun: `${LIM_P(a)} \\frac{${num}}{${xMenos(a)}}`, sol: NUM(3 * a * a),
      pasos: [
        { t: `${CERO(a)} Factorizamos el numerador por Ruffini (o con \\(x^3 - a^3 = (x - a)(x^2 + ax + a^2)\\)):`,
          m: `\\frac{${num}}{${xMenos(a)}} = \\frac{(${xMenos(a)})(${tri})}{${xMenos(a)}} = ${tri}` },
        { t: 'Sustituimos:', m: `${LIM_P(a)} (${tri}) = ${a * a} + ${a * a} + ${a * a} = ${3 * a * a}` }
      ]
    });
  }
  function genC_comun(R) {
    let k, m, n, p;
    do { k = R.nz(-6, 6); m = R.nz(-9, 9); n = R.nz(-6, 6); p = R.nz(-9, 9); } while (k * p === m * n);
    const N1 = polyTex([[k, 1], [m, 0]]), D1 = polyTex([[n, 1], [p, 0]]);
    return conRes({
      enun: `${LIM_P(0)} \\frac{${polyTex([[k, 2], [m, 1]])}}{${polyTex([[n, 2], [p, 1]])}}`, sol: NUM(m, p),
      pasos: [
        { t: `${CERO(0)} Sacamos factor común \\(x\\) y simplificamos:`,
          m: `\\frac{${polyTex([[k, 2], [m, 1]])}}{${polyTex([[n, 2], [p, 1]])}} = \\frac{x(${N1})}{x(${D1})} = \\frac{${N1}}{${D1}}` },
        { t: 'Sustituimos \\(x = 0\\):', m: `${LIM_P(0)} \\frac{${N1}}{${D1}} = ${fracIgual(m, p)}` }
      ]
    });
  }
  const genC = R => pesado(R, [[2, genC_dif], [3, genC_trin], [2, genC_trinTrin], [1, genC_cubica], [2, genC_comun]]);

  /* ---------- 0/0 con raíces (conjugado) ---------- */
  function genD_1(R) {
    const a = R.int(1, 6), k = R.nz(-5, 6);
    const rad = sumaTex([[a * a, ''], [k, 'x']]);
    const conj = `\\sqrt{${rad}} + ${a}`;
    return conRes({
      enun: `${LIM_P(0)} \\frac{\\sqrt{${rad}} - ${a}}{x}`, sol: NUM(k, 2 * a),
      pasos: [
        { t: `${CERO(0)} Multiplicamos numerador y denominador por el conjugado \\(${conj}\\):`,
          m: `\\frac{(${rad}) - ${a * a}}{x\\left(${conj}\\right)} = \\frac{${sumaTex([[k, 'x']])}}{x\\left(${conj}\\right)} = \\frac{${k}}{${conj}}` },
        { t: 'Sustituimos \\(x = 0\\):', m: `${LIM_P(0)} \\frac{${k}}{${conj}} = \\frac{${k}}{${a} + ${a}} = ${new Fr(k, 2 * a).tex()}` }
      ]
    });
  }
  function genD_2(R) {
    const a = R.int(2, 5), p = R.int(0, 6), x0 = a * a - p;
    const rad = sumaTex([[1, 'x'], [p, '']]), den = xMenos(x0);
    const conj = `\\sqrt{${rad}} + ${a}`;
    return conRes({
      enun: `${LIM_P(x0)} \\frac{\\sqrt{${rad}} - ${a}}{${den}}`, sol: NUM(1, 2 * a),
      pasos: [
        { t: `${CERO(x0)} Multiplicamos por el conjugado \\(${conj}\\):`,
          m: `\\frac{${par(rad)} - ${a * a}}{${par(den)}\\left(${conj}\\right)} = \\frac{${den}}{${par(den)}\\left(${conj}\\right)} = \\frac{1}{${conj}}` },
        { t: 'Sustituimos:', m: `${LIM_P(x0)} \\frac{1}{${conj}} = \\frac{1}{${a} + ${a}} = \\frac{1}{${2 * a}}` }
      ]
    });
  }
  function genD_3(R) {
    const a = R.int(2, 5), p = R.int(0, 6), x0 = a * a - p;
    const rad = sumaTex([[1, 'x'], [p, '']]), den = xMenos(x0);
    const conj = `\\sqrt{${rad}} + ${a}`;
    return conRes({
      enun: `${LIM_P(x0)} \\frac{${den}}{\\sqrt{${rad}} - ${a}}`, sol: NUM(2 * a),
      pasos: [
        { t: `${CERO(x0)} La raíz está en el denominador: multiplicamos por su conjugado \\(${conj}\\):`,
          m: `\\frac{${par(den)}\\left(${conj}\\right)}{${par(rad)} - ${a * a}} = \\frac{${par(den)}\\left(${conj}\\right)}{${den}} = ${conj}` },
        { t: 'Sustituimos:', m: `${LIM_P(x0)} \\left(${conj}\\right) = ${a} + ${a} = ${2 * a}` }
      ]
    });
  }
  function genD_4(R) {
    const a = R.int(1, 5);
    const r1 = `${a * a} + x`, r2 = `${a * a} - x`;
    const conj = `\\sqrt{${r1}} + \\sqrt{${r2}}`;
    return conRes({
      enun: `${LIM_P(0)} \\frac{\\sqrt{${r1}} - \\sqrt{${r2}}}{x}`, sol: NUM(1, a),
      pasos: [
        { t: `${CERO(0)} Multiplicamos por el conjugado \\(${conj}\\):`,
          m: `\\frac{(${r1}) - (${r2})}{x\\left(${conj}\\right)} = \\frac{2x}{x\\left(${conj}\\right)} = \\frac{2}{${conj}}` },
        { t: 'Sustituimos:', m: `${LIM_P(0)} \\frac{2}{${conj}} = \\frac{2}{${a} + ${a}} = ${new Fr(1, a).tex()}` }
      ]
    });
  }
  function genD_5(R) {
    const a = R.int(1, 5), k = R.int(1, 5);
    const rad = sumaTex([[k, 'x^{2}'], [a * a, '']]);
    const conj = `\\sqrt{${rad}} + ${a}`;
    return conRes({
      enun: `${LIM_P(0)} \\frac{\\sqrt{${rad}} - ${a}}{x^2}`, sol: NUM(k, 2 * a),
      pasos: [
        { t: `${CERO(0)} Multiplicamos por el conjugado \\(${conj}\\):`,
          m: `\\frac{(${rad}) - ${a * a}}{x^2\\left(${conj}\\right)} = \\frac{${co(k)}x^2}{x^2\\left(${conj}\\right)} = \\frac{${k}}{${conj}}` },
        { t: 'Sustituimos:', m: `${LIM_P(0)} \\frac{${k}}{${conj}} = \\frac{${k}}{${a} + ${a}} = ${new Fr(k, 2 * a).tex()}` }
      ]
    });
  }
  const genD = R => pesado(R, [[3, genD_1], [2, genD_2], [2, genD_3], [1, genD_4], [1, genD_5]]);

  /* ---------- Sin indeterminación ---------- */
  function genE_poly(R) {
    const x0 = R.int(-3, 3), g = R.int(2, 3);
    const t = [[R.nz(-4, 4), g]];
    for (let e = g - 1; e >= 0; e--) if (R.rand() < 0.7) t.push([R.nz(-6, 6), e]);
    if (t.length === 1) t.push([R.nz(-6, 6), 0]);
    const v = polyEval(t, x0);
    const sust = t.map(([c, e], i) => {
      const abs = Math.abs(c);
      const cuerpo = e === 0 ? String(abs) : (abs === 1 ? '' : abs + '\\cdot ') + (e === 1 ? pp(x0) : `${pp(x0)}^{${e}}`);
      return (i === 0 ? (c < 0 ? '-' : '') : (c < 0 ? ' - ' : ' + ')) + cuerpo;
    }).join('');
    return conRes({
      enun: `${LIM_P(x0)} \\left( ${polyTex(t)} \\right)`, sol: NUM(v),
      pasos: [{ t: `No hay indeterminación: un polinomio es continuo en todo \\(\\mathbb{R}\\), así que basta sustituir \\(x = ${x0}\\):`, m: `${sust} = ${v}` }]
    });
  }
  function genE_trampa(R) {
    const b = R.nz(-6, 6);
    return conRes({
      enun: `${LIM_P(b)} \\frac{x^2 - ${b * b}}{${xMenos(-b)}}`, sol: NUM(0),
      pasos: [{ t: `Cuidado: al sustituir \\(x = ${b}\\) el denominador vale \\(${resta(b, -b)} = ${2 * b} \\neq 0\\). No hay indeterminación:`, m: `\\frac{${b * b} - ${b * b}}{${2 * b}} = \\frac{0}{${2 * b}} = 0` }]
    });
  }
  function genE_racional(R) {
    const p = R.nz(-9, 9), q = R.nz(-5, 5), x0 = DIST(R, -4, 4, [q]);
    return conRes({
      enun: `${LIM_P(x0)} \\frac{${polyTex([[1, 2], [p, 0]])}}{${xMenos(q)}}`, sol: NUM(x0 * x0 + p, x0 - q),
      pasos: [{ t: `Al sustituir \\(x = ${x0}\\), el denominador vale \\(${resta(x0, q)} = ${x0 - q} \\neq 0\\): no hay indeterminación y basta sustituir.`,
        m: `\\frac{${pp(x0)}^2 ${p < 0 ? '-' : '+'} ${Math.abs(p)}}{${x0 - q}} = ${fracIgual(x0 * x0 + p, x0 - q)}` }]
    });
  }
  function genE_raiz(R) {
    const r0 = R.int(1, 5), x0 = R.int(-3, 6), p = r0 * r0 - x0, q = R.nz(-5, 5);
    const rad = sumaTex([[1, 'x'], [p, '']]);
    return conRes({
      enun: `${LIM_P(x0)} \\left( \\sqrt{${rad}} ${q < 0 ? '-' : '+'} ${Math.abs(q)} \\right)`, sol: NUM(r0 + q),
      pasos: [{ t: `No hay indeterminación: la raíz es continua donde el radicando es positivo, y en \\(x = ${x0}\\) el radicando vale ${r0 * r0}. Sustituimos:`,
        m: `\\sqrt{${r0 * r0}} ${q < 0 ? '-' : '+'} ${Math.abs(q)} = ${r0} ${q < 0 ? '-' : '+'} ${Math.abs(q)} = ${r0 + q}` }]
    });
  }
  function genE_inf(R) {
    const k = R.nz(-6, 6), a = R.nz(-4, 4);
    const sol = INF(k);
    return conRes({
      enun: `${LIM_P(a)} \\frac{${k}}{(${xMenos(a)})^2}`, sol,
      pasos: [
        { t: `Al sustituir \\(x = ${a}\\) sale \\(\\frac{${k}}{0}\\), que <b>no</b> es una indeterminación: el límite es infinito.` },
        { t: `Como \\((${xMenos(a)})^2\\) es positivo a ambos lados de \\(x = ${a}\\), el denominador tiende a \\(0^+\\) y el signo lo da el numerador:`, m: `\\frac{${k}}{0^+} = ${solTex(sol)}` }
      ]
    });
  }
  const genE = R => pesado(R, [[2, genE_poly], [2, genE_trampa], [1, genE_racional], [2, genE_raiz], [1, genE_inf]]);

  const MEZCLA = [genA, genB, genC, genD, genE];
  function mezcla(R, i) { return MEZCLA[(i + R.int(0, 4)) % 5](R); }

  /* =====================================================================
     APLICACIONES: ASÍNTOTAS
     Polinomios como listas de coeficientes de mayor a menor grado.
     ===================================================================== */
  function tIni(v, suf = '') {
    if (v === 0) return suf === '' ? '0' : '';
    const m = Math.abs(v);
    return (v < 0 ? '-' : '') + ((suf !== '' && m === 1) ? '' : String(m)) + suf;
  }
  function tSig(v, suf = '') {
    if (v === 0) return '';
    const m = Math.abs(v);
    return (v < 0 ? ' - ' : ' + ') + ((suf !== '' && m === 1) ? '' : String(m)) + suf;
  }
  function pc(cs) {
    const g = cs.length - 1; let out = '';
    cs.forEach((c, i) => {
      if (c === 0) return;
      const e = g - i, v = e === 0 ? '' : (e === 1 ? 'x' : `x^{${e}}`);
      out += out === '' ? tIni(c, v) : tSig(c, v);
    });
    return out === '' ? '0' : out;
  }
  const pcEval = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
  function pcMul(a, b) {
    const r = new Array(a.length + b.length - 1).fill(0);
    a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; }));
    return r;
  }
  const lin = r => [1, r === 0 ? 0 : -r];
  const NO_OBL = 'Hay asíntota horizontal tanto en \\(+\\infty\\) como en \\(-\\infty\\), así que no puede haber oblicua.';
  const NO_HOR = g => `El grado del numerador (${g[0]}) es mayor que el del denominador (${g[1]}): el límite en \\(\\pm\\infty\\) es infinito, no hay asíntota horizontal.`;
  const AV = (r, n) => `\\(\\lim_{x \\to ${r}} f(x) = \\frac{${n}}{0} = \\pm\\infty\\): asíntota vertical \\(x = ${r}\\).`;

  function asA(R) {
    let r1, r2; do { r1 = R.int(-4, 4); r2 = R.int(-4, 4); } while (r1 === r2);
    const p = R.pick([1, 2, 3, -1, -2]);
    const D = pcMul(lin(r1), lin(r2));
    const hueco = R.rand() < 0.35;
    let N, s = null;
    if (hueco) { do { s = R.int(-4, 4); } while (s === r1 || s === r2); N = pcMul([p], pcMul(lin(r1), lin(s))); }
    else { do { N = [p, R.int(-6, 6), R.int(-6, 6)]; } while (pcEval(N, r1) === 0 || pcEval(N, r2) === 0); }
    const va = [], txt = [`El denominador se anula en \\(x = ${r1}\\) y en \\(x = ${r2}\\).`];
    [r1, r2].forEach(r => {
      const n = pcEval(N, r);
      if (n !== 0) { va.push(r); txt.push(`En \\(x = ${r}\\) el numerador vale \\(${n} \\neq 0\\): ${AV(r, n)}`); }
      else {
        const lim = new Fr(p * (r1 - s), r1 - r2);
        txt.push(`En \\(x = ${r}\\) también se anula el numerador. Simplificando el factor \\(${par(pc(lin(r)))}\\) queda \\(\\lim_{x \\to ${r}} f(x) = ${lim.tex()}\\), finito: es una discontinuidad evitable, no una asíntota.`);
      }
    });
    return {
      latex: `\\frac{${pc(N)}}{${pc(D)}}`, va, ha: [p], oa: null,
      eva: txt.join(' '),
      eha: `Numerador y denominador tienen el mismo grado (2): \\(\\lim_{x \\to \\pm\\infty} f(x) = \\frac{${p}}{1} = ${p}\\). Asíntota horizontal \\(y = ${p}\\).`,
      eoa: NO_OBL
    };
  }
  function asB(R) {
    const m = R.pick([1, 1, 2, -1, 3, -2]), r = R.int(-4, 4);
    let b, c0, Rr; do { b = R.int(-6, 6); c0 = R.int(-6, 6); Rr = m * r * r + b * r + c0; } while (Rr === 0);
    const n = b + m * r;
    return {
      latex: `\\frac{${pc([m, b, c0])}}{${pc(lin(r))}}`, va: [r], ha: [], oa: { m, n },
      eva: `El denominador se anula en \\(x = ${r}\\) y el numerador vale \\(${Rr} \\neq 0\\): ${AV(r, Rr)}`,
      eha: NO_HOR([2, 1]),
      eoa: `El grado del numerador supera en 1 al del denominador: hay asíntota oblicua. Dividiendo, \\(f(x) = ${pc([m, n])} + \\frac{${Rr}}{${pc(lin(r))}}\\), y esa fracción tiende a 0. Asíntota oblicua \\(y = ${pc([m, n])}\\).`
    };
  }
  function asC(R) {
    const m = R.pick([1, 1, 2, -1]), r = R.int(1, 3);
    let b, c1, d, N;
    do { b = R.int(-3, 3); c1 = R.int(-5, 5); d = R.int(-6, 6); N = [m, b, c1, d]; } while (pcEval(N, r) === 0 || pcEval(N, -r) === 0);
    const D = [1, 0, -r * r], Rm = [c1 + m * r * r, d + b * r * r];
    return {
      latex: `\\frac{${pc(N)}}{${pc(D)}}`, va: [-r, r], ha: [], oa: { m, n: b },
      eva: `\\(${pc(D)}\\) se anula en \\(x = \\pm ${r}\\) y el numerador vale \\(${pcEval(N, r)}\\) y \\(${pcEval(N, -r)}\\), ambos distintos de 0: dos asíntotas verticales, \\(x = ${-r}\\) y \\(x = ${r}\\).`,
      eha: NO_HOR([3, 2]),
      eoa: `El grado del numerador supera en 1 al del denominador. Dividiendo, \\(f(x) = ${pc([m, b])} + \\frac{${pc(Rm)}}{${pc(D)}}\\), y la fracción tiende a 0. Asíntota oblicua \\(y = ${pc([m, b])}\\).`
    };
  }
  function asD(R) {
    const p = R.nz(-4, 4), r = R.int(-4, 4);
    let q; do { q = R.int(-6, 6); } while (p * r + q === 0);
    return {
      latex: `\\frac{${pc([p, q])}}{${pc(lin(r))}}`, va: [r], ha: [p], oa: null,
      eva: `El denominador se anula en \\(x = ${r}\\) y el numerador vale \\(${p * r + q} \\neq 0\\): ${AV(r, p * r + q)}`,
      eha: `Mismo grado (1): \\(\\lim_{x \\to \\pm\\infty} f(x) = \\frac{${p}}{1} = ${p}\\). Asíntota horizontal \\(y = ${p}\\).`,
      eoa: NO_OBL
    };
  }
  function asE(R) {
    const nn = R.nz(-4, 4), k = R.int(-6, 6), m = R.int(1, 9);
    return {
      latex: `\\frac{${pc([nn, k])}}{x^2 + ${m}}`, va: [], ha: [0], oa: null,
      eva: `\\(x^2 + ${m} > 0\\) para todo \\(x\\): el denominador nunca se anula y no hay asíntotas verticales.`,
      eha: 'El grado del numerador (1) es menor que el del denominador (2): \\(\\lim_{x \\to \\pm\\infty} f(x) = 0\\). Asíntota horizontal \\(y = 0\\).',
      eoa: NO_OBL
    };
  }
  function asE2(R) {
    const r = R.int(1, 4);
    let nn, k; do { nn = R.nz(-4, 4); k = R.int(-6, 6); } while (nn * r + k === 0 || -nn * r + k === 0);
    return {
      latex: `\\frac{${pc([nn, k])}}{x^2 - ${r * r}}`, va: [-r, r], ha: [0], oa: null,
      eva: `\\(x^2 - ${r * r}\\) se anula en \\(x = \\pm ${r}\\); el numerador vale \\(${nn * r + k}\\) y \\(${-nn * r + k}\\), distintos de 0: dos asíntotas verticales, \\(x = ${-r}\\) y \\(x = ${r}\\).`,
      eha: 'El grado del numerador (1) es menor que el del denominador (2): \\(\\lim_{x \\to \\pm\\infty} f(x) = 0\\). Asíntota horizontal \\(y = 0\\).',
      eoa: NO_OBL
    };
  }
  function asF(R) {
    const p = R.nz(-3, 4), b = R.int(-6, 6), c0 = R.int(-6, 6), m = R.int(1, 9);
    return {
      latex: `\\frac{${pc([p, b, c0])}}{x^2 + ${m}}`, va: [], ha: [p], oa: null,
      eva: `\\(x^2 + ${m} > 0\\) para todo \\(x\\): el denominador nunca se anula y no hay asíntotas verticales.`,
      eha: `Mismo grado (2): \\(\\lim_{x \\to \\pm\\infty} f(x) = \\frac{${p}}{1} = ${p}\\). Asíntota horizontal \\(y = ${p}\\).`,
      eoa: NO_OBL
    };
  }
  function asG1(R) {
    const k = R.int(1, 3), m = R.int(1, 9), r = R.int(-3, 3);
    const K = k === 1 ? '' : k;
    return {
      latex: `\\frac{${K}\\sqrt{x^2 + ${m}}}{${pc(lin(r))}}`, va: [r], ha: [k, -k], haTxt: `\\(y = ${k}\\) (en \\(+\\infty\\)) e \\(y = ${-k}\\) (en \\(-\\infty\\))`, oa: null,
      eva: `El denominador se anula en \\(x = ${r}\\) y el numerador, \\(${K}\\sqrt{${r * r + m}}\\), es positivo: asíntota vertical \\(x = ${r}\\).`,
      eha: `Cuidado con el signo. Si \\(x \\to +\\infty\\), \\(\\sqrt{x^2 + ${m}} \\approx x\\) y \\(f(x) \\to ${k}\\). Si \\(x \\to -\\infty\\), \\(\\sqrt{x^2 + ${m}} \\approx |x| = -x\\) y \\(f(x) \\to ${-k}\\). Hay dos: \\(y = ${k}\\) en \\(+\\infty\\) e \\(y = ${-k}\\) en \\(-\\infty\\).`,
      eoa: NO_OBL
    };
  }
  function asG2(R) {
    const k = R.int(1, 3), m = R.int(1, 9), n = R.int(1, 9);
    const K2 = k === 1 ? '' : k * k, K = k === 1 ? '' : k;
    return {
      latex: `\\frac{\\sqrt{${K2}x^2 + ${m}}}{\\sqrt{x^2 + ${n}}}`, va: [], ha: [k], oa: null,
      eva: `\\(\\sqrt{x^2 + ${n}} \\geq \\sqrt{${n}} > 0\\): el denominador nunca se anula y no hay asíntotas verticales.`,
      eha: `\\(\\frac{\\sqrt{${K2}x^2 + ${m}}}{\\sqrt{x^2 + ${n}}} \\approx \\frac{${K}|x|}{|x|} = ${k}\\) tanto en \\(+\\infty\\) como en \\(-\\infty\\). Asíntota horizontal \\(y = ${k}\\).`,
      eoa: NO_OBL
    };
  }
  function asH(R) {
    const k = R.nz(-4, 4), m = R.int(1, 3);
    return {
      latex: `\\frac{${co(k)}e^{x}}{e^{x} + ${m}}`, va: [], ha: [k, 0], haTxt: `\\(y = ${k}\\) (en \\(+\\infty\\)) e \\(y = 0\\) (en \\(-\\infty\\))`, oa: null,
      eva: `\\(e^{x} + ${m} > 0\\) siempre: el denominador nunca se anula y no hay asíntotas verticales.`,
      eha: `Si \\(x \\to +\\infty\\), dividiendo entre \\(e^{x}\\): \\(f(x) = \\frac{${k}}{1 + ${m}e^{-x}} \\to ${k}\\). Si \\(x \\to -\\infty\\), \\(e^{x} \\to 0\\) y \\(f(x) \\to \\frac{0}{${m}} = 0\\). Hay dos: \\(y = ${k}\\) en \\(+\\infty\\) e \\(y = 0\\) en \\(-\\infty\\).`,
      eoa: NO_OBL
    };
  }
  const GEN_AS = [asA, asA, asB, asB, asC, asD, asE, asE2, asF, asG1, asG2, asH];
  function asintotas(R, i) {
    const e = GEN_AS[(i * 5 + R.int(0, GEN_AS.length - 1)) % GEN_AS.length](R);
    const lista = (v, l) => (v.length ? v.map(x => `\\(${l} = ${x}\\)`).join(', ') : 'no tiene');
    const hor = e.haTxt || lista(e.ha, 'y');
    const obl = e.oa ? `\\(y = ${pc([e.oa.m, e.oa.n])}\\)` : 'no tiene';
    return {
      enun: `f(x) = ${e.latex}`,
      pasos: [
        { t: `<b>Verticales.</b> ${e.eva}` },
        { t: `<b>Horizontales.</b> ${e.eha}` },
        { t: `<b>Oblicua.</b> ${e.eoa}` }
      ],
      resHtml: `Verticales: ${lista(e.va, 'x')} · Horizontales: ${hor} · Oblicua: ${obl}`
    };
  }

  /* =====================================================================
     APLICACIONES: CONTINUIDAD CON PARÁMETRO
     Cada trozo da su valor en x = c como p + q·a.
     ===================================================================== */
  const TROZOS = [
    { id: 'p1', lado: 'any', f: (c, k) => ({ tex: `x^2${tSig(k, 'a')}`, p: c * c, q: k }) },
    { id: 'p2', lado: 'any', f: (c, k) => ({ tex: `ax${tSig(k)}`, p: k, q: c }) },
    { id: 'p3', lado: 'any', f: (c, k) => ({ tex: `${tIni(k, 'x')} - a`, p: k * c, q: -1 }) },
    { id: 'p4', lado: 'any', f: (c, k) => ({ tex: `ax^2${tSig(k, 'x')}`, p: k * c, q: c * c }) },
    { id: 'p5', lado: 'any', f: (c, k) => ({ tex: `x${tSig(k, 'a')}`, p: c, q: k }) },
    { id: 'p6', lado: 'any', f: (c, k) => ({ tex: `${tIni(k, 'x^2')} - ax`, p: k * c * c, q: -c }) },
    { id: 'p7', lado: 'any', f: (c, k) => ({ tex: `a(x${tSig(k)})`, p: 0, q: c + k }) },
    { id: 'p8', lado: 'any', f: (c, k) => ({ tex: `x^3${tSig(k, 'a')}`, p: c * c * c, q: k }) },
    { id: 'p9', lado: 'any', f: (c, k) => ({ tex: `${k} - ax`, p: k, q: -c }) },
    { id: 'e1', lado: 'any', tipo: 'exp', f: (c, k) => ({ tex: `e^{x${tSig(-c)}}${tSig(k, 'a')}`, p: 1, q: k, pista: 'Recuerda que \\(e^{0} = 1\\).' }) },
    { id: 'e2', lado: 'any', tipo: 'exp', f: (c, k) => ({ tex: `a\\,e^{x${tSig(-c)}}${tSig(k)}`, p: k, q: 1, pista: 'Recuerda que \\(e^{0} = 1\\).' }) },
    { id: 'r1', lado: 'der', tipo: 'raiz', f: (c, k) => {
        const s = (Math.abs(k) % 3) + 1, d = s * s - c;
        return { tex: `\\sqrt{x${tSig(d)}}${tSig(k, 'a')}`, p: s, q: k, pista: `Recuerda que \\(\\sqrt{${s * s}} = ${s}\\).` };
      } },
    { id: 'l1', lado: 'der', tipo: 'ln', f: (c, k) => ({ tex: `\\ln(x${tSig(1 - c)})${tSig(k, 'a')}`, p: 0, q: k, pista: 'Recuerda que \\(\\ln 1 = 0\\).' }) }
  ];
  function linExpr(L) {
    if (L.p === 0 && L.q === 0) return '0';
    if (L.p === 0) return tIni(L.q, 'a');
    return String(L.p) + tSig(L.q, 'a');
  }
  function continuidad(R) {
    for (let intento = 0; intento < 1000; intento++) {
      const c = R.int(-3, 3);
      const ti = R.pick(TROZOS.filter(T => T.lado === 'any')), td = R.pick(TROZOS);
      if (ti.id === td.id) continue;
      const I = ti.f(c, R.nz(-4, 4)), D = td.f(c, R.nz(-4, 4));
      if (I.q === D.q) continue;
      const sol = new Fr(D.p - I.p, I.q - D.q);
      if (sol.n === 0 || sol.d > 6 || Math.abs(sol.n) > 24) continue;
      const izq = R.rand() < 0.5;   // ¿el punto x = c pertenece al trozo izquierdo?
      const condI = izq ? `x \\le ${c}` : `x < ${c}`, condD = izq ? `x > ${c}` : `x \\ge ${c}`;
      const L = { p: I.p, q: I.q }, Rr = { p: D.p, q: D.q }, FC = izq ? L : Rr;
      const valor = new Fr(I.p * sol.d + I.q * sol.n, sol.d);
      const tipos = [ti.tipo, td.tipo].filter(Boolean);
      const partes = ['los polinomios'];
      if (tipos.includes('exp')) partes.push('las exponenciales');
      if (tipos.includes('raiz')) partes.push(`la raíz (su radicando es positivo para \\(x > ${c}\\))`);
      if (tipos.includes('ln')) partes.push(`el logaritmo (su argumento es positivo para \\(x > ${c}\\))`);
      const nota = tipos.length
        ? `Fuera de \\(x = ${c}\\) cada trozo es continuo en su intervalo: ${partes.join(', ')}. Solo hay que estudiar \\(x = ${c}\\).`
        : `Fuera de \\(x = ${c}\\) cada trozo es un polinomio y, por tanto, continuo. Solo hay que estudiar \\(x = ${c}\\).`;
      const pistas = [I.pista, D.pista].filter(Boolean).filter((v, k, arr) => arr.indexOf(v) === k).join(' ');
      const kA = I.q - D.q, rA = D.p - I.p;
      const despeje = kA === 1 ? `a = ${rA}` : kA === -1 ? `-a = ${rA} \\;\\Rightarrow\\; a = ${sol.tex()}`
        : `${kA}a = ${rA} \\;\\Rightarrow\\; a = ${fracIgual(rA, kA)}`;
      return {
        enun: `f(x) = \\begin{cases} ${I.tex} & \\text{si } ${condI} \\\\[0.5em] ${D.tex} & \\text{si } ${condD} \\end{cases}`,
        pasos: [
          { t: nota },
          { t: `Calculamos los límites laterales y el valor de la función en \\(x = ${c}\\) (el punto pertenece al trozo ${izq ? 'izquierdo' : 'derecho'}, el que lleva \\(${izq ? '\\le' : '\\ge'}\\)). ${pistas}`,
            multilinea: true,
            m: `\\lim_{x \\to ${c}^-} f(x) = \\lim_{x \\to ${c}^-} \\left(${I.tex}\\right) = ${linExpr(L)} \\\\ \\lim_{x \\to ${c}^+} f(x) = \\lim_{x \\to ${c}^+} \\left(${D.tex}\\right) = ${linExpr(Rr)} \\\\ f(${c}) = ${linExpr(FC)}` },
          { t: `Para que \\(f\\) sea continua en \\(x = ${c}\\), los límites laterales deben coincidir (y \\(f(${c})\\) ya es igual a uno de ellos):`,
            m: `${linExpr(L)} = ${linExpr(Rr)} \\;\\Rightarrow\\; ${despeje}` },
          { t: `Comprobación con \\(a = ${sol.tex()}\\): las tres cantidades valen lo mismo, así que \\(f\\) es continua en \\(\\mathbb{R}\\).`,
            m: `\\lim_{x \\to ${c}^-} f(x) = \\lim_{x \\to ${c}^+} f(x) = f(${c}) = ${valor.tex()}` }
        ],
        res: `a = ${sol.tex()}`
      };
    }
    throw new Error('No se pudo generar la función a trozos');
  }

  /* =====================================================================
     LECTURA DE GRÁFICAS (concepto de límite y tipos de discontinuidad)
     ===================================================================== */
  const XM = 4.5, YM = 4.5;   // ventana [−4,5; 4,5] × [−4,5; 4,5]
  function svgGrafica(g) {
    const u = 20, mg = 12, W = 2 * XM * u + 2 * mg, H = 2 * YM * u + 2 * mg;
    const X = x => mg + (x + XM) * u, Y = y => mg + (YM - y) * u;
    const f2 = v => Math.round(v * 100) / 100;
    let s = `<svg class="lim-graf" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfica de la función f" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">`;
    s += `<defs><clipPath id="clip-lim"><rect x="${X(-XM)}" y="${Y(YM)}" width="${2 * XM * u}" height="${2 * YM * u}"/></clipPath></defs>`;
    for (let k = -4; k <= 4; k++) {
      s += `<line x1="${X(k)}" y1="${Y(-YM)}" x2="${X(k)}" y2="${Y(YM)}" stroke="#e2e2e2" stroke-width=".6"/>`;
      s += `<line x1="${X(-XM)}" y1="${Y(k)}" x2="${X(XM)}" y2="${Y(k)}" stroke="#e2e2e2" stroke-width=".6"/>`;
    }
    s += `<line x1="${X(-XM)}" y1="${Y(0)}" x2="${X(XM)}" y2="${Y(0)}" stroke="#222" stroke-width="1"/><line x1="${X(0)}" y1="${Y(-YM)}" x2="${X(0)}" y2="${Y(YM)}" stroke="#222" stroke-width="1"/>`;
    s += `<path d="M${X(XM)} ${Y(0)} l-6 -3 v6 z M${X(0)} ${Y(YM)} l-3 6 h6 z" fill="#222"/>`;
    for (let k = -4; k <= 4; k++) {
      if (!k) continue;
      s += `<text x="${X(k)}" y="${Y(0) + 10}" font-size="8" text-anchor="middle" fill="#444">${k < 0 ? '−' + -k : k}</text>`;
      s += `<text x="${X(0) - 3.5}" y="${Y(k) + 3}" font-size="8" text-anchor="end" fill="#444">${k < 0 ? '−' + -k : k}</text>`;
    }
    s += `<text x="${X(XM) - 2}" y="${Y(0) - 5}" font-size="10" font-style="italic" text-anchor="end">x</text><text x="${X(0) + 5}" y="${Y(YM) + 8}" font-size="10" font-style="italic">y</text>`;
    (g.av || []).forEach(x => { s += `<line x1="${X(x)}" y1="${Y(YM)}" x2="${X(x)}" y2="${Y(-YM)}" stroke="#777" stroke-width=".9" stroke-dasharray="4 3"/>`; });
    (g.ah || []).forEach(y => { s += `<line x1="${X(-XM)}" y1="${Y(y)}" x2="${X(XM)}" y2="${Y(y)}" stroke="#777" stroke-width=".9" stroke-dasharray="4 3"/>`; });
    let d = '';
    g.segs.forEach(sg => {
      const N = 360; let pen = false;
      for (let i = 0; i <= N; i++) {
        const x = sg.from + (sg.to - sg.from) * i / N, y = sg.f(x);
        if (!isFinite(y) || Math.abs(y) > YM + 1.5) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + f2(X(x)) + ' ' + f2(Y(y)) + ' ';
        pen = true;
      }
    });
    s += `<path d="${d}" fill="none" stroke="#1a2744" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#clip-lim)"/>`;
    (g.huecos || []).forEach(([x, y]) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="3" fill="#fff" stroke="#1a2744" stroke-width="1.3"/>`; });
    (g.llenos || []).forEach(([x, y]) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="3" fill="#1a2744"/>`; });
    return s + '</svg>';
  }

  /* Curva que pasa por (a, L): recta o parábola, escogida al azar */
  function curvaPor(R, a, L, conCurva = true) {
    if (conCurva && R.rand() < 0.3) { const k = R.pick([0.5, -0.5]); return x => L + k * (x - a) * (x - a); }
    /* Pendiente 0 con L = 0 dejaría la gráfica tapada por el eje x */
    const m = R.pick(L === 0 ? [1, -1, 2, -2, 0.5, -0.5] : [1, -1, 2, -2, 0.5, -0.5, 0]);
    return x => L + m * (x - a);
  }
  const E = 0.04;   // separación para dejar el punto hueco
  const infTex = s => (s > 0 ? '+\\infty' : '-\\infty');
  const valTex = v => (typeof v === 'number' ? String(v) : infTex(v.s));
  const esInf = v => typeof v !== 'number';

  /* Construye un caso con la gráfica y los datos: limL, limR, fa (null si no existe) */
  function casoPunto(R, tipo) {
    const a = R.pick([-2, -1, 1, 2]);
    const Lr = () => R.int(-3, 3);
    if (tipo === 'continua') {
      const L = Lr(), f = curvaPor(R, a, L);
      return { a, limL: L, limR: L, fa: L, g: { segs: [{ f, from: -XM, to: XM }], llenos: [[a, L]] } };
    }
    if (tipo === 'evitable' || tipo === 'hueco') {
      const L = Lr(), f = curvaPor(R, a, L);
      let F = null; if (tipo === 'evitable') F = DIST(R, -4, 4, [L]);
      return { a, limL: L, limR: L, fa: F, g: { segs: [{ f, from: -XM, to: a - E }, { f, from: a + E, to: XM }], huecos: [[a, L]], llenos: F === null ? [] : [[a, F]] } };
    }
    if (tipo === 'salto') {
      const L1 = Lr(), L2 = DIST(R, -3, 3, [L1]);
      const fI = curvaPor(R, a, L1), fD = curvaPor(R, a, L2);
      const izq = R.rand() < 0.5;
      return { a, limL: L1, limR: L2, fa: izq ? L1 : L2,
        g: { segs: [{ f: fI, from: -XM, to: a - E }, { f: fD, from: a + E, to: XM }], huecos: [izq ? [a, L2] : [a, L1]], llenos: [izq ? [a, L1] : [a, L2]] } };
    }
    if (tipo === 'vertical') {
      const k = R.pick([1, 2, -1, -2]), c = R.int(-2, 2), cuad = R.rand() < 0.35;
      const f = cuad ? (x => c + k / ((x - a) * (x - a))) : (x => c + k / (x - a));
      return { a, limL: INF(cuad ? k : -k), limR: INF(k), fa: null,
        g: { segs: [{ f, from: -XM, to: a - 0.02 }, { f, from: a + 0.02, to: XM }], av: [a] } };
    }
    /* mixto: un lado llega a un valor finito y el otro se va a infinito */
    const L = Lr(), k = R.pick([1, -1, 2, -2]), c = R.int(-2, 2), finIzq = R.rand() < 0.5;
    const recta = curvaPor(R, a, L, false), rama = x => c + k / (x - a);
    const definida = R.rand() < 0.5;
    const segs = finIzq ? [{ f: recta, from: -XM, to: a - E }, { f: rama, from: a + 0.02, to: XM }]
      : [{ f: rama, from: -XM, to: a - 0.02 }, { f: recta, from: a + E, to: XM }];
    return { a, limL: finIzq ? L : INF(-k), limR: finIzq ? INF(k) : L, fa: definida ? L : null,
      g: { segs, av: [a], huecos: definida ? [] : [[a, L]], llenos: definida ? [[a, L]] : [] } };
  }

  function lecturaPasos(e) {
    const a = e.a;
    const lado = (v, txt) => (esInf(v)
      ? `Al acercarnos a \\(x = ${a}\\) por la ${txt}, la gráfica ${v.s > 0 ? 'sube' : 'baja'} sin límite (asíntota vertical):`
      : `Al acercarnos a \\(x = ${a}\\) por la ${txt}, la gráfica se acerca a la altura \\(y = ${v}\\):`);
    const igual = esInf(e.limL) === esInf(e.limR) && (esInf(e.limL) ? e.limL.s === e.limR.s : e.limL === e.limR);
    const pasos = [
      { t: lado(e.limL, 'izquierda'), m: `\\lim_{x \\to ${a}^-} f(x) = ${valTex(e.limL)}` },
      { t: lado(e.limR, 'derecha'), m: `\\lim_{x \\to ${a}^+} f(x) = ${valTex(e.limR)}` }
    ];
    return { pasos, igual };
  }
  const textoFa = e => (e.fa === null
    ? { t: `Sobre \\(x = ${e.a}\\) no hay ningún punto relleno: la función no está definida en ese punto.`, m: `\\nexists\\, f(${e.a})` }
    : { t: 'El punto relleno indica el valor de la función:', m: `f(${e.a}) = ${e.fa}` });

  function preguntasHTML(items) {
    return `<div class="lim-preg">${items.map(t => (/^Tipo/.test(t) ? `<span class="ancho">${t}:</span>` : `<span>${t} =</span>`)).join('')}</div>`;
  }

  function graficaPunto(R, i) {
    const orden = ['continua', 'evitable', 'salto', 'vertical', 'hueco', 'mixto'];
    const e = casoPunto(R, orden[(i + R.int(0, 5)) % orden.length]);
    const a = e.a;
    const { pasos, igual } = lecturaPasos(e);
    pasos.push(igual
      ? { t: 'Los límites laterales coinciden, así que existe el límite:', m: `\\lim_{x \\to ${a}} f(x) = ${valTex(e.limL)}` }
      : { t: 'Los límites laterales son distintos, así que no existe el límite:', m: `\\nexists \\lim_{x \\to ${a}} f(x)` });
    pasos.push(textoFa(e));
    const lim = igual ? `\\(\\lim_{x \\to ${a}} f(x) = ${valTex(e.limL)}\\)` : `\\(\\nexists \\lim_{x \\to ${a}} f(x)\\)`;
    const fa = e.fa === null ? `\\(f(${a})\\) no existe` : `\\(f(${a}) = ${e.fa}\\)`;
    return {
      html: true,
      enun: `<div class="lim-ap">${svgGrafica(e.g)}${preguntasHTML([
        `\\(\\displaystyle\\lim_{x \\to ${a}^-} f(x)\\)`, `\\(\\displaystyle\\lim_{x \\to ${a}^+} f(x)\\)`,
        `\\(\\displaystyle\\lim_{x \\to ${a}} f(x)\\)`, `\\(f(${a})\\)`])}</div>`,
      pasos,
      resHtml: `\\(\\lim_{x \\to ${a}^-} f(x) = ${valTex(e.limL)}\\) · \\(\\lim_{x \\to ${a}^+} f(x) = ${valTex(e.limR)}\\) · ${lim} · ${fa}`
    };
  }

  function casoInfinito(R) {
    const v = R.pick(['hip', 'campana', 'recta', 'parabola', 'atan', 'logist', 'expo']);
    const c = R.int(-2, 2);
    if (v === 'hip') {
      const k = R.pick([1, 2, -1, -2]), p = R.int(-1, 1);
      const f = x => c + k / (x - p);
      return { mas: c, menos: c, g: { segs: [{ f, from: -XM, to: p - 0.02 }, { f, from: p + 0.02, to: XM }], ah: [c], av: [p] } };
    }
    if (v === 'campana') { const k = R.pick([3, -3, 2, -2]); return { mas: c, menos: c, g: { segs: [{ f: x => c + k / (x * x + 1), from: -XM, to: XM }], ah: [c] } }; }
    if (v === 'recta') { const m = R.pick([1, -1, 2, -2, 0.5, -0.5]); return { mas: INF(m), menos: INF(-m), g: { segs: [{ f: x => c + m * x, from: -XM, to: XM }] } }; }
    if (v === 'parabola') { const s = R.pick([1, -1]), h = R.int(-1, 1); return { mas: INF(s), menos: INF(s), g: { segs: [{ f: x => c - s * 2 + s * 0.6 * (x - h) * (x - h), from: -XM, to: XM }] } }; }
    if (v === 'atan') {
      const k = R.pick([1, 2]) * R.pick([1, -1]), c2 = R.int(-1, 1);
      return { mas: c2 + k, menos: c2 - k, g: { segs: [{ f: x => c2 + k * x / Math.sqrt(1 + x * x), from: -XM, to: XM }], ah: [c2 + k, c2 - k] } };
    }
    if (v === 'logist') {
      const k = R.pick([2, 3, -2, -3]), c2 = R.int(-1, 1);
      return { mas: c2 + k, menos: c2, g: { segs: [{ f: x => c2 + k / (1 + Math.exp(-1.6 * x)), from: -XM, to: XM }], ah: [c2 + k, c2] } };
    }
    const c3 = R.int(-3, 0), dcha = R.rand() < 0.5;
    return dcha
      ? { mas: INF(1), menos: c3, g: { segs: [{ f: x => c3 + Math.exp(x), from: -XM, to: XM }], ah: [c3] } }
      : { mas: c3, menos: INF(1), g: { segs: [{ f: x => c3 + Math.exp(-x), from: -XM, to: XM }], ah: [c3] } };
  }
  function graficaInfinito(R) {
    const e = casoInfinito(R);
    const paso = (v, txt) => (esInf(v)
      ? { t: `Cuando \\(x \\to ${txt}\\), la gráfica ${v.s > 0 ? 'sube' : 'baja'} sin límite:`, m: `\\lim_{x \\to ${txt}} f(x) = ${valTex(v)}` }
      : { t: `Cuando \\(x \\to ${txt}\\), la gráfica se acerca a la recta \\(y = ${v}\\) (asíntota horizontal):`, m: `\\lim_{x \\to ${txt}} f(x) = ${v}` });
    return {
      html: true,
      enun: `<div class="lim-ap">${svgGrafica(e.g)}${preguntasHTML([`\\(\\displaystyle\\lim_{x \\to +\\infty} f(x)\\)`, `\\(\\displaystyle\\lim_{x \\to -\\infty} f(x)\\)`])}</div>`,
      pasos: [paso(e.mas, '+\\infty'), paso(e.menos, '-\\infty')],
      resHtml: `\\(\\lim_{x \\to +\\infty} f(x) = ${valTex(e.mas)}\\) · \\(\\lim_{x \\to -\\infty} f(x) = ${valTex(e.menos)}\\)`
    };
  }

  function graficaDiscontinuidad(R, i) {
    const orden = ['evitable', 'salto', 'vertical', 'hueco', 'salto', 'mixto'];
    const tipo = orden[(i + R.int(0, 5)) % orden.length];
    const e = casoPunto(R, tipo), a = e.a;
    const { pasos } = lecturaPasos(e);
    pasos.push(textoFa(e));
    let clase, porque;
    if (tipo === 'evitable' || tipo === 'hueco') {
      clase = 'evitable';
      porque = `Los límites laterales son finitos y coinciden (existe \\(\\lim_{x \\to ${a}} f(x) = ${e.limL}\\)), pero ${e.fa === null ? 'la función no está definida en el punto' : `no coincide con \\(f(${a}) = ${e.fa}\\)`}: discontinuidad <b>evitable</b>.`;
    } else if (tipo === 'salto') {
      clase = 'de salto finito';
      porque = `Los límites laterales son finitos pero distintos: discontinuidad de <b>salto finito</b> (el salto mide \\(|${e.limR} - ${pp(e.limL)}| = ${Math.abs(e.limR - e.limL)}\\)).`;
    } else {
      clase = 'de salto infinito';
      porque = `${esInf(e.limL) && esInf(e.limR) ? 'Los dos límites laterales son infinitos' : 'Uno de los límites laterales es infinito'}: discontinuidad de <b>salto infinito</b> (asíntota vertical \\(x = ${a}\\)).`;
    }
    pasos.push({ t: porque });
    const fa = e.fa === null ? `\\(f(${a})\\) no existe` : `\\(f(${a}) = ${e.fa}\\)`;
    return {
      html: true,
      enun: `<div class="lim-ap">${svgGrafica(e.g)}${preguntasHTML([
        `\\(\\displaystyle\\lim_{x \\to ${a}^-} f(x)\\)`, `\\(\\displaystyle\\lim_{x \\to ${a}^+} f(x)\\)`,
        `\\(f(${a})\\)`, `Tipo de discontinuidad en \\(x = ${a}\\)`])}</div>`,
      pasos,
      resHtml: `\\(\\lim_{x \\to ${a}^-} f(x) = ${valTex(e.limL)}\\) · \\(\\lim_{x \\to ${a}^+} f(x) = ${valTex(e.limR)}\\) · ${fa} · Discontinuidad <b>${clase}</b>`
    };
  }

  /* =====================================================================
     REGISTRO
     ===================================================================== */
  registrarFicha({
    id: 'limites-concepto',
    titulo: 'Concepto de límite',
    detalle: 'Lectura de gráficas',
    grupo: GRUPO,
    enlace: '../limites/concepto-de-limite.html',
    ejercicios: [
      { id: 'punto', nombre: 'Límites laterales, límite y valor en un punto', peso: 1, columnas: 2,
        enunciado: ['A la vista de la gráfica de \\(f\\), calcula:', 'A la vista de cada gráfica, calcula los límites laterales, el límite y el valor de la función en el punto indicado:'],
        generar: graficaPunto },
      { id: 'infinito', nombre: 'Límites en el infinito', peso: 0.75, columnas: 3,
        enunciado: ['A la vista de la gráfica de \\(f\\), calcula:', 'A la vista de cada gráfica, calcula los límites de \\(f\\) cuando \\(x \\to +\\infty\\) y cuando \\(x \\to -\\infty\\):'],
        generar: graficaInfinito }
    ]
  });

  registrarFicha({
    id: 'limites-discontinuidades',
    titulo: 'Tipos de discontinuidad',
    detalle: 'Evitable, salto finito e infinito',
    grupo: GRUPO,
    enlace: '../limites/discontinuidades.html',
    ejercicios: [
      { id: 'clasificar', nombre: 'Clasificar la discontinuidad a partir de la gráfica', peso: 1, columnas: 2,
        enunciado: ['A la vista de la gráfica de \\(f\\), calcula los límites laterales y el valor de la función en el punto indicado, y clasifica la discontinuidad:',
          'A la vista de cada gráfica, calcula los límites laterales y el valor de la función en el punto indicado, y clasifica la discontinuidad:'],
        generar: graficaDiscontinuidad }
    ]
  });

  const ENUN_LIM = ['Calcula el siguiente límite:', 'Calcula los siguientes límites:'];
  registrarFicha({
    id: 'limites-indeterminaciones',
    titulo: 'Resolución de indeterminaciones',
    detalle: 'Cálculo de límites',
    grupo: GRUPO,
    enlace: '../limites/indeterminaciones.html',
    ejercicios: [
      { id: 'mezcla', nombre: 'Límites variados (sin decir el tipo)', peso: 1, columnas: 2, enunciado: ENUN_LIM, generar: mezcla },
      { id: 'infinf', nombre: 'Indeterminación ∞/∞', peso: 1, columnas: 2, enunciado: ENUN_LIM, generar: genA },
      { id: 'infmenos', nombre: 'Indeterminación ∞ − ∞', peso: 1.25, columnas: 2, enunciado: ENUN_LIM, generar: genB },
      { id: 'factor', nombre: 'Indeterminación 0/0 (factorización)', peso: 1, columnas: 2, enunciado: ENUN_LIM, generar: genC },
      { id: 'conjugada', nombre: 'Indeterminación 0/0 (conjugado)', peso: 1.25, columnas: 2, enunciado: ENUN_LIM, generar: genD },
      { id: 'directo', nombre: 'Sin indeterminación', peso: 0.75, columnas: 3, enunciado: ENUN_LIM, generar: genE }
    ]
  });

  registrarFicha({
    id: 'limites-aplicaciones',
    titulo: 'Asíntotas y continuidad',
    detalle: 'Aplicaciones de los límites',
    grupo: GRUPO,
    enlace: '../limites/aplicaciones-limites.html',
    ejercicios: [
      { id: 'asintotas', nombre: 'Asíntotas verticales, horizontales y oblicuas', peso: 1.5, columnas: 2,
        enunciado: ['Estudia las asíntotas de la función:', 'Estudia las asíntotas de cada función:'],
        generar: asintotas },
      { id: 'continuidad', nombre: 'Continuidad con parámetro', peso: 1.5, columnas: 2,
        enunciado: ['Halla el valor de \\(a\\) para que la función sea continua en \\(\\mathbb{R}\\):', 'Halla, en cada caso, el valor de \\(a\\) para que la función sea continua en \\(\\mathbb{R}\\):'],
        generar: continuidad }
    ]
  });
})();
