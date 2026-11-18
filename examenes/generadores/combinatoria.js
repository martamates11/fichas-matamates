/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Combinatoria (probabilidad/combinatoria.html).
   Mismos cinco bloques, contextos y rangos que la ficha: variaciones, variaciones con
   repetición, combinaciones, combinaciones con repetición y permutaciones. La respuesta
   es siempre un número entero.
   Diferencias con la ficha: para poder resolverlo sin calculadora, en las variaciones con
   repetición el exponente se limita a 4 cuando la base es 6 o 7 (así la potencia no pasa
   de 2401); el resto de rangos son los de la ficha. Además, la ficha genera los dos
   contextos de cada bloque a la vez; aquí cada ejercicio usa uno de los dos al azar. */
(function () {
  'use strict';
  const { registrarFicha } = window.EX;

  /* Números grandes con espacio fino de millares en TeX (16 807 → 16\,807) */
  const N = x => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, x >= 10000 ? '\\,' : '');
  const fact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
  /* n·(n−1)·…·(n−k+1) como producto TeX */
  const prod = (n, k) => Array.from({ length: k }, (_, i) => n - i).join(' \\cdot ');
  const valor = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r *= n - i; return r; };
  const problema = txt => `<div class="pend-col"><span class="pend-texto">${txt}</span></div>`;
  const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

  /* ================= 1. Variaciones ================= */
  /* Ficha: n entre 8 y 15 (alumnos) o entre 10 y 18 (atletas); se eligen 3 */
  function genVariaciones(R) {
    const alumnos = R.rand() < 0.5;
    const n = alumnos ? R.int(8, 15) : R.int(10, 18);
    const enun = alumnos
      ? `En un grupo de ${n} alumnos se va a elegir presidente, vicepresidente y secretario. ¿De cuántas formas distintas se puede realizar la asignación?`
      : `En una carrera participan ${n} atletas. ¿De cuántas formas se pueden repartir las medallas de oro, plata y bronce?`;
    const parcial = n * (n - 1), res = valor(n, 3);
    return {
      html: true,
      enun: problema(enun),
      pasos: [
        { t: alumnos
          ? 'Se eligen 3 de los ' + n + ' alumnos y el orden importa (no es lo mismo ser presidente que secretario) y no se repiten (nadie ocupa dos cargos): son <b>variaciones</b> de ' + n + ' elementos tomados de 3 en 3.'
          : 'Se eligen 3 de los ' + n + ' atletas y el orden importa (oro, plata y bronce son distintos) y no se repiten (nadie gana dos medallas): son <b>variaciones</b> de ' + n + ' elementos tomados de 3 en 3.' },
        { t: 'Multiplicamos tantos factores como elementos se eligen, empezando en ' + n + ' y bajando de uno en uno:', m: `V_{${n},3} = ${n} \\cdot ${n - 1} \\cdot ${n - 2}` },
        { t: 'Calculamos:', m: `${n} \\cdot ${n - 1} = ${parcial} \\qquad ${parcial} \\cdot ${n - 2} = ${N(res)}` }
      ],
      res: `${N(res)}\\text{ formas}`
    };
  }

  /* ================= 2. Variaciones con repetición ================= */
  /* Ficha: números de 3–4 cifras con dígitos {1..n}, n entre 3 y 6; contraseñas de 2–5 dígitos con {0..n−1}, n entre 4 y 7 */
  function genVarRep(R) {
    const numeros = R.rand() < 0.5;
    let n, k, enun;
    if (numeros) {
      n = R.int(3, 6); k = R.int(3, 4);
      enun = `¿Cuántos números diferentes de ${k} cifras se pueden formar usando los dígitos {${rango(1, n).join(', ')}}? (se permiten repeticiones)`;
    } else {
      n = R.int(4, 7); k = R.int(2, 5);
      if (n >= 6 && k > 4) k = 4;               // ajuste del examen: sin calculadora
      enun = `Un sistema de seguridad usa contraseñas de ${k} dígitos formadas con los números {${rango(0, n - 1).join(', ')}}. ¿Cuántas contraseñas diferentes se pueden crear?`;
    }
    const res = Math.pow(n, k);
    const cadena = Array(k).fill(n).join(' \\cdot ');
    return {
      html: true,
      enun: problema(enun),
      pasos: [
        { t: `En cada una de las ${k} posiciones se puede colocar cualquiera de los ${n} dígitos, y se pueden repetir; además el orden importa. Son <b>variaciones con repetición</b> de ${n} elementos tomados de ${k} en ${k}.` },
        { t: 'Cada posición aporta ' + n + ' posibilidades, y se multiplican (principio multiplicativo):', m: `VR_{${n},${k}} = ${n}^{${k}} = ${cadena}` },
        { t: 'Calculamos:', m: `${n}^{${k}} = ${N(res)}` }
      ],
      res: `${N(res)}\\text{ ${numeros ? 'números' : 'contraseñas'}}`
    };
  }

  /* ================= 3. Combinaciones ================= */
  /* Ficha: 2 elegidos entre n (8–15 alumnos; 12–20 personas) */
  function genCombinaciones(R) {
    const clase = R.rand() < 0.5;
    const n = clase ? R.int(8, 15) : R.int(12, 20);
    const enun = clase
      ? `En una clase de ${n} estudiantes se van a elegir 2 delegados para una reunión (los dos con la misma responsabilidad). ¿De cuántas formas se puede hacer?`
      : `Se van a entregar dos premios <b>iguales</b> (dos entradas de cine) a un grupo de ${n} personas. ¿De cuántas formas se puede elegir a los ganadores?`;
    const num = n * (n - 1), res = num / 2;
    return {
      html: true,
      enun: problema(enun),
      pasos: [
        { t: clase
          ? `Se eligen 2 de los ${n} estudiantes y el orden no importa, porque los dos delegados tienen la misma responsabilidad. Son <b>combinaciones</b> de ${n} elementos tomados de 2 en 2.`
          : `Se eligen 2 de las ${n} personas y el orden no importa, porque los dos premios son iguales. Son <b>combinaciones</b> de ${n} elementos tomados de 2 en 2.` },
        { t: 'Aplicamos la fórmula del número combinatorio (variaciones divididas entre las ordenaciones repetidas, 2! = 2):', m: `C_{${n},2} = \\binom{${n}}{2} = \\frac{${n} \\cdot ${n - 1}}{2!} = \\frac{${num}}{2} = ${res}` }
      ],
      res: `${res}\\text{ formas}`
    };
  }

  /* ================= 4. Combinaciones con repetición ================= */
  /* Ficha: bombones k entre 2 y 4 para n niños (4–7); piezas k entre 3 y 5 de n frutas (5–8) */
  function genCombRep(R) {
    const bombones = R.rand() < 0.5;
    const n = bombones ? R.int(4, 7) : R.int(5, 8);
    const k = bombones ? R.int(2, 4) : R.int(3, 5);
    const enun = bombones
      ? `¿De cuántas formas se pueden repartir ${k} bombones <b>idénticos</b> entre ${n} niños? (puede haber niños sin bombón)`
      : `En una frutería hay ${n} tipos de frutas. ¿De cuántas formas se pueden comprar ${k} piezas (pueden ser del mismo tipo)?`;
    const m = n + k - 1;
    const num = valor(m, k), den = fact(k), res = num / den;
    return {
      html: true,
      enun: problema(enun),
      pasos: [
        { t: bombones
          ? `Los bombones son idénticos (el orden no importa) y un niño puede recibir varios (se repite). Son <b>combinaciones con repetición</b> de ${n} elementos tomados de ${k} en ${k}.`
          : `Solo importa cuántas piezas se llevan de cada tipo, no el orden, y se puede repetir el tipo. Son <b>combinaciones con repetición</b> de ${n} elementos tomados de ${k} en ${k}.` },
        { t: 'Se transforman en combinaciones sin repetición:', m: `CR_{${n},${k}} = \\binom{${n} + ${k} - 1}{${k}} = \\binom{${m}}{${k}}` },
        { t: `Desarrollamos el número combinatorio (${k} factores arriba, ${k}! = ${den} abajo):`, m: `\\binom{${m}}{${k}} = \\frac{${prod(m, k)}}{${k}!} = \\frac{${N(num)}}{${den}} = ${res}` }
      ],
      res: `${res}\\text{ formas}`
    };
  }

  /* ================= 5. Permutaciones ================= */
  /* Ficha: libros n entre 4 y 7; corredores n entre 5 y 8 */
  function genPermutaciones(R) {
    const libros = R.rand() < 0.5;
    const n = libros ? R.int(4, 7) : R.int(5, 8);
    const enun = libros
      ? `¿De cuántas formas diferentes se pueden ordenar ${n} libros en una estantería?`
      : `En una carrera de relevos, ${n} corredores se colocan en fila para salir. ¿De cuántas formas se pueden ordenar?`;
    const res = fact(n);
    const cadena = rango(1, n).reverse().join(' \\cdot ');
    return {
      html: true,
      enun: problema(enun),
      pasos: [
        { t: `Se ordenan los ${n} ${libros ? 'libros' : 'corredores'}: intervienen todos los elementos y el orden importa. Son <b>permutaciones</b> de ${n} elementos.` },
        { t: 'El número de permutaciones es el factorial:', m: `P_{${n}} = ${n}! = ${cadena} = ${N(res)}` }
      ],
      res: `${N(res)}\\text{ formas}`
    };
  }

  const ENUN = ['Resuelve el siguiente problema:', 'Resuelve los siguientes problemas:'];
  registrarFicha({
    id: 'combinatoria',
    titulo: 'Combinatoria',
    detalle: 'Variaciones, combinaciones y permutaciones',
    grupo: 'Probabilidad y combinatoria',
    enlace: '../probabilidad/combinatoria.html',
    ejercicios: [
      { id: 'var', nombre: 'Variaciones', peso: 1, columnas: 1, enunciado: ENUN, generar: genVariaciones },
      { id: 'varrep', nombre: 'Variaciones con repetición', peso: 1, columnas: 1, enunciado: ENUN, generar: genVarRep },
      { id: 'comb', nombre: 'Combinaciones', peso: 1, columnas: 1, enunciado: ENUN, generar: genCombinaciones },
      { id: 'combrep', nombre: 'Combinaciones con repetición', peso: 1.25, columnas: 1, enunciado: ENUN, generar: genCombRep },
      { id: 'perm', nombre: 'Permutaciones', peso: 1, columnas: 1, enunciado: ENUN, generar: genPermutaciones }
    ]
  });
})();
