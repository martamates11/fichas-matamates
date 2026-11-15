/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Potencias y raíces (pendientes de 1.º ESO).
   Los números se generan con los mismos criterios que la ficha interactiva
   pendientes/primero/potencias-1.html. Para que haya variedad suficiente, en
   «potencia como producto» la base va de 2 a 9 y en «valor de una potencia» se
   añaden la base 10 y algunas potencias de exponente 4, 5 o 6 (cambio aplicado
   también en la ficha). */
(function () {
  'use strict';
  const { registrarFicha } = window.EX;

  const NUMS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
  /* Potencia en TeX; con exponente 1 se escribe solo la base */
  const pot = (b, e) => (e === 1 ? String(b) : `${b}^{${e}}`);
  const txt = s => `<span class="pend-texto">${s}</span>`;
  /* Separador de millares (espacio fino) a partir de 10 000, como en la norma española */
  const miles = x => (x >= 10000 ? String(x).replace(/\B(?=(\d{3})+$)/g, '\\,') : String(x));

  /* ================= 1. Base y exponente ================= */
  /* Ficha: base 2–9, exponente 2–5 */
  function genLectura(R) {
    const b = R.int(2, 9), e = R.int(2, 5);
    const prod = Array(e).fill(b).join(' \\cdot ');
    return {
      html: true,
      enun: txt(`«${NUMS[b]} elevado a ${NUMS[e]}»`),
      pasos: [
        { t: `La base es el número que se multiplica (\\(${b}\\)) y el exponente indica cuántas veces se multiplica (\\(${e}\\)):`, m: `${b}^{${e}} = ${prod}` }
      ],
      res: `${b}^{${e}}`,
      resHtml: `\\(${b}^{${e}}\\): base \\(${b}\\), exponente \\(${e}\\).`
    };
  }

  /* ================= 2. Potencia como producto ================= */
  /* Ficha: exponente 3–5; base 2–9 (antes 2–6, se amplía también en la ficha) */
  function genProducto(R) {
    const b = R.int(2, 9), e = R.int(3, 5);
    const prod = Array(e).fill(b).join(' \\cdot ');
    return {
      enun: `${b}^{${e}}`,
      pasos: [
        { t: `El exponente \\(${e}\\) indica que la base \\(${b}\\) se multiplica por sí misma ${NUMS[e]} veces:`, m: `${b}^{${e}} = ${prod}` }
      ],
      res: `${b}^{${e}} = ${prod}`
    };
  }

  /* ================= 3. Producto de potencias de la misma base ================= */
  /* Ficha: base 2–8, exponentes 1–4 */
  function genProdBase(R) {
    const b = R.int(2, 8), m = R.int(1, 4), n = R.int(1, 4);
    const uno = (m === 1 || n === 1) ? ` (recuerda que \\(${b} = ${b}^1\\))` : '';
    return {
      enun: `${pot(b, m)} \\cdot ${pot(b, n)}`,
      pasos: [
        { t: `Producto de potencias de la misma base: se deja la base y se suman los exponentes${uno}.`, m: `${pot(b, m)} \\cdot ${pot(b, n)} = ${b}^{${m} + ${n}} = ${b}^{${m + n}}` }
      ],
      res: `${b}^{${m + n}}`
    };
  }

  /* ================= 4. Cociente de potencias de la misma base ================= */
  /* Ficha: base 2–7, exponente del numerador 5–8 y del denominador 1–3 */
  function genCocBase(R) {
    const b = R.int(2, 7), m = R.int(5, 8), n = R.int(1, 3);
    const uno = n === 1 ? ` (recuerda que \\(${b} = ${b}^1\\))` : '';
    return {
      enun: `\\frac{${pot(b, m)}}{${pot(b, n)}}`,
      pasos: [
        { t: `Cociente de potencias de la misma base: se deja la base y se restan los exponentes${uno}.`, m: `\\frac{${pot(b, m)}}{${pot(b, n)}} = ${b}^{${m} - ${n}} = ${b}^{${m - n}}` }
      ],
      res: `${b}^{${m - n}}`
    };
  }

  /* ================= 5. Potencia de una potencia ================= */
  /* Ficha: base 2–6, exponentes 2–4 */
  function genPotPot(R) {
    const b = R.int(2, 6), m = R.int(2, 4), n = R.int(2, 4);
    return {
      enun: `\\left(${b}^{${m}}\\right)^{${n}}`,
      pasos: [
        { t: 'Potencia de una potencia: se deja la base y se multiplican los exponentes.', m: `\\left(${b}^{${m}}\\right)^{${n}} = ${b}^{${m} \\cdot ${n}} = ${b}^{${m * n}}` }
      ],
      res: `${b}^{${m * n}}`
    };
  }

  /* ================= 6. Producto de potencias con el mismo exponente ================= */
  /* Ficha: bases 2–9, exponente 2–6 */
  function genProdExp(R) {
    const a = R.int(2, 9), b = R.int(2, 9), e = R.int(2, 6);
    return {
      enun: `${a}^{${e}} \\cdot ${b}^{${e}}`,
      pasos: [
        { t: 'Producto de potencias con el mismo exponente: se multiplican las bases y se deja el exponente.', m: `${a}^{${e}} \\cdot ${b}^{${e}} = (${a} \\cdot ${b})^{${e}} = ${a * b}^{${e}}` }
      ],
      res: `${a * b}^{${e}}`
    };
  }

  /* ================= 7. Cociente de potencias con el mismo exponente ================= */
  /* Ficha: divisor 2–5, cociente 2–5 (división exacta), exponente 2–6 */
  function genCocExp(R) {
    const d = R.int(2, 5), q = R.int(2, 5), a = d * q, e = R.int(2, 6);
    return {
      enun: `\\frac{${a}^{${e}}}{${d}^{${e}}}`,
      pasos: [
        { t: 'Cociente de potencias con el mismo exponente: se dividen las bases y se deja el exponente.', m: `\\frac{${a}^{${e}}}{${d}^{${e}}} = (${a} : ${d})^{${e}} = ${q}^{${e}}` }
      ],
      res: `${q}^{${e}}`
    };
  }

  /* ================= 8. Exponente cero ================= */
  /* Ficha: base 11–100 en la primera pregunta y 100–599 en la segunda */
  function genCero(R, i) {
    const b = i % 2 ? R.int(100, 599) : R.int(11, 100);
    return {
      enun: `${b}^{0}`,
      pasos: [
        { t: `Una potencia dividida entre sí misma da 1 y, por la regla del cociente, \\(\\frac{${b}^{n}}{${b}^{n}} = ${b}^{n - n} = ${b}^{0}\\). Por eso cualquier número (distinto de 0) elevado a 0 vale 1:`, m: `${b}^{0} = 1` }
      ],
      res: '1'
    };
  }

  /* ================= 9. Valor de una potencia ================= */
  /* Ficha: base 2–10 con exponente 2 o 3, y algunas potencias de exponente mayor
     que se calculan bien a mano (se amplía también en la ficha). */
  const VALORES = [];
  for (let b = 2; b <= 10; b++) VALORES.push([b, 2], [b, 3]);
  VALORES.push([2, 4], [3, 4], [2, 5], [2, 6], [10, 4]);
  function genValor(R) {
    const [b, e] = R.pick(VALORES), v = miles(Math.pow(b, e));
    const prod = Array(e).fill(b).join(' \\cdot ');
    const pasos = [{ t: `Multiplicamos la base \\(${b}\\) por sí misma ${NUMS[e]} veces:`, m: `${b}^{${e}} = ${prod} = ${v}` }];
    if (e >= 3 && b !== 10) {
      const parciales = []; let acc = b;
      for (let k = 2; k <= e; k++) { const ant = acc; acc *= b; parciales.push(`${ant} \\cdot ${b} = ${acc}`); }
      pasos.push({ t: 'Paso a paso:', m: parciales.join(',\\quad ') });
    }
    if (b === 10) pasos.push({ t: `Una potencia de 10 es un 1 seguido de tantos ceros como indica el exponente (${NUMS[e]}).` });
    return { enun: `${b}^{${e}}`, pasos, res: `${b}^{${e}} = ${v}` };
  }

  /* ================= 10. Raíz cuadrada exacta o entera ================= */
  /* Ficha: raíz exacta de 4 a 12; raíz entera de 3 a 10 con resto de 1 a 2·raíz.
     En los apartados impares (a, c, …) sale una raíz entera; en los pares, una exacta. */
  function genRaiz(R, i) {
    if (i % 2) {
      const r = R.int(4, 12), N = r * r;
      return {
        enun: `\\sqrt{${N}}`,
        pasos: [
          { t: `Buscamos un número que, elevado al cuadrado, dé \\(${N}\\):`, m: `${r}^2 = ${N}` },
          { t: 'La raíz es exacta (el resto es 0).' }
        ],
        res: `\\sqrt{${N}} = ${r}`,
        resHtml: `\\(\\sqrt{${N}} = ${r}\\) (raíz exacta).`
      };
    }
    const r = R.int(3, 10), resto = R.int(1, 2 * r), N = r * r + resto;
    return {
      enun: `\\sqrt{${N}}`,
      pasos: [
        { t: `\\(${N}\\) no es un cuadrado perfecto. Buscamos el mayor número cuyo cuadrado no pase de \\(${N}\\):`, m: `${r}^2 = ${r * r} < ${N} < ${(r + 1) * (r + 1)} = ${r + 1}^2` },
        { t: `La raíz entera es \\(${r}\\). El resto es lo que le falta a \\(${r}^2\\) para llegar a \\(${N}\\):`, m: `\\text{resto} = ${N} - ${r * r} = ${resto}` }
      ],
      res: `\\text{raíz entera } ${r},\\ \\text{resto } ${resto}`,
      resHtml: `Raíz entera \\(${r}\\), resto \\(${resto}\\) (porque \\(${r}^2 + ${resto} = ${N}\\)).`
    };
  }

  registrarFicha({
    id: 'pend1-potencias',
    titulo: 'Potencias y raíces',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/potencias-1.html',
    ejercicios: [
      { id: 'lectura', nombre: 'Base y exponente', peso: 0.5, columnas: 2,
        enunciado: ['Escribe en forma de potencia e indica la base y el exponente:', 'Escribe en forma de potencia e indica la base y el exponente:'], generar: genLectura },
      { id: 'producto', nombre: 'Potencia como producto', peso: 0.5, columnas: 3,
        enunciado: ['Escribe como producto de factores iguales:', 'Escribe como producto de factores iguales:'], generar: genProducto },
      { id: 'prodbase', nombre: 'Producto de potencias de la misma base', peso: 0.5, columnas: 3,
        enunciado: ['Expresa como una sola potencia:', 'Expresa como una sola potencia:'], generar: genProdBase },
      { id: 'cocbase', nombre: 'Cociente de potencias de la misma base', peso: 0.5, columnas: 3,
        enunciado: ['Expresa como una sola potencia:', 'Expresa como una sola potencia:'], generar: genCocBase },
      { id: 'potpot', nombre: 'Potencia de una potencia', peso: 0.5, columnas: 3,
        enunciado: ['Expresa como una sola potencia:', 'Expresa como una sola potencia:'], generar: genPotPot },
      { id: 'prodexp', nombre: 'Producto de potencias con el mismo exponente', peso: 0.5, columnas: 3,
        enunciado: ['Expresa como una sola potencia:', 'Expresa como una sola potencia:'], generar: genProdExp },
      { id: 'cocexp', nombre: 'Cociente de potencias con el mismo exponente', peso: 0.5, columnas: 3,
        enunciado: ['Expresa como una sola potencia:', 'Expresa como una sola potencia:'], generar: genCocExp },
      { id: 'cero', nombre: 'Exponente cero', peso: 0.25, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genCero },
      { id: 'valor', nombre: 'Valor de una potencia', peso: 0.5, columnas: 3,
        enunciado: ['Calcula el valor de la potencia:', 'Calcula el valor de las potencias:'], generar: genValor },
      { id: 'raiz', nombre: 'Raíz cuadrada exacta o entera', peso: 0.75, columnas: 2,
        enunciado: ['Calcula la raíz cuadrada. Si no es exacta, da la raíz entera y el resto:', 'Calcula las raíces cuadradas. Si no son exactas, da la raíz entera y el resto:'], generar: genRaiz }
    ]
  });
})();
