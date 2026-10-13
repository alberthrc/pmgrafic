/* ================= TEXTURAS (diseños de marcas de ejemplo) ================= */
const BRANDS = [
  { name:"CAFÉ ÁVILA", tag:"Tostado en Caracas", bg:"#2b1d16", fg:"#f3e6d3", ac:"#e8a33d" },
  { name:"DENTAL+", tag:"Clínica odontológica", bg:"#eaf4f7", fg:"#0b3a4a", ac:"#00a6e2" },
  { name:"TROPIKAL", tag:"Jugos naturales", bg:"#ffe100", fg:"#1a1a1a", ac:"#ec008c" },
  { name:"NORTE", tag:"Ferretería", bg:"#16181d", fg:"#f2f1ec", ac:"#ffe100" },
  { name:"LUZ", tag:"Panadería artesanal", bg:"#f6efe4", fg:"#3a2a1c", ac:"#d6452f" }
];
const DISP = '"Bricolage Grotesque", "Arial Narrow", sans-serif', BODY = '"Familjen Grotesk", system-ui, sans-serif', MONO = '"IBM Plex Mono", monospace';
function cv(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; }
function fitText(ctx, text, maxW, size, font, weight) {
  let s = size; do { ctx.font = `${weight || 800} ${s}px ${font}`; s -= 2; } while (ctx.measureText(text).width > maxW && s > 8); return s + 2;
}
function paintCard(b, w = 720, h = 400, back) {
  const [c, x] = cv(w, h);
  x.fillStyle = back ? b.ac : b.bg; x.fillRect(0, 0, w, h);
  if (back) { x.fillStyle = b.bg; x.beginPath(); x.arc(w / 2, h / 2, h * .22, 0, 7); x.fill(); x.fillStyle = b.ac; x.font = `800 ${h * .16}px ${DISP}`; x.textAlign = "center"; x.fillText(b.name[0], w / 2, h / 2 + h * .06); return c; }
  x.fillStyle = b.ac; x.beginPath(); x.arc(h * .26, h * .3, h * .12, 0, 7); x.fill();
  x.fillStyle = b.fg; fitText(x, b.name, w * .55, h * .16, DISP); x.fillText(b.name, h * .46, h * .35);
  x.globalAlpha = .7; x.font = `500 ${h * .07}px ${BODY}`; x.fillText(b.tag, h * .46, h * .46); x.globalAlpha = 1;
  x.font = `400 ${h * .055}px ${MONO}`; x.globalAlpha = .8;
  ["María Fernández · Gerente", "+58 412 000 0000", "hola@marca.com.ve"].forEach((t, i) => x.fillText(t, h * .14, h * (.7 + i * .09)));
  x.globalAlpha = 1; x.fillStyle = b.ac; x.fillRect(w - h * .06, 0, h * .06, h);
  return c;
}
function paintPoster(b, w = 600, h = 848, kind) {
  const [c, x] = cv(w, h);
  const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, b.bg); g.addColorStop(1, shade(b.bg, -18)); x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.fillStyle = b.ac; x.beginPath(); x.arc(w * .62, h * .36, w * .34, 0, 7); x.fill();
  x.fillStyle = shade(b.ac, 30); x.beginPath(); x.arc(w * .3, h * .5, w * .16, 0, 7); x.fill();
  x.strokeStyle = b.fg; x.globalAlpha = .25; x.lineWidth = 2; for (let i = 0; i < 9; i++) { x.beginPath(); x.moveTo(0, h * .62 + i * 14); x.lineTo(w, h * .52 + i * 14); x.stroke(); } x.globalAlpha = 1;
  x.fillStyle = b.fg; x.textAlign = "left";
  const s = fitText(x, b.name, w * .86, w * .2, DISP); x.fillText(b.name, w * .07, h * .78);
  x.font = `600 ${w * .05}px ${BODY}`; x.fillText(kind || b.tag, w * .07, h * .78 + s * .7);
  x.font = `400 ${w * .03}px ${MONO}`; x.globalAlpha = .7; x.fillText("CARACAS · 2026", w * .07, h * .95); x.globalAlpha = 1;
  return c;
}
function paintDoc(type, w = 600, h = 780) {
  const [c, x] = cv(w, h);
  x.fillStyle = type === "copy" ? "#fdf3c8" : "#fbfaf6"; x.fillRect(0, 0, w, h);
  const b = BRANDS[type === "recipe" ? 1 : type === "pad" ? 0 : 3];
  x.fillStyle = b.ac; x.fillRect(0, 0, w, 10);
  x.fillStyle = "#1a1b20"; x.font = `800 ${w * .06}px ${DISP}`; x.fillText(type === "recipe" ? "Dra. Ana Rojas" : b.name, w * .07, h * .1);
  x.font = `400 ${w * .024}px ${MONO}`; x.fillStyle = "#55575f";
  x.fillText(type === "recipe" ? "ODONTÓLOGA · MPPS 00000 · COV 0000" : "RIF J-00000000-0 · AV. PRINCIPAL, CARACAS", w * .07, h * .14);
  if (type === "invoice" || type === "copy") {
    x.fillStyle = "#1a1b20"; x.font = `700 ${w * .04}px ${BODY}`; x.textAlign = "right"; x.fillText("FACTURA", w * .93, h * .09);
    x.fillStyle = "#c8102e"; x.font = `500 ${w * .03}px ${MONO}`; x.fillText("N° 000124", w * .93, h * .13); x.fillText("N° DE CONTROL 00-000124", w * .93, h * .165); x.textAlign = "left";
    x.strokeStyle = "#b9bac0"; x.lineWidth = 1.2; x.strokeRect(w * .07, h * .22, w * .86, h * .1);
    x.fillStyle = "#d9dbe2"; x.fillRect(w * .07, h * .35, w * .86, h * .045);
    for (let i = 0; i < 9; i++) { x.beginPath(); x.moveTo(w * .07, h * (.395 + i * .045)); x.lineTo(w * .93, h * (.395 + i * .045)); x.stroke(); }
    [.2, .62, .78].forEach(f => { x.beginPath(); x.moveTo(w * f, h * .35); x.lineTo(w * f, h * .8); x.stroke(); });
    x.strokeRect(w * .62, h * .82, w * .31, h * .1);
    x.font = `400 ${w * .018}px ${MONO}`; x.fillStyle = "#55575f"; x.fillText("IMPRENTA AUTORIZADA · PROVIDENCIA SENIAT · CONTROL DESDE 00-000101 HASTA 00-000150", w * .07, h * .96);
  } else if (type === "recipe") {
    x.fillStyle = "#1a1b20"; x.font = `700 ${w * .08}px ${DISP}`; x.fillText("Rp/", w * .07, h * .3);
    x.strokeStyle = "#c9ccd4"; for (let i = 0; i < 9; i++) { x.beginPath(); x.moveTo(w * .07, h * (.38 + i * .06)); x.lineTo(w * .93, h * (.38 + i * .06)); x.stroke(); }
    x.fillStyle = b.ac; x.globalAlpha = .12; x.beginPath(); x.arc(w * .75, h * .62, w * .22, 0, 7); x.fill(); x.globalAlpha = 1;
    x.font = `500 ${w * .022}px ${MONO}`; x.fillStyle = "#55575f"; x.fillText("N° 000318 · FECHA ___/___/______", w * .07, h * .95);
  } else if (type === "pad") {
    x.fillStyle = "#1a1b20"; x.font = `700 ${w * .05}px ${BODY}`; x.fillText("COMANDA", w * .07, h * .25);
    x.fillStyle = "#c8102e"; x.font = `500 ${w * .045}px ${MONO}`; x.textAlign = "right"; x.fillText("N° 0451", w * .93, h * .25); x.textAlign = "left";
    x.strokeStyle = "#c9ccd4"; for (let i = 0; i < 10; i++) { x.beginPath(); x.moveTo(w * .07, h * (.32 + i * .06)); x.lineTo(w * .93, h * (.32 + i * .06)); x.stroke(); }
    x.font = `400 ${w * .025}px ${MONO}`; x.fillStyle = "#55575f"; x.fillText("MESA ____   MESONERO ________", w * .07, h * .96);
  } else {
    x.strokeStyle = "#d4d6dc"; for (let i = 0; i < 14; i++) { x.beginPath(); x.moveTo(w * .07, h * (.24 + i * .045)); x.lineTo(w * (i % 4 === 3 ? .6 : .93), h * (.24 + i * .045)); x.stroke(); }
    x.fillStyle = b.ac; x.fillRect(w * .07, h * .9, w * .86, 3);
  }
  return c;
}
function paintLabels(w = 600, h = 848) {
  const [c, x] = cv(w, h); x.fillStyle = "#f4f4f1"; x.fillRect(0, 0, w, h);
  const r = w * .13; let k = 0;
  for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) {
    const b = BRANDS[(k++) % BRANDS.length], cx = w * (.2 + i * .3), cy = h * (.14 + j * .24);
    x.fillStyle = b.bg; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    x.strokeStyle = b.ac; x.lineWidth = 4; x.beginPath(); x.arc(cx, cy, r * .8, 0, 7); x.stroke();
    x.fillStyle = b.fg; x.textAlign = "center"; fitText(x, b.name, r * 1.4, r * .36, DISP); x.fillText(b.name, cx, cy + r * .12);
  }
  return c;
}
function paintSticker(b, s = 400) {
  const [c, x] = cv(s, s); x.fillStyle = "#ffffff"; x.fillRect(0, 0, s, s);
  x.fillStyle = b.bg; x.beginPath(); x.arc(s / 2, s / 2, s * .44, 0, 7); x.fill();
  x.fillStyle = b.ac; x.beginPath(); x.arc(s / 2, s * .4, s * .16, 0, 7); x.fill();
  x.fillStyle = b.fg; x.textAlign = "center"; fitText(x, b.name, s * .7, s * .13, DISP); x.fillText(b.name, s / 2, s * .74);
  return c;
}
function paintWrap(b, w = 1024, h = 400, prog = 1) {
  const [c, x] = cv(w, h); x.fillStyle = "#f7f7f4"; x.fillRect(0, 0, w, h);
  x.save(); x.beginPath(); const edge = w * prog;
  x.moveTo(0, 0); for (let y = 0; y <= h; y += 10) x.lineTo(edge + Math.sin(y * .05) * 18, y); x.lineTo(0, h); x.closePath(); x.clip();
  const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, "#00a6e2"); g.addColorStop(.45, "#ec008c"); g.addColorStop(1, "#ffe100");
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.fillStyle = "rgba(255,255,255,.18)"; for (let i = 0; i < 14; i++) { x.beginPath(); x.arc((i * 97) % w, (i * 53) % h, 30 + (i % 4) * 16, 0, 7); x.fill(); }
  x.fillStyle = "#ffffff"; x.textAlign = "center"; x.font = `800 ${h * .22}px ${DISP}`; x.fillText(b.name, w * .3, h * .58);
  x.font = `600 ${h * .08}px ${BODY}`; x.fillText(b.tag, w * .3, h * .74);
  x.restore();
  return c;
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, v + amt));
  return "#" + ((f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).padStart(6, "0");
}
/* separaciones CMYK en semitonos a partir de un lienzo */
function separations(src, cell = 14) {
  const w = src.width, h = src.height, d = src.getContext("2d").getImageData(0, 0, w, h).data;
  const cols = ["#00a6e2", "#ec008c", "#ffe100", "#1a1b20"], offs = [[0, 0], [.5, 0], [0, .5], [.5, .5]];
  return cols.map((col, ch) => {
    const [c, x] = cv(w, h); x.fillStyle = col;
    for (let y = 0; y < h; y += cell) for (let X = 0; X < w; X += cell) {
      const px = Math.min(w - 1, X + cell / 2 | 0), py = Math.min(h - 1, y + cell / 2 | 0), i = (py * w + px) * 4;
      const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, k = 1 - Math.max(r, g, b);
      const v = ch === 3 ? k : k >= 1 ? 0 : ((1 - [r, g, b][ch] - k) / (1 - k));
      if (v < .04) continue;
      x.beginPath(); x.arc(X + cell * (.5 + offs[ch][0] * .3), y + cell * (.5 + offs[ch][1] * .3), Math.sqrt(v) * cell * .62, 0, 7); x.fill();
    }
    return c;
  });
}

