/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: logaritmos (1.º Bachillerato).
   Los números se generan con los mismos criterios que la ficha interactiva. */
(function () {
  'use strict';
  const { registrarFicha } = window.EX;
  const S = String.raw;

  /* ---------- Fracciones ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
  function F(n, d = 1) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; }
  const fmul = (a, b) => F(a.n * b.n, a.d * b.d);
  const fdiv = (a, b) => F(a.n * b.d, a.d * b.n);
  const fneg = a => F(-a.n, a.d);
  const fabs = a => F(Math.abs(a.n), a.d);
  const finv = a => F(a.d, a.n);
  const fval = a => a.n / a.d;
  function ipow(b, n) { let r = 1; for (let i = 0; i < n; i++) r *= b; return r; }
  function expLx(f) { if (f.d === 1) return String(f.n); return (f.n < 0 ? '-' : '') + S`\frac{${Math.abs(f.n)}}{${f.d}}`; }

  /* ---------- Decimales con coma ---------- */
  function shiftStr(M, e) {
    let s = String(M); if (e >= 0) return s + '0'.repeat(e);
    const k = -e; while (s.length <= k) s = '0' + s;
    const ip = s.slice(0, s.length - k), fp = s.slice(s.length - k).replace(/0+$/, '');
    return fp ? ip + ',' + fp : ip;
  }
  function fracToDec(num, den) { for (let k = 0; k <= 8; k++) { const p = num * Math.pow(10, k); if (p % den === 0) return shiftStr(p / den, -k); } return null; }
  function decStr(x, dec = 4) { let s = x.toFixed(dec); if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, ''); if (s === '-0') s = '0'; return s.replace('.', ','); }
  const decLx = s => s.replace(',', '{,}');

  /* ---------- Potencias en TeX ---------- */
  function powLatex(B, e, o = {}) {
    if (e.d === 1) {
      const p = e.n; let num, den;
      if (p >= 0) { num = ipow(B.n, p); den = ipow(B.d, p); } else { num = ipow(B.d, -p); den = ipow(B.n, -p); }
      if (den === 1) return String(num);
      if (o.decimal) { const s = fracToDec(num, den); if (s) return decLx(s); }
      return S`\frac{${num}}{${den}}`;
    }
    const k = B.n, p = e.n, q = e.d;
    const rad = r => { const inner = ipow(k, r); return q === 2 ? S`\sqrt{${inner}}` : S`\sqrt[${q}]{${inner}}`; };
    if (p > 0) { const m = Math.floor(p / q), r = p % q; return (m > 0 ? String(ipow(k, m)) : '') + rad(r); }
    const P = -p;
    if (o.neg === 'inv') { const m = Math.floor(P / q), r = P % q; return S`\frac{1}{${(m > 0 ? String(ipow(k, m)) : '') + rad(r)}}`; }
    const m = Math.ceil(P / q), r = m * q - P; return S`\frac{${rad(r)}}{${ipow(k, m)}}`;
  }
  const wrapArg = s => (/^\d+\\sqrt/.test(s) ? S`\left(${s}\right)` : s);
  const wrapBase = s => (/\\frac|\\sqrt/.test(s) ? S`\left(${s}\right)` : s);
  const Bname = B => (B.d === 1 ? String(B.n) : S`\left(\frac{${B.n}}{${B.d}}\right)`);
  function xTimes(r) { if (r.d === 1 && r.n === 1) return 'x'; if (r.d === 1 && r.n === -1) return '-x'; return expLx(r) + 'x'; }

  const GRUPO = 'Radicales y logaritmos';
  /* En subíndices, las fracciones se escriben con barra para que se lean bien impresas */
  const sub = t => t.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2');

  /* ================= Logaritmo por definición ================= */
  function definicion(R) {
    for (let tries = 0; tries < 400; tries++) {
      const pat = R.pick(['int', 'int', 'dec10', 'inv', 'pow', 'root', 'root', 'frac']);
      let B, r, s, dec = false, base10 = false;
      if (pat === 'int') { const k = R.pick([2, 3, 5, 7]); B = F(k); r = F(1); s = F(R.int(-3, 6)); if (k === 2) { if (R.rand() < 0.5) s = F(R.int(-3, 10)); if (s.n < 0 && R.rand() < 0.6) dec = true; } }
      else if (pat === 'dec10') { B = F(10); r = F(1); s = F(R.pick([-5, -4, -3, -2, -1, 2, 3, 4, 5, 6])); dec = true; base10 = true; }
      else if (pat === 'inv') { const k = R.pick([2, 3, 5]); B = F(k); r = F(-1); s = F(R.pick([-4, -3, -2, -1, 2, 3, 4, 5])); }
      else if (pat === 'pow') { const k = R.pick([2, 3, 5, 7, 6]); B = F(k); r = F(R.pick([2, 3])); s = F(R.pick([-3, -2, -1, 1, 1, 2, 3, 4, 5])); }
      else if (pat === 'root') {
        const k = R.pick([2, 3, 5, 7]); B = F(k);
        if (R.rand() < 0.35) { r = F(1, 2); s = R.pick([F(2), F(3), F(4), F(-2), F(3, 2), F(5, 2), F(-1)]); }
        else { r = R.pick([F(1), F(1), F(2), F(3)]); s = R.pick([F(1, 2), F(1, 3), F(1, 4), F(3, 2), F(2, 3), F(-1, 2), F(-3, 2), F(5, 2), F(-7, 4), F(3, 4), F(1, 5), F(-1, 3)]); }
      } else { const pr = R.pick([[2, 3], [3, 2], [3, 5], [5, 3], [2, 5], [5, 2], [3, 4], [4, 3]]); B = F(pr[0], pr[1]); r = F(1); s = F(R.pick([-4, -3, -2, 2, 3, 4])); }
      const big = Math.max(B.n, B.d);
      if (Math.pow(big, Math.abs(fval(s))) > (base10 ? 1e7 : 3125)) continue;
      if (Math.pow(big, Math.abs(fval(r))) > 343) continue;
      if (s.n === 0 && R.rand() < 0.6) continue;
      const ans = fdiv(s, r);
      if (ans.d > 12) continue;
      const bL = base10 ? '10' : powLatex(B, r);
      const NL = powLatex(B, s, { decimal: dec });
      const logL = base10 ? S`\log ` : S`\log_{${sub(bL)}} `;
      const Bl = Bname(B);
      const unaBase = r.d === 1 && r.n === 1;
      const partes = [];
      if (!unaBase) partes.push(S`${bL} = ${Bl}^{${expLx(r)}}`);
      partes.push(S`${NL} = ${Bl}^{${expLx(s)}}`);
      return {
        enun: `${logL}${wrapArg(NL)}`,
        pasos: [
          { t: 'Aplicamos la definición: el logaritmo es el exponente al que hay que elevar la base para obtener el argumento.',
            m: S`${logL}${wrapArg(NL)} = x \iff ${wrapBase(bL)}^{x} = ${NL}` },
          { t: unaBase ? `Escribimos el argumento como potencia de ${base10 ? '10' : 'la base'}:` : 'Escribimos la base y el argumento como potencias de un mismo número:',
            m: partes.join(S`,\qquad `) },
          { t: 'Igualamos los exponentes:',
            m: unaBase ? S`${Bl}^{x} = ${Bl}^{${expLx(s)}} \;\Rightarrow\; x = ${expLx(ans)}`
              : S`${Bl}^{${xTimes(r)}} = ${Bl}^{${expLx(s)}} \;\Rightarrow\; ${xTimes(r)} = ${expLx(s)} \;\Rightarrow\; x = ${expLx(ans)}` }
        ],
        res: S`${logL}${wrapArg(NL)} = ${expLx(ans)}`
      };
    }
    throw new Error('No se pudo generar el logaritmo');
  }

  /* ================= Incógnita en la base, el argumento o el exponente ================= */
  function incognita(R, i) {
    const orden = ['base', 'arg', 'exp', 'base', 'arg', 'inv'];
    const v0 = orden[(i + R.int(0, 5)) % orden.length];
    for (let tries = 0; tries < 400; tries++) {
      const v = tries < 200 ? v0 : R.pick(orden);
      if (v === 'base') {
        const k = R.pick([2, 3, 5, 7]); const rx = R.pick([F(1), F(1), F(-1), F(1, 2), F(-1, 2)]);
        const c = R.pick([F(2), F(3), F(-1), F(-2), F(1, 2), F(-1, 2), F(3, 2), F(4), F(5), F(-3)]);
        const s = fmul(rx, c); if (s.n === 0 || ![1, 2, 4].includes(s.d)) continue;
        if (Math.pow(k, Math.abs(fval(s))) > 3125) continue;
        if (rx.n === 1 && rx.d === 1 && c.n === 1 && c.d === 1) continue;
        const B = F(k);
        const NL = powLatex(B, s, { decimal: (k === 2 || k === 5) && R.rand() < 0.5 });
        const xL = powLatex(B, rx, { neg: 'inv' }), xL2 = powLatex(B, rx);
        const xFin = xL === xL2 ? xL : S`${xL} = ${xL2}`;
        return {
          enun: S`\log_{x} ${wrapArg(NL)} = ${expLx(c)}`,
          pasos: [
            { t: 'Pasamos a forma exponencial:', m: S`\log_{x} ${wrapArg(NL)} = ${expLx(c)} \iff x^{${expLx(c)}} = ${NL}` },
            { t: `Escribimos el segundo miembro como potencia de ${k}:`, m: S`x^{${expLx(c)}} = ${k}^{${expLx(s)}}` },
            { t: `Despejamos \\(x\\) elevando ambos miembros a \\(${expLx(finv(c))}\\), el inverso del exponente:`, m: S`x = \left(${k}^{${expLx(s)}}\right)^{${expLx(finv(c))}} = ${k}^{${expLx(rx)}} = ${xFin}` }
          ],
          res: S`x = ${xFin}`
        };
      }
      if (v === 'arg') {
        let B, r, c;
        if (R.rand() < 0.25) { const pr = R.pick([[2, 5], [3, 4], [2, 3], [5, 2]]); B = F(pr[0], pr[1]); r = F(1); c = F(R.pick([-1, -2, 2, 3])); }
        else { B = F(R.pick([2, 3, 5, 7])); r = R.pick([F(1), F(2), F(3), F(-1), F(1, 2)]); c = R.pick([F(2), F(3), F(-1), F(-2), F(1, 2), F(3, 2), F(-1, 2), F(4), F(5), F(-3), F(2, 3)]); }
        const s = fmul(r, c); if (s.d !== 1 || s.n === 0) continue;
        const big = Math.max(B.n, B.d);
        if (Math.pow(big, Math.abs(s.n)) > 3125 || Math.pow(big, Math.abs(fval(r))) > 343) continue;
        const bL = powLatex(B, r), xL = powLatex(B, s);
        const pasos = [{ t: 'Pasamos a forma exponencial: el argumento es la base elevada al valor del logaritmo.', m: S`\log_{${sub(bL)}} x = ${expLx(c)} \iff x = ${wrapBase(bL)}^{${expLx(c)}}` }];
        if (!(r.d === 1 && r.n === 1)) pasos.push({ t: 'Escribimos la base como potencia y operamos:', m: S`x = \left(${Bname(B)}^{${expLx(r)}}\right)^{${expLx(c)}} = ${Bname(B)}^{${s.n}} = ${xL}` });
        else pasos.push({ t: 'Calculamos la potencia:', m: S`x = ${xL}` });
        return { enun: S`\log_{${sub(bL)}} x = ${expLx(c)}`, pasos, res: S`x = ${xL}` };
      }
      if (v === 'exp') {
        const k = R.pick([2, 3, 5]); const s = R.pick([F(2), F(3), F(4), F(5), F(-1), F(-2), F(-3), F(1, 2), F(3, 2), F(-1, 2)]);
        if (Math.pow(k, Math.abs(fval(s))) > 625) continue;
        const NL = powLatex(F(k), s, { decimal: R.rand() < 0.5 });
        return {
          enun: S`${k}^{x} = ${NL}`,
          pasos: [
            { t: 'Por la definición de logaritmo:', m: S`${k}^{x} = ${NL} \iff x = \log_{${k}} ${wrapArg(NL)}` },
            { t: `Escribimos el segundo miembro como potencia de ${k} e igualamos exponentes:`, m: S`${k}^{x} = ${k}^{${expLx(s)}} \;\Rightarrow\; x = ${expLx(s)}` }
          ],
          res: S`x = ${expLx(s)}`
        };
      }
      // inv: k^(1/x) = k^m
      const k = R.pick([2, 3, 5]); const m = R.pick([2, 3, 4, -1, -2]);
      if (Math.pow(k, Math.abs(m)) > 625) continue;
      const NL = powLatex(F(k), F(m)); const ans = F(1, m);
      return {
        enun: S`${k}^{1/x} = ${NL}`,
        pasos: [
          { t: `Escribimos el segundo miembro como potencia de ${k}:`, m: S`${k}^{1/x} = ${k}^{${m}}` },
          { t: 'Igualamos los exponentes e invertimos:', m: S`\frac{1}{x} = ${m} \;\Rightarrow\; x = ${expLx(ans)}` }
        ],
        res: S`x = ${expLx(ans)}`
      };
    }
    throw new Error('No se pudo generar el ejercicio');
  }

  /* ================= Cálculo con log 2, log 3 y log 7 ================= */
  const LG = { 2: 0.3010, 3: 0.4771, 5: 0.6990, 7: 0.8451 };
  function factoriza(n) { const e = { 2: 0, 3: 0, 5: 0, 7: 0 }; for (const p of [2, 3, 5, 7]) while (n % p === 0) { n /= p; e[p]++; } return n === 1 ? e : null; }
  const logDe = e => e[2] * LG[2] + e[3] * LG[3] + e[5] * LG[5] + e[7] * LG[7];
  function potLx(e) { const t = []; for (const p of [2, 3, 5, 7]) if (e[p]) t.push(e[p] === 1 ? String(p) : S`${p}^{${e[p]}}`); return t.join(S`\cdot `) || '1'; }
  function sumaLogLx(e) { const t = []; for (const p of [2, 3, 5, 7]) if (e[p]) t.push((e[p] === 1 ? '' : e[p]) + S`\log ${p}`); return t.join(' + '); }
  function sumaNumLx(e) { const t = []; for (const p of [2, 3, 5, 7]) if (e[p]) t.push((e[p] === 1 ? '' : e[p] + S`\cdot `) + decLx(decStr(LG[p], 4))); return t.join(' + '); }
  const NOTA5 = { t: 'Recuerda que \\(\\log 5\\) se obtiene a partir de \\(\\log 2\\):', m: S`\log 5 = \log\frac{10}{2} = \log 10 - \log 2 = 1 - 0{,}3010 = 0{,}6990` };
  const D4 = x => decLx(decStr(x, 4));

  function calculo(R, i) {
    const orden = ['dec', 'frac', 'root', 'cambio', 'dec'];
    const v0 = orden[(i + R.int(0, 4)) % orden.length];
    for (let tries = 0; tries < 500; tries++) {
      const v = tries < 250 ? v0 : R.pick(orden);
      if (v === 'dec' || v === 'root') {
        const a = R.int(0, 7), b = R.int(0, 3), c = R.int(0, 2), d = R.rand() < 0.35 ? 1 : 0;
        const M = ipow(2, a) * ipow(3, b) * ipow(5, c) * ipow(7, d);
        if (M < 6 || M > 3000 || M % 10 === 0) continue;
        if ([a, b, c, d].filter(x => x > 0).length < (v === 'dec' ? 2 : 1)) continue;
        const ex = R.pick([0, 0, -1, -2, -3]);
        const NL = decLx(shiftStr(M, ex));
        const e = { 2: a, 3: b, 5: c, 7: d }; const base = logDe(e) + ex;
        const n = v === 'root' ? R.pick([2, 3, 5]) : 1; const val = base / n;
        const logExp = S`${sumaLogLx(e)}${ex < 0 ? ' - ' + (-ex) : ''}`;
        const numExp = S`${sumaNumLx(e)}${ex < 0 ? ' - ' + (-ex) : ''}`;
        const pasos = [{ t: ex < 0 ? 'Escribimos el número como un producto de factores primos dividido entre una potencia de 10:' : 'Descomponemos el número en factores primos:',
          m: ex < 0 ? S`${NL} = \frac{${potLx(e)}}{10^{${-ex}}}` : S`${NL} = ${potLx(e)}` }];
        let enun;
        if (v === 'root') {
          enun = n === 2 ? S`\log\sqrt{${NL}}` : S`\log\sqrt[${n}]{${NL}}`;
          pasos.push({ t: 'Aplicamos las propiedades de la raíz, del producto y del cociente:', m: S`${enun} = \frac{1}{${n}}\log ${NL} = \frac{1}{${n}}\left(${logExp}\right)` });
          pasos.push({ t: 'Sustituimos los datos:', m: S`= \frac{1}{${n}}\left(${numExp}\right) = \frac{${D4(base)}}{${n}} \approx ${D4(val)}` });
        } else {
          enun = S`\log ${NL}`;
          pasos.push({ t: 'Aplicamos las propiedades del producto, del cociente y de la potencia:', m: S`${enun} = ${logExp}` });
          pasos.push({ t: 'Sustituimos los datos:', m: S`= ${numExp} = ${D4(val)}` });
        }
        if (c > 0) pasos.push(NOTA5);
        return { enun, pasos, res: S`${enun} ${v === 'root' ? '\\approx' : '='} ${D4(val)}` };
      }
      if (v === 'frac') {
        const p = R.pick([2, 3, 4, 6, 8, 9, 12, 16, 18, 27, 7, 14, 21]), q = R.pick([5, 3, 2, 4, 7, 9, 25, 10]);
        if (gcd(p, q) !== 1 || p === q) continue;
        const k = R.pick([1, 2, 3]); const ep = factoriza(p), eq = factoriza(q);
        const val = k * (logDe(ep) - logDe(eq));
        const fr = S`\frac{${p}}{${q}}`;
        const enun = k === 1 ? S`\log ${fr}` : S`\log\left(${fr}\right)^{${k}}`;
        const pasos = [
          { t: k > 1 ? 'El exponente multiplica al logaritmo y el logaritmo de un cociente es la resta de logaritmos:' : 'El logaritmo de un cociente es la resta de logaritmos:',
            m: k > 1 ? S`${enun} = ${k}\left(\log ${p} - \log ${q}\right)` : S`${enun} = \log ${p} - \log ${q}` },
          { t: 'Calculamos cada logaritmo con los datos:', m: S`\log ${p} = ${sumaLogLx(ep)} = ${D4(logDe(ep))},\qquad \log ${q} = ${sumaLogLx(eq)} = ${D4(logDe(eq))}` },
          { t: 'Sustituimos:', m: S`${enun} = ${k > 1 ? k + S`\cdot` : ''}\left(${D4(logDe(ep))} - ${D4(logDe(eq))}\right) = ${D4(val)}` }
        ];
        if (eq[5] || ep[5]) pasos.push(NOTA5);
        return { enun, pasos, res: S`${enun} = ${D4(val)}` };
      }
      // cambio de base
      const A = R.pick([2, 3, 4, 5, 6, 8, 9, 12, 16, 25, 27]), Bb = R.pick([2, 3, 4, 5, 6, 8, 9, 12]);
      if (A === Bb) continue;
      const eA = factoriza(A), eB = factoriza(Bb); const lA = logDe(eA), lB = logDe(eB); const val = lA / lB;
      const enun = S`\log_{${Bb}} ${A}`;
      const pasos = [
        { t: 'Aplicamos el cambio de base a logaritmos decimales:', m: S`${enun} = \frac{\log ${A}}{\log ${Bb}}` },
        { t: 'Descomponemos y sustituimos los datos:', m: S`= \frac{${sumaLogLx(eA)}}{${sumaLogLx(eB)}} = \frac{${D4(lA)}}{${D4(lB)}} \approx ${D4(val)}` }
      ];
      if (eA[5] || eB[5]) pasos.push(NOTA5);
      return { enun, pasos, res: S`${enun} \approx ${D4(val)}` };
    }
    throw new Error('No se pudo generar el ejercicio');
  }

  /* ================= Ecuaciones con propiedades ================= */
  function ecuacion(R) {
    const ln = R.rand() < 0.5; const L = ln ? S`\ln ` : S`\log `;
    const AGRUPA = 'Agrupamos en un único logaritmo con las propiedades (suma → producto, resta → cociente, coeficiente → exponente):';
    const IGUALA = 'Como el logaritmo es inyectivo, igualamos los argumentos:';
    for (let tries = 0; tries < 300; tries++) {
      const v = R.pick(['E1', 'E2', 'E3', 'E4', 'E5', 'E6']);
      let enun, ans, pasos;
      if (v === 'E1') {
        const a = R.int(2, 9), b = R.int(2, 9); if (a === b) continue; ans = F(a * b);
        enun = S`${L}x = ${L}${a} + ${L}${b}`;
        pasos = [{ t: AGRUPA, m: S`${L}${a} + ${L}${b} = ${L}(${a}\cdot ${b}) = ${L}${a * b}` }, { t: IGUALA, m: S`${L}x = ${L}${a * b} \;\Rightarrow\; x = ${a * b}` }];
      } else if (v === 'E2') {
        const b = R.int(2, 9); let a; if (R.rand() < 0.6) a = b * R.int(2, 9); else { a = R.int(2, 30); if (a % b === 0) continue; } ans = F(a, b);
        enun = S`${L}x = ${L}${a} - ${L}${b}`;
        pasos = [{ t: AGRUPA, m: S`${L}${a} - ${L}${b} = ${L}\frac{${a}}{${b}}` }, { t: IGUALA, m: S`x = \frac{${a}}{${b}}${ans.d === b && ans.n === a ? '' : ' = ' + expLx(ans)}` }];
      } else if (v === 'E3') {
        const a = R.int(2, 5), n = R.int(2, 4); if (ipow(a, n) > 625) continue; ans = F(ipow(a, n));
        enun = S`${L}x = ${n}\,${L}${a}`;
        pasos = [{ t: AGRUPA, m: S`${n}\,${L}${a} = ${L}${a}^{${n}} = ${L}${ipow(a, n)}` }, { t: IGUALA, m: S`x = ${ipow(a, n)}` }];
      } else if (v === 'E4') {
        const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9); if (a === b || c === a || c === b) continue; ans = F(a * b, c);
        enun = S`${L}x = ${L}${a} + ${L}${b} - ${L}${c}`;
        pasos = [{ t: AGRUPA, m: S`${L}${a} + ${L}${b} - ${L}${c} = ${L}\frac{${a}\cdot ${b}}{${c}} = ${L}${expLx(ans)}` }, { t: IGUALA, m: S`x = ${expLx(ans)}` }];
      } else if (v === 'E5') {
        const a = R.pick([2, 3]), m = R.int(2, 4), d = R.pick([2, 3, 5]), n = R.pick([2, 3]); const b = ipow(d, n);
        if (b > 125 || a === d) continue; ans = F(ipow(a, m), d);
        enun = S`${L}x = ${m}\,${L}${a} - \frac{1}{${n}}\,${L}${b}`;
        pasos = [
          { t: 'Cada coeficiente pasa a ser exponente:', m: S`${m}\,${L}${a} = ${L}${a}^{${m}} = ${L}${ipow(a, m)},\qquad \frac{1}{${n}}\,${L}${b} = ${L}${n === 2 ? S`\sqrt{${b}}` : S`\sqrt[${n}]{${b}}`} = ${L}${d}` },
          { t: 'La resta de logaritmos es el logaritmo del cociente; igualamos los argumentos:', m: S`${L}x = ${L}${ipow(a, m)} - ${L}${d} = ${L}\frac{${ipow(a, m)}}{${d}} \;\Rightarrow\; x = ${expLx(ans)}` }
        ];
      } else {
        const y = R.int(2, 9), n = R.pick([2, 3]);
        const raizX = n === 2 ? S`\sqrt{x}` : S`\sqrt[3]{x}`;
        if (R.rand() < 0.5) {
          const a = ipow(y, n); if (a > 729) continue; ans = F(y);
          enun = S`${n}\,${L}x = ${L}${a}`;
          pasos = [
            { t: 'El coeficiente pasa a ser exponente:', m: S`${n}\,${L}x = ${L}x^{${n}} = ${L}${a}` },
            { t: IGUALA, m: S`x^{${n}} = ${a} \;\Rightarrow\; x = ${n === 2 ? S`\pm\sqrt{${a}} = \pm ${y}` : S`\sqrt[3]{${a}} = ${y}`}` }
          ];
          if (n === 2) pasos.push({ t: `La solución \\(x = -${y}\\) no es válida: el argumento de un logaritmo tiene que ser positivo.` });
        } else {
          const a = R.int(2, 9); if (ipow(a, n) > 729) continue; ans = F(ipow(a, n));
          enun = S`\frac{1}{${n}}\,${L}x = ${L}${a}`;
          pasos = [
            { t: 'El coeficiente pasa a ser exponente (una raíz):', m: S`\frac{1}{${n}}\,${L}x = ${L}${raizX} = ${L}${a}` },
            { t: `${IGUALA.slice(0, -1)} y elevamos a ${n}:`, m: S`${raizX} = ${a} \;\Rightarrow\; x = ${a}^{${n}} = ${ipow(a, n)}` }
          ];
        }
      }
      return { enun, pasos, res: S`x = ${expLx(ans)}` };
    }
    throw new Error('No se pudo generar la ecuación');
  }

  /* ================= Desarrollar, comprimir y eliminar ================= */
  function termLx(v, e) { const inner = e.n === 1 ? v : S`${v}^{${e.n}}`; if (e.d === 1) return inner; return e.d === 2 ? S`\sqrt{${inner}}` : S`\sqrt[${e.d}]{${inner}}`; }
  function argLx(terms) {
    const num = terms.filter(t => t.s > 0), den = terms.filter(t => t.s < 0);
    const nl = num.length ? num.map(t => termLx(t.v, t.e)).join(S`\,`) : '1';
    if (!den.length) return nl;
    return S`\frac{${nl}}{${den.map(t => termLx(t.v, t.e)).join(S`\,`)}}`;
  }
  function coefLx(c, first) { const neg = c.n < 0, a = Math.abs(c.n); const body = c.d === 1 ? (a === 1 ? '' : String(a)) : S`\frac{${a}}{${c.d}}`; return (neg ? '-' : (first ? '' : '+')) + body; }
  const sumLx = (items, L = S`\log `) => items.map((it, i) => coefLx(it.c, i === 0) + L + it.v).join(' ');
  const tenLx = k => (k >= 0 ? String(ipow(10, k)) : S`\frac{1}{${ipow(10, -k)}}`);
  const separado = terms => terms.map((t, i) => (t.s > 0 ? (i ? '+' : '') : '-') + S`\log ` + termLx(t.v, t.e)).join(' ');

  function desarrollar(R) {
    const vars = R.pick([['a', 'b', 'c'], ['x', 'y', 'z'], ['m', 'n', 'p']]);
    const tPow = { v: vars[0], e: F(R.int(2, 4)), s: 1 };
    const tRoot = { v: vars[1], e: R.pick([F(1, 2), F(1, 3), F(2, 3), F(3, 4), F(1, 4), F(2, 5), F(3, 2)]), s: R.rand() < 0.5 ? 1 : -1 };
    const tThird = { v: vars[2], e: R.pick([F(1), F(2), F(3), F(1, 2), F(3, 4)]), s: -1 };
    if (tRoot.s === -1 && R.rand() < 0.5) tThird.s = 1;
    const terms = [tPow, tRoot, tThird];
    const correcto = sumLx(terms.map(t => ({ c: t.s > 0 ? t.e : fneg(t.e), v: t.v })));
    const enun = S`\log ${argLx(terms)}`;
    return {
      enun,
      pasos: [
        { t: 'El producto pasa a suma y el cociente a resta:', m: S`${enun} = ${separado(terms)}` },
        { t: 'Como \\(\\sqrt[n]{a^m} = a^{m/n}\\), cada exponente pasa a multiplicar delante del logaritmo:', m: S`= ${correcto}` }
      ],
      res: correcto
    };
  }

  function comprimir(R) {
    for (let tries = 0; tries < 200; tries++) {
      const vars = R.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['x', 'y', 'z']]);
      const pool = [F(2), F(3), F(4), F(1, 2), F(1, 3), F(1, 4), F(-1), F(-2), F(-1, 2), F(-3), F(1)];
      const items = vars.map(v => ({ v, c: R.pick(pool) }));
      if (!items.some(it => !(Math.abs(it.c.n) === 1 && it.c.d === 1))) continue;
      if (items.length === 3 && !items.some(it => it.c.n < 0)) continue;
      if (items[0].c.n < 0 && items.every(it => it.c.n < 0)) continue;
      const terms = items.map(it => ({ v: it.v, e: fabs(it.c), s: it.c.n < 0 ? -1 : 1 }));
      const correcto = S`\log ${argLx(terms)}`;
      const enun = sumLx(items);
      return {
        enun,
        pasos: [
          { t: 'Cada coeficiente pasa a ser exponente del argumento:', m: S`${enun} = ${separado(terms)}` },
          { t: 'La suma de logaritmos es el logaritmo del producto y la resta, el del cociente:', m: S`= ${correcto}` }
        ],
        res: correcto
      };
    }
    throw new Error('No se pudo generar el ejercicio');
  }

  function eliminar(R) {
    const al = R.pick([F(1), F(2), F(3), F(4), F(2, 3), F(1, 2)]), be = R.pick([F(1), F(2), F(3)]);
    const modo = R.pick(['+', '-', 'const']);
    const k = modo === 'const' ? R.pick([1, 2]) : R.pick([1, 2, 3, -1, -2]);
    const sy = modo === '+' ? 1 : -1;
    const terms = [{ v: 'x', e: al, s: 1 }, { v: 'y', e: be, s: sy }];
    const arg = argLx(terms);
    let enun;
    if (modo === '+') enun = S`${coefLx(al, true)}\log x + ${coefLx(be, true)}\log y = ${k}`;
    else if (modo === '-') enun = S`${coefLx(al, true)}\log x - ${coefLx(be, true)}\log y = ${k}`;
    else enun = S`${coefLx(al, true)}\log x - ${k} = ${coefLx(be, true)}\log y`;
    const pasos = [];
    if (modo === 'const') pasos.push({ t: 'Pasamos los logaritmos a un miembro y el número al otro:', m: S`${coefLx(al, true)}\log x - ${coefLx(be, true)}\log y = ${k}` });
    pasos.push({ t: 'Agrupamos en un único logaritmo (los coeficientes pasan a exponentes):', m: S`\log ${termLx('x', al)} ${sy > 0 ? '+' : '-'} \log ${termLx('y', be)} = ${k} \;\Rightarrow\; \log ${arg} = ${k}` });
    pasos.push({ t: 'Aplicamos la definición de logaritmo, \\(\\log A = k \\iff A = 10^k\\):', m: S`${arg} = 10^{${k}} = ${tenLx(k)}` });
    return { enun, pasos, res: S`${arg} = ${tenLx(k)}` };
  }

  registrarFicha({
    id: 'logaritmos',
    titulo: 'Logaritmos',
    detalle: '1.º Bachillerato',
    grupo: GRUPO,
    enlace: '../logaritmos/logaritmos.html',
    ejercicios: [
      { id: 'definicion', nombre: 'Logaritmo por definición', peso: 1, columnas: 3,
        enunciado: ['Calcula aplicando la definición de logaritmo:', 'Calcula aplicando la definición de logaritmo:'],
        generar: definicion },
      { id: 'incognita', nombre: 'Incógnita en la base, el argumento o el exponente', peso: 1, columnas: 3,
        enunciado: ['Halla el valor de \\(x\\) aplicando la definición de logaritmo:', 'Halla el valor de \\(x\\) en cada caso aplicando la definición de logaritmo:'],
        generar: incognita },
      { id: 'calculo', nombre: 'Cálculo con log 2, log 3 y log 7', peso: 1.25, columnas: 3,
        enunciado: ['Sabiendo que \\(\\log 2 = 0{,}3010\\), \\(\\log 3 = 0{,}4771\\) y \\(\\log 7 = 0{,}8451\\), calcula sin usar la tecla log de la calculadora (da el resultado con 4 decimales):',
          'Sabiendo que \\(\\log 2 = 0{,}3010\\), \\(\\log 3 = 0{,}4771\\) y \\(\\log 7 = 0{,}8451\\), calcula sin usar la tecla log de la calculadora (da los resultados con 4 decimales):'],
        generar: calculo },
      { id: 'ecuaciones', nombre: 'Ecuaciones con propiedades', peso: 1.25, columnas: 2,
        enunciado: ['Halla el valor de \\(x\\) aplicando las propiedades de los logaritmos:', 'Halla el valor de \\(x\\) en cada ecuación aplicando las propiedades de los logaritmos:'],
        generar: ecuacion },
      { id: 'desarrollar', nombre: 'Desarrollar un logaritmo', peso: 1, columnas: 2,
        enunciado: ['Desarrolla aplicando las propiedades de los logaritmos:', 'Desarrolla aplicando las propiedades de los logaritmos:'],
        generar: desarrollar },
      { id: 'comprimir', nombre: 'Expresar con un único logaritmo', peso: 1, columnas: 2,
        enunciado: ['Expresa como un único logaritmo:', 'Expresa cada expresión como un único logaritmo:'],
        generar: comprimir },
      { id: 'eliminar', nombre: 'Eliminar logaritmos', peso: 1.25, columnas: 2,
        enunciado: ['Elimina los logaritmos, es decir, escribe la relación entre \\(x\\) e \\(y\\) sin logaritmos:', 'Elimina los logaritmos, es decir, escribe la relación entre \\(x\\) e \\(y\\) sin logaritmos:'],
        generar: eliminar }
    ]
  });
})();
