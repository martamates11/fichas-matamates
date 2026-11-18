/* © 2026 Marta López de Letona Sánchez · Martamates Interactivo · Todos los derechos reservados.
   Generadores de examen: Movimientos en el plano (pendientes de 3.º ESO).
   Mismos tipos y criterios de generación que la ficha pendientes/tercero/movimientos-3.html
   (cuadrícula de 18 × 12, triángulos y cuadriláteros con vértices en nudos, vectores de
   componentes −7…7 y −5…5, giros de 90°, −90° y 180°, simetrías con ejes vertical,
   horizontal o diagonal), adaptados al papel:
   · «Arrastra los vértices» pasa a «dibuja» sobre la cuadrícula; «Determina el eje» pasa a
     «dibuja el eje» y «Obtén el centro» a «marca el centro».
   · En el examen se pide el ángulo de giro por escrito (en la ficha se elige entre cuatro
     opciones); se mantienen los ángulos de la ficha (±45°, ±60°, ±90°, ±120°, ±135°, 180°),
     que se miden con transportador. Los demás giros son de 90° o 180°: se hacen a mano
     contando cuadros.
   · En las soluciones, la figura transformada va dibujada sobre la cuadrícula, con los
     segmentos auxiliares (vector, radios, perpendiculares al eje…). */
(function () {
  'use strict';
  const { registrarFicha, pend } = window.EX;
  const { Lienzo } = pend;

  const W = 18, H = 12, CELL = 20, EPS = 1e-6;
  const LET = ['A', 'B', 'C', 'D'], PR = '′';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const P = (x, y) => ({ x, y });
const eq = (p, q) => Math.abs(p.x - q.x) < EPS && Math.abs(p.y - q.y) < EPS;
const add = (a, b) => P(a.x + b.x, a.y + b.y);
const sub = (a, b) => P(a.x - b.x, a.y - b.y);
const mul = (a, k) => P(a.x * k, a.y * k);
const cross = (a, b) => a.x * b.y - a.y * b.x;
const dot = (a, b) => a.x * b.x + a.y * b.y;
const len = v => Math.hypot(v.x, v.y);
const norm360 = a => ((a % 360) + 360) % 360;
const fmt = n => (n < 0 ? '\u2212' : '') + String(Math.abs(Math.round(n * 100) / 100)).replace('.', ',');
const allEq = (s, t) => s.length === t.length && s.every((p, i) => eq(p, t[i]));
const sameSet = (s, t) => s.length === t.length && s.every(p => t.some(q => eq(p, q))) && t.every(q => s.some(p => eq(p, q)));
const lista = arr => arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1];
const nombres = (n, prima) => LET.slice(0, n).map(l => l + (prima ? PR : ''));

/* ---- Geometría ---- */
function area2(pts) { let s = 0; for (let i = 0; i < pts.length; i++) s += cross(pts[i], pts[(i + 1) % pts.length]); return s; }
function centroid(pts) { return mul(pts.reduce((a, p) => add(a, p), P(0, 0)), 1 / pts.length); }
function angleAt(pts, i) {
  const n = pts.length, a = sub(pts[(i - 1 + n) % n], pts[i]), b = sub(pts[(i + 1) % n], pts[i]);
  return Math.acos(clamp(dot(a, b) / (len(a) * len(b)), -1, 1)) * 180 / Math.PI;
}
function orient(a, b, c) { const v = cross(sub(b, a), sub(c, a)); return Math.abs(v) < EPS ? 0 : (v > 0 ? 1 : -1); }
function onSeg(p, a, b) { return orient(a, b, p) === 0 && Math.min(a.x, b.x) - EPS <= p.x && p.x <= Math.max(a.x, b.x) + EPS && Math.min(a.y, b.y) - EPS <= p.y && p.y <= Math.max(a.y, b.y) + EPS; }
function segInter(p1, p2, q1, q2) {
  const o1 = orient(p1, p2, q1), o2 = orient(p1, p2, q2), o3 = orient(q1, q2, p1), o4 = orient(q1, q2, p2);
  if (o1 !== o2 && o3 !== o4) return true;
  return (o1 === 0 && onSeg(q1, p1, p2)) || (o2 === 0 && onSeg(q2, p1, p2)) || (o3 === 0 && onSeg(p1, q1, q2)) || (o4 === 0 && onSeg(p2, q1, q2));
}
function pointInPoly(pt, poly) {
  if (poly.length < 3) return false;
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if (onSeg(pt, a, b)) return true;
    if ((a.y > pt.y) !== (b.y > pt.y) && pt.x < (b.x - a.x) * (pt.y - a.y) / (b.y - a.y) + a.x) ins = !ins;
  }
  return ins;
}
function distPtSeg(p, a, b) {
  const ab = sub(b, a), t = clamp(dot(sub(p, a), ab) / (dot(ab, ab) || 1), 0, 1);
  return len(sub(p, add(a, mul(ab, t))));
}
function distPtPoly(p, poly) {
  if (pointInPoly(p, poly)) return 0;
  let d = Infinity;
  for (let i = 0; i < poly.length; i++) d = Math.min(d, distPtSeg(p, poly[i], poly[(i + 1) % poly.length]));
  return d;
}
function polysOverlap(A, B) {
  for (let i = 0; i < A.length; i++) for (let j = 0; j < B.length; j++)
    if (segInter(A[i], A[(i + 1) % A.length], B[j], B[(j + 1) % B.length])) return true;
  return A.some(p => pointInPoly(p, B)) || B.some(p => pointInPoly(p, A));
}
function polyDist(A, B) {
  if (polysOverlap(A, B)) return 0;
  let d = Infinity;
  A.forEach(p => d = Math.min(d, distPtPoly(p, B)));
  B.forEach(p => d = Math.min(d, distPtPoly(p, A)));
  return d;
}
function inGrid(pts, m) { return pts.every(p => p.x >= m - EPS && p.x <= W - m + EPS && p.y >= m - EPS && p.y <= H - m + EPS); }

