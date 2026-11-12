/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Generador de examen: programación lineal (maximizar beneficios / minimizar costes).
   Contextos, rangos de números y criterios de calidad copiados de la ficha
   inecuaciones/prog-lineal.html. */
(function () {
  'use strict';
  const { tex, registrarFicha } = window.EX;

  /* ---------- Formato (como en la ficha) ---------- */
  function fmt(n) { const r = Math.round(n * 100) / 100; return String(r).replace('.', ','); }
  const miles = n => Math.round(n).toLocaleString('es-ES');
  const eur = n => { const r = Math.round(n * 100) / 100; return Number.isInteger(r) ? miles(r) : r.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  const V = v => `<i>${v}</i>`;
  const plural = (n, sing, plu) => `${n} ${n === 1 ? sing : plu}`;

  /* Número en TeX con coma decimal y separación de miles */
  function num(x) {
    const r = Math.round(x * 100) / 100;
    const [ent, dec] = String(Math.abs(r)).split('.');
    const e = ent.length > 4 ? ent.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : ent;
    return (r < 0 ? '-' : '') + e + (dec ? '{,}' + dec : '');
  }
  function termTeX(c, v, primero) {
    if (c === 0) return '';
    const a = Math.abs(c), cuerpo = (a === 1 ? '' : num(a)) + v;
    if (primero) return (c < 0 ? '-' : '') + cuerpo;
    return (c < 0 ? ' - ' : ' + ') + cuerpo;
  }
  const exprTeX = (a, b) => (a !== 0 ? termTeX(a, 'x', true) + termTeX(b, 'y', false) : termTeX(b, 'y', true)) || '0';
  const SIG = { '≤': '\\le', '≥': '\\ge' };

  const lab = (n, pl, pre) => Array.isArray(n) ? n[pl ? 1 : 0] : (pre ? pre[pl ? 1 : 0] : '') + n;
  const CONTEXTOS = [
    {
      id: 'rutas', nombre: 'Rutas gastronómicas · Feria de San Juan', pre: ['ruta de ', 'rutas de '],
      pares: [['Toro de Lidia', 'Jamón Ibérico'], ['Queso Extremeño', 'Cerdo Ibérico'], ['Vino de Pitarra', 'Migas Extremeñas'],
              ['Cordero al Ajillo', 'Torta del Casar'], ['Morcilla Patatera', 'Cecina de Caza'], ['Caldereta', 'Pimentón de La Vera']],
      r1: { A: [1, 4], B: [1, 4] }, r2: { A: [1, 4], B: [1, 4] }, P: [[10, 40], [10, 50]], minimos: 'x+y?',
      coefs: R => [R.int(10, 25) * 10, R.int(10, 25) * 10], rtxt: ['guías disponibles', 'autobuses disponibles'],
      texto(e) {
        return `<p>La <b>Diputación de Badajoz</b> organiza dos rutas gastronómicas durante la <b>Feria de San Juan</b>.</p>
          <p>Cada ruta de <b>${e.X}</b> necesita ${plural(e.a1, 'guía', 'guías')} y ${plural(e.a2, 'autobús pequeño', 'autobuses pequeños')}, y deja un beneficio de <b>${eur(e.cx)} €</b>.
          Cada ruta de <b>${e.Y}</b> necesita ${plural(e.b1, 'guía', 'guías')} y ${plural(e.b2, 'autobús pequeño', 'autobuses pequeños')}, y deja <b>${eur(e.cy)} €</b>.</p>
          <p>Se dispone de <b>${e.G} guías</b> y <b>${e.B} autobuses pequeños</b>. Por tradición, deben realizarse al menos <b>${e.mx} rutas de ${e.X}</b>${e.my > 0 ? ` y al menos <b>${e.my} rutas de ${e.Y}</b>` : ''}.</p>
          <p class="pregunta">¿Cuántas rutas de cada tipo hay que organizar para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} al número de rutas de ${e.X} e ${V('y')} al número de rutas de ${e.Y}.</p>`;
      }
    },
    {
      id: 'granja', nombre: 'Explotación agrícola · Vegas del Guadiana', pre: ['hectárea de ', 'hectáreas de '],
      pares: [['maíz', 'trigo'], ['tomate', 'pimiento'], ['girasol', 'cebada'], ['arroz', 'maíz']],
      r1: { A: [1, 1], B: [1, 1] }, r2: { A: [1, 4], B: [1, 4] }, P: [[20, 70], [20, 70]], minimos: 'xy',
      coefs: R => [R.int(10, 30) * 20, R.int(10, 30) * 20], rtxt: ['hectáreas disponibles', 'depósitos de agua disponibles'],
      pau: { a1: 1, b1: 1, a2: 3, b2: 2, px: 60, py: 60, mx: 20, my: 15, cx: 50, cy: 40, par: 0 },
      texto(e) {
        return `<p>Una explotación de las <b>Vegas del Guadiana</b> dispone de <b>${e.G} hectáreas</b> para cultivar <b>${e.X}</b> y <b>${e.Y}</b>, y de <b>${e.B} depósitos de agua</b> para la campaña.</p>
          <p>Cada hectárea de ${e.X} requiere ${plural(e.a2, 'depósito', 'depósitos')} de agua y deja un beneficio de <b>${eur(e.cx)} €</b>.
          Cada hectárea de ${e.Y} requiere ${plural(e.b2, 'depósito', 'depósitos')} y deja <b>${eur(e.cy)} €</b>.</p>
          <p>Además, hay que dedicar al menos <b>${e.mx} ha de ${e.X}</b> y al menos <b>${e.my} ha de ${e.Y}</b>.</p>
          <p class="pregunta">¿Cuántas hectáreas hay que dedicar a cada cultivo para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} a las hectáreas de ${e.X} e ${V('y')} a las de ${e.Y}.</p>`;
      }
    },
    {
      id: 'obrador', nombre: 'Obrador de dulces · Mérida', pre: ['bandeja de ', 'bandejas de '],
      pares: [['perrunillas', 'bollos de Pascua'], ['roscas fritas', 'repápalos'], ['técula mécula', 'coquillos'], ['flores fritas', 'pestiños']],
      r1: { A: [1, 4], B: [1, 4] }, r2: { A: [1, 4], B: [1, 4] }, P: [[10, 40], [10, 45]], minimos: 'x',
      coefs: R => [R.int(4, 20), R.int(4, 20)], rtxt: ['harina disponible', 'horas de horno'],
      texto(e) {
        return `<p>Un obrador de <b>Mérida</b> prepara bandejas de <b>${e.X}</b> y de <b>${e.Y}</b> para la Semana Santa.</p>
          <p>Cada bandeja de ${e.X} lleva ${plural(e.a1, 'kg', 'kg')} de harina y ${plural(e.a2, 'hora', 'horas')} de horno, y deja un beneficio de <b>${eur(e.cx)} €</b>.
          Cada bandeja de ${e.Y} lleva ${plural(e.b1, 'kg', 'kg')} de harina y ${plural(e.b2, 'hora', 'horas')} de horno, y deja <b>${eur(e.cy)} €</b>.</p>
          <p>El obrador dispone de <b>${e.G} kg de harina</b> y <b>${e.B} horas de horno</b>, y tiene un encargo de al menos <b>${e.mx} bandejas de ${e.X}</b>.</p>
          <p class="pregunta">¿Cuántas bandejas de cada tipo debe preparar para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} al número de bandejas de ${e.X} e ${V('y')} al de ${e.Y}.</p>`;
      }
    },
    {
      id: 'charcuteria', nombre: 'Charcutería · Montánchez', pre: ['lote ', 'lotes '],
      pares: [['A', 'B'], ['Degustación', 'Familiar'], ['Tradición', 'Ibérico']],
      r1: { A: [2, 5], B: [3, 6], k: 2 }, r2: { A: [2, 5], B: [4, 8], k: 2 }, P: [[10, 60], [10, 40]], minimos: 'x?',
      coefs: R => [R.int(10, 30), R.int(15, 45)], rtxt: ['chorizos disponibles', 'salchichones disponibles'],
      pau: { a1: 3, b1: 5, a2: 3, b2: 8, px: 40, py: 15, mx: 0, my: 0, cx: 20, cy: 36, par: 0 },
      texto(e) {
        return `<p>Un charcutero de <b>Montánchez</b> dispone de <b>${e.G} chorizos</b> y <b>${e.B} salchichones</b> para su venta, y los organiza en dos tipos de lotes, ${e.X} y ${e.Y}.</p>
          <p>Cada lote ${e.X} contiene ${e.a1} chorizos y ${e.a2} salchichones, y le reporta un beneficio de <b>${eur(e.cx)} €</b>.
          Cada lote ${e.Y} contiene ${e.b1} chorizos y ${e.b2} salchichones, y le reporta <b>${eur(e.cy)} €</b>.</p>
          ${e.mx > 0 ? `<p>Además, un cliente le ha encargado al menos <b>${e.mx} lotes ${e.X}</b>.</p>` : ''}
          <p class="pregunta">¿Cuántos lotes de cada tipo debe vender para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} al número de lotes ${e.X} e ${V('y')} al de lotes ${e.Y}.</p>`;
      }
    },
    {
      id: 'vehiculos', nombre: 'Compraventa de vehículos · Cáceres',
      pares: [[['coche', 'coches'], ['motocicleta', 'motocicletas']], [['furgoneta', 'furgonetas'], ['turismo', 'turismos']], [['todoterreno', 'todoterrenos'], ['utilitario', 'utilitarios']]],
      r1: { A: [2, 6], B: [1, 3], k: 1000 }, r2: { A: [1, 1], B: [1, 1] }, P: [[20, 80], [20, 100]], minimos: 'no',
      coefs: R => [R.int(3, 10) * 100, R.int(3, 10) * 100], rtxt: ['dinero disponible para comprar', 'espacio: vehículos como máximo'],
      pau: { a1: 3, b1: 2, a2: 1, b2: 1, px: 50, py: 75, mx: 0, my: 0, cx: 500, cy: 400, par: 0 },
      texto(e) {
        return `<p>Una empresa de compraventa de vehículos usados de <b>Cáceres</b> compra ${e.xp} y ${e.yp}, y obtiene un beneficio de <b>${eur(e.cx)} €</b> por cada ${e.xs} y de <b>${eur(e.cy)} €</b> por cada ${e.ys} al venderlos después.</p>
          <p>Dispone de <b>${miles(e.G)} €</b> para comprar vehículos, al precio de ${miles(e.a1)} € cada ${e.xs} y ${miles(e.b1)} € cada ${e.ys}, y por limitaciones de espacio no puede comprar más de <b>${e.B} vehículos</b>.</p>
          <p class="pregunta">¿Cuántos vehículos de cada tipo debe comprar para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} al número de ${e.xp} e ${V('y')} al de ${e.yp}.</p>`;
      }
    },
    {
      id: 'pasteleria', nombre: 'Pastelería · Plasencia', pre: ['pastel ', 'pasteles '],
      pares: [['de tipo A', 'de tipo B'], ['de nata', 'de crema'], ['de hojaldre', 'de bizcocho']],
      r1: { A: [2, 8], B: [2, 8] }, r2: { A: [1, 5], B: [1, 5] }, P: [[10, 50], [10, 50]], minimos: 'no',
      coefs: R => [R.int(6, 14) / 2, R.int(6, 14) / 2], rtxt: ['azúcar disponible', 'levadura disponible'],
      pau: { a1: 6, b1: 4, a2: 3, b2: 4, px: 20, py: 30, mx: 0, my: 0, cx: 4.5, cy: 5.5, par: 0 },
      texto(e) {
        return `<p>En una pastelería de <b>Plasencia</b> se elaboran ${e.xp} y ${e.yp}.</p>
          <p>Cada ${e.xs} necesita ${e.a1} g de azúcar y ${e.a2} g de levadura, con un beneficio de <b>${eur(e.cx)} €</b>.
          Cada ${e.ys} necesita ${e.b1} g de azúcar y ${e.b2} g de levadura, con un beneficio de <b>${eur(e.cy)} €</b>.</p>
          <p>Solo se dispone de <b>${e.G} g de azúcar</b> y <b>${e.B} g de levadura</b>.</p>
          <p class="pregunta">¿Cuántos pasteles de cada tipo deben elaborarse para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} al número de ${e.xp} e ${V('y')} al de ${e.yp}.</p>`;
      }
    },
    {
      id: 'decoracion', nombre: 'Taller de decoración · Trujillo',
      pares: [[['espejo', 'espejos'], ['cuadro', 'cuadros']], [['lámpara', 'lámparas'], ['jarrón', 'jarrones']], [['marco', 'marcos'], ['reloj de pared', 'relojes de pared']]],
      r1: { A: [1, 1], B: [1, 1] }, r2: { A: [1, 3], B: [2, 6] }, P: [[10, 60], [3, 30]], minimos: 'no',
      coefs: R => [R.int(8, 20) * 10, R.int(8, 20) * 10], rtxt: ['artículos a la venta como máximo', 'horas de fabricación disponibles'],
      pau: { a1: 1, b1: 1, a2: 1, b2: 4, px: 40, py: 5, mx: 0, my: 0, cx: 120, cy: 180, par: 0 },
      texto(e) {
        return `<p>En un taller de decoración de <b>Trujillo</b> se venden ${e.xp} y ${e.yp}, con un beneficio de <b>${eur(e.cx)} €</b> por cada ${e.xs} y de <b>${eur(e.cy)} €</b> por cada ${e.ys}.</p>
          <p>El taller dispone para la venta de, como mucho, <b>${e.G} artículos</b> entre ambos productos, que ha fabricado previamente: cada ${e.xs} ha necesitado ${plural(e.a2, 'hora', 'horas')} y cada ${e.ys}, ${plural(e.b2, 'hora', 'horas')}, con una disponibilidad de, como mucho, <b>${e.B} horas</b>.</p>
          <p class="pregunta">¿Cuántos artículos de cada tipo debe vender para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} al número de ${e.xp} e ${V('y')} al de ${e.yp}.</p>`;
      }
    },
    {
      id: 'confeccion', nombre: 'Taller de confección · Don Benito',
      pares: [[['abrigo', 'abrigos'], ['cazadora', 'cazadoras']], [['chaqueta', 'chaquetas'], ['falda', 'faldas']], [['gabardina', 'gabardinas'], ['chaleco', 'chalecos']]],
      r1: { A: [1, 3], B: [1, 3] }, r2: { A: [1, 4], B: [1, 3] }, P: [[10, 40], [10, 40]], minimos: 'x?',
      coefs: R => [R.int(5, 12) * 10, R.int(5, 12) * 10], rtxt: ['tela de forro disponible', 'tela de paño disponible'],
      pau: { a1: 1, b1: 2, a2: 3, b2: 2, px: 20, py: 30, mx: 0, my: 0, cx: 80, cy: 70, par: 0 },
      texto(e) {
        return `<p>Un taller de confección de <b>Don Benito</b> fabrica ${e.xp} y ${e.yp}. Para ello dispone semanalmente de <b>${e.G} m² de tela de forro</b> y <b>${e.B} m² de tela de paño</b>.</p>
          <p>Cada ${e.xs} requiere ${e.a1} m² de forro y ${e.a2} m² de paño, y deja un beneficio de <b>${eur(e.cx)} €</b>.
          Cada ${e.ys} requiere ${e.b1} m² de forro y ${e.b2} m² de paño, y deja <b>${eur(e.cy)} €</b>.</p>
          ${e.mx > 0 ? `<p>Además, tiene un pedido de al menos <b>${e.mx} ${e.xp}</b> para esta semana.</p>` : ''}
          <p class="pregunta">¿Cuántas prendas de cada tipo debe confeccionar a la semana para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} al número de ${e.xp} e ${V('y')} al de ${e.yp}.</p>`;
      }
    },
    {
      id: 'abonos', nombre: 'Tienda de productos agrícolas · Villanueva de la Serena', pre: ['envase del compuesto ', 'envases del compuesto '],
      pares: [['A', 'B'], ['Huerta', 'Frutal'], ['Olivar', 'Viñedo']],
      r1: { A: [1, 4], B: [2, 8] }, r2: { A: [1, 2], B: [1, 2] }, P: [[10, 80], [5, 50]], minimos: 'x?',
      coefs: R => [R.int(5, 15) * 10, R.int(5, 15) * 10], rtxt: ['abono de nitrógeno disponible', 'abono de potasio disponible'],
      pau: { a1: 3, b1: 6, a2: 1, b2: 1, px: 60, py: 20, mx: 0, my: 0, cx: 100, cy: 120, par: 0 },
      texto(e) {
        return `<p>Una tienda de productos agrícolas de <b>Villanueva de la Serena</b> dispone de <b>${e.G} kg de abono de nitrógeno</b> y de <b>${e.B} kg de abono de potasio</b> para fabricar dos compuestos, ${e.X} y ${e.Y}.</p>
          <p>Cada envase del compuesto ${e.X} contiene ${e.a1} kg de nitrógeno y ${e.a2} kg de potasio, y deja un beneficio de <b>${eur(e.cx)} €</b>.
          Cada envase del compuesto ${e.Y} contiene ${e.b1} kg de nitrógeno y ${e.b2} kg de potasio, y deja <b>${eur(e.cy)} €</b>.</p>
          ${e.mx > 0 ? `<p>Además, una cooperativa le ha encargado al menos <b>${e.mx} envases del compuesto ${e.X}</b>.</p>` : ''}
          <p class="pregunta">¿Cuántos envases de cada compuesto debe fabricar para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} al número de envases del compuesto ${e.X} e ${V('y')} al del compuesto ${e.Y}.</p>`;
      }
    },
    {
      id: 'calzado', nombre: 'Calzado artesano · Zafra',
      pares: [[['par de zapatos', 'pares de zapatos'], ['par de botas', 'pares de botas']], [['par de sandalias', 'pares de sandalias'], ['par de botines', 'pares de botines']], [['par de mocasines', 'pares de mocasines'], ['par de botas camperas', 'pares de botas camperas']]],
      r1: { A: [1, 2], B: [1, 2] }, r2: { A: [1, 3], B: [1, 4], k: 0.5 }, P: [[10, 50], [10, 40]], minimos: 'no',
      coefs: R => [R.int(4, 10) * 10, R.int(4, 10) * 10], rtxt: ['horas de trabajo disponibles', 'piel disponible'],
      pau: { a1: 1, b1: 1, a2: 1, b2: 2, px: 30, py: 20, mx: 0, my: 0, cx: 70, cy: 80, par: 0 },
      texto(e) {
        return `<p>Una tienda de calzado artesano de <b>Zafra</b> fabrica ${e.xp} y ${e.yp}.</p>
          <p>Cada ${e.xs} requiere ${plural(e.a1, 'hora', 'horas')} de trabajo y ${fmt(e.a2)} m² de piel, con un beneficio de <b>${eur(e.cx)} €</b>.
          Cada ${e.ys} requiere ${plural(e.b1, 'hora', 'horas')} de trabajo y ${fmt(e.b2)} m² de piel, con un beneficio de <b>${eur(e.cy)} €</b>.</p>
          <p>Solo dispone de <b>${e.G} horas de trabajo</b> y de <b>${fmt(e.B)} m² de piel</b>.</p>
          <p class="pregunta">¿Cuántos pares de cada tipo hay que fabricar para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} al número de ${e.xp} e ${V('y')} al de ${e.yp}.</p>`;
      }
    },
    {
      id: 'apicultor', nombre: 'Apicultor hurdano · Las Hurdes', pre: ['lote ', 'lotes '],
      pares: [['A', 'B'], ['Brezo', 'Castaño'], ['Tradicional', 'Regalo']],
      r1: { A: [1, 4], B: [1, 4] }, r2: { A: [1, 3], B: [1, 3] }, P: [[5, 30], [5, 30]], paso: 10, minimos: 'x?',
      coefs: R => [R.int(8, 20), R.int(8, 20)], rtxt: ['botes de miel disponibles', 'botes de polen disponibles'],
      pau: { a1: 2, b1: 3, a2: 2, b2: 1, px: 150, py: 200, mx: 0, my: 0, cx: 15, cy: 12, par: 0 },
      texto(e) {
        return `<p>Un apicultor de <b>Las Hurdes</b> tiene <b>${e.G} botes de miel</b> y <b>${e.B} botes de polen</b>, con los que elabora dos lotes, ${e.X} y ${e.Y}, que pone a la venta.</p>
          <p>Cada lote ${e.X} contiene ${plural(e.a1, 'bote', 'botes')} de miel y ${plural(e.a2, 'bote', 'botes')} de polen, con un beneficio de <b>${eur(e.cx)} €</b>.
          Cada lote ${e.Y} contiene ${plural(e.b1, 'bote', 'botes')} de miel y ${plural(e.b2, 'bote', 'botes')} de polen, con un beneficio de <b>${eur(e.cy)} €</b>.</p>
          ${e.mx > 0 ? `<p>Además, una tienda de Caminomorisco le ha encargado al menos <b>${e.mx} lotes ${e.X}</b>.</p>` : ''}
          <p class="pregunta">¿Cuántos lotes de cada tipo debe organizar para que el beneficio sea máximo? ¿A cuánto asciende?</p>
          <p class="variables">Llama ${V('x')} al número de lotes ${e.X} e ${V('y')} al de lotes ${e.Y}.</p>`;
      }
    },
    /* ---------- Minimizar costes: pedidos que hay que cubrir (restricciones ≥) ---------- */
    {
      id: 'vacunas', tipo: 'min', nombre: 'Laboratorios farmacéuticos · Vacunas',
      pares: [[['día del laboratorio A', 'días del laboratorio A'], ['día del laboratorio B', 'días del laboratorio B']]],
      r1: { A: [1, 4], B: [1, 4], k: 1000 }, r2: { A: [1, 4], B: [1, 4], k: 1000 }, P: [[2, 14], [2, 14]], minimos: 'no',
      coefs: R => [R.int(4, 15) * 1000, R.int(4, 15) * 1000], rtxt: ['dosis contra la gripe pedidas (como mínimo)', 'dosis contra la neumonía pedidas (como mínimo)'],
      pau: { a1: 2, b1: 4, a2: 2, b2: 1, px: 8, py: 2, mx: 0, my: 0, cx: 8000, cy: 10000, par: 0 },
      texto(e) {
        return `<p>Una empresa farmacéutica produce vacunas contra la gripe y contra la neumonía en dos laboratorios, A y B.</p>
          <p>El laboratorio A produce diariamente <b>${miles(e.a1)} dosis</b> de vacunas contra la gripe y <b>${miles(e.a2)}</b> contra la neumonía, con un coste diario de <b>${eur(e.cx)} €</b>.
          El laboratorio B produce diariamente <b>${miles(e.b1)} dosis</b> contra la gripe y <b>${miles(e.b2)}</b> contra la neumonía, con un coste diario de <b>${eur(e.cy)} €</b>.</p>
          <p>Se recibe un pedido de <b>${miles(e.G)} dosis</b> de vacunas contra la gripe y <b>${miles(e.B)}</b> contra la neumonía.</p>
          <p class="pregunta">¿Cuántos días debe funcionar cada laboratorio para satisfacer el pedido con un coste mínimo? ¿Cuál es el valor de dicho coste mínimo?</p>
          <p class="variables">Llama ${V('x')} al número de días que funciona el laboratorio A e ${V('y')} al de días que funciona el B.</p>`;
      }
    },
    {
      id: 'factoria', tipo: 'min', nombre: 'Factoría de automóviles · Pedido de temporada',
      pares: [[['día de la fábrica A', 'días de la fábrica A'], ['día de la fábrica B', 'días de la fábrica B']]],
      r1: { A: [2, 8], B: [1, 6] }, r2: { A: [1, 6], B: [1, 6] }, P: [[5, 40], [5, 70]], minimos: 'no',
      coefs: R => [R.int(10, 40) * 1000, R.int(10, 40) * 1000], rtxt: ['turismos pedidos (como mínimo)', 'furgonetas pedidas (como mínimo)'],
      pau: { a1: 6, b1: 2, a2: 2, b2: 2, px: 10, py: 60, mx: 0, my: 0, cx: 30000, cy: 20000, par: 0 },
      texto(e) {
        return `<p>Una factoría de automóviles tiene pedidos de <b>${e.G} turismos</b> y <b>${e.B} furgonetas</b> para la próxima temporada. Dispone para ello de dos fábricas, A y B.</p>
          <p>La fábrica A produce diariamente ${plural(e.a1, 'turismo', 'turismos')} y ${plural(e.a2, 'furgoneta', 'furgonetas')}, con un coste diario de <b>${eur(e.cx)} €</b>.
          La fábrica B produce diariamente ${plural(e.b1, 'turismo', 'turismos')} y ${plural(e.b2, 'furgoneta', 'furgonetas')}, con un coste de <b>${eur(e.cy)} €</b> cada día.</p>
          <p class="pregunta">¿Cuántos días debe abrir cada fábrica para producir el pedido de la temporada con el mínimo coste? ¿Cuál es el valor de dicho coste mínimo?</p>
          <p class="variables">Llama ${V('x')} al número de días que abre la fábrica A e ${V('y')} al de días que abre la B.</p>`;
      }
    },
    {
      id: 'piensos', tipo: 'min', nombre: 'Granja de cerdo ibérico · Jerez de los Caballeros', pre: ['saco de pienso ', 'sacos de pienso '],
      pares: [['A', 'B'], ['Montanera', 'Engorde'], ['Cebo', 'Crecimiento']],
      r1: { A: [1, 5], B: [1, 5] }, r2: { A: [1, 5], B: [1, 5] }, P: [[5, 40], [5, 40]], minimos: 'no',
      coefs: R => [R.int(12, 40), R.int(12, 40)], rtxt: ['proteína necesaria (como mínimo)', 'fibra necesaria (como mínimo)'],
      texto(e) {
        return `<p>Un ganadero de <b>Jerez de los Caballeros</b> necesita este mes, para alimentar a sus cerdos ibéricos, al menos <b>${e.G} kg de proteína</b> y <b>${e.B} kg de fibra</b>. Puede comprar dos piensos, ${e.X} y ${e.Y}.</p>
          <p>Cada saco de pienso ${e.X} aporta ${e.a1} kg de proteína y ${e.a2} kg de fibra, y cuesta <b>${eur(e.cx)} €</b>.
          Cada saco de pienso ${e.Y} aporta ${e.b1} kg de proteína y ${e.b2} kg de fibra, y cuesta <b>${eur(e.cy)} €</b>.</p>
          <p class="pregunta">¿Cuántos sacos de cada pienso debe comprar para cubrir esas necesidades con el menor coste posible? ¿Cuál es ese coste mínimo?</p>
          <p class="variables">Llama ${V('x')} al número de sacos de pienso ${e.X} e ${V('y')} al de sacos de pienso ${e.Y}.</p>`;
      }
    },
    {
      id: 'cerezas', tipo: 'min', nombre: 'Cooperativa de cerezas · Valle del Jerte', pre: ['turno en la planta ', 'turnos en la planta '],
      pares: [['de Cabezuela', 'de Navaconcejo'], ['de Jerte', 'de Valdastillas'], ['de Tornavacas', 'de Piornal']],
      r1: { A: [1, 6], B: [1, 6], k: 100 }, r2: { A: [1, 5], B: [1, 5], k: 100 }, P: [[3, 20], [3, 20]], minimos: 'no',
      coefs: R => [R.int(6, 20) * 100, R.int(6, 20) * 100], rtxt: ['cajas de picotas pedidas (como mínimo)', 'cajas de cerezas Burlat pedidas (como mínimo)'],
      texto(e) {
        return `<p>Una cooperativa del <b>Valle del Jerte</b> envasa cerezas en dos plantas, la ${e.X} y la ${e.Y}. Una cadena de supermercados le hace un pedido de al menos <b>${miles(e.G)} cajas de picotas</b> y <b>${miles(e.B)} cajas de cerezas Burlat</b>.</p>
          <p>Cada turno de trabajo en la planta ${e.X} envasa ${miles(e.a1)} cajas de picotas y ${miles(e.a2)} de Burlat, con un coste de <b>${eur(e.cx)} €</b>.
          Cada turno en la planta ${e.Y} envasa ${miles(e.b1)} cajas de picotas y ${miles(e.b2)} de Burlat, con un coste de <b>${eur(e.cy)} €</b>.</p>
          <p class="pregunta">¿Cuántos turnos debe programar en cada planta para servir el pedido con el menor coste? ¿Cuál es ese coste mínimo?</p>
          <p class="variables">Llama ${V('x')} al número de turnos en la planta ${e.X} e ${V('y')} al de turnos en la planta ${e.Y}.</p>`;
      }
    }
  ];

  /* ---------- Construcción (misma lógica que la ficha) ---------- */
  function cortes(l1, l2) {
    const d = l1.a * l2.b - l2.a * l1.b;
    if (d === 0) return null;
    return [(l1.c * l2.b - l2.c * l1.b) / d, (l1.a * l2.c - l2.a * l1.c) / d];
  }
  const cumpleR = (r, p) => r.s === '≤' ? r.a * p[0] + r.b * p[1] <= r.c + 1e-9 : r.a * p[0] + r.b * p[1] >= r.c - 1e-9;
  const valorZ = (e, v) => Math.round((e.cx * v[0] + e.cy * v[1]) * 100) / 100;
  const FORMAS_REL = {
    'x≤ky': k => ({ a: 1, b: -k, s: '≤' }), 'y≤kx': k => ({ a: -k, b: 1, s: '≤' }),
    'y≥kx': k => ({ a: -k, b: 1, s: '≥' }), 'x≥ky': k => ({ a: 1, b: -k, s: '≥' })
  };
  const PROB_REL = 0.4, PROB_PAU = 0.25;
  const tensa = (r, p) => Math.abs(r.a * p[0] + r.b * p[1] - r.c) < 1e-9;
  const esOrigen = v => v[0] === 0 && v[1] === 0;

  function pasoBonito(max) {
    for (const p of [1, 2, 5, 10, 20, 25, 50, 100, 200]) if (max / p <= 11) return p;
    return 500;
  }
  function escala(e) {
    const xs = [e.G / e.a1, e.B / e.a2, ...e.verts.map(v => v[0])];
    const ys = [e.G / e.b1, e.B / e.b2, ...e.verts.map(v => v[1])];
    const mX = Math.max(...xs) * 1.08, mY = Math.max(...ys) * 1.08;
    const sx = pasoBonito(mX), sy = pasoBonito(mY);
    return { xmax: Math.ceil(mX / sx) * sx, ymax: Math.ceil(mY / sy) * sy, sx, sy };
  }
  function candidatos(e) {
    const lineas = [
      { a: e.a1, b: e.b1, c: e.G }, { a: e.a2, b: e.b2, c: e.B },
      { a: 1, b: 0, c: e.mx }, { a: 0, b: 1, c: e.my }, { a: 0, b: 1, c: 0 }, { a: 1, b: 0, c: 0 }
    ];
    if (e.rz) lineas.push(e.rz);
    const out = [];
    for (let i = 0; i < lineas.length; i++) for (let j = i + 1; j < lineas.length; j++) {
      const p = cortes(lineas[i], lineas[j]);
      if (!p || p[0] < -1e-9 || p[1] < -1e-9) continue;
      const q = [Math.round(p[0] * 1000) / 1000 + 0, Math.round(p[1] * 1000) / 1000 + 0];
      if (q[0] === 0 && q[1] === 0 && !e.verts.some(v => v[0] === 0 && v[1] === 0)) continue;
      if (out.some(o => Math.abs(o[0] - q[0]) < 1e-6 && Math.abs(o[1] - q[1]) < 1e-6)) continue;
      out.push(q);
    }
    return out;
  }

  function construir(ctx, d) {
    const { a1, b1, a2, b2, px, py, mx, my, cx, cy } = d;
    const tipo = ctx.tipo || 'max', s = tipo === 'max' ? '≤' : '≥';
    if (a1 * b2 - a2 * b1 === 0 || mx >= px || my >= py) return null;
    const G = a1 * px + b1 * py, B = a2 * px + b2 * py;
    const Ri = [
      { id: 'r1', a: a1, b: b1, c: G, s }, { id: 'r2', a: a2, b: b2, c: B, s },
      { id: 'rx', a: 1, b: 0, c: mx, s: '≥' }, { id: 'ry', a: 0, b: 1, c: my, s: '≥' }
    ];
    const rz = d.rel ? Object.assign({ id: 'rz', c: 0 }, FORMAS_REL[d.rel.forma](d.rel.k)) : null;
    if (rz) Ri.push(rz);
    const verts = [];
    for (let i = 0; i < Ri.length; i++) for (let j = i + 1; j < Ri.length; j++) {
      const p = cortes(Ri[i], Ri[j]);
      if (!p || !Ri.every(r => cumpleR(r, p))) continue;
      if (verts.some(q => Math.abs(q[0] - p[0]) < 1e-9 && Math.abs(q[1] - p[1]) < 1e-9)) continue;
      if (!Number.isInteger(p[0] + 0) || !Number.isInteger(p[1] + 0)) return null;
      verts.push([p[0] + 0, p[1] + 0, [Ri[i].id, Ri[j].id]]);
    }
    if (!rz) {
      if (verts.length !== (tipo === 'max' ? 4 : 3) || !verts.some(v => v[0] === px && v[1] === py)) return null;
    } else {
      if (verts.length < 3 || verts.length > 5) return null;
      if (!verts.some(v => !esOrigen(v) && tensa(rz, v))) return null;
      if (!verts.some(v => tensa(Ri[0], v)) || !verts.some(v => tensa(Ri[1], v))) return null;
      verts.forEach(v => { if (!esOrigen(v) && tensa(rz, v) && !v[2].includes('rz')) v[2] = [v[2][0], 'rz']; });
    }
    const k1 = ctx.r1.k || 1, k2 = ctx.r2.k || 1;
    const par = ctx.pares[d.par];
    const e = {
      ctx, X: par[0], Y: par[1], xs: lab(par[0], 0, ctx.pre), xp: lab(par[0], 1, ctx.pre), ys: lab(par[1], 0, ctx.pre), yp: lab(par[1], 1, ctx.pre),
      a1: a1 * k1, b1: b1 * k1, G: G * k1, a2: a2 * k2, b2: b2 * k2, B: B * k2, mx, my, cx, cy, verts, tipo
    };
    e.R = [
      { id: 'r1', a: e.a1, b: e.b1, c: e.G, s }, { id: 'r2', a: e.a2, b: e.b2, c: e.B, s },
      { id: 'rx', a: 1, b: 0, c: mx, s: '≥' }, { id: 'ry', a: 0, b: 1, c: my, s: '≥' }
    ];
    if (rz) { e.R.push(rz); e.rz = rz; e.rel = d.rel; }
    const mejor = (p, q) => tipo === 'max' ? p > q : p < q;
    const zs = verts.map(v => valorZ(e, v)).sort((p, q) => tipo === 'max' ? q - p : p - q);
    if (Math.abs(zs[0] - zs[1]) < Math.max(1, Math.abs(zs[0]) * 0.01)) return null;
    e.opt = verts.reduce((m, v) => (mejor(valorZ(e, v), valorZ(e, m)) ? v : m));
    e.zopt = valorZ(e, e.opt);
    e.optEnCorte = (e.opt[0] === px && e.opt[1] === py) || (!!rz && tensa(rz, e.opt));
    // Puntos de corte no demasiado juntos (mismo umbral que el plano de la ficha)
    const es = escala(e), c = candidatos(e);
    for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++)
      if (Math.hypot((c[i][0] - c[j][0]) / es.xmax * 408, (c[i][1] - c[j][1]) / es.ymax * 408) < 22) return null;
    e.esc = es;
    return e;
  }

  function minimo(R, p, paso) {
    const lo = Math.max(1, Math.ceil(4 / paso)), hi = Math.max(lo, Math.floor(p * 0.6 / paso));
    return paso * R.int(lo, hi);
  }
  const admiteRel = ctx => ctx.minimos === 'no' || ctx.minimos === 'x?';
  function aleatorio(R, ctx, conRel) {
    const paso = ctx.paso || 1;
    const px = paso * R.int(...ctx.P[0]), py = paso * R.int(...ctx.P[1]);
    const m = ctx.minimos;
    const rel = conRel ? { forma: R.pick(Object.keys(FORMAS_REL)), k: R.int(1, 3) } : null;
    const conX = !rel && (m === 'x' || m === 'xy' || m === 'x+y?' || (m === 'x?' && R.rand() < 0.35));
    const conY = !rel && (m === 'xy' || (m === 'x+y?' && R.rand() < 0.5));
    const [cx, cy] = ctx.coefs(R);
    return {
      a1: R.int(...ctx.r1.A), b1: R.int(...ctx.r1.B), a2: R.int(...ctx.r2.A), b2: R.int(...ctx.r2.B), px, py,
      mx: conX ? minimo(R, px, paso) : 0, my: conY ? minimo(R, py, paso) : 0, cx, cy, par: R.int(0, ctx.pares.length - 1), rel
    };
  }
  function relFrase(e) {
    const { forma, k } = e.rel, cuanto = ['', '', 'el doble del ', 'el triple del '][k];
    const [A, Bn] = forma[0] === 'x' ? [e.xp, e.yp] : [e.yp, e.xp];
    if (forma[1] === '≤') return k === 1 ? `El número de ${A} no puede ser mayor que el número de ${Bn}.` : `El número de ${A} no puede superar ${cuanto}número de ${Bn}.`;
    return k === 1 ? `El número de ${A} debe ser, como mínimo, igual al número de ${Bn}.` : `El número de ${A} debe ser, como mínimo, ${cuanto}número de ${Bn}.`;
  }
  function generarCaso(R, tipo) {
    const posibles = CONTEXTOS.filter(c => (c.tipo || 'max') === tipo);
    for (let intento = 0; intento < 50; intento++) {
      const ctx = R.pick(posibles);
      let e = null;
      const conRel = admiteRel(ctx) && R.rand() < PROB_REL;
      if (!conRel && ctx.pau && R.rand() < PROB_PAU) e = construir(ctx, Object.assign({}, ctx.pau));
      for (let t = 0; !e && t < 6000; t++) {
        const cand = construir(ctx, aleatorio(R, ctx, conRel));
        if (!cand) continue;
        if (R.rand() < 0.7 && !cand.optEnCorte) continue;
        e = cand;
      }
      if (e) return e;
    }
    throw new Error('No se pudo generar un problema de programación lineal');
  }

  /* ---------- Región factible: recorte del rectángulo del dibujo ---------- */
  function recortar(poli, r) {
    const dentro = p => cumpleR(r, p);
    const out = [];
    for (let i = 0; i < poli.length; i++) {
      const P = poli[i], Q = poli[(i + 1) % poli.length];
      const pin = dentro(P), qin = dentro(Q);
      if (pin) out.push(P);
      if (pin !== qin) {
        const fp = r.a * P[0] + r.b * P[1] - r.c, fq = r.a * Q[0] + r.b * Q[1] - r.c;
        const t = fp / (fp - fq);
        out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]);
      }
    }
    return out;
  }
  const LETRAS = 'ABCDEFGH';
  function ordenarVertices(e) {
    const cx = e.verts.reduce((s, v) => s + v[0], 0) / e.verts.length, cy = e.verts.reduce((s, v) => s + v[1], 0) / e.verts.length;
    const ang = v => Math.atan2(v[1] - cy, v[0] - cx);
    const vs = e.verts.slice().sort((a, b) => ang(a) - ang(b));
    // empieza por el de menor x (y, a igualdad, menor y)
    let k = 0; vs.forEach((v, i) => { if (v[0] < vs[k][0] || (v[0] === vs[k][0] && v[1] < vs[k][1])) k = i; });
    return vs.slice(k).concat(vs.slice(0, k));
  }
  function svgRegion(e, vs) {
    const { xmax, ymax, sx, sy } = e.esc;
    const W = 300, H = 230, L = 38, T = 10, PW = W - L - 14, PH = H - T - 28;
    const X = x => L + x / xmax * PW, Y = y => T + PH - y / ymax * PH;
    let s = `<svg class="pl-graf" viewBox="0 0 ${W} ${H}" role="img" aria-label="Región factible" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">`;
    for (let x = 0; x <= xmax + 1e-9; x += sx) s += `<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(ymax)}" stroke="${x === 0 ? '#222' : '#ddd'}" stroke-width="${x === 0 ? 1.1 : .5}"/><text x="${X(x)}" y="${Y(0) + 11}" font-size="7.5" text-anchor="middle" fill="#444">${fmt(x)}</text>`;
    for (let y = 0; y <= ymax + 1e-9; y += sy) s += `<line x1="${X(0)}" y1="${Y(y)}" x2="${X(xmax)}" y2="${Y(y)}" stroke="${y === 0 ? '#222' : '#ddd'}" stroke-width="${y === 0 ? 1.1 : .5}"/>${y > 0 ? `<text x="${X(0) - 4}" y="${Y(y) + 2.5}" font-size="7.5" text-anchor="end" fill="#444">${fmt(y)}</text>` : ''}`;
    let poli = [[0, 0], [xmax, 0], [xmax, ymax], [0, ymax]];
    e.R.forEach(r => { poli = recortar(poli, r); });
    if (poli.length) s += `<polygon points="${poli.map(p => X(p[0]) + ',' + Y(p[1])).join(' ')}" fill="#9db4d6" fill-opacity=".35" stroke="none"/>`;
    // Rectas de r1, r2 y proporción
    const recta = (r, color, dash) => {
      const pts = [];
      [[0, null], [xmax, null], [null, 0], [null, ymax]].forEach(([x, y]) => {
        if (x !== null && r.b !== 0) { const yy = (r.c - r.a * x) / r.b; if (yy >= -1e-9 && yy <= ymax + 1e-9) pts.push([x, yy]); }
        if (y !== null && r.a !== 0) { const xx = (r.c - r.b * y) / r.a; if (xx >= -1e-9 && xx <= xmax + 1e-9) pts.push([xx, y]); }
      });
      if (pts.length >= 2) s += `<line x1="${X(pts[0][0])}" y1="${Y(pts[0][1])}" x2="${X(pts[pts.length - 1][0])}" y2="${Y(pts[pts.length - 1][1])}" stroke="${color}" stroke-width="1.2"${dash ? ' stroke-dasharray="4 3"' : ''}/>`;
    };
    e.R.forEach(r => { if ((r.id === 'rx' || r.id === 'ry') && r.c === 0) return; recta(r, r.id === 'r1' || r.id === 'r2' ? '#1a2744' : '#7a5a14', r.id !== 'r1' && r.id !== 'r2'); });
    vs.forEach((v, i) => {
      const opt = v === e.opt;
      s += `<circle cx="${X(v[0])}" cy="${Y(v[1])}" r="${opt ? 3.4 : 2.4}" fill="${opt ? '#b8282b' : '#111'}"/>`;
      s += `<text x="${X(v[0]) + 4}" y="${Y(v[1]) - 4}" font-size="9" font-weight="600" fill="${opt ? '#b8282b' : '#111'}">${LETRAS[i]}</text>`;
    });
    s += `<text x="${X(xmax) - 2}" y="${Y(0) - 4}" font-size="10" font-style="italic" text-anchor="end">x</text><text x="${X(0) + 5}" y="${Y(ymax) + 9}" font-size="10" font-style="italic">y</text>`;
    return s + '</svg>';
  }

  /* ---------- Ejercicio ---------- */
  function problema(R, tipo) {
    const e = generarCaso(R, tipo);
    let texto = e.ctx.texto(e);
    if (e.rel) texto = texto.replace('<p class="pregunta">', `<p>${relFrase(e)}</p>\n        <p class="pregunta">`);
    texto = texto.replace(/\s+\n\s+/g, '\n');

    const esMax = tipo === 'max';
    const nombreR = { r1: e.ctx.rtxt[0], r2: e.ctx.rtxt[1] };
    const filas = e.R.map(r => {
      if (r.id === 'rx') return `x \\ge ${num(r.c)}`;
      if (r.id === 'ry') return `y \\ge ${num(r.c)}`;
      if (r.id === 'rz') return `${exprTeX(r.a, r.b)} ${SIG[r.s]} 0`;
      return `${exprTeX(r.a, r.b)} ${SIG[r.s]} ${num(r.c)}`;
    });
    const comentario = e.R.map(r => {
      if (r.id === 'r1' || r.id === 'r2') return `\\text{(${nombreR[r.id].replace(' (como mínimo)', ', como mínimo')})}`;
      if (r.id === 'rz') return '\\text{(proporción)}';
      const v = r.id === 'rx' ? 'x' : 'y';
      return r.c === 0 ? '\\text{(no negativa)}' : `\\text{(mínimo de } ${v}\\text{)}`;
    });
    const vs = ordenarVertices(e);
    const ecu = id => { const r = e.R.find(q => q.id === id); return r ? `${exprTeX(r.a, r.b)} = ${num(r.c)}` : ''; };
    const lineasV = vs.map((v, i) => `${LETRAS[i]} = (${num(v[0])},\\ ${num(v[1])}) & \\quad \\text{corte de } ${ecu(v[2][0])} \\text{ con } ${ecu(v[2][1])}`);
    const filasZ = vs.map((v, i) => {
      const z = valorZ(e, v), opt = v === e.opt;
      const cuerpo = `${LETRAS[i]}(${num(v[0])},\\ ${num(v[1])}) & Z = ${num(e.cx)} \\cdot ${num(v[0])} + ${num(e.cy)} \\cdot ${num(v[1])} = ${num(z)}`;
      return opt ? `${cuerpo} \\quad\\leftarrow\\ \\text{${esMax ? 'máximo' : 'mínimo'}}` : cuerpo;
    });
    const k = vs.indexOf(e.opt);
    const conclusion = `${esMax ? 'El beneficio máximo' : 'El coste mínimo'} es de <b>${eur(e.zopt)} €</b> y se obtiene con <b>${e.opt[0]} ${e.opt[0] === 1 ? e.xs : e.xp}</b> y <b>${e.opt[1]} ${e.opt[1] === 1 ? e.ys : e.yp}</b> (vértice ${LETRAS[k]}).`;
    const pasos = [
      { t: `1) Variables: \\(x\\) = número de ${e.xp}; \\(y\\) = número de ${e.yp}. Función objetivo, que hay que ${esMax ? 'maximizar' : 'minimizar'}:`,
        m: `Z = ${exprTeX(e.cx, e.cy)}` },
      { t: '2) Restricciones:', m: `\\left\\{\\begin{array}{ll} ${filas.map((f, i) => `${f} & ${comentario[i]}`).join(' \\\\ ')} \\end{array}\\right.` },
      { t: `3) Región factible (sombreada) y sus vértices${esMax ? '' : '. La región no está acotada, pero como los costes son positivos el mínimo se alcanza en un vértice'}:`,
        html: `<div class="pl-region">${svgRegion(e, vs)}<div>\\[\\begin{array}{ll} ${lineasV.join(' \\\\ ')} \\end{array}\\]</div></div>` },
      { t: '4) Evaluamos la función objetivo en cada vértice:', m: `\\begin{array}{ll} ${filasZ.join(' \\\\ ')} \\end{array}` },
      { t: conclusion }
    ];
    return {
      html: true,
      enun: `<div class="pl-texto">${texto}</div>`,
      pasos,
      resHtml: `${esMax ? 'Máximo' : 'Mínimo'}: ${eur(e.zopt)} € con x = ${e.opt[0]}, y = ${e.opt[1]}`
    };
  }

  registrarFicha({
    id: 'prog-lineal',
    titulo: 'Programación lineal',
    detalle: 'Optimización',
    grupo: 'Inecuaciones y programación lineal',
    enlace: '../inecuaciones/prog-lineal.html',
    ejercicios: [
      { id: 'maximizar', nombre: 'Maximizar beneficios', peso: 3, columnas: 1,
        enunciado: ['Resuelve el siguiente problema de programación lineal:', 'Resuelve los siguientes problemas de programación lineal:'],
        generar: R => problema(R, 'max') },
      { id: 'minimizar', nombre: 'Minimizar costes', peso: 3, columnas: 1,
        enunciado: ['Resuelve el siguiente problema de programación lineal:', 'Resuelve los siguientes problemas de programación lineal:'],
        generar: R => problema(R, 'min') }
    ]
  });
})();