/* ================= MODELOS 3D ================= */
const T = () => window.THREE;
function tex(canvas, rend) {
  const t = new (T().CanvasTexture)(canvas); t.encoding = T().sRGBEncoding;
  if (rend) t.anisotropy = Math.min(8, rend.capabilities.getMaxAnisotropy());
  return t;
}
function mat(opt) { return new (T().MeshStandardMaterial)(Object.assign({ roughness: .82, metalness: 0 }, opt)); }
function slab(w, th, d, top, side, bottom) { // caja delgada acostada; cara superior = py
  const s = mat({ color: side || "#f1f0ea" });
  const ms = [s, s, top || s, bottom || s, s, s];
  const m = new (T().Mesh)(new (T().BoxGeometry)(w, th, d), ms); m.castShadow = m.receiveShadow = true; return m;
}
function panel(w, h, th, front, side, back) { // caja delgada de pie; cara frontal = pz
  const s = mat({ color: side || "#f1f0ea" });
  const m = new (T().Mesh)(new (T().BoxGeometry)(w, h, th), [s, s, s, s, front || s, back || s]); m.castShadow = m.receiveShadow = true; return m;
}
function buildModel(kind, R) {
  const TH = T(), g = new TH.Group(), M = c => mat({ map: tex(c, R) });
  const b0 = BRANDS[0], b1 = BRANDS[1], b2 = BRANDS[2], b3 = BRANDS[3], b4 = BRANDS[4];
  if (kind === "cards") {
    for (let i = 0; i < 14; i++) { const s = slab(1.8, .012, 1, i === 13 ? M(paintCard(b3)) : null, "#e9e7df"); s.position.set(i * .002, i * .013, -i * .003); s.rotation.y = .08; g.add(s); }
    const a = slab(1.8, .012, 1, M(paintCard(b3, 720, 400, true))); a.position.set(.9, .02, .8); a.rotation.y = -.35; g.add(a);
    const b = slab(1.8, .012, 1, M(paintCard(b0))); b.position.set(-.7, .02, .9); b.rotation.y = .25; g.add(b);
  } else if (kind === "flyer") {
    [[b2, -.7, .1, .2], [b0, .6, -.2, -.15], [b4, .1, .5, .05]].forEach(([b, x, z, r], i) => { const s = slab(1.5, .01, 2.1, M(paintPoster(b, 600, 848))); s.position.set(x, i * .012, z); s.rotation.y = r; g.add(s); });
  } else if (kind === "letterhead") {
    const s1 = slab(1.7, .01, 2.2, M(paintDoc("letter"))); s1.rotation.y = .12; g.add(s1);
    const s2 = slab(1.7, .01, 2.2, M(paintDoc("letter"))); s2.position.set(.5, -.012, -.3); s2.rotation.y = -.1; g.add(s2);
    const pen = new TH.Mesh(new TH.CylinderGeometry(.035, .035, 1.5, 24), mat({ color: "#1a1b20", roughness: .3, metalness: .4 })); pen.rotation.z = Math.PI / 2; pen.rotation.y = .5; pen.position.set(.3, .05, 1.1); pen.castShadow = true; g.add(pen);
  } else if (kind === "envelope") {
    const e = slab(2.2, .03, 1.1, M(paintCard(b4, 880, 440)), "#f1ece2"); g.add(e);
    const card = slab(1.9, .01, 1, M(paintCard(b0))); card.position.set(.35, .05, -.45); card.rotation.y = .18; g.add(card);
    const e2 = slab(2.2, .03, 1.1, null, "#efe9dd"); e2.position.set(-.3, -.035, .4); e2.rotation.y = -.2; g.add(e2);
  } else if (kind === "folder") {
    const back = slab(1.7, .02, 2.2, null, "#ece9e0"); g.add(back);
    const pivot = new TH.Group(); pivot.position.set(-.85, .03, 0); g.add(pivot);
    const front = slab(1.7, .02, 2.2, M(paintPoster(b3, 600, 776, "Propuesta comercial"))); front.position.x = .85; pivot.add(front); pivot.rotation.z = .5;
    const sheet = slab(1.55, .008, 2.05, M(paintDoc("letter"))); sheet.position.set(.05, .02, .02); g.add(sheet);
  } else if (kind === "trifold") {
    const tx = M(paintPoster(b2, 600, 848, "Menú de temporada"));
    [-1, 0, 1].forEach(i => { const p = panel(.95, 2, .012, i === 0 ? tx : mat({ color: i < 0 ? b2.ac : b2.bg })); p.position.set(i * .86, 1, i === 0 ? .2 : 0); p.rotation.y = i * -.45; g.add(p); });
  } else if (kind === "catalog" || kind === "book") {
    const thick = kind === "book" ? .22 : .05;
    const a = slab(1.6, thick, 2.1, M(paintPoster(kind === "book" ? b0 : b1, 600, 788, kind === "book" ? "Recetario" : "Catálogo 2026")), "#f3f1ea"); a.position.y = thick + .01; a.rotation.y = .18; g.add(a);
    const b = slab(1.6, thick, 2.1, M(paintPoster(b4, 600, 788, "Catálogo 2026")), "#f3f1ea"); b.position.set(.35, 0, -.25); b.rotation.y = -.12; g.add(b);
    if (kind === "book") { const st = panel(1.4, 1.9, .2, M(paintPoster(b3, 600, 814, "Novela")), "#efede6"); st.position.set(-1.25, .95, -.5); st.rotation.y = .5; g.add(st); }
  } else if (kind === "invoice" || kind === "pad" || kind === "recipe") {
    const docT = kind === "invoice" ? "invoice" : kind === "pad" ? "pad" : "recipe", w = kind === "pad" ? 1.2 : 1.7, d = kind === "pad" ? 1.6 : 2.2;
    const stack = slab(w, .3, d, M(paintDoc(docT)), "#f3f0e4"); stack.position.y = .15; g.add(stack);
    const bind = slab(w + .02, .32, .16, null, kind === "invoice" ? "#1d3f8f" : "#1a1b20"); bind.position.set(0, .16, -d / 2 + .08); g.add(bind);
    if (kind === "invoice") { const copy = slab(1.7, .006, 2.2, M(paintDoc("copy")), "#fdf3c8"); copy.position.set(1.15, .003, .45); copy.rotation.y = -.3; g.add(copy); }
  } else if (kind === "banner") {
    const p = panel(1.4, 2.8, .01, M(paintPoster(b2, 500, 1000, "Gran apertura · sábado 10 a. m."))); p.position.y = 1.6; g.add(p);
    [3.02, .2].forEach(y => { const t = new TH.Mesh(new TH.CylinderGeometry(.03, .03, 1.5, 16), mat({ color: "#d8d8d8", metalness: .6, roughness: .3 })); t.rotation.z = Math.PI / 2; t.position.set(0, y, .02); t.castShadow = true; g.add(t); });
    const cord = new TH.Mesh(new TH.TorusGeometry(.75, .006, 6, 40, Math.PI), mat({ color: "#222" })); cord.position.set(0, 3.02, .02); cord.scale.y = .35; g.add(cord);
  } else if (kind === "rollup") {
    const base = slab(1.4, .09, .32, null, "#c8cacf"); base.position.y = .045; g.add(base);
    const p = panel(1.3, 3.1, .01, M(paintPoster(b1, 420, 1000, "Sonrisas que se notan"))); p.position.set(0, 1.64, 0); g.add(p);
  } else if (kind === "sign") {
    const wall = panel(4, 3.4, .1, null, "#3a3d46"); wall.position.set(0, 1.7, -.3); g.add(wall);
    const ac = panel(2.6, 1.2, .06, M(paintCard(b0, 780, 360)), "#d9e6ea"); ac.position.set(0, 1.9, -.12); g.add(ac);
    [[-1.15, .45], [1.15, .45], [-1.15, -.45], [1.15, -.45]].forEach(([x, y]) => { const s = new TH.Mesh(new TH.CylinderGeometry(.04, .04, .18, 16), mat({ color: "#d0d0d0", metalness: .8, roughness: .25 })); s.rotation.x = Math.PI / 2; s.position.set(x, 1.9 + y, -.1); g.add(s); });
  } else if (kind === "labels") {
    const s = slab(1.6, .01, 2.26, M(paintLabels())); s.rotation.y = .1; g.add(s);
    [b2, b0, b1].forEach((b, i) => { const d = new TH.Mesh(new TH.CylinderGeometry(.3, .3, .012, 48), [mat({ color: "#fff" }), M(paintSticker(b)), mat({ color: "#fff" })]); d.position.set(1.05 + i * .15, .02 + i * .013, -.6 + i * .5); d.rotation.y = i; d.castShadow = true; g.add(d); });
  } else if (kind === "sticker") {
    BRANDS.forEach((b, i) => { const d = new TH.Mesh(new TH.CylinderGeometry(.45, .45, .014, 64), [mat({ color: "#fff" }), M(paintSticker(b)), mat({ color: "#fff" })]); const a = i * 1.3; d.position.set(Math.cos(a) * .8, i * .016, Math.sin(a) * .8); d.rotation.y = a; d.castShadow = true; g.add(d); });
  } else if (kind === "box") {
    const kraft = "#c49a6c", logo = M(paintCard({ ...b4, bg: "#c49a6c", fg: "#3a2a1c" }, 600, 400));
    const W = 1.6, H = .7, D = 1.2, t = .025;
    const bot = slab(W, t, D, null, kraft); bot.position.y = t / 2; g.add(bot);
    const f = panel(W, H, t, logo, kraft); f.position.set(0, H / 2, D / 2); g.add(f);
    const bk = panel(W, H, t, null, kraft); bk.position.set(0, H / 2, -D / 2); g.add(bk);
    [-1, 1].forEach(s => { const sd = panel(t, H, D, null, kraft); sd.position.set(s * W / 2, H / 2, 0); g.add(sd); });
    const lidP = new TH.Group(); lidP.position.set(0, H, -D / 2); g.add(lidP);
    const lid = slab(W, t, D, M(paintCard({ ...b4, bg: "#b8885a", fg: "#2a1c10" }, 720, 540)), kraft); lid.position.z = D / 2; lidP.add(lid); lidP.rotation.x = -1.9;
  } else if (kind === "bag") {
    const body = panel(1.3, 1.6, .5, M(paintPoster(b1, 500, 616, "Gracias por tu compra")), "#e9eef0"); body.position.y = .8; g.add(body);
    [-.3, .3].forEach(x => { const h = new TH.Mesh(new TH.TorusGeometry(.2, .018, 8, 24, Math.PI), mat({ color: "#0b3a4a" })); h.position.set(x, 1.6, 0); h.rotation.y = 0; g.add(h); });
  } else if (kind === "mug") {
    const wrap = tex(paintWrap(b2), R); wrap.wrapS = TH.RepeatWrapping;
    const outer = new TH.Mesh(new TH.CylinderGeometry(.55, .5, 1.25, 64, 1, true), mat({ map: wrap, roughness: .35 })); outer.position.y = .63; outer.castShadow = true; g.add(outer);
    const inner = new TH.Mesh(new TH.CylinderGeometry(.51, .47, 1.2, 48, 1, true), mat({ color: "#f3f3f0", side: TH.BackSide, roughness: .3 })); inner.position.y = .66; g.add(inner);
    const bottom = new TH.Mesh(new TH.CircleGeometry(.5, 48), mat({ color: "#e8e8e4" })); bottom.rotation.x = -Math.PI / 2; bottom.position.y = .1; g.add(bottom);
    const rim = new TH.Mesh(new TH.TorusGeometry(.53, .022, 12, 64), mat({ color: "#f7f7f4", roughness: .3 })); rim.rotation.x = Math.PI / 2; rim.position.y = 1.255; g.add(rim);
    const handle = new TH.Mesh(new TH.TorusGeometry(.3, .065, 16, 40, Math.PI), mat({ color: "#f7f7f4", roughness: .3 })); handle.rotation.z = -Math.PI / 2; handle.position.set(.55, .65, 0); handle.castShadow = true; g.add(handle);
    g.rotation.y = -.9; g.userData.wrap = wrap;
  } else if (kind === "tshirt") {
    const s = new TH.Shape(); const P = [[-.5, 1.1], [-.95, .95], [-1.3, .55], [-1.05, .3], [-.78, .5], [-.78, -1.05], [.78, -1.05], [.78, .5], [1.05, .3], [1.3, .55], [.95, .95], [.5, 1.1]];
    s.moveTo(...P[0]); P.slice(1).forEach(p => s.lineTo(...p)); s.quadraticCurveTo(0, .78, -.5, 1.1);
    const shirt = new TH.Mesh(new TH.ExtrudeGeometry(s, { depth: .1, bevelEnabled: true, bevelThickness: .04, bevelSize: .04, bevelSegments: 3 }), mat({ color: "#1b1d22", roughness: .95 }));
    shirt.rotation.x = -Math.PI / 2; shirt.position.y = .07; shirt.castShadow = shirt.receiveShadow = true; g.add(shirt);
    const pr = new TH.Mesh(new TH.PlaneGeometry(.9, .9), mat({ map: tex(paintSticker(b2, 512), R), transparent: true })); pr.rotation.x = -Math.PI / 2; pr.position.set(0, .22, -.2); g.add(pr);
  }
  return g;
}

