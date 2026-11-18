/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Árbol de probabilidad (Matemáticas CC.SS. II, PAU Extremadura).
   Mismos contextos y datos que la ficha probabilidad/arbol-prob.html: cinco escenarios extremeños
   (cerezas de La Vera, especialistas de Badajoz, carreras de la UEx, Torta del Casar y jamón de dehesa)
   con un árbol de dos niveles (A / A′ y B / B′) y preguntas de intersección, probabilidad condicionada,
   probabilidad total y teorema de Bayes.
   Diferencias respecto a la ficha:
   · En el examen el árbol es un dibujo (la ficha usa casillas) que el alumno debe completar a mano.
   · El examen incluye dos tipos: el completo (árbol + las cuatro preguntas, como la ficha) y uno corto
     (árbol + probabilidad total + Bayes).
   · Los enunciados se redactan con el modo verbal correcto («Si se comprueba que el queso tiene…»,
     «sea traumatólogo» en lugar de «sea de traumatólogo»).
   · La ficha usa datos fijos en cada escenario; aquí los porcentajes varían (múltiplos de 5) para que cada
     modelo del examen tenga números distintos. Los resultados se dan en decimal (hasta 4 cifras) y, si
     no son exactos, en fracción con su aproximación. */
(function () {
  'use strict';
  const { tex, registrarFicha, fr, pend } = window.EX;
  const { frac } = tex;
  const { Lienzo, dec, rd } = pend;
  const NB = ' ';

  /* ---------- Aritmética exacta con fracciones ---------- */
  const mul = (a, b) => fr(a.n * b.n, a.d * b.d);
  const add = (a, b) => fr(a.n * b.d + b.n * a.d, a.d * b.d);
  const sub1 = a => fr(a.d - a.n, a.d);
  const div = (a, b) => fr(a.n * b.d, a.d * b.n);
  const val = f => f.n / f.d;
  const exacto = f => Math.abs(rd(val(f), 4) - val(f)) < 1e-12;
  /* Valor en TeX: decimal con coma si es exacto (≤ 4 cifras), si no fracción */
  const tv = f => (exacto(f) ? dec(val(f), 4) : frac(f));
  /* Resultado: decimal y fracción */
  const ans = f => {
    if (exacto(f)) return dec(val(f), 4) + (f.d !== 1 ? ` = ${frac(f)}` : '');
    return `${frac(f)} \\approx ${dec(val(f), 4)}`;
  };
  /* Etiqueta de rama (texto plano): decimal con coma o fracción a/b */
  const lab = f => (exacto(f) ? dec(val(f), 4).replace('{,}', ',') : `${f.n}/${f.d}`);

  /* ---------- Escenarios (de la ficha) ----------
     Los contextos son los de la ficha; los porcentajes varían en cada modelo (múltiplos de 5),
     para que «Crear otro modelo» dé números distintos. */
  const pc = k => `${k}${NB}%`;
  const ESC = [
    {
      art: 'una', det: 'la', suj: 'cereza',
      texto: (a, b, c) => `En la <b>comarca de La Vera (Cáceres)</b>, una empresa comercializa cerezas. El <b>${pc(a)} de las cerezas son de la variedad «Picota»</b> y el <b>${pc(100 - a)} de la variedad «Ambrunés»</b>. La probabilidad de que una cereza <b>Picota esté en estado óptimo</b> es del <b>${pc(b)}</b>, mientras que para la variedad Ambrunés es del <b>${pc(c)}</b>.`,
      sub: { A: 'sea de la variedad Picota', nA: 'sea de la variedad Ambrunés', B: 'esté en estado óptimo', nB: 'no esté en estado óptimo' },
      ind: { A: 'es de la variedad Picota', nA: 'es de la variedad Ambrunés', B: 'está en estado óptimo', nB: 'no está en estado óptimo' }
    },
    {
      art: 'un', det: 'el', suj: 'especialista',
      texto: (a, b, c) => `En el <b>Hospital Universitario de Badajoz</b>, el <b>${pc(a)} de los especialistas son traumatólogos</b> y el <b>${pc(100 - a)} son cardiólogos</b>. La probabilidad de <b>acertar un diagnóstico</b> es del <b>${pc(b)}</b> para los traumatólogos y del <b>${pc(c)}</b> para los cardiólogos.`,
      sub: { A: 'sea traumatólogo', nA: 'sea cardiólogo', B: 'acierte el diagnóstico', nB: 'no acierte el diagnóstico' },
      ind: { A: 'es traumatólogo', nA: 'es cardiólogo', B: 'acierta el diagnóstico', nB: 'no acierta el diagnóstico' }
    },
    {
      art: 'un', det: 'el', suj: 'estudiante',
      texto: (a, b, c) => `En la <b>Universidad de Extremadura (Badajoz)</b>, el <b>${pc(a)} de los estudiantes cursan ADE</b> y el <b>${pc(100 - a)} Ingeniería Informática</b>. La probabilidad de <b>aprobar el proyecto de fin de estudios</b> es del <b>${pc(b)}</b> para los estudiantes de ADE y del <b>${pc(c)}</b> para los de Ingeniería Informática.`,
      sub: { A: 'estudie ADE', nA: 'estudie Ingeniería Informática', B: 'apruebe el proyecto', nB: 'suspenda el proyecto' },
      ind: { A: 'estudia ADE', nA: 'estudia Ingeniería Informática', B: 'aprueba el proyecto', nB: 'suspende el proyecto' }
    },
    {
      art: 'un', det: 'el', suj: 'queso',
      texto: (a, b, c) => `En una cooperativa de la <b>Denominación de Origen Torta del Casar</b>, el <b>${pc(a)} de los quesos son de leche cruda</b> y el <b>${pc(100 - a)} de leche pasteurizada</b>. La probabilidad de obtener la <b>calificación «Extra»</b> es del <b>${pc(b)}</b> para los de leche cruda y del <b>${pc(c)}</b> para los de leche pasteurizada.`,
      sub: { A: 'sea de leche cruda', nA: 'sea de leche pasteurizada', B: 'tenga calificación Extra', nB: 'no tenga calificación Extra' },
      ind: { A: 'es de leche cruda', nA: 'es de leche pasteurizada', B: 'tiene calificación Extra', nB: 'no tiene calificación Extra' }
    },
    {
      art: 'un', det: 'el', suj: 'jamón',
      texto: (a, b, c) => `En una <b>dehesa extremeña de Cáceres</b>, el <b>${pc(a)} de los jamones son de cebo</b> y el <b>${pc(100 - a)} de bellota</b>. La probabilidad de obtener la <b>calificación «Premium»</b> es del <b>${pc(b)}</b> para los de cebo y del <b>${pc(c)}</b> para los de bellota.`,
      sub: { A: 'sea de cebo', nA: 'sea de bellota', B: 'tenga calificación Premium', nB: 'no tenga calificación Premium' },
      ind: { A: 'es de cebo', nA: 'es de bellota', B: 'tiene calificación Premium', nB: 'no tiene calificación Premium' }
    }
  ];
  /* Escenario con datos: P(A) entre 30 % y 70 %; P(B|A) y P(B|A′) entre 50 % y 95 %, distintas
     (los rangos de la ficha: 40–70 %, 60–95 % y 33–95 %) */
  function escenario(R) {
    const base = R.pick(ESC);
    let a, b, c;
    do { a = 5 * R.int(6, 14); b = 5 * R.int(10, 19); c = 5 * R.int(10, 19); } while (a === 50 || Math.abs(b - c) < 10);
    return { ...base, texto: base.texto(a, b, c), pA: fr(a, 100), pBA: fr(b, 100), pBnA: fr(c, 100) };
  }

  /* Probabilidades derivadas de un escenario */
  function datos(sc) {
    const pS = { A: sc.pA, nA: sub1(sc.pA) };
    const pT = { A: { B: sc.pBA, nB: sub1(sc.pBA) }, nA: { B: sc.pBnA, nB: sub1(sc.pBnA) } };
    const J = { A: {}, nA: {} };
    ['A', 'nA'].forEach(s => ['B', 'nB'].forEach(t => { J[s][t] = mul(pS[s], pT[s][t]); }));
    const pB = { B: add(J.A.B, J.nA.B), nB: add(J.A.nB, J.nA.nB) };
    return { pS, pT, J, pB };
  }

  /* Símbolos TeX */
  const SS = { A: 'A', nA: '\\overline{A}', B: 'B', nB: '\\overline{B}' };
  const TXT = { A: 'A', nA: 'A′', B: 'B', nB: 'B′' };

  /* ---------- Árbol (SVG en blanco y negro) ---------- */
  function arbol(D, completo) {
    const L = Lienzo(), X1 = 84, X2 = 190, Y1 = 50, Y2 = 22;
    const etiqueta = (x, y, f) => {
      if (completo) L.texto(x, y, lab(f), { tam: 11 });
      else {
        L.poligono([[x - 15, y - 10], [x + 15, y - 10], [x + 15, y + 3], [x - 15, y + 3]], { relleno: '#fff', grosor: 0.8 });
      }
    };
    [['A', -Y1], ['nA', Y1]].forEach(([s, y1], i) => {
      L.linea(0, 0, X1, y1, { grosor: 1.1 });
      etiqueta(X1 / 2 + (i === 0 ? -16 : -16), y1 / 2 + (i === 0 ? -8 : 17), D.pS[s]);
      L.circulo(X1, y1, 9, { relleno: s === 'A' ? '#fff' : '#d0d0d0', grosor: 1 }).texto(X1, y1 + 4, TXT[s], { tam: 10.5, peso: 600 });
      [['B', -Y2], ['nB', Y2]].forEach(([t, dy], j) => {
        const y2 = y1 + dy;
        L.linea(X1 + 9, y1, X2, y2, { grosor: 1.1 });
        etiqueta((X1 + 9 + X2) / 2 + (j === 0 ? -8 : -8), (y1 + y2) / 2 + (j === 0 ? -6 : 16), D.pT[s][t]);
        L.circulo(X2, y2, 9, { relleno: t === 'B' ? '#fff' : '#d0d0d0', grosor: 1 }).texto(X2, y2 + 4, TXT[t], { tam: 10.5, peso: 600 });
        L.texto(X2 + 16, y2 + 4, `${TXT[s]} ∩ ${TXT[t]}` + (completo ? ` = ${lab(D.J[s][t])}` : ''), { ancla: 'start', tam: 11 });
      });
    });
    L.punto(0, 0, 2.5);
    return L.cerrar('pend-fig', 'Diagrama de árbol con los sucesos A, A′, B y B′');
  }

  /* ---------- Enunciados de las preguntas ---------- */
  const sujeto = sc => `${sc.art} ${sc.suj}`;
  const Q = {
    inter: (sc, s, t) => `¿Cuál es la probabilidad de que ${sujeto(sc)} ${sc.sub[s]} <b>y</b> ${sc.sub[t]}?`,
    cond: (sc, s, t) => `Si sabemos que ${sujeto(sc)} ${sc.ind[s]}, ¿qué probabilidad hay de que ${sc.sub[t]}?`,
    total: (sc, t) => `¿Cuál es la probabilidad de que ${sujeto(sc)} ${sc.sub[t]}?`,
    bayes: (sc, s, t) => `Si se comprueba que ${sujeto(sc)} ${sc.ind[t]}, ¿qué probabilidad hay de que ${sc.sub[s]}?`
  };
  const lista = arr => `<span class="pend-texto">${arr.map((q, k) => `${k + 1}. ${q}`).join('<br>')}</span>`;
  const sucesos = sc => `Llamamos <b>A</b> al suceso «${sc.det} ${sc.suj} ${sc.ind.A}» (y <b>A′</b> a su contrario: «${sc.det} ${sc.suj} ${sc.ind.nA}»), y <b>B</b> al suceso «${sc.det} ${sc.suj} ${sc.ind.B}» (y <b>B′</b> a su contrario: «${sc.det} ${sc.suj} ${sc.ind.nB}»).`;

  /* ---------- Pasos de solución ---------- */
  const pasoArbol = (sc, D) => [
    { t: `Datos del enunciado: \\(P(A) = ${tv(D.pS.A)}\\), \\(P(B \\mid A) = ${tv(D.pT.A.B)}\\) y \\(P(B \\mid \\overline{A}) = ${tv(D.pT.nA.B)}\\).` },
    {
      t: 'Las dos ramas que salen de cada nodo suman 1, así que cada probabilidad que falta es el complemento a 1 de su «hermana»:',
      m: `P(\\overline{A}) = 1 - ${tv(D.pS.A)} = ${tv(D.pS.nA)} \\\\ P(\\overline{B} \\mid A) = 1 - ${tv(D.pT.A.B)} = ${tv(D.pT.A.nB)} \\\\ P(\\overline{B} \\mid \\overline{A}) = 1 - ${tv(D.pT.nA.B)} = ${tv(D.pT.nA.nB)}`,
      multilinea: true
    },
    { t: 'Árbol completo (en cada extremo se indica la probabilidad de la intersección, producto de las dos ramas que llevan hasta él):', html: arbol(D, true) }
  ];
  const pasoInter = (D, s, t) => {
    const r = D.J[s][t];
    return {
      t: 'Intersección: se multiplican las dos probabilidades de la rama del árbol que lleva a este resultado.',
      m: `P(${SS[s]} \\cap ${SS[t]}) = P(${SS[s]}) \\cdot P(${SS[t]} \\mid ${SS[s]}) = ${tv(D.pS[s])} \\cdot ${tv(D.pT[s][t])} = ${ans(r)}`,
      r
    };
  };
  const pasoCond = (D, s, t) => {
    const r = D.pT[s][t];
    return {
      t: 'Probabilidad condicionada: aparece directamente en una rama del segundo nivel del árbol (la que sale del nodo que ya se conoce).',
      m: `P(${SS[t]} \\mid ${SS[s]}) = ${ans(r)}`,
      r
    };
  };
  const pasoTotal = (D, t) => {
    const r = D.pB[t];
    return {
      t: `Probabilidad total: se suman las dos ramas del árbol que terminan en \\(${SS[t]}\\) (se pasa por \\(A\\) o por \\(\\overline{A}\\), sucesos incompatibles).`,
      m: `P(${SS[t]}) = P(A \\cap ${SS[t]}) + P(\\overline{A} \\cap ${SS[t]}) = ${tv(D.J.A[t])} + ${tv(D.J.nA[t])} = ${ans(r)}`,
      r
    };
  };
  const pasoBayes = (D, s, t) => {
    const r = div(D.J[s][t], D.pB[t]);
    return {
      t: `Teorema de Bayes: se divide la rama concreta (\\(${SS[s]} \\cap ${SS[t]}\\)) entre la suma de todas las ramas que llevan a \\(${SS[t]}\\), es decir, entre \\(P(${SS[t]})\\) calculada por la probabilidad total.`,
      m: `P(${SS[s]} \\mid ${SS[t]}) = \\frac{P(${SS[s]} \\cap ${SS[t]})}{P(${SS[t]})} = \\frac{${tv(D.J[s][t])}}{${tv(D.pB[t])}} = ${ans(r)}`,
      r
    };
  };

  const resLista = arr => arr.map((v, k) => `${k + 1})\\ ${v}`).join(',\\quad ');
  const cabecera = (sc, intro) => `<span class="pend-texto">${sc.texto}</span><span class="pend-texto">${sucesos(sc)}</span>${intro ? `<span class="pend-texto">${intro}</span>` : ''}`;

  /* ================= 1. Árbol completo: árbol + 4 preguntas ================= */
  /* Ficha: árbol (2 pts) y 4 preguntas (intersección, condicionada, total, Bayes) de 2 pts cada una */
  function genCompleto(R) {
    const sc = escenario(R), D = datos(sc);
    const v1 = R.int(0, 3), v2 = R.int(0, 3), v3 = R.int(0, 1), v4 = R.int(0, 3);
    const s1 = v1 >> 1 ? 'nA' : 'A', t1 = v1 & 1 ? 'nB' : 'B';
    const s2 = v2 & 1 ? 'nA' : 'A', t2 = v2 >> 1 ? 'nB' : 'B';
    const t3 = v3 ? 'nB' : 'B';
    const s4 = v4 >> 1 ? 'nA' : 'A', t4 = v4 & 1 ? 'nB' : 'B';
    const p1 = pasoInter(D, s1, t1), p2 = pasoCond(D, s2, t2), p3 = pasoTotal(D, t3), p4 = pasoBayes(D, s4, t4);
    const pasos = pasoArbol(sc, D);
    pasos.push({ ...p1, t: `1. ${p1.t}` }, { ...p2, t: `2. ${p2.t}` }, { ...p3, t: `3. ${p3.t}` }, { ...p4, t: `4. ${p4.t}` });
    return {
      html: true,
      enun: `<div class="pend-col">${cabecera(sc, 'Dibuja el diagrama de árbol, con la probabilidad correspondiente en cada una de sus seis ramas, y calcula:')}${lista([Q.inter(sc, s1, t1), Q.cond(sc, s2, t2), Q.total(sc, t3), Q.bayes(sc, s4, t4)])}</div>`,
      pasos,
      res: resLista([ans(p1.r), ans(p2.r), ans(p3.r), ans(p4.r)])
    };
  }

  /* ================= 2. Árbol corto: árbol + probabilidad total + Bayes ================= */
  function genCorto(R) {
    const sc = escenario(R), D = datos(sc);
    const t3 = R.int(0, 1) ? 'nB' : 'B';
    const v = R.int(0, 3), s4 = v >> 1 ? 'nA' : 'A', t4 = v & 1 ? 'nB' : 'B';
    const p3 = pasoTotal(D, t3), p4 = pasoBayes(D, s4, t4);
    const pasos = pasoArbol(sc, D);
    pasos.push({ ...p3, t: `1. ${p3.t}` }, { ...p4, t: `2. ${p4.t}` });
    return {
      html: true,
      enun: `<div class="pend-col">${cabecera(sc, 'Dibuja el diagrama de árbol, con la probabilidad correspondiente en cada una de sus seis ramas, y calcula:')}${lista([Q.total(sc, t3), Q.bayes(sc, s4, t4)])}</div>`,
      pasos,
      res: resLista([ans(p3.r), ans(p4.r)])
    };
  }

  const ENUN = ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'];
  registrarFicha({
    id: 'arbol-prob',
    titulo: 'Diagramas de árbol',
    detalle: 'Matemáticas CC.SS. II · PAU Extremadura',
    grupo: 'Probabilidad y combinatoria',
    enlace: '../probabilidad/arbol-prob.html',
    ejercicios: [
      { id: 'completo', nombre: 'Árbol, intersección, condicionada, total y Bayes', peso: 2, columnas: 1, enunciado: ENUN, generar: genCompleto },
      { id: 'corto', nombre: 'Árbol, probabilidad total y Bayes', peso: 1.5, columnas: 1, enunciado: ENUN, generar: genCorto }
    ]
  });
})();
