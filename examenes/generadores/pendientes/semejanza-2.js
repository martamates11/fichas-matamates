/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Semejanza (pendientes de 2.º ESO).
   Mismos tipos y rangos que la ficha interactiva pendientes/segundo/semejanza-2.html, con
   estos ajustes (la ficha NO los tiene) para trabajar sin calculadora:
   - Segmentos proporcionales: la segunda posibilidad tiene como mucho una cifra decimal.
   - Triángulos (lados): con razón 2/3 los lados del primer triángulo son múltiplos de 3,
     para que el triángulo «semejante» lo sea de verdad (antes se redondeaba).
   - Escala: escalas de mapa reales (1:25 000 a 1:250 000) en lugar de 1:500, que daba
     recorridos de pocos metros y planos de varios metros de largo (la ficha usa 1:500).
   - Cuarto proporcional y ángulos: mismos rangos que la ficha. */
(function () {
  'use strict';
  const { tex, registrarFicha, mcd, pend } = window.EX;
  const { n } = tex;
  const { dec, decTxt, Lienzo, rd } = pend;

  const txt = s => `<span class="pend-texto">${s}</span>`;
  const cm = x => `${dec(x)}\\text{ cm}`;
  const miles = x => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');        // 50 000 (espacio fino)
  const milesTeX = x => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  const seg = s => `\\mathrm{${s}}`;

  /* ================= 1. Teorema de Thales ================= */
  /* Figura: dos rectas que salen de un vértice, cortadas por tres paralelas (A-B, C-D, E-F).
     Los tramos no son iguales, para que ninguna razón valga 1 por casualidad. */
  function figuraThales() {
    const L = Lienzo(), V = [0, 0], u = [-0.42, 1], w = [0.62, 0.86], ts = [45, 85, 150];
    const P = (d, t) => [V[0] + d[0] * t, V[1] + d[1] * t];
    L.linea(V[0], V[1], ...P(u, 170), { grosor: 1.2 }).linea(V[0], V[1], ...P(w, 170), { grosor: 1.2 });
    const izq = ['A', 'C', 'E'], der = ['B', 'D', 'F'];
    ts.forEach((t, i) => {
      const a = P(u, t), b = P(w, t), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
      L.linea(a[0] - dx / l * 14, a[1] - dy / l * 14, b[0] + dx / l * 14, b[1] + dy / l * 14, { grosor: 1.6 });
      L.punto(a[0], a[1], 2.4).punto(b[0], b[1], 2.4);
      L.texto(a[0] - 7, a[1] - 5, izq[i], { tam: 12, peso: 700, ancla: 'end' });
      L.texto(b[0] + 7, b[1] - 5, der[i], { tam: 12, peso: 700, ancla: 'start' });
    });
    return L.cerrar('pend-fig', 'Dos rectas cortadas por tres rectas paralelas, que determinan los puntos A, B, C, D, E y F');
  }
  const FIG_THALES = figuraThales();
  function genThales(R) {
    const izq = ['A', 'C', 'E'], der = ['B', 'D', 'F'], pares = [[0, 1], [0, 2], [1, 2]];
    const s = (a, b) => (R.rand() < 0.5 ? a + b : b + a);
    const tipo = R.int(0, 2);
    let num, den, sol, alt = null, expl;
    if (tipo < 2) {
      const origen = tipo === 0 ? izq : der, destino = tipo === 0 ? der : izq;
      const combos = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== j) combos.push([i, j]);
      const [i, j] = R.pick(combos), [nA, nB] = pares[i], [dA, dB] = pares[j];
      num = s(origen[nA], origen[nB]); den = s(origen[dA], origen[dB]);
      sol = [s(destino[nA], destino[nB]), s(destino[dA], destino[dB])];
      expl = `Las paralelas cortan las dos rectas en segmentos proporcionales: a cada segmento de una recta le corresponde el que está entre las mismas paralelas en la otra (${num} ↔ ${sol[0]}, ${den} ↔ ${sol[1]}).`;
    } else {
      const nombres = pares.map(([i, j]) => ({ izq: s(izq[i], izq[j]), der: s(der[i], der[j]) }));
      const g = R.int(0, 2), c = (g + 1) % 3, x = (g + 2) % 3;
      num = nombres[g].izq; den = nombres[g].der;
      sol = [nombres[c].izq, nombres[c].der]; alt = [nombres[x].izq, nombres[x].der];
      expl = `La razón entre un segmento de la recta izquierda y su correspondiente de la derecha (entre las mismas paralelas) es la misma para cualquier par de paralelas.`;
    }
    const fr = (a, b) => `\\dfrac{${seg(a)}}{${seg(b)}}`;
    return {
      html: true,
      enun: `<div class="pend-col">${FIG_THALES}<span>\\(${fr(num, den)} = \\dfrac{\\phantom{AB}}{\\phantom{AB}}\\)</span></div>`,
      pasos: [
        { t: `Por el teorema de Thales: ${expl}` },
        { t: '', m: `${fr(num, den)} = ${fr(...sol)}${alt ? ` \\qquad (\\text{también } ${fr(...alt)})` : ''}` }
      ],
      res: `${fr(num, den)} = ${fr(...sol)}${alt ? ` \\;\\text{ o bien }\\; ${fr(...alt)}` : ''}`
    };
  }

  /* ================= 2. Segmentos proporcionales ================= */
  const RAZONES = [[3, 5], [2, 5], [2, 3], [3, 4], [4, 5], [3, 7], [4, 7], [5, 6], [5, 7], [5, 8], [2, 7], [3, 8]];
  /* L = p·k (k de 2 a 11) eligiendo k para que p·L/q tenga como mucho una cifra decimal */
  function datosSegmentos(R) {
    const [p, q] = R.pick(RAZONES);
    const ks = []; for (let k = 2; k <= 11; k++) if ((10 * p * p * k) % q === 0) ks.push(k);
    const k = R.pick(ks);
    return { p, q, L: p * k, otro1: q * k, otro2: rd(p * p * k / q, 1) };
  }
  function genSegmentos(R) {
    const { p, q, L, otro1, otro2 } = datosSegmentos(R);
    return {
      html: true,
      enun: txt(`De dos segmentos proporcionales cuya razón es \\(\\frac{${p}}{${q}}\\), uno de ellos mide ${L} cm. ¿Cuánto puede medir el otro? Indica las dos posibilidades.`),
      pasos: [
        { t: `No se dice a qué término de la razón corresponde el segmento de ${L} cm, así que hay dos casos.` },
        { t: `Si corresponde al ${p}:`, m: `\\frac{${p}}{${q}} = \\frac{${L}}{x} \\;\\Rightarrow\\; x = \\frac{${q} \\cdot ${L}}{${p}} = ${cm(otro1)}` },
        { t: `Si corresponde al ${q}:`, m: `\\frac{${p}}{${q}} = \\frac{x}{${L}} \\;\\Rightarrow\\; x = \\frac{${p} \\cdot ${L}}{${q}} = ${cm(otro2)}` }
      ],
      res: `${cm(otro1)} \\;\\text{ o }\\; ${cm(otro2)}`
    };
  }

  /* ================= 3. Semejanza de triángulos (lados) ================= */
  function trianguloAleatorio(R, lados) {
    let a, b, c;
    do { a = R.pick(lados); b = R.pick(lados); c = R.pick(lados); } while (!(a + b > c && a + c > b && b + c > a));
    return [a, b, c];
  }
  const proporcionales = (t1, t2) => {
    const a = t1.slice().sort((x, y) => x - y), b = t2.slice().sort((x, y) => x - y);
    return Math.abs(b[0] * a[1] - b[1] * a[0]) < 1e-9 && Math.abs(b[1] * a[2] - b[2] * a[1]) < 1e-9;
  };
  function datosLados(R) {
    const k = R.pick([0.5, 2, 1.5, 3, 2 / 3]);
    const t1 = trianguloAleatorio(R, k === 2 / 3 ? [6, 9, 12] : [4, 5, 6, 7, 8, 9, 10, 11, 12]);
    let t2 = t1.map(x => rd(x * k, 1));
    const semejante = R.rand() < 0.5;
    if (!semejante) {
      for (;;) {
        const c = t2.slice(), i = R.int(0, 2);
        c[i] = rd(c[i] + R.signo() * R.int(1, 3), 1);
        const [x, y, z] = c;
        if (x > 0.5 && y > 0.5 && z > 0.5 && x + y > z && x + z > y && y + z > x && !proporcionales(t1, c)) { t2 = c; break; }
      }
    }
    return { t1, t2, semejante, k };
  }
  /* Cociente: exacto si tiene como mucho dos decimales; si no, aproximado */
  const cociente = (a, b) => { const q = a / b; return Math.abs(rd(q, 2) - q) < 1e-9 ? `= ${dec(q)}` : `\\approx ${dec(q)}`; };
  function genLados(R) {
    const { t1, t2, semejante } = datosLados(R);
    const lista = t => t.map(x => decTxt(x, 1)).join(', ').replace(/, ([^,]*)$/, ' y $1');
    const a = t1.slice().sort((x, y) => x - y), b = t2.slice().sort((x, y) => x - y);
    return {
      html: true,
      enun: txt(`Triángulo 1: lados de ${lista(t1)} cm.<br>Triángulo 2: lados de ${lista(t2)} cm.`),
      pasos: [
        { t: 'Ordenamos los lados de menor a mayor y dividimos cada lado del triángulo 2 entre su correspondiente del triángulo 1:', m: [0, 1, 2].map(i => `\\frac{${dec(b[i], 1)}}{${a[i]}} ${cociente(b[i], a[i])}`).join(' \\qquad ') },
        { t: semejante ? 'Las tres razones son iguales: los lados son proporcionales.' : 'Las razones no son iguales: los lados no son proporcionales.' }
      ],
      res: semejante ? '\\text{Sí son semejantes}' : '\\text{No son semejantes}',
      resHtml: semejante ? `Sí son semejantes (razón \\(${cociente(b[0], a[0]).replace('= ', '').replace('\\approx ', '')}\\)${Math.abs(rd(b[0] / a[0], 2) - b[0] / a[0]) > 1e-9 ? ', es decir, \\(\\frac{2}{3}\\)' : ''}).` : 'No son semejantes.'
    };
  }

  /* ================= 4. Semejanza de triángulos (ángulos) ================= */
  function terna(R) { const x = R.int(20, 109), y = R.int(20, 149 - x); return [x, y, 180 - x - y]; }
  const mismoConjunto = (a, b) => a.slice().sort((m, k) => m - k).join() === b.slice().sort((m, k) => m - k).join();
  const dos = (R, t) => R.shuffle([0, 1, 2]).slice(0, 2).sort((a, b) => a - b).map(i => t[i]);
  function datosAngulos(R) {
    const t1 = terna(R), semejante = R.rand() < 0.5;
    let t2 = t1.slice();
    if (!semejante) do { t2 = terna(R); } while (mismoConjunto(t1, t2));
    return { m1: dos(R, t1), m2: dos(R, t2), semejante };
  }
  function genAngulos(R) {
    const { m1, m2, semejante } = datosAngulos(R);
    const z1 = 180 - m1[0] - m1[1], z2 = 180 - m2[0] - m2[1];
    const g = x => `${x}^\\circ`;
    const ord = (a, b, c) => [a, b, c].sort((x, y) => x - y).map(g).join(',\\ ');
    return {
      html: true,
      enun: txt(`Triángulo 1: dos de sus ángulos miden ${m1[0]}° y ${m1[1]}°.<br>Triángulo 2: dos de sus ángulos miden ${m2[0]}° y ${m2[1]}°.`),
      pasos: [
        { t: 'Los tres ángulos de un triángulo suman 180°. Calculamos el tercer ángulo de cada uno:', m: `180^\\circ - ${g(m1[0])} - ${g(m1[1])} = ${g(z1)} \\qquad 180^\\circ - ${g(m2[0])} - ${g(m2[1])} = ${g(z2)}` },
        { t: 'Comparamos los tres ángulos de cada triángulo:', m: `T_1:\\ ${ord(m1[0], m1[1], z1)} \\qquad T_2:\\ ${ord(m2[0], m2[1], z2)}` },
        { t: semejante ? 'Tienen los mismos ángulos: por el criterio de los ángulos, son semejantes.' : 'No tienen los mismos ángulos: no son semejantes.' }
      ],
      res: semejante ? '\\text{Sí son semejantes}' : '\\text{No son semejantes}'
    };
  }

  /* ================= 5. Escala ================= */
  const ESCALAS = [{ E: 25000, km: [1, 7] }, { E: 50000, km: [1, 15] }, { E: 100000, km: [2, 25] }, { E: 200000, km: [3, 50] }, { E: 250000, km: [5, 60] }];
  function datosEscala(R) {
    const { E, km } = R.pick(ESCALAS);
    const plano = R.int(2, 25), realKm = R.int(km[0], km[1]);
    return { E, plano, realKm, solKm: rd(plano * E / 100000, 2), solCm: rd(realKm * 100000 / E, 1) };
  }
  function genEscala(R) {
    const { E, plano, realKm, solKm, solCm } = datosEscala(R), f = E / 100000;
    return {
      html: true,
      enun: txt(`En un mapa de escala 1 : ${miles(E)}:<br>(1) ¿Cuántos kilómetros reales son ${plano} cm del mapa?<br>(2) ¿Qué longitud tendrá en el mapa una distancia real de ${realKm} km?`),
      pasos: [
        { t: `Cada centímetro del mapa son ${miles(E)} cm reales. Como 1 km = 100 000 cm:`, m: `1\\text{ cm del mapa} \\;\\rightarrow\\; ${milesTeX(E)}\\text{ cm} = ${dec(f)}\\text{ km}` },
        { t: '(1) Multiplicamos:', m: `${plano} \\cdot ${dec(f)} = ${dec(solKm)}\\text{ km}` },
        { t: '(2) Dividimos:', m: `${realKm} : ${dec(f)} = ${cm(solCm)}` }
      ],
      res: `\\text{(1) } ${dec(solKm)}\\text{ km} \\qquad \\text{(2) } ${cm(solCm)}`
    };
  }

  /* ================= 6. Cuarto proporcional ================= */
  function datosCuarto(R) {
    let m, t, p;
    do { m = R.int(2, 9); t = R.int(2, 5); p = R.int(2, 10); } while (p === m || p === m * t);
    return { m, nn: m * t, p, x: t * p };
  }
  function genCuarto(R) {
    const { m, nn, p, x } = datosCuarto(R);
    return {
      html: true,
      enun: txt(`Calcula el segmento cuarto proporcional a \\(m = ${m}\\) cm, \\(n = ${nn}\\) cm y \\(p = ${p}\\) cm.`),
      pasos: [
        { t: 'El cuarto proporcional \\(x\\) cumple \\(\\frac{m}{n} = \\frac{p}{x}\\). Multiplicamos en cruz y despejamos:', m: `\\frac{${m}}{${nn}} = \\frac{${p}}{x} \\;\\Rightarrow\\; x = \\frac{${nn} \\cdot ${p}}{${m}} = \\frac{${nn * p}}{${m}} = ${cm(x)}` }
      ],
      res: `x = ${cm(x)}`
    };
  }

  /* Datos expuestos para las comprobaciones independientes (no los usa el examen) */
  window.EX.pend._semejanza2 = { datosSegmentos, datosLados, datosAngulos, datosEscala, datosCuarto, proporcionales, mcd };

  registrarFicha({
    id: 'pend2-semejanza',
    titulo: 'Semejanza',
    detalle: '2.º ESO',
    grupo: 'Recuperación de 2.º ESO',
    enlace: '../pendientes/segundo/semejanza-2.html',
    ejercicios: [
      { id: 'thales', nombre: 'Teorema de Thales (completar la proporción)', peso: 0.75, columnas: 2,
        enunciado: ['Dos rectas están cortadas por tres rectas paralelas, como en la figura. Completa la igualdad:', 'Dos rectas están cortadas por tres rectas paralelas, como en la figura. Completa las igualdades:'], generar: genThales },
      { id: 'segmentos', nombre: 'Segmentos proporcionales (dos posibilidades)', peso: 1, columnas: 1,
        enunciado: ['Resuelve:', 'Resuelve:'], generar: genSegmentos },
      { id: 'lados', nombre: 'Semejanza de triángulos (criterio de los lados)', peso: 1, columnas: 2,
        enunciado: ['Indica si los triángulos son semejantes y justifícalo:', 'Indica, en cada caso, si los triángulos son semejantes y justifícalo:'], generar: genLados },
      { id: 'angulos', nombre: 'Semejanza de triángulos (criterio de los ángulos)', peso: 0.75, columnas: 2,
        enunciado: ['Indica si los triángulos son semejantes y justifícalo:', 'Indica, en cada caso, si los triángulos son semejantes y justifícalo:'], generar: genAngulos },
      { id: 'escala', nombre: 'Escala (distancia real y en el mapa)', peso: 1, columnas: 2,
        enunciado: ['Resuelve:', 'Resuelve:'], generar: genEscala },
      { id: 'cuarto', nombre: 'Cuarto proporcional', peso: 0.5, columnas: 2,
        enunciado: ['Resuelve:', 'Resuelve:'], generar: genCuarto }
    ]
  });
})();