/* ================= FOTOS DE REFERENCIA (render 3D) ================= */
const REF_BG = { cards:"#262932", flyer:"#2b2620", letterhead:"#d8d6ce", envelope:"#3a2f2a", folder:"#20232b", trifold:"#2e1424", catalog:"#132a33", book:"#2a2117",
  invoice:"#d9dce3", pad:"#2b2620", recipe:"#d3e4ea", banner:"#1b1d24", rollup:"#22262e", sign:"#2b2e36", labels:"#2c2810", sticker:"#2e1424", box:"#3b2c1f", bag:"#d7dde0", mug:"#14262f", tshirt:"#d8d6ce" };
const MODELS_NEEDED = () => [...new Set(PRODUCTS.map(p => p.model).concat(CATS.map(c => c.model)))];
async function renderReferences() {
  const TH = T(); if (!TH) return;
  let R;
  try { R = new TH.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false }); } catch (_) { return; }
  R.setPixelRatio(1); R.setSize(480, 600, false);
  R.outputEncoding = TH.sRGBEncoding; R.toneMapping = TH.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
  R.shadowMap.enabled = true; R.shadowMap.type = TH.PCFSoftShadowMap;
  const cam = new TH.PerspectiveCamera(30, 480 / 600, .1, 100);
  const list = MODELS_NEEDED();
  for (const kind of list) {
    if (IMG[kind]) continue;
    await new Promise(r => setTimeout(r, 30));
    const scene = new TH.Scene(), bg = new TH.Color(REF_BG[kind] || "#23262e");
    scene.background = bg; scene.fog = new TH.Fog(bg, 9, 18);
    scene.add(new TH.HemisphereLight(0xffffff, 0x404048, .75));
    const key = new TH.DirectionalLight(0xffffff, 1.35); key.position.set(3, 6, 4); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6;
    Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 }); key.shadow.camera.updateProjectionMatrix(); scene.add(key);
    const rim = new TH.DirectionalLight(0xbfe6ff, .5); rim.position.set(-4, 3, -3); scene.add(rim);
    const floor = new TH.Mesh(new TH.PlaneGeometry(40, 40), new TH.MeshStandardMaterial({ color: bg, roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const m = buildModel(kind, R); scene.add(m);
    const box = new TH.Box3().setFromObject(m), c = box.getCenter(new TH.Vector3()), sz = box.getSize(new TH.Vector3());
    const tall = sz.y > Math.max(sz.x, sz.z) * .9;
    const dir = tall ? new TH.Vector3(.35, .35, 1).normalize() : new TH.Vector3(.25, 1.05, .9).normalize();
    const radius = sz.length() / 2, dist = radius / Math.sin(TH.MathUtils.degToRad(cam.fov / 2)) * (tall ? .86 : .8);
    cam.position.copy(c).addScaledVector(dir, dist); cam.lookAt(c); cam.updateProjectionMatrix();
    R.render(scene, cam);
    let url; try { url = R.domElement.toDataURL("image/webp", .86); } catch (_) { url = null; }
    if (url && url.length > 1000) { IMG[kind] = url; swapImages(kind); }
    scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach(mm => { if (mm.map) mm.map.dispose(); mm.dispose(); }); });
  }
  R.dispose();
}

