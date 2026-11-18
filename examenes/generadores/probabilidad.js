/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Probabilidad (Matemáticas CC.SS. II · PAU Extremadura).
   Tipos de la ficha probabilidad/probabilidad.html: tabla de contingencia (completar y
   calcular una intersección y una condicionada), árbol de probabilidad (probabilidad total
   y teorema de Bayes, con 2 y con 3 ramas iniciales) y álgebra de sucesos (unión, De Morgan,
   probabilidad condicionada, independencia e incompatibilidad).

   Diferencias respecto a la ficha interactiva:
   - La ficha tiene bancos fijos de ejercicios; aquí los números se generan al azar con los
     mismos contextos y órdenes de magnitud, ajustados para que todo se haga sin calculadora
     (tablas con celdas múltiplos de 10, porcentajes múltiplos de 5, probabilidades con
     dos decimales como máximo en las cuentas intermedias).
   - En la ficha las preguntas de álgebra de sucesos son de opción múltiple; en el papel son
     apartados abiertos con los mismos tipos de dato (condicionada, independientes,
     incompatibles, De Morgan inversa).
   - La tabla se da en blanco para completarla y el árbol se pide dibujar; la solución
     muestra ambos ya resueltos.
   Las probabilidades se dan como fracción irreducible o decimal con coma. */
