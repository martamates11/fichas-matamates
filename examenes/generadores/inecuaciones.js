/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: inecuaciones y sistemas de inecuaciones con una y dos incógnitas
   (fichas inec-1-incog, sist-inec-1-incog, inec-2-incog y sist-inec-2-incog).
   Los números se generan con los mismos criterios que las fichas interactivas. */
(function () {
  'use strict';
  const { fr, tex, registrarFicha } = window.EX;
  const { n, p, frac, poli } = tex;
  const GRUPO = 'Inecuaciones y programación lineal';

  /* ================= Utilidades comunes ================= */
  const SIG = { lt: '<', le: '\\le', gt: '>', ge: '\\ge' };
  const INV = { lt: 'gt', le: 'ge', gt: 'lt', ge: 'le' };
  const estricto = s => s === 'lt' || s === 'gt';
  const mayor = s => s === 'gt' || s === 'ge';
  const pol = c => poli(c.map((k, i) => [k, i === c.length - 1 ? '' : i === c.length - 2 ? 'x' : `x^{${c.length - 1 - i}}`.replace('^{2}', '^2')]));
  const factor = r => (r === 0 ? 'x' : `(x ${r > 0 ? '-' : '+'} ${Math.abs(r)})`);
  const factorS = r => (r === 0 ? 'x' : `x ${r > 0 ? '-' : '+'} ${Math.abs(r)}`);
  const mulP = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return r; };
  const subP = (a, b) => { const L = Math.max(a.length, b.length), A = Array(L - a.length).fill(0).concat(a), B = Array(L - b.length).fill(0).concat(b); return A.map((x, i) => x - B[i]); };
  const recorta = c => { let i = 0; while (i < c.length - 1 && c[i] === 0) i++; return c.slice(i); };

  /* Intervalos {lo, hi, loInc, hiInc} */
  const extremo = v => (v === -Infinity ? '-\\infty' : v === Infinity ? '+\\infty' : n(v));
  const ivTeX = iv => `${iv.loInc ? '[' : '('}${extremo(iv.lo)},\\ ${extremo(iv.hi)}${iv.hiInc ? ']' : ')'}`;
  const ivsTeX = L => (L.length ? L.map(ivTeX).join(' \\cup ') : '\\varnothing');
  function interseca(A, B) {
    const out = [];
    A.forEach(a => B.forEach(b => {
      let lo, loInc, hi, hiInc;
      if (a.lo > b.lo) { lo = a.lo; loInc = a.loInc; } else if (b.lo > a.lo) { lo = b.lo; loInc = b.loInc; } else { lo = a.lo; loInc = a.loInc && b.loInc; }
      if (a.hi < b.hi) { hi = a.hi; hiInc = a.hiInc; } else if (b.hi < a.hi) { hi = b.hi; hiInc = b.hiInc; } else { hi = a.hi; hiInc = a.hiInc && b.hiInc; }
      if (lo < hi) out.push({ lo, hi, loInc, hiInc });
    }));
    return out;
  }
  const igualesIL = (A, B) => A.length === B.length && A.every((a, i) => a.lo === B[i].lo && a.hi === B[i].hi && a.loInc === B[i].loInc && a.hiInc === B[i].hiInc);
  /* Tramos con el signo pedido; crit ordenados; a = signo del coeficiente principal */
  function solucionSignos(crit, polos, simb, a = 1) {
    const k = crit.length, out = [];
    for (let j = 0; j <= k; j++) {
      const signo = a * ((k - j) % 2 === 0 ? 1 : -1);
      if ((signo > 0) === mayor(simb)) {
        const lo = j === 0 ? -Infinity : crit[j - 1], hi = j === k ? Infinity : crit[j];
        out.push({ lo, hi, loInc: isFinite(lo) && !estricto(simb) && !polos.includes(lo), hiInc: isFinite(hi) && !estricto(simb) && !polos.includes(hi) });
      }
    }
    return out;
  }
  /* Tabla de signos en TeX */
  function tablaSignos(crit, filas, nombreFinal, a = 1) {
    const k = crit.length;
    const tramos = Array.from({ length: k + 1 }, (_, j) => `(${j === 0 ? '-\\infty' : n(crit[j - 1])},\\ ${j === k ? '+\\infty' : n(crit[j])})`);
    const sg = v => (v > 0 ? '+' : '-');
    const lineas = [];
    if (a < 0) lineas.push(`-1 & ${tramos.map(() => '-').join(' & ')}`);
    filas.forEach(r => {
      lineas.push(`${factorS(r.raiz)}${r.polo ? '\\ (\\text{den.})' : ''} & ${tramos.map((_, j) => sg(j > crit.indexOf(r.raiz) ? 1 : -1)).join(' & ')}`);
    });
    lineas.push(`\\text{${nombreFinal}} & ${tramos.map((_, j) => `\\mathbf{${sg(a * ((k - j) % 2 === 0 ? 1 : -1))}}`).join(' & ')}`);
    return `\\begin{array}{r|${'c'.repeat(k + 1)}} & ${tramos.join(' & ')} \\\\ \\hline ${lineas.join(' \\\\ ')} \\end{array}`;
  }

  /* ---------- Recta real (SVG) ----------
     filas: [{ et, sol }]; marcas: valores que se rotulan; polos: valores que nunca se incluyen */
  const AZUL = '#1a2744', ROJO = '#b8282b';
  function rectaSVG(filas, marcas) {
    marcas = [...new Set(marcas)].sort((a, b) => a - b);
    const lo = marcas[0], hi = marcas[marcas.length - 1];
    const pad = Math.max(2, (hi - lo) * 0.3);
    const vmin = lo - pad, vmax = hi + pad;
    const conEt = filas.some(f => f.et);
    const L = conEt ? 62 : 14, W = 330, Rm = 14, FH = 40, H = filas.length * FH + 8;
    const X = v => L + (Math.max(vmin, Math.min(vmax, v)) - vmin) / (vmax - vmin) * (W - L - Rm);
    let s = `<svg class="ine-recta" viewBox="0 0 ${W} ${H}" role="img" aria-label="Solución sobre la recta real" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">`;
    filas.forEach((f, k) => {
      const y = 14 + k * FH;
      if (f.et) s += `<text x="4" y="${y + 4}" font-size="11" font-weight="${f.sis ? 700 : 400}" fill="${f.sis ? ROJO : '#333'}">${f.et}</text>`;
      s += `<line x1="${L}" y1="${y}" x2="${W - Rm + 6}" y2="${y}" stroke="#555" stroke-width="1"/><path d="M${W - Rm + 6},${y} l-5,-3 v6 z" fill="#555"/>`;
      const col = f.sis ? ROJO : AZUL;
      f.sol.forEach(iv => { s += `<line x1="${X(iv.lo)}" y1="${y}" x2="${X(iv.hi)}" y2="${y}" stroke="${col}" stroke-width="4" stroke-linecap="butt" opacity=".85"/>`; });
      marcas.forEach(v => {
        const ivs = f.sol.filter(iv => iv.lo === v || iv.hi === v);
        s += `<line x1="${X(v)}" y1="${y - 4}" x2="${X(v)}" y2="${y + 4}" stroke="#555" stroke-width=".8"/>`;
        if (ivs.length) {
          const inc = ivs.some(iv => (iv.lo === v && iv.loInc) || (iv.hi === v && iv.hiInc));
          s += `<circle cx="${X(v)}" cy="${y}" r="3.6" fill="${inc ? col : '#fff'}" stroke="${col}" stroke-width="1.4"/>`;
        }
        s += `<text x="${X(v)}" y="${y + 17}" font-size="11" text-anchor="middle" fill="#333">${String(v).replace('-', '−')}</text>`;
      });
    });
    return s + '</svg>';
  }

  /* ================= Inecuaciones con una incógnita ================= */
  /* Primer grado (como la ficha; con paréntesis opcional, como la de sistemas) */
  function genLineal(R, sMin, sMax, conParentesis) {
    for (let t = 0; t < 3000; t++) {
      const s = sMin === null ? R.nz(-12, 12) : R.int(sMin, sMax);
      const k = R.rand() < 0.5 ? -R.int(1, 5) : R.int(1, 5);
      const a = R.nz(-7, 7), c = a - k;
      if (c === 0 || Math.abs(c) > 7) continue;
      let b, par = null;
      if (conParentesis && Math.abs(a) >= 2 && R.rand() < 0.4) { par = R.nz(-5, 5); b = a * par; } else b = R.nz(-12, 12);
      const d = b + k * s;
      if (d === 0 || Math.abs(d) > 40) continue;
      const simb = R.pick(['lt', 'le', 'gt', 'ge']), fin = k < 0 ? INV[simb] : simb;
      const sol = mayor(fin) ? [{ lo: s, hi: Infinity, loInc: fin === 'ge', hiInc: false }] : [{ lo: -Infinity, hi: s, loInc: false, hiInc: fin === 'le' }];
      const izq = par !== null ? `${n(a)}(${factorS(-par)})` : poli([[a, 'x'], [b, '']]);
      return { a, b, c, d, k, s, par, simb, fin, sol, tex: `${izq} ${SIG[simb]} ${poli([[c, 'x'], [d, '']])}`, crit: [s] };
    }
  }
  function pasosLineal(e) {
    const P = [];
    if (e.par !== null) P.push({ t: `Quitamos el paréntesis (el ${n(e.a).replace('-', '−')} multiplica a los dos términos):`, m: `${poli([[e.a, 'x'], [e.b, '']])} ${SIG[e.simb]} ${poli([[e.c, 'x'], [e.d, '']])}` });
    P.push({ t: 'Pasamos los términos con x al primer miembro y los números al segundo (cada término que cambia de miembro cambia de signo):',
      m: `${poli([[e.a, 'x'], [-e.c, 'x']])} ${SIG[e.simb]} ${poli([[e.d, ''], [-e.b, '']])} \\;\\Rightarrow\\; ${poli([[e.k, 'x']])} ${SIG[e.simb]} ${n(e.d - e.b)}` });
    if (e.k === 1) P.push({ t: 'El coeficiente de x ya es 1: la desigualdad queda despejada.', m: `x ${SIG[e.fin]} ${n(e.s)}` });
    else if (e.k > 0) P.push({ t: `Dividimos entre ${e.k}, que es <b>positivo</b>: el sentido de la desigualdad <b>no cambia</b>.`, m: `x ${SIG[e.fin]} ${n(e.s)}` });
    else P.push({ t: `Dividimos entre ${n(e.k).replace('-', '−')}, que es <b>negativo</b>: el sentido de la desigualdad <b>se invierte</b>.`, m: `x ${SIG[e.fin]} ${n(e.s)}` });
    return P;
  }

  /* Segundo grado (como la ficha); A = ±1 en la ficha de una inecuación y A = 1 en la de sistemas */
  function genCuadratica(R, conSigno) {
    for (let t = 0; t < 4000; t++) {
      let r1 = R.int(-7, 7), r2 = R.int(-7, 7);
      if (r1 === r2) continue;
      if (r1 > r2) [r1, r2] = [r2, r1];
      const A = conSigno && R.rand() < 0.5 ? -1 : 1;
      const T = [A, -A * (r1 + r2), A * r1 * r2];
      const pl = R.pick(['prod', 'prod', 'xpar', 'cuad', 'dos', 'difcuad']);
      let Lexp, Ltxt, a = 0, b = 0;
      if (pl === 'prod') { a = R.nz(-6, 6); b = R.nz(-6, 6); Lexp = [1, a + b, a * b]; Ltxt = `${factor(-a)}${factor(-b)}`; }
      else if (pl === 'xpar') { a = R.nz(-6, 6); Lexp = [1, a, 0]; Ltxt = `x${factor(-a)}`; }
      else if (pl === 'cuad') { a = R.nz(-6, 6); Lexp = [1, 2 * a, a * a]; Ltxt = `${factor(-a)}^2`; }
      else if (pl === 'dos') { a = R.nz(-5, 5); b = R.nz(-5, 5); Lexp = [2, 2 * b + a, a * b]; Ltxt = `(${poli([[2, 'x'], [a, '']])})${factor(-b)}`; }
      else { a = R.int(2, 6); Lexp = [1, 0, -a * a]; Ltxt = `(x + ${a})(x - ${a})`; }
      const Rp = [Lexp[0] - T[0], Lexp[1] - T[1], Lexp[2] - T[2]];
      if (Rp[1] === 0 || Rp[2] === 0) continue;
      if (Math.abs(Rp[1]) > 20 || Math.abs(Rp[2]) > 40) continue;
      const simb = R.pick(['lt', 'le', 'gt', 'ge']);
      const crit = [r1, r2];
      return { r1, r2, A, T, Lexp, Ltxt, Rp, simb, crit, sol: solucionSignos(crit, [], simb, A), tex: `${Ltxt} ${SIG[simb]} ${pol(recorta(Rp))}` };
    }
  }
  function pasosCuadratica(e) {
    const [A, B, C] = e.T, D = B * B - 4 * A * C, s = Math.round(Math.sqrt(D));
    const Rt = pol(recorta(e.Rp));
    return [
      { t: 'Quitamos paréntesis y pasamos todo al primer miembro (el sentido no cambia):',
        m: `${pol(e.Lexp)} - (${Rt}) ${SIG[e.simb]} 0 \\;\\Rightarrow\\; ${pol(e.T)} ${SIG[e.simb]} 0` },
      { t: `Raíces de \\(${pol(e.T)} = 0\\):`,
        m: `x = \\frac{${n(-B)} \\pm \\sqrt{${D}}}{${n(2 * A)}} = \\frac{${n(-B)} \\pm ${s}}{${n(2 * A)}} \\;\\Rightarrow\\; x_1 = ${n(e.r1)},\\ \\ x_2 = ${n(e.r2)} \\qquad ${pol(e.T)} = ${A < 0 ? '-' : ''}${factor(e.r1)}${factor(e.r2)}` },
      { t: `Tabla de signos${A < 0 ? ' (el factor −1 es negativo en todos los tramos)' : ''}:`, m: tablaSignos(e.crit, [{ raiz: e.r1 }, { raiz: e.r2 }], 'Producto', A) },
      { t: `Buscamos los tramos con signo ${mayor(e.simb) ? 'positivo' : 'negativo'}. ${estricto(e.simb) ? 'La desigualdad es estricta: las raíces no se incluyen.' : 'Admite el 0: las raíces se incluyen.'}`,
        html: rectaSVG([{ sol: e.sol }], e.crit) }
    ];
  }

  /* Racional (como la ficha) */
  function genRacional(R) {
    for (let t = 0; t < 3000; t++) {
      const a = R.int(-6, 6), b = R.int(-6, 6), pp = R.int(-6, 6);
      if (a === b || a === pp || b === pp) continue;
      const [n1, n2] = a < b ? [a, b] : [b, a];
      const N = [1, -(n1 + n2), n1 * n2], den = [1, -pp];
      const pl = R.pick(['lineal', 'fraccion']);
      const k = R.nz(-4, 4);
      let A, Lnum = null, e = 0;
      if (pl === 'lineal') { e = R.int(-5, 5); A = mulP([1, e - k], den); }
      else {
        Lnum = [1, R.int(-6, 6), R.int(-9, 9)];
        if (Lnum[0] * pp * pp + Lnum[1] * pp + Lnum[2] === 0) continue;
        A = subP(Lnum, mulP([k], den));
      }
      const W = [A[1] - N[1], A[2] - N[2]];
      if (W[0] === 0 || Math.abs(W[0]) > 20 || Math.abs(W[1]) > 40) continue;
      if (W[0] * pp + W[1] === 0) continue;
      const simb = R.pick(['lt', 'le', 'gt', 'ge']);
      const crit = [n1, n2, pp].sort((x, y) => x - y);
      const denT = factorS(pp);
      const Ltxt = pl === 'lineal' ? pol([1, e]) : `\\frac{${pol(Lnum)}}{${denT}}`;
      const kTxt = `${k > 0 ? '+' : '-'} ${Math.abs(k)}`;
      return { n1, n2, pp, N, den, pl, k, e, Lnum, A, W, simb, crit, sol: solucionSignos(crit, [pp], simb), denT, kTxt,
        tex: `${Ltxt} ${SIG[simb]} \\frac{${pol(W)}}{${denT}} ${kTxt}` };
    }
  }
  function pasosRacional(e) {
    const Wt = pol(e.W), kMov = `${e.k > 0 ? '-' : '+'} ${Math.abs(e.k)}`;
    const fin = `\\frac{${pol(e.N)}}{${e.denT}}`;
    const m1 = e.pl === 'lineal'
      ? `${pol([1, e.e])} ${kMov} - \\frac{${Wt}}{${e.denT}} ${SIG[e.simb]} 0 \\;\\Rightarrow\\; \\frac{(${pol([1, e.e - e.k])})(${e.denT}) - (${Wt})}{${e.denT}} ${SIG[e.simb]} 0 \\;\\Rightarrow\\; ${fin} ${SIG[e.simb]} 0`
      : `\\frac{${pol(e.Lnum)}}{${e.denT}} - \\frac{${Wt}}{${e.denT}} ${kMov} ${SIG[e.simb]} 0 \\;\\Rightarrow\\; \\frac{${pol(e.Lnum)} - (${Wt}) ${kMov}(${e.denT})}{${e.denT}} ${SIG[e.simb]} 0 \\;\\Rightarrow\\; ${fin} ${SIG[e.simb]} 0`;
    return [
      { t: 'Pasamos todo al primer miembro y reducimos a común denominador (el sentido no cambia):', m: m1 },
      { t: `Factorizamos. Raíces del numerador: \\(x = ${n(e.n1)}\\) y \\(x = ${n(e.n2)}\\). El denominador se anula en \\(x = ${n(e.pp)}\\), que es un <b>polo</b>.`,
        m: `\\frac{${factor(e.n1)}${factor(e.n2)}}{${e.denT}} ${SIG[e.simb]} 0` },
      { t: 'Tabla de signos:', m: tablaSignos(e.crit, e.crit.map(r => ({ raiz: r, polo: r === e.pp })), 'Cociente') },
      { t: `Buscamos los tramos con signo ${mayor(e.simb) ? 'positivo' : 'negativo'}. ${estricto(e.simb) ? 'La desigualdad es estricta: ningún valor crítico se incluye.' : `Los ceros del numerador se incluyen; el polo \\(${n(e.pp)}\\), nunca.`}`,
        html: rectaSVG([{ sol: e.sol }], e.crit) }
    ];
  }

  const unaInec = (gen, pasos) => R => {
    const e = gen(R);
    const P = pasos(e);
    if (!P[P.length - 1].html) P.push({ t: 'Solución sobre la recta real:', html: rectaSVG([{ sol: e.sol }], e.crit) });
    return { enun: e.tex, pasos: P, res: `x \\in ${ivsTeX(e.sol)}` };
  };
  registrarFicha({
    id: 'inec-1-incog',
    titulo: 'Inecuaciones con una incógnita',
    detalle: 'Primer y segundo grado, racionales',
    grupo: GRUPO,
    enlace: '../inecuaciones/inec-1-incog.html',
    ejercicios: [
      { id: 'lineal', nombre: 'Inecuación de primer grado', peso: 1, columnas: 2,
        enunciado: ['Resuelve la siguiente inecuación y expresa la solución como intervalo:', 'Resuelve las siguientes inecuaciones y expresa la solución como intervalo:'],
        generar: unaInec(R => genLineal(R, null, null, false), pasosLineal) },
      { id: 'cuadratica', nombre: 'Inecuación de segundo grado', peso: 1.5, columnas: 2,
        enunciado: ['Resuelve la siguiente inecuación y expresa la solución como intervalo:', 'Resuelve las siguientes inecuaciones y expresa la solución como intervalo:'],
        generar: unaInec(R => genCuadratica(R, true), pasosCuadratica) },
      { id: 'racional', nombre: 'Inecuación racional', peso: 2, columnas: 2,
        enunciado: ['Resuelve la siguiente inecuación y expresa la solución como intervalo:', 'Resuelve las siguientes inecuaciones y expresa la solución como intervalo:'],
        generar: unaInec(genRacional, pasosRacional) }
    ]
  });

  /* ================= Sistemas de inecuaciones con una incógnita ================= */
  const sistema1TeX = (a, b) => `\\left\\{\\begin{array}{l} ${a} \\\\ ${b} \\end{array}\\right.`;
  const etq = (k, P) => P.map((q, i) => (i === 0 ? Object.assign({}, q, { t: `<b>(${k})</b> ${q.t}` }) : q));
  function sistemaLineal(R) {
    const opuestos = R.rand() < 0.65;
    let e1, e2, sol;
    for (let t = 0; t < 3000; t++) {
      e1 = genLineal(R, -8, 8, true); e2 = genLineal(R, -8, 8, true);
      if (Math.abs(e1.s - e2.s) < 2) continue;
      if ((mayor(e1.fin) !== mayor(e2.fin)) !== opuestos) continue;
      sol = interseca(e1.sol, e2.sol);
      if (!sol.length) continue;
      break;
    }
    return { e1, e2, sol, pasos1: etq(1, pasosLineal(e1)), pasos2: etq(2, pasosLineal(e2)) };
  }
  function sistemaMixto(R) {
    let q, l, sol;
    for (let t = 0; t < 3000; t++) {
      q = genCuadratica(R, false); l = genLineal(R, -8, 8, true);
      if (q.crit.includes(l.s)) continue;
      sol = interseca(q.sol, l.sol);
      if (!sol.length || igualesIL(sol, q.sol) || igualesIL(sol, l.sol)) continue;
      break;
    }
    const pq = pasosCuadratica(q); pq.pop();
    pq.push({ t: `Tramos con signo ${mayor(q.simb) ? 'positivo' : 'negativo'}${estricto(q.simb) ? ', sin las raíces' : ', con las raíces'}:`, m: `x \\in ${ivsTeX(q.sol)}` });
    return { e1: q, e2: l, sol, pasos1: etq(1, pq), pasos2: etq(2, pasosLineal(l)) };
  }
  const sist1 = gen => R => {
    const S = gen(R);
    const marcas = [...S.e1.crit, ...S.e2.crit];
    return {
      enun: sistema1TeX(S.e1.tex, S.e2.tex),
      pasos: [
        ...S.pasos1,
        ...S.pasos2,
        { t: 'Representamos las dos soluciones, una debajo de otra; la del sistema es la parte común (intersección):',
          html: rectaSVG([{ et: '(1)', sol: S.e1.sol }, { et: '(2)', sol: S.e2.sol }, { et: 'Sistema', sol: S.sol, sis: true }], marcas) }
      ],
      res: `x \\in ${ivsTeX(S.sol)}`
    };
  };
  registrarFicha({
    id: 'sist-inec-1-incog',
    titulo: 'Sistemas de inecuaciones con una incógnita',
    detalle: '',
    grupo: GRUPO,
    enlace: '../inecuaciones/sist-inec-1-incog.html',
    ejercicios: [
      { id: 'lineal', nombre: 'Dos inecuaciones de primer grado', peso: 1.5, columnas: 2,
        enunciado: ['Resuelve el siguiente sistema de inecuaciones:', 'Resuelve los siguientes sistemas de inecuaciones:'], generar: sist1(sistemaLineal) },
      { id: 'mixto', nombre: 'Una de segundo grado y otra de primer grado', peso: 2, columnas: 2,
        enunciado: ['Resuelve el siguiente sistema de inecuaciones:', 'Resuelve los siguientes sistemas de inecuaciones:'], generar: sist1(sistemaMixto) }
    ]
  });

  /* ================= Inecuaciones con dos incógnitas ================= */
  const S2 = ['>', '<', '\\ge', '\\le'];
  const positivo = s => s === '>' || s === '\\ge';
  const estricta2 = s => s === '>' || s === '<';
  const cumple = (v, s, c) => (s === '>' ? v > c : s === '<' ? v < c : s === '\\ge' ? v >= c : v <= c);
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  /* Términos en TeX */
  function T(c, v, primero) {
    if (c === 0) return '';
    const cuerpo = (Math.abs(c) === 1 ? '' : Math.abs(c)) + v;
    return primero ? (c < 0 ? '-' : '') + cuerpo : (c < 0 ? ' - ' : ' + ') + cuerpo;
  }
  const K = (c, primero) => (c === 0 ? (primero ? '0' : '') : primero ? n(c) : (c < 0 ? ' - ' : ' + ') + Math.abs(c));
  function CP(c, cont, primero) {
    const cuerpo = (Math.abs(c) === 1 ? '' : Math.abs(c)) + '(' + cont + ')';
    return primero ? (c < 0 ? '-' : '') + cuerpo : (c < 0 ? ' - ' : ' + ') + cuerpo;
  }
  const dentro = (v, q) => v + K(q, false);
  const fr2 = (a, b) => `\\frac{${a}}{${b}}`;
  const lin = (A, B, C, s) => `${T(A, 'x', true)}${T(B, 'y', A === 0)} ${s} ${n(C)}`;

  /* Generadores por nivel, como en la ficha */
  const GEN2 = {
    n1: R => { const A = R.nz(-5, 5), B = R.pick([1, 1, 1, -1, 2, -2, 3]), C = R.nz(-6, 6), s = R.pick(S2); return { tex: lin(A, B, C, s), A, B, C, s, deriv: [] }; },
    n2a: R => {
      const p_ = R.pick([2, 3, 4, -2, -3]), q = R.nz(-4, 4), r = R.pick([1, -1, 2, -2, 3]), t = R.pick([0, 0, 1, -1, 2]), u = R.int(-6, 6), s = R.pick(S2);
      if (t === p_) return null;
      const der = t === 0 ? n(u) : T(t, 'x', true) + K(u, false);
      const A = p_ - t, B = r, C = u - p_ * q;
      return { tex: CP(p_, dentro('x', q), true) + T(r, 'y', false) + ` ${s} ` + der, A, B, C, s,
        deriv: [['Quitamos el paréntesis:', T(p_, 'x', true) + K(p_ * q, false) + T(r, 'y', false) + ` ${s} ` + der],
          ['Pasamos las incógnitas al primer miembro y los números al segundo (cambian de signo):', lin(A, B, C, s)]] };
    },
    n2b: R => {
      const p_ = R.pick([2, 3, 4, -2]), q = R.nz(-4, 4), r = R.pick([1, 2, 3]), sg = R.pick([1, -1]), s2 = R.nz(-3, 3), u = R.int(-6, 6), s = R.pick(S2);
      const A = p_, B = sg * r, C = u - p_ * q - sg * r * s2;
      return { tex: CP(p_, dentro('x', q), true) + CP(sg * r, dentro('y', s2), false) + ` ${s} ` + n(u), A, B, C, s,
        deriv: [['Quitamos los paréntesis (atención a los signos):', T(p_, 'x', true) + K(p_ * q, false) + T(sg * r, 'y', false) + K(sg * r * s2, false) + ` ${s} ` + n(u)],
          ['Pasamos los números al segundo miembro (cambian de signo):', lin(A, B, C, s)]] };
    },
    n3a: R => {
      const m = R.pick([1, 1, 2, 3]), q = R.nz(-4, 4), d1 = R.pick([2, 3, 4, 5]), d2 = R.pick([2, 3, 4]), sg = R.pick([1, -1]), u = R.int(-3, 3), s = R.pick(S2);
      if (d1 === d2) return null;
      const L = lcm(d1, d2), a1 = L / d1, a2 = L / d2;
      const A = a1 * m, B = sg * a2, C = L * u - a1 * q, num1 = T(m, 'x', true) + K(q, false);
      return { tex: fr2(num1, d1) + (sg < 0 ? ' - ' : ' + ') + fr2('y', d2) + ` ${s} ` + n(u), A, B, C, s,
        deriv: [[`Multiplicamos los dos miembros por m.c.m.(${d1}, ${d2}) = ${L}, que es positivo, así que el sentido no cambia:`, (a1 === 1 ? num1 : CP(a1, num1, true)) + T(sg * a2, 'y', false) + ` ${s} ` + n(L * u)],
          ['Quitamos el paréntesis y pasamos el número al segundo miembro:', lin(A, B, C, s)]] };
    },
    n3b: R => {
      const d1 = R.pick([2, 3, 4]), d2 = R.pick([2, 3, 5]), sg = R.pick([1, -1]), s2 = R.nz(-3, 3), u = R.int(-3, 3), s = R.pick(S2);
      if (d1 === d2) return null;
      const L = lcm(d1, d2), a1 = L / d1, a2 = L / d2;
      const A = a1, B = sg * a2, C = L * u - sg * a2 * s2;
      return { tex: fr2('x', d1) + (sg < 0 ? ' - ' : ' + ') + fr2(dentro('y', s2), d2) + ` ${s} ` + n(u), A, B, C, s,
        deriv: [[`Multiplicamos los dos miembros por m.c.m.(${d1}, ${d2}) = ${L}, que es positivo, así que el sentido no cambia:`, T(a1, 'x', true) + CP(sg * a2, dentro('y', s2), false) + ` ${s} ` + n(L * u)],
          ['Quitamos el paréntesis y pasamos el número al segundo miembro:', lin(A, B, C, s)]] };
    },
    n3c: R => {
      const q = R.nz(-4, 4), d1 = R.pick([2, 3, 4]), k = R.pick([1, 1, 2]), sg = R.pick([1, -1]), u = R.int(-3, 3), s = R.pick(S2);
      const A = 1, B = sg * k * d1, C = d1 * u - q;
      return { tex: fr2(dentro('x', q), d1) + T(sg * k, 'y', false) + ` ${s} ` + n(u), A, B, C, s,
        deriv: [[`Multiplicamos los dos miembros por ${d1} (todos los términos), que es positivo: el sentido no cambia.`, dentro('x', q) + T(sg * k * d1, 'y', false) + ` ${s} ` + n(d1 * u)],
          ['Pasamos el número al segundo miembro:', lin(A, B, C, s)]] };
    },
    n4a: R => {
      const p_ = R.pick([2, 3, -2]), q = R.nz(-3, 3), d1 = R.pick([2, 3, 4]), d2 = R.pick([2, 3, 4]), sg = R.pick([1, -1]), s2 = R.nz(-3, 3), t = R.pick([0, 0, 1]), u = R.int(-2, 2), s = R.pick(S2);
      if (d1 === d2) return null;
      const L = lcm(d1, d2), a1 = L / d1, a2 = L / d2;
      const A = a1 * p_ - L * t, B = sg * a2, C = L * u - a1 * p_ * q - sg * a2 * s2;
      if (A === 0) return null;
      const der = t === 0 ? n(u) : T(t, 'x', true) + K(u, false), derL = t === 0 ? n(L * u) : T(L * t, 'x', true) + K(L * u, false);
      return { tex: fr2(CP(p_, dentro('x', q), true), d1) + (sg < 0 ? ' - ' : ' + ') + fr2(dentro('y', s2), d2) + ` ${s} ` + der, A, B, C, s,
        deriv: [[`Multiplicamos los dos miembros por m.c.m.(${d1}, ${d2}) = ${L}, que es positivo, así que el sentido no cambia:`, CP(a1 * p_, dentro('x', q), true) + CP(sg * a2, dentro('y', s2), false) + ` ${s} ` + derL],
          ['Quitamos los paréntesis:', T(a1 * p_, 'x', true) + K(a1 * p_ * q, false) + T(sg * a2, 'y', false) + K(sg * a2 * s2, false) + ` ${s} ` + derL],
          ['Agrupamos las incógnitas en el primer miembro y los números en el segundo:', lin(A, B, C, s)]] };
    },
    n4b: R => {
      const q = R.nz(-3, 3), d1 = R.pick([2, 3]), p_ = R.pick([2, 3]), sg = R.pick([1, -1]), s2 = R.nz(-2, 2), u = R.int(-2, 2), s = R.pick(S2);
      const A = 1, B = sg * p_ * d1, C = d1 * u - q - sg * p_ * d1 * s2;
      return { tex: fr2(dentro('x', q), d1) + CP(sg * p_, dentro('y', s2), false) + ` ${s} ` + n(u), A, B, C, s,
        deriv: [[`Multiplicamos los dos miembros por ${d1} (todos los términos), que es positivo: el sentido no cambia.`, dentro('x', q) + CP(sg * p_ * d1, dentro('y', s2), false) + ` ${s} ` + n(d1 * u)],
          ['Quitamos el paréntesis:', 'x' + K(q, false) + T(sg * p_ * d1, 'y', false) + K(sg * p_ * d1 * s2, false) + ` ${s} ` + n(d1 * u)],
          ['Pasamos los números al segundo miembro:', lin(A, B, C, s)]] };
    },
    n4c: R => {
      const p_ = R.pick([1, 2, 3]), q = R.nz(-3, 3), d1 = R.pick([2, 3, 4]), d2 = R.pick([2, 3, 5]), s2 = R.nz(-3, 3), s = R.pick(S2);
      if (d1 === d2) return null;
      const L = lcm(d1, d2), a1 = L / d1, a2 = L / d2;
      const A = a1 * p_, B = -a2, C = a2 * s2 - a1 * p_ * q;
      const num1 = p_ === 1 ? dentro('x', q) : CP(p_, dentro('x', q), true);
      return { tex: fr2(num1, d1) + ` ${s} ` + fr2(dentro('y', s2), d2), A, B, C, s,
        deriv: [[`Multiplicamos los dos miembros por m.c.m.(${d1}, ${d2}) = ${L}, que es positivo, así que el sentido no cambia:`, CP(a1 * p_, dentro('x', q), true) + ` ${s} ` + CP(a2, dentro('y', s2), true)],
          ['Quitamos los paréntesis:', T(a1 * p_, 'x', true) + K(a1 * p_ * q, false) + ` ${s} ` + T(a2, 'y', true) + K(a2 * s2, false)],
          ['Pasamos las incógnitas al primer miembro y los números al segundo:', lin(A, B, C, s)]] };
    }
  };
  const NIVELES = { 1: ['n1'], 2: ['n2a', 'n2b'], 3: ['n3a', 'n3b', 'n3c'], 4: ['n4a', 'n4b', 'n4c'] };
  const RANGO = 7, RP = 6;
  function puntosEnteros(A, B, C) {
    const out = [];
    for (let x = -RP; x <= RP; x++) { const m = C - A * x; if (m % B === 0) { const y = m / B + 0; if (Math.abs(y) <= RP) out.push([x, y]); } }
    return out;
  }
  function tablaDe(A, B, C) {
    const pts = puntosEnteros(A, B, C);
    if (pts.length < 2) return null;
    pts.sort((a, b) => (Math.abs(a[0]) + Math.abs(a[1])) - (Math.abs(b[0]) + Math.abs(b[1])));
    const p1 = pts[0], p2 = pts.slice(1).find(q => Math.abs(q[0] - p1[0]) >= 2) || pts[1];
    return [p1, p2].sort((a, b) => a[0] - b[0]);
  }
  function genNivel(R, nivel) {
    const quiereOrigen = nivel >= 3 && R.rand() < 0.3;
    for (let i = 0; i < 800; i++) {
      const g = GEN2[R.pick(NIVELES[nivel])](R);
      if (!g) continue;
      const { A, B, C } = g;
      if (A === 0 || B === 0 || Math.abs(A) > 9 || Math.abs(B) > 9) continue;
      if (nivel === 1 && C === 0) continue;
      if (quiereOrigen && i < 600 && C !== 0) continue;
      g.tabla = tablaDe(A, B, C);
      if (!g.tabla) continue;
      return g;
    }
  }

  /* ---------- Geometría y plano (SVG) ---------- */
  function recortar(poli, A, B, C, pos) {
    const f = q => A * q[0] + B * q[1] - C, den = q => (pos ? f(q) >= 0 : f(q) <= 0);
    const corte = (a, b) => { const t = f(a) / (f(a) - f(b)); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };
    const out = [];
    for (let i = 0; i < poli.length; i++) {
      const cur = poli[i], prev = poli[(i + poli.length - 1) % poli.length];
      if (den(cur)) { if (!den(prev)) out.push(corte(prev, cur)); out.push(cur); } else if (den(prev)) out.push(corte(prev, cur));
    }
    return out;
  }
  const area = P => Math.abs(P.reduce((s, q, i) => { const r = P[(i + 1) % P.length]; return s + q[0] * r[1] - r[0] * q[1]; }, 0)) / 2;
  const COLR = ['#a0522d', '#2f5f8a'];
  /* lineas: [{A, B, C, s, et}], region: polígono a sombrear, puntos: [{p, et, col}] */
  function planoSVG(lineas, region, puntos) {
    const E = 14, M = 14, W = 2 * RANGO * E + 2 * M;
    const X = x => M + (x + RANGO) * E, Y = y => M + (RANGO - y) * E;
    let s = `<svg class="ine-plano" viewBox="0 0 ${W} ${W}" role="img" aria-label="Región solución en el plano" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">`;
    s += '<defs><clipPath id="cp"><rect x="' + X(-RANGO) + '" y="' + Y(RANGO) + '" width="' + 2 * RANGO * E + '" height="' + 2 * RANGO * E + '"/></clipPath></defs>';
    for (let k = -RANGO; k <= RANGO; k++) {
      s += `<line x1="${X(k)}" y1="${Y(-RANGO)}" x2="${X(k)}" y2="${Y(RANGO)}" stroke="#e2e2e2" stroke-width=".5"/><line x1="${X(-RANGO)}" y1="${Y(k)}" x2="${X(RANGO)}" y2="${Y(k)}" stroke="#e2e2e2" stroke-width=".5"/>`;
    }
    if (region && region.length > 2) s += `<polygon points="${region.map(q => X(q[0]) + ',' + Y(q[1])).join(' ')}" fill="#9db4d6" fill-opacity=".45" clip-path="url(#cp)"/>`;
    s += `<line x1="${X(-RANGO)}" y1="${Y(0)}" x2="${X(RANGO)}" y2="${Y(0)}" stroke="#333" stroke-width="1"/><line x1="${X(0)}" y1="${Y(-RANGO)}" x2="${X(0)}" y2="${Y(RANGO)}" stroke="#333" stroke-width="1"/>`;
    for (let k = -RANGO + 1; k < RANGO; k++) {
      if (k === 0 || k % 2) continue;
      s += `<text x="${X(k)}" y="${Y(0) + 9}" font-size="7.5" text-anchor="middle" fill="#555">${String(k).replace('-', '−')}</text><text x="${X(0) - 3}" y="${Y(k) + 2.3}" font-size="7.5" text-anchor="end" fill="#555">${String(k).replace('-', '−')}</text>`;
    }
    s += `<text x="${X(RANGO) - 2}" y="${Y(0) - 3}" font-size="9" font-style="italic" text-anchor="end">x</text><text x="${X(0) + 3}" y="${Y(RANGO) + 8}" font-size="9" font-style="italic">y</text>`;
    lineas.forEach((l, i) => {
      const big = 30, pts = Math.abs(l.B) > 1e-9
        ? [[-big, (l.C + l.A * big) / l.B], [big, (l.C - l.A * big) / l.B]]
        : [[l.C / l.A, -big], [l.C / l.A, big]];
      const col = lineas.length > 1 ? COLR[i] : AZUL;
      s += `<line x1="${X(pts[0][0])}" y1="${Y(pts[0][1])}" x2="${X(pts[1][0])}" y2="${Y(pts[1][1])}" stroke="${col}" stroke-width="1.6"${estricta2(l.s) ? ' stroke-dasharray="5 3.5"' : ''} clip-path="url(#cp)"/>`;
      if (l.et) {
        /* etiqueta cerca del borde, dentro del cuadro */
        let best = null;
        for (let x = RANGO - 0.6; x >= -RANGO + 0.6; x -= 0.2) {
          const y = Math.abs(l.B) > 1e-9 ? (l.C - l.A * x) / l.B : null;
          const qx = y === null ? l.C / l.A : x, qy = y === null ? RANGO - 0.8 : y;
          if (Math.abs(qx) <= RANGO - 0.6 && Math.abs(qy) <= RANGO - 0.8) { best = [qx, qy]; break; }
        }
        if (best) s += `<text x="${X(best[0]) + 3}" y="${Y(best[1]) - 4}" font-size="9" font-weight="700" fill="${col}">${l.et}</text>`;
      }
    });
    (puntos || []).forEach(q => {
      s += `<circle cx="${X(q.p[0])}" cy="${Y(q.p[1])}" r="2.6" fill="${q.col || '#111'}"/>`;
      if (q.et) s += `<text x="${X(q.p[0]) + 4}" y="${Y(q.p[1]) + 10}" font-size="8" fill="${q.col || '#111'}">${q.et}</text>`;
    });
    return s + '</svg>';
  }

  /* Punto de prueba: el origen si no está en la recta; si no, (1, 0) o (0, 1) */
  const puntoPrueba = l => [[0, 0], [1, 0], [0, 1], [1, 1]].find(q => l.A * q[0] + l.B * q[1] !== l.C);
  function pasosSemiplano(l, nombre) {
    const P0 = puntoPrueba(l), v = l.A * P0[0] + l.B * P0[1], ok = cumple(v, l.s, l.C);
    const sust = `${n(l.A)} \\cdot ${p(P0[0])} ${l.B < 0 ? '-' : '+'} ${Math.abs(l.B)} \\cdot ${p(P0[1])} = ${n(v)}`;
    const [q1, q2] = l.tabla;
    return [
      { t: `Recta frontera ${nombre}\\(${T(l.A, 'x', true)}${T(l.B, 'y', false)} = ${n(l.C)}\\), con dos de sus puntos. Se dibuja ${estricta2(l.s) ? '<b>discontinua</b>: la desigualdad es estricta y la recta no forma parte de la solución' : '<b>continua</b>: la desigualdad admite la igualdad y la recta forma parte de la solución'}.`,
        m: `\\begin{array}{c|c|c} x & ${n(q1[0])} & ${n(q2[0])} \\\\ \\hline y & ${n(q1[1])} & ${n(q2[1])} \\end{array}` },
      { t: `Punto de prueba \\(P(${n(P0[0])},\\ ${n(P0[1])})\\), que no está en la recta: ${ok ? '<b>sí cumple</b> la inecuación, así que la solución es el semiplano que contiene a P' : '<b>no cumple</b> la inecuación, así que la solución es el semiplano que no contiene a P'}.`,
        m: `${sust} \\;\\Rightarrow\\; ${n(v)} ${l.s} ${n(l.C)} \\;\\text{es ${ok ? 'verdadero' : 'falso'}}` }
    ];
  }

  function inecuacion2(nivel) {
    return R => {
      const g = genNivel(R, nivel);
      const l = { A: g.A, B: g.B, C: g.C, s: g.s, tabla: g.tabla };
      const pasos = g.deriv.map(([t, m]) => ({ t, m }));
      pasosSemiplano(l, '').forEach(q => pasos.push(q));
      const reg = recortar([[-50, -50], [50, -50], [50, 50], [-50, 50]], l.A, l.B, l.C, positivo(l.s));
      const P0 = puntoPrueba(l);
      pasos.push({ t: `Región solución (sombreada)${estricta2(l.s) ? ', sin la recta' : ', con la recta'}:`,
        html: planoSVG([l], reg, [...l.tabla.map(q => ({ p: q })), { p: P0, et: 'P', col: ROJO }]) });
      return { enun: g.tex, pasos, res: `\\text{Semiplano } ${lin(l.A, l.B, l.C, l.s)}${estricta2(l.s) ? '\\ \\text{(sin la recta)}' : '\\ \\text{(con la recta)}'}` };
    };
  }
  const ENUN2 = ['Representa gráficamente la solución de la siguiente inecuación:', 'Representa gráficamente la solución de las siguientes inecuaciones:'];
  registrarFicha({
    id: 'inec-2-incog',
    titulo: 'Inecuaciones con dos incógnitas',
    detalle: 'Semiplanos',
    grupo: GRUPO,
    enlace: '../inecuaciones/inec-2-incog.html',
    ejercicios: [
      { id: 'nivel-1', nombre: 'Nivel 1 · Coeficientes enteros', peso: 1, columnas: 2, enunciado: ENUN2, generar: inecuacion2(1) },
      { id: 'nivel-2', nombre: 'Nivel 2 · Con paréntesis', peso: 1.25, columnas: 2, enunciado: ENUN2, generar: inecuacion2(2) },
      { id: 'nivel-3', nombre: 'Nivel 3 · Con denominadores', peso: 1.5, columnas: 2, enunciado: ENUN2, generar: inecuacion2(3) },
      { id: 'nivel-4', nombre: 'Nivel 4 · Paréntesis y denominadores', peso: 1.75, columnas: 2, enunciado: ENUN2, generar: inecuacion2(4) }
    ]
  });

  /* ================= Sistemas de inecuaciones con dos incógnitas ================= */
  function genSecantes(R) {
    const x0 = R.int(-4, 4), y0 = R.int(-4, 4);
    if (x0 === 0 && y0 === 0 && R.rand() < 0.75) return null;
    const mk = () => { const A = R.nz(-4, 4), B = R.pick([1, -1, 2, -2, 3, -3]); return { A, B, C: A * x0 + B * y0 }; };
    const l1 = mk(), l2 = mk();
    const det = l1.A * l2.B - l2.A * l1.B;
    if (det === 0) return null;
    if (Math.abs(det) / (Math.hypot(l1.A, l1.B) * Math.hypot(l2.A, l2.B)) < 0.3) return null;
    if (Math.abs(l1.C) > 14 || Math.abs(l2.C) > 14) return null;
    return { tipo: 'secantes', l: [l1, l2], corte: [x0, y0] };
  }
  function genParalelas(R) {
    const A = R.nz(-4, 4), B = R.pick([1, -1, 2, -2, 3, -3]);
    if (gcd(A, B) !== 1) return null;
    const m = R.pick([1, -1, 2, -2, 2, 3, -1]);
    if (Math.abs(m * A) > 9 || Math.abs(m * B) > 9) return null;
    const d1 = R.int(-8, 8), d2 = R.int(-8, 8);
    if (d1 === d2 || Math.abs(d1 - d2) / Math.hypot(A, B) < 1.4) return null;
    const l = [{ A, B, C: d1 }, { A: m * A, B: m * B, C: m * d2 }];
    if (R.rand() < 0.5) l.reverse();
    return { tipo: 'paralelas', l, corte: null };
  }
  function genSistema2(R, soloSecantes) {
    for (let i = 0; i < 2000; i++) {
      const g = !soloSecantes && R.rand() < 0.3 ? genParalelas(R) : genSecantes(R);
      if (!g) continue;
      if (g.l.some(l => !(l.tabla = tablaDe(l.A, l.B, l.C)))) continue;
      g.l.forEach(l => { l.s = R.pick(S2); });
      if (g.corte && g.l.every(l => l.tabla.some(q => q[0] === g.corte[0] && q[1] === g.corte[1])) && R.rand() < 0.8) continue;
      let reg = [[-1000, -1000], [1000, -1000], [1000, 1000], [-1000, 1000]];
      g.l.forEach(l => { reg = reg.length ? recortar(reg, l.A, l.B, l.C, positivo(l.s)) : reg; });
      g.vacia = reg.length < 3 || area(reg) < 1e-6;
      g.region = g.vacia ? null : reg;
      return g;
    }
  }
  function sistema2(soloSecantes) {
    return R => {
      const g = genSistema2(R, soloSecantes);
      const [a, b] = g.l;
      const pasos = [];
      g.l.forEach((l, i) => etq(i + 1, pasosSemiplano(l, `\\(r_${i + 1}\\): `)).forEach(q => pasos.push(q)));
      if (g.tipo === 'secantes') {
        const [x0, y0] = g.corte;
        pasos.push({ t: 'Punto de corte de las dos rectas (resolviendo el sistema de ecuaciones):',
          m: `\\left\\{\\begin{array}{l} ${lin(a.A, a.B, a.C, '=')} \\\\ ${lin(b.A, b.B, b.C, '=')} \\end{array}\\right. \\;\\Rightarrow\\; (x,\\ y) = (${n(x0)},\\ ${n(y0)})` });
      } else {
        pasos.push({ t: 'Los coeficientes de x e y son proporcionales y los términos independientes no: las rectas son <b>paralelas</b> y no se cortan.' });
      }
      let concl, res;
      if (g.vacia) {
        concl = 'Los dos semiplanos no tienen ningún punto en común: <b>el sistema no tiene solución</b>.';
        res = '\\text{El sistema no tiene solución}';
      } else if (g.tipo === 'paralelas') {
        const r0enS1 = cumple(b.A * a.tabla[0][0] + b.B * a.tabla[0][1], b.s, b.C) || (b.A * a.tabla[0][0] + b.B * a.tabla[0][1] === b.C);
        const r1enS0 = cumple(a.A * b.tabla[0][0] + a.B * b.tabla[0][1], a.s, a.C) || (a.A * b.tabla[0][0] + a.B * b.tabla[0][1] === a.C);
        if (r0enS1 && r1enS0) { concl = 'La solución es la <b>franja</b> comprendida entre las dos rectas paralelas.'; res = '\\text{Franja entre las dos rectas}'; }
        else { const k = r0enS1 ? 1 : 2; concl = `El semiplano de (${k}) está contenido en el otro: la solución es <b>el semiplano de (${k})</b>.`; res = `\\text{Semiplano de la inecuación (${k})}`; }
      } else {
        const vIn = !estricta2(a.s) && !estricta2(b.s);
        concl = `La solución es la región común a los dos semiplanos, con vértice en \\((${n(g.corte[0])},\\ ${n(g.corte[1])})\\). El vértice ${vIn ? '<b>sí pertenece</b> a la solución (las dos desigualdades admiten la igualdad)' : '<b>no pertenece</b> a la solución (alguna desigualdad es estricta)'}.`;
        res = `\\text{Región con vértice } (${n(g.corte[0])},\\ ${n(g.corte[1])})${vIn ? '\\text{, incluido}' : '\\text{, sin incluir}'}`;
      }
      const pts = g.l.flatMap((l, i) => l.tabla.map(q => ({ p: q, col: COLR[i] })));
      if (g.corte) pts.push({ p: g.corte, col: ROJO });
      pasos.push({ t: `${concl} En la gráfica, la región solución sombreada:`,
        html: planoSVG(g.l.map((l, i) => Object.assign({ et: `r${i + 1}` }, l)), g.region, pts) });
      const sisTeX = `\\left\\{\\begin{array}{l} ${lin(a.A, a.B, a.C, a.s)} \\\\ ${lin(b.A, b.B, b.C, b.s)} \\end{array}\\right.`;
      return { enun: sisTeX, pasos, res };
    };
  }
  registrarFicha({
    id: 'sist-inec-2-incog',
    titulo: 'Sistemas de inecuaciones con dos incógnitas',
    detalle: '',
    grupo: GRUPO,
    enlace: '../inecuaciones/sist-inec-2-incog.html',
    ejercicios: [
      { id: 'sistema', nombre: 'Sistema de dos inecuaciones (como la ficha: a veces, rectas paralelas)', peso: 2, columnas: 2,
        enunciado: ['Resuelve gráficamente el siguiente sistema de inecuaciones:', 'Resuelve gráficamente los siguientes sistemas de inecuaciones:'], generar: sistema2(false) },
      { id: 'secantes', nombre: 'Sistema de dos inecuaciones con rectas que se cortan', peso: 2, columnas: 2,
        enunciado: ['Resuelve gráficamente el siguiente sistema de inecuaciones:', 'Resuelve gráficamente los siguientes sistemas de inecuaciones:'], generar: sistema2(true) }
    ]
  });
})();