/* ================= HOME 3D ================= */
const Home = (() => {
  let ready = false, running = false, ctx = null, R, scene, cam, root, raf = 0, clock;
  const S = { p: 0, target: 0, mx: 0, my: 0, tmx: 0, tmy: 0 };
  let sheet, sheetGeo, sheetBase, overlay, seps = [], cardsG, cards = [], trifold, banner, bannerPivot, boxG, flaps = [], lidP, mug, mugTex, mugCanvasProg = -1, wrapBrand;
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ss = (a, b, v) => { const t = cl((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const full = () => !!(window.THREE && window.gsap && window.ScrollTrigger) && !reduce;

  function build() {
    const TH = T(), canvas = $("#gl");
    try { R = new TH.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (_) { return false; }
    R.setPixelRatio(Math.min(devicePixelRatio, isMobile() ? 1.5 : 2));
    R.outputEncoding = TH.sRGBEncoding; R.toneMapping = TH.ACESFilmicToneMapping; R.toneMappingExposure = 1.08;
    scene = new TH.Scene(); cam = new TH.PerspectiveCamera(32, 1, .1, 100); cam.position.set(0, 0, 11);
    root = new TH.Group(); scene.add(root);
    scene.add(new TH.HemisphereLight(0xffffff, 0x20222a, .7));
    const key = new TH.DirectionalLight(0xffffff, 1.2); key.position.set(4, 5, 7); scene.add(key);
    const cy = new TH.PointLight(0x00a6e2, 1.2, 14); cy.position.set(-5, 2, 3); scene.add(cy);
    const mg = new TH.PointLight(0xec008c, 1, 14); mg.position.set(5, -3, 2); scene.add(mg);

    // pliego con curvatura (CPU)
    const W = 3, H = 4.24;
    sheetGeo = new TH.PlaneGeometry(W, H, 30, 42); sheetBase = sheetGeo.attributes.position.array.slice();
    const [pc, px] = cv(600, 848); px.fillStyle = "#f6f5f0"; px.fillRect(0, 0, 600, 848);
    px.strokeStyle = "rgba(0,0,0,.05)"; for (let i = 0; i < 160; i++) { px.beginPath(); const x = (i * 37) % 600, y = (i * 91) % 848; px.moveTo(x, y); px.lineTo(x + 18, y + 3); px.stroke(); }
    sheet = new TH.Mesh(sheetGeo, mat({ map: tex(pc, R), side: TH.DoubleSide, roughness: .9 }));
    const poster = paintPoster(BRANDS[0], 600, 848, "Edición especial");
    overlay = new TH.Mesh(sheetGeo, mat({ map: tex(poster, R), side: TH.FrontSide, transparent: true, opacity: 0, roughness: .7 }));
    overlay.position.z = .004; sheet.add(overlay); root.add(sheet);
    const sepC = separations(poster, 12);
    seps = sepC.map((c, i) => { const m = new TH.Mesh(new TH.PlaneGeometry(W, H), new TH.MeshBasicMaterial({ map: tex(c, R), transparent: true, opacity: 0, depthWrite: false, side: TH.DoubleSide })); m.renderOrder = 2 + i; root.add(m); return m; });

    // tarjetas en abanico + tríptico
    cardsG = new TH.Group(); root.add(cardsG);
    for (let i = 0; i < 9; i++) {
      const b = BRANDS[i % BRANDS.length];
      const c = panel(1.8, 1, .014, mat({ map: tex(paintCard(b), R) }), "#e7e5dc", mat({ map: tex(paintCard(b, 720, 400, true), R) }));
      cardsG.add(c); cards.push(c);
    }
    trifold = new TH.Group(); cardsG.add(trifold);
    const tp = tex(paintPoster(BRANDS[2], 600, 848, "Menú de temporada"), R);
    const mid = panel(1, 1.42, .01, mat({ map: tp }), "#fff"); trifold.add(mid);
    [-1, 1].forEach(s => { const pv = new TH.Group(); pv.position.x = s * .5; trifold.add(pv); const pnl = panel(1, 1.42, .01, mat({ color: s < 0 ? BRANDS[2].ac : BRANDS[2].bg }), "#fff"); pnl.position.x = s * .5; pv.add(pnl); pv.userData.s = s; trifold.userData[s < 0 ? "l" : "r"] = pv; });

    // pendón que se desenrolla
    banner = new TH.Group(); root.add(banner);
    bannerPivot = new TH.Group(); banner.add(bannerPivot);
    const bp = panel(2.2, 4.4, .01, mat({ map: tex(paintPoster(BRANDS[2], 500, 1000, "Gran apertura · sábado 10 a. m."), R) }));
    bp.position.y = -2.2; bannerPivot.add(bp);
    const tubeM = mat({ color: "#d9d9d9", metalness: .6, roughness: .3 });
    const topT = new TH.Mesh(new TH.CylinderGeometry(.05, .05, 2.4, 20), tubeM); topT.rotation.z = Math.PI / 2; banner.add(topT);
    const botT = new TH.Mesh(new TH.CylinderGeometry(.09, .09, 2.4, 20), tubeM); botT.rotation.z = Math.PI / 2; banner.add(botT); banner.userData.bot = botT;

    // caja que se arma desde el troquel
    boxG = new TH.Group(); root.add(boxG);
    const kraft = "#c49a6c", Wb = 1.8, Db = 1.4, Hb = .8, t = .02, logo = mat({ map: tex(paintCard({ ...BRANDS[4], bg: kraft, fg: "#3a2a1c" }, 640, 300), R) });
    const base = slab(Wb, t, Db, null, kraft); boxG.add(base);
    const mk = (w, h, d, pos, rotAxis, front) => { const pv = new TH.Group(); pv.position.copy(pos); boxG.add(pv); const p = panel(w, h, d, front || null, kraft, null); p.position.y = h / 2; pv.add(p); pv.userData.axis = rotAxis; flaps.push(pv); return pv; };
    mk(Wb, Hb, t, new TH.Vector3(0, 0, Db / 2), "x+", logo); // frente con logo
    const f2 = mk(Wb, Hb, t, new TH.Vector3(0, 0, -Db / 2), "x-");
    mk(t, Hb, Db, new TH.Vector3(Wb / 2, 0, 0), "z-");
    mk(t, Hb, Db, new TH.Vector3(-Wb / 2, 0, 0), "z+");
    lidP = new TH.Group(); f2.add(lidP); lidP.position.set(0, Hb, 0);
    const lid = slab(Wb, t, Db, mat({ map: tex(paintCard({ ...BRANDS[4], bg: "#b8885a", fg: "#2a1c10" }, 720, 560), R) }), kraft); lid.position.z = Db / 2; lidP.add(lid);

    // taza sublimada
    mug = buildModel("mug", R); root.add(mug); wrapBrand = BRANDS[2];
    mugTex = mug.userData.wrap;

    clock = new TH.Clock();
    addEventListener("resize", size); size();
    addEventListener("pointermove", e => { S.tmx = e.clientX / innerWidth - .5; S.tmy = e.clientY / innerHeight - .5; });
    return true;
  }
  function size() {
    if (!R) return;
    const c = R.domElement, w = c.clientWidth, h = c.clientHeight; if (!w || !h) return;
    R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    // encuadre según el área visible a z=0: horizontal → objeto a la derecha; vertical → objeto arriba
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z, halfW = halfH * cam.aspect;
    if (w >= 760 && cam.aspect >= 1) {
      const sc = Math.min(1.05, halfH / 2.7, halfW * .46 / 1.9);
      root.position.set(halfW * .5, 0, 0); root.scale.setScalar(sc);
    } else {
      const sc = Math.min(halfW * .84 / 1.9, halfH * .44 / 2.3);
      root.position.set(0, halfH * .5, 0); root.scale.setScalar(sc);
    }
  }
  function bendSheet(amount, t) {
    const p = sheetGeo.attributes.position, a = p.array;
    for (let i = 0; i < a.length; i += 3) {
      const x = sheetBase[i], y = sheetBase[i + 1];
      a[i + 2] = Math.sin((y / 4.24 + .5) * Math.PI) * amount * .5 + Math.sin(x * 1.3 + t * 1.2) * .05 * amount + (x / 1.5) * (x / 1.5) * amount * -.18;
    }
    p.needsUpdate = true; sheetGeo.computeVertexNormals();
  }
  function setScale(o, s) { o.visible = s > .002; o.scale.setScalar(Math.max(s, .001)); }
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    const t = clock.getElapsedTime();
    S.p += (S.target - S.p) * .085; S.mx += (S.tmx - S.mx) * .05; S.my += (S.tmy - S.my) * .05;
    const c = S.p * 6;
    // capítulo 1-2: pliego + CMYK
    const sheetIn = 1 - ss(2.0, 2.45, c);
    setScale(sheet, sheetIn);
    sheet.position.set(0, ss(2, 2.45, c) * 1.5, -ss(2, 2.45, c) * 2);
    sheet.rotation.set(-.15 + S.my * .3, -.35 + S.mx * .5 + Math.sin(t * .4) * .05, .04);
    bendSheet(.5 + Math.sin(t * .8) * .12 + S.mx * .3, t);
    const conv = ss(1.0, 1.75, c), sepVis = ss(.75, 1.05, c) * (1 - ss(1.85, 2.05, c));
    seps.forEach((m, i) => {
      const spread = (1 - conv);
      m.material.opacity = sepVis * (.9 - conv * .55);
      m.visible = m.material.opacity > .01;
      m.position.set(sheet.position.x + (i - 1.5) * spread * 1.1, sheet.position.y + (i - 1.5) * spread * -.25, .3 + i * spread * .9 + .02);
      m.rotation.copy(sheet.rotation); m.rotation.y += spread * (i - 1.5) * .25;
    });
    overlay.material.opacity = ss(1.55, 1.9, c);
    // capítulo 3: tarjetas
    const cIn = ss(1.95, 2.5, c), cOut = ss(2.85, 3.25, c);
    setScale(cardsG, cIn * (1 - cOut));
    cardsG.position.set(0, -cOut * 2, 0); cardsG.rotation.set(-.2 + S.my * .2, S.mx * .4 - .15, 0);
    const fan = ss(2.2, 2.75, c);
    cards.forEach((m, i) => {
      const k = i - (cards.length - 1) / 2, a = k * .17 * fan;
      m.position.set(Math.sin(a) * 2.6 * fan - .4, Math.cos(a) * 2.6 * fan - 2.6 * fan + .3 - k * .01, k * .03);
      m.rotation.set(0, Math.sin(t * .6 + i) * .08 * fan, -a);
    });
    trifold.position.set(.4, -1.9, 1.2); trifold.rotation.set(-.1, -.3 + Math.sin(t * .5) * .1, 0);
    const open = ss(2.35, 2.85, c);
    trifold.userData.l.rotation.y = (1 - open) * Math.PI * .95 - open * .35;
    trifold.userData.r.rotation.y = -(1 - open) * Math.PI * .95 + open * .35;
    // capítulo 4: pendón
    const bIn = ss(2.9, 3.3, c), bOut = ss(3.9, 4.25, c), unroll = ss(3.1, 3.75, c);
    setScale(banner, bIn * (1 - bOut));
    banner.position.set(0, 2.4 + bOut * 3, -.5); banner.rotation.set(0, -.25 + S.mx * .3 + Math.sin(t * .5) * .04, 0);
    bannerPivot.scale.y = Math.max(.001, unroll); banner.userData.bot.position.y = -4.4 * unroll;
    // capítulo 5: caja
    const xIn = ss(3.95, 4.35, c), xOut = ss(4.9, 5.25, c), fold = ss(4.2, 4.75, c), lidF = ss(4.6, 4.95, c);
    setScale(boxG, xIn * (1 - xOut) * 1.3);
    boxG.position.set(0, -.6 - xOut * 2, 0); boxG.rotation.set(.55 + S.my * .2 - (1 - fold) * .35, -.6 + S.mx * .5 + t * .08, 0);
    flaps.forEach(pv => {
      const ang = (1 - fold) * Math.PI / 2;
      if (pv.userData.axis === "x+") pv.rotation.x = ang; if (pv.userData.axis === "x-") pv.rotation.x = -ang;
      if (pv.userData.axis === "z-") pv.rotation.z = -ang; if (pv.userData.axis === "z+") pv.rotation.z = ang;
    });
    lidP.rotation.x = (1 - lidF) * -2.4;
    // capítulo 6: taza
    const mIn = ss(4.95, 5.35, c), sub = ss(5.2, 5.9, c);
    setScale(mug, mIn * 1.9);
    mug.position.set(0, -1.1, 0); mug.rotation.set(.18 + S.my * .2, -1.6 + t * .35 + S.mx * .6, 0);
    const q = Math.round(sub * 40) / 40;
    if (q !== mugCanvasProg && mug.visible) { mugCanvasProg = q; const img = paintWrap(wrapBrand, 1024, 400, q); mugTex.image = img; mugTex.needsUpdate = true; }
    R.render(scene, cam);
  }
  function syncUI(p) {
    const c = Math.min(5, Math.floor(p * 6 + .0001)), chaps = $$("#chaps .chap");
    chaps.forEach((el, i) => el.classList.toggle("on", i === c));
    $$("#prog i b").forEach((b, i) => b.style.transform = `scaleX(${Math.max(0, Math.min(1, p * 6 - i))})`);
    const names = ["PLIEGO EN BLANCO", "SEPARACIÓN CMYK", "PAPELERÍA", "GRAN FORMATO", "EMPAQUE", "PERSONALIZACIÓN"];
    $("#chapCounter").textContent = `0${c + 1} / 06 · ${names[c]}`;
  }
  function enter() {
    if (!full()) { $("#homeRoot").classList.add("static"); $$("#chaps .chap").forEach(c => c.classList.add("on")); return; }
    if (!ready) { ready = build(); if (!ready) { $("#homeRoot").classList.add("static"); $$("#chaps .chap").forEach(c => c.classList.add("on")); return; } frame(); }
    running = true;
    ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: "#stage", start: "top top", end: () => "+=" + (isMobile() ? 420 : 560) + "%", pin: true, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: s => { S.target = s.progress; syncUI(s.progress); } });
      gsap.from("#chaps .chap.on > *", { y: 40, opacity: 0, duration: 1, ease: "expo.out", stagger: .07, delay: .2 });
      $$(".stat b").forEach(b => {
        const to = +b.dataset.to, suf = b.dataset.suf || "", o = { v: 0 };
        ScrollTrigger.create({ trigger: b, start: "top 88%", once: true, onEnter: () => gsap.fromTo(o, { v: 0 }, { v: to, duration: 1.4, ease: "power3.out", onUpdate: () => b.textContent = Math.round(o.v) + suf }) });
      });
      gsap.utils.toArray(".step, .cat, .rubro").forEach((el, i) => gsap.from(el, { y: 40, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" }, delay: (i % 4) * .05 }));
    });
    setTimeout(() => { size(); fitChapters(); }, 50);
  }
  function leave() { running = false; if (ctx) { ctx.revert(); ctx = null; } }
  return { enter, leave };
})();

/* ================= CARRUSEL INFINITO (estilo CatMedia) ================= */
const Marquees = (() => {
  const items = [];
  let vel = 0, lastS = scrollY, lastT = performance.now();
  function add(el, speed, dir) {
    if (!el || !el.children.length) return;
    el.innerHTML += el.innerHTML;
    $$("img,[role=img]", el).forEach((im, i, arr) => { if (i >= arr.length / 2) { im.setAttribute("alt", ""); im.removeAttribute("aria-label"); im.setAttribute("aria-hidden", "true"); } });
    $$("a", el).forEach((a, i, arr) => { if (i >= arr.length / 2) a.tabIndex = -1; });
    const m = { el, speed, dir, x: dir > 0 ? 0 : -.5, ts: 1, tts: 1 };
    el.addEventListener("pointerenter", () => m.tts = .15); el.addEventListener("pointerleave", () => m.tts = 1);
    el.addEventListener("focusin", () => m.tts = 0); el.addEventListener("focusout", () => m.tts = 1);
    items.push(m);
  }
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
    const ds = Math.abs(scrollY - lastS); lastS = scrollY;
    vel += (Math.min(4, ds / 12) - vel) * .1;
    if (reduce) return;
    items.forEach(m => {
      if (!m.el.offsetParent) return;
      m.ts += (m.tts - m.ts) * .08;
      m.x += (m.dir > 0 ? -1 : 1) * dt / m.speed * m.ts * (1 + vel);
      if (m.x <= -.5) m.x += .5; if (m.x > 0) m.x -= .5;
      m.el.style.transform = `translate3d(${m.x * 100}%,0,0)`;
    });
  }
  return { add, start() { requestAnimationFrame(loop); } };
})();

/* ================= RUEDA DE REELS (estilo hadi-community.de) =================
   Tarjetas 9:16 sobre una circunferencia cuyo centro queda bajo la pantalla:
   x = R·sin(a), y = R·(1 − cos a), rotación = a. La separación angular sale del
   ancho real de la tarjeta, así nunca se traslapan. Gira en bucle, acelera con el
   scroll, se frena al pasar el cursor y se puede arrastrar. */
const Wheel = (() => {
  let el, track, cards = [], n = 0, R = 1600, cw = 240, ch = 427, step = .16, span = 1, vis = .6;
  let off = 0, vel = 0, auto = 1, autoT = 1, drag = null, lastX = 0, lastT = 0, moved = 0, sv = 0, lastS = scrollY, raf = 0;
  const BASE = -.045; // rad/s, sentido: hacia la izquierda
  function layout() {
    const W = el.clientWidth || innerWidth;
    cw = Math.round(Math.max(150, Math.min(W * (W < 760 ? .44 : .19), 270)));
    ch = Math.round(cw * 16 / 9);
    R = Math.max(cw * 3.2, Math.min(W * (W < 760 ? 1.9 : 1.25), 1900));
    step = (cw + Math.max(32, cw * .34)) / R; // aire entre tarjetas
    span = step * n;
    vis = Math.asin(Math.min(1, (W / 2 + cw) / R)) + step * .5;
    const drop = R * (1 - Math.cos(Math.min(vis, Math.PI / 2)));
    el.style.setProperty("--cw", cw + "px");
    el.style.setProperty("--wh", Math.round(ch + Math.min(drop * .32, ch * .32) + 48) + "px");
    render();
  }
  function render() {
    const half = span / 2;
    let best = 1e9, bi = -1;
    for (let i = 0; i < n; i++) {
      let a = i * step + off;
      a = ((a + half) % span + span) % span - half; // envolver a [−half, half)
      const c = cards[i], show = Math.abs(a) < vis;
      if (!show) { if (c._v !== false) { c.style.visibility = "hidden"; c._v = false; } continue; }
      if (c._v !== true) { c.style.visibility = "visible"; c._v = true; }
      const x = R * Math.sin(a), y = R * (1 - Math.cos(a));
      c.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${a}rad)`;
      c.style.zIndex = 100 - Math.round(Math.abs(a) * 100);
      if (Math.abs(a) < best) { best = Math.abs(a); bi = i; }
    }
    cards.forEach((c, i) => c.classList.toggle("center", i === bi));
  }
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (!el.offsetParent) { lastT = now; return; }
    const dt = Math.min(.05, (now - (lastT || now)) / 1000); lastT = now;
    const ds = scrollY - lastS; lastS = scrollY;
    sv += (Math.min(6, Math.abs(ds) / 10) - sv) * .12;
    auto += (autoT - auto) * .08;
    if (!drag) {
      vel *= Math.pow(.05, dt); // inercia del arrastre
      off += (BASE * auto * (1 + sv) + vel) * dt;
    }
    render();
  }
  function down(e) {
    if (e.button !== undefined && e.button !== 0) return;
    drag = { x: e.clientX, off }; lastX = e.clientX; moved = 0; vel = 0;
    el.classList.add("drag"); el.setPointerCapture && el.setPointerCapture(e.pointerId);
  }
  function move(e) {
    const r = el.getBoundingClientRect(), hint = $("#wheelHint");
    if (hint) { hint.style.left = (e.clientX - r.left) + "px"; hint.style.top = (e.clientY - r.top) + "px"; }
    if (!drag) return;
    const dx = e.clientX - drag.x; moved = Math.max(moved, Math.abs(dx));
    off = drag.off + dx / R;
    const now = performance.now();
    vel = ((e.clientX - lastX) / R) / Math.max(.008, (now - (move._t || now)) / 1000) * .6; move._t = now; lastX = e.clientX;
  }
  function up() { if (!drag) return; drag = null; el.classList.remove("drag"); }
  function init() {
    el = $("#wheel"); track = $("#wheelTrack"); if (!el) return;
    cards = $$(".reel", track); n = cards.length; if (!n) return;
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    addEventListener("pointerup", up); addEventListener("pointercancel", up);
    el.addEventListener("click", e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    el.addEventListener("pointerenter", () => autoT = .12); el.addEventListener("pointerleave", () => { autoT = 1; up(); });
    el.addEventListener("focusin", () => autoT = 0); el.addEventListener("focusout", () => autoT = 1);
    el.addEventListener("keydown", e => { if (e.key === "ArrowRight") { off -= step; e.preventDefault(); } if (e.key === "ArrowLeft") { off += step; e.preventDefault(); } });
    addEventListener("resize", layout);
    layout();
    if (reduce) { autoT = auto = 0; render(); return; }
    raf = requestAnimationFrame(loop);
  }
  return { init, layout };
})();

/* ================= AJUSTE DE TÍTULOS DEL ESCENARIO =================
   Mide el capítulo más alto y, si no cabe entre la barra superior y el
   progreso, reduce el título hasta que quepa. Así nunca tapa el logo ni la
   etiqueta superior, sin importar la fuente o la altura de la pantalla. */
function fitChapters() {
  const root = $("#homeRoot"); if (!root || root.classList.contains("static") || !root.offsetParent) return;
  const ui = $(".stage-ui"), area = $(".chap-area"), top = $(".stage-ui > .stage-top"), heads = $$("#chaps .chap h1, #chaps .chap h2");
  heads.forEach(h => h.style.fontSize = "");
  const cs = getComputedStyle(ui), gap = parseFloat(cs.rowGap) || 0;
  const bot = $(".stage-bot"), botH = bot && getComputedStyle(bot).display !== "none" ? bot.offsetHeight + gap : 0;
  const avail = ui.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - top.offsetHeight - gap - botH - 8;
  const tallest = () => Math.max(...$$("#chaps .chap").map(c => c.offsetHeight)) + ($("#prog").offsetHeight || 0) + 16;
  let base = parseFloat(getComputedStyle(heads[0]).fontSize), k = 1, i = 0;
  while (tallest() > avail && i++ < 14 && base * k > 24) { k *= .93; heads.forEach(h => h.style.fontSize = (base * k).toFixed(1) + "px"); }
}
addEventListener("resize", () => { clearTimeout(fitChapters._t); fitChapters._t = setTimeout(fitChapters, 120); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitChapters);

/* inclinación 3D de tarjetas de rubro */
function tilt() {
  if (reduce || matchMedia("(hover: none)").matches) return;
  $$(".rubro").forEach(el => {
    el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateZ(6px)`; });
    el.addEventListener("pointerleave", () => el.style.transform = "");
  });
}

