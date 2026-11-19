/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Inferencia estadística II (inferencia/inferencia-2.html).
   Mismos tipos que la ficha:
   · Intervalo de confianza para la proporción (con la estimación puntual p̂).
   · Intervalo de confianza para la media con σ conocida.
   · Tamaño muestral mínimo para un error máximo dado (proporción o media).
   · Tamaño muestral mínimo para una longitud máxima del intervalo (proporción o media).
   Diferencias con la ficha:
   · La ficha es de opción múltiple y da z_{α/2} hecho (1,645; 1,96; 2,576). En el examen la respuesta
     es abierta y el valor crítico se busca en la tabla de la N(0, 1) de la hoja anexa (la misma de las
     fichas de la normal; si están en el examen, la tabla se imprime una sola vez). Con la tabla:
     90 % → 1,645 y 99 % → 2,575 (puntos medios, porque 0,95 y 0,995 quedan justo entre dos valores).
   · Además de 90 %, 95 % y 99 % salen otros niveles habituales en la EBAU (85 %, 92 %, 94 %, 96 %,
     97 %, 98 %), que obligan a usar la tabla de verdad.
   · Los tipos de tamaño muestral y de longitud se separan en proporción y media para poder elegirlos,
     y en el tamaño para la proporción puede no haber estudio previo (se toma p = q = 0,5).
   · Contextos extremeños variados (la ficha solo usa cultivos) con medias y desviaciones realistas.
   · Tipos añadidos: nivel de confianza a partir de un intervalo dado y problema completo tipo EBAU
     (intervalo, efecto de subir la confianza y tamaño muestral). */