(function () {
  'use strict';
  const { tex, registrarFicha, fr, pend } = window.EX;
  const { frac } = tex;
  const { Lienzo, rd } = pend;

  /* ---------- Formato ---------- */
  /* Entero escalado por 10^k → decimal TeX con coma, sin ceros finales: dx(60, 2) = 0{,}6 */
  const dx = (v, k) => {
    const neg = v < 0; v = Math.abs(v);
    const s = String(v).padStart(k + 1, '0');
    const e = s.slice(0, s.length - k), f = s.slice(s.length - k).replace(/0+$/, '');
    return (neg ? '-' : '') + e + (f ? '{,}' + f : '');
  };
  const h = v => dx(v, 2);                          // centésimas → decimal
  const dt = x => String(x).replace('.', ',');      // decimal en texto plano
  /* Decimal de una fracción: exacto si es finito, aproximado (3 cifras) si no */
  function decDe(n, d) {
    const f = fr(n, d);
    let q = f.d, k = 0, a = 0, b = 0;
    while (q % 2 === 0) { q /= 2; a++; }
    while (q % 5 === 0) { q /= 5; b++; }
    if (q === 1) { k = Math.max(a, b); return { exacto: true, tex: dx(f.n * Math.pow(10, k) / f.d, k) }; }
    return { exacto: false, tex: String(rd(f.n / f.d, 3)).replace('.', '{,}') };
  }
  /* a/b = simplificada = decimal (solo escribe lo que añade información) */
  function fd(a, b) {
    const f = fr(a, b);
    let s = `\\frac{${a}}{${b}}`;
    if (f.n !== a || f.d !== b) s += ` = ${frac(f)}`;
    if (f.d !== 1) { const d = decDe(a, b); s += d.exacto ? ` = ${d.tex}` : ` \\approx ${d.tex}`; }
    return s;
  }
  const F = (a, b) => frac(fr(a, b));
  const FD = (a, b) => {                               // para las respuestas
    const f = fr(a, b);
    if (f.d === 1) return frac(f);
    const d = decDe(a, b);
    return `${frac(f)}${d.exacto ? ' = ' : ' \\approx '}${d.tex}`;
  };
  const preguntas = arr => `<span class="pend-texto">${arr.map((q, k) => `${k + 1}. ${q}`).join('<br>')}</span>`;
  const resLista = arr => arr.map((v, k) => `${k + 1})\\ ${v}`).join(',\\quad ');
  const plano = s => s.replace(/\{,\}/g, ',');           // TeX → texto plano (para el SVG)
  const mayus = s => s[0].toUpperCase() + s.slice(1);
  const barra = s => `\\overline{${s}}`;

  /* ================= 1. Tabla de contingencia ================= */
  /* Contextos de la ficha (T1–T7): fila/columna en plural (enunciado) y en singular
     (subjuntivo para «la probabilidad de que…», indicativo para «sabiendo que…») */
  const CTX_TABLA = [
    { intro: 'En un instituto se estudió si los alumnos practican deporte y si aprueban Matemáticas.', suj: 'alumnos', cuales: 'los cuales', un: 'un alumno elegido al azar',
      filaH: ['Practica deporte', 'No practica deporte'], colH: ['Aprueba Matemáticas', 'Suspende Matemáticas'],
      filaP: ['practican deporte', 'no practican deporte'], colP: ['aprueban Matemáticas', 'suspenden Matemáticas'],
      filaS: ['practique deporte', 'no practique deporte'], colS: ['apruebe Matemáticas', 'suspenda Matemáticas'],
      filaI: ['practica deporte', 'no practica deporte'], colI: ['aprueba Matemáticas', 'suspende Matemáticas'] },
    { intro: 'En una empresa se clasificó a los empleados según su puesto y si tienen formación universitaria.', suj: 'empleados', cuales: 'los cuales', un: 'un empleado elegido al azar',
      filaH: ['Técnicos', 'Administrativos'], colH: ['Con formación', 'Sin formación'],
      filaP: ['son técnicos', 'son administrativos'], colP: ['tienen formación', 'no tienen formación'],
      filaS: ['sea técnico', 'sea administrativo'], colS: ['tenga formación', 'no tenga formación'],
      filaI: ['es técnico', 'es administrativo'], colI: ['tiene formación', 'no tiene formación'] },
    { intro: 'En una ciudad se encuestó a personas sobre su medio de transporte y su puntualidad.', suj: 'personas', cuales: 'las cuales', un: 'una persona elegida al azar',
      filaH: ['Transporte público', 'Vehículo propio'], colH: ['Puntual', 'No puntual'],
      filaP: ['usan transporte público', 'usan vehículo propio'], colP: ['son puntuales', 'no son puntuales'],
      filaS: ['use transporte público', 'use vehículo propio'], colS: ['sea puntual', 'no sea puntual'],
      filaI: ['usa transporte público', 'usa vehículo propio'], colI: ['es puntual', 'no es puntual'] },
    { intro: 'En una clínica se analizaron pacientes según si fuman y si tienen hipertensión.', suj: 'pacientes', cuales: 'los cuales', un: 'un paciente elegido al azar',
      filaH: ['Fuma', 'No fuma'], colH: ['Hipertensión', 'Sin hipertensión'],
      filaP: ['fuman', 'no fuman'], colP: ['tienen hipertensión', 'no tienen hipertensión'],
      filaS: ['fume', 'no fume'], colS: ['tenga hipertensión', 'no tenga hipertensión'],
      filaI: ['fuma', 'no fuma'], colI: ['tiene hipertensión', 'no tiene hipertensión'] },
    { intro: 'En un municipio se encuestó a ciudadanos sobre si votaron y si están satisfechos con los servicios públicos.', suj: 'ciudadanos', cuales: 'los cuales', un: 'un ciudadano elegido al azar',
      filaH: ['Votó', 'No votó'], colH: ['Satisfecho', 'No satisfecho'],
      filaP: ['votaron', 'no votaron'], colP: ['están satisfechos', 'no están satisfechos'],
      filaS: ['haya votado', 'no haya votado'], colS: ['esté satisfecho', 'no esté satisfecho'],
      filaI: ['ha votado', 'no ha votado'], colI: ['está satisfecho', 'no está satisfecho'] },
    { intro: 'En un centro de estudios se recogieron datos de los alumnos sobre si asisten a tutorías y si superan el examen final.', suj: 'alumnos', cuales: 'los cuales', un: 'un alumno elegido al azar',
      filaH: ['Asiste a tutorías', 'No asiste'], colH: ['Supera el examen', 'No lo supera'],
      filaP: ['asisten a tutorías', 'no asisten a tutorías'], colP: ['superan el examen', 'no superan el examen'],
      filaS: ['asista a tutorías', 'no asista a tutorías'], colS: ['supere el examen', 'no supere el examen'],
      filaI: ['asiste a tutorías', 'no asiste a tutorías'], colI: ['supera el examen', 'no supera el examen'] },
    { intro: 'En una fábrica se inspeccionaron piezas de dos turnos.', suj: 'piezas', cuales: 'las cuales', un: 'una pieza elegida al azar',
      filaH: ['Turno de mañana', 'Turno de tarde'], colH: ['Defectuosa', 'Correcta'],
      filaP: ['son del turno de mañana', 'son del turno de tarde'], colP: ['son defectuosas', 'son correctas'],
      filaS: ['sea del turno de mañana', 'sea del turno de tarde'], colS: ['sea defectuosa', 'sea correcta'],
      filaI: ['es del turno de mañana', 'es del turno de tarde'], colI: ['es defectuosa', 'es correcta'] }
  ];

  const ESTILO_T = 'border-collapse:collapse;margin:1mm 0;font-variant-numeric:tabular-nums';
  const celda = (txt, extra = '') => `<td style="border:1px solid #000;padding:1.2mm 2.5mm;min-width:22mm;height:7.5mm;text-align:center;${extra}">${txt}</td>`;
  const cab = txt => `<th style="border:1px solid #000;padding:1.2mm 2.5mm;font-weight:600;text-align:center;background:#fff">${txt}</th>`;
  /* Tabla 3×3: v[i][j] con el total en la última fila/columna; dado[i][j]=true → dato del enunciado.
     Si v es null, la tabla va en blanco (para completar). */
  function tablaHtml(c, v, dado) {
    const fila = (i, nombre) => `<tr>${cab(nombre)}${[0, 1, 2].map(j => v
      ? celda(v[i][j], dado[i][j] ? '' : 'background:#ececec')
      : celda('', i === 2 || j === 2 ? 'background:#f6f6f6' : '')).join('')}</tr>`;
    return `<table style="${ESTILO_T}"><tr>${cab('')}${cab(c.colH[0])}${cab(c.colH[1])}${cab('Total')}</tr>${fila(0, c.filaH[0])}${fila(1, c.filaH[1])}${fila(2, 'Total')}</table>`;
  }

  function genTabla(R) {
    const c = R.pick(CTX_TABLA);
    /* Sin calculadora: se repite el sorteo hasta que las fracciones pedidas sean manejables */
    let n, intento = 0;
    do {
      n = [[R.int(2, 20) * 10, R.int(2, 20) * 10], [R.int(2, 20) * 10, R.int(2, 20) * 10]];
      const t = n[0][0] + n[0][1] + n[1][0] + n[1][1];
      const ok = [n[0][0], n[0][1], n[1][0], n[1][1]].every(x => fr(x, t).d <= 40)
        && [[n[0][0], n[0][0] + n[0][1]], [n[1][0], n[1][0] + n[1][1]], [n[0][0], n[0][0] + n[1][0]], [n[0][1], n[0][1] + n[1][1]]].every(([x, y]) => fr(x, y).d <= 12);
      if (ok) break;
    } while (++intento < 300);
    const r = [n[0][0] + n[0][1], n[1][0] + n[1][1]];
    const col = [n[0][0] + n[1][0], n[0][1] + n[1][1]], N = r[0] + r[1];
    const v = [[n[0][0], n[0][1], r[0]], [n[1][0], n[1][1], r[1]], [col[0], col[1], N]];
    const variante = R.int(1, 3);
    const lin0 = `${r[0]} ${c.suj} ${c.filaP[0]}, de ${c.cuales} ${n[0][0]} ${c.colP[0]}`;
    let datos, dado, deduc;
    const D = [[false, false, false], [false, false, false], [false, false, false]];
    if (variante === 1) {
      datos = `${lin0}. En total, ${col[0]} ${c.colP[0]} y ${col[1]} ${c.colP[1]}.`;
      [[0, 0], [0, 2], [2, 0], [2, 1]].forEach(([i, j]) => { D[i][j] = true; });
      deduc = [
        `Total general: \\(${col[0]} + ${col[1]} = ${N}\\).`,
        `Primera fila: \\(${r[0]} - ${n[0][0]} = ${n[0][1]}\\) ${c.suj} ${c.filaP[0]} y ${c.colP[1]}.`,
        `Primera columna: \\(${col[0]} - ${n[0][0]} = ${n[1][0]}\\) ${c.suj} ${c.filaP[1]} y ${c.colP[0]}.`,
        `Segunda columna: \\(${col[1]} - ${n[0][1]} = ${n[1][1]}\\) ${c.suj} ${c.filaP[1]} y ${c.colP[1]}.`,
        `Total de la segunda fila: \\(${n[1][0]} + ${n[1][1]} = ${r[1]}\\).`
      ];
    } else if (variante === 2) {
      datos = `${lin0}. De los que ${c.filaP[1]}, ${n[1][0]} ${c.colP[0]} y ${n[1][1]} ${c.colP[1]}.`;
      [[0, 0], [0, 2], [1, 0], [1, 1]].forEach(([i, j]) => { D[i][j] = true; });
      deduc = [
        `Primera fila: \\(${r[0]} - ${n[0][0]} = ${n[0][1]}\\) ${c.suj} ${c.filaP[0]} y ${c.colP[1]}.`,
        `Total de la segunda fila: \\(${n[1][0]} + ${n[1][1]} = ${r[1]}\\).`,
        `Totales de las columnas: \\(${n[0][0]} + ${n[1][0]} = ${col[0]}\\) y \\(${n[0][1]} + ${n[1][1]} = ${col[1]}\\).`,
        `Total general: \\(${r[0]} + ${r[1]} = ${N}\\).`
      ];
    } else {
      datos = `${lin0}. Además, ${r[1]} ${c.suj} ${c.filaP[1]}. En total, ${col[0]} ${c.colP[0]}.`;
      [[0, 0], [0, 2], [1, 2], [2, 0]].forEach(([i, j]) => { D[i][j] = true; });
      deduc = [
        `Primera fila: \\(${r[0]} - ${n[0][0]} = ${n[0][1]}\\) ${c.suj} ${c.filaP[0]} y ${c.colP[1]}.`,
        `Primera columna: \\(${col[0]} - ${n[0][0]} = ${n[1][0]}\\) ${c.suj} ${c.filaP[1]} y ${c.colP[0]}.`,
        `Segunda fila: \\(${r[1]} - ${n[1][0]} = ${n[1][1]}\\) ${c.suj} ${c.filaP[1]} y ${c.colP[1]}.`,
        `Total de la segunda columna: \\(${n[0][1]} + ${n[1][1]} = ${col[1]}\\).`,
        `Total general: \\(${r[0]} + ${r[1]} = ${N}\\).`
      ];
    }
    dado = D;
    /* Pregunta 1: intersección de dos casillas; pregunta 2: condicionada (otra casilla) */
    const i1 = R.int(0, 1), j1 = R.int(0, 1);
    let i2, j2; do { i2 = R.int(0, 1); j2 = R.int(0, 1); } while (i2 === i1 && j2 === j1);
    const condPorFila = R.rand() < 0.5;       // true: P(columna | fila); false: P(fila | columna)
    const q1 = `¿Cuál es la probabilidad de que ${c.un} ${c.filaS[i1]} y ${c.colS[j1]}?`;
    const q2 = condPorFila
      ? `¿Cuál es la probabilidad de que ${c.un} ${c.colS[j2]}, sabiendo que ${c.filaI[i2]}?`
      : `¿Cuál es la probabilidad de que ${c.un} ${c.filaS[i2]}, sabiendo que ${c.colI[j2]}?`;
    const den2 = condPorFila ? r[i2] : col[j2];
    const f1 = n[i1][j1], f2 = n[i2][j2];
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${c.intro} ${mayus(datos)}</span><span class="pend-texto">Construye la tabla de contingencia (incluido el total general) y calcula:</span>${preguntas([q1, q2])}</div>`,
      pasos: [
        { t: 'Completamos la tabla a partir de los datos (en la tabla completa, las casillas sombreadas son las que se deducen):', html: `<div class="pend-texto">${deduc.join('<br>')}</div>` },
        { t: 'La tabla completa es:', html: tablaHtml(c, v, dado) },
        { t: `1. Casos favorables: la casilla «${c.filaH[i1].toLowerCase()} y ${c.colH[j1].toLowerCase()}», con ${f1}. Casos posibles: el total general, ${N}.`, m: `P = \\frac{${f1}}{${N}} = ${fd(f1, N)}` },
        { t: condPorFila
            ? `2. «Sabiendo que ${c.filaI[i2]}» restringe el espacio a esa fila: ${den2} casos posibles, de los cuales ${f2} cumplen la condición pedida.`
            : `2. «Sabiendo que ${c.colI[j2]}» restringe el espacio a esa columna: ${den2} casos posibles, de los cuales ${f2} cumplen la condición pedida.`,
          m: `P = \\frac{${f2}}{${den2}} = ${fd(f2, den2)}` }
      ],
      res: resLista([FD(f1, N), FD(f2, den2)])
    };
  }

  /* ================= 2 y 3. Árbol de probabilidad ================= */
  /* Contextos de la ficha (A1–A5). Los porcentajes son enteros; todo se calcula con enteros
     (porcentajes y diezmilésimas) para evitar errores de coma flotante. */
  const CTX_ARBOL2 = [
    { un: 'un alumno elegido al azar', nodos: ['Inglés', 'Francés'], ev: ['Aprueba', 'Suspende'],
      rs: ['estudie inglés', 'estudie francés'], es: ['apruebe el examen', 'suspenda el examen'], ei: ['aprueba el examen', 'suspende el examen'],
      gen: R => { const p = R.int(6, 14) * 5; let a, b; do { a = R.int(6, 18) * 5; b = R.int(6, 18) * 5; } while (a === b); return { p: [p, 100 - p], c: [a, b] }; },
      texto: (p, c) => `En un colegio, el <b>${p[0]}&nbsp;%</b> de los alumnos estudia inglés y el <b>${p[1]}&nbsp;%</b> francés. De los que estudian inglés, el <b>${c[0]}&nbsp;%</b> aprueba el examen; de los que estudian francés, el <b>${c[1]}&nbsp;%</b>.` },
    { un: 'una pieza elegida al azar', nodos: ['Prov. A', 'Prov. B'], ev: ['Defectuosa', 'Correcta'],
      rs: ['proceda del proveedor A', 'proceda del proveedor B'], es: ['sea defectuosa', 'sea correcta'], ei: ['es defectuosa', 'es correcta'],
      gen: R => { const p = R.int(2, 8) * 10; let a, b; do { a = R.int(1, 6); b = R.int(1, 6); } while (a === b); return { p: [p, 100 - p], c: [a, b] }; },
      texto: (p, c) => `Una empresa compra piezas a dos proveedores: el proveedor A suministra el <b>${p[0]}&nbsp;%</b> y el B el <b>${p[1]}&nbsp;%</b>. El <b>${c[0]}&nbsp;%</b> de las piezas de A son defectuosas y el <b>${c[1]}&nbsp;%</b> de las de B.` },
    { un: 'un paciente elegido al azar', nodos: ['Antecedentes', 'Sin antec.'], ev: ['Positivo', 'Negativo'],
      rs: ['tenga antecedentes familiares', 'no tenga antecedentes familiares'], es: ['dé positivo en la prueba', 'dé negativo en la prueba'], ei: ['da positivo en la prueba', 'da negativo en la prueba'],
      gen: R => { const p = R.int(4, 8) * 5; return { p: [p, 100 - p], c: [R.int(15, 19) * 5, R.int(2, 6) * 5] }; },
      texto: (p, c) => `En una clínica, el <b>${p[0]}&nbsp;%</b> de los pacientes tiene antecedentes familiares de una enfermedad y el <b>${p[1]}&nbsp;%</b> no. La probabilidad de dar positivo en la prueba diagnóstica es del <b>${c[0]}&nbsp;%</b> si tiene antecedentes y del <b>${c[1]}&nbsp;%</b> si no los tiene.` },
    { un: 'una venta elegida al azar', nodos: ['Online', 'Tienda'], ev: ['Devuelta', 'No devuelta'],
      rs: ['se haya hecho online', 'se haya hecho en la tienda'], es: ['sea devuelta', 'no sea devuelta'], ei: ['es devuelta', 'no es devuelta'],
      gen: R => { const p = R.int(4, 12) * 5; let a, b; do { a = R.int(2, 8) * 5; b = R.int(1, 5) * 5; } while (a === b); return { p: [p, 100 - p], c: [a, b] }; },
      texto: (p, c) => `En un comercio, el <b>${p[0]}&nbsp;%</b> de las ventas se hace online y el <b>${p[1]}&nbsp;%</b> en la tienda. Se devuelve el <b>${c[0]}&nbsp;%</b> de las ventas online y el <b>${c[1]}&nbsp;%</b> de las ventas en la tienda.` }
  ];
  const CTX_ARBOL3 = [
    { un: 'un trabajador elegido al azar', nodos: ['Coche', 'T. público', 'A pie'], ev: ['Tarde', 'Puntual'],
      rs: ['haya ido en coche', 'haya ido en transporte público', 'haya ido a pie'], es: ['llegue tarde al trabajo', 'llegue puntual al trabajo'], ei: ['llega tarde al trabajo', 'llega puntual al trabajo'],
      gen: R => ({ p: repartir(R, 3, 15), c: [R.int(1, 4) * 5, R.int(3, 7) * 5, R.int(1, 3) * 5] }),
      texto: (p, c) => `En una ciudad, el <b>${p[0]}&nbsp;%</b> de los trabajadores va al trabajo en coche, el <b>${p[1]}&nbsp;%</b> en transporte público y el <b>${p[2]}&nbsp;%</b> a pie. Llega tarde el <b>${c[0]}&nbsp;%</b> de los que van en coche, el <b>${c[1]}&nbsp;%</b> de los que usan transporte público y el <b>${c[2]}&nbsp;%</b> de los que van a pie.` },
    { un: 'una pieza elegida al azar', nodos: ['Máq. A', 'Máq. B', 'Máq. C'], ev: ['Defectuosa', 'Correcta'],
      rs: ['haya sido fabricada por la máquina A', 'haya sido fabricada por la máquina B', 'haya sido fabricada por la máquina C'], es: ['sea defectuosa', 'sea correcta'], ei: ['es defectuosa', 'es correcta'],
      gen: R => ({ p: repartir(R, 3, 20), c: [R.int(1, 6), R.int(1, 6), R.int(1, 6)] }),
      texto: (p, c) => `Una fábrica tiene tres máquinas: la A produce el <b>${p[0]}&nbsp;%</b> de las piezas, la B el <b>${p[1]}&nbsp;%</b> y la C el <b>${p[2]}&nbsp;%</b>. Las tasas de piezas defectuosas son del <b>${c[0]}&nbsp;%</b> en A, del <b>${c[1]}&nbsp;%</b> en B y del <b>${c[2]}&nbsp;%</b> en C.` }
  ];
  /* Reparto de 100 en k partes múltiplos de 5, todas ≥ mín, no todas iguales ni dos primeras iguales */
  function repartir(R, k, min) {
    for (;;) {
      const p = [];
      let resto = 100;
      for (let i = 0; i < k - 1; i++) { const x = R.int(min / 5, (resto - min * (k - 1 - i)) / 5) * 5; p.push(x); resto -= x; }
      p.push(resto);
      if (p.every(x => x >= min) && new Set(p).size === k) return p;
    }
  }

  function arbolSvg(ctx, p, c, hojas) {
    const L = Lienzo(), TAM = 11, K = p.length;
    const GAP = 22, GRUPO = 12;
    const yHoja = (i, j) => (i * (2 * GAP + GRUPO) + j * GAP);
    const yNodo = i => yHoja(i, 0) + GAP / 2;
    const total = yHoja(K - 1, 1);
    const yo = total / 2;
    const X1 = 78, largoNodo = Math.max(...ctx.nodos.map(s => s.length)) * TAM * 0.55;
    const XA = X1 + 5 + largoNodo + 4, XB = XA + 80;
    const etiqueta = (xa, ya, xb, yb, txt) => {
      const mx = (xa + xb) / 2, my = (ya + yb) / 2;
      if (Math.abs(yb - ya) < 1) L.texto(mx, my - 5, txt, { tam: TAM });
      else if (yb < ya) L.texto(mx - 8, my - 5, txt, { tam: TAM });
      else L.texto(mx - 8, my + 14, txt, { tam: TAM });
    };
    for (let i = 0; i < K; i++) {
      L.linea(0, yo, X1, yNodo(i), { grosor: 1.1 });
      etiqueta(0, yo, X1, yNodo(i), plano(dx(p[i], 2)));
      L.texto(X1 + 5, yNodo(i) + 4, ctx.nodos[i], { ancla: 'start', tam: TAM, peso: 600 });
      [0, 1].forEach(j => {
        const pr = j === 0 ? c[i] : 100 - c[i];
        L.linea(XA, yNodo(i), XB, yHoja(i, j), { grosor: 1.1 });
        etiqueta(XA, yNodo(i), XB, yHoja(i, j), plano(dx(pr, 2)));
        L.texto(XB + 5, yHoja(i, j) + 4, hojas ? `${ctx.ev[j]}   ${plano(dx(p[i] * pr, 4))}` : ctx.ev[j], { ancla: 'start', tam: TAM });
      });
    }
    L.punto(0, yo, 2.5);
    return L.cerrar('pend-fig', 'Diagrama de árbol');
  }

  function genArbol(R, listaCtx) {
    const ctx = R.pick(listaCtx), K = ctx.nodos.length;
    /* Tasas distintas (si fueran iguales, Bayes daría la probabilidad inicial) y, si se puede,
       fracción de Bayes con denominador pequeño, para hacerlo sin calculadora */
    let p, c, reserva = null;
    for (let intento = 0; intento < 2000; intento++) {
      ({ p, c } = ctx.gen(R));
      if (new Set(c).size < c.length) continue;
      if (!reserva) reserva = { p, c };
      const hh = p.map((pi, i) => [pi * c[i], pi * (100 - c[i])]);
      const T = [0, 1].map(j => hh.reduce((sm, x) => sm + x[j], 0));
      if (hh.every(x => x.every((v, j) => fr(v, T[j]).d <= 40))) { reserva = null; break; }
    }
    if (reserva) ({ p, c } = reserva);
    /* Probabilidades de cada camino (diezmilésimas): hoja[i][j] */
    const hoja = p.map((pi, i) => [pi * c[i], pi * (100 - c[i])]);
    const tot = j => hoja.reduce((s, h2) => s + h2[j], 0);          // P(suceso j), en diezmilésimas
    const k1 = R.int(0, 1), k2 = R.int(0, 1), r2 = R.int(0, K - 1);
    const pr = i => dx(p[i], 2), cp = (i, j) => dx(j === 0 ? c[i] : 100 - c[i], 2);
    /* Suma de caminos hacia el suceso k */
    const caminos = k => hoja.map((_, i) => `${pr(i)} \\cdot ${cp(i, k)}`).join(' + ');
    const parciales = k => hoja.map(h2 => dx(h2[k], 4)).join(' + ');
    const nombreS = k => ctx.es[k];
    /* Mayúscula inicial en etiquetas P(...) */
    const E = k => `\\text{${ctx.ev[k]}}`, Rn = i => `\\text{${ctx.nodos[i]}}`;
    const num = hoja[r2][k2], den = tot(k2);
    const pasos = [
      { t: 'Dibujamos el diagrama de árbol: en cada nodo, las probabilidades de las ramas suman 1. A la derecha figura la probabilidad de cada camino (producto de sus ramas).', html: arbolSvg(ctx, p, c, true) },
      { t: `1. Probabilidad total: sumamos los caminos que llevan a «${ctx.ev[k1].toLowerCase()}».`,
        m: `P(${E(k1)}) = ${caminos(k1)} = ${parciales(k1)} = ${dx(tot(k1), 4)}` },
      { t: `2. Si ${ctx.un.replace(' elegido al azar', '').replace(' elegida al azar', '')} ${ctx.ei[k2]}, buscamos la probabilidad de que ${ctx.rs[r2]}. Es una probabilidad condicionada (teorema de Bayes): camino favorable entre probabilidad total del suceso que se sabe que ha ocurrido.`,
        m: `P(${Rn(r2)} \\mid ${E(k2)}) = \\frac{P(${Rn(r2)} \\cap ${E(k2)})}{P(${E(k2)})}` },
      { t: `El numerador es el camino «${ctx.nodos[r2]} → ${ctx.ev[k2]}»: \\(${pr(r2)} \\cdot ${cp(r2, k2)} = ${dx(num, 4)}\\). El denominador, la probabilidad total de «${ctx.ev[k2].toLowerCase()}»:`,
        m: `P(${E(k2)}) = ${caminos(k2)} = ${parciales(k2)} = ${dx(den, 4)}` },
      { t: 'Dividimos (las diezmilésimas se simplifican entre sí):', m: `P(${Rn(r2)} \\mid ${E(k2)}) = \\frac{${dx(num, 4)}}{${dx(den, 4)}} = ${fd(num, den)}` }
    ];
    const resTot = dx(tot(k1), 4);
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${ctx.texto(p, c)}</span>${preguntas([
        'Dibuja el diagrama de árbol completo, con la probabilidad de cada rama.',
        `¿Cuál es la probabilidad de que ${ctx.un} ${nombreS(k1)}?`,
        `Si ${ctx.un.replace(' elegido al azar', '').replace(' elegida al azar', '')} ${ctx.ei[k2]}, ¿cuál es la probabilidad de que ${ctx.rs[r2]}?`
      ])}</div>`,
      pasos,
      res: resLista([`\\text{árbol (ver pasos)}`, resTot, FD(num, den)])
    };
  }

  /* ================= 4. Álgebra de sucesos ================= */
  /* Todas las probabilidades se manejan en centésimas (enteros). */
  const PA = 'P(A)', PB = 'P(B)', PAB = 'P(A \\cap B)', PU = 'P(A \\cup B)';
  const PNN = `P(${barra('A')} \\cap ${barra('B')})`, PNU = `P(${barra('A')} \\cup ${barra('B')})`;
  const enunSuc = (datos, preg) => `<div class="pend-col"><span class="pend-texto">${datos}</span>${preguntas(preg)}</div>`;
  const val = (s, v) => `\\(${s} = ${h(v)}\\)`;

  /* 4a. Datos P(A), P(B), P(A∩B): unión, De Morgan, condicionadas, independencia (F1, F6, F10) */
  function genSucDatos(R) {
    const caso = R.pick(['indep', 'indep', 'dep', 'dep', 'incomp']);
    let a, b, i;
    if (caso === 'incomp') { do { a = R.int(2, 7) * 10; b = R.int(2, 7) * 10; } while (a + b > 100); i = 0; }
    else {
      a = R.int(3, 8) * 10; b = R.int(3, 8) * 10;
      if (caso === 'indep') i = a * b / 100;
      else { const ops = []; for (let x = Math.max(5, a + b - 100); x <= Math.min(a, b); x += 5) if (x % 5 === 0 && x !== a * b / 100) ops.push(x); i = R.pick(ops); }
    }
    const u = a + b - i, prod = a * b;           // prod en diezmilésimas
    const indep = prod === i * 100, incomp = i === 0;
    const pasos = [
      { t: '1. Unión de dos sucesos:', m: `${PU} = ${PA} + ${PB} - ${PAB} = ${h(a)} + ${h(b)} - ${h(i)} = ${h(u)}` },
      { t: '2. Ley de De Morgan: el contrario de la unión es la intersección de los contrarios.', m: `${PNN} = P\\left(${barra('A \\cup B')}\\right) = 1 - ${PU} = 1 - ${h(u)} = ${h(100 - u)}` },
      { t: '3. Probabilidad condicionada: intersección entre la probabilidad del suceso condicionante.',
        m: `P(A \\mid B) = \\frac{${PAB}}{${PB}} = \\frac{${h(i)}}{${h(b)}} = ${fd(i, b)} \\qquad P(B \\mid A) = \\frac{${PAB}}{${PA}} = \\frac{${h(i)}}{${h(a)}} = ${fd(i, a)}`, multilinea: false },
      { t: `4. Independientes si \\(${PAB} = ${PA} \\cdot ${PB}\\). Incompatibles si \\(${PAB} = 0\\). Aquí \\(${PA} \\cdot ${PB} = ${h(a)} \\cdot ${h(b)} = ${dx(prod, 4)}\\) y \\(${PAB} = ${h(i)}\\):`,
        m: `${indep ? `${PAB} = ${PA}\\cdot ${PB}` : `${PAB} \\neq ${PA}\\cdot ${PB}`}\\ \\Rightarrow\\ \\text{${indep ? 'independientes' : 'no independientes'}} \\qquad ${incomp ? `${PAB} = 0 \\Rightarrow \\text{incompatibles}` : `${PAB} \\neq 0 \\Rightarrow \\text{no incompatibles}`}` }
    ];
    return {
      html: true,
      enun: enunSuc(`Sean A y B dos sucesos con ${val(PA, a)}, ${val(PB, b)} y ${val(PAB, i)}. Calcula:`, [
        `\\(${PU}\\).`, `\\(${PNN}\\).`, '\\(P(A \\mid B)\\) y \\(P(B \\mid A)\\).', '¿Son A y B independientes? ¿Son incompatibles? Justifica la respuesta.'
      ]),
      pasos,
      res: resLista([h(u), h(100 - u), `${FD(i, b)}\\ \\text{y}\\ ${FD(i, a)}`, `\\text{${indep ? 'indep.: sí' : 'indep.: no'}; ${incomp ? 'incomp.: sí' : 'incomp.: no'}}`])
    };
  }

  /* 4b. Dato P(A | B) o P(B | A): intersección, unión, De Morgan (F2, F7, F12) */
  function genSucCond(R) {
    const dadoAB = R.rand() < 0.5;                 // true: P(A|B); false: P(B|A)
    const ops = [];
    for (let cond = 30; cond <= 80; cond += 10) for (let c = 20; c <= 80; c += 10) for (let o = 30; o <= 80; o += 10) {
      const i = cond * c / 100;
      if (i <= o && o + cond - i <= 100 && i !== o && o !== cond) ops.push([cond, c, o]);
    }
    const [cond, cc, o] = R.pick(ops);              // cond = prob. del suceso condicionante; o = prob. del otro
    const a = dadoAB ? o : cond, b = dadoAB ? cond : o;
    const i = cond * cc / 100, u = a + b - i;
    const dato = dadoAB ? 'P(A \\mid B)' : 'P(B \\mid A)';
    const pcond = dadoAB ? PB : PA;
    return {
      html: true,
      enun: enunSuc(`Sean A y B dos sucesos con ${val(PA, a)}, ${val(PB, b)} y ${val(dato, cc)}. Calcula:`,
        [`\\(${PAB}\\).`, `\\(${PU}\\).`, `\\(${PNN}\\).`, `\\(${PNU}\\).`]),
      pasos: [
        { t: `1. Despejamos la intersección de la fórmula de la probabilidad condicionada \\(${dato} = \\frac{${PAB}}{${pcond}}\\):`,
          m: `${PAB} = ${dato} \\cdot ${pcond} = ${h(cc)} \\cdot ${h(cond)} = ${h(i)}` },
        { t: '2. Unión:', m: `${PU} = ${PA} + ${PB} - ${PAB} = ${h(a)} + ${h(b)} - ${h(i)} = ${h(u)}` },
        { t: '3. De Morgan: el contrario de la unión es la intersección de los contrarios.', m: `${PNN} = 1 - ${PU} = 1 - ${h(u)} = ${h(100 - u)}` },
        { t: '4. De Morgan: el contrario de la intersección es la unión de los contrarios.', m: `${PNU} = 1 - ${PAB} = 1 - ${h(i)} = ${h(100 - i)}` }
      ],
      res: resLista([h(i), h(u), h(100 - u), h(100 - i)])
    };
  }

  /* 4c. Datos que faltan: independientes, incompatibles y De Morgan inversa (F3, F4, F5, F8, F9, F11) */
  function genSucFalta(R) {
    const v = R.int(0, 4);
    if (v === 0) {                                  // independientes con P(A), P(B)
      const a = R.int(2, 8) * 10, b = R.int(2, 8) * 10, p4 = a * b, i = p4 / 100, u = a + b - i;
      return {
        html: true,
        enun: enunSuc(`Sean A y B dos sucesos <b>independientes</b> con ${val(PA, a)} y ${val(PB, b)}. Calcula:`, [`\\(${PAB}\\).`, `\\(${PU}\\).`, `\\(${PNU}\\).`, `\\(${PNN}\\).`]),
        pasos: [
          { t: '1. Al ser independientes, la probabilidad de la intersección es el producto:', m: `${PAB} = ${PA} \\cdot ${PB} = ${h(a)} \\cdot ${h(b)} = ${h(i)}` },
          { t: '2. Unión:', m: `${PU} = ${h(a)} + ${h(b)} - ${h(i)} = ${h(u)}` },
          { t: '3. De Morgan: el contrario de la intersección es la unión de los contrarios.', m: `${PNU} = 1 - ${PAB} = 1 - ${h(i)} = ${h(100 - i)}` },
          { t: '4. De Morgan: el contrario de la unión es la intersección de los contrarios.', m: `${PNN} = 1 - ${PU} = 1 - ${h(u)} = ${h(100 - u)}` }
        ],
        res: resLista([h(i), h(u), h(100 - i), h(100 - u)])
      };
    }
    if (v === 1) {                                  // independientes con P(A) y P(A∪B): hallar P(B)
      let a, b; do { a = R.int(2, 7) * 10; b = R.int(2, 8) * 10; } while (a === b);
      const i = a * b / 100, u = a + b - i;
      return {
        html: true,
        enun: enunSuc(`Sean A y B dos sucesos <b>independientes</b> con ${val(PA, a)} y ${val(PU, u)}. Calcula:`, [`\\(${PB}\\).`, `\\(${PAB}\\).`, `\\(${PNN}\\).`]),
        pasos: [
          { t: `1. Al ser independientes, \\(${PAB} = ${PA} \\cdot ${PB}\\). Sustituimos en la fórmula de la unión y despejamos \\(${PB}\\):`, multilinea: true,
            m: `${PU} = ${PA} + ${PB} - ${PA} \\cdot ${PB} \\\\ ${h(u)} = ${h(a)} + ${PB} - ${h(a)} \\cdot ${PB} \\\\ ${h(u - a)} = ${h(100 - a)} \\cdot ${PB} \\\\ ${PB} = \\frac{${h(u - a)}}{${h(100 - a)}} = ${h(b)}` },
          { t: '2. Intersección de independientes:', m: `${PAB} = ${h(a)} \\cdot ${h(b)} = ${h(i)}` },
          { t: '3. De Morgan: el contrario de la unión es la intersección de los contrarios.', m: `${PNN} = 1 - ${PU} = 1 - ${h(u)} = ${h(100 - u)}` }
        ],
        res: resLista([h(b), h(i), h(100 - u)])
      };
    }
    if (v === 2) {                                  // incompatibles con P(A), P(B)
      let a, b; do { a = R.int(2, 9) * 5; b = R.int(2, 9) * 5; } while (a + b > 95);
      const u = a + b;
      return {
        html: true,
        enun: enunSuc(`Sean A y B dos sucesos <b>incompatibles</b> con ${val(PA, a)} y ${val(PB, b)}. Calcula:`, [`\\(${PAB}\\).`, `\\(${PU}\\).`, `\\(${PNN}\\).`, `\\(${PNU}\\).`]),
        pasos: [
          { t: '1. Incompatibles significa que no pueden ocurrir a la vez:', m: `${PAB} = 0` },
          { t: '2. Unión (sin restar nada, porque la intersección es vacía):', m: `${PU} = ${PA} + ${PB} = ${h(a)} + ${h(b)} = ${h(u)}` },
          { t: '3. De Morgan: el contrario de la unión es la intersección de los contrarios.', m: `${PNN} = 1 - ${PU} = 1 - ${h(u)} = ${h(100 - u)}` },
          { t: '4. De Morgan: el contrario de la intersección es la unión de los contrarios.', m: `${PNU} = 1 - ${PAB} = 1 - 0 = 1` }
        ],
        res: resLista(['0', h(u), h(100 - u), '1'])
      };
    }
    if (v === 3) {                                  // incompatibles con P(A) y P(A∪B): hallar P(B)
      let a, b; do { a = R.int(2, 9) * 5; b = R.int(2, 9) * 5; } while (a + b > 95);
      const u = a + b;
      return {
        html: true,
        enun: enunSuc(`A y B son dos sucesos <b>incompatibles</b>. Se sabe que ${val(PA, a)} y ${val(PU, u)}. Calcula:`, [`\\(${PB}\\).`, `\\(${PNN}\\).`, `\\(${PNU}\\).`]),
        pasos: [
          { t: `1. Al ser incompatibles, \\(${PAB} = 0\\), luego \\(${PU} = ${PA} + ${PB}\\) y despejamos:`, m: `${PB} = ${PU} - ${PA} = ${h(u)} - ${h(a)} = ${h(b)}` },
          { t: '2. De Morgan: el contrario de la unión es la intersección de los contrarios.', m: `${PNN} = 1 - ${PU} = 1 - ${h(u)} = ${h(100 - u)}` },
          { t: '3. De Morgan: el contrario de la intersección es la unión de los contrarios, y \\(P(A \\cap B) = 0\\).', m: `${PNU} = 1 - ${PAB} = 1` }
        ],
        res: resLista([h(b), h(100 - u), '1'])
      };
    }
    /* v === 4: De Morgan inversa: P(A), P(B), P(Ā∩B̄) → unión e intersección */
    let a, b, i, x;
    do {
      a = R.int(4, 9) * 5; b = R.int(4, 9) * 5; i = R.int(1, 9) * 5;
      x = 100 - (a + b - i);
    } while (i > Math.min(a, b) || i < a + b - 100 || x <= 0 || i === a * b / 100);
    const u = 100 - x;
    return {
      html: true,
      enun: enunSuc(`Sean A y B dos sucesos con ${val(PA, a)}, ${val(PB, b)} y ${val(PNN, x)}. Calcula:`, [`\\(${PU}\\).`, `\\(${PAB}\\).`, '\\(P(A \\mid B)\\).']),
      pasos: [
        { t: '1. De Morgan: \\(' + PNN + ' = 1 - ' + PU + '\\), luego despejamos la unión:', m: `${PU} = 1 - ${PNN} = 1 - ${h(x)} = ${h(u)}` },
        { t: `2. De la fórmula de la unión \\(${PU} = ${PA} + ${PB} - ${PAB}\\) despejamos la intersección:`, m: `${PAB} = ${PA} + ${PB} - ${PU} = ${h(a)} + ${h(b)} - ${h(u)} = ${h(i)}` },
        { t: '3. Probabilidad condicionada:', m: `P(A \\mid B) = \\frac{${PAB}}{${PB}} = \\frac{${h(i)}}{${h(b)}} = ${fd(i, b)}` }
      ],
      res: resLista([h(u), h(i), FD(i, b)])
    };
  }

  const ENUN = ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'];
  registrarFicha({
    id: 'probabilidad',
    titulo: 'Probabilidad',
    detalle: 'Matemáticas CC.SS. II · PAU Extremadura',
    grupo: 'Probabilidad y combinatoria',
    enlace: '../probabilidad/probabilidad.html',
    ejercicios: [
      { id: 'tabla', nombre: 'Tabla de contingencia', peso: 1.5, columnas: 1, enunciado: ENUN, generar: genTabla },
      { id: 'arb2', nombre: 'Árbol de probabilidad (2 ramas): probabilidad total y Bayes', peso: 1.5, columnas: 1, enunciado: ENUN, generar: R => genArbol(R, CTX_ARBOL2) },
      { id: 'arb3', nombre: 'Árbol de probabilidad (3 ramas): probabilidad total y Bayes', peso: 2, columnas: 1, enunciado: ENUN, generar: R => genArbol(R, CTX_ARBOL3) },
      { id: 'suc-dat', nombre: 'Álgebra de sucesos: unión, De Morgan, condicionada e independencia', peso: 1, columnas: 1, enunciado: ENUN, generar: genSucDatos },
      { id: 'suc-cond', nombre: 'Álgebra de sucesos: dato de probabilidad condicionada', peso: 1, columnas: 1, enunciado: ENUN, generar: genSucCond },
      { id: 'suc-falta', nombre: 'Álgebra de sucesos: independientes, incompatibles y datos que faltan', peso: 1, columnas: 1, enunciado: ENUN, generar: genSucFalta }
    ]
  });
})();