/* ================= ARRANQUE ================= */
(function boot() {
  $$(".stat b").forEach(b => b.textContent = (b.dataset.to) + (b.dataset.suf || ""));
  renderHomeDynamic();
  $$(".stat b")[1].textContent = PRODUCTS.length;
  updateCartCount();
  $("#ftMail").textContent = CONFIG.email;
  if (CONFIG.whatsapp) $("#ftWa").textContent = "+" + CONFIG.whatsapp;
  if (window.Lenis && !reduce) {
    try {
      const lenis = new Lenis({ lerp: .1, smoothWheel: true }); window.lenis = lenis;
      if (window.gsap && window.ScrollTrigger) { lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
      else { const r = t => { lenis.raf(t); requestAnimationFrame(r); }; requestAnimationFrame(r); }
    } catch (_) {}
  }
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  route();
  fitChapters();
  Wheel.init();
  Marquees.add($("#mq3"), 40, -1); Marquees.add($("#mq4"), 70, 1);
  Marquees.start(); tilt();
  // cargador: termina en ≤1,4 s
  const ln = $("#loadNum"), t0 = performance.now();
  (function tick(now) { const p = Math.min(1, (now - t0) / 1100); ln.textContent = Math.round(p * 100); if (p < 1) requestAnimationFrame(tick); else $("#loader").classList.add("done"); })(t0);
  setTimeout(() => $("#loader").classList.add("done"), 1600);
  const go = () => renderReferences().catch(() => {});
  (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve()).then(() => setTimeout(go, 400));
  initCaps();
})();
