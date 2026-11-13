/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen del bloque de funciones:
   · Dominio de una función (polinómicas, racionales, logarítmicas, raíces, exponenciales y compuestas).
   · Estudio de funciones racionales (las mismas familias que la ficha, con otros parámetros).
   · Interpretación de gráficas distancia-tiempo.
   · Tipos de funciones (asociar gráficas y expresiones).
   Los números se eligen con los mismos criterios que las fichas interactivas. */
(function () {
  'use strict';
  const { fr, tex, resolverCuadratica, registrarFicha } = window.EX;
  const { n, frac, poli } = tex;
  const GRUPO = 'Funciones';

  /* ================= Utilidades ================= */
  const INF = '+\\infty', MINF = '-\\infty';
  const R_ = '\\mathbb{R}';
  const menos = s => String(s).replace(/-/g, '−');          // signo menos tipográfico en texto
  /* a·x − b con signos limpios (como la ficha) */
  const lin = (a, b) => poli([[a, 'x'], [-b, '']]);
  /* b − a·x */
  const linInv = (b, a) => poli([[b, ''], [-a, 'x']]);
  const raizTeX = (ind, c) => (ind === 2 ? `\\sqrt{${c}}` : `\\sqrt[${ind}]{${c}}`);
  const quitar = v => `${R_} - \\left\\{${[].concat(v).map(n).join(',\\ ')}\\right\\}`;
  let idSvg = 0;

  /* ================= 1. DOMINIO ================= */
  const raizEntera = R => { const raiz = R.pick([-3, -2, -1, 1, 2, 3, 4, 5]), a = R.pick([1, 2, 3]); return { raiz, a, b: a * raiz }; };

  /* Despeje de a·x − b (>, ≥) 0 con a > 0 */
  function despejeMayor(a, b, raiz, sim) {
    const s = sim === '>' ? '>' : '\\ge';
    if (a === 1) return `${lin(a, b)} ${s} 0 \\;\\Rightarrow\\; x ${s} ${n(raiz)}`;
    return `${lin(a, b)} ${s} 0 \\;\\Rightarrow\\; ${a}x ${s} ${n(b)} \\;\\Rightarrow\\; x ${s} \\frac{${n(b)}}{${a}} = ${n(raiz)}`;
  }
  /* Despeje de b − a·x (>, ≥) 0 con a > 0: al dividir entre −a cambia el sentido */
  function despejeMenor(a, b, raiz, sim) {
    const s = sim === '>' ? '>' : '\\ge', s2 = sim === '>' ? '<' : '\\le';
    return `${linInv(b, a)} ${s} 0 \\;\\Rightarrow\\; ${a === 1 ? '-x' : -a + 'x'} ${s} ${n(-b)} \\;\\Rightarrow\\; x ${s2} ${n(raiz)}`;
  }

  const DOM = {
    polinomicas(R) {
      const v = R.int(0, 3);
      let f;
      if (v === 0) f = poli([[R.int(1, 4), 'x^2'], [R.int(1, 8), 'x'], [R.int(1, 9), '']]);
      else if (v === 1) f = poli([[R.int(1, 3), 'x^3'], [R.int(1, 8), 'x^2'], [R.int(1, 8), 'x'], [R.int(1, 8), '']]);
      else if (v === 2) f = poli([[R.int(2, 6), 'x^4'], [-R.int(1, 6), 'x^2'], [1, '']]);
      else f = `(x - ${R.int(2, 8)})^2 + ${R.int(1, 5)}`;
      return { enun: `f(x) = ${f}`, pasos: [{ t: 'Es una función polinómica: se puede calcular para cualquier número real, sin restricciones.' }], res: R_ };
    },
    racionales(R) {
      const v = R.int(0, 3);
      if (v === 0 || v === 2) {
        const { raiz, a, b } = v === 0 ? raizEntera(R) : { raiz: R.int(2, 5), a: 1, b: 0 };
        const bb = v === 0 ? b : raiz;
        const num = v === 0 ? poli([[R.int(1, 5), 'x'], [R.int(1, 5), '']]) : 'x + 1';
        const den = lin(a, bb);
        return {
          enun: `f(x) = \\frac{${num}}{${den}}`,
          pasos: [{ t: 'Una función racional no existe donde se anula el denominador. Lo igualamos a cero:' },
            { t: '', m: a === 1 ? `${den} = 0 \\;\\Rightarrow\\; x = ${n(raiz)}` : `${den} = 0 \\;\\Rightarrow\\; ${a}x = ${n(bb)} \\;\\Rightarrow\\; x = ${n(raiz)}` },
            { t: `Se excluye ese valor del dominio.` }],
          res: quitar(raiz)
        };
      }
      if (v === 1) {
        const p = R.pick([1, 2, 3]); let q = R.pick([-1, -2, -3, 4, 5]); if (p === q) q++;
        const den = poli([[1, 'x^2'], [-(p + q), 'x'], [p * q, '']]);
        const r = resolverCuadratica(1, -(p + q), p * q);
        const rs = [Math.min(p, q), Math.max(p, q)];
        return {
          enun: `f(x) = \\frac{1}{${den}}`,
          pasos: [{ t: 'Una función racional no existe donde se anula el denominador. Resolvemos:', m: `${den} = 0` }, ...r.pasos,
            { t: 'Se excluyen las dos raíces del dominio.' }],
          res: quitar(rs)
        };
      }
      const k = R.int(1, 5);
      return {
        enun: `f(x) = \\frac{2x}{x^2 + ${k}}`,
        pasos: [{ t: 'Buscamos dónde se anula el denominador:', m: `x^2 + ${k} = 0 \\;\\Rightarrow\\; x^2 = -${k}` },
          { t: `No tiene solución real (un cuadrado nunca es negativo): \\(x^2 + ${k} \\ge ${k} > 0\\). El denominador no se anula nunca.` }],
        res: R_
      };
    },
    logaritmicas(R) {
      const v = R.int(0, 3);
      if (v === 0) {
        const { raiz, a, b } = raizEntera(R), lg = R.pick(['\\log_{2}', '\\ln']);
        return {
          enun: `f(x) = ${lg}(${lin(a, b)})`,
          pasos: [{ t: 'El argumento de un logaritmo tiene que ser estrictamente positivo:', m: despejeMayor(a, b, raiz, '>') }],
          res: `(${n(raiz)},\\ ${INF})`
        };
      }
      if (v === 1) {
        const raiz = R.pick([1, 2, 3, 4]), a = R.pick([1, 2]), b = a * raiz;
        return {
          enun: `f(x) = \\log(${linInv(b, a)})`,
          pasos: [{ t: 'El argumento de un logaritmo tiene que ser estrictamente positivo. Al dividir entre un número negativo, la desigualdad cambia de sentido:', m: despejeMenor(a, b, raiz, '>') }],
          res: `(${MINF},\\ ${n(raiz)})`
        };
      }
      if (v === 2) {
        const k = R.int(1, 4);
        return {
          enun: `f(x) = \\ln(x^2 + ${k})`,
          pasos: [{ t: `El argumento debe ser positivo. Como \\(x^2 \\ge 0\\), se cumple siempre: \\(x^2 + ${k} \\ge ${k} > 0\\).` }],
          res: R_
        };
      }
      return { enun: 'f(x) = \\log(x)', pasos: [{ t: 'El logaritmo solo admite argumentos positivos:', m: 'x > 0' }], res: `(0,\\ ${INF})` };
    },
    raices(R) {
      const v = R.int(0, 3);
      if (v === 0) {
        const { raiz, a, b } = raizEntera(R), ind = R.pick([2, 4]);
        return {
          enun: `f(x) = ${raizTeX(ind, lin(a, b))}`,
          pasos: [{ t: 'En una raíz de índice par el radicando tiene que ser mayor o igual que cero:', m: despejeMayor(a, b, raiz, '>=') }],
          res: `\\left[${n(raiz)},\\ ${INF}\\right)`
        };
      }
      if (v === 1) {
        const raiz = R.pick([1, 2, 3, 4]), a = R.pick([1, 2]), b = a * raiz, ind = R.pick([2, 4]);
        return {
          enun: `f(x) = ${raizTeX(ind, linInv(b, a))}`,
          pasos: [{ t: 'En una raíz de índice par el radicando tiene que ser mayor o igual que cero. Al dividir entre un número negativo, la desigualdad cambia de sentido:', m: despejeMenor(a, b, raiz, '>=') }],
          res: `\\left(${MINF},\\ ${n(raiz)}\\right]`
        };
      }
      if (v === 2) {
        const k = R.int(1, 4);
        return {
          enun: `f(x) = \\sqrt{x^2 + ${k}}`,
          pasos: [{ t: `El radicando debe ser mayor o igual que cero, y \\(x^2 + ${k} \\ge ${k} > 0\\) para cualquier \\(x\\).` }],
          res: R_
        };
      }
      const k = R.pick([1, 2, 3]);
      return {
        enun: `f(x) = \\sqrt{x^2 - ${k * k}}`,
        pasos: [{ t: 'El radicando debe ser mayor o igual que cero:', m: `x^2 - ${k * k} \\ge 0` },
          { t: 'Raíces del radicando:', m: `x^2 = ${k * k} \\;\\Rightarrow\\; x = \\pm ${k}` },
          { t: `Estudiamos el signo de \\(x^2 - ${k * k} = (x + ${k})(x - ${k})\\) en cada tramo:`,
            m: `\\begin{array}{c|ccc} & (-\\infty,\\,-${k}) & (-${k},\\,${k}) & (${k},\\,+\\infty) \\\\ \\hline x^2 - ${k * k} & + & - & + \\end{array}` },
          { t: 'Es positivo fuera del intervalo y vale 0 en los extremos, que se incluyen.' }],
        res: `\\left(${MINF},\\ -${k}\\right] \\cup \\left[${k},\\ ${INF}\\right)`
      };
    },
    exponenciales(R) {
      const v = R.int(0, 3);
      let f;
      if (v === 0) { const a = R.int(1, 4); f = `${R.pick([2, 3, 5])}^{${poli([[a, 'x']])}}`; }
      else if (v === 1) { f = `e^{${poli([[R.int(1, 3), 'x'], [R.int(1, 5), '']])}}`; }
      else if (v === 2) { f = `${R.pick([2, 3])}^{x^2 - ${R.int(1, 4)}}`; }
      else { f = `${R.int(1, 5)} \\cdot ${R.pick([2, 3])}^{-x}`; }
      return {
        enun: `f(x) = ${f}`,
        pasos: [{ t: `El exponente es un polinomio, que existe para todo \\(x\\), y la función exponencial no añade ninguna restricción: se puede calcular para cualquier número real.` }],
        res: R_
      };
    }
  };

  /* Modo desafío de la ficha: funciones compuestas */
  const DESAFIOS = [
    R => { // exponencial con exponente fraccionario
      const b = R.pick([2, 3]), k = R.int(1, 3), d = R.pick([1, 2, 3, 4]);
      return { enun: `f(x) = ${b}^{\\frac{${poli([[k, 'x'], [1, '']])}}{x - ${d}}}`,
        pasos: [{ t: 'La exponencial existe siempre, pero el exponente es una fracción: no existe donde se anula su denominador.', m: `x - ${d} = 0 \\;\\Rightarrow\\; x = ${d}` }],
        res: quitar(d) };
    },
    R => { // raíz de un logaritmo
      const raiz = R.pick([2, 3, 4, 5]), a = R.pick([1, 2]), b = a * raiz - 1;
      return { enun: `f(x) = \\sqrt{\\log(${lin(a, b)})}`,
        pasos: [{ t: 'Hay dos condiciones. El logaritmo exige que su argumento sea positivo:', m: `${lin(a, b)} > 0` },
          { t: 'La raíz exige que el logaritmo sea mayor o igual que cero, es decir, que el argumento sea mayor o igual que 1 (porque \\(\\log 1 = 0\\)):',
            m: a === 1 ? `${lin(a, b)} \\ge 1 \\;\\Rightarrow\\; x \\ge ${raiz}` : `${lin(a, b)} \\ge 1 \\;\\Rightarrow\\; ${a}x \\ge ${b + 1} \\;\\Rightarrow\\; x \\ge ${raiz}` },
          { t: 'La segunda condición es más restrictiva que la primera, así que es la que determina el dominio.' }],
        res: `\\left[${raiz},\\ ${INF}\\right)` };
    },
    R => { // 1 / raíz
      const raiz = R.pick([1, 2, 3, 4]), a = R.pick([1, 2]), b = a * raiz;
      return { enun: `f(x) = \\frac{1}{\\sqrt{${lin(a, b)}}}`,
        pasos: [{ t: 'La raíz exige radicando ≥ 0, pero además está en el denominador y no puede valer 0. Por tanto el radicando ha de ser estrictamente positivo:', m: despejeMayor(a, b, raiz, '>') }],
        res: `(${raiz},\\ ${INF})` };
    },
    R => { // logaritmo de un cociente
      const a = R.int(1, 2), b = R.pick([2, 3, 4]);
      const num = a === 1 ? 'x' : `${a}x`;
      return { enun: `f(x) = \\log\\left(\\frac{${num}}{x - ${b}}\\right)`,
        pasos: [{ t: 'El argumento del logaritmo debe ser positivo:', m: `\\frac{${num}}{x - ${b}} > 0` },
          { t: `El numerador se anula en \\(x = 0\\) y el denominador en \\(x = ${b}\\). Estudiamos el signo en cada tramo:`,
            m: `\\begin{array}{c|ccc} & (-\\infty,\\,0) & (0,\\,${b}) & (${b},\\,+\\infty) \\\\ \\hline ${num} & - & + & + \\\\ x - ${b} & - & - & + \\\\ \\hline \\text{Cociente} & + & - & + \\end{array}` },
          { t: `La desigualdad es estricta: \\(x = 0\\) (el cociente vale 0) y \\(x = ${b}\\) (no existe) no se incluyen.` }],
        res: `(${MINF},\\ 0) \\cup (${b},\\ ${INF})` };
    },
    R => { // exponencial con raíz par en el exponente
      const raiz = R.pick([1, 2, 3]), a = R.pick([1, 2]), b = a * raiz, base = R.pick([2, 3]), ind = R.pick([2, 4]);
      return { enun: `f(x) = ${base}^{${raizTeX(ind, lin(a, b))}}`,
        pasos: [{ t: 'La exponencial no añade restricciones; solo hay que exigir que el radicando de la raíz (índice par) sea mayor o igual que cero:', m: despejeMayor(a, b, raiz, '>=') }],
        res: `\\left[${raiz},\\ ${INF}\\right)` };
    },
    R => { // ln de una raíz
      const a = R.pick([1, 2, 3, 4]);
      return { enun: `f(x) = \\ln\\left(\\sqrt{x - ${a}}\\right)`,
        pasos: [{ t: `La raíz exige \\(x - ${a} \\ge 0\\); el logaritmo exige además que la raíz sea estrictamente positiva, lo que obliga a que el radicando no sea 0:`, m: `x - ${a} > 0 \\;\\Rightarrow\\; x > ${a}` }],
        res: `(${a},\\ ${INF})` };
    },
    R => { // cociente con raíz en el denominador
      const raiz = R.pick([1, 2, 3, 4]), a = R.pick([1, 2]), b = a * raiz;
      return { enun: `f(x) = \\frac{x + 1}{\\sqrt{${linInv(b, a)}}}`,
        pasos: [{ t: 'La raíz está en el denominador: su radicando debe ser estrictamente positivo (≥ 0 por la raíz y ≠ 0 por el denominador):', m: despejeMenor(a, b, raiz, '>') }],
        res: `(${MINF},\\ ${raiz})` };
    },
    R => { // suma de raíz y logaritmo
      const a = R.pick([1, 2, 3]);
      return { enun: `f(x) = \\sqrt{x - ${a}} + \\log(x)`,
        pasos: [{ t: 'Deben cumplirse las dos condiciones a la vez:', m: `\\begin{cases} x - ${a} \\ge 0 \\;\\Rightarrow\\; x \\ge ${a} & \\text{(raíz)} \\\\ x > 0 & \\text{(logaritmo)} \\end{cases}` },
          { t: `La intersección de ambas es \\(x \\ge ${a}\\).` }],
        res: `\\left[${a},\\ ${INF}\\right)` };
    }
  ];
  const ORDEN_VARIADO = ['racionales', 'raices', 'logaritmicas', 'exponenciales', 'polinomicas'];
  const ENUN_DOM = ['Halla el dominio de la siguiente función:', 'Halla el dominio de las siguientes funciones:'];

  registrarFicha({
    id: 'dominio',
    titulo: 'Dominio de una función',
    detalle: '',
    grupo: GRUPO,
    enlace: '../funciones/dominio.html',
    ejercicios: [
      { id: 'racionales', nombre: 'Funciones racionales', peso: 1, columnas: 2, enunciado: ENUN_DOM, generar: R => DOM.racionales(R) },
      { id: 'logaritmicas', nombre: 'Funciones logarítmicas', peso: 1, columnas: 2, enunciado: ENUN_DOM, generar: R => DOM.logaritmicas(R) },
      { id: 'raices', nombre: 'Raíces de índice par', peso: 1, columnas: 2, enunciado: ENUN_DOM, generar: R => DOM.raices(R) },
      { id: 'variado', nombre: 'Variado (los cinco tipos)', peso: 1, columnas: 2, enunciado: ENUN_DOM,
        generar: (R, i) => DOM[ORDEN_VARIADO[i % ORDEN_VARIADO.length]](R) },
      { id: 'desafio', nombre: 'Funciones compuestas (modo desafío)', peso: 1.5, columnas: 2, enunciado: ENUN_DOM,
        generar: R => R.pick(DESAFIOS)(R) }
    ]
  });

  /* ================= 2. FUNCIONES RACIONALES ================= */
  /* Polinomios como arrays de coeficientes de menor a mayor grado: [c0, c1, c2, …] */
  const recorta = P => { P = P.slice(); while (P.length > 1 && P[P.length - 1] === 0) P.pop(); return P; };
  const pEval = (P, x) => P.reduce((s, c, i) => s + c * Math.pow(x, i), 0);
  const pAdd = (A, B) => recorta(Array.from({ length: Math.max(A.length, B.length) }, (_, i) => (A[i] || 0) + (B[i] || 0)));
  const pEsc = (A, k) => recorta(A.map(c => c * k));
  const pMul = (A, B) => { const r = Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => { r[i + j] += a * b; })); return recorta(r); };
  const pDer = A => recorta(A.length > 1 ? A.slice(1).map((c, i) => c * (i + 1)) : [0]);
  const grado = A => recorta(A).length - 1;
  const pNeg = A => recorta(A.map((c, i) => (i % 2 ? -c : c)));        // P(−x)
  const pTeX = A => poli(recorta(A).map((c, i) => [c, i === 0 ? '' : i === 1 ? 'x' : `x^${i}`]).reverse());
  /* División entre un polinomio mónico */
  function pDiv(A, B) {
    A = recorta(A).slice(); const q = Array(Math.max(1, A.length - B.length + 1)).fill(0);
    for (let k = A.length - B.length; k >= 0; k--) {
      const c = A[k + B.length - 1]; q[k] = c;
      B.forEach((b, j) => { A[k + j] -= c * b; });
    }
    return { q: recorta(q), r: recorta(A.slice(0, B.length - 1).length ? A.slice(0, B.length - 1) : [0]) };
  }
  /* Raíces enteras (todas las del diseño lo son) */
  const raicesEnteras = P => { const r = []; if (grado(P) < 1) return r; for (let x = -30; x <= 30; x++) if (pEval(P, x) === 0) r.push(x); return r; };
  const valor = (e, x) => fr(pEval(e.num, x), pEval(e.den, x));
  const punto = (x, y) => `(${frac(fr(x, 1))},\\ ${frac(y)})`;
  const potencia = (base, k) => (/^[a-z]$/.test(base) ? `${base}^{${k}}` : `(${base})^{${k}}`);
  const ext = v => (v === -Infinity ? MINF : v === Infinity ? INF : n(v));
  const intervaloTeX = ivs => (ivs.length ? ivs.map(([a, b]) => `(${ext(a)},\\ ${ext(b)})`).join(' \\cup ') : '\\text{ninguno}');

  /* Familias de la ficha (con parámetros). denF = denominador escrito como factor. */
  const FAMILIAS = {
    evitable: R => { const a = R.pick([-4, -3, -2, -1, 1, 2, 3, 4]); return { fam: 'evitable', num: [-a * a, 0, 1], den: [-a, 1], denF: lin(1, a) }; },
    oblicua: R => { const a = R.pick([-3, -2, -1, 1, 2, 3]); return { fam: 'oblicua', num: [0, 0, 1], den: [-a, 1], denF: lin(1, a) }; },
    oblicuaCreciente: R => { const a = R.pick([-3, -2, -1, 1, 2, 3]); return { fam: 'oblicuaCreciente', num: [0, 2 * a, 1], den: [a, 1], denF: lin(1, -a) }; },
    homografica: R => {
      let k, r, c;
      do { k = R.nz(-4, 4); r = R.nz(-4, 4); c = R.nz(-4, 4); } while (c === -r || Math.abs(k) === 1 && R.rand() < 0.5);
      return { fam: 'homografica', num: [k * r, k], den: [-c, 1], denF: lin(1, c) };
    },
    par: R => { const k = R.int(1, 3), a = R.int(1, 3); return { fam: 'par', num: [0, 0, k], den: [-a * a, 0, 1], denF: `x^2 - ${a * a}` }; },
    imparRaices: R => { const a = R.int(1, 4); return { fam: 'imparRaices', num: [-a * a, 0, 1], den: [0, 1], denF: 'x' }; },
    imparExtremos: R => { const a = R.int(1, 3); return { fam: 'imparExtremos', num: [a * a, 0, 1], den: [0, 1], denF: 'x' }; },
    inflexion: R => { const k = R.int(1, 4), a = R.int(1, 3); return { fam: 'inflexion', num: [0, 0, k], den: [3 * a * a, 0, 1], denF: `x^2 + ${3 * a * a}` }; }
  };

  function estudiar(e) {
    e.tex = `f(x) = \\frac{${pTeX(e.num)}}{${pTeX(e.den)}}`;
    const rDen = raicesEnteras(e.den);
    e.evit = rDen.filter(c => pEval(e.num, c) === 0);
    e.av = rDen.filter(c => pEval(e.num, c) !== 0);
    e.excl = rDen;
    if (e.evit.length) {                                  // simplificada (solo en la familia «evitable»)
      const d = pDiv(e.num, e.den); e.simp = d.q;
    }
    e.f = x => pEval(e.num, x) / pEval(e.den, x);
    const gN = grado(e.num), gD = grado(e.den);
    e.ah = gN === gD ? fr(e.num[gN], e.den[gD]) : null;
    if (gN === gD + 1) { const d = pDiv(e.num, e.den); e.ao = { q: d.q, r: d.r }; } else e.ao = null;
    e.raices = raicesEnteras(e.num).filter(x => !e.excl.includes(x));
    e.corteY = e.excl.includes(0) ? null : valor(e, 0);
    // Derivadas: f' = N1 / den², f'' = N2 / den³
    e.N1 = pAdd(pMul(pDer(e.num), e.den), pEsc(pMul(e.num, pDer(e.den)), -1));
    e.N2 = pAdd(pMul(pDer(e.N1), e.den), pEsc(pMul(e.N1, pDer(e.den)), -2));
    e.d1 = x => pEval(e.N1, x) / Math.pow(pEval(e.den, x), 2);
    e.d2 = x => pEval(e.N2, x) / Math.pow(pEval(e.den, x), 3);
    e.crit = raicesEnteras(e.N1).filter(x => !e.excl.includes(x));
    e.mono = signos(e.crit, e.excl, e.d1);
    e.max = []; e.min = [];
    e.mono.puntos.forEach((p, i) => {
      if (p.excl) return;
      const iz = e.mono.tramos[i].s, de = e.mono.tramos[i + 1].s;
      if (iz > 0 && de < 0) e.max.push(p.x);
      if (iz < 0 && de > 0) e.min.push(p.x);
    });
    e.candPI = raicesEnteras(e.N2).filter(x => !e.excl.includes(x));
    e.curv = signos(e.candPI, e.excl, e.d2);
    e.pi = [];
    e.curv.puntos.forEach((p, i) => { if (!p.excl && e.curv.tramos[i].s !== e.curv.tramos[i + 1].s) e.pi.push(p.x); });
    const fm = pNeg(e.num), dm = pNeg(e.den);
    const esPar = fm.every((c, i) => c === e.num[i]) && dm.every((c, i) => c === e.den[i]);
    const esImpar = (fm.every((c, i) => c === -e.num[i]) && dm.every((c, i) => c === e.den[i])) || (fm.every((c, i) => c === e.num[i]) && dm.every((c, i) => c === -e.den[i]));
    e.sim = esPar ? 'par' : esImpar ? 'impar' : null;
    return e;
  }
  /* Tramos y signos de g separados por los puntos (ordenados) */
  function signos(ceros, excl, g) {
    const pts = [...new Set([...ceros, ...excl])].sort((a, b) => a - b).map(x => ({ x, excl: excl.includes(x) }));
    const bordes = [-Infinity, ...pts.map(p => p.x), Infinity];
    const tramos = [];
    for (let i = 0; i < bordes.length - 1; i++) {
      const a = bordes[i], b = bordes[i + 1];
      const t = a === -Infinity ? (b === Infinity ? 0 : b - 1) : b === Infinity ? a + 1 : (a + b) / 2;
      tramos.push({ a, b, s: Math.sign(g(t)) });
    }
    return { puntos: pts, tramos };
  }
  const intervalosDe = (tr, s) => tr.tramos.filter(t => t.s === s).map(t => [t.a, t.b]);
  function tablaTeX(tr, nombreD, nombreF, flechas) {
    const cols = [], fD = [], fF = [];
    tr.tramos.forEach((t, i) => {
      cols.push(`(${ext(t.a)},\\,${ext(t.b)})`);
      fD.push(t.s > 0 ? '+' : '-');
      fF.push(flechas[t.s > 0 ? 0 : 1]);
      const p = tr.puntos[i];
      if (p) { cols.push(n(p.x)); fD.push(p.excl ? '\\nexists' : '0'); fF.push(p.excl ? '\\nexists' : ''); }
    });
    return `\\begin{array}{c|${'c'.repeat(cols.length)}} x & ${cols.join(' & ')} \\\\ \\hline ${nombreD} & ${fD.join(' & ')} \\\\ ${nombreF} & ${fF.join(' & ')} \\end{array}`;
  }

  /* ---- Bloques de solución ---- */
  function pasosDominio(e) {
    const P = [];
    if (e.excl.length) {
      P.push({ t: 'Dominio: quitamos los valores que anulan el denominador.', m: `${pTeX(e.den)} = 0 \\;\\Rightarrow\\; ${e.excl.length === 1 ? `x = ${n(e.excl[0])}` : `x = \\pm ${Math.abs(e.excl[0])}`} \\qquad \\text{Dom} f = ${quitar(e.excl)}` });
    } else {
      P.push({ t: `Dominio: el denominador \\(${pTeX(e.den)}\\) no se anula nunca (es siempre positivo), así que \\(\\text{Dom} f = ${R_}\\).` });
    }
    return P;
  }
  function pasosAsintotas(e) {
    const P = [];
    if (e.evit.length) {
      const c = e.evit[0], y = pEval(e.simp, c);
      P.push({ t: `En \\(x = ${n(c)}\\) se anulan numerador y denominador. Factorizamos y simplificamos:`,
        m: `f(x) = \\frac{(${lin(1, -c)})(${lin(1, c)})}{${lin(1, c)}} = ${pTeX(e.simp)} \\quad (x \\ne ${n(c)}) \\qquad \\lim_{x \\to ${n(c)}} f(x) = ${n(y)}` });
      P.push({ t: `El límite es finito: en \\(x = ${n(c)}\\) hay una <b>discontinuidad evitable</b> (un hueco en el punto \\((${n(c)},\\ ${n(y)})\\)) y no hay asíntota vertical.` });
    } else if (e.av.length) {
      P.push({ t: 'Ningún valor anula a la vez numerador y denominador: no hay discontinuidades evitables.' });
    }
    if (e.av.length) {
      P.push({ t: `Asíntota${e.av.length > 1 ? 's verticales' : ' vertical'}: en ${e.av.length > 1 ? 'cada valor excluido' : 'el valor excluido'} el numerador no se anula, luego el límite es infinito.`,
        m: e.av.map(c => `\\lim_{x \\to ${n(c)}} f(x) = \\frac{${n(pEval(e.num, c))}}{0} = \\pm\\infty \\;\\Rightarrow\\; x = ${n(c)}`).join(' \\qquad ') });
    } else if (!e.evit.length) {
      P.push({ t: 'No hay asíntotas verticales, porque el denominador no se anula.' });
    }
    const gN = grado(e.num), gD = grado(e.den);
    if (e.ah) {
      P.push({ t: `Asíntota horizontal: numerador y denominador tienen el mismo grado; el límite en el infinito es el cociente de los coeficientes principales.`,
        m: `\\lim_{x \\to \\pm\\infty} f(x) = \\frac{${n(e.num[gN])}}{${n(e.den[gD])}} = ${frac(e.ah)} \\;\\Rightarrow\\; y = ${frac(e.ah)}` });
      P.push({ t: 'Al haber asíntota horizontal, no hay asíntota oblicua.' });
    } else if (e.ao) {
      P.push({ t: 'El grado del numerador supera en uno al del denominador: no hay asíntota horizontal (el límite en el infinito es infinito), pero sí oblicua. Dividimos:',
        m: `f(x) = ${pTeX(e.ao.q)}${e.ao.r[0] === 0 ? '' : ` + \\frac{${pTeX(e.ao.r)}}{${pTeX(e.den)}}`} \\;\\Rightarrow\\; y = ${pTeX(e.ao.q)}` });
      if (e.evit.length) P.push({ t: 'La división es exacta: la gráfica es la propia recta, con el hueco señalado.' });
    }
    return P;
  }
  function resAsintotas(e) {
    const r = [`\\text{Dom} f = ${e.excl.length ? quitar(e.excl) : R_}`];
    r.push(`\\text{Evitable: } ${e.evit.length ? 'x = ' + n(e.evit[0]) : '\\text{no}'}`);
    r.push(`\\text{A.V.: } ${e.av.length ? e.av.map(c => 'x = ' + n(c)).join(',\\ ') : '\\text{no}'}`);
    r.push(`\\text{A.H.: } ${e.ah ? 'y = ' + frac(e.ah) : '\\text{no}'}`);
    r.push(`\\text{A.O.: } ${e.ao ? 'y = ' + pTeX(e.ao.q) : '\\text{no}'}`);
    return r;
  }
  function pasosCortes(e) {
    const P = [];
    P.push(e.corteY
      ? { t: 'Corte con el eje Y (x = 0):', m: `f(0) = ${frac(e.corteY)} \\;\\Rightarrow\\; ${punto(0, e.corteY)}` }
      : { t: 'Corte con el eje Y: \\(x = 0\\) no pertenece al dominio, así que no corta al eje Y.' });
    const rn = raicesEnteras(e.num);
    if (!rn.length) P.push({ t: `Cortes con el eje X: \\(${pTeX(e.num)} = 0\\) no tiene soluciones reales; no corta al eje X.` });
    else P.push({ t: 'Cortes con el eje X (numerador igual a cero):',
      m: `${pTeX(e.num)} = 0 \\;\\Rightarrow\\; ${rn.map(x => 'x = ' + n(x)).join(',\\ ')}${e.raices.length ? ' \\;\\Rightarrow\\; ' + e.raices.map(x => `(${n(x)},\\ 0)`).join(',\\ ') : ''}` });
    return P;
  }
  function pasosSimetria(e) {
    const t = `f(-x) = \\frac{${pTeX(pNeg(e.num))}}{${pTeX(pNeg(e.den))}}`;
    if (e.sim === 'par') return [{ t: 'Simetría: \\(f(-x) = f(x)\\), la función es <b>par</b> (simétrica respecto al eje Y).', m: `${t} = f(x)` }];
    if (e.sim === 'impar') return [{ t: 'Simetría: \\(f(-x) = -f(x)\\), la función es <b>impar</b> (simétrica respecto al origen).', m: `${t} = -f(x)` }];
    return [{ t: 'Simetría: \\(f(-x)\\) no coincide ni con \\(f(x)\\) ni con \\(-f(x)\\); no es par ni impar.', m: t }];
  }
  function pasosMonotonia(e) {
    const den2 = potencia(e.denF, 2);
    const P = [{ t: 'Derivamos con la regla del cociente y simplificamos:',
      m: `f'(x) = \\frac{(${pTeX(pDer(e.num))})(${pTeX(e.den)}) - (${pTeX(e.num)})(${pTeX(pDer(e.den))})}{${den2}} = \\frac{${pTeX(e.N1)}}{${den2}}` }];
    if (e.crit.length) P.push({ t: 'Puntos críticos (numerador de f\' igual a cero):', m: `${pTeX(e.N1)} = 0 \\;\\Rightarrow\\; ${e.crit.map(x => 'x = ' + n(x)).join(',\\ ')}` });
    else P.push({ t: grado(e.N1) === 0 ? 'El numerador de f\' es constante: f\' no se anula y no hay puntos críticos.' : `\\(${pTeX(e.N1)} = 0\\) no tiene soluciones reales: no hay puntos críticos.` });
    P.push({ t: `El denominador \\(${den2}\\) es positivo en todo el dominio, así que el signo de f' es el de su numerador. Tabla de signos (incluyendo los puntos que no están en el dominio):`,
      m: tablaTeX(e.mono, "f'", 'f', ['\\nearrow', '\\searrow']) });
    const ext_ = [];
    e.max.forEach(x => ext_.push(`Máximo relativo en \\(${punto(x, valor(e, x))}\\)`));
    e.min.forEach(x => ext_.push(`mínimo relativo en \\(${punto(x, valor(e, x))}\\)`));
    P.push({ t: ext_.length ? ext_.join('; ').replace(/^m/, 'M') + '.' : 'No hay extremos relativos (la monotonía solo cambia, en su caso, en puntos que no pertenecen al dominio).' });
    return P;
  }
  function resMonotonia(e) {
    return [`\\text{Crece: } ${intervaloTeX(intervalosDe(e.mono, 1))}`, `\\text{Decrece: } ${intervaloTeX(intervalosDe(e.mono, -1))}`,
      `\\text{Máx.: } ${e.max.length ? e.max.map(x => punto(x, valor(e, x))).join(',\\ ') : '\\text{no}'}`,
      `\\text{Mín.: } ${e.min.length ? e.min.map(x => punto(x, valor(e, x))).join(',\\ ') : '\\text{no}'}`];
  }
  function pasosCurvatura(e) {
    const den2 = potencia(e.denF, 2), den3 = potencia(e.denF, 3), den4 = potencia(e.denF, 4);
    const P = [{ t: `Derivamos f' con la regla del cociente y simplificamos un factor \\(${e.denF.length > 1 ? '(' + e.denF + ')' : e.denF}\\):`,
      m: `f''(x) = \\frac{(${pTeX(pDer(e.N1))})${den2} - (${pTeX(e.N1)}) \\cdot 2${e.denF.length > 1 ? '(' + e.denF + ')' : e.denF}(${pTeX(pDer(e.den))})}{${den4}} = \\frac{${pTeX(e.N2)}}{${den3}}` }];
    if (e.candPI.length) P.push({ t: 'Posibles puntos de inflexión (f\'\' = 0):', m: `${pTeX(e.N2)} = 0 \\;\\Rightarrow\\; ${e.candPI.map(x => 'x = ' + n(x)).join(',\\ ')}` });
    else P.push({ t: grado(e.N2) === 0 ? 'El numerador de f\'\' es constante: f\'\' no se anula.' : `\\(${pTeX(e.N2)} = 0\\) no tiene soluciones reales: f'' no se anula.` });
    P.push({ t: 'Signo de f\'\' (numerador y denominador) en cada tramo. Criterio: f\'\' > 0, cóncava (∪); f\'\' < 0, convexa (∩).',
      m: tablaTeX(e.curv, "f''", 'f', ['\\cup', '\\cap']) });
    P.push({ t: e.pi.length ? `Puntos de inflexión (la curvatura cambia en un punto del dominio): ${e.pi.map(x => `\\(${punto(x, valor(e, x))}\\)`).join(' y ')}.`
      : 'No hay puntos de inflexión: la curvatura solo cambia, en su caso, en puntos que no pertenecen al dominio.' });
    return P;
  }
  function resCurvatura(e) {
    return [`\\text{Cóncava } (\\cup): ${intervaloTeX(intervalosDe(e.curv, 1))}`, `\\text{Convexa } (\\cap): ${intervaloTeX(intervalosDe(e.curv, -1))}`,
      `\\text{P.I.: } ${e.pi.length ? e.pi.map(x => punto(x, valor(e, x))).join(',\\ ') : '\\text{no}'}`];
  }
  const resLista = filas => `\\begin{array}{l} ${filas.join(' \\\\ ')} \\end{array}`;

  /* ---- Gráfica de la función racional ---- */
  function graficaRacional(e) {
    const xsC = [0, ...e.excl, ...e.crit, ...e.raices, ...e.pi];
    let x0 = Math.min(...xsC) - 3.5, x1 = Math.max(...xsC) + 3.5;
    if (x1 - x0 < 9) { const c = (x0 + x1) / 2; x0 = c - 4.5; x1 = c + 4.5; }
    const ys = [0];
    [...e.crit, ...e.pi, ...e.raices].forEach(x => ys.push(e.f(x)));
    if (e.corteY) ys.push(e.corteY.n / e.corteY.d);
    if (e.ah) ys.push(e.ah.n / e.ah.d);
    if (e.ao) { ys.push(pEval(e.ao.q, x0), pEval(e.ao.q, x1)); }
    let y0 = Math.min(...ys) - 2.5, y1 = Math.max(...ys) + 2.5;
    if (y1 - y0 < 7) { const c = (y0 + y1) / 2; y0 = c - 3.5; y1 = c + 3.5; }
    const W = 320, H = 240, L = 8, T = 8, PW = W - 2 * L, PH = H - 2 * T;
    const X = x => L + (x - x0) / (x1 - x0) * PW, Y = y => T + (y1 - y) / (y1 - y0) * PH;
    const paso = v => (v > 18 ? 4 : v > 10 ? 2 : 1);
    const sx = paso(x1 - x0), sy = paso(y1 - y0);
    const id = 'fnclip' + (++idSvg);
    let s = `<svg class="fn-graf" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfica de la función" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">`;
    s += `<defs><clipPath id="${id}"><rect x="${L}" y="${T}" width="${PW}" height="${PH}"/></clipPath></defs>`;
    for (let x = Math.ceil(x0 / sx) * sx; x <= x1; x += sx) s += `<line x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${T + PH}" stroke="#e3e3e3" stroke-width=".6"/>`;
    for (let y = Math.ceil(y0 / sy) * sy; y <= y1; y += sy) s += `<line x1="${L}" y1="${Y(y)}" x2="${L + PW}" y2="${Y(y)}" stroke="#e3e3e3" stroke-width=".6"/>`;
    s += `<line x1="${L}" y1="${Y(0)}" x2="${L + PW}" y2="${Y(0)}" stroke="#222" stroke-width="1"/><line x1="${X(0)}" y1="${T}" x2="${X(0)}" y2="${T + PH}" stroke="#222" stroke-width="1"/>`;
    for (let x = Math.ceil(x0 / sx) * sx; x <= x1; x += sx) if (x !== 0) s += `<line x1="${X(x)}" y1="${Y(0) - 2.5}" x2="${X(x)}" y2="${Y(0) + 2.5}" stroke="#222" stroke-width=".8"/><text x="${X(x)}" y="${Y(0) + 11}" font-size="8" text-anchor="middle" fill="#444">${menos(x)}</text>`;
    for (let y = Math.ceil(y0 / sy) * sy; y <= y1; y += sy) if (y !== 0 && Y(y) > T + 12) s += `<line x1="${X(0) - 2.5}" y1="${Y(y)}" x2="${X(0) + 2.5}" y2="${Y(y)}" stroke="#222" stroke-width=".8"/><text x="${X(0) - 4}" y="${Y(y) + 3}" font-size="8" text-anchor="end" fill="#444">${menos(y)}</text>`;
    s += `<g clip-path="url(#${id})">`;
    const asin = 'stroke="#b8282b" stroke-width="1" stroke-dasharray="5 3"';
    e.av.forEach(c => { s += `<line x1="${X(c)}" y1="${T}" x2="${X(c)}" y2="${T + PH}" ${asin}/>`; });
    if (e.ah) s += `<line x1="${L}" y1="${Y(e.ah.n / e.ah.d)}" x2="${L + PW}" y2="${Y(e.ah.n / e.ah.d)}" ${asin}/>`;
    if (e.ao && !e.evit.length) s += `<line x1="${X(x0)}" y1="${Y(pEval(e.ao.q, x0))}" x2="${X(x1)}" y2="${Y(pEval(e.ao.q, x1))}" ${asin}/>`;
    // Curva por tramos (se corta en cada valor excluido)
    const cortes = [x0, ...e.excl.filter(c => c > x0 && c < x1), x1];
    for (let k = 0; k < cortes.length - 1; k++) {
      const a = cortes[k] + (k > 0 ? 1e-3 : 0), b = cortes[k + 1] - (k < cortes.length - 2 ? 1e-3 : 0);
      const pts = []; const N = 260;
      for (let i = 0; i <= N; i++) {
        const x = a + (b - a) * i / N, y = e.f(x);
        if (!Number.isFinite(y)) continue;
        pts.push(`${X(x).toFixed(1)},${Y(Math.max(y0 - 40, Math.min(y1 + 40, y))).toFixed(1)}`);
      }
      s += `<polyline points="${pts.join(' ')}" fill="none" stroke="#1a2744" stroke-width="1.8" stroke-linejoin="round"/>`;
    }
    const marca = (x, y, hueco) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="2.6" fill="${hueco ? '#fff' : '#1a2744'}" stroke="#1a2744" stroke-width="1.2"/>`; };
    [...e.max, ...e.min, ...e.pi].forEach(x => marca(x, e.f(x)));
    e.raices.forEach(x => marca(x, 0));
    if (e.corteY) marca(0, e.corteY.n / e.corteY.d);
    e.evit.forEach(c => marca(c, pEval(e.simp, c), true));
    s += '</g>';
    s += `<text x="${L + PW - 3}" y="${Y(0) - 4}" font-size="9" font-style="italic" text-anchor="end">x</text><text x="${X(0) + 4}" y="${T + 9}" font-size="9" font-style="italic">y</text>`;
    return s + '</svg>';
  }

  /* ---- Ejercicios ---- */
  const familias = (R, lista) => estudiar(FAMILIAS[R.pick(lista)](R));
  const TODAS = ['evitable', 'oblicua', 'oblicuaCreciente', 'homografica', 'par', 'imparRaices', 'imparExtremos', 'inflexion'];
  const SIN_EVITABLE = TODAS.slice(1);

  registrarFicha({
    id: 'funcion-racional',
    titulo: 'Estudio de funciones racionales',
    detalle: 'Asíntotas, monotonía, curvatura',
    grupo: GRUPO,
    enlace: '../funciones/funcion-racional.html',
    ejercicios: [
      { id: 'asintotas', nombre: 'Dominio, discontinuidades y asíntotas', peso: 1.25, columnas: 2,
        enunciado: ['Halla el dominio, las discontinuidades evitables y las asíntotas de la función:', 'Halla el dominio, las discontinuidades evitables y las asíntotas de las funciones:'],
        generar: R => { const e = familias(R, TODAS); return { enun: e.tex, pasos: [...pasosDominio(e), ...pasosAsintotas(e)], res: resLista(resAsintotas(e)) }; } },
      { id: 'monotonia', nombre: 'Monotonía y extremos relativos', peso: 1.5, columnas: 2,
        enunciado: ['Estudia la monotonía y los extremos relativos de la función:', 'Estudia la monotonía y los extremos relativos de las funciones:'],
        generar: R => { const e = familias(R, SIN_EVITABLE); return { enun: e.tex, pasos: [...pasosDominio(e), ...pasosMonotonia(e)], res: resLista(resMonotonia(e)) }; } },
      { id: 'curvatura', nombre: 'Curvatura y puntos de inflexión', peso: 1.5, columnas: 2,
        enunciado: ['Estudia la curvatura y los puntos de inflexión de la función:', 'Estudia la curvatura y los puntos de inflexión de las funciones:'],
        generar: R => { const e = familias(R, SIN_EVITABLE); return { enun: e.tex, pasos: [...pasosDominio(e), pasosMonotonia(e)[0], ...pasosCurvatura(e)], res: resLista(resCurvatura(e)) }; } },
      { id: 'completo', nombre: 'Estudio completo y gráfica', peso: 3, columnas: 1,
        enunciado: ['Haz el estudio completo de la función y represéntala gráficamente:', 'Haz el estudio completo de las funciones y represéntalas gráficamente:'],
        generar: R => {
          const e = familias(R, SIN_EVITABLE);
          const pasos = [...pasosDominio(e), ...pasosSimetria(e), ...pasosCortes(e), ...pasosAsintotas(e), ...pasosMonotonia(e), ...pasosCurvatura(e),
            { t: 'Representación gráfica (asíntotas en trazo discontinuo):', html: graficaRacional(e) }];
          return { enun: e.tex, pasos, res: resLista([...resAsintotas(e).slice(0, 1), ...resAsintotas(e).slice(2), ...resMonotonia(e), ...resCurvatura(e)]) };
        } }
    ]
  });

  /* ================= 3. INTERPRETACIÓN DE GRÁFICAS ================= */
  const NOMBRES = ['Sete', 'Lucía', 'Mateo', 'Noa', 'Hugo', 'Vega', 'Leo', 'Carmen'];
  function recorrido(R) {
    for (let intento = 0; intento < 60; intento++) {
      const pasoT = 20, maxD = 800, puntos = [{ t: 0, d: 0 }], paradas = [];
      let t = 0, d = 0;
      const subir = (st, sd) => { t += pasoT * st; d = Math.min(maxD, d + 100 * sd); puntos.push({ t, d }); };
      const bajar = (st, sd) => { t += pasoT * st; d = Math.max(0, d - 100 * sd); puntos.push({ t, d }); };
      const parar = st => { t += pasoT * st; paradas.push({ t0: t - pasoT * st, t1: t, d }); puntos.push({ t, d }); };
      subir(R.int(1, 2), R.int(2, 3));
      parar(R.int(1, 2));
      subir(R.int(1, 2), R.int(1, 2));
      bajar(1, R.int(1, 2));
      if (d <= 0) { d = 100; puntos[puntos.length - 1].d = 100; }
      parar(R.int(1, 2));
      subir(R.int(1, 2), R.int(1, 3));
      while (d > 0) bajar(1, R.int(1, 2));
      if (t <= 220) return { puntos, paradas, tMax: t };
    }
    return null;
  }
  const dEn = (p, t) => { for (let i = 0; i < p.length - 1; i++) { const a = p[i], b = p[i + 1]; if (t >= a.t && t <= b.t) return b.t === a.t ? a.d : a.d + (b.d - a.d) * (t - a.t) / (b.t - a.t); } return p[p.length - 1].d; };
  function graficaDT(rec) {
    const W = 520, H = 300, PL = 54, PR = 16, PT = 14, PB = 42;
    const tM = Math.ceil(rec.tMax / 20) * 20, dM = 800;
    const X = t => PL + t / tM * (W - PL - PR), Y = d => H - PB - d / dM * (H - PT - PB);
    let s = `<svg class="fn-dt" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfica distancia-tiempo" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">`;
    for (let t = 0; t <= tM; t += 20) s += `<line x1="${X(t)}" y1="${PT}" x2="${X(t)}" y2="${H - PB}" stroke="#d6d6d6" stroke-width=".8"/><text x="${X(t)}" y="${H - PB + 14}" font-size="10" text-anchor="middle" fill="#333">${t}</text>`;
    for (let d = 0; d <= dM; d += 100) s += `<line x1="${PL}" y1="${Y(d)}" x2="${W - PR}" y2="${Y(d)}" stroke="#d6d6d6" stroke-width=".8"/><text x="${PL - 6}" y="${Y(d) + 3.5}" font-size="10" text-anchor="end" fill="#333">${d}</text>`;
    s += `<line x1="${PL}" y1="${PT}" x2="${PL}" y2="${H - PB}" stroke="#111" stroke-width="1.4"/><line x1="${PL}" y1="${H - PB}" x2="${W - PR}" y2="${H - PB}" stroke="#111" stroke-width="1.4"/>`;
    s += `<text x="${(W + PL - PR) / 2}" y="${H - 8}" font-size="11" text-anchor="middle">Tiempo (minutos)</text>`;
    s += `<text x="13" y="${(H - PB + PT) / 2}" font-size="11" text-anchor="middle" transform="rotate(-90 13 ${(H - PB + PT) / 2})">Distancia (metros)</text>`;
    s += `<polyline points="${rec.puntos.map(p => `${X(p.t)},${Y(p.d)}`).join(' ')}" fill="none" stroke="#1a2744" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`;
    rec.puntos.forEach(p => { s += `<circle cx="${X(p.t)}" cy="${Y(p.d)}" r="3" fill="#1a2744"/>`; });
    return s + '</svg>';
  }
  function interpretacion(R) {
    const rec = recorrido(R), p = rec.puntos, nombre = R.pick(NOMBRES);
    const inst = []; for (let t = 20; t < rec.tMax; t += 20) inst.push(t);
    const tq = R.pick(inst), dq = Math.round(dEn(p, tq));
    const dMax = Math.max(...p.map(q => q.d)), tMaxD = p.find(q => q.d === dMax).t;
    const parado = rec.paradas.reduce((s, q) => s + (q.t1 - q.t0), 0), tFin = p[p.length - 1].t;
    const preguntas = [
      `Al cabo de <b>${tq} minutos</b> de haber salido, ¿a qué distancia se encontraba de su casa?`,
      '¿Cuál fue la <b>distancia máxima</b> a la que llegó a estar de su casa?',
      '¿En qué <b>minuto</b> alcanzó por primera vez esa distancia máxima?',
      '¿Cuánto tiempo estuvo <b>parado en total</b>?',
      '¿Cuántas veces <b>se detuvo</b> durante el recorrido?',
      '¿Cuánto tiempo estuvo <b>fuera de casa</b>, desde que salió hasta que regresó?'
    ];
    const enun = `<div class="pl-texto fn-dt-caja"><p>La gráfica representa la <b>distancia</b> (en metros) a la que se encuentra ${nombre} de su casa en función del <b>tiempo</b> (en minutos). El eje horizontal está dividido de 20 en 20 minutos y el vertical, de 100 en 100 metros.</p>
      ${graficaDT(rec)}
      <ol class="fn-preg">${preguntas.map(q => `<li>${q}</li>`).join('')}</ol></div>`;
    const pasos = [
      { t: `1) Desde ${tq} min en el eje horizontal subimos hasta la línea y leemos en el eje vertical: <b>${dq} m</b>.` },
      { t: `2) El punto más alto de la gráfica está a <b>${dMax} m</b>.` },
      { t: `3) Ese punto más alto se alcanza por primera vez a los <b>${tMaxD} min</b>.` },
      { t: `4) Los tramos horizontales son paradas (la distancia no cambia): ${rec.paradas.map(q => `de ${q.t0} a ${q.t1} min (${q.t1 - q.t0} min)`).join(' y ')}. En total, <b>${parado} min</b>.` },
      { t: `5) Hay <b>${rec.paradas.length}</b> tramos horizontales, luego se detuvo ${rec.paradas.length} veces.` },
      { t: `6) Sale en el minuto 0 y vuelve a estar a 0 m en el minuto ${tFin}: estuvo fuera <b>${tFin} min</b>.` }
    ];
    return { html: true, enun, pasos,
      resHtml: `1) ${dq} m · 2) ${dMax} m · 3) ${tMaxD} min · 4) ${parado} min · 5) ${rec.paradas.length} paradas · 6) ${tFin} min` };
  }

  registrarFicha({
    id: 'interpretacion-grafica',
    titulo: 'Interpretación de gráficas',
    detalle: 'Distancia-tiempo',
    grupo: GRUPO,
    enlace: '../funciones/interpretacion-grafica.html',
    ejercicios: [
      { id: 'distancia-tiempo', nombre: 'Gráfica distancia-tiempo (6 preguntas)', peso: 2, columnas: 1,
        enunciado: ['Observa la gráfica y responde a las preguntas:', 'Observa cada gráfica y responde a las preguntas:'],
        generar: R => interpretacion(R) }
    ]
  });

  /* ================= 4. TIPOS DE FUNCIONES ================= */
  const TIPOS = [
    { nombre: 'Constante', latex: 'f(x) = 2', f: () => 2, rasgo: 'recta horizontal a altura 2' },
    { nombre: 'Lineal', latex: 'f(x) = x', f: x => x, rasgo: 'recta que pasa por el origen (bisectriz)' },
    { nombre: 'Cuadrática', latex: 'f(x) = x^2', f: x => x * x, rasgo: 'parábola con vértice en el origen, abierta hacia arriba' },
    { nombre: 'Grado 3', latex: 'f(x) = x^3', f: x => x * x * x, rasgo: 'siempre creciente, simétrica respecto al origen, se aplana en 0' },
    { nombre: 'Grado 4', latex: 'f(x) = x^4', f: x => x ** 4, rasgo: 'forma de U más plana en el fondo y más empinada que la parábola' },
    { nombre: 'Racional 1/x', latex: 'f(x) = \\dfrac{1}{x}', f: x => 1 / x, excl: [0], rasgo: 'hipérbola en los cuadrantes 1.º y 3.º, asíntotas en los ejes' },
    { nombre: 'Racional 1/x²', latex: 'f(x) = \\dfrac{1}{x^2}', f: x => 1 / (x * x), excl: [0], rasgo: 'dos ramas por encima del eje X, simétricas respecto al eje Y' },
    { nombre: 'Raíz cuadrada', latex: 'f(x) = \\sqrt{x}', f: x => (x >= 0 ? Math.sqrt(x) : NaN), rasgo: 'empieza en el origen y solo existe para x ≥ 0' },
    { nombre: 'Raíz cúbica', latex: 'f(x) = \\sqrt[3]{x}', f: x => Math.cbrt(x), rasgo: 'creciente en todo ℝ, vertical en el origen' },
    { nombre: 'Exponencial', latex: 'f(x) = e^x', f: x => Math.exp(x), rasgo: 'pasa por (0, 1), siempre positiva, asíntota y = 0 a la izquierda' },
    { nombre: 'Logarítmica', latex: 'f(x) = \\ln(x)', f: x => (x > 0 ? Math.log(x) : NaN), rasgo: 'pasa por (1, 0), solo existe para x > 0, asíntota en el eje Y' },
    { nombre: 'Valor absoluto', latex: 'f(x) = |x|', f: x => Math.abs(x), rasgo: 'forma de V con el vértice en el origen' },
    { nombre: 'Parte entera', latex: 'f(x) = \\lfloor x \\rfloor', escalones: true, rasgo: 'escalones de altura 1 (cerrado a la izquierda, abierto a la derecha)' }
  ];
  function miniGrafica(fn, etiqueta) {
    const W = 120, H = 100, M = 4, lim = 3;
    const X = x => M + (x + lim) / (2 * lim) * (W - 2 * M), Y = y => M + (lim - y) / (2 * lim) * (H - 2 * M);
    const id = 'fnmini' + (++idSvg);
    let s = `<svg class="fn-mini" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfica ${etiqueta}" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">`;
    s += `<defs><clipPath id="${id}"><rect x="${M}" y="${M}" width="${W - 2 * M}" height="${H - 2 * M}"/></clipPath></defs>`;
    s += `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="4" fill="#fff" stroke="#999" stroke-width=".8"/>`;
    for (let k = -2; k <= 2; k++) if (k) s += `<line x1="${X(k)}" y1="${M}" x2="${X(k)}" y2="${H - M}" stroke="#ececec" stroke-width=".6"/><line x1="${M}" y1="${Y(k)}" x2="${W - M}" y2="${Y(k)}" stroke="#ececec" stroke-width=".6"/>`;
    s += `<line x1="${M}" y1="${Y(0)}" x2="${W - M}" y2="${Y(0)}" stroke="#555" stroke-width=".8"/><line x1="${X(0)}" y1="${M}" x2="${X(0)}" y2="${H - M}" stroke="#555" stroke-width=".8"/>`;
    for (let k = -2; k <= 2; k++) if (k) s += `<line x1="${X(k)}" y1="${Y(0) - 1.8}" x2="${X(k)}" y2="${Y(0) + 1.8}" stroke="#555" stroke-width=".7"/><line x1="${X(0) - 1.8}" y1="${Y(k)}" x2="${X(0) + 1.8}" y2="${Y(k)}" stroke="#555" stroke-width=".7"/>`;
    s += `<text x="${X(1)}" y="${Y(0) + 8}" font-size="6" text-anchor="middle" fill="#666">1</text><text x="${X(0) - 3}" y="${Y(1) + 2}" font-size="6" text-anchor="end" fill="#666">1</text>`;
    s += `<g clip-path="url(#${id})" fill="none" stroke="#1a2744" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">`;
    if (fn.escalones) {
      for (let k = -3; k <= 2; k++) s += `<line x1="${X(k)}" y1="${Y(k)}" x2="${X(k + 1) - 2.5}" y2="${Y(k)}"/><circle cx="${X(k)}" cy="${Y(k)}" r="1.9" fill="#1a2744" stroke-width="1"/><circle cx="${X(k + 1)}" cy="${Y(k)}" r="1.9" fill="#fff" stroke-width="1"/>`;
    } else {
      const cortes = [-lim, ...(fn.excl || []), lim];
      for (let c = 0; c < cortes.length - 1; c++) {
        const a = cortes[c] + (c ? 1e-3 : 0), b = cortes[c + 1] - (c < cortes.length - 2 ? 1e-3 : 0), pts = [];
        for (let i = 0; i <= 240; i++) {
          const x = a + (b - a) * i / 240, y = fn.f(x);
          if (Number.isFinite(y)) pts.push(`${X(x).toFixed(1)},${Y(Math.max(-lim - 2, Math.min(lim + 2, y))).toFixed(1)}`);
        }
        if (pts.length > 1) s += `<polyline points="${pts.join(' ')}"/>`;
      }
    }
    s += `</g><text x="${W - 7}" y="${15}" font-size="12" font-weight="700" text-anchor="end" fill="#111" stroke="#fff" stroke-width="3" paint-order="stroke">${etiqueta}</text>`;
    return s + '</svg>';
  }
  function emparejar(R, k) {
    const elegidas = R.shuffle(TIPOS.map((_, i) => i)).slice(0, k);
    const ordenGraf = R.shuffle(elegidas), ordenExpr = R.shuffle(elegidas);
    const L = 'ABCDEFGHIJ';
    const enun = `<div class="fn-emp"><div class="fn-minis">${ordenGraf.map((t, i) => miniGrafica(TIPOS[t], L[i])).join('')}</div>
      <ol class="fn-expr">${ordenExpr.map(t => `<li>\\(${TIPOS[t].latex}\\)</li>`).join('')}</ol></div>`;
    const pares = ordenGraf.map((t, i) => ({ g: L[i], e: ordenExpr.indexOf(t) + 1, t: TIPOS[t] }));
    const pasos = [{ t: 'Para cada gráfica nos fijamos en un rasgo que la distinga de las demás:' },
      ...pares.map(p => ({ t: `<b>${p.g} → ${p.e}</b>: \\(${p.t.latex}\\) (${p.t.nombre.toLowerCase()}): ${p.t.rasgo}.` }))];
    return { html: true, enun, pasos, resHtml: pares.map(p => `${p.g}–${p.e}`).join(' · ') };
  }

  registrarFicha({
    id: 'tipos-de-funciones',
    titulo: 'Tipos de funciones',
    detalle: 'Gráficas y expresiones',
    grupo: GRUPO,
    enlace: '../funciones/tipos-de-funciones.html',
    ejercicios: [
      { id: 'emparejar-6', nombre: 'Asociar 6 gráficas con su expresión', peso: 1, columnas: 1,
        enunciado: ['Asocia cada gráfica (letra) con su expresión algebraica (número):', 'Asocia, en cada apartado, cada gráfica (letra) con su expresión algebraica (número):'],
        generar: R => emparejar(R, 6) },
      { id: 'emparejar-8', nombre: 'Asociar 8 gráficas con su expresión', peso: 1.5, columnas: 1,
        enunciado: ['Asocia cada gráfica (letra) con su expresión algebraica (número):', 'Asocia, en cada apartado, cada gráfica (letra) con su expresión algebraica (número):'],
        generar: R => emparejar(R, 8) }
    ]
  });
})();
