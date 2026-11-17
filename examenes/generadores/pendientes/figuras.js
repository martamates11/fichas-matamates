/* © 2026 Marta López de Letona · Martamates Interactivo · Todos los derechos reservados.
   Utilidades comunes para los generadores de las fichas de pendientes (1.º, 2.º y 3.º ESO):
   números decimales con coma y figuras SVG en blanco y negro, pensadas para fotocopiar.
   Se carga después de comun.js y antes de los generadores de pendientes. */
(function () {
  'use strict';
  const EX = window.EX;

  /* ---------- Números ---------- */
  /* Redondeo a d decimales evitando errores de coma flotante (2.675 → 2.68) */
  const rd = (x, d = 2) => { const k = Math.pow(10, d); return Math.round((x + Number.EPSILON) * k) / k; };
  /* Decimal con coma: texto plano ("3,5") y TeX ("3{,}5") */
  const decTxt = (x, d = 2) => {
    const s = rd(x, d).toLocaleString('es-ES', { maximumFractionDigits: d, useGrouping: false });
    return s.replace('-', '−');
  };
  const dec = (x, d = 2) => rd(x, d).toLocaleString('es-ES', { maximumFractionDigits: d, useGrouping: false }).replace(',', '{,}');

  /* ---------- Lienzo SVG ----------
     Se dibuja en píxeles de modelo; al cerrar, el viewBox se ajusta a lo dibujado
     y el ancho impreso es proporcional (1 px de modelo = 0,265 mm), así todas las
     figuras de un examen salen a la misma escala visual y con letra del mismo tamaño. */
  const MM = 0.265;
  const TINTA = '#1a1a1a', GRIS = '#555', RELLENO = '#ececec';
  const r1 = x => Math.round(x * 10) / 10;

  function Lienzo() {
    const partes = [];
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const caja = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
    const L = {
      poligono(pts, { relleno = RELLENO, trazo = TINTA, grosor = 1.6 } = {}) {
        pts.forEach(([x, y]) => caja(x, y));
        partes.push(`<polygon points="${pts.map(([x, y]) => r1(x) + ',' + r1(y)).join(' ')}" fill="${relleno}" stroke="${trazo}" stroke-width="${grosor}" stroke-linejoin="round"/>`);
        return L;
      },
      circulo(cx, cy, r, { relleno = RELLENO, trazo = TINTA, grosor = 1.6 } = {}) {
        caja(cx - r, cy - r); caja(cx + r, cy + r);
        partes.push(`<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}" fill="${relleno}" stroke="${trazo}" stroke-width="${grosor}"/>`);
        return L;
      },
      punto(x, y, r = 2.6) { caja(x - r, y - r); caja(x + r, y + r); partes.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="${TINTA}"/>`); return L; },
      linea(xa, ya, xb, yb, { trazo = TINTA, grosor = 1.2, discontinua = false } = {}) {
        caja(xa, ya); caja(xb, yb);
        partes.push(`<line x1="${r1(xa)}" y1="${r1(ya)}" x2="${r1(xb)}" y2="${r1(yb)}" stroke="${trazo}" stroke-width="${grosor}"${discontinua ? ' stroke-dasharray="4 3"' : ''} stroke-linecap="round"/>`);
        return L;
      },
      /* Texto; ancla: 'start' | 'middle' | 'end'. Se estima su caja para el viewBox. */
      texto(x, y, s, { ancla = 'middle', tam = 13, cursiva = false, peso = 400 } = {}) {
        const largo = String(s).replace(/<[^>]+>/g, '').length * tam * 0.52;
        const xi = ancla === 'start' ? x : ancla === 'end' ? x - largo : x - largo / 2;
        caja(xi, y - tam * 0.8); caja(xi + largo, y + tam * 0.25);
        partes.push(`<text x="${r1(x)}" y="${r1(y)}" text-anchor="${ancla}" font-size="${tam}"${cursiva ? ' font-style="italic"' : ''}${peso !== 400 ? ` font-weight="${peso}"` : ''} fill="${TINTA}">${s}</text>`);
        return L;
      },
      /* Marca de ángulo recto en el vértice V, con los lados en las direcciones u y v */
      anguloRecto([vx, vy], [ux, uy], [wx, wy], t = 9) {
        const nu = Math.hypot(ux, uy), nw = Math.hypot(wx, wy);
        ux = ux / nu * t; uy = uy / nu * t; wx = wx / nw * t; wy = wy / nw * t;
        partes.push(`<polyline points="${r1(vx + ux)},${r1(vy + uy)} ${r1(vx + ux + wx)},${r1(vy + uy + wy)} ${r1(vx + wx)},${r1(vy + wy)}" fill="none" stroke="${TINTA}" stroke-width="1"/>`);
        return L;
      },
      /* Cota del segmento PQ desplazada d px hacia el lado lado (+1/−1, normal a la izquierda de PQ) */
      cota([px, py], [qx, qy], etiqueta, { d = 16, lado = 1, tam = 13 } = {}) {
        const lx = qx - px, ly = qy - py, l = Math.hypot(lx, ly);
        const nx = (ly / l) * lado, ny = (-lx / l) * lado;
        const ax = px + nx * d, ay = py + ny * d, bx = qx + nx * d, by = qy + ny * d;
        L.linea(px + nx * 4, py + ny * 4, ax + nx * 4, ay + ny * 4, { trazo: GRIS, grosor: 0.7 });
        L.linea(qx + nx * 4, qy + ny * 4, bx + nx * 4, by + ny * 4, { trazo: GRIS, grosor: 0.7 });
        L.linea(ax, ay, bx, by, { trazo: GRIS, grosor: 0.9 });
        const fx = lx / l * 5, fy = ly / l * 5, gx = nx * 3, gy = ny * 3;   // puntas de flecha
        partes.push(`<path d="M${r1(ax)},${r1(ay)} l${r1(fx + gx)},${r1(fy + gy)} M${r1(ax)},${r1(ay)} l${r1(fx - gx)},${r1(fy - gy)} M${r1(bx)},${r1(by)} l${r1(-fx + gx)},${r1(-fy + gy)} M${r1(bx)},${r1(by)} l${r1(-fx - gx)},${r1(-fy - gy)}" stroke="${GRIS}" stroke-width="0.9" fill="none"/>`);
        L.rotulo((ax + bx) / 2, (ay + by) / 2, nx, ny, etiqueta, tam);
        return L;
      },
      /* Rótulo junto al punto (x, y), separado en la dirección (nx, ny) */
      rotulo(x, y, nx, ny, s, tam = 13, sep = 7) {
        const ancla = nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle';
        const dy = ny > 0.35 ? tam * 0.85 : ny < -0.35 ? -2 : tam * 0.35;
        return L.texto(x + nx * sep, y + ny * sep + dy, s, { ancla, tam });
      },
      cerrar(clase = 'pend-fig', etiqueta = 'Figura', margen = 4) {
        const w = x1 - x0 + 2 * margen, h = y1 - y0 + 2 * margen;
        return `<svg class="${clase}" viewBox="${r1(x0 - margen)} ${r1(y0 - margen)} ${r1(w)} ${r1(h)}" style="width:${r1(w * MM)}mm" role="img" aria-label="${etiqueta}" xmlns="http://www.w3.org/2000/svg" font-family="Source Serif 4, Georgia, serif">${partes.join('')}</svg>`;
      }
    };
    return L;
  }

  /* Medida con unidad para rótulos de figuras: "12 cm", "6,9 cm" */
  const medida = (x, u = 'cm', d = 2) => `${decTxt(x, d)} ${u}`;

  EX.pend = { rd, dec, decTxt, medida, Lienzo };
})();
