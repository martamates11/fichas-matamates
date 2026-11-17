/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Números decimales (pendientes de 1.º ESO).
   Mismos criterios que la ficha interactiva pendientes/primero/decimales-1.html, con estos ajustes
   para que se pueda hacer a mano y sin calculadora:
   - Escribe el número decimal: la ficha tiene 7 frases fijas; aquí se generan frases del mismo
     estilo (por cifras, «y N milésimas» o «y N centésimas») con la parte entera de 1 a 60.
     Se evitan los números terminados en 1 (uno, veintiuno…) para no tener que decidir entre
     «un/una/uno» en la redacción; las cifras decimales sí pueden ser 1 («una décima»).
   - Clasifica los decimales: el banco pasa de 8 a 24 números (5 por apartado, con al menos
     tres tipos distintos).
   - Suma y resta: números de uno o dos decimales (en la ficha, siempre dos con toFixed), la resta
     siempre positiva como en la ficha.
   - Multiplicación: factores con una cifra decimal, sin ser enteros (ficha: aleatorios con un decimal).
   - División: en la ficha el cociente se redondeaba a las centésimas; aquí la división es exacta
     (cociente con dos decimales como mucho), con dividendo de un decimal (1–51) y divisor de un
     decimal (0,5–5,5), sin divisores enteros.
   - Cambio de unidades: se evitan los múltiplos exactos de 1000 mL.
   - Transformar a unidad pequeña: la ficha admite 0 en la unidad mayor (0 km); aquí empieza en 1.
   - Problema de envases: en la ficha las cuatro frases se redondean hacia arriba, pero la de los
     vasos («¿cuántos vasos se pueden llenar?») pide redondear hacia abajo; aquí se corrige y las
     demás frases dicen «como mínimo». */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { dec } = pend;

  /* Entero con separador de miles fino a partir de 5 cifras (ortografía española), en TeX */
  const mil = x => { const s = String(x); return s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s; };
  /* Entero x que representa x / 10^d, escrito con exactamente d decimales: 3450, 2 → 34{,}50 */
  const fx = (x, d) => { const s = String(x).padStart(d + 1, '0'); return s.slice(0, -d) + '{,}' + s.slice(-d); };
  const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);

  /* ================= 1. Escribe el número decimal ================= */
  const UNI = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince',
    'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco',
    'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
  const DECS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const CENT = ['', '', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  const menos100 = k => (k < 30 ? UNI[k] : DECS[Math.floor(k / 10)] + (k % 10 ? ' y ' + UNI[k % 10] : ''));
  /* Número 1–999 en letra (fem: «doscientas…»); solo se usa con números que no acaban en 1 (salvo 11) */
  function palabras(k, fem) {
    if (k === 100) return 'cien';
    const c = Math.floor(k / 100), r = k % 100;
    const cs = c === 0 ? '' : c === 1 ? 'ciento' : (fem ? CENT[c].replace('ientos', 'ientas') : CENT[c]);
    return [cs, r ? menos100(r) : ''].filter(Boolean).join(' ');
  }
  const valido = k => k % 10 !== 1 || k % 100 === 11;
  function entero(R, max) { let e; do { e = R.int(1, max); } while (!valido(e)); return e; }
  const NOMBRE_ORDEN = ['', 'décima', 'centésima', 'milésima'];
  const unirY = partes => (partes.length > 1 ? partes.slice(0, -1).join(', ') + ' y ' + partes[partes.length - 1] : partes[0]);

  function genEscribe(R) {
    const forma = R.pick(['cifras', 'cifras', 'milesimas', 'centesimas']);
    let ent = entero(R, 60), partes = [], terminos = [], T;     // T: valor en milésimas
    if (forma === 'cifras') {
      if (R.rand() < 0.2) ent = 0;
      const L = R.int(1, 3), dig = [];
      for (let i = 1; i <= L; i++) dig.push(i === L ? R.int(1, 9) : R.int(0, 9));
      if (ent > 0) { partes.push(`${palabras(ent, false)} unidades`); terminos.push(String(ent)); }
      dig.forEach((d, i) => {
        if (d === 0) return;
        partes.push(d === 1 ? `una ${NOMBRE_ORDEN[i + 1]}` : `${palabras(d, true)} ${NOMBRE_ORDEN[i + 1]}s`);
        terminos.push(fx(d, i + 1));
      });
      T = ent * 1000 + dig.reduce((s, d, i) => s + d * Math.pow(10, 2 - i), 0);
    } else {
      const orden = forma === 'milesimas' ? 3 : 2;
      let m; do { m = R.int(1, orden === 3 ? 999 : 99); } while (!valido(m) || m % 10 === 0);
      partes.push(`${palabras(ent, false)} unidades`, `${palabras(m, true)} ${NOMBRE_ORDEN[orden]}s`);
      terminos.push(String(ent), fx(m, orden));
      T = ent * 1000 + m * (orden === 3 ? 1 : 10);
    }
    const res = dec(T / 1000, 3);
    return {
      html: true,
      enun: `<span class="pend-texto">${mayus(unirY(partes))}.</span>`,
      pasos: [
        { t: 'La parte entera se escribe antes de la coma. Después de la coma van, por este orden, las décimas (1.ª cifra), las centésimas (2.ª) y las milésimas (3.ª); si falta algún orden, se pone un 0.' },
        { t: 'Sumamos cada parte en su lugar:', m: `${terminos.join(' + ')} = ${res}` }
      ],
      res
    };
  }

  /* ================= 2. Clasifica los decimales ================= */
  const EX_ = 'decimal exacto', PP = 'periódico puro', PM = 'periódico mixto', IR = 'irracional';
  const BANCO = [
    ['2{,}333\\ldots', PP, 'el 3 se repite justo detrás de la coma'],
    ['0{,}272727\\ldots', PP, 'el periodo 27 empieza justo detrás de la coma'],
    ['1{,}666\\ldots', PP, 'el 6 se repite justo detrás de la coma'],
    ['0{,}142857142857\\ldots', PP, 'el periodo 142857 empieza justo detrás de la coma'],
    ['5{,}181818\\ldots', PP, 'el periodo 18 empieza justo detrás de la coma'],
    ['3{,}252525\\ldots', PP, 'el periodo 25 empieza justo detrás de la coma'],
    ['3{,}1666\\ldots', PM, 'hay una cifra (1) que no se repite antes del periodo (6)'],
    ['2{,}0151515\\ldots', PM, 'hay cifras (0) que no se repiten antes del periodo (15)'],
    ['0{,}8333\\ldots', PM, 'hay una cifra (8) que no se repite antes del periodo (3)'],
    ['1{,}2444\\ldots', PM, 'hay una cifra (2) que no se repite antes del periodo (4)'],
    ['4{,}05777\\ldots', PM, 'hay dos cifras (05) que no se repiten antes del periodo (7)'],
    ['0{,}91666\\ldots', PM, 'hay dos cifras (91) que no se repiten antes del periodo (6)'],
    ['0{,}75', EX_, 'tiene un número finito de cifras decimales'],
    ['0{,}5', EX_, 'tiene un número finito de cifras decimales'],
    ['3{,}125', EX_, 'tiene un número finito de cifras decimales'],
    ['12{,}4', EX_, 'tiene un número finito de cifras decimales'],
    ['0{,}008', EX_, 'tiene un número finito de cifras decimales'],
    ['1{,}05', EX_, 'tiene un número finito de cifras decimales'],
    ['\\pi = 3{,}14159\\ldots', IR, 'tiene infinitas cifras decimales sin ningún periodo'],
    ['\\sqrt{2} = 1{,}41421\\ldots', IR, 'es una raíz no exacta: infinitas cifras sin periodo'],
    ['\\sqrt{3} = 1{,}73205\\ldots', IR, 'es una raíz no exacta: infinitas cifras sin periodo'],
    ['\\sqrt{5} = 2{,}23606\\ldots', IR, 'es una raíz no exacta: infinitas cifras sin periodo'],
    ['\\sqrt{7} = 2{,}64575\\ldots', IR, 'es una raíz no exacta: infinitas cifras sin periodo'],
    ['\\sqrt{10} = 3{,}16227\\ldots', IR, 'es una raíz no exacta: infinitas cifras sin periodo']
  ];
  function genClasifica(R) {
    let it;
    do { it = R.shuffle(BANCO).slice(0, 5); } while (new Set(it.map(x => x[1])).size < 3);
    return {
      html: true,
      enun: `<span>${it.map(x => `\\(${x[0]}\\)`).join(';&nbsp;&nbsp; ')}</span>`,
      pasos: [
        { t: 'Decimal exacto: tiene un número finito de cifras decimales. Periódico puro: el periodo empieza justo detrás de la coma. Periódico mixto: antes del periodo hay cifras que no se repiten. Irracional: infinitas cifras decimales y sin periodo (raíces no exactas, \\(\\pi\\)…).' },
        { t: 'Clasificamos cada número:', html: `<div class="pend-col">${it.map(x => `<span>\\(${x[0]}\\): <b>${x[1]}</b> (${x[2]})</span>`).join('')}</div>` }
      ],
      res: it.map(x => `\\text{${x[1]}}`).join(';\\;'),
      resHtml: it.map(x => `\\(${x[0]}\\): ${x[1]}`).join('; ') + '.'
    };
  }

  /* ================= 3 y 4. Suma y resta de decimales ================= */
  /* Valores en centésimas; con 1 decimal son múltiplos de 10. Se rellena con ceros hasta
     la cifra decimal máxima para colocar las comas en columna. */
  function sumaResta(R, esResta) {
    const dA = R.rand() < 0.3 ? 1 : 2, dB = R.rand() < 0.3 ? 1 : 2;
    /* Valor en centésimas entre lo y hi con exactamente dd cifras decimales */
    const val = (lo, hi, dd) => {
      let v;
      do { v = dd === 1 ? R.int(Math.ceil(lo / 10), Math.floor(hi / 10)) * 10 : R.int(lo, hi); }
      while (dd === 1 ? v % 100 === 0 : v % 10 === 0);
      return v;
    };
    const A = esResta ? val(2001, 11999, dA) : val(101, 9999, dA);
    const B = esResta ? val(101, A - 500, dB) : val(101, 9999, dB);
    const d = (dA === 2 || dB === 2) ? 2 : 1, k = d === 2 ? 1 : 10;      // escala común
    const a = A / k, b = B / k, r = esResta ? a - b : a + b;
    const op = esResta ? '-' : '+';
    return {
      enun: `${dec(A / 100, dA)} ${op} ${dec(B / 100, dB)}`,
      pasos: [
        { t: `Colocamos las comas en columna (completando con ceros) y ${esResta ? 'restamos' : 'sumamos'} cifra a cifra, como con números enteros${esResta ? ' (llevando cuando haga falta)' : ''}:`,
          m: `\\begin{array}{cr} & ${fx(a, d)} \\\\ ${op} & ${fx(b, d)} \\\\ \\hline & ${fx(r, d)} \\end{array}` }
      ],
      res: dec(r / Math.pow(10, d), d)
    };
  }
  const genSuma = R => sumaResta(R, false);
  const genResta = R => sumaResta(R, true);

  /* ================= 5. Multiplicación ================= */
  function sinMultiploDe10(R, lo, hi) { let v; do { v = R.int(lo, hi); } while (v % 10 === 0); return v; }
  function genMult(R) {
    const A = sinMultiploDe10(R, 11, 199), B = sinMultiploDe10(R, 11, 99);
    const P = A * B, r = dec(P / 100, 2), exacto = fx(P, 2);
    return {
      enun: `${dec(A / 10, 1)} \\cdot ${dec(B / 10, 1)}`,
      pasos: [
        { t: 'Multiplicamos como si fueran números enteros (sin las comas):', m: `${A} \\cdot ${B} = ${mil(P)}` },
        { t: 'Entre los dos factores hay 2 cifras decimales, así que en el resultado separamos 2 cifras con la coma:', m: `${dec(A / 10, 1)} \\cdot ${dec(B / 10, 1)} = ${exacto}${exacto === r ? '' : ` = ${r}`}` }
      ],
      res: r
    };
  }

  /* ================= 6. División ================= */
  /* Dividendo A/10 (1–51) y divisor k/10 (0,5–5,5), con cociente exacto de ≤ 2 decimales */
  function genDiv(R) {
    let A, k;
    do {
      k = R.int(5, 55); A = R.int(10, 510);
    } while (k % 10 === 0 || A % 10 === 0 || A < k || (100 * A) % k !== 0 || (A % k === 0 && R.rand() < 0.6));
    const q = A / k, a = A / 10, b = k / 10;
    return {
      enun: `${dec(a, 1)} : ${dec(b, 1)}`,
      pasos: [
        { t: 'Multiplicamos dividendo y divisor por 10 para que el divisor sea un número entero (el cociente no cambia):', m: `${dec(a, 1)} : ${dec(b, 1)} = ${A} : ${k}` },
        { t: A % k === 0 ? 'Dividimos:' : 'Dividimos; cuando se acaban las cifras enteras del dividendo, ponemos la coma en el cociente y seguimos bajando ceros:', m: `${A} : ${k} = ${dec(q, 2)}` }
      ],
      res: dec(q, 2)
    };
  }

  /* ================= 7. Cambio de unidades (mL → L) ================= */
  function genMlL(R) {
    let ml; do { ml = R.int(100, 5099); } while (ml % 1000 === 0);
    const L = dec(ml / 1000, 3);
    return {
      enun: `${ml}\\ \\text{mL} = \\ ?\\ \\text{L}`,
      pasos: [
        { t: 'Como \\(1\\ \\text{L} = 1000\\ \\text{mL}\\), para pasar de mL a L dividimos entre 1000: la coma se desplaza 3 lugares hacia la izquierda.', m: `${ml} : 1000 = ${L}` }
      ],
      res: `${L}\\ \\text{L}`,
      resHtml: `\\(${ml}\\ \\text{mL} = ${L}\\ \\text{L}\\)`
    };
  }

  /* ================= 8. Transformar a unidad pequeña ================= */
  const TIPOS_UNIDAD = [
    { u: ['km', 'hm', 'dam', 'm'], dest: 'cm', f: [100000, 10000, 1000, 100] },
    { u: ['km', 'hm', 'dam', 'm'], dest: 'mm', f: [1000000, 100000, 10000, 1000] },
    { u: ['kg', 'hg', 'dag', 'g'], dest: 'mg', f: [1000000, 100000, 10000, 1000] },
    { u: ['kg', 'hg', 'dag', 'g'], dest: 'cg', f: [100000, 10000, 1000, 100] },
    { u: ['kL', 'hL', 'daL', 'L'], dest: 'mL', f: [1000000, 100000, 10000, 1000] },
    { u: ['kL', 'hL', 'daL', 'L'], dest: 'cL', f: [100000, 10000, 1000, 100] }
  ];
  function genUnidades(R) {
    const t = R.pick(TIPOS_UNIDAD);
    const v = [R.int(1, 4), R.int(0, 8), R.int(0, 8), R.int(0, 8)];
    const partes = v.map((x, i) => x * t.f[i]);
    const total = partes.reduce((s, x) => s + x, 0);
    const txt = v.map((x, i) => `${x}\\ \\text{${t.u[i]}}`).join('\\ ');
    const lineas = v.map((x, i) => `${x}\\ \\text{${t.u[i]}} &= ${x} \\cdot ${mil(t.f[i])}\\ \\text{${t.dest}} = ${mil(partes[i])}\\ \\text{${t.dest}}`).join(' \\\\ ');
    return {
      enun: `${txt} \\;\\to\\; \\text{${t.dest}}`,
      pasos: [
        { t: `Pasamos cada cantidad a ${t.dest}: cada escalón entre unidades vale 10, así que se multiplica por 10 por cada escalón (\\(\\text{${t.u[0]}}\\) a \\(\\text{${t.dest}}\\): ${mil(t.f[0]).replace(/\\,/g, ' ')}).`, m: `\\begin{aligned} ${lineas} \\end{aligned}`, multilinea: true },
        { t: 'Sumamos:', m: `${partes.map(mil).join(' + ')} = ${mil(total)}\\ \\text{${t.dest}}` }
      ],
      res: `${mil(total)}\\ \\text{${t.dest}}`
    };
  }

  /* ================= 9. Problema de envases ================= */
  const PLANTILLAS = [
    { s: 'bote', p: 'botes', suelo: false, f: (c, T) => `¿Cuántos botes de ${c} mL de zumo de naranja se necesitan, como mínimo, para obtener ${T} L?` },
    { s: 'jarra', p: 'jarras', suelo: false, f: (c, T) => `Una jarra tiene una capacidad de ${c} mL. ¿Cuántas jarras llenas hacen falta, como mínimo, para llenar un depósito de ${T} L?` },
    { s: 'vaso', p: 'vasos', suelo: true, f: (c, T) => `Cada vaso contiene ${c} mL de agua. ¿Cuántos vasos se pueden llenar del todo con una botella de ${T} L?` },
    { s: 'bote', p: 'botes', suelo: false, f: (c, T) => `Un bote de refresco tiene ${c} mL. ¿Cuántos botes hacen falta, como mínimo, para reunir ${T} L de refresco?` }
  ];
  function genEnvases(R) {
    const pl = R.pick(PLANTILLAS), cap = R.pick([250, 330, 500, 750, 1000, 1500, 2000]), tot = R.pick([2, 3, 5, 8, 10, 12, 15]);
    const T = tot * 1000, q = Math.floor(T / cap), resto = T % cap;
    const sol = pl.suelo || resto === 0 ? q : q + 1;
    const nom = x => (x === 1 ? pl.s : pl.p);
    const conclusion = resto === 0
      ? `La división es exacta: ${q} ${nom(q)}.`
      : pl.suelo
        ? `Quedan ${resto} mL, que no llenan otro ${pl.s} entero: se llenan ${q} ${nom(q)}.`
        : `Con ${q} ${nom(q)} todavía faltan ${resto} mL por cubrir, así que hace falta uno más: ${sol} ${nom(sol)}.`;
    return {
      html: true,
      enun: `<span class="pend-texto">${pl.f(cap, tot)}</span>`,
      pasos: [
        { t: 'Pasamos los litros a mililitros (\\(1\\ \\text{L} = 1000\\ \\text{mL}\\)):', m: `${tot}\\ \\text{L} = ${mil(T)}\\ \\text{mL}` },
        { t: 'Dividimos la cantidad total entre la capacidad de cada envase:', m: `${mil(T)} : ${cap} = ${q}${resto ? `\\ \\text{ (resto } ${resto}\\text{)}` : ''}` },
        { t: conclusion }
      ],
      res: String(sol),
      resHtml: `${pl.suelo ? 'Se pueden llenar' : 'Hacen falta'} \\(${sol}\\) ${nom(sol)}.`
    };
  }

  registrarFicha({
    id: 'pend1-decimales',
    titulo: 'Números decimales',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/decimales-1.html',
    ejercicios: [
      { id: 'escribe', nombre: 'Escribe el número decimal', peso: 0.5, columnas: 2,
        enunciado: ['Escribe con cifras el siguiente número decimal:', 'Escribe con cifras los siguientes números decimales:'], generar: genEscribe },
      { id: 'clasifica', nombre: 'Clasifica los decimales', peso: 1, columnas: 1,
        enunciado: ['Clasifica estos números en decimal exacto, periódico puro, periódico mixto o irracional:', 'Clasifica estos números en decimal exacto, periódico puro, periódico mixto o irracional:'], generar: genClasifica },
      { id: 'suma', nombre: 'Suma de decimales', peso: 0.5, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genSuma },
      { id: 'resta', nombre: 'Resta de decimales', peso: 0.5, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genResta },
      { id: 'mult', nombre: 'Multiplicación de decimales', peso: 0.5, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genMult },
      { id: 'div', nombre: 'División de decimales', peso: 0.75, columnas: 3,
        enunciado: ['Calcula el cociente exacto:', 'Calcula el cociente exacto:'], generar: genDiv },
      { id: 'mlL', nombre: 'Cambio de unidades (mL a L)', peso: 0.5, columnas: 3,
        enunciado: ['Expresa en litros:', 'Expresa en litros:'], generar: genMlL },
      { id: 'unidades', nombre: 'Transformar a la unidad pequeña', peso: 0.75, columnas: 2,
        enunciado: ['Convierte a la unidad indicada:', 'Convierte a la unidad indicada:'], generar: genUnidades },
      { id: 'envases', nombre: 'Problema: envases y litros', peso: 1, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genEnvases }
    ]
  });
})();