(function () {
  'use strict';
  const EX = window.EX, NO = EX.normal;
  const { N, H, Z, D, r2, igual } = NO.fmt;

  /* Número con d decimales fijos (TeX y texto) */
  const F = (x, d) => x.toFixed(d).replace('.', '{,}');
  const FH = (x, d) => x.toFixed(d).replace('.', ',');
  const redondea = (x, d) => Number(x.toFixed(d));
  const exacto = (x, d) => Math.abs(x - redondea(x, d)) < 1e-9;

  /* ---------- Contextos ---------- */
  /* Proporción: pob (plural), f (femenino), rasgo (verbo en plural), prop («la proporción de …») */
  const CTX_PROP = [
    { pob: 'parcelas de tomate ecológico de las Vegas del Guadiana', f: true, rasgo: 'superan el rendimiento exigido por la certificación de calidad', prop: 'la proporción de parcelas que superan ese rendimiento' },
    { pob: 'fincas de pimiento de La Vera', f: true, rasgo: 'aplican técnicas de riego sostenible', prop: 'la proporción de fincas que aplican riego sostenible' },
    { pob: 'jóvenes extremeños de entre 18 y 25 años', f: false, rasgo: 'practican deporte al menos tres veces por semana', prop: 'la proporción de jóvenes que practican deporte con esa frecuencia' },
    { pob: 'hogares de la provincia de Cáceres', f: false, rasgo: 'tienen instaladas placas solares', prop: 'la proporción de hogares con placas solares' },
    { pob: 'visitantes del Teatro Romano de Mérida', f: false, rasgo: 'proceden de fuera de Extremadura', prop: 'la proporción de visitantes que proceden de fuera de la comunidad' },
    { pob: 'estudiantes de 2.º de Bachillerato de Extremadura', f: false, rasgo: 'quieren estudiar en la Universidad de Extremadura', prop: 'la proporción de estudiantes que quieren estudiar en la UEx' },
    { pob: 'olivos de una cooperativa de Tierra de Barros', f: false, rasgo: 'presentan síntomas de la mosca del olivo', prop: 'la proporción de olivos afectados' }
  ];
  /* Media: varb (la variable, para «Se sabe que … sigue una normal»), media («la media de …»),
     un (unidad), ind (individuos de la muestra, plural), mu (rango de x̄), paso (redondeo de x̄),
     sg (desviaciones típicas), pe (redondeo del error en los tipos de tamaño muestral), dec (decimales del IC) */
  const CTX_MEDIA = [
    { varb: 'la producción de tomate por hectárea en las Vegas del Guadiana', media: 'la producción media por hectárea', un: 't/ha', ind: 'hectáreas', mu: [70, 95], paso: 0.1, sg: [6, 8, 10, 12], pe: 0.5, dec: 2 },
    { varb: 'el peso de las cerezas del Valle del Jerte', media: 'el peso medio de las cerezas', un: 'g', ind: 'cerezas', mu: [8, 12], paso: 0.1, sg: [1.2, 1.5, 2], pe: 0.1, dec: 3 },
    { varb: 'el tiempo diario de uso del móvil de los jóvenes extremeños', media: 'el tiempo medio diario de uso', un: 'min', ind: 'jóvenes', mu: [150, 240], paso: 1, sg: [30, 40, 45, 50], pe: 1, dec: 2 },
    { varb: 'el consumo eléctrico mensual de los hogares de Badajoz', media: 'el consumo medio mensual', un: 'kWh', ind: 'hogares', mu: [250, 350], paso: 1, sg: [40, 50, 60], pe: 1, dec: 2 },
    { varb: 'la estatura de los jóvenes extremeños de 18 años', media: 'la estatura media', un: 'cm', ind: 'jóvenes', mu: [168, 176], paso: 0.1, sg: [6, 7, 8], pe: 0.5, dec: 2 },
    { varb: 'el tiempo de desplazamiento al trabajo en Cáceres', media: 'el tiempo medio de desplazamiento', un: 'min', ind: 'trabajadores', mu: [18, 32], paso: 0.1, sg: [5, 6, 8, 10], pe: 0.5, dec: 2 },
    { varb: 'el peso de los corderos de una explotación de La Serena al destete', media: 'el peso medio al destete', un: 'kg', ind: 'corderos', mu: [14, 20], paso: 0.1, sg: [1.5, 2, 2.5, 3], pe: 0.1, dec: 3 }
  ];

  /* Niveles de confianza: los tres clásicos más a menudo y otros que obligan a usar la tabla */
  const CONF = [90, 95, 95, 95, 99, 99, 85, 92, 94, 96, 97, 98];

  /* ---------- Valor crítico z_{α/2} con la tabla ---------- */
  function critico(conf) {
    const alfa = redondea((100 - conf) / 100, 4), a2 = redondea(alfa / 2, 4);
    const u = Math.round((1 - a2) * 10000);
    const b = NO.buscarZ(u, 'z_{\\alpha/2}');
    return {
      z: b.z, zt: b.tres ? N(b.z, 3) : Z(b.z),
      pasos: [
        { t: `Valor crítico: \\(1 - \\alpha = ${N(conf / 100)}\\), luego \\(\\alpha = ${N(alfa)}\\) y \\(\\alpha/2 = ${N(a2)}\\). Buscamos \\(z_{\\alpha/2}\\) con \\(P(Z \\le z_{\\alpha/2}) = 1 - \\alpha/2 = ${D(u)}\\).` },
        { t: b.txt }
      ]
    };
  }

  /* Raíz de n: exacta si es cuadrado perfecto */
  const raiz = n => {
    const s = Math.round(Math.sqrt(n));
    return s * s === n ? { tex: String(s), exacta: true } : { tex: `\\sqrt{${n}}`, exacta: false };
  };

  /* Redondeo por exceso del tamaño muestral (con tolerancia por si el cociente es entero) */
  function tamano(raw) {
    const k = Math.round(raw);
    return Math.abs(raw - k) < 1e-6 ? k : Math.ceil(raw);
  }
  function pasoTamano(raw, n) {
    return Math.abs(raw - n) < 1e-6
      ? { t: `El cociente es exacto, así que basta con \\(n = ${n}\\).` }
      : { t: `Como \\(n\\) es un número entero y debe ser mayor o igual que \\(${N(raw, 2)}\\), se redondea por exceso: \\(n = ${n}\\).` };
  }

  /* ---------- Datos de media ---------- */
  function datosMedia(R, ctx) {
    const c = ctx || R.pick(CTX_MEDIA);
    const pasos = Math.round((c.mu[1] - c.mu[0]) / c.paso);
    const xb = redondea(c.mu[0] + R.int(0, pasos) * c.paso, 4);
    return { c, xb, sg: R.pick(c.sg) };
  }
  const enunNormal = d => `Se sabe que ${d.c.varb} sigue una distribución normal con desviación típica \\(\\sigma = ${N(d.sg)}\\) ${d.c.un}.`;

  /* ---------- Cuestiones: { txt, pasos, res } ---------- */

  /* IC para la proporción (a: estimación puntual; b: intervalo) */
  function qICProp(R, c, conf) {
    for (let t = 0; t < 60; t++) {
      const n = R.pick([100, 200, 250, 400, 500, 1000]);
      const k = R.int(Math.ceil(0.12 * n), Math.floor(0.88 * n));
      const p = k / n, q = 1 - p;
      if (!exacto(p, 4)) continue;
      const cr = critico(conf);
      const E = cr.z * Math.sqrt(p * q / n), Er = redondea(E, 4);
      const li = redondea(p - Er, 4), ls = redondea(p + Er, 4);
      return {
        n, k,
        txt: `Se toma una muestra aleatoria de ${n} ${c.pob} y ${k} de ${c.f ? 'ellas' : 'ellos'} ${c.rasgo}.`,
        preg: [`Halla una estimación puntual de ${c.prop}.`, `Calcula un intervalo de confianza al ${conf} % para ${c.prop}.`],
        pasos: [
          { t: '<b>a)</b> La estimación puntual de la proporción es la proporción muestral:', m: `\\hat p = \\frac{${k}}{${n}} = ${N(p)} \\qquad 1 - \\hat p = ${N(q)}` },
          { t: '<b>b)</b> El intervalo de confianza para la proporción es:', m: `\\left(\\hat p - z_{\\alpha/2}\\sqrt{\\frac{\\hat p\\,(1 - \\hat p)}{n}}\\ ;\\ \\hat p + z_{\\alpha/2}\\sqrt{\\frac{\\hat p\\,(1 - \\hat p)}{n}}\\right)` },
          ...cr.pasos,
          { t: 'Error máximo admisible:', m: `E = ${cr.zt} \\cdot \\sqrt{\\frac{${N(p)} \\cdot ${N(q)}}{${n}}} ${igual(E, Er)} ${F(Er, 4)}` },
          { t: 'Intervalo:', m: `(${N(p)} - ${F(Er, 4)}\\ ;\\ ${N(p)} + ${F(Er, 4)}) = (${F(li, 4)}\\ ;\\ ${F(ls, 4)})` },
          { t: `Con una confianza del ${conf} %, ${c.prop} está entre el ${FH(li * 100, 2)} % y el ${FH(ls * 100, 2)} %.` }
        ],
        res: [`\\hat p = ${N(p)}`, `(${F(li, 4)}\\ ;\\ ${F(ls, 4)})`]
      };
    }
    return null;
  }

  /* IC para la media con σ conocida */
  function qICMedia(R, d, conf, nFijo) {
    const n = nFijo || R.pick([25, 36, 49, 64, 81, 100, 121, 144, 150, 200, 225, 250, 400]);
    const cr = critico(conf), rz = raiz(n), dec = d.c.dec;
    const E = cr.z * d.sg / Math.sqrt(n), Er = redondea(E, dec);
    const li = d.xb - Er, ls = d.xb + Er;
    return {
      n, E: Er,
      txt: `Se toma una muestra aleatoria de ${n} ${d.c.ind} y se obtiene una media de ${H(d.xb)} ${d.c.un}.`,
      preg: `Calcula un intervalo de confianza al ${conf} % para ${d.c.media}.`,
      pasos: [
        { t: 'El intervalo de confianza para la media con \\(\\sigma\\) conocida es:', m: `\\left(\\bar x - z_{\\alpha/2}\\,\\frac{\\sigma}{\\sqrt n}\\ ;\\ \\bar x + z_{\\alpha/2}\\,\\frac{\\sigma}{\\sqrt n}\\right)` },
        ...cr.pasos,
        { t: 'Error máximo admisible:', m: `E = ${cr.zt} \\cdot \\frac{${N(d.sg)}}{${rz.tex}} ${igual(E, Er)} ${F(Er, dec)}` },
        { t: 'Intervalo:', m: `(${N(d.xb)} - ${F(Er, dec)}\\ ;\\ ${N(d.xb)} + ${F(Er, dec)}) = (${F(li, dec)}\\ ;\\ ${F(ls, dec)})` }
      ],
      res: `(${F(li, dec)}\\ ;\\ ${F(ls, dec)})`
    };
  }

  /* Tamaño muestral para la media: error máximo E0 (porLong: se da la longitud L = 2·E0) */
  function qTamMedia(R, d, conf, porLong, mismoZ) {
    const cr = critico(conf);
    for (let t = 0; t < 60; t++) {
      const f = 0.08 + R.rand() * 0.37;
      const E0 = redondea(Math.max(d.c.pe, Math.round(d.sg * f / d.c.pe) * d.c.pe), 4);
      const raw = Math.pow(cr.z * d.sg / E0, 2), n = tamano(raw);
      if (n < 12 || n > 3000) continue;
      const L = redondea(2 * E0, 4);
      const pasos = [];
      if (porLong) pasos.push({ t: 'La longitud del intervalo es el doble del error máximo:', m: `L = 2E \\;\\Rightarrow\\; E = \\frac{${N(L)}}{2} = ${N(E0)}` });
      if (mismoZ) pasos.push({ t: `Con el mismo nivel de confianza que en el apartado a), \\(z_{\\alpha/2} = ${cr.zt}\\).` });
      else pasos.push(...cr.pasos);
      pasos.push({ t: 'El error máximo es \\(E = z_{\\alpha/2}\\,\\dfrac{\\sigma}{\\sqrt n}\\). Imponemos que no supere el valor pedido y despejamos \\(n\\):', m: `${cr.zt} \\cdot \\frac{${N(d.sg)}}{\\sqrt n} \\le ${N(E0)} \\;\\Rightarrow\\; n \\ge \\left(\\frac{${cr.zt} \\cdot ${N(d.sg)}}{${N(E0)}}\\right)^2 ${igual(raw, r2(raw))} ${N(raw, 2)}` });
      pasos.push(pasoTamano(raw, n));
      const txt = porLong
        ? `¿Cuál es el tamaño mínimo de la muestra para que el intervalo de confianza al ${conf} % para ${d.c.media} tenga una longitud no superior a ${H(L)} ${d.c.un}?`
        : `¿Cuál es el tamaño mínimo de la muestra para que, con un nivel de confianza del ${conf} %, el error máximo cometido al estimar ${d.c.media} no supere ${H(E0)} ${d.c.un}?`;
      return { txt, pasos, res: `n = ${n}`, n };
    }
    return null;
  }

  /* Tamaño muestral para la proporción (con o sin estudio previo) */
  function qTamProp(R, c, conf, porLong) {
    const cr = critico(conf);
    for (let t = 0; t < 60; t++) {
      const previo = R.rand() < 0.7;
      const p = previo ? R.int(3, 17) * 5 / 100 : 0.5, q = redondea(1 - p, 2);
      const E0 = R.pick([0.02, 0.025, 0.03, 0.04, 0.05]);
      const raw = cr.z * cr.z * p * q / (E0 * E0), n = tamano(raw);
      if (n < 30 || n > 5000) continue;
      const L = redondea(2 * E0, 4);
      const intro = `Se quiere estimar la proporción de ${c.pob} que ${c.rasgo}. `
        + (previo ? `Un estudio previo indica que esa proporción es aproximadamente del ${H(p * 100)} %.` : 'No se dispone de ninguna información previa sobre ella.');
      const preg = porLong
        ? `¿Cuál es el tamaño mínimo de la muestra para que el intervalo de confianza al ${conf} % para dicha proporción tenga una longitud no superior a ${H(L)}?`
        : `¿Cuál es el tamaño mínimo de la muestra para que, con un nivel de confianza del ${conf} %, el error máximo cometido al estimar dicha proporción no supere ${H(E0)}?`;
      const pasos = [];
      if (previo) pasos.push({ t: `Tomamos la proporción del estudio previo: \\(p = ${N(p)}\\), \\(1 - p = ${N(q)}\\).` });
      else pasos.push({ t: 'Sin información previa se toma el caso más desfavorable, el que da el mayor tamaño: \\(p = 1 - p = 0{,}5\\).' });
      if (porLong) pasos.push({ t: 'La longitud del intervalo es el doble del error máximo:', m: `L = 2E \\;\\Rightarrow\\; E = \\frac{${N(L)}}{2} = ${N(E0)}` });
      pasos.push(...cr.pasos);
      pasos.push({ t: 'El error máximo es \\(E = z_{\\alpha/2}\\sqrt{\\dfrac{p\\,(1 - p)}{n}}\\). Imponemos que no supere el valor pedido y despejamos \\(n\\):', m: `n \\ge \\frac{z_{\\alpha/2}^2 \\cdot p\\,(1 - p)}{E^2} = \\frac{${cr.zt}^2 \\cdot ${N(p)} \\cdot ${N(q)}}{${N(E0)}^2} ${igual(raw, r2(raw))} ${N(raw, 2)}` });
      pasos.push(pasoTamano(raw, n));
      return { txt: `${intro} ${preg}`, pasos, res: `n = ${n}` };
    }
    return null;
  }

  /* Nivel de confianza a partir de un intervalo para la media */
  const Z_NIVEL = [1.28, 1.34, 1.41, 1.5, 1.55, 1.75, 1.81, 1.88, 1.96, 2.05, 2.17, 2.25, 2.33, 2.4, 2.5];
  function qNivel(R, d) {
    for (let t = 0; t < 80; t++) {
      const rn = R.pick([4, 5, 8, 10, 16, 20, 25]), n = rn * rn;
      const s = d.sg / rn;
      const z = R.pick(Z_NIVEL), E = redondea(z * s, 6);
      if (!exacto(E, 3) || !exacto(s, 4)) continue;
      const li = redondea(d.xb - E, 4), ls = redondea(d.xb + E, 4);
      const ph = NO.phiT(z), conf = 2 * ph - 10000;
      const a2 = 10000 - ph;
      return {
        txt: `Con una muestra aleatoria de ${n} ${d.c.ind} se ha obtenido el intervalo de confianza \\((${N(li)}\\ ;\\ ${N(ls)})\\) para ${d.c.media}, en ${d.c.un}.`,
        preg: ['¿Cuál es la media muestral?', '¿Cuál es el error máximo admisible?', '¿Con qué nivel de confianza se ha construido el intervalo?'],
        pasos: [
          { t: '<b>a)</b> El intervalo está centrado en la media muestral:', m: `\\bar x = \\frac{${N(li)} + ${N(ls)}}{2} = ${N(d.xb)}` },
          { t: '<b>b)</b> El error es la mitad de la longitud del intervalo:', m: `E = \\frac{${N(ls)} - ${N(li)}}{2} = ${N(E)}` },
          { t: '<b>c)</b> Despejamos \\(z_{\\alpha/2}\\) de \\(E = z_{\\alpha/2}\\,\\dfrac{\\sigma}{\\sqrt n}\\):', m: `z_{\\alpha/2} = \\frac{E\\,\\sqrt n}{\\sigma} = \\frac{${N(E)} \\cdot ${rn}}{${N(d.sg)}} = ${Z(z)}` },
          { t: 'Con la tabla:', m: `P(Z \\le ${Z(z)}) = 1 - \\frac{\\alpha}{2} = ${D(ph)} \\;\\Rightarrow\\; \\frac{\\alpha}{2} = ${D(a2)} \\;\\Rightarrow\\; \\alpha = ${D(2 * a2)}` },
          { t: 'Nivel de confianza:', m: `1 - \\alpha = ${D(conf)}, \\text{ es decir, un } ${N(conf / 100, 2)}\\ \\%` }
        ],
        res: [`\\bar x = ${N(d.xb)}`, `E = ${N(E)}`, `1 - \\alpha = ${D(conf)}\\ (${N(conf / 100, 2)}\\ \\%)`]
      };
    }
    return null;
  }

  /* ---------- Ejercicios ---------- */
  const caja = NO.caja;
  const lista = pregs => pregs.map((p, i) => `${String.fromCharCode(97 + i)}) ${p}`).join('<br>');
  const resLista = rs => `<span>${rs.map((r, i) => `${String.fromCharCode(97 + i)})&nbsp;\\(${r}\\)`).join('<br>')}</span>`;
  function intento(f) {
    return function (R) {
      for (let t = 0; t < 40; t++) { const r = f(R); if (r) return r; }
      throw new Error('Sin datos válidos');
    };
  }

  const genICProp = intento(R => {
    const c = R.pick(CTX_PROP), Q = qICProp(R, c, R.pick(CONF));
    if (!Q) return null;
    return { html: true, enun: caja(`${Q.txt}<br>${lista(Q.preg)}`), pasos: Q.pasos, resHtml: resLista(Q.res) };
  });
  const genICMedia = intento(R => {
    const d = datosMedia(R), Q = qICMedia(R, d, R.pick(CONF));
    return { html: true, enun: caja(`${enunNormal(d)} ${Q.txt} ${Q.preg}`), pasos: Q.pasos, res: Q.res };
  });
  const genTamMedia = porLong => intento(R => {
    const d = datosMedia(R), Q = qTamMedia(R, d, R.pick(CONF), porLong);
    if (!Q) return null;
    return { html: true, enun: caja(`${enunNormal(d)} ${Q.txt}`), pasos: Q.pasos, res: Q.res };
  });
  const genTamProp = porLong => intento(R => {
    const c = R.pick(CTX_PROP), Q = qTamProp(R, c, R.pick(CONF), porLong);
    if (!Q) return null;
    return { html: true, enun: caja(Q.txt), pasos: Q.pasos, res: Q.res };
  });
  const genNivel = intento(R => {
    const d = datosMedia(R), Q = qNivel(R, d);
    if (!Q) return null;
    return { html: true, enun: caja(`${enunNormal(d)} ${Q.txt}<br>${lista(Q.preg)}`), pasos: Q.pasos, resHtml: resLista(Q.res) };
  });

  /* Problema completo: IC, mismo IC con más confianza y tamaño muestral */
  const genCompleto = intento(R => {
    const d = datosMedia(R);
    const c1 = R.pick([90, 95, 95, 96]), c2 = R.pick([98, 99, 99]);
    const q1 = qICMedia(R, d, c1);
    const q2 = qICMedia(R, d, c2, q1.n);
    const q3 = qTamMedia(R, d, c1, false, true);
    if (!q3 || q3.n <= q1.n) return null;
    const pasos = [{ t: '<b>a)</b>' }, ...q1.pasos, { t: '<b>b)</b>' }, ...q2.pasos,
      { t: `El intervalo es más amplio (\\(E = ${F(q2.E, d.c.dec)}\\) frente a \\(E = ${F(q1.E, d.c.dec)}\\)): con la misma muestra, ganar confianza cuesta precisión, porque \\(z_{\\alpha/2}\\) aumenta.` },
      { t: '<b>c)</b>' }, ...q3.pasos];
    return {
      html: true,
      enun: caja(`${enunNormal(d)} ${q1.txt}<br>${lista([
        q1.preg,
        `Calcula, con la misma muestra, el intervalo de confianza al ${c2} %. ¿Es más amplio o más estrecho que el anterior? ¿Por qué?`,
        q3.txt.replace(/^¿Cuál es el tamaño mínimo de la muestra/, '¿Qué tamaño mínimo debería tener la muestra')
      ])}`),
      pasos,
      resHtml: resLista([q1.res, `${q2.res},\\ \\text{más amplio}`, q3.res])
    };
  });

  const ENUN = ['Resuelve el siguiente problema con ayuda de la tabla de la distribución normal (anexo):',
                'Resuelve los siguientes problemas con ayuda de la tabla de la distribución normal (anexo):'];
  EX.registrarFicha({
    id: 'inferencia-2',
    titulo: 'Inferencia estadística II',
    detalle: 'Intervalos de confianza y tamaño muestral · EBAU (tabla de la N(0, 1) en hoja anexa)',
    grupo: 'Inferencia estadística',
    enlace: '../inferencia/inferencia-2.html',
    anexo: NO.anexo,
    ejercicios: [
      { id: 'icprop', nombre: 'Intervalo de confianza para la proporción', peso: 1.25, columnas: 1, enunciado: ENUN, generar: genICProp },
      { id: 'icmedia', nombre: 'Intervalo de confianza para la media (σ conocida)', peso: 1, columnas: 1, enunciado: ENUN, generar: genICMedia },
      { id: 'tamprop', nombre: 'Tamaño muestral para la proporción (error máximo)', peso: 1, columnas: 1, enunciado: ENUN, generar: genTamProp(false) },
      { id: 'tammedia', nombre: 'Tamaño muestral para la media (error máximo)', peso: 1, columnas: 1, enunciado: ENUN, generar: genTamMedia(false) },
      { id: 'longprop', nombre: 'Tamaño muestral para la proporción (longitud del intervalo)', peso: 1, columnas: 1, enunciado: ENUN, generar: genTamProp(true) },
      { id: 'longmedia', nombre: 'Tamaño muestral para la media (longitud del intervalo)', peso: 1, columnas: 1, enunciado: ENUN, generar: genTamMedia(true) },
      { id: 'nivel', nombre: 'Media, error y nivel de confianza a partir de un intervalo', peso: 1.25, columnas: 1, enunciado: ENUN, generar: genNivel },
      { id: 'completo', nombre: 'Problema completo tipo EBAU (intervalo, confianza y tamaño)', peso: 2.5, columnas: 1, enunciado: ENUN, generar: genCompleto }
    ]
  });
})();