/* ---- Transformaciones ---- */
const tras = v => p => add(p, v);
function rot(O, a) {
  const n = norm360(a);
  return p => {
    const dx = p.x - O.x, dy = p.y - O.y; let x, y;
    if (n === 0) { x = dx; y = dy; } else if (n === 90) { x = -dy; y = dx; }
    else if (n === 180) { x = -dx; y = -dy; } else if (n === 270) { x = dy; y = -dx; }
    else { const r = n * Math.PI / 180; x = dx * Math.cos(r) - dy * Math.sin(r); y = dx * Math.sin(r) + dy * Math.cos(r); }
    return P(O.x + x, O.y + y);
  };
}
const central = O => p => P(2 * O.x - p.x, 2 * O.y - p.y);
function mkLine(type, k) {
  if (type === 'v') return { type, k, P: P(k, 0), d: P(0, 1) };
  if (type === 'h') return { type, k, P: P(0, k), d: P(1, 0) };
  if (type === 'd1') return { type, k, P: P(0, k), d: P(1, 1) };   // y = x + k
  return { type, k, P: P(0, k), d: P(1, -1) };                      // y = -x + k
}
const lineSide = (L, p) => cross(L.d, sub(p, L.P));
const onLine = (L, p) => Math.abs(lineSide(L, p)) < EPS;
const reflect = L => p => { const t = dot(sub(p, L.P), L.d) / dot(L.d, L.d); const f = add(L.P, mul(L.d, t)); return sub(mul(f, 2), p); };
function clipLine(Pt, d) {
  let t0 = -Infinity, t1 = Infinity;
  for (const [pc, dc, M] of [[Pt.x, d.x, W], [Pt.y, d.y, H]]) {
    if (Math.abs(dc) < EPS) { if (pc < -EPS || pc > M + EPS) return null; continue; }
    const a = (0 - pc) / dc, b = (M - pc) / dc;
    t0 = Math.max(t0, Math.min(a, b)); t1 = Math.min(t1, Math.max(a, b));
  }
  if (t1 - t0 < EPS) return null;
  return [add(Pt, mul(d, t0)), add(Pt, mul(d, t1))];
}

