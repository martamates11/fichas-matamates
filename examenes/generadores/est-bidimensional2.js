/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Estadística bidimensional II (Estadística).
   Mismos tipos, contexto y convenios que la ficha estadistica/est-bidimensional2.html:
   · Distribuciones marginales: tabla de doble entrada de edad (X) y puntuación en un test (Y),
     3 × 5 con las mismas clases; se completan las marginales y se pide la de una clase.
   · Media y varianza marginal: con las marcas de clase de la ficha (X: 25,5; 45,5; 65,5 e
     Y: 87,5; 200,5; 250,5; 300,5; 413), media = Σ x·n / N y varianza = Σ x²·n / N − media².
   · Covarianza: tabla x, y, f; columnas x·y y x·y·f; S_xy = Σ x·y·f / N − media(x)·media(y).
   · Recta de regresión de Y sobre X (m = S_xy / S_xx, n = ȳ − m·x̄), coeficiente de correlación
     r = S_xy / (S_x · S_y) y valoración de si se puede estimar con la recta
     (|r| ≥ 0,85 sí; entre 0,5 y 0,85 con reservas; menor que 0,5 no). Varianzas dividiendo entre N.
   Diferencias con la ficha (solo las reales):
   · Marginales: se pide una sola frecuencia marginal, como en la ficha; la ficha muestra el
     total N en la tabla y aquí también.
   · Media y varianza: las frecuencias van de 5 a 30 (la ficha, de 5 a 40) para reducir cuentas;
     se pide la media, la varianza o ambas de X o de Y (la ficha pide solo una cosa). La media se
     usa sin redondear para la varianza y el resultado se da con 2 decimales (la ficha acepta ±0,07).
   · Covarianza: el número total de datos N es 20, 25 o 50, para que las medias (que se dan, como
     en la ficha) sean exactas con 2 decimales como mucho; la ficha las redondea. Las x van
     crecientes y las y pueden crecer o decrecer (en la ficha solo crecen), así que la covarianza
     sale positiva o negativa; además se pregunta si la relación es directa o inversa.
   · Regresión: las muestras tienen 5 o 10 pares de valores enteros (la ficha, de 5 a 8 con
     decimales), para que las medias, varianzas y covarianza que se dan sean exactas con 2
     decimales como mucho. No se da S_x ni S_y (la ficha sí): se calculan como raíz de la varianza,
     y r se obtiene sin redondearlas. m y n a 2 decimales (n con m sin redondear) y r a 4, como en
     la ficha. Se reparten a propósito correlaciones fuertes, moderadas y débiles, positivas y
     negativas. El criterio de la interpretación no se escribe en el enunciado (tampoco en la ficha). */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { rd } = pend;

  /* ---------- Formato ---------- */
  /* Decimal con coma en TeX; evita «-0» */
  const ap = (x, d = 2) => (Math.abs(x - rd(x, d)) < 1e-9 ? '=' : '\\approx');
  const D = (x, d = 2) => { let v = rd(x, d); if (v === 0) v = 0; return pend.dec(v, d); };
  const T = (x, d = 2) => { let v = rd(x, d); if (v === 0) v = 0; return pend.decTxt(v, d); };
  const P = (x, d = 2) => (x < 0 ? `\\left(${D(x, d)}\\right)` : D(x, d));   // negativo entre paréntesis
  const suma = a => a.reduce((s, v) => s + v, 0);
  const minus = s => s.charAt(0).toLowerCase() + s.slice(1);
  const numeradas = arr => `<span class="pend-texto">${arr.map((q, k) => `${k + 1}) ${q}`).join('<br>')}</span>`;
  /* Un valor se redondea sin ambigüedad si no está cerca de un empate */
  const seguro = (v, d) => { const e = Math.abs(v) * Math.pow(10, d); const f = e - Math.floor(e); return Math.abs(f - 0.5) > 0.03; };

  /* ---------- Tablas HTML sobrias (blanco y negro) ---------- */
  const BORDE = 'border:.3mm solid #000;';
  const th = (t, extra = '') => `<th style="${BORDE}padding:1.2mm 2.5mm;font-weight:600;text-align:center;${extra}">${t}</th>`;
  const td = (t, extra = '') => `<td style="${BORDE}padding:1.2mm 2.5mm;text-align:center;min-width:12mm;height:6.5mm;${extra}">${t}</td>`;
  const tabla = (cab, filas) => `<table style="border-collapse:collapse;font-size:.95em;margin:1mm 0"><thead><tr>${cab.map(c => th(c)).join('')}</tr></thead><tbody>${filas.map(f => `<tr>${f.join('')}</tr>`).join('')}</tbody></table>`;
  const vx = (s, i) => `<i>${s}</i><sub>${i}</sub>`;

  /* ================= Datos de la ficha: edad (X) y puntuación en un test (Y) ================= */
  const EDADES = ['16–35', '36–55', '56–75'], MC_X = [25.5, 45.5, 65.5];
  const PUNTS = ['0–175', '176–225', '226–275', '276–325', '326–500'], MC_Y = [87.5, 200.5, 250.5, 300.5, 413];
  const MARCO = 'En un estudio se han registrado la edad (<i>X</i>, en años) y la puntuación obtenida en un test (<i>Y</i>) de un grupo de personas. La tabla recoge la distribución conjunta de frecuencias.';

  function tablaConjunta(datos, margX, margY, N, { vaciaMarg = false, marcas = false } = {}) {
    const cab = ['<i>X</i> \\ <i>Y</i>', ...PUNTS.map((p, j) => p + (marcas ? `<br><small style="font-weight:400">(mc = ${T(MC_Y[j])})</small>` : '')), 'Marginal <i>X</i>'];
    const vacio = '';
    const filas = EDADES.map((e, i) => [
      td(`<b>${e}</b>${marcas ? `<br><small>(mc = ${T(MC_X[i])})</small>` : ''}`, 'text-align:left'),
      ...datos[i].map(v => td(v)),
      td(vaciaMarg ? vacio : `<b>${margX[i]}</b>`)
    ]);
    filas.push([td('<b>Marginal <i>Y</i></b>', 'text-align:left'), ...margY.map(v => td(vaciaMarg ? vacio : `<b>${v}</b>`)), td(`<b>${N}</b>`)]);
    return tabla(cab, filas);
  }
  function genDatos(R, lo, hi) {
    const datos = EDADES.map(() => PUNTS.map(() => R.int(lo, hi)));
    const margX = datos.map(f => suma(f)), margY = PUNTS.map((_, j) => suma(datos.map(f => f[j])));
    return { datos, margX, margY, N: suma(margX) };
  }

  /* ================= 1. Distribuciones marginales ================= */
  function genMarginales(R) {
    const { datos, margX, margY, N } = genDatos(R, 5, 40);
    const ejeX = R.rand() < 0.5;
    const idx = ejeX ? R.int(0, 2) : R.int(0, 4);
    const resp = ejeX ? margX[idx] : margY[idx];
    const pregunta = ejeX ? `el intervalo de edad ${EDADES[idx]} años` : `el intervalo de puntuación ${PUNTS[idx]} puntos`;
    const lineasX = margX.map((m, i) => `n_{${i + 1}\\cdot} = ${datos[i].join(' + ')} = ${m}`).join(' \\\\ ');
    const lineasY = margY.map((m, j) => `n_{\\cdot ${j + 1}} = ${datos.map(f => f[j]).join(' + ')} = ${m}`).join(' \\\\ ');
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">${MARCO} Completa las frecuencias marginales de la tabla y responde: ¿cuál es la frecuencia marginal ${pregunta.replace(/^el /, 'del ').replace(/^(?!del )/, 'de ')}?</span>${tablaConjunta(datos, margX, margY, N, { vaciaMarg: true })}</div>`,
      pasos: [
        { t: 'La frecuencia marginal de una fila (o de una columna) es la suma de todos sus valores. Empezamos por las filas, es decir, por las marginales de \\(X\\) (edad):', m: lineasX, multilinea: true },
        { t: 'Seguimos con las columnas, que dan las marginales de \\(Y\\) (puntuación):', m: lineasY, multilinea: true },
        { t: `El total de datos es la suma de las marginales de \\(X\\) (o, lo que es lo mismo, de las de \\(Y\\)), lo que sirve de comprobación:`, m: `N = ${margX.join(' + ')} = ${margY.join(' + ')} = ${N}` },
        { t: 'Tabla completa:', html: tablaConjunta(datos, margX, margY, N) },
        { t: `La frecuencia marginal ${pregunta.replace(/^el /, 'del ').replace(/^(?!del )/, 'de ')} es la de su ${ejeX ? 'fila' : 'columna'}:`, m: ejeX ? `n_{${idx + 1}\\cdot} = ${resp}` : `n_{\\cdot ${idx + 1}} = ${resp}` }
      ],
      res: ejeX ? `n_{${idx + 1}\\cdot} = ${resp}` : `n_{\\cdot ${idx + 1}} = ${resp}`,
      resHtml: `Marginales de <i>X</i>: ${margX.join('; ')}. Marginales de <i>Y</i>: ${margY.join('; ')}. <b>Frecuencia pedida: ${resp}</b> (de ${N} datos).`
    };
  }

  /* ================= 2. Media y varianza marginal ================= */
  function genMediaVar(R) {
    for (;;) {
      const { datos, margX, margY, N } = genDatos(R, 5, 30);
      const esX = R.rand() < 0.5;
      const n = esX ? margX : margY, mc = esX ? MC_X : MC_Y, cls = esX ? EDADES : PUNTS;
      const v = esX ? 'x' : 'y', V = esX ? 'X' : 'Y';
      const xn = mc.map((x, i) => x * n[i]), x2n = mc.map((x, i) => x * x * n[i]);
      const S1 = suma(xn), S2 = suma(x2n);
      const media = S1 / N, A = S2 / N, B = media * media, vari = A - B;
      if (!seguro(media, 2) || !seguro(vari, 2)) continue;
      const Ar = rd(A, 4), Br = rd(B, 4);
      if (rd(Ar - Br, 2) !== rd(vari, 2)) continue;
      const pide = R.pick(['media', 'varianza', 'ambas']);
      const VI = `<i>${V}</i>`;
      const quePide = pide === 'media' ? `la media de ${VI}` : pide === 'varianza' ? `la varianza de ${VI}` : `la media y la varianza de ${VI}`;
      const nota = pide === 'media' ? '' : ' Para la varianza usa la media sin redondear.';
      const cab = [`${cls === EDADES ? 'Edad' : 'Puntuación'}`, `Marca de clase <i>${v}</i><sub>i</sub>`, `<i>n</i><sub>i</sub>`, `<i>${v}</i><sub>i</sub> · <i>n</i><sub>i</sub>`, `<i>${v}</i><sub>i</sub><sup>2</sup> · <i>n</i><sub>i</sub>`];
      const filas = cls.map((c, i) => [td(c, 'text-align:left'), td(T(mc[i])), td(n[i]), td(T(xn[i])), td(T(x2n[i]))]);
      filas.push([td('<b>Total</b>', 'text-align:left'), td(''), td(`<b>${N}</b>`), td(`<b>${T(S1)}</b>`), td(`<b>${T(S2)}</b>`)]);
      const pasos = [
        { t: `Trabajamos con la distribución marginal de \\(${V}\\), que ya está en la tabla, y con las marcas de clase \\(${v}_i\\). Añadimos las columnas \\(${v}_i\\cdot n_i\\) y \\(${v}_i^2\\cdot n_i\\) y sumamos:`, html: tabla(cab, filas) }
      ];
      if (pide !== 'varianza') {
        pasos.push({ t: `La media es la suma de los productos \\(${v}_i\\cdot n_i\\) dividida entre el total de datos:`, m: `\\bar{${v}} = \\frac{\\sum ${v}_i\\, n_i}{N} = \\frac{${D(S1)}}{${N}} ${ap(media)} ${D(media)}` });
      }
      if (pide !== 'media') {
        const mt = pide === 'varianza' ? [{ t: `Calculamos primero la media (se guarda sin redondear en la calculadora):`, m: `\\bar{${v}} = \\frac{${D(S1)}}{${N}} ${ap(media, 4)} ${D(media, 4)}` }] : [];
        pasos.push(...mt, {
          t: `La varianza es la media de los cuadrados menos el cuadrado de la media:`,
          m: `S_${v}^2 = \\frac{\\sum ${v}_i^2\\, n_i}{N} - \\bar{${v}}^{\\,2} = \\frac{${D(S2)}}{${N}} - \\left(\\frac{${D(S1)}}{${N}}\\right)^2 \\approx ${D(A, 4)} - ${D(B, 4)} \\approx ${D(vari)}`
        });
      }
      const res = pide === 'media' ? `\\bar{${v}} = ${D(media)}` : pide === 'varianza' ? `S_${v}^2 = ${D(vari)}` : `\\bar{${v}} = ${D(media)},\\quad S_${v}^2 = ${D(vari)}`;
      return {
        html: true,
        enun: `<div class="pend-col"><span class="pend-texto">${MARCO} Se indican también las marcas de clase (mc) de cada intervalo. Calcula ${quePide}, con 2 decimales.${nota}</span>${tablaConjunta(datos, margX, margY, N, { marcas: true })}</div>`,
        pasos, res
      };
    }
  }

  /* ================= 3. Covarianza ================= */
  /* Reparte N en n partes enteras entre lo y hi */
  function repartir(R, total, partes, lo, hi) {
    const a = new Array(partes).fill(lo);
    let resto = total - partes * lo;
    while (resto > 0) { const k = R.int(0, partes - 1); if (a[k] < hi) { a[k]++; resto--; } }
    return a;
  }
  function datosCov(R) {
    for (;;) {
      const n = R.int(4, 6), N = R.pick([20, 25, 50]);
      const f = repartir(R, N, n, 3, 18);
      const xs = [R.int(1, 5)];
      for (let i = 1; i < n; i++) xs.push(xs[i - 1] + R.int(1, 2));
      const signo = R.signo(), pend_ = R.int(1, 3), ruido = R.int(1, 5);
      const base = signo > 0 ? R.int(8, 16) : R.int(26, 40);
      const ys = xs.map(x => base + signo * pend_ * (x - xs[0]) + R.int(-ruido, ruido));
      if (ys.some(y => y < 3 || y > 45) || new Set(ys).size < 3) continue;
      const sx = suma(xs.map((x, i) => x * f[i])), sy = suma(ys.map((y, i) => y * f[i]));
      const mx = sx / N, my = sy / N;                    // N divide a 100: exactas con 2 decimales
      const xy = xs.map((x, i) => x * ys[i]), xyf = xy.map((v, i) => v * f[i]);
      const sxy = suma(xyf) / N - mx * my;
      if (Math.abs(sxy) < 0.5 || !seguro(sxy, 2)) continue;
      return { n, N, f, xs, ys, mx, my, xy, xyf, S: suma(xyf), sxy };
    }
  }
  function genCovarianza(R) {
    const d = datosCov(R);
    const { N, f, xs, ys, mx, my, xy, xyf, S, sxy } = d;
    const cab = [vx('x', 'i'), vx('y', 'i'), vx('f', 'i'), `${vx('x', 'i')} · ${vx('y', 'i')}`, `${vx('x', 'i')} · ${vx('y', 'i')} · ${vx('f', 'i')}`];
    const enunFilas = xs.map((x, i) => [td(x), td(ys[i]), td(f[i]), td(''), td('')]);
    enunFilas.push([td('<b>Total</b>', 'text-align:left'), td(''), td(`<b>${N}</b>`), td(''), td('')]);
    const solFilas = xs.map((x, i) => [td(x), td(ys[i]), td(f[i]), td(xy[i]), td(xyf[i])]);
    solFilas.push([td('<b>Total</b>'), td(''), td(`<b>${N}</b>`), td(''), td(`<b>${S}</b>`)]);
    const A = S / N, B = mx * my;
    const C = A - B;
    const dir = sxy > 0
      ? 'La covarianza es positiva: la relación entre las variables es <b>directa</b> (cuando una crece, la otra tiende a crecer).'
      : 'La covarianza es negativa: la relación entre las variables es <b>inversa</b> (cuando una crece, la otra tiende a decrecer).';
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">Se han observado dos variables, <i>X</i> e <i>Y</i>, en ${N} elementos, con las frecuencias <i>f</i><sub>i</sub> de la tabla. Completa las dos columnas en blanco y calcula la covarianza <i>S</i><sub>xy</sub>, con 2 decimales. Indica si la relación entre las variables es directa o inversa. Se sabe que \\(\\bar{x} = ${D(mx)}\\) y \\(\\bar{y} = ${D(my)}\\).</span>${tabla(cab, enunFilas)}</div>`,
      pasos: [
        { t: 'Multiplicamos \\(x_i\\) por \\(y_i\\) en cada fila y, después, el resultado por la frecuencia \\(f_i\\). Sumamos la última columna:', html: tabla(cab, solFilas) },
        { t: 'La covarianza es la media de los productos menos el producto de las medias:', m: `S_{xy} = \\frac{\\sum x_i\\, y_i\\, f_i}{N} - \\bar{x}\\,\\bar{y} = \\frac{${S}}{${N}} - ${D(mx)} \\cdot ${D(my)} = ${D(A, 4)} - ${D(B, 4)} = ${D(C, 4)}` },
        { t: `Redondeando a 2 decimales, \\(S_{xy} \\approx ${D(sxy)}\\). ${dir}` }
      ],
      res: `S_{xy} = ${D(sxy)}\\ (\\text{relación ${sxy > 0 ? 'directa' : 'inversa'}})`
    };
  }

  /* ================= 4. Recta de regresión y coeficiente de correlación ================= */
  function datosReg(R) {
    const cl = R.pick(['fuerte', 'fuerte', 'moderada', 'moderada', 'debil']);
    for (let it = 0; it < 4000; it++) {
      const n = R.pick([5, 5, 10]);
      const signo = R.signo();
      const xs = [R.int(1, 6)];
      for (let i = 1; i < n; i++) xs.push(xs[i - 1] + R.int(1, 2));
      const pe = R.int(1, 3), amp = cl === 'fuerte' ? R.int(0, 2) : cl === 'moderada' ? R.int(4, 9) : 9;
      const base = R.int(4, 14) + (signo < 0 ? pe * (xs[n - 1] - xs[0]) : 0);
      const ys = xs.map(x => cl === 'debil' ? R.int(2, 16) : base + signo * pe * (x - xs[0]) + R.int(-amp, amp));
      if (ys.some(y => y < 1 || y > 50) || new Set(ys).size < 3) continue;
      const mx = suma(xs) / n, my = suma(ys) / n;
      const sxx = suma(xs.map(x => x * x)) / n - mx * mx, syy = suma(ys.map(y => y * y)) / n - my * my;
      const sxy = suma(xs.map((x, i) => x * ys[i])) / n - mx * my;
      const ok2 = v => Math.abs(v * 100 - Math.round(v * 100)) < 1e-6;
      if (![mx, my, sxx, syy, sxy].every(ok2) || sxx <= 0 || syy <= 0) continue;
      const r = sxy / Math.sqrt(sxx * syy), a = Math.abs(r);
      const okR = cl === 'fuerte' ? (a >= 0.88 && a <= 0.995) : cl === 'moderada' ? (a >= 0.53 && a <= 0.82) : (a >= 0.06 && a <= 0.44);
      if (!okR) continue;
      const m = sxy / sxx, nn = my - m * mx;
      if (Math.abs(m) < 0.05 || !seguro(m, 2) || !seguro(nn, 2) || !seguro(r, 4)) continue;
      return { n, xs, ys, mx: rd(mx), my: rd(my), sxx: rd(sxx), syy: rd(syy), sxy: rd(sxy), r, m, nn };
    }
    throw new Error('Sin datos de regresión');
  }
  /* y = mx + n con signos limpios (m y n ya redondeados) */
  function recta(m, n) {
    const mm = rd(m), nn = rd(n);
    const cx = mm === 1 ? 'x' : mm === -1 ? '-x' : `${D(mm)}x`;
    return `${cx}${nn === 0 ? '' : nn > 0 ? ` + ${D(nn)}` : ` - ${D(-nn)}`}`;
  }
  function genRegresion(R) {
    const d = datosReg(R);
    const { n, xs, ys, mx, my, sxx, syy, sxy, r, m, nn } = d;
    const sx = Math.sqrt(sxx), sy = Math.sqrt(syy);
    const a = Math.abs(r);
    const nivel = a >= 0.85 ? 'fuerte' : a >= 0.5 ? 'moderada' : 'debil';
    const rr = rd(r, 4);
    const tipo = r > 0 ? 'positiva (relación directa)' : 'negativa (relación inversa)';
    const concl = nivel === 'fuerte'
      ? `\\(|r| = ${D(Math.abs(rr), 4)} \\geq 0{,}85\\): la correlación es <b>fuerte</b>, así que <b>sí</b> se puede usar la recta para hacer estimaciones.`
      : nivel === 'moderada'
        ? `\\(0{,}5 \\leq |r| = ${D(Math.abs(rr), 4)} < 0{,}85\\): la correlación es <b>moderada</b>, así que la recta se puede usar <b>con reservas</b>.`
        : `\\(|r| = ${D(Math.abs(rr), 4)} < 0{,}5\\): la correlación es <b>débil</b>, así que <b>no</b> es fiable usar la recta para hacer estimaciones.`;
    const tab = `<table style="border-collapse:collapse;font-size:.95em;margin:1mm 0"><tbody><tr>${th('<i>x</i><sub>i</sub>', 'text-align:left')}${xs.map(x => td(x, 'min-width:9mm')).join('')}</tr><tr>${th('<i>y</i><sub>i</sub>', 'text-align:left')}${ys.map(y => td(y, 'min-width:9mm')).join('')}</tr></tbody></table>`;
    const datosTxt = `\\(\\bar{x} = ${D(mx)}\\), \\(\\bar{y} = ${D(my)}\\), \\(S_{xx} = ${D(sxx)}\\), \\(S_{yy} = ${D(syy)}\\), \\(S_{xy} = ${D(sxy)}\\)`;
    const m4 = D(m, 4), mP = m < 0 ? `\\left(${m4}\\right)` : m4;
    return {
      html: true,
      enun: `<div class="pend-col"><span class="pend-texto">Para una muestra de ${n} observaciones de dos variables, <i>X</i> e <i>Y</i>, se han obtenido estos valores:</span>${tab}<span class="pend-texto">Se sabe además que ${datosTxt}. Calcula, redondeando <i>m</i> y <i>n</i> a 2 decimales (obtén <i>n</i> con <i>m</i> sin redondear) y <i>r</i> a 4 decimales:</span>${numeradas([
        'La recta de regresión de <i>Y</i> sobre <i>X</i>, \\(\\hat{y} = mx + n\\).',
        'El coeficiente de correlación lineal <i>r</i>. Indica si la correlación es positiva o negativa.',
        '¿Podemos usar esta recta de regresión para hacer estimaciones? Justifica la respuesta con el valor de <i>r</i>.'
      ])}</div>`,
      pasos: [
        { t: '<b>Apartado 1).</b> La pendiente de la recta de regresión de \\(Y\\) sobre \\(X\\) es la covarianza dividida entre la varianza de \\(X\\):', m: `m = \\frac{S_{xy}}{S_{xx}} = \\frac{${D(sxy)}}{${D(sxx)}} ${ap(m) === '=' ? `= ${D(m)}` : `${ap(m, 4)} ${D(m, 4)} \\approx ${D(m)}`}` },
        { t: 'El término independiente sale de que la recta pasa por el punto de medias \\((\\bar{x}, \\bar{y})\\). Usamos \\(m\\) sin redondear:', m: `n = \\bar{y} - m\\,\\bar{x} = ${D(my)} - ${mP} \\cdot ${D(mx)} ${ap(nn) === '=' ? `= ${D(nn)}` : `${ap(nn, 4)} ${D(nn, 4)} \\approx ${D(nn)}`}` },
        { t: 'La recta de regresión es:', m: `\\hat{y} = ${recta(m, nn)}` },
        { t: '<b>Apartado 2).</b> Necesitamos las desviaciones típicas, que son las raíces de las varianzas (guárdalas sin redondear en la calculadora):', m: `S_x = \\sqrt{${D(sxx)}} ${ap(sx, 4)} ${D(sx, 4)} \\qquad S_y = \\sqrt{${D(syy)}} ${ap(sy, 4)} ${D(sy, 4)}` },
        { t: 'El coeficiente de correlación lineal es la covarianza dividida entre el producto de las desviaciones típicas:', m: `r = \\frac{S_{xy}}{S_x\\, S_y} = \\frac{${D(sxy)}}{${D(sx, 4)} \\cdot ${D(sy, 4)}} \\approx ${D(rr, 4)}` },
        { t: `Como \\(r\\) es ${r > 0 ? 'positivo' : 'negativo'}, la correlación es ${tipo}.` },
        { t: `<b>Apartado 3).</b> Valoramos el valor absoluto de \\(r\\) (fuerte si \\(|r| \\geq 0{,}85\\); moderada si está entre \\(0{,}5\\) y \\(0{,}85\\); débil si es menor que \\(0{,}5\\)): ${concl}` }
      ],
      res: `\\hat{y} = ${recta(m, nn)},\\quad r = ${D(rr, 4)},\\quad \\text{${nivel === 'fuerte' ? 'correlación fuerte: sí se puede estimar' : nivel === 'moderada' ? 'correlación moderada: con reservas' : 'correlación débil: no es fiable'}}`
    };
  }

  registrarFicha({
    id: 'est-bidimensional2',
    titulo: 'Estadística bidimensional II',
    detalle: 'Marginales, media y varianza, covarianza y regresión',
    grupo: 'Estadística',
    enlace: '../estadistica/est-bidimensional2.html',
    ejercicios: [
      { id: 'marginales', nombre: 'Distribuciones marginales', peso: 1, columnas: 1,
        enunciado: ['Resuelve el siguiente ejercicio de distribuciones marginales:', 'Resuelve los siguientes ejercicios de distribuciones marginales:'], generar: genMarginales },
      { id: 'media-var', nombre: 'Media y varianza marginal', peso: 1.25, columnas: 1,
        enunciado: ['Resuelve el siguiente ejercicio de media y varianza marginales:', 'Resuelve los siguientes ejercicios de media y varianza marginales:'], generar: genMediaVar },
      { id: 'covarianza', nombre: 'Covarianza', peso: 1.25, columnas: 1,
        enunciado: ['Resuelve el siguiente ejercicio de covarianza:', 'Resuelve los siguientes ejercicios de covarianza:'], generar: genCovarianza },
      { id: 'regresion', nombre: 'Recta de regresión y coeficiente de correlación', peso: 2, columnas: 1,
        enunciado: ['Resuelve el siguiente ejercicio de regresión:', 'Resuelve los siguientes ejercicios de regresión:'], generar: genRegresion }
    ]
  });
})();
