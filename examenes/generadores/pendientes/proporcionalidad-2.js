/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Proporcionalidad directa e inversa (pendientes de 2.º ESO).
   Mismos criterios que la ficha interactiva pendientes/segundo/proporcionalidad-2.html.
   Las fracciones equivalentes, la regla de tres y los problemas se generan con plantillas
   (la ficha usa las mismas), así que todos los resultados son exactos y se calculan a mano.
   Diferencias: las fracciones equivalentes se generan con parámetros (la ficha tiene 12 casos fijos, con
   la misma estructura a/b y k·a/k·b o alterado en una unidad); en las magnitudes se añade «con el mismo
   rendimiento» a «personas…» para que el enunciado no sea ambiguo; los problemas de la ficha son 8+8 casos
   fijos y aquí las mismas plantillas con datos al azar de resultado entero. */
(function () {
  'use strict';
  const { tex, registrarFicha, mcd, mcm, pend } = window.EX;
  const { n } = tex;
  const { dec, decTxt } = pend;

  const pc = x => `${n(x)}\\,\\%`;                 // 15 % (con espacio fino, como pide la RAE)
  const din = x => (Number.isInteger(x) ? n(x) : x.toFixed(2).replace('.', '{,}'));   // dinero: 45,50
  const eur = x => `${din(x)}\\text{ €}`;
  const txt = s => `<span class="pend-texto">${s}</span>`;

  /* ================= 1. Fracciones equivalentes ================= */
  /* a/b irreducible (b de 2 a 9) y c/d = (a·k)/(b·k) con k de 2 a 4; la mitad de las veces se
     altera en una unidad el numerador o el denominador para que no sean equivalentes. */
  function genEquivalentes(R) {
    let a, b;
    do { b = R.int(2, 9); a = R.int(1, b - 1); } while (mcd(a, b) !== 1);
    const k = R.int(2, 4), equiv = R.rand() < 0.5;
    let c = a * k, d = b * k;
    if (!equiv) {
      do {
        c = a * k; d = b * k;
        if (R.rand() < 0.5) c += R.signo(); else d += R.signo();
      } while (c < 1 || a * d === b * c);
    }
    const izq = a * d, der = b * c;
    return {
      enun: `\\frac{${a}}{${b}} \\;\\text{ y }\\; \\frac{${c}}{${d}}`,
      pasos: [
        { t: 'Dos fracciones son equivalentes si sus productos cruzados son iguales:', m: `${a} \\cdot ${d} = ${izq} \\qquad ${b} \\cdot ${c} = ${der}` },
        { t: equiv ? `Los productos coinciden: son equivalentes.` : `Los productos son distintos (${izq} ≠ ${der}): no son equivalentes.` }
      ],
      res: equiv ? `\\text{Sí: } ${a} \\cdot ${d} = ${b} \\cdot ${c} = ${izq}` : `\\text{No: } ${a} \\cdot ${d} = ${izq} \\neq ${der} = ${b} \\cdot ${c}`
    };
  }

  /* ================= 2. Magnitudes: ¿directa o inversa? ================= */
  const MAGNITUDES = [
    { texto: 'El número de obreros (con el mismo rendimiento) y el tiempo en terminar un trabajo.', directa: false, porque: 'con el doble de obreros se tarda la mitad' },
    { texto: 'El peso de la fruta y el precio pagado por ella (mismo precio por kg).', directa: true, porque: 'el doble de kilos cuesta el doble' },
    { texto: 'La velocidad constante de un vehículo y el tiempo en recorrer una distancia fija.', directa: false, porque: 'al doble de velocidad se tarda la mitad' },
    { texto: 'El número de cuadernos iguales que compras y el dinero que pagas por ellos.', directa: true, porque: 'el doble de cuadernos cuesta el doble' },
    { texto: 'El número de grifos iguales abiertos y el tiempo en llenar un depósito.', directa: false, porque: 'con el doble de grifos se tarda la mitad' },
    { texto: 'Los litros de gasolina que echas y el precio pagado por ellos (mismo precio por litro).', directa: true, porque: 'el doble de litros cuesta el doble' },
    { texto: 'El número de personas (con el mismo rendimiento) que reparten un trabajo y los días en acabarlo.', directa: false, porque: 'el doble de personas tarda la mitad de días' },
    { texto: 'Los kilómetros recorridos por un coche y la gasolina consumida (velocidad constante).', directa: true, porque: 'el doble de kilómetros gasta el doble de gasolina' },
    { texto: 'El número de pintores (con el mismo ritmo) y el tiempo en pintar una casa.', directa: false, porque: 'el doble de pintores tarda la mitad' },
    { texto: 'El lado de un cuadrado y su perímetro.', directa: true, porque: 'si el lado se duplica, el perímetro también' },
    { texto: 'La velocidad media y el tiempo empleado en un trayecto fijo.', directa: false, porque: 'al doble de velocidad, la mitad de tiempo' },
    { texto: 'El número de entradas de cine y el dinero pagado por ellas (mismo precio por entrada).', directa: true, porque: 'el doble de entradas cuesta el doble' }
  ];
  function genMagnitudes(R) {
    const elegidas = R.shuffle(MAGNITUDES).slice(0, 4), L = '1234';
    const tipo = m => (m.directa ? 'directa' : 'inversa');
    return {
      html: true,
      enun: `<ol class="pend-texto" style="margin:0;padding-left:6mm">${elegidas.map(m => `<li>${m.texto}</li>`).join('')}</ol>`,
      pasos: [
        { t: 'Pensamos qué pasa si una magnitud se duplica: si la otra también se duplica, es directa (cociente constante); si se reduce a la mitad, es inversa (producto constante).' },
        ...elegidas.map((m, i) => ({ t: `${L[i]}) <b>${tipo(m)}</b>: ${m.porque}.` }))
      ],
      resHtml: elegidas.map((m, i) => `${L[i]}) ${tipo(m)}`).join(' · ')
    };
  }

  /* ================= 3. Regla de tres (valor de n) ================= */
  /* a/b = c/n con a/b irreducible (a de 1 a 7, b hasta 10) y c = a·k (k de 2 a 4): n = b·k entero */
  function genReglaTres(R) {
    let a, b;
    do { a = R.int(1, 7); b = R.int(a + 1, 10); } while (mcd(a, b) !== 1);
    const k = R.int(2, 4), c = a * k, sol = b * k;
    return {
      enun: `\\frac{${a}}{${b}} = \\frac{${c}}{n}`,
      pasos: [
        { t: 'Multiplicamos en cruz:', m: `${a} \\cdot n = ${b} \\cdot ${c} = ${b * c}` },
        { t: 'Despejamos \\(n\\):', m: `n = \\frac{${b * c}}{${a}} = ${sol}` }
      ],
      res: `n = ${sol}`
    };
  }

  /* ================= 4. Problemas de proporcionalidad directa e inversa ================= */
  /* Plantillas: la ficha usa estas mismas, con números al azar que dan resultados exactos.
     Cada problema da un par conocido (x1, y1), un valor x2 y pide su correspondiente n. */
  const sinIgual = (R, lista, x) => R.pick(lista.filter(v => v !== x));
  const DIRECTA = [
    R => { const k = R.pick([15, 20, 25, 30, 40, 50]), b = R.pick([6, 8, 10, 12, 15]), c = sinIgual(R, [4, 5, 9, 14, 18, 20, 24, 30], b);
      return { texto: `Un pastelero usa ${k * b} g de harina para ${b} magdalenas. ¿Cuántos gramos necesita para ${c} magdalenas?`, x1: b, y1: k * b, x2: c, uni: 'g', u: 'g', rel: 'a más magdalenas, más harina' }; },
    R => { const r = R.pick([8, 10, 12, 15, 20]), b = R.pick([10, 20, 25, 30, 40]), m = sinIgual(R, [5, 15, 30, 35, 45, 50, 60], b);
      return { texto: `Una furgoneta recorre ${r * b} km con ${b} litros de gasolina. ¿Cuántos litros necesita para ${r * m} km?`, x1: r * b, y1: b, x2: r * m, uni: 'l', u: 'litros', rel: 'a más kilómetros, más gasolina' }; },
    R => { const k = R.pick([5, 8, 12, 15, 20, 25]), b = R.pick([10, 20, 30, 40, 50]), c = R.pick([15, 25, 35, 60, 70, 80]);
      return { texto: `${b} cajas de tornillos pesan ${k * b} kg. ¿Cuánto pesarán ${c} cajas?`, x1: b, y1: k * b, x2: c, uni: 'kg', u: 'kg', rel: 'a más cajas, más peso' }; },
    R => { const k = R.pick([5, 6, 7, 8, 9]), b = R.pick([3, 4, 6, 8, 12, 15]), c = sinIgual(R, [5, 7, 10, 20, 25, 30, 40], b);
      return { texto: `Por ${b} entradas de cine se pagan ${k * b} €. ¿Cuánto costarán ${c} entradas?`, x1: b, y1: k * b, x2: c, uni: '€', u: '€', rel: 'a más entradas, más dinero' }; },
    R => { const k = R.pick([5, 8, 10, 12, 15, 20]), b = R.pick([4, 5, 6, 8, 10]), c = R.pick([12, 15, 20, 25, 30, 45]);
      return { texto: `Un grifo llena ${k * b} litros en ${b} minutos. ¿Cuántos litros llenará en ${c} minutos?`, x1: b, y1: k * b, x2: c, uni: 'l', u: 'litros', rel: 'a más tiempo, más litros' }; },
    R => { const k = R.pick([2, 3, 4, 5]), b = R.pick([10, 15, 20, 30]), c = sinIgual(R, [25, 40, 45, 50, 60, 90], b);
      return { texto: `Un albañil coloca ${k * b} ladrillos en ${b} minutos. ¿Cuántos colocará en ${c} minutos?`, x1: b, y1: k * b, x2: c, uni: '', u: 'ladrillos', rel: 'a más tiempo, más ladrillos' }; },
    R => { const k = R.pick([3, 4, 5, 6]), b = R.pick([4, 6, 8, 10]), c = sinIgual(R, [5, 12, 15, 20, 25], b);
      return { texto: `Con ${b} kg de naranjas se obtienen ${k * b} vasos de zumo. ¿Cuántos vasos se obtienen con ${c} kg?`, x1: b, y1: k * b, x2: c, uni: '', u: 'vasos', rel: 'a más kilos de naranjas, más vasos de zumo' }; },
    R => { const k = R.pick([12, 15, 20, 25, 30]), b = R.pick([3, 4, 5, 6]), c = R.pick([7, 8, 10, 15, 20, 40]);
      return { texto: `Una impresora imprime ${k * b} folios en ${b} minutos. ¿Cuántos folios imprimirá en ${c} minutos?`, x1: b, y1: k * b, x2: c, uni: '', u: 'folios', rel: 'a más tiempo, más folios' }; }
  ];
  /* Inversa: x1·y1 = x2·n. Se elige un producto múltiplo de mcm(x1, x2) con y1 y n en el rango. */
  function inversa(R, xs, ylo, yhi, redondo = 1) {
    for (let i = 0; i < 400; i++) {
      const x1 = R.pick(xs), x2 = sinIgual(R, xs, x1), L = mcm(x1, x2);
      const ms = []; for (let m = 1; L * m / x1 <= yhi && L * m / x2 <= yhi; m++) {
        const y1 = L * m / x1, y2 = L * m / x2;
        if (y1 >= ylo && y2 >= ylo && y1 % redondo === 0 && y2 % redondo === 0) ms.push(m);
      }
      if (ms.length) { const m = R.pick(ms); return { x1, y1: L * m / x1, x2 }; }
    }
    throw new Error('Sin datos para el problema inverso');
  }
  const INVERSA = [
    R => { const d = inversa(R, [2, 3, 4, 5, 6, 8, 9, 10], 6, 120);
      return { ...d, texto: `${d.x1} obreros tardan ${d.y1} días en construir un muro. ¿Cuántos días tardarían ${d.x2} obreros?`, uni: '', u: 'días', rel: 'a más obreros, menos días tardan', prod: 'obreros × días' }; },
    R => { const d = inversa(R, [2, 3, 4, 5, 6, 8], 5, 120);
      return { ...d, texto: `Un depósito se llena en ${d.y1} minutos con ${d.x1} grifos. ¿Cuánto tardarían ${d.x2} grifos?`, uni: 'min', u: 'min', rel: 'a más grifos, menos tiempo tarda en llenarse', prod: 'grifos × minutos' }; },
    R => { const d = inversa(R, [40, 50, 60, 75, 80, 90, 100, 120], 1, 9);
      return { ...d, texto: `Un coche a ${d.x1} km/h tarda ${d.y1} horas en un trayecto. ¿Cuánto tardaría a ${d.x2} km/h?`, uni: 'h', u: 'h', rel: 'a más velocidad, menos tiempo tarda', prod: 'velocidad × tiempo' }; },
    R => { const d = inversa(R, [2, 3, 4, 5, 6, 8, 10], 4, 60);
      return { ...d, texto: `${d.x1} pintores pintan una nave en ${d.y1} días. ¿Cuántos días tardarían ${d.x2} pintores?`, uni: '', u: 'días', rel: 'a más pintores, menos días tardan', prod: 'pintores × días' }; },
    R => { const d = inversa(R, [2, 3, 4, 5, 6, 8, 10], 100, 3000, 10);
      return { ...d, texto: `Repartiendo una herencia entre ${d.x1} personas, a cada una le tocan ${d.y1} €. ¿Cuánto le tocaría a cada una si fueran ${d.x2} personas?`, uni: '€', u: '€', rel: 'a más personas, menos le toca a cada una', prod: 'personas × euros' }; },
    R => { const d = inversa(R, [10, 15, 20, 24, 25, 30, 40, 45, 50, 60], 6, 90);
      return { ...d, texto: `Una granja tiene comida para ${d.x1} vacas durante ${d.y1} días. ¿Para cuántos días llegaría la comida con ${d.x2} vacas?`, uni: '', u: 'días', rel: 'a más vacas, menos días dura la comida', prod: 'vacas × días' }; },
    R => { const d = inversa(R, [2, 3, 4, 5, 6, 8], 6, 120);
      return { ...d, texto: `${d.x1} máquinas fabrican un pedido en ${d.y1} horas. ¿Cuánto tardarían ${d.x2} máquinas?`, uni: 'h', u: 'h', rel: 'a más máquinas, menos horas tardan', prod: 'máquinas × horas' }; },
    R => { const d = inversa(R, [12, 15, 18, 20, 24, 25, 30], 2, 10);
      return { ...d, texto: `Con una velocidad media de ${d.x1} km/h, un ciclista tarda ${d.y1} horas en llegar. ¿Cuánto tardaría a ${d.x2} km/h?`, uni: 'h', u: 'h', rel: 'a más velocidad, menos tiempo tarda', prod: 'velocidad × tiempo' }; }
  ];
  const conU = (v, u) => (u === '' ? n(v) : `${n(v)}\\text{ ${u}}`);
  function genProblema(R, i) {
    const esDirecta = i % 2 === 0;
    const p = R.pick(esDirecta ? DIRECTA : INVERSA)(R);
    const unidad = p.uni === '' ? '' : p.uni;
    let pasos, sol;
    if (esDirecta) {
      sol = p.y1 * p.x2 / p.x1;
      pasos = [
        { t: `Es una proporcionalidad <b>directa</b>: ${p.rel}, en la misma proporción. El cociente es constante.` },
        { t: 'Planteamos la proporción y multiplicamos en cruz:', m: `\\frac{${p.x1}}{${p.y1}} = \\frac{${p.x2}}{n} \\;\\Rightarrow\\; n = \\frac{${p.y1} \\cdot ${p.x2}}{${p.x1}} = \\frac{${p.y1 * p.x2}}{${p.x1}} = ${n(sol)}` }
      ];
    } else {
      sol = p.x1 * p.y1 / p.x2;
      pasos = [
        { t: `Es una proporcionalidad <b>inversa</b>: ${p.rel}. El producto ${p.prod} es constante.` },
        { t: 'Igualamos los productos y despejamos:', m: `${p.x1} \\cdot ${p.y1} = ${p.x2} \\cdot n \\;\\Rightarrow\\; n = \\frac{${p.x1 * p.y1}}{${p.x2}} = ${n(sol)}` }
      ];
    }
    const u = p.u;
    return {
      html: true, enun: txt(p.texto), pasos,
      res: conU(sol, unidad),
      resHtml: `\\(${conU(sol, unidad)}\\)${unidad === '' ? ` ${u}` : ''} (proporcionalidad ${esDirecta ? 'directa' : 'inversa'})`
    };
  }

  /* ================= 5. Porcentajes ================= */
  const PORCENTAJES = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90];
  const TOTALES = [80, 120, 200, 250, 300, 450, 500, 600, 750, 900, 1000];
  /* Como en la ficha, se alterna: calcular el X % de A / hallar qué porcentaje es B de A */
  function genPorcentaje(R, i) {
    const p = R.pick(PORCENTAJES), A = R.pick(TOTALES), B = p * A / 100;
    if (i % 2 === 0) {
      return {
        html: true,
        enun: txt(`Calcula el \\(${pc(p)}\\) de ${A}.`),
        pasos: [{ t: 'Dividimos el porcentaje entre 100 y multiplicamos por el total:', m: `\\frac{${p}}{100} \\cdot ${A} = \\frac{${p * A}}{100} = ${dec(B)}` }],
        res: dec(B)
      };
    }
    return {
      html: true,
      enun: txt(`El \\(X\\,\\%\\) de ${A} es ${decTxt(B)}. ¿Cuánto vale \\(X\\)?`),
      pasos: [{ t: 'Dividimos la cantidad entre el total y multiplicamos por 100:', m: `X = \\frac{${dec(B)}}{${A}} \\cdot 100 = ${p}` }],
      res: `X = ${p}\\,\\%`
    };
  }

  /* ================= 6 y 7. Descuentos y aumentos ================= */
  const ARTICULO = {
    camiseta: 'Una', 'pantalón': 'Un', zapatos: 'Unos', chaqueta: 'Una', libro: 'Un', mochila: 'Una', gorra: 'Una', bufanda: 'Una',
    'teléfono': 'Un', tablet: 'Una', auriculares: 'Unos', reloj: 'Un', consola: 'Una', monitor: 'Un', 'portátil': 'Un', teclado: 'Un'
  };
  const plural = p => p.endsWith('s');
  function genDescuento(R) {
    const P = R.pick([30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200]), d = R.pick([5, 10, 15, 20, 25, 30, 35, 40, 50]);
    const prod = R.pick(['camiseta', 'pantalón', 'zapatos', 'chaqueta', 'libro', 'mochila', 'gorra', 'bufanda']);
    const rebaja = P * d / 100, fin = P - rebaja, f = (100 - d) / 100;
    return {
      html: true,
      enun: txt(`${ARTICULO[prod]} ${prod} ${plural(prod) ? 'cuestan' : 'cuesta'} ${P} € y ${plural(prod) ? 'tienen' : 'tiene'} un descuento del ${d} %. ¿Cuánto pagarás finalmente?`),
      pasos: [
        { t: 'Calculamos el descuento y lo restamos del precio:', m: `\\frac{${d}}{100} \\cdot ${P} = ${eur(rebaja)} \\qquad ${P} - ${din(rebaja)} = ${eur(fin)}` },
        { t: `También se puede multiplicar por el factor de descuento, \\(1 - ${dec(d / 100)} = ${dec(f)}\\):`, m: `${P} \\cdot ${dec(f)} = ${eur(fin)}` }
      ],
      res: eur(fin)
    };
  }
  function genAumento(R) {
    const P = R.pick([40, 50, 60, 70, 80, 90, 100, 120, 150, 180, 200]), a = R.pick([5, 10, 12, 15, 18, 20, 25, 30]);
    const prod = R.pick(['teléfono', 'tablet', 'auriculares', 'reloj', 'consola', 'monitor', 'portátil', 'teclado']);
    const motivo = R.pick(['la subida del IVA', 'un aumento de costes', 'una nueva versión', 'la inflación', 'una mejora del producto', 'la alta demanda']);
    const sube = P * a / 100, fin = P + sube, f = (100 + a) / 100;
    return {
      html: true,
      enun: txt(`${ARTICULO[prod]} ${prod} ${plural(prod) ? 'cuestan' : 'cuesta'} ${P} €. Por ${motivo}, ${plural(prod) ? 'sufren' : 'sufre'} un incremento del ${a} %. ¿Cuál es su nuevo precio?`),
      pasos: [
        { t: 'Calculamos el aumento y lo sumamos al precio:', m: `\\frac{${a}}{100} \\cdot ${P} = ${eur(sube)} \\qquad ${P} + ${din(sube)} = ${eur(fin)}` },
        { t: `También se puede multiplicar por el factor de aumento, \\(1 + ${dec(a / 100)} = ${dec(f)}\\):`, m: `${P} \\cdot ${dec(f)} = ${eur(fin)}` }
      ],
      res: eur(fin)
    };
  }

  registrarFicha({
    id: 'pend2-proporcionalidad',
    titulo: 'Proporcionalidad directa e inversa',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/proporcionalidad-2.html',
    ejercicios: [
      { id: 'equivalentes', nombre: 'Fracciones equivalentes', peso: 0.5, columnas: 3,
        enunciado: ['Indica si las fracciones son equivalentes y justifícalo:', 'Indica si las fracciones son equivalentes y justifícalo:'], generar: genEquivalentes },
      { id: 'magnitudes', nombre: 'Magnitudes: ¿directa o inversa?', peso: 0.75, columnas: 1,
        enunciado: ['Indica si cada par de magnitudes es directa o inversamente proporcional:', 'Indica si cada par de magnitudes es directa o inversamente proporcional:'], generar: genMagnitudes },
      { id: 'regla-tres', nombre: 'Regla de tres (valor de n)', peso: 0.5, columnas: 3,
        enunciado: ['Calcula el valor de \\(n\\):', 'Calcula el valor de \\(n\\):'], generar: genReglaTres },
      { id: 'problema', nombre: 'Problema: identifica el tipo y resuelve (directa e inversa alternadas)', peso: 1.25, columnas: 1,
        enunciado: ['Indica si el problema es de proporcionalidad directa o inversa y resuélvelo:', 'Indica si cada problema es de proporcionalidad directa o inversa y resuélvelo:'], generar: genProblema },
      { id: 'porcentaje', nombre: 'Porcentajes (calcular el tanto por ciento y hallar el porcentaje, alternados)', peso: 0.5, columnas: 2,
        enunciado: ['Resuelve:', 'Resuelve:'], generar: genPorcentaje },
      { id: 'descuento', nombre: 'Descuento (precio final)', peso: 0.75, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genDescuento },
      { id: 'aumento', nombre: 'Aumento porcentual', peso: 0.75, columnas: 1,
        enunciado: ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'], generar: genAumento }
    ]
  });
})();
