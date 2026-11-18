/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Probabilidad de sucesos en contexto (CC.SS. II · PAU Extremadura).
   Mismos 8 tipos y contextos que la ficha probabilidad/prob-sucesos.html: unión de sucesos,
   probabilidad condicionada y unión, sucesos independientes y De Morgan, sucesos incompatibles,
   probabilidad condicionada pedida, unión de independientes, intersección a partir de «ninguna»
   y «ni jardín ni garaje».
   Diferencia con la ficha: la ficha genera probabilidades aleatorias con 3 decimales y pide
   redondear; en el examen los datos se ajustan para que todo se haga a mano sin calculadora
   (porcentajes enteros, probabilidades de las máquinas y sensores con una cifra decimal,
   y cocientes de probabilidad condicionada con resultado decimal exacto). Todas las
   comprobaciones de coherencia (unión ≤ 1, intersección ≤ cada suceso) se mantienen. */
(function () {
  'use strict';
  const { registrarFicha, mcd } = window.EX;

  /* Los cálculos se hacen con enteros (centésimas) para evitar errores de coma flotante.
     D(k, cifras): k / 10^cifras con coma decimal española, sin ceros finales, para usar dentro de TeX. */
  const D = (k, cif = 2) => {
    const s = String(k).padStart(cif + 1, '0');
    const ent = s.slice(0, s.length - cif), dec = s.slice(s.length - cif).replace(/0+$/, '');
    return dec ? `${ent}{,}${dec}` : ent;
  };
  const pct = k => `${k}&nbsp;%`;                       // porcentaje en texto del enunciado
  const wrap = (txt, preg) => `<div class="pend-col"><span class="pend-texto">${txt}</span><span class="pend-texto"><b>${preg}</b></span></div>`;
  const res = (k, cif = 2, nombre = 'P') => `${nombre} = ${D(k, cif)}`;

  /* Cociente a/b es decimal exacto con a lo sumo 3 decimales (denominador reducido divisor de 1000) */
  const exacto = (a, b) => { const d = b / mcd(a, b); return 1000 % d === 0; };

  /* ================= 1. Dos periódicos (unión) ================= */
  /* Ficha: P(D) y P(I) entre 0,2 y 0,8; P(D∩I) entre max(0, P(D)+P(I)-1) y min(P(D), P(I)) */
  function genPeriodicos(R) {
    const a = R.int(20, 80), b = R.int(20, 80);
    const c = R.int(Math.max(5, a + b - 95), Math.min(a, b));   // unión ≤ 0,95
    const u = a + b - c;
    return {
      html: true,
      enun: wrap(`En una ciudad, el ${pct(a)} de los adultos lee el periódico digital, el ${pct(b)} lee el periódico impreso y el ${pct(c)} lee ambos formatos.`,
        'Si se elige un adulto al azar, calcula la probabilidad de que lea al menos uno de los dos formatos (digital o impreso).'),
      pasos: [
        { t: 'Llamamos \\(D\\) a «lee el digital» e \\(I\\) a «lee el impreso». Pasamos los porcentajes a probabilidades:', m: `P(D) = ${D(a)},\\quad P(I) = ${D(b)},\\quad P(D \\cap I) = ${D(c)}` },
        { t: '«Al menos uno de los dos» es la unión. Al sumar \\(P(D)\\) y \\(P(I)\\), los que leen ambos se cuentan dos veces, así que se resta la intersección:', m: `P(D \\cup I) = P(D) + P(I) - P(D \\cap I) = ${D(a)} + ${D(b)} - ${D(c)} = ${D(u)}` }
      ],
      res: res(u, 2, 'P(D \\cup I)')
    };
  }

  /* ================= 2. Hipertensión y diabetes (condicionada → unión) ================= */
  /* Ficha: P(D) 0,2–0,7; P(H|D) 0,3–0,8; P(H) entre max(P(H∩D)+0,05; 0,2) y 0,95, con P(H∪D) ≤ 1.
     Aquí P(D) es múltiplo de 10 % y P(H|D) tiene una cifra decimal: P(H∩D) sale exacta en centésimas. */
  function genSalud(R) {
    const pb = R.int(2, 7) * 10, h = R.int(3, 8);          // P(D) en %, P(H|D) = h/10
    const ab = pb * h / 10;                                // P(H∩D) en %
    const lo = Math.max(ab + 5, 20), hi = Math.min(95, ab + 50, 95 - pb + ab);   // unión ≤ 0,95
    const pa = R.int(lo, hi);
    const u = pa + pb - ab;
    return {
      html: true,
      enun: wrap(`En un centro de salud, el ${pct(pa)} de los pacientes tiene hipertensión y el ${pct(pb)} tiene diabetes. Además, se sabe que la probabilidad de que un paciente tenga hipertensión dado que tiene diabetes es ${D(h, 1).replace('{,}', ',')}.`,
        'Calcula la probabilidad de que un paciente elegido al azar tenga hipertensión o diabetes.'),
      pasos: [
        { t: 'Llamamos \\(H\\) a «tiene hipertensión» y \\(D\\) a «tiene diabetes». Los datos son:', m: `P(H) = ${D(pa)},\\quad P(D) = ${D(pb)},\\quad P(H \\mid D) = ${D(h, 1)}` },
        { t: 'Para la unión necesitamos la intersección, que sale de la probabilidad condicionada \\(P(H \\mid D) = \\dfrac{P(H \\cap D)}{P(D)}\\):', m: `P(H \\cap D) = P(H \\mid D) \\cdot P(D) = ${D(h, 1)} \\cdot ${D(pb)} = ${D(ab)}` },
        { t: 'Aplicamos la fórmula de la unión:', m: `P(H \\cup D) = P(H) + P(D) - P(H \\cap D) = ${D(pa)} + ${D(pb)} - ${D(ab)} = ${D(u)}` }
      ],
      res: res(u, 2, 'P(H \\cup D)')
    };
  }

  /* ================= 3. Máquinas independientes (De Morgan) ================= */
  /* Ficha: P(avería) de cada máquina entre 0,3 y 0,8. Aquí con una cifra decimal (0,3 … 0,8). */
  function genMaquinas(R) {
    const a = R.int(3, 8), b = R.int(3, 8);
    const ab = a * b, r = 100 - ab;                        // centésimas
    return {
      html: true,
      enun: wrap(`En una fábrica, dos máquinas funcionan de forma independiente. La probabilidad de que la máquina A se averíe en un día es ${D(a, 1).replace('{,}', ',')} y la probabilidad de que la máquina B se averíe es ${D(b, 1).replace('{,}', ',')}.`,
        'Calcula la probabilidad de que al menos una de las dos máquinas no se averíe (es decir, que la máquina A funcione o la máquina B funcione). Aplica las leyes de De Morgan si lo necesitas.'),
      pasos: [
        { t: 'Sean \\(A\\) «la máquina A se avería» y \\(B\\) «la máquina B se avería». Pedimos que alguna funcione, es decir, la unión de los sucesos contrarios:', m: `P(\\overline{A} \\cup \\overline{B})` },
        { t: 'Por las leyes de De Morgan, \\(\\overline{A} \\cup \\overline{B} = \\overline{A \\cap B}\\). Por tanto, es el contrario de que se averíen las dos:', m: `P(\\overline{A} \\cup \\overline{B}) = 1 - P(A \\cap B)` },
        { t: 'Las máquinas son independientes, así que la probabilidad de la intersección es el producto:', m: `P(A \\cap B) = P(A) \\cdot P(B) = ${D(a, 1)} \\cdot ${D(b, 1)} = ${D(ab)}` },
        { t: 'Calculamos el contrario:', m: `P(\\overline{A} \\cup \\overline{B}) = 1 - ${D(ab)} = ${D(r)}` }
      ],
      res: res(r, 2, 'P(\\overline{A} \\cup \\overline{B})')
    };
  }

  /* ================= 4. Concurso (incompatibles) ================= */
  /* Ficha: P(viaje) 0,2–0,5; P(coche) 0,1–min(0,5; 1−P(viaje)) */
  function genConcurso(R) {
    const a = R.int(20, 50), b = R.int(10, Math.min(50, 100 - a));
    const u = a + b;
    return {
      html: true,
      enun: wrap(`En un concurso de televisión, los concursantes solo pueden ganar un único premio. El ${pct(a)} de los concursantes gana un viaje y el ${pct(b)} gana un coche. Los premios son mutuamente excluyentes (no se pueden ganar ambos).`,
        'Calcula la probabilidad de que un concursante elegido al azar gane algún premio.'),
      pasos: [
        { t: 'Llamamos \\(V\\) a «gana un viaje» y \\(C\\) a «gana un coche». Los datos, como probabilidades:', m: `P(V) = ${D(a)},\\quad P(C) = ${D(b)}` },
        { t: 'Los sucesos son incompatibles (no pueden darse a la vez), luego \\(P(V \\cap C) = 0\\) y la unión es simplemente la suma:', m: `P(V \\cup C) = P(V) + P(C) = ${D(a)} + ${D(b)} = ${D(u)}` }
      ],
      res: res(u, 2, 'P(V \\cup C)')
    };
  }

  /* ================= 5. Universidad (probabilidad condicionada) ================= */
  /* Ficha: P(E) 0,3–0,7; P(M∩E) entre 0,05 y P(E)−0,05; P(M) entre P(M∩E)+0,05 y min(0,95; P(M∩E)+0,5).
     Aquí P(E) es múltiplo de 10 % y se exige que P(M∩E)/P(E) sea un decimal exacto (≤ 3 cifras). */
  function genUniversidad(R) {
    let pb, ab;
    do { pb = R.int(3, 7) * 10; ab = R.int(5, pb - 5); } while (!exacto(ab, pb));
    let lo = ab + 5, hi = Math.min(95, ab + 50, 100 - pb + ab);
    const pa = R.int(lo, hi);
    const r = ab * 1000 / pb;                              // milésimas, entero por el filtro anterior
    return {
      html: true,
      enun: wrap(`En una universidad, el ${pct(pa)} de los estudiantes aprueba Matemáticas, el ${pct(pb)} aprueba Estadística y el ${pct(ab)} aprueba ambas asignaturas.`,
        'Si se elige un estudiante que ha aprobado Estadística, ¿cuál es la probabilidad de que también haya aprobado Matemáticas?'),
      pasos: [
        { t: 'Llamamos \\(M\\) a «aprueba Matemáticas» y \\(E\\) a «aprueba Estadística». Los datos, como probabilidades:', m: `P(M) = ${D(pa)},\\quad P(E) = ${D(pb)},\\quad P(M \\cap E) = ${D(ab)}` },
        { t: 'Nos piden la probabilidad condicionada de M sabiendo que ocurre E (el total pasa a ser solo el grupo E):', m: `P(M \\mid E) = \\frac{P(M \\cap E)}{P(E)} = \\frac{${D(ab)}}{${D(pb)}} = \\frac{${ab}}{${pb}} = ${D(r, 3)}` },
        { t: 'El dato \\(P(M)\\) no se necesita para este apartado.' }
      ],
      res: res(r, 3, 'P(M \\mid E)')
    };
  }

  /* ================= 6. Sensores independientes (unión) ================= */
  /* Ficha: P de cada sensor entre 0,2 y 0,6 (aquí con una cifra decimal). */
  function genSensores(R) {
    const a = R.int(2, 6), b = R.int(2, 6);
    const ab = a * b, u = 10 * a + 10 * b - ab;            // centésimas
    return {
      html: true,
      enun: wrap(`En un sistema de seguridad se instalan dos sensores de movimiento que funcionan de forma independiente. La probabilidad de que el primer sensor detecte un intruso es ${D(a, 1).replace('{,}', ',')} y la probabilidad de que el segundo sensor lo detecte es ${D(b, 1).replace('{,}', ',')}.`,
        'Calcula la probabilidad de que al menos uno de los dos sensores detecte al intruso.'),
      pasos: [
        { t: 'Sean \\(S_1\\) «el primer sensor detecta» y \\(S_2\\) «el segundo sensor detecta». Al ser independientes, la intersección es el producto:', m: `P(S_1 \\cap S_2) = P(S_1) \\cdot P(S_2) = ${D(a, 1)} \\cdot ${D(b, 1)} = ${D(ab)}` },
        { t: '«Al menos uno» es la unión:', m: `P(S_1 \\cup S_2) = P(S_1) + P(S_2) - P(S_1 \\cap S_2) = ${D(a, 1)} + ${D(b, 1)} - ${D(ab)} = ${D(u)}` },
        { t: 'Comprobación con el suceso contrario: no detecta ninguno con probabilidad \\(P(\\overline{S_1}) \\cdot P(\\overline{S_2})\\), y su contrario es la unión:', m: `1 - ${D(10 - a, 1)} \\cdot ${D(10 - b, 1)} = 1 - ${D((10 - a) * (10 - b))} = ${D(u)}` }
      ],
      res: res(u, 2, 'P(S_1 \\cup S_2)')
    };
  }

  /* ================= 7. Redes sociales (intersección a partir de «ninguna») ================= */
  /* Ficha: P(I), P(T) entre 0,3 y 0,7; P(I∪T) entre max(P(I), P(T)) y min(1, P(I)+P(T)).
     Aquí P(I∪T) ≤ 0,95 (para que «ninguna» no sea 0) y la intersección es al menos 0,05. */
  function genRedes(R) {
    let a, b, u;
    do {
      a = R.int(30, 70); b = R.int(30, 70);
      const lo = Math.max(a, b), hi = Math.min(95, a + b - 5);
      u = lo <= hi ? R.int(lo, hi) : 0;
    } while (!u);
    const ni = 100 - u, c = a + b - u;
    return {
      html: true,
      enun: wrap(`Una empresa realiza una encuesta sobre el uso de redes sociales. El ${pct(a)} de los jóvenes usa Instagram, el ${pct(b)} usa TikTok y el ${pct(ni)} no usa ninguna de las dos redes.`,
        'Calcula la probabilidad de que un joven elegido al azar use ambas redes sociales (Instagram y TikTok).'),
      pasos: [
        { t: 'Llamamos \\(I\\) a «usa Instagram» y \\(T\\) a «usa TikTok». Los datos, como probabilidades (la tercera es la de «ninguna», el contrario de la unión):', m: `P(I) = ${D(a)},\\quad P(T) = ${D(b)},\\quad P(\\overline{I \\cup T}) = ${D(ni)}` },
        { t: 'Usamos el suceso contrario para obtener la unión:', m: `P(I \\cup T) = 1 - P(\\overline{I \\cup T}) = 1 - ${D(ni)} = ${D(u)}` },
        { t: 'De la fórmula \\(P(I \\cup T) = P(I) + P(T) - P(I \\cap T)\\) despejamos la intersección:', m: `P(I \\cap T) = P(I) + P(T) - P(I \\cup T) = ${D(a)} + ${D(b)} - ${D(u)} = ${D(c)}` }
      ],
      res: res(c, 2, 'P(I \\cap T)')
    };
  }

  /* ================= 8. Viviendas (ni jardín ni garaje) ================= */
  /* Ficha: P(J) 0,4–0,8; P(G) 0,3–0,7; P(G|J) dado. Aquí P(J) es múltiplo de 10 % y P(G|J) = h/10;
     se exige P(G∩J) ≤ P(G) y P(J ∪ G) ≤ 0,95. */
  function genViviendas(R) {
    let pj, pg, h, c, u;
    do {
      pj = R.int(4, 8) * 10; pg = R.int(30, 70); h = R.int(2, 8);
      c = pj * h / 10; u = pj + pg - c;
    } while (c > pg || u > 95);
    const r = 100 - u;
    return {
      html: true,
      enun: wrap(`En una ciudad, el ${pct(pj)} de las viviendas tiene jardín y el ${pct(pg)} tiene garaje. La probabilidad de que una vivienda tenga garaje sabiendo que tiene jardín es ${D(h, 1).replace('{,}', ',')}.`,
        'Calcula la probabilidad de que una vivienda elegida al azar no tenga ni jardín ni garaje.'),
      pasos: [
        { t: 'Llamamos \\(J\\) a «tiene jardín» y \\(G\\) a «tiene garaje». Los datos, como probabilidades:', m: `P(J) = ${D(pj)},\\quad P(G) = ${D(pg)},\\quad P(G \\mid J) = ${D(h, 1)}` },
        { t: 'Intersección, a partir de la probabilidad condicionada \\(P(G \\mid J) = \\dfrac{P(G \\cap J)}{P(J)}\\):', m: `P(G \\cap J) = P(G \\mid J) \\cdot P(J) = ${D(h, 1)} \\cdot ${D(pj)} = ${D(c)}` },
        { t: 'Unión («tiene jardín o garaje»):', m: `P(J \\cup G) = P(J) + P(G) - P(G \\cap J) = ${D(pj)} + ${D(pg)} - ${D(c)} = ${D(u)}` },
        { t: '«Ni jardín ni garaje» es el suceso contrario de la unión (ley de De Morgan: \\(\\overline{J} \\cap \\overline{G} = \\overline{J \\cup G}\\)):', m: `P(\\overline{J} \\cap \\overline{G}) = 1 - P(J \\cup G) = 1 - ${D(u)} = ${D(r)}` }
      ],
      res: res(r, 2, 'P(\\overline{J} \\cap \\overline{G})')
    };
  }

  const ENUN = ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'];
  registrarFicha({
    id: 'prob-sucesos',
    titulo: 'Probabilidad de sucesos en contexto',
    detalle: 'Matemáticas CC.SS. II · PAU Extremadura',
    grupo: 'Probabilidad y combinatoria',
    enlace: '../probabilidad/prob-sucesos.html',
    ejercicios: [
      { id: 'periodicos', nombre: 'Unión de dos sucesos (periódicos)', peso: 1, columnas: 2, enunciado: ENUN, generar: genPeriodicos },
      { id: 'salud', nombre: 'Condicionada y unión (hipertensión y diabetes)', peso: 1.5, columnas: 2, enunciado: ENUN, generar: genSalud },
      { id: 'maquinas', nombre: 'Independientes y De Morgan (máquinas)', peso: 1.5, columnas: 2, enunciado: ENUN, generar: genMaquinas },
      { id: 'concurso', nombre: 'Sucesos incompatibles (concurso)', peso: 1, columnas: 2, enunciado: ENUN, generar: genConcurso },
      { id: 'universidad', nombre: 'Probabilidad condicionada (universidad)', peso: 1, columnas: 2, enunciado: ENUN, generar: genUniversidad },
      { id: 'sensores', nombre: 'Unión de independientes (sensores)', peso: 1, columnas: 2, enunciado: ENUN, generar: genSensores },
      { id: 'redes', nombre: 'Intersección a partir de «ninguna» (redes sociales)', peso: 1.5, columnas: 2, enunciado: ENUN, generar: genRedes },
      { id: 'viviendas', nombre: 'Ni jardín ni garaje (viviendas)', peso: 1.5, columnas: 2, enunciado: ENUN, generar: genViviendas }
    ]
  });
})();