/* ---- Generadores de figuras ---- */

  /* ---------- Figuras aleatorias (con el azar de la semilla R) ---------- */
  function randTri(R) {
    for (let t = 0; t < 4000; t++) {
      const x0 = R.int(1, W - 1), y0 = R.int(1, H - 1);
      let pts = [P(x0, y0), P(x0 + R.int(-5, 5), y0 + R.int(-5, 5)), P(x0 + R.int(-5, 5), y0 + R.int(-5, 5))];
      if (!inGrid(pts, 1)) continue;
      const a = Math.abs(area2(pts));
      if (a < 10 || a > 36) continue;
      let okL = true; for (let i = 0; i < 3; i++) if (len(sub(pts[i], pts[(i + 1) % 3])) < 2) okL = false;
      if (!okL) continue;
      if ([0, 1, 2].some(i => angleAt(pts, i) < 25)) continue;
      if (area2(pts) < 0) pts.reverse();
      const s = R.int(0, 2); pts = pts.slice(s).concat(pts.slice(0, s));
      return pts;
    }
    return [P(3, 3), P(7, 4), P(4, 7)];
  }
  function randQuad(R) {
    for (let t = 0; t < 4000; t++) {
      const c = P(R.int(3, W - 3), R.int(3, H - 3));
      let pts = [45, 135, 225, 315].map(b => {
        const ang = (b + R.int(-28, 28)) * Math.PI / 180, r = R.int(20, 38) / 10;
        return P(Math.round(c.x + r * Math.cos(ang)), Math.round(c.y + r * Math.sin(ang)));
      });
      if (!inGrid(pts, 1)) continue;
      let conv = true;
      for (let i = 0; i < 4; i++) if (cross(sub(pts[(i + 1) % 4], pts[i]), sub(pts[(i + 2) % 4], pts[(i + 1) % 4])) <= 0) conv = false;
      if (!conv) continue;
      const e = [0, 1, 2, 3].map(i => sub(pts[(i + 1) % 4], pts[i]));
      if (e.some(v => len(v) < 2)) continue;
      const sinMin = Math.sin(10 * Math.PI / 180);
      if (Math.abs(cross(e[0], e[2])) / (len(e[0]) * len(e[2])) < sinMin) continue;
      if (Math.abs(cross(e[1], e[3])) / (len(e[1]) * len(e[3])) < sinMin) continue;
      if ([0, 1, 2, 3].some(i => { const a = angleAt(pts, i); return a < 40 || a > 150; })) continue;
      if (area2(pts) < 16) continue;
      const s = R.int(0, 3); pts = pts.slice(s).concat(pts.slice(0, s));
      return pts;
    }
    return [P(3, 3), P(7, 2), P(8, 6), P(4, 7)];
  }

  /* ---------- Dibujo sobre la cuadrícula (y hacia arriba) ---------- */
  const GR = '#9a9a9a', ORIG = '#ececec', IMG = '#bdbdbd';
  const vecTxt = v => `(${fmt(v.x)}, ${fmt(v.y)})`;
  const vecTex = v => `(${v.x < 0 ? '-' : ''}${Math.abs(v.x)}, ${v.y < 0 ? '-' : ''}${Math.abs(v.y)})`;
  const cuadros = k => `${Math.abs(k)} cuadro${Math.abs(k) > 1 ? 's' : ''}`;
  function describeVec(v) {
    const p = [];
    if (v.x) p.push(`${cuadros(v.x)} a la ${v.x > 0 ? 'derecha' : 'izquierda'}`);
    if (v.y) p.push(`${cuadros(v.y)} hacia ${v.y > 0 ? 'arriba' : 'abajo'}`);
    return p.join(' y ') || 'ningún cuadro';
  }
  const angTxt = a => Math.abs(a) === 180 ? '180°' : a > 0 ? `+${a}° (sentido contrario a las agujas del reloj)` : `−${-a}° (sentido de las agujas del reloj)`;
  const angTex = a => Math.abs(a) === 180 ? '180^\\circ' : `${a > 0 ? '+' : '-'}${Math.abs(a)}^\\circ`;
  const sentido = a => a > 0 ? 'antihorario' : 'horario';

  function Escena() {
    const L = Lienzo();
    const X = x => x * CELL, Y = y => (H - y) * CELL;
    for (let i = 1; i < W; i++) L.linea(X(i), Y(0), X(i), Y(H), { trazo: '#b4b4b4', grosor: 0.5 });
    for (let j = 1; j < H; j++) L.linea(X(0), Y(j), X(W), Y(j), { trazo: '#b4b4b4', grosor: 0.5 });
    [[0, 0, W, 0], [W, 0, W, H], [W, H, 0, H], [0, H, 0, 0]].forEach(([a, b, c, d]) => L.linea(X(a), Y(b), X(c), Y(d), { trazo: '#555', grosor: 1 }));
    const E = {
      L, X, Y,
      pol(pts, relleno = ORIG, grosor = 1.6) { L.poligono(pts.map(p => [X(p.x), Y(p.y)]), { relleno, grosor }); return E; },
      seg(a, b, op = {}) { L.linea(X(a.x), Y(a.y), X(b.x), Y(b.y), Object.assign({ grosor: 1, trazo: '#333' }, op)); return E; },
      /* Rótulos de vértices, hacia fuera del centroide (rot en grados para esquivar otros trazos) */
      nom(pts, nm, rot = 0) {
        const c = centroid(pts), r = rot * Math.PI / 180;
        pts.forEach((p, i) => {
          let v = sub(P(X(p.x), Y(p.y)), P(X(c.x), Y(c.y))); const l = len(v); v = l < 1 ? P(0, -1) : mul(v, 1 / l);
          const w = P(v.x * Math.cos(r) - v.y * Math.sin(r), v.x * Math.sin(r) + v.y * Math.cos(r));
          L.texto(X(p.x) + w.x * 12, Y(p.y) + w.y * 12 + 4, nm[i], { tam: 13, cursiva: true });
        });
        return E;
      },
      flecha(a, b, op = {}) {
        E.seg(a, b, op);
        const ax = X(a.x), ay = Y(a.y), bx = X(b.x), by = Y(b.y), l = Math.hypot(bx - ax, by - ay);
        if (l < 1) return E;
        const ux = (bx - ax) / l, uy = (by - ay) / l, n = op.nx === undefined ? 1 : 1;
        [[1], [-1]].forEach(([sg]) => L.linea(bx, by, bx - ux * 8 - sg * uy * 3.6 * n, by - uy * 8 + sg * ux * 3.6 * n, { grosor: op.grosor || 1, trazo: op.trazo || '#333' }));
        return E;
      },
      pto(p, nombre, dx = 9, dy = -8, r = 3.4) {
        L.punto(X(p.x), Y(p.y), r);
        if (nombre) L.texto(X(p.x) + dx, Y(p.y) + dy, nombre, { tam: 14, cursiva: true, ancla: dx < 0 ? 'end' : 'start' });
        return E;
      },
      /* Arco en O desde th0 (grados) barriendo a grados, con punta de flecha y rótulo opcional */
      arco(O, th0, a, r, etiqueta) {
        const n = Math.max(6, Math.ceil(Math.abs(a) / 8)), pt = k => { const t = (th0 + a * k / n) * Math.PI / 180; return [X(O.x) + r * Math.cos(t), Y(O.y) - r * Math.sin(t)]; };
        let q = pt(0);
        for (let k = 1; k <= n; k++) { const s = pt(k); L.linea(q[0], q[1], s[0], s[1], { grosor: 1.2 }); q = s; }
        const e = pt(n), p = pt(n - 1), l = Math.hypot(e[0] - p[0], e[1] - p[1]) || 1, ux = (e[0] - p[0]) / l, uy = (e[1] - p[1]) / l;
        [1, -1].forEach(sg => L.linea(e[0], e[1], e[0] - ux * 7 - sg * uy * 3.4, e[1] - uy * 7 + sg * ux * 3.4, { grosor: 1.2 }));
        if (etiqueta) { const tm = (th0 + a / 2) * Math.PI / 180, rr = r + 11; L.texto(X(O.x) + rr * Math.cos(tm), Y(O.y) - rr * Math.sin(tm) + 4, etiqueta, { tam: 12 }); }
        return E;
      },
      eje(Lr, nombre = 'e') {
        const sg = clipLine(Lr.P, Lr.d); if (!sg) return E;
        E.seg(sg[0], sg[1], { grosor: 1.6, trazo: '#1a1a1a' });
        const a = P(X(sg[0].x), Y(sg[0].y)), b = P(X(sg[1].x), Y(sg[1].y)), u = mul(sub(b, a), 1 / len(sub(b, a)));
        L.texto(b.x - u.x * 14 + (-u.y) * 12, b.y - u.y * 14 + u.x * 12 + 4, nombre, { tam: 14, cursiva: true });
        return E;
      },
      cerrar(etiqueta) { return L.cerrar('pend-fig', etiqueta); }
    };
    return E;
  }
  const bloque = (svg, texto = '') => `<div class="pend-col">${texto ? `<span class="pend-texto">${texto}</span>` : ''}${svg}</div>`;
  const RES_FIG = '\\text{figura dibujada}';

  /* ---------- Colocación de un vector libre sin que corte las figuras ---------- */
  function placeVector(R, v, polys) {
    const cands = [];
    for (let x = 1; x <= W - 1; x++) for (let y = 1; y <= H - 1; y++) {
      const S = P(x, y), E = add(S, v);
      if (inGrid([S, E], 1)) cands.push(S);
    }
    for (const S of R.shuffle(cands)) {
      const E = add(S, v);
      if (polys.every(pl => polyDist([S, E], pl) >= 1.4)) return S;
    }
    return null;
  }
  function genEjeYFigura(R, fig) {
    for (let t = 0; t < 4000; t++) {
      const f = fig(R), type = R.pick(['v', 'h', 'd1', 'd2']);
      let k;
      if (type === 'v') k = R.int(3, W - 3); else if (type === 'h') k = R.int(3, H - 3);
      else if (type === 'd1') k = R.int(-(W - 6), H - 6); else k = R.int(6, W + H - 6);
      const Ln = mkLine(type, k), seg = clipLine(Ln.P, Ln.d);
      if (!seg || len(sub(seg[1], seg[0])) < 8) continue;
      const sides = f.map(p => lineSide(Ln, p));
      if (!(sides.every(s => s > 0) || sides.every(s => s < 0))) continue;
      if (Math.min(...sides.map(s => Math.abs(s) / len(Ln.d))) < 1) continue;
      const img = f.map(reflect(Ln));
      if (!inGrid(img, 1) || polyDist(f, img) < 1) continue;
      return { f, L: Ln, img };
    }
    return null;
  }
  const FALLBACK_AXIS = () => { const L = mkLine('v', 9), f = [P(3, 3), P(7, 4), P(4, 7)]; return { f, L, img: f.map(reflect(L)) }; };

  /* ================= 1. Traslación ================= */
  function traslacion(R) {
    let o, v, t, S;
    for (let i = 0; i < 3000; i++) {
      const tri = randTri(R); v = P(R.int(-7, 7), R.int(-5, 5));
      if (Math.abs(v.x) + Math.abs(v.y) < 4) continue;
      const img = tri.map(tras(v));
      if (!inGrid(img, 1) || polyDist(tri, img) < 1) continue;
      S = placeVector(R, v, [tri, img]); if (!S) continue;
      o = tri; t = img; break;
    }
    if (!o) { o = [P(3, 3), P(7, 4), P(4, 7)]; v = P(6, -2); t = o.map(tras(v)); S = P(2, 10); }
    const base = () => { const e = Escena().pol(o).nom(o, nombres(3)).flecha(S, add(S, v), { grosor: 1.8 }).pto(S, '', 0, 0, 2.6);
      const ax = e.X(S.x), ay = e.Y(S.y), bx = e.X(S.x + v.x), by = e.Y(S.y + v.y), l = Math.hypot(bx - ax, by - ay);
      let nx = -(by - ay) / l, ny = (bx - ax) / l; if (ny > 0) { nx = -nx; ny = -ny; }
      e.L.texto((ax + bx) / 2 + nx * 11, (ay + by) / 2 + ny * 11 + 4, 'v', { tam: 14, cursiva: true }); return e; };
    const sol = base().pol(t, IMG).nom(t, nombres(3, true));
    o.forEach((p, i) => sol.flecha(p, t[i], { trazo: '#666', discontinua: true, grosor: 0.9 }));
    return {
      html: true,
      enun: bloque(base().cerrar('Triángulo ABC y vector v sobre una cuadrícula')),
      pasos: [
        { t: 'Leemos las componentes del vector contando cuadros de su origen a su extremo:', m: `\\vec v = ${vecTex(v)} \\quad\\Rightarrow\\quad \\text{${describeVec(v)}}` },
        { t: 'En una traslación todos los puntos se desplazan igual. Movemos A, B y C según \\(\\vec v\\) y unimos los vértices: la figura conserva forma, tamaño y orientación.' }
      ],
      res: RES_FIG, resHtml: sol.cerrar('Triángulo trasladado A′B′C′')
    };
  }

  /* ================= 2. Giro ================= */
  function giro(R) {
    let q, O, a, img;
    for (let i = 0; i < 3000; i++) {
      q = randQuad(R); O = P(R.int(2, W - 2), R.int(2, H - 2));
      if (distPtPoly(O, q) < 2) continue;
      a = R.pick([90, -90, 180]); img = q.map(rot(O, a));
      if (!inGrid(img, 1) || polyDist(q, img) < 1 || distPtPoly(O, img) < 2) continue;
      break;
    }
    const v = sub(O, centroid(q)), th0 = Math.atan2(-v.y, -v.x) * 180 / Math.PI;     // desde O hacia la figura
    const base = () => Escena().pol(q).nom(q, nombres(4)).pto(O, 'O');
    const A = q[0], d = sub(A, O), d2 = sub(img[0], O);
    const regla = norm360(a) === 90 ? '(x, y) \\to (-y, x)' : norm360(a) === 270 ? '(x, y) \\to (y, -x)' : '(x, y) \\to (-x, -y)';
    const sol = base().pol(img, IMG).nom(img, nombres(4, true)).seg(O, A, { discontinua: true }).seg(O, img[0], { discontinua: true });
    const th = Math.atan2(d.y, d.x) * 180 / Math.PI;
    sol.arco(O, th, a, Math.min(24, 0.5 * len(d) * CELL));
    return {
      html: true,
      enun: bloque(base().cerrar('Cuadrilátero ABCD y centro de giro O'), `Giro de centro <b>O</b> y ángulo <b>α = ${angTxt(a)}</b>.`),
      pasos: [
        { t: `Tomamos O como origen y medimos cada vértice respecto de O, contando cuadros. Con un giro de \\(${angTex(a)}\\) cada desplazamiento \\((x, y)\\) se convierte en lo siguiente:`, m: regla },
        { t: 'Por ejemplo, de O a A hay ' + vecTxt(d) + ' cuadros, así que de O a A′ hay ' + vecTxt(d2) + '. Hacemos lo mismo con B, C y D (cada vértice queda a la misma distancia de O que antes) y unimos los vértices.', m: `\\overrightarrow{OA} = ${vecTex(d)} \\quad\\to\\quad \\overrightarrow{OA'} = ${vecTex(d2)}` }
      ],
      res: RES_FIG, resHtml: sol.cerrar('Cuadrilátero girado A′B′C′D′')
    };
  }

  /* ================= 3. Ángulo de giro ================= */
  const ANG3 = [45, 60, 90, 120, 135, 180, -45, -60, -90, -120, -135];
  function anguloGiro(R) {
    let f, O, a, img;
    for (let i = 0; i < 3000; i++) {
      f = R.rand() < 0.5 ? randTri(R) : randQuad(R); O = P(R.int(1, W - 1), R.int(1, H - 1));
      if (distPtPoly(O, f) < 2) continue;
      a = R.pick(ANG3); img = f.map(rot(O, a));
      if (!inGrid(img, 0.8) || polyDist(f, img) < 1 || distPtPoly(O, img) < 2) continue;
      break;
    }
    if (!img) { f = [P(3, 3), P(7, 4), P(4, 7)]; O = P(10, 6); a = 90; img = f.map(rot(O, a)); }
    const n = f.length;
    const base = () => Escena().pol(f).nom(f, nombres(n)).pol(img, IMG).nom(img, nombres(n, true)).pto(O, 'O');
    const A = f[0], d = sub(A, O), th = Math.atan2(d.y, d.x) * 180 / Math.PI;
    const sol = base().seg(O, A, { discontinua: true }).seg(O, img[0], { discontinua: true }).arco(O, th, a, Math.min(30, 0.5 * len(d) * CELL));
    return {
      html: true,
      enun: bloque(base().cerrar('Figura, su imagen girada y el centro O'),
        `${nombres(n, true).join('')} es la imagen de ${nombres(n).join('')} en un giro de centro <b>O</b>. Ángulo de giro: α = ………………`),
      pasos: [
        { t: 'Unimos O con un vértice (A) y con su imagen (A′). El ángulo \\(\\widehat{AOA\'}\\) es el ángulo de giro; lo medimos con el transportador (o contamos cuadros si es un ángulo notable):', m: `\\widehat{AOA'} = ${Math.abs(a)}^\\circ` },
        { t: `Para ir de A a A′ alrededor de O se avanza en sentido ${a > 0 ? 'contrario a las agujas del reloj, así que el giro es positivo' : 'de las agujas del reloj, así que el giro es negativo'}${Math.abs(a) === 180 ? ' (con 180° el sentido es indiferente)' : ''}.` }
      ],
      res: `\\alpha = ${angTex(a)}${Math.abs(a) === 180 ? '' : `\\ \\text{(${sentido(a)})}`}`,
      resHtml: undefined, _sol: sol
    };
  }

  /* ================= 4. Simetría axial ================= */
  function simAxial(R) {
    const r = genEjeYFigura(R, randTri) || FALLBACK_AXIS();
    const { f, L: Ln, img } = r;
    const base = () => Escena().eje(Ln).pol(f).nom(f, nombres(3));
    const sol = base().pol(img, IMG).nom(img, nombres(3, true));
    f.forEach((p, i) => { sol.seg(p, img[i], { discontinua: true, trazo: '#666', grosor: 0.9 }); const m = mul(add(p, img[i]), 0.5); sol.L.punto(sol.X(m.x), sol.Y(m.y), 2); });
    const A = f[0]; let ej;
    if (Ln.type === 'v') { const d = A.x - Ln.k; ej = `A está a ${cuadros(d)} a la ${d < 0 ? 'izquierda' : 'derecha'} del eje, así que A′ está a ${cuadros(d)} a la ${d < 0 ? 'derecha' : 'izquierda'}, en la misma horizontal.`; }
    else if (Ln.type === 'h') { const d = A.y - Ln.k; ej = `A está a ${cuadros(d)} por ${d > 0 ? 'encima' : 'debajo'} del eje, así que A′ está a ${cuadros(d)} por ${d > 0 ? 'debajo' : 'encima'}, en la misma vertical.`; }
    else ej = 'Con un eje en diagonal, la perpendicular al eje también va en diagonal: desde cada vértice avanzamos en diagonal hasta el eje y seguimos la misma distancia al otro lado.';
    return {
      html: true,
      enun: bloque(base().cerrar('Triángulo ABC y eje de simetría e')),
      pasos: [
        { t: 'En una simetría axial, cada punto P y su simétrico P′ están en una misma perpendicular al eje y a la misma distancia de él (el eje es la mediatriz de PP′).' },
        { t: ej + ' Repetimos con B y C y unimos los vértices: la figura queda «invertida», como en un espejo.' }
      ],
      res: RES_FIG, resHtml: sol.cerrar('Triángulo simétrico A′B′C′')
    };
  }

  /* ================= 5. Eje de simetría ================= */
  function ejeSimetria(R) {
    const r = genEjeYFigura(R, R.rand() < 0.5 ? randTri : randQuad) || FALLBACK_AXIS();
    const { f, L: Ln, img } = r, n = f.length;
    const base = () => Escena().pol(f).nom(f, nombres(n)).pol(img, IMG).nom(img, nombres(n, true));
    const sol = base().eje(Ln);
    f.forEach((p, i) => { sol.seg(p, img[i], { discontinua: true, trazo: '#666', grosor: 0.9 }); const m = mul(add(p, img[i]), 0.5); sol.L.punto(sol.X(m.x), sol.Y(m.y), 2); });
    return {
      html: true,
      enun: bloque(base().cerrar('Dos figuras simétricas respecto de una recta')),
      pasos: [
        { t: 'El eje de simetría es la mediatriz de cualquier segmento que une un punto con su simétrico: pasa por su punto medio y es perpendicular a él.' },
        { t: 'Unimos A con A′ y B con B′, marcamos sus puntos medios y trazamos la recta que pasa por ellos: es el eje.' }
      ],
      res: RES_FIG, resHtml: sol.cerrar('Eje de simetría trazado')
    };
  }

  /* ================= 6. Simetría central ================= */
  function simCentral(R) {
    let q, O, img;
    for (let i = 0; i < 3000; i++) {
      q = randQuad(R); O = P(R.int(1, W - 1), R.int(1, H - 1));
      if (distPtPoly(O, q) < 2) continue;
      img = q.map(central(O));
      if (!inGrid(img, 1) || polyDist(q, img) < 1) continue;
      break;
    }
    if (!img) { q = [P(3, 3), P(7, 2), P(8, 6), P(4, 7)]; O = P(10, 6); img = q.map(central(O)); }
    const base = () => Escena().pol(q).nom(q, nombres(4)).pto(O, 'O');
    const sol = base().pol(img, IMG).nom(img, nombres(4, true));
    q.forEach((p, i) => sol.seg(p, img[i], { discontinua: true, trazo: '#666', grosor: 0.9 }));
    const d = sub(O, q[0]);
    return {
      html: true,
      enun: bloque(base().cerrar('Cuadrilátero ABCD y centro de simetría O')),
      pasos: [
        { t: 'En la simetría central de centro O, el punto O es el punto medio de cada segmento PP′: P′ está al otro lado de O, en la misma recta y a la misma distancia.' },
        { t: `De A a O hay ${vecTxt(d)} cuadros, así que de O a A′ hay otra vez ${vecTxt(d)}. Hacemos lo mismo con B, C y D y unimos los vértices (equivale a un giro de 180° alrededor de O).`, m: `\\overrightarrow{AO} = \\overrightarrow{OA'} = ${vecTex(d)}` }
      ],
      res: RES_FIG, resHtml: sol.cerrar('Cuadrilátero simétrico A′B′C′D′')
    };
  }

  /* ================= 7. Centro de simetría ================= */
  function centroSimetria(R) {
    let q, O, img;
    for (let i = 0; i < 3000; i++) {
      q = randQuad(R); O = P(R.int(2, W - 2), R.int(2, H - 2));
      if (distPtPoly(O, q) < 1.5) continue;
      img = q.map(central(O));
      if (!inGrid(img, 1) || polyDist(q, img) < 1) continue;
      break;
    }
    if (!img) { q = [P(3, 3), P(7, 2), P(8, 6), P(4, 7)]; O = P(11, 6); img = q.map(central(O)); }
    const base = () => Escena().pol(q).nom(q, nombres(4)).pol(img, IMG).nom(img, nombres(4, true));
    const sol = base();
    q.forEach((p, i) => sol.seg(p, img[i], { discontinua: true, trazo: '#666', grosor: 0.9 }));
    sol.pto(O, 'O', 9, -8);
    return {
      html: true,
      enun: bloque(base().cerrar('Dos figuras simétricas respecto de un punto')),
      pasos: [
        { t: 'El centro de simetría es el punto medio común de todos los segmentos que unen cada punto con su simétrico.' },
        { t: 'Unimos A con A′ y C con C′ (también valen B con B′ y D con D′): los segmentos se cortan en su punto medio, que es el centro O.' }
      ],
      res: RES_FIG, resHtml: sol.cerrar('Centro de simetría O')
    };
  }

  /* El ángulo de giro lleva su figura de solución como paso */
  const conPasoFigura = f => (R, i) => {
    const r = f(R, i);
    if (r._sol) { r.pasos.splice(1, 0, { t: 'Dibujamos los radios OA y OA′ y el arco que marca el giro:', html: r._sol.cerrar('Radios OA y OA′ y arco del giro') }); delete r._sol; }
    delete r.resHtml;
    return r;
  };

  const tipo = (id, nombre, generar, enun, peso = 1) => ({ id, nombre, peso, columnas: 1, enunciado: enun, generar });
  registrarFicha({
    id: 'pend3-movimientos',
    titulo: 'Movimientos en el plano',
    detalle: '3.º ESO',
    grupo: 'Recuperación de 3.º ESO',
    enlace: '../pendientes/tercero/movimientos-3.html',
    ejercicios: [
      tipo('traslacion', 'Traslación (dibujar la figura trasladada)', traslacion, ['Dibuja el triángulo trasladado según el vector \\(\\vec v\\):', 'Dibuja, en cada caso, el triángulo trasladado según el vector \\(\\vec v\\):']),
      tipo('giro', 'Giro (dibujar la figura girada)', giro, ['Dibuja la figura que se obtiene al girarla alrededor de O con el ángulo indicado:', 'Dibuja, en cada caso, la figura que se obtiene al girarla alrededor de O con el ángulo indicado:']),
      tipo('angulo', 'Ángulo de giro (determinarlo)', conPasoFigura(anguloGiro), ['Determina el ángulo de giro (positivo si es contrario a las agujas del reloj, negativo si es en su sentido):', 'Determina, en cada caso, el ángulo de giro (positivo si es contrario a las agujas del reloj, negativo si es en su sentido):']),
      tipo('axial', 'Simetría axial (dibujar la figura simétrica)', simAxial, ['Dibuja el triángulo simétrico respecto de la recta \\(e\\):', 'Dibuja, en cada caso, el triángulo simétrico respecto de la recta \\(e\\):']),
      tipo('eje', 'Eje de simetría (trazarlo)', ejeSimetria, ['Las dos figuras son simétricas respecto de una recta. Dibuja el eje de simetría:', 'Cada pareja de figuras es simétrica respecto de una recta. Dibuja el eje de simetría:']),
      tipo('central', 'Simetría central (dibujar la figura simétrica)', simCentral, ['Dibuja la figura simétrica de ABCD respecto del punto O (simetría central):', 'Dibuja, en cada caso, la figura simétrica de ABCD respecto del punto O (simetría central):']),
      tipo('centro', 'Centro de simetría (marcarlo)', centroSimetria, ['Las dos figuras son simétricas respecto de un punto. Marca el centro de simetría y llámalo O:', 'Cada pareja de figuras es simétrica respecto de un punto. Marca el centro de simetría y llámalo O:'])
    ]
  });
})();
