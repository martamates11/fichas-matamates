/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Problemas con sistemas de ecuaciones (pendientes de 3.º ESO).
   Los seis tipos de problema y sus rangos son los de la ficha interactiva
   pendientes/tercero/sistemas-3.html. La resolución se hace por reducción (tras
   simplificar las ecuaciones que lo permiten), que es la más corta a mano en estos
   problemas; cualquier otro método es igual de válido. */
(function () {
  'use strict';
  const { mcd, mcm, tex, despejeLineal, registrarFicha } = window.EX;
  const { n, p, poli } = tex;

  const ec = (a, b, e) => `${poli([[a, 'x'], [b, 'y']])} = ${n(e)}`;
  const izq = q => poli([[q.x, 'x'], [q.y, 'y']]);
  const sistema = (q1, q2) => `\\begin{cases} ${ec(q1.x, q1.y, q1.e)} \\\\ ${ec(q2.x, q2.y, q2.e)} \\end{cases}`;

  /* ---------- Generadores (mismos rangos que la ficha) ---------- */
  function sumaDif(R) {
    const y0 = R.int(4, 16), x0 = y0 + R.int(2, 10), S = x0 + y0, D = x0 - y0;
    return {
      txt: `La suma de dos números es ${S} y su diferencia es ${D}. Calcula esos dos números.`,
      incog: 'Llamamos \\(x\\) al número mayor e \\(y\\) al menor.',
      plant: [['«La suma es ' + S + '»:', ec(1, 1, S)], ['«La diferencia es ' + D + '» (mayor menos menor):', ec(1, -1, D)]],
      a: 1, b: 1, e1: S, c: 1, d: -1, e2: D, x0, y0,
      final: `Los números son ${x0} y ${y0}.`
    };
  }

  const PRODUCTOS = [['kiwis', 'patatas'], ['manzanas', 'peras'], ['naranjas', 'limones'], ['tomates', 'pimientos']];
  function compra(R) {
    const [p1, p2] = R.pick(PRODUCTOS);
    let a, b, c, d, x0, y0;
    do {
      a = R.int(1, 6); b = R.int(1, 6); c = R.int(1, 6); d = R.int(1, 6);
      x0 = R.int(1, 9); y0 = R.int(1, 9);
    } while (a * d - b * c === 0 || (a === c && b === d) || x0 === y0);
    const e1 = a * x0 + b * y0, e2 = c * x0 + d * y0;
    return {
      txt: `${a} kg de ${p1} y ${b} kg de ${p2} cuestan ${e1} €, y ${c} kg de ${p1} y ${d} kg de ${p2} cuestan ${e2} €. ¿Cuánto vale el kilo de ${p1}? ¿Y el de ${p2}?`,
      incog: `Llamamos \\(x\\) al precio de un kilo de ${p1} e \\(y\\) al de un kilo de ${p2}, en euros.`,
      plant: [['Primera compra:', ec(a, b, e1)], ['Segunda compra:', ec(c, d, e2)]],
      a, b, e1, c, d, e2, x0, y0,
      final: `El kilo de ${p1} cuesta ${x0} € y el de ${p2}, ${y0} €.`
    };
  }

  const PAREJAS = [['Ana', 'Beatriz', 'f'], ['Lucía', 'Elena', 'f'], ['Marcos', 'Diego', 'm'], ['Pablo', 'Iván', 'm']];
  function edades(R) {
    const [u, v, g] = R.pick(PAREJAS);
    let y0, k, m, x0;
    do { y0 = R.int(6, 15); m = R.int(2, 6); k = R.pick([2, 3]); x0 = k * (y0 + m) - m; } while (x0 > 55);
    const S = x0 + y0, rel = k === 2 ? 'el doble' : 'el triple';
    const [entre, cada] = g === 'f' ? ['entre las dos', 'cada una'] : ['entre los dos', 'cada uno'];
    return {
      txt: `Dentro de ${m} años, la edad de ${u} será ${rel} que la de ${v}. Actualmente, ${entre} suman ${S} años. ¿Qué edad tiene ${cada} ahora?`,
      incog: `Llamamos \\(x\\) a la edad actual de ${u} e \\(y\\) a la de ${v}.`,
      plant: [['Suma de las edades actuales:', ec(1, 1, S)],
        [`Dentro de ${m} años tendrán \\(x + ${m}\\) e \\(y + ${m}\\):`, `x + ${m} = ${k}(y + ${m}) \\;\\Rightarrow\\; ${ec(1, -k, (k - 1) * m)}`]],
      a: 1, b: 1, e1: S, c: 1, d: -k, e2: (k - 1) * m, x0, y0,
      final: `${u} tiene ${x0} años y ${v}, ${y0} años.`
    };
  }

  function perimetro(R) {
    const y0 = R.int(3, 12), D = R.int(2, 10), x0 = y0 + D, P = 2 * (x0 + y0);
    return {
      txt: `El perímetro de un rectángulo mide ${P} cm y la base mide ${D} cm más que la altura. Calcula las dimensiones del rectángulo.`,
      incog: 'Llamamos \\(x\\) a la base e \\(y\\) a la altura, en centímetros.',
      plant: [['El perímetro es la suma de los cuatro lados:', ec(2, 2, P)], [`«La base mide ${D} cm más que la altura»:`, ec(1, -1, D)]],
      a: 2, b: 2, e1: P, c: 1, d: -1, e2: D, x0, y0,
      final: `La base mide ${x0} cm y la altura, ${y0} cm.`
    };
  }

  function entradas(R) {
    let pa, pn; do { pa = R.int(4, 10); pn = R.int(2, 8); } while (pa <= pn);
    const x0 = R.int(6, 35), y0 = R.int(6, 35), T = x0 + y0, Rc = pa * x0 + pn * y0;
    return {
      txt: `En un cine se han vendido ${T} entradas entre adultos y niños, y se han recaudado ${Rc} €. La entrada de adulto cuesta ${pa} € y la de niño, ${pn} €. ¿Cuántas entradas de cada tipo se vendieron?`,
      incog: 'Llamamos \\(x\\) al número de entradas de adulto e \\(y\\) al de entradas de niño.',
      plant: [['Total de entradas:', ec(1, 1, T)], ['Recaudación (precio por número de entradas):', ec(pa, pn, Rc)]],
      a: 1, b: 1, e1: T, c: pa, d: pn, e2: Rc, x0, y0,
      final: `Se vendieron ${x0} entradas de adulto y ${y0} de niño.`
    };
  }

  function cifras(R) {
    const x0 = R.int(1, 8), y0 = R.int(x0 + 1, 9), S = x0 + y0, D = 9 * (y0 - x0);
    return {
      txt: `En un número de dos cifras, la suma de las cifras es ${S}. Si se invierte el orden de las cifras, el número obtenido es ${D} unidades mayor que el original. Halla el número.`,
      incog: 'Llamamos \\(x\\) a la cifra de las decenas e \\(y\\) a la de las unidades: el número es \\(10x + y\\) y, con las cifras invertidas, \\(10y + x\\).',
      plant: [['Suma de las cifras:', ec(1, 1, S)], ['El invertido menos el original:', `(10y + x) - (10x + y) = ${D} \\;\\Rightarrow\\; ${ec(-9, 9, D)}`]],
      a: 1, b: 1, e1: S, c: -9, d: 9, e2: D, x0, y0,
      final: `El número es ${10 * x0 + y0}.`
    };
  }

  /* ---------- Resolución por reducción ---------- */
  function simplificar(q, i, pasos) {
    const g = mcd(mcd(q.x, q.y), q.e);
    if (g <= 1) return q;
    const s = { x: q.x / g, y: q.y / g, e: q.e / g };
    pasos.push({ t: `Simplificamos la ${i}.ª ecuación dividiendo entre ${g}:`, m: ec(s.x, s.y, s.e) });
    return s;
  }
  function reduccion(S) {
    const pasos = [];
    const q1 = simplificar({ x: S.a, y: S.b, e: S.e1 }, 1, pasos);
    const q2 = simplificar({ x: S.c, y: S.d, e: S.e2 }, 2, pasos);
    const coste = u => mcm(Math.abs(q1[u]), Math.abs(q2[u]));
    const u = coste('y') <= coste('x') ? 'y' : 'x', v = u === 'x' ? 'y' : 'x';
    const c1 = q1[u], c2 = q2[u];
    let f1, f2;
    if (c1 === c2) { f1 = 1; f2 = -1; } else if (c1 === -c2) { f1 = 1; f2 = 1; } else {
      const L = mcm(Math.abs(c1), Math.abs(c2));
      f1 = L / Math.abs(c1); f2 = L / Math.abs(c2);
      if (Math.sign(c1) === Math.sign(c2)) f2 = -f2;
    }
    const m1 = { x: q1.x * f1, y: q1.y * f1, e: q1.e * f1 }, m2 = { x: q2.x * f2, y: q2.y * f2, e: q2.e * f2 };
    if (f1 === 1 && f2 === -1) {
      pasos.push({ t: `Los coeficientes de \\(${u}\\) son iguales: restamos las ecuaciones (1.ª − 2.ª):`, m: `(${izq(q1)}) - (${izq(q2)}) = ${n(q1.e)} - ${p(q2.e)}` });
    } else if (f1 === 1 && f2 === 1) {
      pasos.push({ t: `Los coeficientes de \\(${u}\\) son opuestos: sumamos las ecuaciones:`, m: `(${izq(q1)}) + (${izq(q2)}) = ${n(q1.e)} + ${p(q2.e)}` });
    } else {
      const txt = [f1 !== 1 ? `la 1.ª por \\(${n(f1)}\\)` : '', f2 !== 1 ? `la 2.ª por \\(${n(f2)}\\)` : ''].filter(Boolean).join(' y ');
      pasos.push({ t: `Para eliminar \\(${u}\\), multiplicamos ${txt}:`, m: sistema(m1, m2) });
      pasos.push({ t: 'Sumamos las dos ecuaciones:', m: `(${izq(m1)}) + (${izq(m2)}) = ${n(m1.e)} + ${p(m2.e)}` });
    }
    const v0 = v === 'x' ? S.x0 : S.y0;
    pasos.push({ t: 'Despejamos:', m: despejeLineal(m1[v] + m2[v], m1.e + m2.e, v).m });
    const terms = ['x', 'y'].map((w, i) => {
      const k = q1[w];
      const cuerpo = w === v ? (Math.abs(k) === 1 ? p(v0) : `${Math.abs(k)} \\cdot ${p(v0)}`) : (Math.abs(k) === 1 ? w : `${Math.abs(k)}${w}`);
      return i === 0 ? (k < 0 ? '-' : '') + cuerpo : (k < 0 ? ' - ' : ' + ') + cuerpo;
    }).join('');
    pasos.push({ t: `Sustituimos \\(${v} = ${n(v0)}\\) en la 1.ª ecuación:`, m: `${terms} = ${n(q1.e)}` });
    pasos.push({ t: 'Despejamos:', m: despejeLineal(q1[u], q1.e - q1[v] * v0, u).m });
    return pasos;
  }

  function problema(gen) {
    return R => {
      const S = gen(R);
      const pasos = [
        { t: S.incog },
        { t: S.plant[0][0], m: S.plant[0][1] },
        { t: S.plant[1][0], m: S.plant[1][1] },
        { t: 'El sistema es:', m: sistema({ x: S.a, y: S.b, e: S.e1 }, { x: S.c, y: S.d, e: S.e2 }) },
        ...reduccion(S)
      ];
      return {
        html: true,
        enun: `<span class="pend-texto">${S.txt}</span>`,
        pasos,
        res: `x = ${n(S.x0)},\\quad y = ${n(S.y0)}`,
        resHtml: `\\(x = ${n(S.x0)},\\; y = ${n(S.y0)}\\). ${S.final}`
      };
    };
  }

  const TIPOS = [sumaDif, compra, edades, perimetro, entradas, cifras];
  /* Cada apartado, de un tipo distinto: el apartado i elige entre los tipos 2i y 2i + 1 */
  const variado = (R, i) => problema(TIPOS[(2 * i + R.int(0, 1)) % 6])(R);

  const ENUN = ['Plantea un sistema de ecuaciones y resuelve el problema:', 'Plantea un sistema de ecuaciones y resuelve cada problema:'];
  const tipo = (id, nombre, generar, peso = 1.5) => ({ id, nombre, peso, columnas: 1, enunciado: ENUN, generar });
  registrarFicha({
    id: 'pend3-sistemas',
    titulo: 'Problemas con sistemas',
    detalle: '3.º ESO',
    grupo: 'Recuperación de 3.º ESO',
    enlace: '../pendientes/tercero/sistemas-3.html',
    ejercicios: [
      tipo('variado', 'Problemas variados (de tipos distintos)', variado),
      tipo('suma-diferencia', 'Suma y diferencia', problema(sumaDif)),
      tipo('compra', 'Compra combinada', problema(compra)),
      tipo('edades', 'Edades', problema(edades)),
      tipo('perimetro', 'Perímetro de un rectángulo', problema(perimetro)),
      tipo('entradas', 'Entradas y recaudación', problema(entradas)),
      tipo('cifras', 'Cifras de un número', problema(cifras))
    ]
  });
})();
