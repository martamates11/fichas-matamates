/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: derivadas (1.º y 2.º Bachillerato).
   Corresponden a las fichas de derivadas/: derivadas inmediatas, derivadas II (regla de la
   cadena con exponenciales, logaritmos, potencias, producto y cociente), derivadas III
   (trigonométricas y derivación logarítmica) y aplicaciones de las derivadas (optimización
   en un intervalo cerrado, recta tangente y estudio de una función polinómica).
   Las fichas trabajan con bancos fijos de funciones; aquí se generan funciones del mismo tipo
   con coeficientes al azar. Cada apartado lleva una comprobación numérica interna (chk). */
(function () {
  'use strict';
  const { registrarFicha, tex } = window.EX;
  const { n: N, poli } = tex;
  const GRUPO = 'Derivadas';
  const SEN = '\\operatorname{sen}', COS = '\\cos', TG = '\\operatorname{tg}';

  /* ================= Polinomios (coeficientes en orden creciente) ================= */
  const xp = (e, v = 'x') => (e === 0 ? '' : e === 1 ? v : `${v}^{${e}}`);
  const pT = p => { let i = p.length; while (i > 1 && p[i - 1] === 0) i--; return p.slice(0, i); };
  const pAdd = (a, b) => pT(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) + (b[i] || 0)));
  const pEsc = (a, k) => pT(a.map(c => c * k));
  const pMul = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return pT(r); };
  const pDer = a => pT(a.length > 1 ? a.slice(1).map((c, i) => c * (i + 1)) : [0]);
  const pEval = (a, x) => a.reduce((s, c, i) => s + c * Math.pow(x, i), 0);
  const pTex = (a, v = 'x') => poli(a.map((c, i) => [c, xp(i, v)]).reverse());
  const nTerm = a => a.filter(c => c !== 0).length;
  const grado = a => pT(a).length - 1;
  const mcdL = arr => arr.reduce((g, c) => { let a = Math.abs(g), b = Math.abs(c); while (b) { [a, b] = [b, a % b]; } return a; }, 0) || 1;
  /* Entre paréntesis si tiene más de un término */
  const parP = a => (nTerm(a) > 1 ? `(${pTex(a)})` : pTex(a));
  /* Como coeficiente delante de otra expresión: 1 y −1 no se escriben */
  function coefP(a) {
    if (nTerm(a) === 1 && grado(a) === 0) return a[0] === 1 ? '' : a[0] === -1 ? '-' : N(a[0]);
    return nTerm(a) === 1 ? pTex(a) : `(${pTex(a)})`;
  }
  /* Coeficiente polinómico con el factor común numérico fuera: −8x − 8 → −8(x + 1) */
  function coefF(a) {
    if (nTerm(a) === 1) return coefP(a);
    const g = mcdL(a) * (pT(a)[grado(a)] < 0 ? -1 : 1);
    return g === 1 ? `(${pTex(a)})` : `${k1(g)}(${pTex(pEsc(a, 1 / g))})`;
  }
  /* Suma de dos expresiones TeX cuidando el signo del segundo sumando */
  const mas = (a, b) => (b.startsWith('-') ? `${a} - ${b.slice(1)}` : `${a} + ${b}`);
  /* Argumento de una función: x sin paréntesis, lo demás entre paréntesis */
  const esX = g => pT(g).length === 2 && g[0] === 0 && g[1] === 1;
  const arg = g => (esX(g) ? ' x' : `(${pTex(g)})`);
  const k1 = k => (k === 1 ? '' : k === -1 ? '-' : N(k));
  /* Fracción numérica k/d simplificada delante de una expresión: devuelve [signo, num, den] */
  function simpl(k, d) { const g = mcdL([k, d]); return [k * d < 0 ? '-' : '', Math.abs(k) / g, Math.abs(d) / g]; }
  /* Fracción con raíz en el denominador: (k/d)·1/raiz → \frac{k'}{d'·raiz} */
  function fracRaiz(k, d, raiz) {
    const [s, a, b] = simpl(k, d);
    return `${s}\\frac{${a}}{${b === 1 ? '' : b}${raiz}}`;
  }
  const DIST = (R, lo, hi, excl) => { let v; do { v = R.int(lo, hi); } while (excl.includes(v)); return v; };
  function pesado(R, lista) {
    const tot = lista.reduce((s, [w]) => s + w, 0);
    let r = R.rand() * tot;
    for (const [w, f] of lista) { r -= w; if (r < 0) return f(R); }
    return lista[lista.length - 1][1](R);
  }
  /* Factor común numérico positivo de un polinomio: [g, polinomio/g] */
  const fc = a => { const g = mcdL(a); return [g, pEsc(a, 1 / g)]; };
  const g1 = g => (g === 1 ? '' : String(g));
  const fin = (enun, pasos, res, chk) => ({ enun: `f(x) = ${enun}`, pasos, res: `f'(x) = ${res}`, chk });

  /* Polinomio de grado gr con nt términos (el principal incluido) */
  function polAzar(R, gr, nt, lim = 9) {
    const p = Array(gr + 1).fill(0);
    p[gr] = R.nz(-Math.min(lim, 6), Math.min(lim, 6));
    R.shuffle([...Array(gr).keys()]).slice(0, nt - 1).forEach(e => { p[e] = R.nz(-lim, lim); });
    return p;
  }
  /* Funciones interiores para la regla de la cadena */
  function interior(R, tipos = ['lin', 'cuad', 'cuadx', 'cub'], positiva = false) {
    for (;;) {
      const g = interior0(R, tipos);
      if (mcdL(g) > 1) continue;
      if (positiva && ![-3, -2, -1, 0, 1, 2, 3].some(x => pEval(g, x) > 0)) continue;
      return g;
    }
  }
  function interior0(R, tipos) {
    switch (R.pick(tipos)) {
      case 'lin': return [R.int(-9, 9), DIST(R, -6, 7, [0, 1, -1])];
      case 'cuad': return [R.nz(-9, 9), 0, R.nz(-4, 4)];
      case 'cuadx': return [R.int(-6, 6), R.nz(-7, 7), R.pick([1, 1, 2, 3, -1])];
      default: return R.rand() < 0.5 ? [0, R.nz(-6, 6), 0, R.pick([1, 1, 2, -1])] : [R.nz(-9, 9), 0, 0, R.pick([1, 2, -1])];
    }
  }

  /* =====================================================================
     DERIVADAS INMEDIATAS (derivadas-1)
     ===================================================================== */
  function inmPolinomio(R) {
    const p = polAzar(R, R.int(2, 5), R.int(2, 4));
    const d = pDer(p);
    const partes = [];
    for (let i = p.length - 1; i >= 1; i--) {
      const c = p[i]; if (!c) continue;
      const cuerpo = Math.abs(c) === 1 ? `${i}${xp(i - 1)}` : `${Math.abs(c)} \\cdot ${i}${xp(i - 1)}`;
      partes.push((c < 0 ? (partes.length ? ' - ' : '-') : (partes.length ? ' + ' : '')) + cuerpo);
    }
    return fin(pTex(p), [
      { t: 'Derivamos término a término con \\((a\\,x^n)\' = a\\cdot n\\,x^{n-1}\\); la derivada de una constante es 0:', m: `f'(x) = ${partes.join('')} = ${pTex(d)}` }
    ], pTex(d), { f: x => pEval(p, x), d: x => pEval(d, x) });
  }

  function inmRaiz(R) {
    return pesado(R, [
      [5, R => {
        const k = R.rand() < 0.8 ? R.int(1, 9) : R.int(-6, -1), b = R.int(-9, 9), u = [b, k];
        const res = fracRaiz(k, 2, `\\sqrt{${pTex(u)}}`);
        return fin(`\\sqrt{${pTex(u)}}`, [
          { t: `Regla de la raíz cuadrada: \\((\\sqrt{u})' = \\dfrac{u'}{2\\sqrt{u}}\\), con \\(u = ${pTex(u)}\\) y \\(u' = ${k}\\):`,
            m: `f'(x) = \\frac{${k}}{2\\sqrt{${pTex(u)}}}${(k % 2 === 0) ? ' = ' + res : ''}` }
        ], res, { f: x => Math.sqrt(k * x + b), d: x => k / (2 * Math.sqrt(k * x + b)) });
      }],
      [3, R => {
        const k = R.rand() < 0.8 ? R.int(1, 9) : R.int(-6, -1), b = R.int(-9, 9), u = [b, k];
        const res = fracRaiz(k, 3, `\\sqrt[3]{(${pTex(u)})^{2}}`);
        return fin(`\\sqrt[3]{${pTex(u)}}`, [
          { t: 'Escribimos la raíz como potencia y derivamos con la regla de la cadena:', m: `f(x) = (${pTex(u)})^{1/3} \\;\\Rightarrow\\; f'(x) = \\frac{1}{3}(${pTex(u)})^{-2/3}\\cdot ${k < 0 ? `(${k})` : k}` },
          { t: 'Pasamos la potencia negativa al denominador como raíz:', m: `f'(x) = ${res}` }
        ], res, { f: x => Math.cbrt(k * x + b), d: x => k / (3 * Math.cbrt((k * x + b) ** 2)) });
      }],
      [2, R => {
        const c = R.int(2, 9);
        const res = fracRaiz(c, 2, '\\sqrt{x}');
        return fin(`${c}\\sqrt{x}`, [
          { t: 'La constante multiplica a la derivada: \\((c\\,\\sqrt{x})\' = c\\cdot\\dfrac{1}{2\\sqrt{x}}\\):', m: `f'(x) = ${c}\\cdot\\frac{1}{2\\sqrt{x}} = ${res}` }
        ], res, { f: x => c * Math.sqrt(x), d: x => c / (2 * Math.sqrt(x)) });
      }]
    ]);
  }

  function inmExponencial(R) {
    const k = R.nz(-9, 9), b = R.rand() < 0.5 ? 0 : R.nz(-9, 9), u = [b, k], uT = pTex(u);
    if (R.rand() < 0.55) {
      const res = `${k1(k)}e^{${uT}}`;
      return fin(`e^{${uT}}`, [
        { t: `Regla de la exponencial: \\((e^{u})' = e^{u}\\cdot u'\\), con \\(u = ${uT}\\) y \\(u' = ${k}\\):`, m: `f'(x) = ${res}` }
      ], res, { f: x => Math.exp(k * x + b), d: x => k * Math.exp(k * x + b) });
    }
    const a = R.pick([2, 3, 5, 7, 10]);
    const res = `${k === 1 || k === -1 ? k1(k) : N(k) + '\\cdot '}${a}^{${uT}}\\ln ${a}`;
    return fin(`${a}^{${uT}}`, [
      { t: `Regla de la exponencial de base \\(a\\): \\((a^{u})' = a^{u}\\cdot\\ln a\\cdot u'\\), con \\(u = ${uT}\\) y \\(u' = ${k}\\):`, m: `f'(x) = ${res}` }
    ], res, { f: x => Math.pow(a, k * x + b), d: x => k * Math.pow(a, k * x + b) * Math.log(a) });
  }

  function inmLogaritmo(R) {
    const k = R.int(2, 9), base = R.rand() < 0.6 ? 'e' : R.pick([2, 3, 5, 10]);
    const lin = R.rand() < 0.5;
    const b = lin ? R.nz(-9, 9) : 0, u = [b, k], uT = pTex(u);
    const L = base === 'e' ? `\\ln(${uT})` : `\\log_{${base}}(${uT})`;
    const ln = base === 'e' ? '' : ` \\ln ${base}`;
    const regla = base === 'e' ? '\\((\\ln u)\' = \\dfrac{u\'}{u}\\)' : '\\((\\log_a u)\' = \\dfrac{u\'}{u\\,\\ln a}\\)';
    let m, res;
    if (lin) { res = `\\frac{${k}}{${base === 'e' ? uT : `(${uT})\\ln ${base}`}}`; m = `f'(x) = ${res}`; }
    else { res = `\\frac{1}{x${ln ? '\\,' + ln.trim() : ''}}`; m = `f'(x) = \\frac{${k}}{${k}x${ln}} = ${res}`; }
    return fin(L, [{ t: `Regla: ${regla}, con \\(u = ${uT}\\) y \\(u' = ${k}\\):${lin ? '' : ' se simplifica el ' + k + '.'}`, m }], res,
      { f: x => Math.log(k * x + b) / Math.log(base === 'e' ? Math.E : base), d: x => k / ((k * x + b) * Math.log(base === 'e' ? Math.E : base)) });
  }

  function factorPol(R) {
    switch (R.int(0, 3)) {
      case 0: { const n = R.int(1, 3), p = Array(n + 1).fill(0); p[n] = R.nz(-5, 5); return p; }
      case 1: return [R.nz(-9, 9), R.nz(-5, 5)];
      case 2: return [R.nz(-9, 9), 0, R.pick([1, 1, 2, 3, -1])];
      default: return [0, R.nz(-6, 6), R.pick([1, 2, 3, -1])];
    }
  }
  /* Factor en un producto: entre paréntesis si tiene varios términos o es negativo */
  const fx = a => (nTerm(a) > 1 || pTex(a).startsWith('-') ? `(${pTex(a)})` : pTex(a));
  const prodTex = (a, b) => `${fx(a)}\\cdot ${fx(b)}`;

  function inmProducto(R) {
    let u, v;
    do { u = factorPol(R); v = factorPol(R); } while (nTerm(u) === 1 && nTerm(v) === 1);
    if (nTerm(u) > 1 && nTerm(v) === 1) [u, v] = [v, u];
    const du = pDer(u), dv = pDer(v);
    const A = pMul(du, v), B = pMul(u, dv), d = pAdd(A, B);
    const enun = nTerm(u) === 1 ? `${pTex(u)}(${pTex(v)})` : `(${pTex(u)})(${pTex(v)})`;
    return fin(enun, [
      { t: 'Regla del producto: \\((u\\cdot v)\' = u\'\\cdot v + u\\cdot v\'\\), con', m: `u = ${pTex(u)},\\quad u' = ${pTex(du)};\\qquad v = ${pTex(v)},\\quad v' = ${pTex(dv)}` },
      { t: 'Aplicamos la regla:', m: `f'(x) = ${mas(prodTex(du, v), prodTex(u, dv))}` },
      { t: 'Desarrollamos y reducimos términos semejantes:', m: `f'(x) = ${mas(pTex(A), pTex(B))} = ${pTex(d)}` }
    ], pTex(d), { f: x => pEval(u, x) * pEval(v, x), d: x => pEval(d, x) });
  }

  function raicesReales(v) {
    if (grado(v) === 1) return [-v[0] / v[1]];
    const [c, b, a] = v, D = b * b - 4 * a * c;
    return D < 0 ? [] : [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)];
  }
  function inmCociente(R) {
    for (;;) {
      const u = R.pick([
        () => [R.int(-9, 9), R.nz(-5, 5)], () => [0, 0, R.pick([1, 2, 3, -1])], () => [R.nz(-9, 9), 0, R.pick([1, 2, -1])], () => [R.nz(-9, 9)]
      ])();
      const v = R.pick([() => [R.nz(-9, 9), R.pick([1, 1, 2, 3])], () => [R.nz(-9, 9), 0, 1], () => [0, R.nz(-6, 6), 1]])();
      if (raicesReales(v).some(r => Math.abs(pEval(u, r)) < 1e-9)) continue;   // simplificable
      const du = pDer(u), dv = pDer(v);
      const A = pMul(du, v), B = pMul(u, dv), num = pAdd(A, pEsc(B, -1));
      const den = `(${pTex(v)})^{2}`;
      const res = `\\frac{${pTex(num)}}{${den}}`;
      return fin(`\\frac{${pTex(u)}}{${pTex(v)}}`, [
        { t: 'Regla del cociente: \\(\\left(\\dfrac{u}{v}\\right)\' = \\dfrac{u\'\\cdot v - u\\cdot v\'}{v^{2}}\\), con', m: `u = ${pTex(u)},\\quad u' = ${pTex(du)};\\qquad v = ${pTex(v)},\\quad v' = ${pTex(dv)}` },
        grado(u) === 0
          ? { t: 'Como el numerador es constante, \\(u\' = 0\\) y solo queda el segundo término:', m: `f'(x) = \\frac{-${prodTex(u, dv)}}{${den}} = ${res}` }
          : { t: 'Aplicamos la regla:', m: `f'(x) = \\frac{${prodTex(du, v)} - ${prodTex(u, dv)}}{${den}}` },
        ...(grado(u) === 0 ? [] : [{ t: 'Desarrollamos el numerador (cuidado con el signo menos delante del segundo producto); el denominador se deja indicado:', m: `f'(x) = \\frac{${pTex(A)} - ${fx(B)}}{${den}} = ${res}` }])
      ], res, { f: x => pEval(u, x) / pEval(v, x), d: x => pEval(num, x) / pEval(v, x) ** 2 });
    }
  }
  const mezclaInm = R => pesado(R, [[2, inmPolinomio], [1, inmRaiz], [1, inmExponencial], [1, inmLogaritmo], [1.5, inmProducto], [1.5, inmCociente]]);

  /* =====================================================================
     DERIVADAS II: REGLA DE LA CADENA (derivadas-2)
     ===================================================================== */
  function cadExponencial(R) {
    const g = interior(R, ['cuad', 'cuadx', 'cub']), dg = pDer(g), gT = pTex(g);
    if (R.rand() < 0.65) {
      const res = `${coefF(dg)}\\,e^{${gT}}`;
      return fin(`e^{${gT}}`, [
        { t: `Regla de la cadena para la exponencial: \\((e^{u})' = e^{u}\\cdot u'\\), con \\(u = ${gT}\\):`, m: `u' = ${pTex(dg)} \\;\\Rightarrow\\; f'(x) = ${res}` }
      ], res, { f: x => Math.exp(pEval(g, x)), d: x => pEval(dg, x) * Math.exp(pEval(g, x)) });
    }
    const a = R.pick([2, 3, 5, 10]);
    const res = `${coefF(dg)}${nTerm(dg) === 1 && grado(dg) === 0 && Math.abs(dg[0]) === 1 ? '' : '\\cdot '}${a}^{${gT}}\\ln ${a}`;
    return fin(`${a}^{${gT}}`, [
      { t: `Regla de la cadena: \\((a^{u})' = a^{u}\\cdot\\ln a\\cdot u'\\), con \\(u = ${gT}\\):`, m: `u' = ${pTex(dg)} \\;\\Rightarrow\\; f'(x) = ${res}` }
    ], res, { f: x => Math.pow(a, pEval(g, x)), d: x => pEval(dg, x) * Math.pow(a, pEval(g, x)) * Math.log(a) });
  }

  function cadLogaritmo(R) {
    const g = interior(R, ['cuad', 'cuadx', 'cub'], true), dg = pDer(g), gT = pTex(g), dgT = pTex(dg);
    const chkF = (fn, dfn) => ({ f: fn, d: dfn });
    const modo = R.pick(['ln', 'ln', 'log', 'raiz', 'pot']);
    if (modo === 'ln') {
      const res = `\\frac{${dgT}}{${gT}}`;
      return fin(`\\ln(${gT})`, [{ t: `Regla: \\((\\ln u)' = \\dfrac{u'}{u}\\), con \\(u = ${gT}\\) y \\(u' = ${dgT}\\):`, m: `f'(x) = ${res}` }], res,
        chkF(x => Math.log(Math.abs(pEval(g, x))), x => pEval(dg, x) / pEval(g, x)));
    }
    if (modo === 'log') {
      const a = R.pick([2, 3, 10]);
      const res = `\\frac{${dgT}}{(${gT})\\ln ${a}}`;
      return fin(`\\log_{${a}}(${gT})`, [{ t: `Regla: \\((\\log_a u)' = \\dfrac{u'}{u\\,\\ln a}\\), con \\(u = ${gT}\\) y \\(u' = ${dgT}\\):`, m: `f'(x) = ${res}` }], res,
        chkF(x => Math.log(Math.abs(pEval(g, x))) / Math.log(a), x => pEval(dg, x) / (pEval(g, x) * Math.log(a))));
    }
    const k = modo === 'raiz' ? null : R.int(2, 5);
    const enun = modo === 'raiz' ? `\\ln\\sqrt{${gT}}` : `\\ln\\left[(${gT})^{${k}}\\right]`;
    const prop = modo === 'raiz' ? `f(x) = \\frac{1}{2}\\ln(${gT})` : `f(x) = ${k}\\ln(${gT})`;
    let res;
    if (modo === 'raiz') {
      const g2 = mcdL(dg) % 2 === 0;
      res = g2 ? `\\frac{${pTex(pEsc(dg, 1 / 2))}}{${gT}}` : `\\frac{${dgT}}{2(${gT})}`;
    } else res = `\\frac{${nTerm(dg) === 1 ? pTex(pEsc(dg, k)) : `${k}(${dgT})`}}{${gT}}`;
    return fin(enun, [
      { t: `Primero aplicamos la propiedad del logaritmo de una ${modo === 'raiz' ? 'raíz' : 'potencia'}:`, m: prop },
      { t: `Derivamos con \\((\\ln u)' = \\dfrac{u'}{u}\\), con \\(u' = ${dgT}\\):`, m: `f'(x) = ${modo === 'raiz' ? '\\frac{1}{2}' : k}\\cdot\\frac{${dgT}}{${gT}} = ${res}` }
    ], res, chkF(x => (modo === 'raiz' ? 0.5 : k) * Math.log(Math.abs(pEval(g, x))), x => (modo === 'raiz' ? 0.5 : k) * pEval(dg, x) / pEval(g, x)));
  }

  function cadPotencia(R) {
    const modo = R.pick(['pot', 'pot', 'raiz', 'raiz', 'cubica']);
    const g = interior(R, ['lin', 'cuad', 'cuad', 'cuadx', 'cub'], modo === 'raiz'), dg = pDer(g), gT = pTex(g), dgT = pTex(dg);
    if (modo === 'pot') {
      const n = R.int(2, 5);
      const pot = n - 1 === 1 ? `(${gT})` : `(${gT})^{${n - 1}}`;
      const coef = coefF(pEsc(dg, n));
      const res = `${coef}${pot}`;
      return fin(`(${gT})^{${n}}`, [
        { t: `Regla de la cadena para una potencia: \\((u^{n})' = n\\,u^{n-1}\\cdot u'\\), con \\(u = ${gT}\\) y \\(u' = ${dgT}\\):`,
          m: `f'(x) = ${n}${pot}\\cdot ${parP(dg)} = ${res}` }
      ], res, { f: x => pEval(g, x) ** n, d: x => n * pEval(g, x) ** (n - 1) * pEval(dg, x) });
    }
    const q = modo === 'raiz' ? 2 : 3;
    const raiz = q === 2 ? `\\sqrt{${gT}}` : `\\sqrt[3]{(${gT})^{2}}`;
    const enun = q === 2 ? `\\sqrt{${gT}}` : `\\sqrt[3]{${gT}}`;
    let res;
    const g0 = mcdL(dg);
    if (nTerm(dg) === 1) {
      const c = dg.find(v => v !== 0), e = dg.findIndex(v => v !== 0);
      const [s, a, b] = simpl(c, q);
      res = `${s}\\frac{${a === 1 && e > 0 ? '' : a}${xp(e)}}{${b === 1 ? '' : b}${raiz}}`;
    } else if (g0 % q === 0) res = `\\frac{${pTex(pEsc(dg, 1 / q))}}{${raiz}}`;
    else res = `\\frac{${dgT}}{${q}${raiz}}`;
    const regla = q === 2 ? '\\((\\sqrt{u})\' = \\dfrac{u\'}{2\\sqrt{u}}\\)' : '\\((\\sqrt[3]{u})\' = \\dfrac{u\'}{3\\sqrt[3]{u^{2}}}\\)';
    const bruto = `\\frac{${dgT}}{${q}${raiz}}`;
    return fin(enun, [
      { t: `Regla: ${regla}, con \\(u = ${gT}\\) y \\(u' = ${dgT}\\):`, m: `f'(x) = ${bruto}${bruto === res ? '' : ' = ' + res}` }
    ], res, q === 2
      ? { f: x => Math.sqrt(pEval(g, x)), d: x => pEval(dg, x) / (2 * Math.sqrt(pEval(g, x))) }
      : { f: x => Math.cbrt(pEval(g, x)), d: x => pEval(dg, x) / (3 * Math.cbrt(pEval(g, x) ** 2)) });
  }

  const eK = k => `e^{${k1(k)}x}`;
  function cadProducto(R) {
    const k = R.nz(-4, 5), n = R.int(1, 4), E = eK(k);
    const kT = k < 0 ? `(${k})` : k;
    return pesado(R, [
      [3, () => {   // x^n · e^{kx}
        const [g, q] = fc([n, k]);
        const res = `${g1(g)}${xp(n - 1)}${n > 1 ? '\\,' : ''}${E}(${pTex(q)})`;
        return fin(`${xp(n)}\\,${E}`, [
          { t: 'Regla del producto: \\((u\\cdot v)\' = u\'\\,v + u\\,v\'\\), con', m: `u = ${xp(n)},\\quad u' = ${n === 1 ? 1 : n + xp(n - 1)};\\qquad v = ${E},\\quad v' = ${k1(k)}${E}` },
          { t: 'Aplicamos la regla y sacamos factor común:', m: `f'(x) = ${n === 1 ? '' : n + xp(n - 1)}${n === 1 ? '' : '\\,'}${E} ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}${xp(n)}\\,${E} = ${res}` }
        ], res, { f: x => x ** n * Math.exp(k * x), d: x => x ** (n - 1) * Math.exp(k * x) * (n + k * x) });
      }],
      [2, () => {   // x^n · ln x
        const res = n === 1 ? '\\ln x + 1' : `${xp(n - 1)}(${n}\\ln x + 1)`;
        return fin(`${xp(n)}\\ln x`, [
          { t: 'Regla del producto: \\((u\\cdot v)\' = u\'\\,v + u\\,v\'\\), con', m: `u = ${xp(n)},\\quad u' = ${n === 1 ? 1 : n + xp(n - 1)};\\qquad v = \\ln x,\\quad v' = \\frac{1}{x}` },
          { t: 'Aplicamos la regla y simplificamos:', m: `f'(x) = ${n === 1 ? '' : n + xp(n - 1)}\\ln x + ${xp(n)}\\cdot\\frac{1}{x} = ${res}` }
        ], res, { f: x => x ** n * Math.log(x), d: x => x ** (n - 1) * (n * Math.log(x) + 1) });
      }],
      [2, () => {   // (ax + b) · e^{kx}
        const a = R.nz(-5, 5), b = R.nz(-9, 9), u = [b, a], q = [a + k * b, k * a];
        const [g, q2] = fc(q);
        const res = `${g1(g)}${E}(${pTex(q2)})`;
        return fin(`(${pTex(u)})\\,${E}`, [
          { t: 'Regla del producto: \\((u\\cdot v)\' = u\'\\,v + u\\,v\'\\), con', m: `u = ${pTex(u)},\\quad u' = ${a};\\qquad v = ${E},\\quad v' = ${k1(k)}${E}` },
          { t: 'Aplicamos la regla, sacamos factor común \\(' + E + '\\) y simplificamos el paréntesis:', m: `f'(x) = ${a}${E} + (${pTex(u)})\\cdot ${k1(k) === '' ? '' : k1(k) === '-' ? '(-1)\\cdot ' : kT + '\\cdot '}${E} = ${E}\\left[${a} ${k < 0 ? '-' : '+'} ${Math.abs(k) === 1 ? '' : Math.abs(k)}(${pTex(u)})\\right] = ${res}` }
        ], res, { f: x => (a * x + b) * Math.exp(k * x), d: x => Math.exp(k * x) * (k * a * x + a + k * b) });
      }],
      [1.5, () => {   // e^{kx} · ln x
        const res = `${E}\\left(${k1(k)}\\ln x + \\frac{1}{x}\\right)`;
        return fin(`${E}\\ln x`, [
          { t: 'Regla del producto: \\((u\\cdot v)\' = u\'\\,v + u\\,v\'\\), con', m: `u = ${E},\\quad u' = ${k1(k)}${E};\\qquad v = \\ln x,\\quad v' = \\frac{1}{x}` },
          { t: 'Aplicamos la regla y sacamos factor común:', m: `f'(x) = ${k1(k)}${E}\\ln x + ${E}\\cdot\\frac{1}{x} = ${res}` }
        ], res, { f: x => Math.exp(k * x) * Math.log(x), d: x => Math.exp(k * x) * (k * Math.log(x) + 1 / x) });
      }]
    ]);
  }

  function cadCociente(R) {
    const k = R.int(1, 4) * (R.rand() < 0.75 ? 1 : -1), n = R.int(1, 4), E = eK(k), E2 = eK(2 * k);
    const kT = k1(k);
    return pesado(R, [
      [2, () => {   // e^{kx} / x^n
        const [g, q] = fc([-n, k]);
        const res = `\\frac{${g1(g)}${E}(${pTex(q)})}{${xp(n + 1)}}`;
        return fin(`\\frac{${E}}{${xp(n)}}`, [
          { t: 'Regla del cociente: \\(\\left(\\dfrac{u}{v}\\right)\' = \\dfrac{u\'v - u\\,v\'}{v^{2}}\\), con', m: `u = ${E},\\quad u' = ${kT}${E};\\qquad v = ${xp(n)},\\quad v' = ${n === 1 ? 1 : n + xp(n - 1)}` },
          { t: 'Aplicamos la regla:', m: `f'(x) = \\frac{${kT}${E}\\cdot ${xp(n)} - ${E}\\cdot ${n === 1 ? 1 : n + xp(n - 1)}}{${xp(2 * n)}}` },
          { t: `Sacamos factor común ${n > 1 ? '\\(' + xp(n - 1) + E + '\\)' : '\\(' + E + '\\)'} en el numerador y simplificamos:`, m: `f'(x) = \\frac{${xp(n - 1)}${E}(${pTex([-n, k])})}{${xp(2 * n)}} = ${res}` }
        ], res, { f: x => Math.exp(k * x) / x ** n, d: x => Math.exp(k * x) * (k * x - n) / x ** (n + 1) });
      }],
      [2, () => {   // ln x / x^n
        const res = `\\frac{1 - ${n === 1 ? '' : n}\\ln x}{${xp(n + 1)}}`;
        return fin(`\\frac{\\ln x}{${xp(n)}}`, [
          { t: 'Regla del cociente: \\(\\left(\\dfrac{u}{v}\\right)\' = \\dfrac{u\'v - u\\,v\'}{v^{2}}\\), con', m: `u = \\ln x,\\quad u' = \\frac{1}{x};\\qquad v = ${xp(n)},\\quad v' = ${n === 1 ? 1 : n + xp(n - 1)}` },
          { t: 'Aplicamos la regla:', m: `f'(x) = \\frac{\\frac{1}{x}\\cdot ${xp(n)} - \\ln x\\cdot ${n === 1 ? 1 : n + xp(n - 1)}}{${xp(2 * n)}}` },
          { t: n === 1 ? 'Simplificamos:' : `Simplificamos: el numerador es \\(${xp(n - 1)}(1 - ${n}\\ln x)\\):`, m: `f'(x) = ${res}` }
        ], res, { f: x => Math.log(x) / x ** n, d: x => (1 - n * Math.log(x)) / x ** (n + 1) });
      }],
      [1.5, () => {   // x^n / e^{kx}, k > 0
        const kk = Math.abs(k), Ek = eK(kk), E2k = eK(2 * kk);
        const [g, q] = fc([n, -kk]);
        const res = `\\frac{${g1(g)}${xp(n - 1)}(${pTex(q)})}{${Ek}}`;
        return fin(`\\frac{${xp(n)}}{${Ek}}`, [
          { t: 'Regla del cociente: \\(\\left(\\dfrac{u}{v}\\right)\' = \\dfrac{u\'v - u\\,v\'}{v^{2}}\\), con', m: `u = ${xp(n)},\\quad u' = ${n === 1 ? 1 : n + xp(n - 1)};\\qquad v = ${Ek},\\quad v' = ${k1(kk)}${Ek}` },
          { t: 'Aplicamos la regla:', m: `f'(x) = \\frac{${n === 1 ? '' : n + xp(n - 1) + '\\,'}${Ek} - ${xp(n)}\\cdot ${k1(kk)}${Ek}}{${E2k}}` },
          { t: `Sacamos factor común \\(${xp(n - 1)}${Ek}\\) y simplificamos \\(${Ek}\\):`, m: `f'(x) = \\frac{${xp(n - 1)}${n > 1 ? '\\,' : ''}${Ek}(${pTex([n, -kk])})}{${E2k}} = ${res}` }
        ], res, { f: x => x ** n / Math.exp(kk * x), d: x => x ** (n - 1) * (n - kk * x) / Math.exp(kk * x) });
      }],
      [1.5, () => {   // e^{kx} / (x^2 + c)
        const c = R.int(1, 9), v = [c, 0, 1], q = [k * c, -2, k];
        const res = `\\frac{${E}(${pTex(q)})}{(${pTex(v)})^{2}}`;
        return fin(`\\frac{${E}}{${pTex(v)}}`, [
          { t: 'Regla del cociente: \\(\\left(\\dfrac{u}{v}\\right)\' = \\dfrac{u\'v - u\\,v\'}{v^{2}}\\), con', m: `u = ${E},\\quad u' = ${kT}${E};\\qquad v = ${pTex(v)},\\quad v' = 2x` },
          { t: 'Aplicamos la regla:', m: `f'(x) = \\frac{${kT}${E}(${pTex(v)}) - ${E}\\cdot 2x}{(${pTex(v)})^{2}}` },
          { t: `Sacamos factor común \\(${E}\\) en el numerador:`, m: `f'(x) = ${res}` }
        ], res, { f: x => Math.exp(k * x) / (x * x + c), d: x => Math.exp(k * x) * (k * x * x - 2 * x + k * c) / (x * x + c) ** 2 });
      }]
    ]);
  }
  const mezclaCad = R => pesado(R, [[1, cadExponencial], [1, cadLogaritmo], [1, cadPotencia], [1, cadProducto], [1, cadCociente]]);

  /* =====================================================================
     DERIVADAS III: TRIGONOMÉTRICAS Y DERIVACIÓN LOGARÍTMICA (derivadas-3)
     ===================================================================== */
  const sin = Math.sin, cos = Math.cos;
  function trigSimple(R) {
    const g = interior(R, ['lin', 'lin', 'cuad', 'cuadx', 'cub']), dg = pDer(g), gT = pTex(g), dgT = pTex(dg), A = arg(g);
    const G = x => pEval(g, x), DG = x => pEval(dg, x);
    const h = R.pick(['sen', 'cos', 'tg']);
    if (h === 'sen') {
      const res = `${coefF(dg)}${nTerm(dg) === 1 && grado(dg) === 0 ? '' : '\\,'}${COS}${A}`;
      return fin(`${SEN}${A}`, [{ t: `Regla: \\((\\operatorname{sen} u)' = \\cos u\\cdot u'\\), con \\(u = ${gT}\\) y \\(u' = ${dgT}\\):`, m: `f'(x) = ${res}` }], res,
        { f: x => sin(G(x)), d: x => DG(x) * cos(G(x)) });
    }
    if (h === 'cos') {
      const c = coefF(pEsc(dg, -1));
      const res = `${c}${c === '-' ? '' : '\\,'}${SEN}${A}`;
      return fin(`${COS}${A}`, [{ t: `Regla: \\((\\cos u)' = -\\operatorname{sen} u\\cdot u'\\), con \\(u = ${gT}\\) y \\(u' = ${dgT}\\):`, m: `f'(x) = ${res}` }], res,
        { f: x => cos(G(x)), d: x => -DG(x) * sin(G(x)) });
    }
    const res = `\\frac{${dgT}}{${COS}^{2}${A}}`;
    return fin(`${TG}${A}`, [{ t: `Regla: \\((\\operatorname{tg} u)' = \\dfrac{u'}{\\cos^{2} u} = (1 + \\operatorname{tg}^{2} u)\\cdot u'\\), con \\(u = ${gT}\\) y \\(u' = ${dgT}\\):`,
      m: `f'(x) = ${res} = ${coefF(dg)}\\left(1 + ${TG}^{2}${A}\\right)` }], res,
      { f: x => Math.tan(G(x)), d: x => DG(x) / cos(G(x)) ** 2 });
  }

  function trigCompuesta(R) {
    const k = R.pick([1, 1, 2, 3, 4, 5]), g = [0, k], A = arg(g), K = x => k * x;
    const kc = k === 1 ? '' : k;
    return pesado(R, [
      [2, () => {   // sen^n(kx) o cos^n(kx)
        const n = R.int(2, 4), s = R.rand() < 0.5;
        const P = (f, e) => (e === 1 ? `${f}${A}` : `${f}^{${e}}${A}`);
        const res = s ? `${n * k}${P(SEN, n - 1)}${COS}${A}` : `-${n * k}${P(COS, n - 1)}${SEN}${A}`;
        return fin(P(s ? SEN : COS, n), [
          { t: `Es una potencia: \\(f(x) = \\left[${s ? SEN : COS}${A}\\right]^{${n}}\\). Regla de la cadena: \\((u^{n})' = n\\,u^{n-1}\\cdot u'\\), con \\(u' = ${s ? `${kc}${COS}${A}` : `-${kc}${SEN}${A}`}\\):`,
            m: `f'(x) = ${n}${P(s ? SEN : COS, n - 1)}\\cdot\\left(${s ? `${kc}${COS}${A}` : `-${kc}${SEN}${A}`}\\right) = ${res}` }
        ], res, s ? { f: x => sin(K(x)) ** n, d: x => n * k * sin(K(x)) ** (n - 1) * cos(K(x)) } : { f: x => cos(K(x)) ** n, d: x => -n * k * cos(K(x)) ** (n - 1) * sin(K(x)) });
      }],
      [1.5, () => {   // e^{sen kx} o e^{cos kx}
        const s = R.rand() < 0.5, inner = `${s ? SEN : COS}${A}`;
        const res = s ? `${kc}${COS}${A}\\,e^{${inner}}` : `-${kc}${SEN}${A}\\,e^{${inner}}`;
        return fin(`e^{${inner}}`, [
          { t: `Regla: \\((e^{u})' = e^{u}\\cdot u'\\), con \\(u = ${inner}\\) y \\(u' = ${s ? `${kc}${COS}${A}` : `-${kc}${SEN}${A}`}\\):`, m: `f'(x) = ${res}` }
        ], res, s ? { f: x => Math.exp(sin(K(x))), d: x => k * cos(K(x)) * Math.exp(sin(K(x))) } : { f: x => Math.exp(cos(K(x))), d: x => -k * sin(K(x)) * Math.exp(cos(K(x))) });
      }],
      [1.5, () => {   // ln(sen kx) o ln(cos kx)
        const s = R.rand() < 0.5;
        const res = s ? `\\frac{${kc}${COS}${A}}{${SEN}${A}} = ${kc}\\operatorname{cotg}${A}` : `-\\frac{${kc}${SEN}${A}}{${COS}${A}} = -${kc}${TG}${A}`;
        const resCorto = s ? `${kc}\\operatorname{cotg}${A}` : `-${kc}${TG}${A}`;
        return fin(`\\ln(${s ? SEN : COS}${A})`, [
          { t: `Regla: \\((\\ln u)' = \\dfrac{u'}{u}\\), con \\(u = ${s ? SEN : COS}${A}\\) y \\(u' = ${s ? `${kc}${COS}${A}` : `-${kc}${SEN}${A}`}\\):`, m: `f'(x) = ${res}` }
        ], resCorto, s ? { f: x => Math.log(Math.abs(sin(K(x)))), d: x => k * cos(K(x)) / sin(K(x)) } : { f: x => Math.log(Math.abs(cos(K(x)))), d: x => -k * Math.tan(K(x)) });
      }],
      [2, () => {   // x^n sen x, x^n cos x
        const n = R.int(1, 3), s = R.rand() < 0.5, F = s ? SEN : COS;
        const du = n === 1 ? '' : `${n}${xp(n - 1)}`;
        const res = s ? `${du}${SEN} x + ${xp(n)}${COS} x` : `${du}${COS} x - ${xp(n)}${SEN} x`;
        return fin(`${xp(n)}${F} x`, [
          { t: 'Regla del producto: \\((u\\cdot v)\' = u\'\\,v + u\\,v\'\\), con', m: `u = ${xp(n)},\\quad u' = ${n === 1 ? 1 : du};\\qquad v = ${F} x,\\quad v' = ${s ? `${COS} x` : `-${SEN} x`}` },
          { t: 'Aplicamos la regla:', m: `f'(x) = ${res}` }
        ], res, s ? { f: x => x ** n * sin(x), d: x => n * x ** (n - 1) * sin(x) + x ** n * cos(x) } : { f: x => x ** n * cos(x), d: x => n * x ** (n - 1) * cos(x) - x ** n * sin(x) });
      }],
      [1.5, () => {   // sen x / x^n
        const n = R.int(1, 2);
        const res = `\\frac{${xp(1)}${COS} x - ${n === 1 ? '' : n}${SEN} x}{${xp(n + 1)}}`;
        return fin(`\\frac{${SEN} x}{${xp(n)}}`, [
          { t: 'Regla del cociente: \\(\\left(\\dfrac{u}{v}\\right)\' = \\dfrac{u\'v - u\\,v\'}{v^{2}}\\), con', m: `u = ${SEN} x,\\quad u' = ${COS} x;\\qquad v = ${xp(n)},\\quad v' = ${n === 1 ? 1 : '2x'}` },
          { t: n === 1 ? 'Aplicamos la regla:' : 'Aplicamos la regla y simplificamos una \\(x\\):', m: `f'(x) = \\frac{${xp(n)}${COS} x - ${n === 1 ? '' : '2x\\,'}${SEN} x}{${xp(2 * n)}}${n === 1 ? '' : ' = ' + res}` }
        ], res, { f: x => sin(x) / x ** n, d: x => (x * cos(x) - n * sin(x)) / x ** (n + 1) });
      }]
    ]);
  }

  /* Función elevada a función: y = u^v → ln y = v·ln u → y'/y = v'·ln u + v·u'/u */
  function derivLog(R) {
    const a = R.int(2, 5), c = R.int(1, 9), k = R.int(2, 5);
    const bases = [
      { t: 'x', u: x => x, du: x => 1, inv: 'x' },
      { t: `${a}x`, u: x => a * x, du: x => a, inv: 'x' },
      { t: `x^{2} + ${c}`, u: x => x * x + c, du: x => 2 * x, inv: null }
    ];
    const exps = [
      { t: 'x', v: x => x, dv: x => 1, dvT: '1' },
      { t: `${k}x`, v: x => k * x, dv: x => k, dvT: String(k) },
      { t: `${SEN} x`, v: x => sin(x), dv: x => cos(x), dvT: `${COS} x` },
      { t: '\\ln x', v: x => Math.log(x), dv: x => 1 / x, dvT: '\\frac{1}{x}' }
    ];
    let b, e;
    do { b = R.pick(bases); e = R.pick(exps); } while (b.t === 'x' && e.t === 'x' && R.rand() < 0.5);
    const lnU = b.t === 'x' ? '\\ln x' : `\\ln(${b.t})`;
    const uT = b.t === 'x' ? 'x' : `(${b.t})`;
    const vT = e.t;
    /* término v'·ln u */
    const t1 = e.dvT === '1' ? lnU : e.dvT === '\\frac{1}{x}' ? `\\frac{${lnU}}{x}` : `${e.dvT}${e.t === 'x' ? '' : '\\,'}${lnU}`;
    /* término v·u'/u */
    let t2;
    if (b.inv === 'x') {
      t2 = e.t === 'x' ? '1' : e.t === `${k}x` ? String(k) : `\\frac{${vT}}{x}`;
    } else {
      const num = e.t === 'x' ? '2x^{2}' : e.t === `${k}x` ? `${2 * k}x^{2}` : `2x${e.t === '\\ln x' ? '\\ln x' : SEN + ' x'}`;
      t2 = `\\frac{${num}}{${b.t}}`;
    }
    /* u = x o ax con v = ln x: los dos sumandos son ln x / x → 2 ln x / x */
    let corchete = `${t1} + ${t2}`;
    let simplif = null;
    if (b.inv === 'x' && e.t === '\\ln x') simplif = b.t === 'x' ? '\\frac{2\\ln x}{x}' : `\\frac{\\ln(${b.t}) + \\ln x}{x}`;
    const enun = `${uT}^{${vT}}`;
    const derLn = `\\frac{1}{${b.t === 'x' ? 'x' : b.t === `${a}x` ? a + 'x' : b.t}}\\cdot ${b.t === 'x' ? '1' : b.t === `${a}x` ? a : '2x'}`;
    const res = `${uT}^{${vT}}\\left(${simplif || corchete}\\right)`;
    const pasos = [
      { t: 'La variable está en la base y en el exponente: tomamos logaritmos neperianos en los dos miembros.', m: `y = ${uT}^{${vT}} \\;\\Rightarrow\\; \\ln y = ${vT === 'x' || vT === `${k}x` ? vT : `${vT}\\cdot`}\\,${lnU}` },
      { t: 'Derivamos los dos miembros (a la derecha, regla del producto):', m: `\\frac{y'}{y} = ${e.dvT === '1' ? '' : e.dvT + '\\cdot '}${lnU} + ${vT}\\cdot ${derLn} = ${corchete}${simplif ? ' = ' + simplif : ''}` },
      { t: 'Despejamos \\(y\'\\) multiplicando por \\(y\\):', m: `f'(x) = ${res}` }
    ];
    return fin(enun, pasos, res, {
      f: x => Math.pow(b.u(x), e.v(x)),
      d: x => Math.pow(b.u(x), e.v(x)) * (e.dv(x) * Math.log(b.u(x)) + e.v(x) * b.du(x) / b.u(x)),
      positivo: true
    });
  }
  const mezclaTrig = R => pesado(R, [[1, trigSimple], [1, trigCompuesta], [1, derivLog]]);

  /* =====================================================================
     APLICACIONES DE LAS DERIVADAS (aplicaciones-derivadas)
     ===================================================================== */
  const fact = (v, r) => (r === 0 ? v : r > 0 ? `(${v} - ${r})` : `(${v} + ${-r})`);
  const sust = (cs, x) => {   // cs en orden creciente, sustitución literal
    const t = []; for (let i = cs.length - 1; i >= 0; i--) {
      const c = cs[i]; if (!c) continue;
      const xs = x < 0 ? `(${x})` : String(x);
      const cuerpo = i === 0 ? String(Math.abs(c)) : `${Math.abs(c) === 1 ? '' : Math.abs(c) + '\\cdot '}${xs}${i > 1 ? `^{${i}}` : ''}`;
      t.push((c < 0 ? (t.length ? ' - ' : '-') : (t.length ? ' + ' : '')) + cuerpo);
    } return t.join('') || '0';
  };
  const intervalo = (a, b) => `(${a === -Infinity ? '-\\infty' : a},\\, ${b === Infinity ? '+\\infty' : b})`;
  const union = arr => arr.map(([a, b]) => intervalo(a, b)).join(' \\cup ');

  const CONTEXTOS = [
    'La potencia eléctrica que consume una fábrica, en kilovatios, \\(t\\) horas después de abrir viene dada por',
    'La potencia que demanda una planta depuradora, en kilovatios, \\(t\\) horas después de iniciar su ciclo viene dada por',
    'La potencia que suministra una instalación solar a una red, en kilovatios, \\(t\\) horas después de las ocho de la mañana viene dada por'
  ];
  function optimizacion(R) {
    for (;;) {
      const s = R.pick([1, 1, -1]), t1 = R.int(1, 4), t2 = R.int(t1 + 2, 7), d = 10 * R.int(10, 40);
      const cs = [d, 6 * s * t1 * t2, -3 * s * (t1 + t2), 2 * s];
      const cand = [0, t1, t2, 8].map(t => ({ t, v: pEval(cs, t) }));
      const vals = cand.map(c => c.v), vMax = Math.max(...vals), vMin = Math.min(...vals);
      if (vMin <= 0 || vMax > 2000) continue;
      if (vals.filter(v => v === vMax).length > 1 || vals.filter(v => v === vMin).length > 1) continue;
      const max = cand.find(c => c.v === vMax), min = cand.find(c => c.v === vMin);
      const dcs = pDer(cs);
      const enun = `<div class="pl-texto"><p>${R.pick(CONTEXTOS)} \\(P(t) = ${pTex(cs, 't')}\\), con \\(0 \\le t \\le 8\\).</p>` +
        `<p class="pregunta">¿En qué momento de las 8 primeras horas es máxima la potencia y en cuál es mínima? ¿Cuáles son esos valores?</p></div>`;
      const pasos = [
        { t: 'Como \\(P\\) es continua en el intervalo cerrado \\([0, 8]\\), por el teorema de Weierstrass alcanza un máximo y un mínimo absolutos, que están en los puntos críticos o en los extremos del intervalo. Derivamos:', m: `P'(t) = ${pTex(dcs, 't')} = ${6 * s}${fact('t', t1)}${fact('t', t2)}` },
        { t: `Puntos críticos: \\(P'(t) = 0 \\Rightarrow t = ${t1}\\) y \\(t = ${t2}\\); los dos están dentro de \\([0, 8]\\).` },
        { t: 'Calculamos \\(P\\) en los puntos críticos y en los extremos del intervalo (en la función original, no en la derivada):',
          m: cand.map(c => `P(${c.t}) = ${c.v}`).join(',\\qquad ') },
        { t: `El mayor valor es ${max.v} y el menor, ${min.v}.${[max, min].some(c => c.t === 0 || c.t === 8) ? ' Fíjate en que uno de ellos se alcanza en un extremo del intervalo, no en un punto crítico.' : ''}` }
      ];
      return { html: true, enun, pasos,
        resHtml: `Máximo: \\(t = ${max.t}\\) h, \\(P = ${max.v}\\) kW · Mínimo: \\(t = ${min.t}\\) h, \\(P = ${min.v}\\) kW`,
        chk: { f: x => pEval(cs, x), d: x => pEval(dcs, x) } };
    }
  }

  function tangente(R) {
    for (;;) {
      const cs = [R.int(-6, 8), R.int(-5, 5), R.int(-3, 3), R.pick([1, 1, 2, -1])];
      const x0 = R.nz(-2, 3);
      if (cs[2] === 0 && cs[1] === 0) continue;
      const dcs = pDer(cs), m = pEval(dcs, x0), y0 = pEval(cs, x0), n = y0 - m * x0;
      if (Math.abs(m) > 40 || Math.abs(y0) > 60) continue;
      const recta = `y = ${pTex([n, m])}`;
      const pp = m === 0 ? `y = ${y0}` : `y ${y0 < 0 ? '+ ' + -y0 : y0 === 0 ? '' : '- ' + y0} = ${m}${fact('x', x0)}`;
      return {
        html: true,
        enun: `\\(f(x) = ${pTex(cs)}\\) en \\(x_0 = ${x0}\\)`,
        pasos: [
          { t: 'La pendiente de la recta tangente es la derivada en el punto. Derivamos:', m: `f'(x) = ${pTex(dcs)}` },
          { t: 'Pendiente: sustituimos \\(x_0\\) en la derivada.', m: `m = f'(${x0}) = ${sust(dcs, x0)} = ${m}` },
          { t: 'Punto de tangencia: sustituimos \\(x_0\\) en la función original.', m: `f(${x0}) = ${sust(cs, x0)} = ${y0} \\;\\Rightarrow\\; (${x0},\\, ${y0})` },
          { t: 'Ecuación punto-pendiente \\(y - f(x_0) = f\'(x_0)(x - x_0)\\) y despejamos \\(y\\):', m: m === 0 ? recta : `${pp} \\;\\Rightarrow\\; ${recta}` }
        ],
        res: recta,
        chk: { f: x => pEval(cs, x), d: x => pEval(dcs, x) }
      };
    }
  }

  function estudio(R) {
    for (;;) {
      const s = R.pick([1, 1, -1]), h = R.pick([2, 2, 4]);
      const x1 = R.int(-3, Math.min(2, 5 - h)), x2 = x1 + h, xm = (x1 + x2) / 2, d = R.int(-5, 6);
      const cs = [d, 3 * s * x1 * x2, -3 * s * xm, s];
      const d1 = pDer(cs), d2 = pDer(d1);
      const y1 = pEval(cs, x1), y2 = pEval(cs, x2), ym = pEval(cs, xm);
      if (Math.max(Math.abs(y1), Math.abs(y2)) > (h === 2 ? 10 : 18)) continue;
      const ext = [[-Infinity, x1], [x2, Infinity]], int = [[x1, x2]];
      const crec = s > 0 ? ext : int, dec = s > 0 ? int : ext;
      const max = s > 0 ? [x1, y1] : [x2, y2], min = s > 0 ? [x2, y2] : [x1, y1];
      const conc = s > 0 ? [[xm, Infinity]] : [[-Infinity, xm]], conv = s > 0 ? [[-Infinity, xm]] : [[xm, Infinity]];
      const sg = v => (v > 0 ? '+' : '-');
      const signo1 = `\\begin{array}{c|ccccc} x & (-\\infty, ${x1}) & ${x1} & (${x1}, ${x2}) & ${x2} & (${x2}, +\\infty) \\\\ \\hline f'(x) & ${sg(s)} & 0 & ${sg(-s)} & 0 & ${sg(s)} \\\\ f(x) & ${s > 0 ? '\\nearrow' : '\\searrow'} & ${s > 0 ? '\\text{máx}' : '\\text{mín}'} & ${s > 0 ? '\\searrow' : '\\nearrow'} & ${s > 0 ? '\\text{mín}' : '\\text{máx}'} & ${s > 0 ? '\\nearrow' : '\\searrow'} \\end{array}`;
      const signo2 = `\\begin{array}{c|ccc} x & (-\\infty, ${xm}) & ${xm} & (${xm}, +\\infty) \\\\ \\hline f''(x) & ${sg(-s)} & 0 & ${sg(s)} \\\\ f(x) & ${s > 0 ? '\\cap' : '\\cup'} & \\text{P.I.} & ${s > 0 ? '\\cup' : '\\cap'} \\end{array}`;
      return {
        enun: `f(x) = ${pTex(cs)}`,
        pasos: [
          { t: 'Derivamos y buscamos los puntos críticos:', m: `f'(x) = ${pTex(d1)} = ${3 * s}${fact('x', x1)}${fact('x', x2)} = 0 \\;\\Rightarrow\\; x = ${x1},\\; x = ${x2}` },
          { t: 'Estudiamos el signo de \\(f\'\\) en cada intervalo:', m: signo1 },
          { t: `Crece en \\(${union(crec)}\\) y decrece en \\(${union(dec)}\\). Las ordenadas de los extremos se calculan en la función original:`,
            m: `f(${max[0]}) = ${max[1]},\\qquad f(${min[0]}) = ${min[1]}` },
          { t: 'Derivada segunda y su cero:', m: `f''(x) = ${pTex(d2)} = 0 \\;\\Rightarrow\\; x = ${xm}` },
          { t: 'Signo de \\(f\'\'\\): donde \\(f\'\' > 0\\) es cóncava (∪) y donde \\(f\'\' < 0\\), convexa (∩).', m: signo2 },
          { t: `Cambia la curvatura en \\(x = ${xm}\\): punto de inflexión \\((${xm},\\, ${ym})\\).` }
        ],
        resHtml: `Crece: \\(${union(crec)}\\) · Decrece: \\(${union(dec)}\\) · Máximo \\((${max[0]},\\, ${max[1]})\\) · Mínimo \\((${min[0]},\\, ${min[1]})\\) · Cóncava (∪): \\(${union(conc)}\\) · Convexa (∩): \\(${union(conv)}\\) · P.I. \\((${xm},\\, ${ym})\\)`,
        chk: { f: x => pEval(cs, x), d: x => pEval(d1, x) }
      };
    }
  }

  /* ================= Registro ================= */
  const ENUN = ['Calcula la derivada de la función:', 'Calcula la derivada de cada función:'];
  registrarFicha({
    id: 'derivadas-1', titulo: 'Derivadas inmediatas', detalle: 'Polinomios, raíces, exponenciales, logaritmos, producto y cociente', grupo: GRUPO,
    enlace: '../derivadas/derivadas-1.html',
    ejercicios: [
      { id: 'mezcla', nombre: 'Derivadas variadas (sin decir el tipo)', peso: 0.75, columnas: 2, enunciado: ENUN, generar: mezclaInm },
      { id: 'polinomio', nombre: 'Polinomios', peso: 0.5, columnas: 2, enunciado: ENUN, generar: inmPolinomio },
      { id: 'raiz', nombre: 'Raíces', peso: 0.75, columnas: 3, enunciado: ENUN, generar: inmRaiz },
      { id: 'exponencial', nombre: 'Exponenciales', peso: 0.5, columnas: 3, enunciado: ENUN, generar: inmExponencial },
      { id: 'logaritmo', nombre: 'Logaritmos', peso: 0.5, columnas: 3, enunciado: ENUN, generar: inmLogaritmo },
      { id: 'producto', nombre: 'Producto de polinomios', peso: 1, columnas: 2, enunciado: ENUN, generar: inmProducto },
      { id: 'cociente', nombre: 'Cociente de polinomios', peso: 1, columnas: 2, enunciado: ENUN, generar: inmCociente }
    ]
  });
  registrarFicha({
    id: 'derivadas-2', titulo: 'Derivadas II', detalle: 'Regla de la cadena, producto y cociente', grupo: GRUPO,
    enlace: '../derivadas/derivadas-2.html',
    ejercicios: [
      { id: 'mezcla', nombre: 'Derivadas variadas (sin decir el tipo)', peso: 1, columnas: 2, enunciado: ENUN, generar: mezclaCad },
      { id: 'exponencial', nombre: 'Exponencial de una función', peso: 0.75, columnas: 2, enunciado: ENUN, generar: cadExponencial },
      { id: 'logaritmo', nombre: 'Logaritmo de una función', peso: 0.75, columnas: 2, enunciado: ENUN, generar: cadLogaritmo },
      { id: 'potencia', nombre: 'Potencias y raíces de una función', peso: 0.75, columnas: 2, enunciado: ENUN, generar: cadPotencia },
      { id: 'producto', nombre: 'Producto (con exponenciales y logaritmos)', peso: 1, columnas: 2, enunciado: ENUN, generar: cadProducto },
      { id: 'cociente', nombre: 'Cociente (con exponenciales y logaritmos)', peso: 1.25, columnas: 2, enunciado: ENUN, generar: cadCociente }
    ]
  });
  registrarFicha({
    id: 'derivadas-3', titulo: 'Derivadas III', detalle: 'Trigonométricas y derivación logarítmica', grupo: GRUPO,
    enlace: '../derivadas/derivadas-3.html',
    ejercicios: [
      { id: 'mezcla', nombre: 'Derivadas variadas (sin decir el tipo)', peso: 1, columnas: 2, enunciado: ENUN, generar: mezclaTrig },
      { id: 'trig', nombre: 'Trigonométricas de una función', peso: 0.75, columnas: 3, enunciado: ENUN, generar: trigSimple },
      { id: 'trig-comp', nombre: 'Trigonométricas compuestas, producto y cociente', peso: 1, columnas: 2, enunciado: ENUN, generar: trigCompuesta },
      { id: 'logaritmica', nombre: 'Derivación logarítmica (función elevada a función)', peso: 1.25, columnas: 2, enunciado: ENUN, generar: derivLog }
    ]
  });
  registrarFicha({
    id: 'derivadas-aplicaciones', titulo: 'Aplicaciones de las derivadas', detalle: 'Optimización, recta tangente y estudio de funciones', grupo: GRUPO,
    enlace: '../derivadas/aplicaciones-derivadas.html',
    ejercicios: [
      { id: 'optimizacion', nombre: 'Máximo y mínimo absolutos en un intervalo cerrado (contexto)', peso: 2.5, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: optimizacion },
      { id: 'tangente', nombre: 'Recta tangente en un punto', peso: 1.5, columnas: 2,
        enunciado: ['Halla la ecuación de la recta tangente a la gráfica de la función en el punto indicado:', 'Halla la ecuación de la recta tangente a la gráfica de cada función en el punto indicado:'], generar: tangente },
      { id: 'estudio', nombre: 'Monotonía, extremos, curvatura e inflexión de una cúbica', peso: 3, columnas: 1,
        enunciado: ['Estudia la monotonía, los extremos relativos, la curvatura y los puntos de inflexión de la función:', 'Estudia la monotonía, los extremos relativos, la curvatura y los puntos de inflexión de cada función:'], generar: estudio }
    ]
  });
})();
