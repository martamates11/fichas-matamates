/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Números reales (pendientes de 3.º ESO).
   Los números se generan con los mismos criterios que la ficha interactiva
   pendientes/tercero/reales-3.html, con estos cambios (solo en el examen, la ficha no los
   tiene) pensados para hacerlo sin calculadora:
   - Suma de tres fracciones: el común denominador es el m.c.m. (la ficha usa el producto de
     los denominadores) y se limita a m.c.m. <= 120.
   - Decimales periódicos en forma canónica: periodo de 1 o 2 cifras sin acabar en 0, sin todo
     nueves y sin poderse acortar (no «33»); en los mixtos, anteperiodo de 1 o 2 cifras cuya
     última cifra no coincide con la del periodo (la ficha usa 1 cifra de 1 a 9).
   - Las fracciones que hay que clasificar no son enteras (la ficha podría dar 4/2).
   - Problema de la pizza: las fracciones que se comen son irreducibles.
   - Redondeo: la última cifra decimal no es 0 y el resultado se calcula con aritmética
     exacta (la ficha usa coma flotante). */
(function () {
  'use strict';
  const { tex, registrarFicha, pend, fr, mcd, mcm } = window.EX;
  const { n, frac } = tex;
  const { Lienzo } = pend;

  const abs = Math.abs;
  /* Fracción tal cual (sin simplificar), con el signo delante */
  const fraw = (a, b) => ((a < 0) !== (b < 0) ? '-' : '') + `\\frac{${abs(a)}}{${abs(b)}}`;
  const fs = (a, b) => frac(fr(a, b));                                   // simplificada
  const igualSimp = (a, b) => { const f = fr(a, b); return f.n === a && f.d === b; };
  /* «= simplificada» solo si cambia algo */
  const yaSimp = (a, b) => (igualSimp(a, b) ? '' : ` = ${fs(a, b)}`);
  const digitos = (R, k) => { let s = ''; for (let i = 0; i < k; i++) s += R.int(0, 9); return s; };
  const listaY = arr => arr.join(', ').replace(/, ([^,]*)$/, ' y $1');

  /* ---------- Decimales periódicos canónicos ---------- */
  /* Periodo de 1 o 2 cifras, que no acaba en 0, no es todo nueves y no se puede acortar (no «33») */
  function periodo(R) {
    let P;
    do {
      P = digitos(R, R.int(1, 2));
      if (P.endsWith('0')) P = P.slice(0, -1) + R.int(1, 9);
    } while (/^9+$/.test(P) || (P.length === 2 && P[0] === P[1]));
    return P;
  }
  /* Parte no periódica (1 o 2 cifras) cuya última cifra no coincide con la última del periodo */
  function anteperiodo(R, P) {
    let N;
    do { N = digitos(R, R.int(1, 2)); } while (N[N.length - 1] === P[P.length - 1]);
    return N;
  }
  const texPuro = (E, P) => `${E}{,}\\overline{${P}}`;
  const texMixto = (E, N, P) => `${E}{,}${N}\\overline{${P}}`;

  /* ================= 1. Clasificar números ================= */
  const CONJ = { N: '\\mathbb{N}', Z: '\\mathbb{Z}', Q: '\\mathbb{Q}', I: '\\mathbb{I}' };
  const IRRACIONALES = ['\\pi', '\\sqrt{2}', '\\sqrt{3}', '\\sqrt{5}', '\\sqrt{6}', '\\sqrt{7}', '\\sqrt{10}', '1{,}101001000100001\\ldots'];
  const CATEGORIAS = ['natural', 'entero', 'decimalExacto', 'periodicoPuro', 'periodicoMixto', 'fraccion', 'irracional'];
  function genClasificar(R, i) {
    const cat = CATEGORIAS[(i + R.int(0, 6)) % CATEGORIAS.length];
    let num, conj, t;
    switch (cat) {
      case 'natural': {
        const k = R.int(1, 90); num = n(k); conj = ['N', 'Z', 'Q'];
        t = `\\(${k}\\) es un número natural (positivo y sin decimales); por eso también es entero y racional (se puede escribir como \\(\\frac{${k}}{1}\\)).`;
        break;
      }
      case 'entero': {
        const k = -R.int(1, 50); num = n(k); conj = ['Z', 'Q'];
        t = `\\(${k}\\) es un entero negativo: no es natural, pero sí racional (se puede escribir como \\(-\\frac{${-k}}{1}\\)).`;
        break;
      }
      case 'decimalExacto': {
        let D = digitos(R, R.int(1, 3));
        if (D.endsWith('0')) D = D.slice(0, -1) + R.int(1, 9);
        num = `${R.int(0, 19)}{,}${D}`; conj = ['Q'];
        t = 'Es un decimal exacto (tiene un número finito de cifras decimales), así que es racional. No es entero porque tiene parte decimal.';
        break;
      }
      case 'periodicoPuro': {
        num = texPuro(R.int(0, 9), periodo(R)); conj = ['Q'];
        t = 'Es un decimal periódico puro (el periodo empieza justo después de la coma). Todo decimal periódico se puede escribir como fracción: es racional.';
        break;
      }
      case 'periodicoMixto': {
        const P = periodo(R);
        num = texMixto(R.int(0, 9), anteperiodo(R, P), P); conj = ['Q'];
        t = 'Es un decimal periódico mixto (hay cifras entre la coma y el periodo). Todo decimal periódico se puede escribir como fracción: es racional.';
        break;
      }
      case 'fraccion': {
        let a, b;
        do { a = R.nz(-10, 9); b = R.int(2, 10); } while (a % b === 0);   // que no sea un entero disfrazado
        num = fraw(a, b); conj = ['Q'];
        t = `Es una fracción de enteros que no da un número entero (${abs(a)} no es múltiplo de ${b}): es racional, pero no entera.`;
        break;
      }
      default: {
        num = R.pick(IRRACIONALES); conj = ['I'];
        t = 'Tiene infinitas cifras decimales que no se repiten de forma periódica, así que no se puede escribir como fracción: es irracional.';
      }
    }
    const res = conj.map(c => CONJ[c]).join(',\\ ');
    return {
      enun: num,
      pasos: [{ t }, { t: 'Pertenece a:', m: res }],
      res
    };
  }

  /* ================= 2. Fracción en la recta ================= */
  const U = 66;                                   // px de modelo por unidad (la recta va de −1 a 1)
  function recta(d, k) {
    const L = Lienzo();
    L.linea(-U - 12, 0, U + 12, 0, { grosor: 1.3 });
    L.linea(U + 12, 0, U + 5, -4, { grosor: 1.3 }).linea(U + 12, 0, U + 5, 4, { grosor: 1.3 });
    L.linea(-U - 12, 0, -U - 5, -4, { grosor: 1.3 }).linea(-U - 12, 0, -U - 5, 4, { grosor: 1.3 });
    if (k !== null) for (let j = -d + 1; j < d; j++) if (j) L.linea(j * U / d, -3.5, j * U / d, 3.5, { grosor: 0.9 });
    [-1, 0, 1].forEach(v => {
      L.linea(v * U, -6, v * U, 6, { grosor: 1.5 });
      L.texto(v * U, 22, v < 0 ? '−1' : String(v), { tam: 13 });
    });
    if (k !== null) {
      const x = k * U / d;
      L.punto(x, 0, 3.2);
      /* fracción apilada encima del punto */
      if (k < 0) L.texto(x - 9, -17, '−', { tam: 12, peso: 600 });
      L.texto(x, -24, String(abs(k)), { tam: 11, peso: 600 });
      L.linea(x - 5, -20, x + 5, -20, { grosor: 1 });
      L.texto(x, -9, String(d), { tam: 11, peso: 600 });
    } else L.texto(0, -24, ' ', { tam: 11 });       // reserva el mismo alto en el examen
    return L.cerrar('pend-recta', k !== null ? 'Recta numérica con la fracción representada' : 'Recta numérica de −1 a 1');
  }
  function genRecta(R) {
    const d0 = R.pick([2, 3, 4, 5, 6]);
    let k0; do { k0 = R.int(-d0, d0); } while (k0 === 0 || abs(k0) === d0);
    const f = fr(k0, d0), k = f.n, d = f.d;          // la ficha muestra la fracción simplificada
    return {
      html: true,
      enun: `<div class="pend-col"><span>\\(\\displaystyle ${frac(f)}\\)</span>${recta(d, null)}</div>`,
      pasos: [
        { t: `El denominador es ${d}: dividimos cada unidad en ${d} partes iguales.` },
        { t: `El numerador indica cuántas partes contamos desde el 0: ${abs(k)} hacia la ${k < 0 ? 'izquierda' : 'derecha'}${k < 0 ? ', porque es negativa' : ''}.`, html: recta(d, k) }
      ],
      res: frac(f),
      resHtml: `\\(${frac(f)}\\) está entre \\(${k < 0 ? '-1' : '0'}\\) y \\(${k < 0 ? '0' : '1'}\\), en la marca ${abs(k)} de ${d} ${k < 0 ? 'a la izquierda' : 'a la derecha'} del 0.`
    };
  }

  /* ================= 3. Comparar fracciones ================= */
  function genComparar(R) {
    const s = R.signo();
    const d1 = R.int(2, 11); let d2; do { d2 = R.int(2, 11); } while (d2 === d1);
    const a = s * R.int(1, 7), b = s * R.int(1, 7);
    const M = mcm(d1, d2), A = a * M / d1, B = b * M / d2;
    const sig = A === B ? '=' : A > B ? '>' : '<';
    const f1 = fraw(a, d1), f2 = fraw(b, d2);
    return {
      enun: `${f1} \\;\\square\\; ${f2}`,
      pasos: [
        { t: `Reducimos a común denominador: m.c.m.(${d1}, ${d2}) = ${M}.`, m: `${f1} = ${fraw(A, M)} \\qquad ${f2} = ${fraw(B, M)}` },
        { t: s < 0 ? 'Con el mismo denominador, comparamos los numeradores (son negativos: es mayor el que está más cerca del 0):' : 'Con el mismo denominador, es mayor la que tiene mayor numerador:', m: `${n(A)} ${sig} ${n(B)} \\;\\Rightarrow\\; ${f1} ${sig} ${f2}` }
      ],
      res: `${f1} ${sig} ${f2}`
    };
  }

  /* ================= 4. Suma y resta de tres fracciones ================= */
  const DEN4 = [2, 3, 4, 5, 6, 8, 9, 10];
  function genSuma3(R) {
    let d, M;
    do { d = R.shuffle(DEN4).slice(0, 3); M = mcm(mcm(d[0], d[1]), d[2]); } while (M > 120);
    const nu = [R.int(1, 9), R.int(1, 9), R.int(1, 9)], op = [R.pick(['+', '-']), R.pick(['+', '-'])];
    const t = nu.map((x, j) => x * M / d[j]);
    const num = t[0] + (op[0] === '+' ? t[1] : -t[1]) + (op[1] === '+' ? t[2] : -t[2]);
    const enun = `\\frac{${nu[0]}}{${d[0]}} ${op[0]} \\frac{${nu[1]}}{${d[1]}} ${op[1]} \\frac{${nu[2]}}{${d[2]}}`;
    const final = num === 0 ? '0' : fraw(num, M) + yaSimp(num, M);
    return {
      enun,
      pasos: [
        { t: `Común denominador: m.c.m.(${d.join(', ')}) = ${M}. Cada numerador se multiplica por lo mismo que su denominador:`, m: `\\frac{${t[0]}}{${M}} ${op[0]} \\frac{${t[1]}}{${M}} ${op[1]} \\frac{${t[2]}}{${M}}` },
        { t: 'Operamos los numeradores y simplificamos si se puede:', m: `\\frac{${t[0]} ${op[0]} ${t[1]} ${op[1]} ${t[2]}}{${M}} = ${final}` }
      ],
      res: fs(num, M)
    };
  }

  /* ================= 5. Multiplicación y división de fracciones ================= */
  function genMultDiv(R) {
    const a = R.int(1, 9), b = R.int(2, 10), c = R.int(1, 9), d = R.int(2, 10);
    const mult = R.rand() < 0.5;
    const N = mult ? a * c : a * d, D = mult ? b * d : b * c;
    const enun = `\\frac{${a}}{${b}} ${mult ? '\\cdot' : ':'} \\frac{${c}}{${d}}`;
    return {
      enun,
      pasos: mult
        ? [{ t: 'Se multiplican los numeradores entre sí y los denominadores entre sí; después se simplifica:', m: `\\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = \\frac{${N}}{${D}}${yaSimp(N, D)}` }]
        : [{ t: 'Dividir es multiplicar en cruz (por la inversa de la segunda fracción); después se simplifica:', m: `\\frac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = \\frac{${N}}{${D}}${yaSimp(N, D)}` }],
      res: fs(N, D)
    };
  }

  /* ================= 6. Decimal a fracción ================= */
  const nueves = k => '9'.repeat(k);
  function genDecimal(R, i) {
    const tipo = ['exacto', 'puro', 'mixto'][(i + R.int(0, 2)) % 3];
    const E = R.int(0, 8);
    if (tipo === 'exacto') {
      let D = digitos(R, R.int(1, 2));
      if (D.endsWith('0')) D = D.slice(0, -1) + R.int(1, 9);
      const num = parseInt(`${E}${D}`, 10), den = Math.pow(10, D.length);
      return {
        enun: `${E}{,}${D}`,
        pasos: [{ t: `Decimal exacto: el número sin la coma, partido por un 1 seguido de tantos ceros como cifras decimales (${D.length}):`, m: `${E}{,}${D} = \\frac{${num}}{${den}}${yaSimp(num, den)}` }],
        res: fs(num, den)
      };
    }
    const P = periodo(R);
    if (tipo === 'puro') {
      const EP = parseInt(`${E}${P}`, 10), num = EP - E, den = parseInt(nueves(P.length), 10);
      return {
        enun: texPuro(E, P),
        pasos: [
          { t: `Periódico puro: en el numerador, el número sin la coma menos la parte entera; en el denominador, tantos nueves como cifras tiene el periodo (${P.length}):`, m: `${texPuro(E, P)} = \\frac{${EP} - ${E}}{${den}} = \\frac{${num}}{${den}}${yaSimp(num, den)}` }
        ],
        res: fs(num, den)
      };
    }
    const N = anteperiodo(R, P);
    const ENP = parseInt(`${E}${N}${P}`, 10), EN = parseInt(`${E}${N}`, 10), num = ENP - EN;
    const den = parseInt(nueves(P.length) + '0'.repeat(N.length), 10);
    return {
      enun: texMixto(E, N, P),
      pasos: [
        { t: `Periódico mixto: en el numerador, el número sin la coma menos la parte que no se repite (${EN}); en el denominador, tantos nueves como cifras del periodo (${P.length}) seguidos de tantos ceros como cifras del anteperiodo (${N.length}):`, m: `${texMixto(E, N, P)} = \\frac{${ENP} - ${EN}}{${den}} = \\frac{${num}}{${den}}${yaSimp(num, den)}` }
      ],
      res: fs(num, den)
    };
  }

  /* ================= 7. Redondeo ================= */
  const LUGARES = [['décimas', 1], ['centésimas', 2], ['milésimas', 3]];
  /* Entero q con p decimales → TeX con coma */
  const conComa = (q, p) => { const s = String(q).padStart(p + 1, '0'); return `${s.slice(0, -p)}{,}${s.slice(-p)}`; };
  function genRedondeo(R, i) {
    const E = R.int(1, 90);
    const dec = digitos(R, 3) + R.int(1, 9);            // la última cifra no es 0
    const [lugar, p] = LUGARES[(i + R.int(0, 2)) % 3];
    const total = E * 10000 + parseInt(dec, 10);
    const div = Math.pow(10, 4 - p);
    const sig = parseInt(dec[p], 10);
    const q = Math.floor(total / div) + (sig >= 5 ? 1 : 0);
    const numero = `${E}{,}${dec}`, r = conComa(q, p);
    return {
      html: true,
      enun: `\\(${numero}\\) a las ${lugar}`,
      pasos: [
        { t: `Para redondear a las ${lugar} nos quedamos con ${p === 1 ? 'una cifra decimal' : p + ' cifras decimales'} y miramos la siguiente, que es un ${sig}.` },
        { t: sig >= 5 ? 'Como es 5 o más, la última cifra que se conserva sube una unidad:' : 'Como es menor que 5, la última cifra que se conserva no cambia:', m: `${numero} \\approx ${r}` }
      ],
      res: r
    };
  }

  /* ================= 8. Problema de la pizza ================= */
  const DEN8 = [3, 4, 5, 6, 7, 8, 9];
  function genPizza(R) {
    let a, b, c, d;
    do {
      b = R.pick(DEN8); a = R.int(1, b - 1);
      d = R.pick(DEN8); c = R.int(1, d - 1);
    } while (mcd(a, b) !== 1 || mcd(c, d) !== 1 || a * d + c * b >= b * d);
    const M = mcm(b, d), A = a * M / b, C = c * M / d, sobra = M - A - C;
    const enun = `María y Andrés se compran una pizza para cenar. Si María se come \\(\\dfrac{${a}}{${b}}\\) de la pizza y Andrés, \\(\\dfrac{${c}}{${d}}\\), ¿qué fracción de la pizza sobra?`;
    return {
      html: true,
      enun: `<span class="pend-texto">${enun}</span>`,
      pasos: [
        { t: `Sumamos lo que se comen entre los dos, con común denominador m.c.m.(${b}, ${d}) = ${M}:`, m: `\\frac{${a}}{${b}} + \\frac{${c}}{${d}} = \\frac{${A}}{${M}} + \\frac{${C}}{${M}} = \\frac{${A + C}}{${M}}` },
        { t: `La pizza entera es \\(\\frac{${M}}{${M}} = 1\\). Restamos lo que se han comido:`, m: `1 - \\frac{${A + C}}{${M}} = \\frac{${M} - ${A + C}}{${M}} = \\frac{${sobra}}{${M}}${yaSimp(sobra, M)}` }
      ],
      res: fs(sobra, M),
      resHtml: `Sobra \\(${fs(sobra, M)}\\) de la pizza.`
    };
  }

  registrarFicha({
    id: 'pend3-reales',
    titulo: 'Números reales',
    detalle: '3.º ESO',
    grupo: 'Recuperación de 3.º ESO',
    enlace: '../pendientes/tercero/reales-3.html',
    ejercicios: [
      { id: 'clasificar', nombre: 'Clasificar números (ℕ, ℤ, ℚ, I)', peso: 0.5, columnas: 4,
        enunciado: ['Indica a qué conjuntos pertenece el número (\\(\\mathbb{N}\\), \\(\\mathbb{Z}\\), \\(\\mathbb{Q}\\) o \\(\\mathbb{I}\\)):', 'Indica a qué conjuntos pertenece cada número (\\(\\mathbb{N}\\), \\(\\mathbb{Z}\\), \\(\\mathbb{Q}\\) o \\(\\mathbb{I}\\)):'],
        generar: genClasificar },
      { id: 'recta', nombre: 'Representar una fracción en la recta', peso: 0.75, columnas: 2,
        enunciado: ['Representa la fracción en la recta numérica:', 'Representa cada fracción en la recta numérica:'],
        generar: genRecta },
      { id: 'comparar', nombre: 'Comparar fracciones', peso: 0.5, columnas: 3,
        enunciado: ['Escribe el signo \\(<\\), \\(>\\) o \\(=\\) que corresponde:', 'Escribe en cada caso el signo \\(<\\), \\(>\\) o \\(=\\) que corresponde:'],
        generar: genComparar },
      { id: 'suma3', nombre: 'Suma y resta de tres fracciones', peso: 1, columnas: 2,
        enunciado: ['Calcula y simplifica el resultado:', 'Calcula y simplifica el resultado:'], generar: genSuma3 },
      { id: 'multdiv', nombre: 'Multiplicación y división de fracciones', peso: 0.5, columnas: 3,
        enunciado: ['Calcula y simplifica el resultado:', 'Calcula y simplifica el resultado:'], generar: genMultDiv },
      { id: 'decimal', nombre: 'Decimal a fracción (exacto, periódico puro y mixto)', peso: 0.75, columnas: 3,
        enunciado: ['Expresa en forma de fracción irreducible:', 'Expresa en forma de fracción irreducible:'], generar: genDecimal },
      { id: 'redondeo', nombre: 'Redondear decimales', peso: 0.5, columnas: 3,
        enunciado: ['Redondea:', 'Redondea:'], generar: genRedondeo },
      { id: 'pizza', nombre: 'Problema: fracción que sobra', peso: 1, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genPizza }
    ]
  });
})();
