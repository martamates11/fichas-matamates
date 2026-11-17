/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Sucesiones y progresiones (pendientes de 3.º ESO).
   Criterios de la ficha pendientes/tercero/sucesiones-3.html:
   · aritméticas: a₁ entre −12 y 12, diferencia d = ±(1 a 7), se piden a₁, d, aₙ, a₂₀ y S₂₀;
   · geométricas: a₁ entre −6 y 6 (no nulo), razón r = ±2 o ±3, se piden a₁, r, aₙ, el término
     pedido y la suma.
   Cambio pensado para hacerlo sin calculadora: en las geométricas la ficha usa n = 10
   (términos de hasta ≈ 10⁵ y sumas de ≈ 10⁵); en el examen se pide n = 6 (a₆ ≤ 1458 y
   S₆ ≤ 2184 en valor absoluto), con las mismas fórmulas.
   Se añade un tipo «mixto» (el alumno debe decidir si es aritmética o geométrica), que en la
   ficha no hace falta porque cada ejercicio ya indica el tipo. */
(function () {
  'use strict';
  const { tex, registrarFicha } = window.EX;
  const { n, p, poli } = tex;

  const NA = 20, NG = 6;                       // términos que se piden: aritmética / geométrica
  const mas = v => (v < 0 ? `- ${-v}` : `+ ${v}`);
  const seq = (t) => `\\(${t.map(v => `{${n(v)}}`).join(',\\ ')},\\ \\dots\\)`;
  const enunSeq = (t) => ({ html: true, enun: `<span class="pend-texto">${seq(t)}</span>` });

  /* ---------- Aritmética ---------- */
  function datosArit(R) {
    const d = R.signo() * R.int(1, 7), a1 = R.int(-12, 12);
    return { a1, d, t: [a1, a1 + d, a1 + 2 * d] };
  }
  function pasosArit({ a1, d, t }) {
    const an = a1 + d * (NA - 1), S = NA * (a1 + an) / 2;
    const gen = poli([[d, 'n'], [a1 - d, '']]);
    return {
      pasos: [
        { t: 'El primer término es el primero de la lista:', m: `a_1 = ${n(a1)}` },
        { t: 'La diferencia es lo que se suma de un término al siguiente (segundo menos primero):', m: `d = a_2 - a_1 = ${n(t[1])} - ${p(t[0])} = ${n(d)}` },
        { t: 'Término general: \\(a_n = a_1 + (n-1)\\,d\\).', m: `a_n = ${n(a1)} + (n-1) \\cdot ${p(d)} = ${gen}` },
        { t: `Sustituimos \\(n = ${NA}\\) en la fórmula del término general:`, m: `a_{${NA}} = ${n(a1)} + ${NA - 1} \\cdot ${p(d)} = ${n(a1)} ${mas(d * (NA - 1))} = ${n(an)}` },
        { t: `Suma de los ${NA} primeros términos: \\(S_n = \\dfrac{n\\,(a_1 + a_n)}{2}\\).`, m: `S_{${NA}} = \\frac{${NA} \\cdot (${n(a1)} ${mas(an)})}{2} = ${NA / 2} \\cdot ${p(a1 + an)} = ${n(S)}` }
      ],
      res: `a_1 = ${n(a1)},\\; d = ${n(d)},\\; a_n = ${gen},\\; a_{${NA}} = ${n(an)},\\; S_{${NA}} = ${n(S)}`
    };
  }

  /* ---------- Geométrica ---------- */
  function datosGeo(R) {
    const r = R.signo() * R.int(2, 3), a1 = R.nz(-6, 6);
    return { a1, r, t: [a1, a1 * r, a1 * r * r] };
  }
  const potTex = (r, e) => (r < 0 ? `(${r})^{${e}}` : `${r}^{${e}}`);
  const porA1 = (a1, alg) => (a1 === 1 ? alg : a1 === -1 ? `-${alg}` : `${n(a1)} \\cdot ${alg}`);
  function pasosGeo({ a1, r, t }) {
    const an = a1 * Math.pow(r, NG - 1), rN = Math.pow(r, NG), S = a1 * (rN - 1) / (r - 1);
    const pot = Math.pow(r, NG - 1);
    return {
      pasos: [
        { t: 'El primer término es el primero de la lista:', m: `a_1 = ${n(a1)}` },
        { t: 'La razón es el cociente entre dos términos consecutivos (segundo entre primero):', m: `r = \\frac{a_2}{a_1} = \\frac{${n(t[1])}}{${n(t[0])}} = ${n(r)}` },
        { t: 'Término general: \\(a_n = a_1 \\cdot r^{\\,n-1}\\).', m: `a_n = ${porA1(a1, potTex(r, 'n-1'))}` },
        { t: `Sustituimos \\(n = ${NG}\\):`, m: `a_{${NG}} = ${porA1(a1, potTex(r, NG - 1))} = ${n(a1)} \\cdot ${p(pot)} = ${n(an)}` },
        { t: `Suma de los ${NG} primeros términos: \\(S_n = \\dfrac{a_1\\,(r^{\\,n}-1)}{r-1}\\).`, m: `S_{${NG}} = \\frac{${n(a1)} \\cdot (${potTex(r, NG)} - 1)}{${n(r)} - 1} = \\frac{${n(a1)} \\cdot (${n(rN)} - 1)}{${n(r - 1)}} = \\frac{${n(a1 * (rN - 1))}}{${n(r - 1)}} = ${n(S)}` }
      ],
      res: `a_1 = ${n(a1)},\\; r = ${n(r)},\\; a_n = ${porA1(a1, potTex(r, 'n-1'))},\\; a_{${NG}} = ${n(an)},\\; S_{${NG}} = ${n(S)}`
    };
  }

  function genArit(R) { const d = datosArit(R); return { ...enunSeq(d.t), ...pasosArit(d) }; }
  function genGeo(R) { const d = datosGeo(R); return { ...enunSeq(d.t), ...pasosGeo(d) }; }

  /* ---------- Mixto: hay que identificar el tipo ---------- */
  function genMixta(R) {
    const arit = R.rand() < 0.5;
    const d = arit ? datosArit(R) : datosGeo(R), t = d.t;
    const cab = arit
      ? { t: 'Comprobamos qué se mantiene constante entre términos consecutivos. Las diferencias son iguales, así que es una progresión aritmética:', m: `${n(t[1])} - ${p(t[0])} = ${n(t[1] - t[0])},\\qquad ${n(t[2])} - ${p(t[1])} = ${n(t[2] - t[1])}` }
      : { t: 'Las diferencias no son iguales, pero los cocientes sí; es una progresión geométrica:', m: `${n(t[1] - t[0])} \\ne ${n(t[2] - t[1])},\\qquad \\frac{${n(t[1])}}{${n(t[0])}} = \\frac{${n(t[2])}}{${n(t[1])}} = ${n(d.r)}` };
    const r = arit ? pasosArit(d) : pasosGeo(d);
    return { ...enunSeq(t), pasos: [cab, ...r.pasos], res: `\\text{${arit ? 'aritmética' : 'geométrica'}},\\; ${r.res}` };
  }

  const ENUN_A = [`Para la siguiente progresión aritmética, calcula el primer término, la diferencia, el término general \\(a_n\\), el término \\(a_{${NA}}\\) y la suma \\(S_{${NA}}\\) de sus ${NA} primeros términos:`,
    `Para cada una de las siguientes progresiones aritméticas, calcula el primer término, la diferencia, el término general \\(a_n\\), el término \\(a_{${NA}}\\) y la suma \\(S_{${NA}}\\) de sus ${NA} primeros términos:`];
  const ENUN_G = [`Para la siguiente progresión geométrica, calcula el primer término, la razón, el término general \\(a_n\\), el término \\(a_{${NG}}\\) y la suma \\(S_{${NG}}\\) de sus ${NG} primeros términos:`,
    `Para cada una de las siguientes progresiones geométricas, calcula el primer término, la razón, el término general \\(a_n\\), el término \\(a_{${NG}}\\) y la suma \\(S_{${NG}}\\) de sus ${NG} primeros términos:`];
  const ENUN_M = [`Indica si la siguiente progresión es aritmética o geométrica y calcula su primer término, la diferencia o la razón, el término general \\(a_n\\), el término \\(a_{${NA}}\\) (aritmética) o \\(a_{${NG}}\\) (geométrica) y la suma de ese mismo número de primeros términos:`,
    `Indica si cada progresión es aritmética o geométrica y calcula su primer término, la diferencia o la razón, el término general \\(a_n\\), el término \\(a_{${NA}}\\) (aritmética) o \\(a_{${NG}}\\) (geométrica) y la suma de ese mismo número de primeros términos:`];

  registrarFicha({
    id: 'pend3-sucesiones',
    titulo: 'Sucesiones y progresiones',
    detalle: '3.º ESO',
    grupo: 'Recuperación de 3.º ESO',
    enlace: '../pendientes/tercero/sucesiones-3.html',
    ejercicios: [
      { id: 'aritmetica', nombre: 'Progresión aritmética (a₁, d, aₙ, a₂₀, S₂₀)', peso: 1.5, columnas: 1, enunciado: ENUN_A, generar: genArit },
      { id: 'geometrica', nombre: 'Progresión geométrica (a₁, r, aₙ, a₆, S₆)', peso: 1.5, columnas: 1, enunciado: ENUN_G, generar: genGeo },
      { id: 'mixta', nombre: 'Identificar el tipo y calcular (aritmética o geométrica)', peso: 1.75, columnas: 1, enunciado: ENUN_M, generar: genMixta }
    ]
  });
})();
