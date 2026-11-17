/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Divisibilidad (pendientes de 1.º ESO).
   Tipos y rangos de la ficha interactiva pendientes/primero/divisibilidad-1.html, salvo
   lo indicado: la ficha usa listas fijas de 6-8 casos en «Divisores», «mcm», «MCD» y
   «Descomposición», y números de 2 a 10 en «Múltiplos». En el examen se amplían los datos
   (rangos indicados en cada ejercicio, siempre con cuentas hechas a mano) para que cada
   modelo sea distinto. Los ejercicios de elegir o marcar (múltiplo/divisor, tabla, primos)
   se adaptan a papel. */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { Lienzo } = pend;

  /* ---------- Utilidades ---------- */
  const lista = arr => arr.join(',\\ ');                 // 1,\ 2,\ 4 (comas con espacio, no decimales)
  const listaTxt = arr => arr.map(v => `\\(${v}\\)`).join(', ').replace(/, ([^,]*)$/, ' y $1');
  const esPrimo = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const mcd = (a, b) => (b ? mcd(b, a % b) : a);
  function factorizar(n) {
    const f = [];
    for (let p = 2; n > 1; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) f.push([p, e]); }
    return f;
  }
  const texFact = f => f.map(([p, e]) => (e > 1 ? `${p}^{${e}}` : `${p}`)).join(' \\cdot ');
  const divisores = n => { const r = []; for (let i = 1; i <= n; i++) if (n % i === 0) r.push(i); return r; };

  /* ================= 1. Múltiplo o divisor (ficha: a y b entre 2 y 8) ================= */
  function genRelacion(R) {
    const a = R.int(2, 8), b = R.int(2, 8), prod = a * b;
    const divisor = R.rand() < 0.5;
    const x = divisor ? a : prod, y = divisor ? prod : a;
    return {
      html: true,
      enun: `<span class="pend-texto">\\(${x}\\) es ______________ de \\(${y}\\).</span>`,
      pasos: [
        { t: `Dividimos el mayor entre el menor: la división es exacta.`, m: `${prod} : ${a} = ${b} \\qquad (${prod} = ${a} \\cdot ${b})` },
        { t: divisor
          ? `Como \\(${prod}\\) se puede dividir exactamente entre \\(${a}\\), el número \\(${a}\\) es <b>divisor</b> de \\(${prod}\\) (y \\(${prod}\\) es múltiplo de \\(${a}\\)).`
          : `Como \\(${prod}\\) se obtiene multiplicando \\(${a}\\) por un número natural, \\(${prod}\\) es <b>múltiplo</b> de \\(${a}\\) (y \\(${a}\\) es divisor de \\(${prod}\\)).` }
      ],
      res: `${x} \\text{ es ${divisor ? 'divisor' : 'múltiplo'} de } ${y}`
    };
  }

  /* ================= 2. Tres primeros múltiplos (ficha: número entre 2 y 10; aquí hasta 25) ================= */
  function genMultiplos(R) {
    const n = R.int(2, 25);
    return {
      enun: `${n}`,
      pasos: [
        { t: `Multiplicamos \\(${n}\\) por \\(1\\), \\(2\\) y \\(3\\):`, m: `${n} \\cdot 1 = ${n},\\quad ${n} \\cdot 2 = ${2 * n},\\quad ${n} \\cdot 3 = ${3 * n}` }
      ],
      res: lista([n, 2 * n, 3 * n])
    };
  }

  /* ================= 3. Divisores (ficha: 8, 10, 12, 15, 18 y 20; aquí compuestos entre 8 y 50) ================= */
  const COMPUESTOS_DIV = [];
  for (let k = 8; k <= 50; k++) if (!esPrimo(k)) COMPUESTOS_DIV.push(k);
  function genDivisores(R) {
    const n = R.pick(COMPUESTOS_DIV), d = divisores(n);
    const parejas = d.filter(x => x * x <= n).map(x => `${x} \\cdot ${n / x}`);
    return {
      enun: `${n}`,
      pasos: [
        { t: `Buscamos las parejas de números cuyo producto es \\(${n}\\), probando con \\(1, 2, 3, \\dots\\) hasta que se repitan:`, m: `${n} = ${parejas.join(' = ')}` },
        { t: 'Escribimos todos los números que aparecen, ordenados de menor a mayor.' }
      ],
      res: lista(d)
    };
  }

  /* ================= 4 y 5. mcm y MCD ================= */
  /* Ficha: 6 parejas fijas (mcm: 6-8, 4-6, 3-5, 10-15, 12-18, 8-12; MCD: 15-9, 12-18, 8-12,
     20-25, 14-21, 16-24). Aquí se generan parejas del mismo tipo: factor común g y cocientes
     p, q primos entre sí.
     mcm: g de 1 a 6, p y q de 2 a 7, números hasta 30 y mcm hasta 72.
     MCD: g de 2 a 8, p y q de 2 a 5, números hasta 40. */
  function pareja(R, gMin, gMax, pMax, tope, cond) {
    let a, b, g, p, q;
    do {
      g = R.int(gMin, gMax); p = R.int(2, pMax); q = R.int(2, pMax);
      a = g * p; b = g * q;
    } while (p === q || mcd(p, q) !== 1 || a > tope || b > tope || !cond(a, b, g * p * q));
    return [a, b];
  }
  function pasosFact(a, b) {
    return { t: 'Descomponemos los dos números en factores primos:', m: `${a} = ${texFact(factorizar(a))} \\qquad ${b} = ${texFact(factorizar(b))}` };
  }
  function genMcm(R) {
    const [a, b] = pareja(R, 1, 6, 7, 30, (x, y, m) => m <= 72);
    const fa = new Map(factorizar(a)), fb = new Map(factorizar(b));
    const primos = [...new Set([...fa.keys(), ...fb.keys()])].sort((x, y) => x - y);
    const f = primos.map(p => [p, Math.max(fa.get(p) || 0, fb.get(p) || 0)]);
    const m = a * b / mcd(a, b);
    return {
      enun: `\\text{mcm}(${a},\\ ${b})`,
      pasos: [
        pasosFact(a, b),
        { t: 'El mcm es el producto de los factores comunes y no comunes, cada uno con su mayor exponente:', m: `\\text{mcm}(${a},\\ ${b}) = ${texFact(f)} = ${m}` }
      ],
      res: `\\text{mcm}(${a},\\ ${b}) = ${m}`
    };
  }
  function genMcd(R) {
    const [a, b] = pareja(R, 2, 8, 5, 40, () => true);
    const fa = new Map(factorizar(a)), fb = new Map(factorizar(b));
    const f = [...fa.keys()].filter(p => fb.has(p)).sort((x, y) => x - y).map(p => [p, Math.min(fa.get(p), fb.get(p))]);
    const g = mcd(a, b);
    return {
      enun: `\\text{MCD}(${a},\\ ${b})`,
      pasos: [
        pasosFact(a, b),
        { t: 'El MCD es el producto de los factores comunes, cada uno con su menor exponente:', m: `\\text{MCD}(${a},\\ ${b}) = ${texFact(f)}${f.length > 1 || f[0][1] > 1 ? ` = ${g}` : ''}` }
      ],
      res: `\\text{MCD}(${a},\\ ${b}) = ${g}`
    };
  }

  /* ================= 6. Tabla de múltiplos de 2, 3 y 5 (ficha: tres números entre 5 y 34) ================= */
  const COLS = [52, 62, 62, 62], ALTO = 22;
  function tabla(nums, marcas) {
    const L = Lienzo(), W = COLS.reduce((s, c) => s + c, 0), H = ALTO * (nums.length + 1);
    const xs = COLS.reduce((acc, c) => (acc.push(acc[acc.length - 1] + c), acc), [0]);
    L.poligono([[0, 0], [W, 0], [W, ALTO], [0, ALTO]], { grosor: 1 });           // cabecera sombreada
    L.linea(0, H, W, H, { grosor: 1 }).linea(0, ALTO, 0, H, { grosor: 1 }).linea(W, ALTO, W, H, { grosor: 1 });
    for (let i = 2; i <= nums.length; i++) L.linea(0, i * ALTO, W, i * ALTO, { grosor: 0.8 });
    for (let j = 1; j < COLS.length; j++) L.linea(xs[j], 0, xs[j], H, { grosor: 0.8 });
    ['Número', 'Múlt. de 2', 'Múlt. de 3', 'Múlt. de 5'].forEach((s, j) => L.texto(xs[j] + COLS[j] / 2, ALTO / 2 + 4, s, { tam: 11, peso: 600 }));
    nums.forEach((n, i) => {
      const y = (i + 1) * ALTO + ALTO / 2 + 4.5;
      L.texto(COLS[0] / 2, y, n, { tam: 13 });
      if (marcas) marcas[i].forEach((v, j) => L.texto(xs[j + 1] + COLS[j + 1] / 2, y, v ? 'Sí' : 'No', { tam: 12, peso: v ? 600 : 400 }));
    });
    return L.cerrar('pend-fig', marcas ? 'Tabla de múltiplos completada' : 'Tabla de múltiplos');
  }
  function genTabla(R) {
    const nums = [];
    while (nums.length < 3) { const n = R.int(5, 34); if (!nums.includes(n)) nums.push(n); }
    const marcas = nums.map(n => [n % 2 === 0, n % 3 === 0, n % 5 === 0]);
    const sumas = nums.map(n => { const c = String(n).split(''); return c.length > 1 ? `${n} \\to ${c.join(' + ')} = ${c.reduce((s, x) => s + +x, 0)}` : `${n} \\to ${n}`; });
    const resumen = nums.map((n, i) => {
      const de = [2, 3, 5].filter((_, j) => marcas[i][j]);
      return `\\(${n}\\): ${de.length ? 'múltiplo de ' + de.join(', ').replace(/, (\d)$/, ' y $1') : 'no es múltiplo de ninguno'}`;
    }).join('; ');
    return {
      html: true,
      enun: `<div class="pend-col">${tabla(nums, null)}</div>`,
      pasos: [
        { t: 'Criterios: un número es múltiplo de \\(2\\) si acaba en cifra par; de \\(5\\), si acaba en \\(0\\) o en \\(5\\); y de \\(3\\), si la suma de sus cifras es múltiplo de \\(3\\). Sumamos las cifras:', m: sumas.join(' \\qquad ') },
        { t: 'Completamos la tabla:', html: tabla(nums, marcas) }
      ],
      res: nums.join(',\\ '),
      resHtml: resumen + '.'
    };
  }

  /* ================= 7. Primo o compuesto (ficha: primos hasta 47 y compuestos hasta 30) ================= */
  const PRIMOS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  const COMPUESTOS = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30];
  function genPrimos(R) {
    const nums = [];
    while (nums.length < 4) { const n = R.rand() < 0.5 ? R.pick(PRIMOS) : R.pick(COMPUESTOS); if (!nums.includes(n)) nums.push(n); }
    const lineas = nums.map(n => {
      if (!esPrimo(n)) { const s = factorizar(n)[0][0]; return `${n} = ${s} \\cdot ${n / s} \\;\\Rightarrow\\; \\text{compuesto}`; }
      const prueba = PRIMOS.filter(p => p * p <= n);
      return prueba.length
        ? `${n} \\text{ no es divisible entre } ${prueba.join(',\\ ').replace(/,\\ (\d+)$/, ' \\text{ ni } $1')} \\;\\Rightarrow\\; \\text{primo}`
        : `${n} \\text{ solo es divisible entre 1 y ${n}} \\;\\Rightarrow\\; \\text{primo}`;
    });
    const pr = nums.filter(esPrimo), co = nums.filter(n => !esPrimo(n));
    const resTxt = [pr.length ? `${pr.length > 1 ? 'primos' : 'primo'}: ${listaTxt(pr)}` : '', co.length ? `${co.length > 1 ? 'compuestos' : 'compuesto'}: ${listaTxt(co)}` : ''].filter(Boolean).join('; ');
    return {
      enun: lista(nums),
      pasos: [
        { t: 'Un número es primo si solo tiene dos divisores, el \\(1\\) y él mismo. Basta probar con los primos cuyo cuadrado no supera al número; si aparece otro divisor, es compuesto:', m: lineas[0] },
        ...lineas.slice(1).map(m => ({ t: '', m }))
      ],
      res: lista(nums),
      resHtml: resTxt.charAt(0).toUpperCase() + resTxt.slice(1) + '.'
    };
  }

  /* ================= 8. Descomposición factorial ================= */
  /* Ficha: 12, 18, 20, 24, 28, 30, 36 y 40. Aquí: números entre 12 y 150 cuyos factores primos
     son 2, 3, 5 o 7 (exponentes hasta 5), con al menos dos primos distintos. */
  const DESCOMPONIBLES = [];
  for (let k = 12; k <= 150; k++) {
    const f = factorizar(k);
    if (f.length >= 2 && f.every(([p, e]) => p <= 7 && e <= 5)) DESCOMPONIBLES.push(k);
  }
  function genDescomp(R) {
    const n = R.pick(DESCOMPONIBLES), filas = [];
    let x = n;
    factorizar(n).forEach(([p, e]) => { for (let i = 0; i < e; i++) { filas.push(`${x} & ${p}`); x /= p; } });
    filas.push('1 &');
    return {
      enun: `${n}`,
      pasos: [
        { t: 'Dividimos entre el menor primo posible (\\(2, 3, 5, 7, \\dots\\)) hasta llegar a \\(1\\):', m: `\\begin{array}{r|l} ${filas.join(' \\\\ ')} \\end{array}` },
        { t: 'Agrupamos los factores repetidos en potencias:', m: `${n} = ${texFact(factorizar(n))}` }
      ],
      res: `${n} = ${texFact(factorizar(n))}`
    };
  }

  registrarFicha({
    id: 'pend1-divisibilidad',
    titulo: 'Divisibilidad',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/divisibilidad-1.html',
    ejercicios: [
      { id: 'relacion', nombre: 'Múltiplo o divisor', peso: 0.5, columnas: 2,
        enunciado: ['Completa la frase con la palabra «múltiplo» o «divisor»:', 'Completa cada frase con la palabra «múltiplo» o «divisor»:'], generar: genRelacion },
      { id: 'multiplos', nombre: 'Tres primeros múltiplos', peso: 0.5, columnas: 3,
        enunciado: ['Escribe los tres primeros múltiplos de:', 'Escribe los tres primeros múltiplos de cada número:'], generar: genMultiplos },
      { id: 'divisores', nombre: 'Todos los divisores', peso: 0.75, columnas: 3,
        enunciado: ['Escribe todos los divisores de:', 'Escribe todos los divisores de cada número:'], generar: genDivisores },
      { id: 'mcm', nombre: 'Mínimo común múltiplo', peso: 1, columnas: 2,
        enunciado: ['Calcula, descomponiendo en factores primos:', 'Calcula, descomponiendo en factores primos:'], generar: genMcm },
      { id: 'mcd', nombre: 'Máximo común divisor', peso: 1, columnas: 2,
        enunciado: ['Calcula, descomponiendo en factores primos:', 'Calcula, descomponiendo en factores primos:'], generar: genMcd },
      { id: 'tabla', nombre: 'Tabla de múltiplos de 2, 3 y 5', peso: 0.75, columnas: 2,
        enunciado: ['Completa la tabla con «Sí» o «No»:', 'Completa cada tabla con «Sí» o «No»:'], generar: genTabla },
      { id: 'primos', nombre: 'Primo o compuesto', peso: 0.75, columnas: 2,
        enunciado: ['Indica si cada número es primo o compuesto y justifícalo:', 'Indica si cada número es primo o compuesto y justifícalo:'], generar: genPrimos },
      { id: 'descomposicion', nombre: 'Descomposición factorial', peso: 0.75, columnas: 3,
        enunciado: ['Descompón en factores primos:', 'Descompón en factores primos:'], generar: genDescomp }
    ]
  });
})();
