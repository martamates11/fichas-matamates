/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Utilidades comunes de los generadores de exámenes: azar reproducible,
   fracciones y escritura en TeX. */
(function () {
  'use strict';

  /* ---------- Azar reproducible (misma semilla → mismos números) ---------- */
  function crearAzar(semilla) {
    let a = semilla >>> 0;
    const rand = function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
    return {
      rand,
      int,
      nz(lo, hi) { let v; do { v = int(lo, hi); } while (v === 0); return v; },
      pick(arr) { return arr[Math.floor(rand() * arr.length)]; },
      signo() { return rand() < 0.5 ? 1 : -1; },
      shuffle(arr) {
        const r = arr.slice();
        for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
        return r;
      }
    };
  }

  /* ---------- Aritmética ---------- */
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  const mcm = (a, b) => Math.abs(a * b) / (mcd(a, b) || 1);
  function fr(n, d) {
    if (d === 0) throw new Error('Denominador nulo');
    if (n === 0) return { n: 0, d: 1 };
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d);
    return { n: n / g, d: d / g };
  }
  const esEntera = f => f.d === 1;

  /* ---------- TeX ---------- */
  const z = x => (Object.is(x, -0) ? 0 : x);
  const n = x => String(z(x));                         // número
  const p = x => (x < 0 ? `(${n(x)})` : n(x));        // entre paréntesis si es negativo
  function frac(f) {                                    // fracción simplificada
    if (f.d === 1) return n(f.n);
    return (f.n < 0 ? '-' : '') + `\\frac{${Math.abs(f.n)}}{${f.d}}`;
  }
  const fracP = f => (f.n < 0 ? `\\left(${frac(f)}\\right)` : frac(f));

  /* Suma de términos [[coef, 'x^2'], [coef, 'x'], [coef, '']] con signos limpios */
  function poli(terminos) {
    const t = [];
    terminos.forEach(([k, v]) => {
      k = z(k);
      if (k === 0) return;
      const abs = Math.abs(k);
      const cuerpo = (abs === 1 && v) ? v : abs + (v || '');
      if (!t.length) t.push((k < 0 ? '-' : '') + cuerpo);
      else t.push((k < 0 ? ' - ' : ' + ') + cuerpo);
    });
    return t.length ? t.join('') : '0';
  }
  /* Polinomio de segundo grado en la variable v */
  const cuad = (a, b, c, v = 'x') => poli([[a, v + '^2'], [b, v], [c, '']]);
  /* Binomio (k·v + m) */
  const bin = (k, m, v = 'x') => poli([[k, v], [m, '']]);
  /* Producto "k · algo" en el que k = 1 o −1 no se escribe */
  function por(k, algo) {
    if (k === 1) return algo;
    if (k === -1) return '-' + algo;
    return n(k) + algo;
  }

  /* Matrices */
  const matriz = (M, tipo = 'pmatrix', cel = n) =>
    `\\begin{${tipo}} ${M.map(f => f.map(cel).join(' & ')).join(' \\\\ ')} \\end{${tipo}}`;

  /* Divisores positivos de |k| */
  function divisores(k) {
    k = Math.abs(k); const r = [];
    for (let i = 1; i <= k; i++) if (k % i === 0) r.push(i);
    return r;
  }

  /* ---------- Bloques de solución reutilizables ---------- */

  /* Ecuación de segundo grado a·v² + b·v + c = 0 resuelta con la fórmula general.
     Devuelve { pasos, raices } con raíces como fracciones (vacío si Δ < 0). */
  function resolverCuadratica(a, b, c, v = 'x', opciones = {}) {
    const pasos = [];
    if (opciones.simplificar !== false) {
      if (a < 0) {
        a = -a; b = -b; c = -c;
        pasos.push({ t: 'Multiplicamos por −1 para que el coeficiente principal sea positivo:', m: `${cuad(a, b, c, v)} = 0` });
      }
      const g = mcd(mcd(a, b), c);
      if (g > 1) {
        a /= g; b /= g; c /= g;
        pasos.push({ t: `Dividimos entre ${g} para simplificar:`, m: `${cuad(a, b, c, v)} = 0` });
      }
    }
    pasos.push({ t: 'Identificamos los coeficientes:', m: `a = ${n(a)},\\quad b = ${n(b)},\\quad c = ${n(c)}` });
    const D = b * b - 4 * a * c;
    pasos.push({
      t: 'Aplicamos la fórmula general:',
      m: `${v} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} = \\frac{-${p(b)} \\pm \\sqrt{${p(b)}^2 - 4 \\cdot ${p(a)} \\cdot ${p(c)}}}{2 \\cdot ${p(a)}} = \\frac{${n(-b)} \\pm \\sqrt{${n(D)}}}{${n(2 * a)}}`
    });
    if (D < 0) {
      pasos.push({ t: `El discriminante es negativo (Δ = ${n(D).replace('-', '−')}), así que la ecuación no tiene soluciones reales.` });
      return { pasos, raices: [] };
    }
    const s = Math.round(Math.sqrt(D));
    if (s * s !== D) throw new Error('Discriminante no cuadrado');
    if (D === 0) {
      const r = fr(-b, 2 * a);
      const igual = r.n === -b && r.d === 2 * a;
      pasos.push({ t: 'Como Δ = 0, hay una solución doble:', m: `${v} = \\frac{${n(-b)}}{${n(2 * a)}}${igual ? '' : ' = ' + frac(r)}` });
      return { pasos, raices: [r] };
    }
    const r1 = fr(-b + s, 2 * a), r2 = fr(-b - s, 2 * a);
    const linea = (i, sg, r) => {
      const num = -b + sg * s;
      let m = `${v}_${i} = \\frac{${n(-b)} ${sg > 0 ? '+' : '-'} ${s}}{${n(2 * a)}} = \\frac{${n(num)}}{${n(2 * a)}}`;
      if (!(r.n === num && r.d === 2 * a)) m += ` = ${frac(r)}`;
      return m;
    };
    pasos.push({ t: `Como \\(\\sqrt{${D}} = ${s}\\):`, m: `${linea(1, 1, r1)} \\qquad ${linea(2, -1, r2)}` });
    return { pasos, raices: [r1, r2] };
  }

  /* Ecuación lineal k·v = r → v = r/k (se espera solución entera o fracción) */
  function despejeLineal(k, r, v) {
    const f = fr(r, k);
    if (k === 1) return { m: `${v} = ${n(r)}`, valor: f };
    if (k === -1) return { m: `-${v} = ${n(r)} \\;\\Rightarrow\\; ${v} = ${frac(f)}`, valor: f };
    return { m: `${n(k)}${v} = ${n(r)} \\;\\Rightarrow\\; ${v} = \\frac{${n(r)}}{${n(k)}} = ${frac(f)}`, valor: f };
  }

  /* ---------- Registro de fichas ---------- */
  const fichas = [];
  function registrarFicha(f) {
    f.ejercicios.forEach(e => { e.peso = e.peso || 1; e.columnas = e.columnas || 2; });
    fichas.push(f);
  }

  window.EX = {
    crearAzar, mcd, mcm, fr, esEntera,
    tex: { n, p, frac, fracP, poli, cuad, bin, por, matriz },
    divisores, resolverCuadratica, despejeLineal,
    registrarFicha, fichas
  };
})();
