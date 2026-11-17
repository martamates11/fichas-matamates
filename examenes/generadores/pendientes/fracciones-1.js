/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Fracciones (pendientes de 1.º ESO).
   Los números se generan con los mismos criterios que la ficha interactiva
   pendientes/primero/fracciones-1.html (salvo lo indicado en cada ejercicio). */
(function () {
  'use strict';
  const { registrarFicha, pend, fr, mcd, mcm, tex } = window.EX;
  const { Lienzo } = pend;
  const { frac } = tex;

  const F = (n, d) => `\\frac{${n}}{${d}}`;                       // fracción tal cual, sin simplificar
  /* «\frac{6}{8} = \frac{3}{4}» si se puede simplificar; si no, solo la fracción */
  const simpl = (n, d) => { const s = frac(fr(n, d)); return s === F(n, d) ? s : `${F(n, d)} = ${s}`; };
  const pasoSimpl = (n, d) => {
    const g = mcd(n, d);
    return g > 1 ? [{ t: `Simplificamos dividiendo numerador y denominador entre \\(${g}\\):`, m: simpl(n, d) }] : [];
  };

  /* ================= 1. Representación (ficha: n de 2 a 8 partes, a de 1 a n − 1) ================= */
  function rect(n, a) {
    const L = Lienzo(), W = 132, H = 30, w = W / n;
    for (let i = 0; i < n; i++) L.poligono([[i * w, 0], [(i + 1) * w, 0], [(i + 1) * w, H], [i * w, H]], { relleno: i < a ? '#b8b8b8' : '#ffffff', grosor: 1.3 });
    return L.cerrar('pend-fig', `Rectángulo dividido en ${n} partes iguales con ${a} sombreadas`);
  }
  function genRepresentacion(R) {
    const n = R.int(2, 8), a = R.int(1, n - 1);
    return {
      html: true,
      enun: `<div class="pend-col">${rect(n, a)}</div>`,
      pasos: [
        { t: `La unidad está dividida en \\(${n}\\) partes iguales (denominador) y hay \\(${a}\\) sombreadas (numerador).` }
      ],
      res: F(a, n)
    };
  }

  /* ================= 2. Comparar (ficha: numeradores 1–6, denominadores 2–7) ================= */
  /* Se excluyen dos fracciones idénticas, que no aportan nada. */
  function genComparar(R) {
    let a, b, c, d;
    do { a = R.int(1, 6); b = R.int(2, 7); c = R.int(1, 6); d = R.int(2, 7); } while (a === c && b === d);
    const izq = a * d, der = c * b, signo = izq === der ? '=' : izq > der ? '>' : '<';
    const pasos = [];
    if (b === d) pasos.push({ t: 'Tienen el mismo denominador: es mayor la que tiene mayor numerador.', m: `${a} ${signo} ${c}` });
    else {
      const m = mcm(b, d), na = a * m / b, nc = c * m / d;
      pasos.push({ t: `Las reducimos a común denominador, \\(\\text{mcm}(${b},\\ ${d}) = ${m}\\):`, m: `${F(a, b)} = ${F(na, m)} \\qquad ${F(c, d)} = ${F(nc, m)}` });
      pasos.push({ t: 'Con el mismo denominador, comparamos los numeradores:', m: `${F(na, m)} ${signo} ${F(nc, m)}` });
    }
    return { enun: `${F(a, b)} \\quad \\square \\quad ${F(c, d)}`, pasos, res: `${F(a, b)} ${signo} ${F(c, d)}` };
  }

  /* ================= 3. Equivalentes con hueco (ficha: a 1–4, b 2–5, factor 2–5) ================= */
  function genEquivalentes(R) {
    let a, b, k;
    do { a = R.int(1, 4); b = R.int(2, 5); k = R.int(2, 5); } while (a === b || a === b * k || a * k === b);
    const enNum = R.rand() < 0.5;
    const enun = enNum ? `${F('\\square', b)} = ${F(a * k, b * k)}` : `${F(a, '\\square')} = ${F(a * k, b * k)}`;
    return {
      enun,
      pasos: enNum
        ? [{ t: `El denominador \\(${b}\\) se ha multiplicado por \\(${k}\\) para dar \\(${b * k}\\); al numerador le pasa lo mismo, así que dividimos:`, m: `${a * k} : ${k} = ${a}` }]
        : [{ t: `El numerador \\(${a}\\) se ha multiplicado por \\(${k}\\) para dar \\(${a * k}\\); al denominador le pasa lo mismo, así que dividimos:`, m: `${b * k} : ${k} = ${b}` }],
      res: `${F(a, b)} = ${F(a * k, b * k)}`
    };
  }

  /* ================= 4. Suma y resta con el mismo denominador (ficha: denominador 3–8) ================= */
  function genMismoDen(R) {
    const den = R.int(3, 8), resta = R.rand() < 0.5;
    let a = R.int(1, den - 1), b = R.int(1, den - 1);
    if (resta) while (a <= b) { a = R.int(1, den - 1); b = R.int(1, den - 1); }
    const num = resta ? a - b : a + b, op = resta ? '-' : '+';
    return {
      enun: `${F(a, den)} ${op} ${F(b, den)}`,
      pasos: [
        { t: `Con el mismo denominador, ${resta ? 'restamos' : 'sumamos'} los numeradores y dejamos el denominador:`, m: `${F(a, den)} ${op} ${F(b, den)} = ${F(`${a} ${op} ${b}`, den)} = ${F(num, den)}` },
        ...pasoSimpl(num, den)
      ],
      res: frac(fr(num, den))
    };
  }

  /* ================= 5. Suma y resta con distinto denominador (ficha: denominadores 2–6, fracciones propias) ================= */
  /* La ficha solo descarta resultados negativos; aquí también el 0 (p. ej. 1/2 − 2/4), que no
     practica nada y en el papel resulta confuso. */
  function genDistintoDen(R) {
    let d1, d2, a, b, resta, num;
    do {
      d1 = R.int(2, 6); d2 = R.int(2, 6); a = R.int(1, d1 - 1); b = R.int(1, d2 - 1); resta = R.rand() < 0.5;
      num = resta ? a * d2 - b * d1 : a * d2 + b * d1;
    } while (d1 === d2 || num <= 0);
    const m = mcm(d1, d2), na = a * m / d1, nb = b * m / d2, nr = resta ? na - nb : na + nb, op = resta ? '-' : '+';
    return {
      enun: `${F(a, d1)} ${op} ${F(b, d2)}`,
      pasos: [
        { t: `Reducimos a común denominador, \\(\\text{mcm}(${d1},\\ ${d2}) = ${m}\\):`, m: `${F(a, d1)} ${op} ${F(b, d2)} = ${F(na, m)} ${op} ${F(nb, m)}` },
        { t: `${resta ? 'Restamos' : 'Sumamos'} los numeradores:`, m: `${F(`${na} ${op} ${nb}`, m)} = ${F(nr, m)}` },
        ...pasoSimpl(nr, m)
      ],
      res: frac(fr(nr, m))
    };
  }

  /* ================= 6 y 7. Multiplicación y división (ficha: numeradores 1–4, denominadores 2–5) ================= */
  function genMult(R) {
    const a = R.int(1, 4), b = R.int(2, 5), c = R.int(1, 4), d = R.int(2, 5);
    return {
      enun: `${F(a, b)} \\cdot ${F(c, d)}`,
      pasos: [
        { t: 'Multiplicamos numeradores entre sí y denominadores entre sí:', m: `${F(a, b)} \\cdot ${F(c, d)} = ${F(`${a} \\cdot ${c}`, `${b} \\cdot ${d}`)} = ${F(a * c, b * d)}` },
        ...pasoSimpl(a * c, b * d)
      ],
      res: frac(fr(a * c, b * d))
    };
  }
  function genDiv(R) {
    const a = R.int(1, 4), b = R.int(2, 5), c = R.int(1, 4), d = R.int(2, 5);
    return {
      enun: `${F(a, b)} : ${F(c, d)}`,
      pasos: [
        { t: 'Multiplicamos en cruz: el numerador de la primera por el denominador de la segunda, y el denominador de la primera por el numerador de la segunda:', m: `${F(a, b)} : ${F(c, d)} = ${F(`${a} \\cdot ${d}`, `${b} \\cdot ${c}`)} = ${F(a * d, b * c)}` },
        ...pasoSimpl(a * d, b * c)
      ],
      res: frac(fr(a * d, b * c))
    };
  }

  /* ================= 8. Simplificación (ficha: numerador par 4–18, denominador par 4–14) ================= */
  /* La ficha admite numerador = denominador (resultado 1); aquí se excluye por trivial. */
  function genSimplificar(R) {
    let n, d;
    do { n = 2 * R.int(2, 9); d = 2 * R.int(2, 7); } while (n === d);
    const g = mcd(n, d);
    return {
      enun: F(n, d),
      pasos: [
        { t: `Buscamos el máximo común divisor del numerador y del denominador:`, m: `\\text{MCD}(${n},\\ ${d}) = ${g}` },
        { t: `Dividimos los dos entre \\(${g}\\) y obtenemos la fracción irreducible:`, m: `${F(n, d)} = ${F(`${n} : ${g}`, `${d} : ${g}`)} = ${frac(fr(n, d))}` }
      ],
      res: frac(fr(n, d))
    };
  }

  /* ================= 9. Operaciones combinadas (ficha: numeradores 1–3, denominadores 2–4) ================= */
  /* Tres modelos: a/b · (c/d + e/f), a/b + c/d · e/f y (a/b + c/d) · e/f.
     El segundo sustituye al de la ficha a/b + (c/d + e/f), cuyo paréntesis no cambia nada;
     así se practica la prioridad de la multiplicación (criterio distinto del de la ficha). */
  function suma(n1, d1, n2, d2) {           // pasos de una suma de fracciones; devuelve { m, f }
    const m = mcm(d1, d2), a = n1 * m / d1, b = n2 * m / d2, f = fr(a + b, m);
    const tex = d1 === d2 ? `${F(n1, d1)} + ${F(n2, d2)} = ${F(n1 + n2, d1)}` : `${F(n1, d1)} + ${F(n2, d2)} = ${F(a, m)} + ${F(b, m)} = ${F(a + b, m)}`;
    return { m: tex + (frac(f) === F(a + b, m) ? '' : ` = ${frac(f)}`), f };
  }
  function prod(n1, d1, n2, d2) {
    const f = fr(n1 * n2, d1 * d2);
    return { m: `${F(n1, d1)} \\cdot ${F(n2, d2)} = ${F(n1 * n2, d1 * d2)}` + (frac(f) === F(n1 * n2, d1 * d2) ? '' : ` = ${frac(f)}`), f };
  }
  const fT = f => (f.d === 1 ? `${f.n}` : F(f.n, f.d));
  function genCombinadas(R) {
    const tipo = R.int(0, 2);
    const a = R.int(1, 3), b = R.int(2, 4), c = R.int(1, 3), d = R.int(2, 4), e = R.int(1, 3), f = R.int(2, 4);
    let enun, pasos, final;
    if (tipo === 0) {
      enun = `${F(a, b)} \\cdot \\left(${F(c, d)} + ${F(e, f)}\\right)`;
      const s = suma(c, d, e, f), p = prod(a, b, s.f.n, s.f.d);
      pasos = [{ t: 'Primero, el paréntesis:', m: s.m.replace(/\\frac\{(\d+)\}\{1\}/g, '$1') }, { t: 'Después, la multiplicación:', m: p.m.replace(/\\frac\{(\d+)\}\{1\}/g, '$1') }];
      final = p.f;
    } else if (tipo === 1) {
      enun = `${F(a, b)} + ${F(c, d)} \\cdot ${F(e, f)}`;
      const p = prod(c, d, e, f), s = suma(a, b, p.f.n, p.f.d);
      pasos = [{ t: 'La multiplicación va antes que la suma:', m: p.m }, { t: 'Ahora sumamos:', m: s.m.replace(/\\frac\{(\d+)\}\{1\}/g, '$1') }];
      final = s.f;
    } else {
      enun = `\\left(${F(a, b)} + ${F(c, d)}\\right) \\cdot ${F(e, f)}`;
      const s = suma(a, b, c, d), p = prod(s.f.n, s.f.d, e, f);
      pasos = [{ t: 'Primero, el paréntesis:', m: s.m.replace(/\\frac\{(\d+)\}\{1\}/g, '$1') }, { t: 'Después, la multiplicación:', m: p.m.replace(/\\frac\{(\d+)\}\{1\}/g, '$1') }];
      final = p.f;
    }
    return { enun, pasos, res: fT(final) };
  }

  /* ================= 10. Problema de la harina (ficha: paquetes enteros + fracción con denominador 3, 4, 5, 6 u 8) ================= */
  const NUM = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete'];
  const PARTE = { 3: 'tercio', 4: 'cuarto', 5: 'quinto', 6: 'sexto', 8: 'octavo' };
  function genProblema(R) {
    const dens = [3, 4, 5, 6, 8];
    const d1 = R.pick(dens); let d2; do { d2 = R.pick(dens); } while (d2 === d1);
    const e1 = R.int(1, 2), n1 = R.int(1, d1 - 1), e2 = R.int(1, 3), n2 = R.int(1, d2 - 1);
    const fraccion = (n, d) => `${NUM[n]} ${PARTE[d]}${n > 1 ? 's' : ''}`;
    const texto = `María y Manuel han cocinado sendas tartas para una fiesta. María ha utilizado ${e1 === 1 ? 'un paquete' : NUM[e1] + ' paquetes'} de harina más ${fraccion(n1, d1)} de otro. Por su parte, Manuel ha gastado ${e2 === 1 ? 'un paquete completo' : NUM[e2] + ' paquetes completos'} y ${fraccion(n2, d2)} de otro. ¿Cuántos paquetes de harina han usado en total entre los dos amigos?`;
    const A = e1 * d1 + n1, B = e2 * d2 + n2, m = mcm(d1, d2), a = A * m / d1, b = B * m / d2, tot = fr(a + b, m);
    const ent = Math.floor(tot.n / tot.d), resto = tot.n % tot.d;
    const mixto = resto ? `${ent} \\text{ paquetes y } ${F(resto, tot.d)}` : `${ent} \\text{ paquetes}`;
    return {
      html: true,
      enun: `<span class="pend-texto">${texto}</span>`,
      pasos: [
        { t: 'Escribimos lo que ha gastado cada uno como una sola fracción:', m: `\\text{María: } ${e1} + ${F(n1, d1)} = ${F(A, d1)} \\qquad \\text{Manuel: } ${e2} + ${F(n2, d2)} = ${F(B, d2)}` },
        { t: `Sumamos, con denominador común \\(\\text{mcm}(${d1},\\ ${d2}) = ${m}\\):`, m: `${F(A, d1)} + ${F(B, d2)} = ${F(a, m)} + ${F(b, m)} = ${F(a + b, m)}` + (frac(tot) === F(a + b, m) ? '' : ` = ${frac(tot)}`) },
        ...(resto && ent ? [{ t: `Es decir, \\(${mixto}\\).` }] : [])
      ],
      res: `${frac(tot)} \\text{ paquetes}`,
      resHtml: `\\(${frac(tot)}\\) paquetes` + (resto && ent ? `, es decir, ${ent} paquetes y \\(${F(resto, tot.d)}\\) de paquete.` : '.')
    };
  }

  registrarFicha({
    id: 'pend1-fracciones',
    titulo: 'Fracciones',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/fracciones-1.html',
    ejercicios: [
      { id: 'representacion', nombre: 'Fracción representada', peso: 0.5, columnas: 2,
        enunciado: ['Escribe la fracción que representa la parte sombreada:', 'Escribe la fracción que representa la parte sombreada en cada caso:'], generar: genRepresentacion },
      { id: 'comparar', nombre: 'Comparar fracciones', peso: 0.75, columnas: 3,
        enunciado: ['Escribe el signo <, > o = en el recuadro:', 'Escribe el signo <, > o = en cada recuadro:'], generar: genComparar },
      { id: 'equivalentes', nombre: 'Fracciones equivalentes', peso: 0.5, columnas: 3,
        enunciado: ['Completa el número que falta para que las fracciones sean equivalentes:', 'Completa el número que falta para que las fracciones sean equivalentes:'], generar: genEquivalentes },
      { id: 'mismoden', nombre: 'Suma y resta (mismo denominador)', peso: 0.5, columnas: 3,
        enunciado: ['Calcula y simplifica:', 'Calcula y simplifica:'], generar: genMismoDen },
      { id: 'distintoden', nombre: 'Suma y resta (distinto denominador)', peso: 0.75, columnas: 3,
        enunciado: ['Calcula y simplifica:', 'Calcula y simplifica:'], generar: genDistintoDen },
      { id: 'mult', nombre: 'Multiplicación', peso: 0.5, columnas: 3,
        enunciado: ['Calcula y simplifica:', 'Calcula y simplifica:'], generar: genMult },
      { id: 'div', nombre: 'División', peso: 0.5, columnas: 3,
        enunciado: ['Calcula y simplifica:', 'Calcula y simplifica:'], generar: genDiv },
      { id: 'simplificar', nombre: 'Simplificación', peso: 0.5, columnas: 3,
        enunciado: ['Simplifica hasta obtener la fracción irreducible:', 'Simplifica hasta obtener la fracción irreducible:'], generar: genSimplificar },
      { id: 'combinadas', nombre: 'Operaciones combinadas', peso: 1, columnas: 2,
        enunciado: ['Calcula respetando la jerarquía de las operaciones y simplifica:', 'Calcula respetando la jerarquía de las operaciones y simplifica:'], generar: genCombinadas },
      { id: 'problema', nombre: 'Problema: la harina de las tartas', peso: 1, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genProblema }
    ]
  });
})();
