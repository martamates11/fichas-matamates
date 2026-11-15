/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Proporcionalidad (pendientes de 1.º ESO).
   Mismos criterios que la ficha interactiva pendientes/primero/proporcionalidad-1.html.
   Cambios (aplicados también en la ficha): las fracciones equivalentes y la regla de
   tres se generan con datos aleatorios en lugar de un banco fijo de 12 casos, y el
   banco de magnitudes se amplía (y se corrige una afirmación mal clasificada). */
(function () {
  'use strict';
  const { registrarFicha, pend, mcd } = window.EX;
  const { dec, Lienzo } = pend;

  const txt = s => `<span class="pend-texto">${s}</span>`;
  /* Cantidades de dinero: con dos decimales cuando no son enteras (45,50 €) */
  const din = x => (Number.isInteger(pend.rd(x)) ? String(pend.rd(x)) : pend.rd(x).toFixed(2).replace('.', '{,}'));
  const eur = x => `${din(x)}\\text{ €}`;
  const pc = x => `${x}\\,\\%`;
  /* Separador de millares (espacio fino) a partir de 10 000 */
  const miles = x => (x >= 10000 ? String(x).replace(/\B(?=(\d{3})+$)/g, '\\,') : String(x));

  /* ================= 1. Fracciones equivalentes ================= */
  /* a/b irreducible (b de 2 a 9) y c/d = k·a / k·b (k de 2 a 4); en los casos no
     equivalentes se altera en una unidad el numerador o el denominador. */
  function genEquiv(R) {
    let a, b; do { b = R.int(2, 9); a = R.int(1, b - 1); } while (mcd(a, b) !== 1);
    const k = R.int(2, 4), equiv = R.rand() < 0.6;
    let c = k * a, d = k * b;
    if (!equiv) { if (R.rand() < 0.5) c += R.pick([-1, 1]); else d += R.pick([-1, 1]); if (c < 1) c = 2; }
    const ad = a * d, bc = b * c, si = ad === bc;
    return {
      enun: `\\frac{${a}}{${b}} \\;\\text{ y }\\; \\frac{${c}}{${d}}`,
      pasos: [
        { t: 'Dos fracciones son equivalentes si sus productos cruzados son iguales:', m: `${a} \\cdot ${d} = ${ad} \\qquad ${b} \\cdot ${c} = ${bc}` },
        { t: si ? 'Los productos cruzados coinciden.' : 'Los productos cruzados son distintos.' }
      ],
      res: si ? `\\text{Sí son equivalentes: } ${ad} = ${bc}` : `\\text{No son equivalentes: } ${ad} \\neq ${bc}`
    };
  }

  /* ================= 2. Magnitudes directamente proporcionales ================= */
  const MAGNITUDES = [
    ['La edad de una persona y su altura.', false, 'La altura no crece al mismo ritmo que la edad: a doble edad no le corresponde doble altura.'],
    ['Los grados de temperatura ambiente y la humedad ambiental.', false, 'No hay una relación fija entre ellas: si la temperatura se duplica, la humedad no se duplica.'],
    ['El peso de la fruta y el precio pagado por ella (mismo precio por kg).', true, 'Si compras el doble de kilos, pagas el doble; el precio por kilo es la constante.'],
    ['El número de entradas de cine que compras y el dinero que pagas (mismo precio por entrada).', true, 'El doble de entradas cuesta el doble; el precio de una entrada es la constante.'],
    ['El número de obreros que hacen un trabajo y el tiempo que tardan en terminarlo (a más obreros, menos tiempo).', false, 'Es una proporcionalidad inversa: el doble de obreros tarda la mitad de tiempo.'],
    ['Los litros de gasolina que pones en el depósito y lo que pagas por ellos.', true, 'El doble de litros cuesta el doble; el precio por litro es la constante.'],
    ['La velocidad de un coche y el tiempo que tarda en recorrer una distancia fija.', false, 'Es una proporcionalidad inversa: a doble velocidad, la mitad de tiempo.'],
    ['El número de cuadernos iguales que compras y el dinero que pagas por ellos.', true, 'El doble de cuadernos cuesta el doble; el precio de un cuaderno es la constante.'],
    ['El número de personas que reparten un premio fijo y la cantidad que recibe cada una.', false, 'Es una proporcionalidad inversa: si son el doble de personas, cada una recibe la mitad.'],
    ['Los kilómetros recorridos por un coche y la gasolina consumida (a velocidad constante).', true, 'El doble de kilómetros gasta el doble de gasolina.'],
    ['El lado de un cuadrado y su perímetro.', true, 'El perímetro es 4 veces el lado: si el lado se duplica, el perímetro también.'],
    ['El número de grifos abiertos y el tiempo que tardan en llenar un depósito (a más grifos, menos tiempo).', false, 'Es una proporcionalidad inversa: el doble de grifos tarda la mitad de tiempo.'],
    ['El lado de un cuadrado y su área.', false, 'Si el lado se duplica, el área se multiplica por 4, no por 2.'],
    ['Las horas trabajadas y el sueldo cobrado (mismo precio por hora).', true, 'El doble de horas se cobra el doble; el precio por hora es la constante.'],
    ['El número de vueltas que da una rueda y la distancia que recorre.', true, 'En cada vuelta recorre siempre la misma distancia: el doble de vueltas, el doble de distancia.'],
    ['El tiempo que está abierto un grifo (con el mismo caudal) y los litros de agua que salen.', true, 'El doble de tiempo, el doble de litros; los litros por minuto son la constante.'],
    ['La edad de un niño y su peso.', false, 'El peso no crece al mismo ritmo que la edad: a doble edad no le corresponde doble peso.'],
    ['El número de páginas de un libro y su precio.', false, 'No hay una relación fija: un libro con el doble de páginas no cuesta necesariamente el doble.'],
    ['El número de bizcochos iguales que se hacen y la harina que se necesita.', true, 'Para el doble de bizcochos hace falta el doble de harina.'],
    ['El número de alumnos que van de excursión y lo que paga cada uno por un autobús de precio fijo.', false, 'Es una proporcionalidad inversa: si van el doble de alumnos, cada uno paga la mitad.'],
    ['Los minutos que dura una llamada y su coste (mismo precio por minuto y sin coste de establecimiento).', true, 'El doble de minutos cuesta el doble; el precio por minuto es la constante.'],
    ['El número de pie de una persona y su edad.', false, 'No hay una relación fija entre ellas: a doble edad no le corresponde doble número de pie.'],
    ['Los litros de pintura y los metros cuadrados de pared que se pintan (con una sola capa).', true, 'Con el doble de pintura se pinta el doble de pared.']
  ];
  function genMagnitudes(R) {
    const [frase, directa, por] = R.pick(MAGNITUDES);
    return {
      html: true,
      enun: txt(frase),
      pasos: [
        { t: 'Dos magnitudes son directamente proporcionales si, al multiplicar una por un número (por ejemplo, por 2), la otra queda multiplicada por el mismo número.' },
        { t: por }
      ],
      res: directa ? '\\text{Sí son directamente proporcionales.}' : '\\text{No son directamente proporcionales.}',
      resHtml: `${directa ? 'Sí' : 'No'} son directamente proporcionales.`
    };
  }

  /* ================= 3. Regla de tres (término desconocido) ================= */
  /* a/b = c/n con n = b·c/a entero (n ≤ 60) */
  function genReglaTres(R) {
    let a, b, c, n;
    do { a = R.int(2, 9); b = R.int(2, 12); c = R.int(2, 20); n = b * c / a; } while (c === a || b === a || !Number.isInteger(n) || n > 60 || n === c);
    return {
      enun: `\\frac{${a}}{${b}} = \\frac{${c}}{n}`,
      pasos: [
        { t: 'En una proporción, los productos cruzados son iguales:', m: `${a} \\cdot n = ${b} \\cdot ${c} = ${b * c}` },
        { t: 'Despejamos \\(n\\) dividiendo:', m: `n = \\frac{${b * c}}{${a}} = ${n}` }
      ],
      res: `n = ${n}`
    };
  }

  /* ================= 4. Tabla de proporcionalidad directa ================= */
  /* Ficha: A = 1, 2, 3, 4, 5; constante de la lista; se da uno de los valores 2.º a 5.º de B */
  const CONSTANTES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20];
  function tabla(B, visibles) {
    const L = Lienzo(), W0 = 92, W = 38, H = 24;
    const X = j => W0 + j * W;
    for (let f = 0; f <= 2; f++) L.linea(0, f * H, X(5), f * H, { grosor: 1 });
    L.linea(0, 0, 0, 2 * H, { grosor: 1 });
    for (let j = 0; j <= 5; j++) L.linea(X(j), 0, X(j), 2 * H, { grosor: 1 });
    L.texto(W0 / 2, H / 2 + 4.5, 'Magnitud A', { tam: 12.5 }).texto(W0 / 2, 1.5 * H + 4.5, 'Magnitud B', { tam: 12.5 });
    for (let j = 0; j < 5; j++) {
      L.texto(X(j) + W / 2, H / 2 + 4.5, String(j + 1), { tam: 13 });
      if (visibles[j]) L.texto(X(j) + W / 2, 1.5 * H + 4.5, String(B[j]), { tam: 13, peso: visibles[j] === 2 ? 700 : 400 });
    }
    return L.cerrar('pend-fig', 'Tabla de valores de las magnitudes A y B');
  }
  function genTabla(R) {
    const k = R.pick(CONSTANTES), col = R.int(1, 4);
    const A = [1, 2, 3, 4, 5], B = A.map(x => x * k);
    const vis = A.map((_, j) => (j === col ? 1 : 0)), sol = A.map((_, j) => (j === col ? 1 : 2));
    return {
      html: true,
      enun: `<div class="pend-col">${tabla(B, vis)}</div>`,
      pasos: [
        { t: 'La constante de proporcionalidad se obtiene dividiendo un valor de B entre su valor de A:', m: `k = \\frac{${B[col]}}{${A[col]}} = ${k}` },
        { t: `Cada valor de B es el de A multiplicado por \\(${k}\\):`, m: A.filter((_, j) => j !== col).map(x => `${x} \\cdot ${k} = ${x * k}`).join(',\\quad ') },
        { t: 'Tabla completa:', html: tabla(B, sol) }
      ],
      res: `B: ${B.join(',\\ ')}`,
      resHtml: `Magnitud B: ${B.join(', ')} (constante \\(k = ${k}\\)).`
    };
  }

  /* ================= 5. Porcentaje de una cantidad ================= */
  const PORCENTAJES = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];
  const TOTALES = [80, 120, 200, 250, 300, 450, 500, 600, 750, 900, 1000];
  function genPorcentaje(R) {
    const p = R.pick(PORCENTAJES), T = R.pick(TOTALES), v = p * T / 100;
    return {
      enun: `${pc(p)} \\text{ de } ${T}`,
      pasos: [
        { t: `Calcular el ${p} % de una cantidad es multiplicarla por \\(\\frac{${p}}{100}\\):`, m: `\\frac{${p}}{100} \\cdot ${T} = \\frac{${p} \\cdot ${T}}{100} = \\frac{${miles(p * T)}}{100} = ${dec(v)}` }
      ],
      res: dec(v)
    };
  }

  /* ================= 6 y 7. Descuentos y aumentos ================= */
  const ARTICULO = {
    camiseta: 'Una', 'pantalón': 'Un', zapatos: 'Unos', chaqueta: 'Una', libro: 'Un', mochila: 'Una', gorra: 'Una', bufanda: 'Una',
    'teléfono': 'Un', tablet: 'Una', auriculares: 'Unos', reloj: 'Un', consola: 'Una', monitor: 'Un', 'portátil': 'Un', teclado: 'Un'
  };
  const plural = p => p.endsWith('s');
  const conArt = p => `${ARTICULO[p]} ${p}`;

  function genDescuento(R) {
    const p = R.pick([30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200]), d = R.pick([5, 10, 15, 20, 25, 30, 35, 40, 50]);
    const prod = R.pick(['camiseta', 'pantalón', 'zapatos', 'chaqueta', 'libro', 'mochila', 'gorra', 'bufanda']);
    const rebaja = p * d / 100, fin = p - rebaja, f = (100 - d) / 100;
    return {
      html: true,
      enun: txt(`${conArt(prod)} ${plural(prod) ? 'cuestan' : 'cuesta'} ${p} € y ${plural(prod) ? 'tienen' : 'tiene'} un descuento del ${d} %. ¿Cuánto se paga finalmente?`),
      pasos: [
        { t: `Calculamos el descuento, el ${d} % de ${p} €:`, m: `\\frac{${d}}{100} \\cdot ${p} = ${eur(rebaja)}` },
        { t: 'Se lo restamos al precio inicial:', m: `${p} - ${din(rebaja)} = ${eur(fin)}` },
        { t: `También se puede hacer en un solo paso: pagar un ${d} % menos es pagar el ${100 - d} %, es decir, multiplicar por \\(${dec(f)}\\):`, m: `${p} \\cdot ${dec(f)} = ${eur(fin)}` }
      ],
      res: eur(fin),
      resHtml: `Se pagan \\(${eur(fin)}\\).`
    };
  }

  function genAumento(R) {
    const p = R.pick([40, 50, 60, 70, 80, 90, 100, 120, 150, 180, 200]), d = R.pick([5, 10, 12, 15, 18, 20, 25, 30]);
    const prod = R.pick(['teléfono', 'tablet', 'auriculares', 'reloj', 'consola', 'monitor', 'portátil', 'teclado']);
    const motivo = R.pick(['la subida del IVA', 'el aumento de costes', 'una nueva versión', 'la inflación', 'una mejora del producto', 'la alta demanda']);
    const sube = p * d / 100, fin = p + sube, f = (100 + d) / 100;
    return {
      html: true,
      enun: txt(`${conArt(prod)} ${plural(prod) ? 'cuestan' : 'cuesta'} ${p} €. Por ${motivo}, su precio sube un ${d} %. ¿Cuál es el nuevo precio?`),
      pasos: [
        { t: `Calculamos el aumento, el ${d} % de ${p} €:`, m: `\\frac{${d}}{100} \\cdot ${p} = ${eur(sube)}` },
        { t: 'Se lo sumamos al precio inicial:', m: `${p} + ${din(sube)} = ${eur(fin)}` },
        { t: `También se puede hacer en un solo paso: subir un ${d} % es pagar el ${100 + d} %, es decir, multiplicar por \\(${dec(f)}\\):`, m: `${p} \\cdot ${dec(f)} = ${eur(fin)}` }
      ],
      res: eur(fin),
      resHtml: `El nuevo precio es \\(${eur(fin)}\\).`
    };
  }

  registrarFicha({
    id: 'pend1-proporcionalidad',
    titulo: 'Proporcionalidad',
    detalle: '1.º ESO',
    grupo: 'Recuperación de 1.º ESO',
    enlace: '../pendientes/primero/proporcionalidad-1.html',
    ejercicios: [
      { id: 'equiv', nombre: 'Fracciones equivalentes', peso: 0.5, columnas: 3,
        enunciado: ['Indica si las fracciones son equivalentes. Justifícalo:', 'Indica si las fracciones son equivalentes. Justifícalo:'], generar: genEquiv },
      { id: 'magnitudes', nombre: 'Magnitudes directamente proporcionales', peso: 0.5, columnas: 1,
        enunciado: ['Indica si las magnitudes son directamente proporcionales y explica por qué:', 'Indica si las magnitudes son directamente proporcionales y explica por qué:'], generar: genMagnitudes },
      { id: 'reglatres', nombre: 'Regla de tres (término desconocido)', peso: 0.5, columnas: 3,
        enunciado: ['Calcula el valor de \\(n\\):', 'Calcula el valor de \\(n\\):'], generar: genReglaTres },
      { id: 'tabla', nombre: 'Tabla de proporcionalidad directa', peso: 0.75, columnas: 2,
        enunciado: ['Completa la tabla sabiendo que las magnitudes A y B son directamente proporcionales:', 'Completa las tablas sabiendo que las magnitudes A y B son directamente proporcionales:'], generar: genTabla },
      { id: 'porcentaje', nombre: 'Porcentaje de una cantidad', peso: 0.5, columnas: 3,
        enunciado: ['Calcula:', 'Calcula:'], generar: genPorcentaje },
      { id: 'descuento', nombre: 'Problema: descuento', peso: 0.75, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genDescuento },
      { id: 'aumento', nombre: 'Problema: aumento porcentual', peso: 0.75, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genAumento }
    ]
  });
})();
