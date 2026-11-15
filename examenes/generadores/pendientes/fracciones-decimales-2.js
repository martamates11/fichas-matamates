/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Fracciones y decimales (pendientes de 2.º ESO).
   Mismos criterios que la ficha pendientes/segundo/fracciones-decimales-2.html, con los
   ajustes pensados para hacer el examen sin calculadora (aplicados también en la ficha):
   en las sumas de fracciones y al ordenar, el m.c.m. de los denominadores no pasa de 60;
   no se usan fracciones que valen un número entero como dato ni sumas con los tres
   denominadores iguales; la división de decimales
   es exacta (cociente con dos decimales como mucho), y en el problema de la leche todos
   los datos se usan y el resultado es exacto. */
(function () {
  'use strict';
  const { tex, registrarFicha, fr, mcd, mcm, pend } = window.EX;
  const { n, frac } = tex;
  const { dec } = pend;

  const F = (a, b) => `\\frac{${a}}{${b}}`;                 // fracción tal cual, sin simplificar
  const sgn = s => (s > 0 ? '+' : '-');
  const mcmLista = l => l.reduce((a, b) => mcm(a, b), 1);
  /* Si la fracción a/b no está simplificada, añade «= simplificada» */
  const simpl = (a, b) => { const f = fr(a, b); return (f.n === a && f.d === b) ? '' : ` = ${frac(f)}`; };

  /* ================= 1. Fracción generatriz (banco de la ficha) ================= */
  /* [parte entera, cifras decimales no periódicas, periodo] */
  const BANCO = [
    ['0', '5', ''], ['0', '25', ''], ['0', '75', ''], ['0', '2', ''], ['0', '4', ''], ['0', '8', ''],
    ['0', '125', ''], ['0', '375', ''], ['0', '15', ''], ['1', '5', ''], ['2', '25', ''], ['3', '2', ''],
    ['0', '', '3'], ['0', '', '6'], ['0', '', '1'], ['0', '', '4'], ['0', '', '18'], ['0', '', '09'], ['1', '', '3'], ['2', '', '7'],
    ['0', '1', '6'], ['0', '2', '3'], ['0', '08', '3'], ['0', '1', '3'], ['0', '4', '5'], ['0', '58', '3'], ['0', '3', '6']
  ];
  function genGeneratriz(R) {
    const [e, a, p] = R.pick(BANCO);
    const num = `${e}{,}${a}${p ? `\\overline{${p}}` : ''}`;
    const pasos = [];
    let N, D;
    if (!p) {
      N = Number(e + a); D = Math.pow(10, a.length);
      pasos.push({ t: 'Decimal exacto: el numerador es el número sin la coma y el denominador, un 1 seguido de tantas cifras 0 como cifras decimales tiene.', m: `${num} = ${F(N, D)}${simpl(N, D)}` });
    } else if (!a) {
      const todo = Number(e + p), ent = Number(e);
      N = todo - ent; D = Number('9'.repeat(p.length));
      pasos.push({ t: `Periódico puro: en el numerador, el número sin la coma hasta el final del periodo menos la parte entera; en el denominador, tantos 9 como cifras tiene el periodo (${p.length}).`, m: `${num} = ${F(`${todo} - ${ent}`, D)} = ${F(N, D)}${simpl(N, D)}` });
    } else {
      const todo = Number(e + a + p), ante = Number(e + a);
      N = todo - ante; D = Number('9'.repeat(p.length) + '0'.repeat(a.length));
      pasos.push({ t: `Periódico mixto: en el numerador, el número sin la coma hasta el final del periodo menos la parte que hay antes del periodo; en el denominador, tantos 9 como cifras tiene el periodo seguidos de tantos 0 como cifras decimales no periódicas.`, m: `${num} = ${F(`${todo} - ${ante}`, D)} = ${F(N, D)}${simpl(N, D)}` });
    }
    if (mcd(N, D) > 1) pasos.push({ t: `Hemos simplificado dividiendo numerador y denominador entre ${mcd(N, D)}.` });
    return { enun: num, pasos, res: frac(fr(N, D)) };
  }

  /* ================= 2. Suma y resta de tres fracciones ================= */
  /* Ficha: numeradores 1–9, denominadores 2–10, signos al azar; resultado no entero ni nulo */
  const fracNoEntera = (R, dMax) => { let a, b; do { a = R.int(1, 9); b = R.int(2, dMax); } while (a % b === 0); return [a, b]; };
  function genSumaResta(R) {
    let fs, s2, s3, M, r;
    do {
      fs = [fracNoEntera(R, 10), fracNoEntera(R, 10), fracNoEntera(R, 10)];
      s2 = R.signo(); s3 = R.signo();
      M = mcmLista(fs.map(f => f[1]));
      r = fr(fs[0][0] * M / fs[0][1] + s2 * fs[1][0] * M / fs[1][1] + s3 * fs[2][0] * M / fs[2][1], M);
    } while (M > 60 || r.d === 1 || r.n === 0 || Math.abs(r.n) >= 150 || (fs[0][1] === fs[1][1] && fs[1][1] === fs[2][1]));
    const nums = fs.map(f => f[0] * M / f[1]);
    const enun = `${F(...fs[0])} ${sgn(s2)} ${F(...fs[1])} ${sgn(s3)} ${F(...fs[2])}`;
    const N = nums[0] + s2 * nums[1] + s3 * nums[2];
    return {
      enun,
      pasos: [
        { t: `Reducimos a común denominador: \\(\\text{m.c.m.}(${fs.map(f => f[1]).join(', ')}) = ${M}\\).`, m: `${F(nums[0], M)} ${sgn(s2)} ${F(nums[1], M)} ${sgn(s3)} ${F(nums[2], M)}` },
        { t: 'Sumamos y restamos los numeradores y simplificamos si se puede:', m: `${F(`${nums[0]} ${sgn(s2)} ${nums[1]} ${sgn(s3)} ${nums[2]}`, M)} = ${N < 0 ? '-' : ''}${F(Math.abs(N), M)}${simpl(Math.abs(N), M)}` }
      ],
      res: frac(r)
    };
  }

  /* ================= 3. Multiplicación y división de tres fracciones ================= */
  /* Ficha: numeradores 1–9, denominadores 2–9; se opera de izquierda a derecha */
  function operar(a, op, b, aTxt = frac(a)) {   // a, b: {n, d}; devuelve { m, r }
    if (op === '·') {
      const r = fr(a.n * b.n, a.d * b.d);
      return { m: `${aTxt} \\cdot ${F(b.n, b.d)} = ${F(`${a.n} \\cdot ${b.n}`, `${a.d} \\cdot ${b.d}`)} = ${F(a.n * b.n, a.d * b.d)}${simpl(a.n * b.n, a.d * b.d)}`, r };
    }
    const r = fr(a.n * b.d, a.d * b.n);
    return { m: `${aTxt} : ${F(b.n, b.d)} = ${aTxt} \\cdot ${F(b.d, b.n)} = ${F(a.n * b.d, a.d * b.n)}${simpl(a.n * b.d, a.d * b.n)}`, r };
  }
  function genMulDiv(R) {
    let fs, o1, o2, x, y;
    do {
      fs = [fracNoEntera(R, 9), fracNoEntera(R, 9), fracNoEntera(R, 9)].map(([a, b]) => ({ n: a, d: b }));
      o1 = R.pick(['·', ':']); o2 = R.pick(['·', ':']);
      x = operar(fs[0], o1, fs[1], F(fs[0].n, fs[0].d)); y = operar(x.r, o2, fs[2]);
    } while (y.r.d === 1 || y.r.n >= 300 || y.r.d >= 300);
    const T = o => (o === '·' ? '\\cdot' : ':');
    const enun = `${F(fs[0].n, fs[0].d)} ${T(o1)} ${F(fs[1].n, fs[1].d)} ${T(o2)} ${F(fs[2].n, fs[2].d)}`;
    return {
      enun,
      pasos: [
        { t: 'Operamos de izquierda a derecha. Para multiplicar, numerador por numerador y denominador por denominador; para dividir, multiplicamos por la inversa:', m: x.m },
        { t: 'Con el resultado, la segunda operación:', m: y.m },
      ],
      res: frac(y.r)
    };
  }

  /* ================= 4. Simplificar una fracción ================= */
  function genSimplificar(R) {
    const d0 = R.int(2, 10); let n0; do { n0 = R.int(1, d0 - 1); } while (mcd(n0, d0) !== 1);
    const k = R.int(2, 6), a = n0 * k, b = d0 * k;
    return {
      enun: F(a, b),
      pasos: [
        { t: `Dividimos numerador y denominador entre su máximo común divisor, \\(\\text{m.c.d.}(${a}, ${b}) = ${k}\\):`, m: `${F(a, b)} = ${F(`${a} : ${k}`, `${b} : ${k}`)} = ${F(n0, d0)}` }
      ],
      res: F(n0, d0)
    };
  }

  /* ================= 5. Ordenar cuatro fracciones ================= */
  /* Ficha: numeradores 1–12, denominadores 2–12, valores distintos; aquí (y en la ficha)
     con m.c.m. de los denominadores ≤ 60 para poder reducir a común denominador a mano. */
  function genOrdenar(R) {
    let it, M;
    do {
      it = []; const vistos = new Set();
      while (it.length < 4) {
        const a = R.int(1, 12), b = R.int(2, 12), v = (a / b).toFixed(4);
        if (a % b !== 0 && !vistos.has(v)) { vistos.add(v); it.push({ a, b, v: a / b }); }
      }
      M = mcmLista(it.map(x => x.b));
    } while (M > 60 || it.every((x, i) => i === 0 || it[i - 1].v < x.v));
    const orden = it.slice().sort((x, y) => x.v - y.v);
    const conv = x => `${F(x.a, x.b)} = ${F(x.a * M / x.b, M)}`;
    return {
      enun: it.map(x => F(x.a, x.b)).join(',\\quad '),
      pasos: [
        { t: `Reducimos a común denominador: \\(\\text{m.c.m.}(${[...new Set(it.map(x => x.b))].join(', ')}) = ${M}\\).`, m: it.map(conv).join('\\qquad ') },
        { t: 'Con el mismo denominador, es menor la fracción que tiene menor numerador:', m: orden.map(x => F(x.a * M / x.b, M)).join(' < ') }
      ],
      res: orden.map(x => F(x.a, x.b)).join(' < ')
    };
  }

  /* ================= Decimales (6–9) ================= */
  /* Decimal como en la ficha: entre min y max, con 1 a dMax cifras decimales */
  function decimal(R, min, max, dMax) {
    const k = Math.pow(10, R.int(1, dMax));
    return R.int(Math.round(min * k), Math.round(max * k)) / k;
  }
  const cifrasDec = x => { const s = String(x); return s.includes('.') ? s.split('.')[1].length : 0; };
  const sinComa = x => String(x).replace('.', '');

  /* 6. Suma y resta de tres decimales (ficha: 10–200, 1–100, 1–150, hasta tres decimales) */
  function genSumaDec(R) {
    const a = decimal(R, 10, 200, 3), b = decimal(R, 1, 100, 3), c = decimal(R, 1, 150, 3);
    const s2 = R.signo(), s3 = R.signo();
    const mil = x => Math.round(x * 1000);
    const r1 = (mil(a) + s2 * mil(b)) / 1000, r = (mil(a) + s2 * mil(b) + s3 * mil(c)) / 1000;
    return {
      enun: `${dec(a, 3)} ${sgn(s2)} ${dec(b, 3)} ${sgn(s3)} ${dec(c, 3)}`,
      pasos: [
        { t: 'Colocamos las comas en columna (completando con ceros) y operamos de izquierda a derecha:', m: `${dec(a, 3)} ${sgn(s2)} ${dec(b, 3)} = ${dec(r1, 3)}` },
        { m: `${dec(r1, 3)} ${sgn(s3)} ${dec(c, 3)} = ${dec(r, 3)}`, t: 'Después:' }
      ],
      res: dec(r, 3)
    };
  }

  /* 7. Multiplicación de decimales (ficha: 1–90 con hasta dos decimales por 1–20 con uno) */
  function genMultDec(R) {
    let a, b;
    do { a = decimal(R, 1, 90, 2); b = decimal(R, 1, 20, 1); } while (cifrasDec(a) + cifrasDec(b) === 0);
    const k = cifrasDec(a) + cifrasDec(b), P = Number(sinComa(a)) * Number(sinComa(b)), r = P / Math.pow(10, k);
    return {
      enun: `${dec(a)} \\cdot ${dec(b)}`,
      pasos: [
        { t: 'Multiplicamos como si fueran números enteros, sin las comas:', m: `${Number(sinComa(a))} \\cdot ${Number(sinComa(b))} = ${P}` },
        { t: `Entre los dos factores hay ${k} ${k === 1 ? 'cifra decimal' : 'cifras decimales'}, así que el resultado lleva ${k === 1 ? 'una' : k}:`, m: `${dec(a)} \\cdot ${dec(b)} = ${dec(r, 3)}` }
      ],
      res: dec(r, 3)
    };
  }

  /* 8. División de decimales: dividendo 10–990 con uno o dos decimales, divisor 1,1–8,9 con
     una cifra decimal. En la ficha el cociente se redondeaba a las centésimas; aquí (y ahora
     también en la ficha) la división es exacta, con dos decimales como mucho. */
  function genDivDec(R) {
    let k, m;
    do {
      do { k = R.int(11, 89); } while (k % 10 === 0);
      m = R.int(Math.ceil(10000 / k), Math.floor(990000 / k));
    } while ((k * m) % 10 !== 0 || (k * m) % 1000 === 0);
    const a = k * m / 1000, b = k / 10, q = m / 100;
    return {
      enun: `${dec(a)} : ${dec(b, 1)}`,
      pasos: [
        { t: 'Multiplicamos dividendo y divisor por 10 para que el divisor sea un número entero (el cociente no cambia):', m: `${dec(a)} : ${dec(b, 1)} = ${dec(a * 10, 1)} : ${k}` },
        { t: 'Dividimos; al bajar la primera cifra decimal del dividendo ponemos la coma en el cociente:', m: `${dec(a * 10, 1)} : ${k} = ${dec(q)}` }
      ],
      res: dec(q)
    };
  }

  /* 9. Redondeo (ficha: parte entera 1–900, redondeo a décimas, centésimas o milésimas) */
  const LUGAR = { 1: 'décimas', 2: 'centésimas', 3: 'milésimas' };
  function genRedondeo(R) {
    const ent = R.int(1, 900), l = R.int(1, 3);
    let cifras = ''; for (let i = 0; i <= l; i++) cifras += R.int(0, 9);
    const sig = Number(cifras[l]), k = Math.pow(10, l);
    let base = ent * k + Number(cifras.slice(0, l));
    if (sig >= 5) base++;
    const txt = `${Math.floor(base / k)}{,}${String(base % k).padStart(l, '0')}`;
    const num = `${ent}{,}${cifras}`;
    return {
      html: true,
      enun: `<span>\\(${num}\\) a las ${LUGAR[l]}</span>`,
      pasos: [
        { t: `Nos fijamos en la cifra siguiente a las ${LUGAR[l]}: es un ${sig}. ${sig >= 5 ? 'Como es 5 o más, la cifra de las ' + LUGAR[l] + ' sube una unidad' : 'Como es menor que 5, la cifra de las ' + LUGAR[l] + ' se queda igual'} y se suprimen las cifras siguientes.`, m: `${num} \\approx ${txt}` }
      ],
      res: txt
    };
  }

  /* ================= 10. Problemas ================= */
  const NOMBRES = ['Pablo', 'Marta', 'Lucía', 'Diego', 'Sara', 'Iván', 'Elena', 'Carlos', 'Ana', 'Rubén'];
  const FR_LECHE = [[1, 2], [1, 4], [3, 4], [1, 3], [2, 3], [1, 5], [2, 5], [3, 5], [1, 8], [3, 8], [1, 6], [5, 6]];
  function genProblema(R) {
    if (R.rand() < 0.5) {
      let d = R.pick([3, 4, 5, 6, 8, 10]), a = R.int(1, d - 1); const g = mcd(a, d); a /= g; d /= g;
      const kk = R.int(3, 25); let T = d * kk; if (T < 20) T = d * (kk + 5);
      const gasto = T * a / d, resto = T - gasto, quien = R.pick(NOMBRES);
      return {
        html: true,
        enun: `<span class="pend-texto">${quien} tiene ${T} € ahorrados. Si se gasta \\(${F(a, d)}\\) de sus ahorros, ¿cuántos euros le quedan?</span>`,
        pasos: [
          { t: 'Calculamos lo que se gasta: la fracción de la cantidad total.', m: `${F(a, d)} \\text{ de } ${T} = \\frac{${T} \\cdot ${a}}{${d}} = ${gasto} \\text{ €}` },
          { t: 'Lo restamos de lo que tenía:', m: `${T} - ${gasto} = ${resto} \\text{ €}` }
        ],
        res: `${resto}\\text{ €}`,
        resHtml: `Le quedan ${resto} €.`
      };
    }
    let f, N, per;
    do { f = R.pick(FR_LECHE); N = R.int(2, 6); per = R.pick([['una semana', 7], ['un mes (30 días)', 30]]); } while ((f[0] * N * per[1] * 100) % f[1] !== 0);
    const diario = fr(f[0] * N, f[1]), total = f[0] * N * per[1] / f[1];
    return {
      html: true,
      enun: `<span class="pend-texto">En una familia de ${N} personas, cada una toma \\(${F(f[0], f[1])}\\) de litro de leche al día. ¿Cuántos litros de leche necesita la familia para ${per[0]}?</span>`,
      pasos: [
        { t: 'Leche que toma la familia en un día:', m: `${N} \\cdot ${F(f[0], f[1])} = ${F(f[0] * N, f[1])}${simpl(f[0] * N, f[1])} \\text{ L}` },
        { t: `Para ${per[1]} días:`, m: `${frac(diario)} \\cdot ${per[1]} = ${dec(total)} \\text{ L}` }
      ],
      res: `${dec(total)}\\text{ L}`,
      resHtml: `Necesita \\(${dec(total)}\\) litros.`
    };
  }

  registrarFicha({
    id: 'pend2-fracciones-decimales',
    titulo: 'Fracciones y decimales',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/fracciones-decimales-2.html',
    ejercicios: [
      { id: 'generatriz', nombre: 'Fracción generatriz', peso: 0.75, columnas: 3,
        enunciado: ['Escribe la fracción generatriz de este número decimal:', 'Escribe la fracción generatriz de estos números decimales:'], generar: genGeneratriz },
      { id: 'sumaresta', nombre: 'Suma y resta de tres fracciones', peso: 1, columnas: 2,
        enunciado: ['Calcula y simplifica el resultado:', 'Calcula y simplifica el resultado:'], generar: genSumaResta },
      { id: 'muldiv', nombre: 'Multiplicación y división de tres fracciones', peso: 1, columnas: 2,
        enunciado: ['Calcula y simplifica el resultado:', 'Calcula y simplifica el resultado:'], generar: genMulDiv },
      { id: 'simplificar', nombre: 'Simplificar una fracción', peso: 0.5, columnas: 4,
        enunciado: ['Simplifica hasta obtener la fracción irreducible:', 'Simplifica hasta obtener la fracción irreducible:'], generar: genSimplificar },
      { id: 'ordenar', nombre: 'Ordenar cuatro fracciones', peso: 1, columnas: 1,
        enunciado: ['Ordena de menor a mayor:', 'Ordena de menor a mayor:'], generar: genOrdenar },
      { id: 'sumadec', nombre: 'Suma y resta de decimales', peso: 0.5, columnas: 2,
        enunciado: ['Calcula:', 'Calcula:'], generar: genSumaDec },
      { id: 'multdec', nombre: 'Multiplicación de decimales', peso: 0.5, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genMultDec },
      { id: 'divdec', nombre: 'División de decimales', peso: 0.75, columnas: 3,
        enunciado: ['Calcula el cociente exacto:', 'Calcula el cociente exacto:'], generar: genDivDec },
      { id: 'redondeo', nombre: 'Redondeo de decimales', peso: 0.5, columnas: 3,
        enunciado: ['Redondea:', 'Redondea:'], generar: genRedondeo },
      { id: 'problema', nombre: 'Problema con fracciones', peso: 1, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genProblema }
    ]
  });
})();
