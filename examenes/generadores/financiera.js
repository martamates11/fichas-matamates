/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: matemática financiera (1.º Bachillerato).
   Interés simple, interés compuesto, anualidades de capitalización y anualidades de
   amortización, con los mismos criterios numéricos que las fichas interactivas de
   financiera/. En papel se resuelven con calculadora; la solución muestra cada paso. */
(function () {
  'use strict';
  const { registrarFicha } = window.EX;
  const GRUPO = 'Matemática financiera';

  /* ---------- Formato ---------- */
  const r2 = x => Math.round(x * 100) / 100;
  const es = (v, d = 2) => (Math.abs(v) < 5e-10 ? 0 : v).toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
  const eur = v => es(v) + ' €';                                    // texto: 1.234,56 €
  const pct = v => (v * 100).toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' %';
  const nt = (v, d = 2) => {                                        // TeX: 1234{,}56
    let s = (Math.abs(v) < 5e-10 ? 0 : v).toFixed(d);
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('.', '{,}');
  };
  const et = v => `${nt(v)}\\text{ €}`;                             // TeX con euros, hasta 2 decimales
  const et2 = v => `${v.toFixed(2).replace('.', '{,}')}\\text{ €}`;  // TeX con 2 decimales fijos
  const tiempoTxt = t => (t === 1 ? '1 año' : t === 1.5 ? 'año y medio' : `${String(t).replace('.', ',')} años`);
  const P = html => `<div class="pl-texto"><p>${html}</p></div>`;
  const tabla = (cab, filas) => `<table class="fin-tabla"><thead><tr>${cab.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${
    filas.map(f => `<tr>${f.map((c, i) => `<td${i ? '' : ' class="c"'}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const ej = (enun, pasos, res) => ({ html: true, enun: P(enun), pasos, resHtml: res });

  /* Estilos propios de las tablas de solución (se inyectan una vez) */
  if (!document.getElementById('fin-estilos')) {
    const st = document.createElement('style'); st.id = 'fin-estilos';
    st.textContent = '.fin-tabla{border-collapse:collapse;font-size:9.5pt;margin:1mm 0 1mm 5mm;font-variant-numeric:tabular-nums}' +
      '.fin-tabla th,.fin-tabla td{border:1px solid #999;padding:.6mm 2.2mm;text-align:right}' +
      '.fin-tabla th{background:#eee;font-weight:600;text-align:center}.fin-tabla td.c{text-align:center}';
    document.head.appendChild(st);
  }

  /* =================== INTERÉS SIMPLE =================== */
  function simpleCf(R) {
    const C0 = R.int(12, 160) * 50, r = R.int(4, 16) / 200, t = R.int(2, 6);
    const I = C0 * r * t, Cf = C0 + I;
    const enun = R.pick([
      `Colocamos <b>${eur(C0)}</b> en una entidad bancaria que ofrece un interés simple anual del <b>${pct(r)}</b> durante <b>${t} años</b>. ¿Cuántos intereses se generan? ¿Cuál es el capital final?`,
      `Lucía ingresa <b>${eur(C0)}</b> en un depósito al <b>${pct(r)}</b> de interés simple anual. ¿Cuánto dinero tendrá al cabo de <b>${t} años</b>? ¿Cuánto habrá ganado?`
    ]);
    return ej(enun, [
      { t: 'Datos: \\(C_0 = ' + nt(C0) + '\\) €, \\(r = ' + nt(r, 4) + '\\) (tanto por uno), \\(t = ' + t + '\\) años. Intereses:', m: `I = C_0 \\cdot r \\cdot t = ${nt(C0)} \\cdot ${nt(r, 4)} \\cdot ${t} = ${et(I)}` },
      { t: 'Capital final:', m: `C_f = C_0 + I = ${nt(C0)} + ${nt(I)} = ${et(Cf)}` }
    ], `I = ${eur(I)}; C<sub>f</sub> = ${eur(Cf)}`);
  }
  function simpleT(R) {
    const C0 = R.int(10, 200) * 100, r = R.int(4, 16) / 200, t = R.pick([2, 3, 4, 5, 6, 1.5, 2.5, 3.5]);
    const I = C0 * r * t, Cf = C0 + I;
    const extra = t % 1 ? ` (${Math.floor(t)} años y 6 meses)` : '';
    return ej(`Depositamos <b>${eur(C0)}</b> al <b>${pct(r)}</b> de interés simple anual y, al retirarlos, recibimos <b>${eur(Cf)}</b>. ¿Cuánto tiempo ha estado depositado el dinero?`, [
      { t: 'Intereses obtenidos:', m: `I = C_f - C_0 = ${nt(Cf)} - ${nt(C0)} = ${et(I)}` },
      { t: 'Despejamos \\(t\\) de \\(I = C_0 \\cdot r \\cdot t\\):', m: `t = \\frac{I}{C_0 \\cdot r} = \\frac{${nt(I)}}{${nt(C0)} \\cdot ${nt(r, 4)}} = ${nt(t)}\\text{ años}` }
    ], `t = ${String(t).replace('.', ',')} años${extra}`);
  }
  function simpleR(R) {
    const meses = R.rand() < 0.5, r = R.int(4, 16) / 200;
    let C0, t, m;
    if (meses) { m = R.pick([6, 9, 15, 18, 20, 30]); t = m / 12; C0 = R.int(2, 16) * 1200; } else { t = R.int(2, 6); C0 = R.int(10, 200) * 100; }
    const I = C0 * r * t, Cf = C0 + I;
    const pasos = [];
    if (meses) pasos.push({ t: 'Pasamos el tiempo a años:', m: `t = \\frac{${m}}{12} = ${nt(t, 4)}\\text{ años}` });
    pasos.push({ t: 'Intereses:', m: `I = C_f - C_0 = ${nt(Cf)} - ${nt(C0)} = ${et(I)}` });
    pasos.push({ t: 'Despejamos \\(r\\) de \\(I = C_0 \\cdot r \\cdot t\\):', m: `r = \\frac{I}{C_0 \\cdot t} = \\frac{${nt(I)}}{${nt(C0)} \\cdot ${nt(t, 4)}} = ${nt(r, 4)} \\;\\Rightarrow\\; ${nt(r * 100)}\\,\\%` });
    return ej(`Un capital de <b>${eur(C0)}</b> se ha convertido en <b>${eur(Cf)}</b> en <b>${meses ? m + ' meses' : t + ' años'}</b> a interés simple. ¿Qué rédito anual se ha aplicado?`, pasos, `r = ${pct(r)}`);
  }
  function simpleC0(R) {
    const meses = R.rand() < 0.5, r = R.int(4, 16) / 200;
    let C0, t, m;
    if (meses) { m = R.pick([6, 9, 15, 18, 20, 30]); t = m / 12; C0 = R.int(2, 16) * 1200; } else { t = R.int(2, 6); C0 = R.int(10, 200) * 100; }
    const I = C0 * r * t, Cf = C0 + I;
    const pasos = [];
    if (meses) pasos.push({ t: 'Pasamos el tiempo a años:', m: `t = \\frac{${m}}{12} = ${nt(t, 4)}\\text{ años}` });
    pasos.push({ t: 'Despejamos \\(C_0\\) de \\(C_f = C_0 \\cdot (1 + r \\cdot t)\\):', m: `C_0 = \\frac{C_f}{1 + r \\cdot t} = \\frac{${nt(Cf)}}{1 + ${nt(r, 4)} \\cdot ${nt(t, 4)}} = ${et(C0)}` });
    pasos.push({ t: 'Intereses:', m: `I = C_f - C_0 = ${nt(Cf)} - ${nt(C0)} = ${et(I)}` });
    return ej(`¿Qué capital hay que invertir hoy al <b>${pct(r)}</b> de interés simple anual para disponer de <b>${eur(Cf)}</b> dentro de <b>${meses ? m + ' meses' : t + ' años'}</b>? ¿Cuántos intereses se generarán?`, pasos,
      `C<sub>0</sub> = ${eur(C0)}; I = ${eur(I)}`);
  }

  /* =================== INTERÉS COMPUESTO =================== */
  function compTabla(R) {
    const C0 = R.int(12, 160) * 50, r = R.int(6, 20) / 200, t = R.int(3, 4);
    const filas = []; let c = C0;
    for (let k = 1; k <= t; k++) { const I = c * r; filas.push([k, es(c), es(I), es(c + I)]); c += I; }
    return ej(`Colocamos <b>${eur(C0)}</b> al <b>${pct(r)}</b> de interés compuesto anual durante <b>${t} años</b>. Completa una tabla año a año (capital al inicio, intereses del año y capital al final) y comprueba el capital final con la fórmula.`, [
      { t: 'Cada año los intereses se calculan sobre el capital acumulado al inicio de ese año:', html: tabla(['Año', 'Capital al inicio (€)', 'Intereses (€)', 'Capital al final (€)'], filas) },
      { t: 'Comprobación con la fórmula del interés compuesto:', m: `C_f = C_0 \\cdot (1 + r)^t = ${nt(C0)} \\cdot ${nt(1 + r, 4)}^{${t}} = ${et2(c)}` },
      { t: `Intereses totales: \\(${nt(c)} - ${nt(C0)} = ${et2(c - C0)}\\).` }
    ], `C<sub>f</sub> = ${eur(c)}; intereses = ${eur(c - C0)}`);
  }
  function compC0(R) {
    const r = R.int(4, 16) / 200, t = R.int(3, 10), Cf = r2(R.int(10, 200) * 100 * Math.pow(1 + r, t));
    const C0 = Cf / Math.pow(1 + r, t);
    return ej(`¿Qué capital debemos depositar hoy al <b>${pct(r)}</b> de interés compuesto anual para disponer de <b>${eur(Cf)}</b> dentro de <b>${t} años</b>? ¿Cuántos intereses se habrán generado?`, [
      { t: 'Despejamos \\(C_0\\) de \\(C_f = C_0 \\cdot (1 + r)^t\\):', m: `C_0 = \\frac{C_f}{(1 + r)^t} = \\frac{${nt(Cf)}}{${nt(1 + r, 4)}^{${t}}} = ${et2(C0)}` },
      { t: 'Intereses:', m: `I = C_f - C_0 = ${nt(Cf)} - ${nt(C0)} = ${et2(Cf - C0)}` }
    ], `C<sub>0</sub> = ${eur(C0)}; I = ${eur(Cf - C0)}`);
  }
  function compR(R) {
    const rr = R.int(4, 16) / 200, t = R.int(2, 10), C0 = R.int(10, 200) * 100;
    const Cf = r2(C0 * Math.pow(1 + rr, t)), r = Math.pow(Cf / C0, 1 / t) - 1;
    return ej(`Un capital de <b>${eur(C0)}</b> se ha convertido en <b>${eur(Cf)}</b> en <b>${t} años</b> a interés compuesto anual. ¿Qué rédito se ha aplicado?`, [
      { t: 'De \\(C_f = C_0 \\cdot (1 + r)^t\\):', m: `(1 + r)^{${t}} = \\frac{C_f}{C_0} = \\frac{${nt(Cf)}}{${nt(C0)}} = ${nt(Cf / C0, 6)}` },
      { t: `Hacemos la raíz ${t}-ésima y restamos 1:`, m: `1 + r = \\sqrt[${t}]{${nt(Cf / C0, 6)}} = ${nt(1 + r, 4)} \\;\\Rightarrow\\; r = ${nt(r, 4)} \\;\\Rightarrow\\; ${nt(r * 100)}\\,\\%` }
    ], `r ≈ ${pct(r)}`);
  }
  const PERIODOS = [{ k: 2, n: 'semestral', p: 'semestres' }, { k: 4, n: 'trimestral', p: 'trimestres' }, { k: 12, n: 'mensual', p: 'meses' }];
  function compFrac(R) {
    const C0 = R.int(10, 200) * 100, r = R.int(4, 14) / 200, Pd = R.pick(PERIODOS), k = Pd.k, t = R.int(2, 6);
    const i = r / k, n = k * t, Cf = C0 * Math.pow(1 + i, n), tae = Math.pow(1 + i, k) - 1;
    return ej(`Depositamos <b>${eur(C0)}</b> durante <b>${t} años</b> en una cuenta que ofrece un <b>${pct(r)}</b> nominal anual (TIN) con capitalización <b>${Pd.n}</b>. ¿Cuál será el capital final? ¿Cuál es la TAE?`, [
      { t: `Tipo de cada periodo y número de periodos (${Pd.p}):`, m: `i = \\frac{r}{k} = \\frac{${nt(r, 4)}}{${k}} = ${nt(i, 6)}, \\qquad n = k \\cdot t = ${k} \\cdot ${t} = ${n}` },
      { t: 'Capital final:', m: `C_f = C_0 \\cdot (1 + i)^n = ${nt(C0)} \\cdot ${nt(1 + i, 6)}^{${n}} = ${et2(Cf)}` },
      { t: 'TAE (tipo anual equivalente):', m: `\\text{TAE} = (1 + i)^k - 1 = ${nt(1 + i, 6)}^{${k}} - 1 = ${nt(tae, 4)} \\;\\Rightarrow\\; ${nt(tae * 100)}\\,\\%` }
    ], `C<sub>f</sub> = ${eur(Cf)}; TAE ≈ ${pct(tae)}`);
  }

  /* =================== ANUALIDADES DE CAPITALIZACIÓN =================== */
  const cfPre = (a, i, n) => a * (1 + i) * (Math.pow(1 + i, n) - 1) / i;
  function capTabla(R) {
    const Pd = R.pick([{ k: 4, adj: 'trimestral', sust: 'trimestre', T: 'Trimestre', ts: [1, 1.5] }, { k: 2, adj: 'semestral', sust: 'semestre', T: 'Semestre', ts: [2, 3] }]);
    const a = R.int(5, 40) * 25, r = R.int(4, 12) / 200, k = Pd.k, t = R.pick(Pd.ts), i = r / k, n = k * t;
    const filas = []; let acum = 0;
    for (let q = 1; q <= n; q++) { const ini = acum + a, I = ini * i; acum = ini + I; filas.push([q, es(ini), es(I), es(acum)]); }
    return ej(`Al principio de cada ${Pd.sust} ingresamos <b>${eur(a)}</b> en una cuenta que ofrece un <b>${pct(r)}</b> nominal anual con capitalización ${Pd.adj}. Elabora una tabla ${Pd.sust} a ${Pd.sust} y calcula el capital acumulado al cabo de <b>${tiempoTxt(t)}</b>. Compruébalo con la fórmula.`, [
      { t: `Tipo ${Pd.adj} y número de cuotas:`, m: `i = \\frac{${nt(r, 4)}}{${k}} = ${nt(i, 6)}, \\qquad n = ${k} \\cdot ${nt(t)} = ${n}` },
      { t: `Cada ${Pd.sust} empieza con lo acumulado más la nueva cuota, y los intereses se calculan sobre ese capital:`, html: tabla([Pd.T, 'Capital inicial (€)', 'Intereses (€)', 'Capital final (€)'], filas) },
      { t: 'Comprobación con la fórmula (ingresos al principio de cada periodo):', m: `C_f = a \\cdot (1 + i) \\cdot \\frac{(1 + i)^n - 1}{i} = ${nt(a)} \\cdot ${nt(1 + i, 6)} \\cdot \\frac{${nt(1 + i, 6)}^{${n}} - 1}{${nt(i, 6)}} = ${et2(acum)}` },
      { t: `Se han aportado \\(${nt(a)} \\cdot ${n} = ${et(a * n)}\\), así que los intereses son \\(${et2(acum - a * n)}\\).` }
    ], `C<sub>f</sub> = ${eur(acum)}`);
  }
  function capCf(R) {
    const a = R.int(10, 60) * 100, r = R.int(4, 14) / 200, n = R.int(4, 15), Cf = cfPre(a, r, n);
    return ej(`Al principio de cada año ingresamos <b>${eur(a)}</b> en un plan de ahorro al <b>${pct(r)}</b> de interés compuesto anual. ¿Qué capital tendremos al cabo de <b>${n} años</b>? ¿Cuánto habremos aportado y cuánto habremos ganado en intereses?`, [
      { t: 'Anualidad de capitalización con ingresos al principio de cada año:', m: `C_f = a \\cdot (1 + r) \\cdot \\frac{(1 + r)^n - 1}{r} = ${nt(a)} \\cdot ${nt(1 + r, 4)} \\cdot \\frac{${nt(1 + r, 4)}^{${n}} - 1}{${nt(r, 4)}} = ${et2(Cf)}` },
      { t: 'Aportado e intereses:', m: `${nt(a)} \\cdot ${n} = ${et(a * n)}, \\qquad I = ${nt(Cf)} - ${nt(a * n)} = ${et2(Cf - a * n)}` }
    ], `C<sub>f</sub> = ${eur(Cf)}; aportado ${eur(a * n)}; intereses ${eur(Cf - a * n)}`);
  }
  function capCuota(R) {
    const Cf = R.int(30, 300) * 100, r = R.int(4, 14) / 200, n = R.int(3, 12);
    const a = Cf * r / ((1 + r) * (Math.pow(1 + r, n) - 1));
    return ej(`¿Qué cantidad debemos ingresar al principio de cada año en una cuenta al <b>${pct(r)}</b> de interés compuesto anual para reunir <b>${eur(Cf)}</b> al cabo de <b>${n} años</b>? ¿Cuánto se ganará en intereses?`, [
      { t: 'Despejamos \\(a\\) de \\(C_f = a \\cdot (1 + r) \\cdot \\frac{(1 + r)^n - 1}{r}\\):', m: `a = \\frac{C_f \\cdot r}{(1 + r) \\cdot \\left[(1 + r)^n - 1\\right]} = \\frac{${nt(Cf)} \\cdot ${nt(r, 4)}}{${nt(1 + r, 4)} \\cdot \\left(${nt(1 + r, 4)}^{${n}} - 1\\right)} = ${et2(a)}` },
      { t: 'Intereses:', m: `I = ${nt(Cf)} - ${nt(a)} \\cdot ${n} = ${et2(Cf - a * n)}` }
    ], `a = ${eur(a)}; intereses ${eur(Cf - a * n)}`);
  }
  function capMensual(R) {
    const a = R.int(5, 20) * 25, r = R.int(4, 12) / 200, t = R.int(2, 10), i = r / 12, n = 12 * t, Cf = cfPre(a, i, n);
    return ej(`Al principio de cada mes ingresamos <b>${eur(a)}</b> en una cuenta que ofrece un <b>${pct(r)}</b> nominal anual con capitalización mensual. ¿Cuánto tendremos al cabo de <b>${t} años</b>? ¿Cuántos intereses habremos ganado?`, [
      { t: 'Tipo mensual y número de cuotas:', m: `i = \\frac{${nt(r, 4)}}{12} = ${nt(i, 6)}, \\qquad n = 12 \\cdot ${t} = ${n}` },
      { t: 'Capital final (ingresos al principio de cada mes):', m: `C_f = a \\cdot (1 + i) \\cdot \\frac{(1 + i)^n - 1}{i} = ${nt(a)} \\cdot ${nt(1 + i, 6)} \\cdot \\frac{${nt(1 + i, 6)}^{${n}} - 1}{${nt(i, 6)}} = ${et2(Cf)}` },
      { t: 'Intereses:', m: `I = ${nt(Cf)} - ${nt(a)} \\cdot ${n} = ${et2(Cf - a * n)}` }
    ], `C<sub>f</sub> = ${eur(Cf)}; intereses ${eur(Cf - a * n)}`);
  }

  /* =================== ANUALIDADES DE AMORTIZACIÓN =================== */
  const cuotaF = (D, i, n) => D * i / (1 - Math.pow(1 + i, -n));
  function amoCuadro(R) {
    const Pd = R.pick([{ k: 1, adj: 'anual', pl: 'anuales', sust: 'año', T: 'Año', ts: [4, 5, 6] }, { k: 2, adj: 'semestral', pl: 'semestrales', sust: 'semestre', T: 'Semestre', ts: [2, 3] }, { k: 4, adj: 'trimestral', pl: 'trimestrales', sust: 'trimestre', T: 'Trimestre', ts: [1, 1.5] }]);
    const D = R.int(10, 60) * 100, r = R.int(6, 16) / 200, k = Pd.k, t = R.pick(Pd.ts), i = r / k, n = k * t, a = cuotaF(D, i, n);
    const filas = []; let d = D, totI = 0;
    for (let q = 1; q <= n; q++) { const I = d * i, am = a - I; totI += I; filas.push([q, es(d), es(I), es(am), es(d - am)]); d -= am; }
    const pasos = [];
    if (k > 1) pasos.push({ t: `Tipo ${Pd.adj} y número de cuotas:`, m: `i = \\frac{${nt(r, 4)}}{${k}} = ${nt(i, 6)}, \\qquad n = ${k} \\cdot ${nt(t)} = ${n}` });
    pasos.push({ t: 'Cuota (pagos al final de cada periodo):', m: `a = \\frac{D \\cdot i}{1 - (1 + i)^{-n}} = \\frac{${nt(D)} \\cdot ${nt(i, 6)}}{1 - ${nt(1 + i, 6)}^{-${n}}} = ${et2(a)}` });
    pasos.push({ t: 'Cuadro de amortización: intereses = deuda pendiente · \\(i\\); amortización = cuota − intereses; la deuda baja en la amortización:', html: tabla([Pd.T, 'Deuda al inicio (€)', 'Intereses (€)', 'Amortización (€)', 'Deuda al final (€)'], filas) });
    pasos.push({ t: `Total pagado: \\(${nt(a)} \\cdot ${n} = ${et2(a * n)}\\); intereses totales: \\(${et2(totI)}\\).` });
    return ej(`Pedimos un préstamo de <b>${eur(D)}</b> al <b>${pct(r)}</b> nominal anual, que devolveremos en <b>${tiempoTxt(t)}</b> con cuotas ${Pd.pl} iguales pagadas al final de cada ${Pd.sust}. Calcula la cuota y elabora el cuadro de amortización.`, pasos,
      `a = ${eur(a)}; intereses totales ${eur(totI)}`);
  }
  function amoCuota(R) {
    const D = R.int(30, 200) * 100, r = R.int(6, 16) / 200, n = R.int(3, 10), a = cuotaF(D, r, n);
    return ej(`Pedimos un préstamo de <b>${eur(D)}</b> al <b>${pct(r)}</b> de interés compuesto anual, que devolveremos en <b>${n} años</b> con cuotas anuales iguales al final de cada año. ¿Cuál es la cuota? ¿Cuánto pagaremos en total y cuánto en intereses?`, [
      { t: 'Anualidad de amortización:', m: `a = \\frac{D \\cdot r}{1 - (1 + r)^{-n}} = \\frac{${nt(D)} \\cdot ${nt(r, 4)}}{1 - ${nt(1 + r, 4)}^{-${n}}} = ${et2(a)}` },
      { t: 'Total pagado e intereses:', m: `${nt(a)} \\cdot ${n} = ${et2(a * n)}, \\qquad I = ${nt(a * n)} - ${nt(D)} = ${et2(a * n - D)}` }
    ], `a = ${eur(a)}; total ${eur(a * n)}; intereses ${eur(a * n - D)}`);
  }
  function amoMensual(R) {
    const D = R.int(6, 40) * 1000, r = R.int(4, 16) / 200, t = R.int(2, 8), i = r / 12, n = 12 * t, a = cuotaF(D, i, n);
    return ej(`Para comprar un coche pedimos <b>${eur(D)}</b> al <b>${pct(r)}</b> nominal anual, a devolver en <b>${t} años</b> con cuotas mensuales iguales. ¿Cuál es la mensualidad? ¿Cuántos intereses pagaremos en total?`, [
      { t: 'Tipo mensual y número de cuotas:', m: `i = \\frac{${nt(r, 4)}}{12} = ${nt(i, 6)}, \\qquad n = 12 \\cdot ${t} = ${n}` },
      { t: 'Mensualidad:', m: `a = \\frac{D \\cdot i}{1 - (1 + i)^{-n}} = \\frac{${nt(D)} \\cdot ${nt(i, 6)}}{1 - ${nt(1 + i, 6)}^{-${n}}} = ${et2(a)}` },
      { t: 'Intereses:', m: `I = ${nt(a)} \\cdot ${n} - ${nt(D)} = ${et2(a * n - D)}` }
    ], `a = ${eur(a)}; intereses ${eur(a * n - D)}`);
  }
  function amoDeuda(R) {
    const a = R.int(10, 80) * 50, r = R.int(6, 16) / 200, n = R.int(3, 10), D = a * (1 - Math.pow(1 + r, -n)) / r;
    return ej(`Podemos pagar <b>${eur(a)}</b> al final de cada año durante <b>${n} años</b>. Si el banco cobra un <b>${pct(r)}</b> de interés compuesto anual, ¿cuánto dinero nos puede prestar hoy? ¿Cuánto pagaremos en intereses?`, [
      { t: 'Despejamos \\(D\\) de \\(a = \\frac{D \\cdot r}{1 - (1 + r)^{-n}}\\):', m: `D = a \\cdot \\frac{1 - (1 + r)^{-n}}{r} = ${nt(a)} \\cdot \\frac{1 - ${nt(1 + r, 4)}^{-${n}}}{${nt(r, 4)}} = ${et2(D)}` },
      { t: 'Intereses:', m: `I = ${nt(a)} \\cdot ${n} - ${nt(D)} = ${et2(a * n - D)}` }
    ], `D = ${eur(D)}; intereses ${eur(a * n - D)}`);
  }

  /* =================== Registro =================== */
  const unProblema = ['Resuelve el siguiente problema (usa la calculadora y da los importes con dos decimales):', 'Resuelve los siguientes problemas (usa la calculadora y da los importes con dos decimales):'];
  registrarFicha({
    id: 'interes-simple', titulo: 'Interés simple', detalle: '1.º Bachillerato', grupo: GRUPO, enlace: '../financiera/interes-simple.html',
    ejercicios: [
      { id: 'cf', nombre: 'Capital final e intereses', peso: 1, columnas: 1, enunciado: unProblema, generar: simpleCf },
      { id: 'tiempo', nombre: 'Cálculo del tiempo', peso: 1, columnas: 1, enunciado: unProblema, generar: simpleT },
      { id: 'redito', nombre: 'Cálculo del rédito', peso: 1, columnas: 1, enunciado: unProblema, generar: simpleR },
      { id: 'capital', nombre: 'Cálculo del capital inicial', peso: 1, columnas: 1, enunciado: unProblema, generar: simpleC0 }
    ]
  });
  registrarFicha({
    id: 'interes-compuesto', titulo: 'Interés compuesto', detalle: '1.º Bachillerato', grupo: GRUPO, enlace: '../financiera/interes-compuesto.html',
    ejercicios: [
      { id: 'tabla', nombre: 'Tabla año a año y capital final', peso: 1.5, columnas: 1, enunciado: unProblema, generar: compTabla },
      { id: 'capital', nombre: 'Cálculo del capital inicial', peso: 1, columnas: 1, enunciado: unProblema, generar: compC0 },
      { id: 'redito', nombre: 'Cálculo del rédito', peso: 1.25, columnas: 1, enunciado: unProblema, generar: compR },
      { id: 'fraccionada', nombre: 'Capitalización fraccionada y TAE', peso: 1.5, columnas: 1, enunciado: unProblema, generar: compFrac }
    ]
  });
  registrarFicha({
    id: 'anualidades-capitalizacion', titulo: 'Anualidades de capitalización', detalle: '1.º Bachillerato', grupo: GRUPO, enlace: '../financiera/anualidades-capitalizacion.html',
    ejercicios: [
      { id: 'tabla', nombre: 'Tabla trimestral o semestral', peso: 2, columnas: 1, enunciado: unProblema, generar: capTabla },
      { id: 'capital', nombre: 'Capital final con la fórmula', peso: 1.25, columnas: 1, enunciado: unProblema, generar: capCf },
      { id: 'cuota', nombre: 'Cuota necesaria', peso: 1.25, columnas: 1, enunciado: unProblema, generar: capCuota },
      { id: 'mensual', nombre: 'Cuotas mensuales', peso: 1.25, columnas: 1, enunciado: unProblema, generar: capMensual }
    ]
  });
  registrarFicha({
    id: 'anualidades-amortizacion', titulo: 'Anualidades de amortización', detalle: '1.º Bachillerato', grupo: GRUPO, enlace: '../financiera/anualidades-amortizacion.html',
    ejercicios: [
      { id: 'cuadro', nombre: 'Cuadro de amortización', peso: 2, columnas: 1, enunciado: unProblema, generar: amoCuadro },
      { id: 'cuota', nombre: 'Cuota de un préstamo', peso: 1.25, columnas: 1, enunciado: unProblema, generar: amoCuota },
      { id: 'mensual', nombre: 'Préstamo con cuotas mensuales', peso: 1.25, columnas: 1, enunciado: unProblema, generar: amoMensual },
      { id: 'deuda', nombre: 'Capital prestado', peso: 1.25, columnas: 1, enunciado: unProblema, generar: amoDeuda }
    ]
  });
})();
