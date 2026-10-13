/* ================= UTILIDADES ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtN = n => Number(n).toLocaleString("es-VE");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = () => innerWidth < 760;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (_) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} }
};
const byId = slug => PRODUCTS.find(p => p.slug === slug);
const catById = id => CATS.find(c => c.id === id);
const estadoById = id => ESTADOS.find(e => e.id === id) || ESTADOS[0];

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2400);
}
function copyText(text, btn) {
  const done = () => { toast("Copiado"); if (btn) { const o = btn.textContent; btn.textContent = "Copiado"; setTimeout(() => btn.textContent = o, 1500); } };
  try { navigator.clipboard.writeText(text).then(done, () => toast("Selecciona el texto y cópialo manualmente")); }
  catch (_) { toast("Selecciona el texto y cópialo manualmente"); }
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-copy]"); if (!b) return;
  const src = $(b.dataset.copy); if (src) copyText(src.value ?? src.textContent, b);
});

/* ================= IMÁGENES DE REFERENCIA =================
   Mientras no haya fotos propias, cada producto usa un render 3D de referencia
   (ver renderReferences). Para usar fotos reales: IMG[model] = "url-de-la-foto". */
const IMG = {};
function imgHTML(model, alt) {
  const src = IMG[model];
  return src
    ? `<img src="${src}" alt="${esc(alt)}" loading="lazy" data-model="${model}">`
    : `<div class="ph" data-model="${model}" role="img" aria-label="${esc(alt)}">REFERENCIA</div>`;
}
function swapImages(model) {
  $$(`.ph[data-model="${model}"]`).forEach(ph => {
    const im = new Image(); im.src = IMG[model]; im.alt = ph.getAttribute("aria-label") || ""; im.dataset.model = model;
    ph.replaceWith(im);
  });
}

/* ================= CARRITO (solicitud) ================= */
let cart = store.get("imp.cart", []);
function saveCart() { store.set("imp.cart", cart); updateCartCount(); }
function updateCartCount() {
  const b = $("#cartCount"); b.textContent = cart.length; b.hidden = cart.length === 0;
}
function optsLine(item) {
  return Object.entries(item.opciones || {}).filter(([, v]) => v).map(([k, v]) => {
    const p = byId(item.slug); const o = p && p.opts.find(x => x.id === k);
    return `${o ? o.label : k}: ${v}`;
  });
}

/* ================= PEDIDOS ================= */
let db = null, user = null, canEdit = false;
const localOrders = () => store.get("imp.orders", {});
function saveLocalOrder(o) { const all = localOrders(); all[o.codigo] = o; store.set("imp.orders", all); }
function newCode() {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; const r = new Uint32Array(5); crypto.getRandomValues(r);
  return `IMP-${CONFIG.year}-${[...r].map(x => A[x % A.length]).join("")}`;
}
function orderMessage(o) {
  const lines = [`Hola, envié la solicitud de cotización ${o.codigo}.`, ""];
  o.items.forEach((it, i) => {
    lines.push(`${i + 1}. ${it.nombre} · ${fmtN(it.cantidad)} ${it.unidad || "unidades"}`);
    optsLine(it).forEach(l => lines.push(`   - ${l}`));
    lines.push(`   - Arte: ${it.arte}`);
  });
  lines.push("", `Entrega: ${entregaLine(o)}`);
  if (o.fechaDeseada) lines.push(`Fecha deseada: ${o.fechaDeseada}${o.urgente ? " (urgente)" : ""}`);
  lines.push(`Nombre: ${o.cliente.nombre} · ${o.cliente.documento}`);
  return lines.join("\n");
}
function entregaLine(o) {
  if (o.entrega.tipo === "delivery") return `Delivery en Caracas · ${o.entrega.zona || "zona por confirmar"}`;
  if (o.entrega.tipo === "envio") return `Envío nacional · ${o.entrega.agencia} · ${o.entrega.oficina || "oficina por confirmar"}`;
  return "Retiro en taller";
}
const waLink = (num, text) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
function phoneIntl(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "58" + d.slice(1);
  if (d.length === 10 && d.startsWith("4")) d = "58" + d;
  return d;
}

/* ================= ROUTER ================= */
const VIEWS = ["inicio", "tienda", "producto", "solicitud", "datos", "pedido", "panel"];
let currentView = null;
function parseHash() {
  const h = decodeURIComponent(location.hash.slice(1)) || "inicio";
  if (h === "como" || h === "inicio") return { view: "inicio", anchor: h === "como" ? "como" : null };
  if (h === "contacto") return { view: currentView || "inicio", anchor: "contacto" };
  if (h === "tienda") return { view: "tienda", cat: "todo" };
  if (h.startsWith("cat-")) return { view: "tienda", cat: h.slice(4) };
  if (h.startsWith("p-")) return { view: "producto", slug: h.slice(2) };
  if (h.startsWith("pedido-")) return { view: "pedido", code: h.slice(7) };
  if (VIEWS.includes(h)) return { view: h };
  return { view: "inicio" };
}
function scrollToY(y, instant) {
  if (window.lenis) window.lenis.scrollTo(y, { immediate: !!instant, duration: 1.1 });
  else window.scrollTo({ top: y, behavior: instant || reduce ? "auto" : "smooth" });
}
function route() {
  const r = parseHash();
  const changed = r.view !== currentView;
  if (changed) {
    if (currentView === "inicio") Home.leave();
    $$(".view").forEach(v => v.hidden = v.dataset.view !== r.view);
    currentView = r.view;
    if (document.body.classList.contains("menu-open")) setMenu(false);
  }
  const navKey = r.view === "inicio" ? (r.anchor === "como" ? "como" : "inicio") : (r.view === "tienda" || r.view === "producto") ? "tienda" : (r.view === "solicitud" || r.view === "datos") ? "solicitud" : "";
  $$(".nav a, .mnav a").forEach(a => a.toggleAttribute("aria-current", a.dataset.nav === navKey));
  if (a11yTitle[r.view]) document.title = a11yTitle[r.view];
  if (r.view === "tienda") renderShop(r.cat);
  if (r.view === "producto") renderPDP(r.slug);
  if (r.view === "solicitud") renderCart();
  if (r.view === "datos") renderCheckout();
  if (r.view === "pedido") renderOrder(r.code);
  if (r.view === "panel") renderPanel();
  if (r.view === "inicio" && changed) Home.enter();
  hdrState();
  if (r.anchor) { const el = document.getElementById(r.anchor); if (el) requestAnimationFrame(() => scrollToY(el.getBoundingClientRect().top + scrollY - 70)); }
  else if (changed) scrollToY(0, true);
  if (window.ScrollTrigger) requestAnimationFrame(() => ScrollTrigger.refresh());
}
const a11yTitle = { inicio: "Imprenta Caracas", tienda: "Tienda · Imprenta Caracas", producto: "Producto · Imprenta Caracas", solicitud: "Solicitud · Imprenta Caracas", datos: "Tus datos · Imprenta Caracas", pedido: "Pedido · Imprenta Caracas", panel: "Panel · Imprenta Caracas" };
addEventListener("hashchange", route);

/* header + menú */
let lastY = 0;
function hdrState() {
  const hdr = $("#hdr"), y = scrollY;
  hdr.classList.toggle("solid", currentView !== "inicio" || y > innerHeight * 0.6);
  if (!document.body.classList.contains("menu-open")) hdr.classList.toggle("hide", y > 200 && y > lastY + 4 && currentView !== "producto");
  if (y < lastY - 4 || y < 200) hdr.classList.remove("hide");
  lastY = y;
}
addEventListener("scroll", hdrState, { passive: true });
function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  $("#menuBtn").setAttribute("aria-expanded", open); $("#menuBtn").setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  $("#hdr").classList.remove("hide");
  if (window.lenis) open ? window.lenis.stop() : window.lenis.start();
}
$("#menuBtn").addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
$("#mnav").addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
addEventListener("resize", () => { if (innerWidth >= 900 && document.body.classList.contains("menu-open")) setMenu(false); });
addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) { setMenu(false); $("#menuBtn").focus(); } });

/* ================= HOME (partes en HTML) ================= */
function renderHomeDynamic() {
  const pick = ["tarjetas-de-presentacion", "pendones", "etiquetas-producto", "cajas-plegables", "tazas", "catalogos", "talonarios-de-factura", "tripticos", "roll-up", "franelas"];
  const rest = PRODUCTS.filter(p => !pick.includes(p.slug)).slice(0, 8);
  const reel = p => `<a class="reel" href="#p-${p.slug}" draggable="false">${imgHTML(p.model, p.name)}<div class="r-top"><span>${esc(catById(p.cat).name.toUpperCase())}</span><span>REF</span></div><div class="r-bot"><h3>${esc(p.name)}</h3><span class="r-spec">${esc(p.spec)}</span><span class="r-go">Configurar →</span></div></a>`;
  $("#wheelTrack").innerHTML = pick.map(byId).concat(rest).map(reel).join("");
  $("#mq4").innerHTML = REVIEWS.map(([t, w]) => `<div class="mq-card"><span class="stars" aria-label="5 de 5">★★★★★</span><p>${esc(t)}</p><span class="who">${esc(w)}</span></div>`).join("");
  $("#homeCats").innerHTML = CATS.map(c => `<a class="cat" href="#cat-${c.id}"><div class="thumb">${imgHTML(c.model, c.name)}<span class="ref-tag">REF</span></div><div class="body"><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p><span class="mono" style="color:var(--muted)">${PRODUCTS.filter(p => p.cat === c.id).length} PRODUCTOS →</span></div></a>`).join("");
  const s = $$(".stat b")[1]; if (s) s.dataset.to = PRODUCTS.length;
}

/* ================= TIENDA ================= */
function renderShop(cat) {
  const valid = cat === "todo" || catById(cat);
  if (!valid) cat = "todo";
  $("#filters").innerHTML = [`<button class="chip" data-cat="todo" aria-pressed="${cat === "todo"}">Todo</button>`]
    .concat(CATS.map(c => `<button class="chip" data-cat="${c.id}" aria-pressed="${cat === c.id}">${esc(c.name)}</button>`)).join("");
  const list = PRODUCTS.filter(p => cat === "todo" || p.cat === cat);
  $("#grid").innerHTML = list.map(p => `<a class="pcard" href="#p-${p.slug}"><div class="thumb">${imgHTML(p.model, p.name)}<span class="ref-tag">REF</span></div><div class="body"><span class="mono" style="color:var(--dim)">${esc(catById(p.cat).name.toUpperCase())}</span><h3>${esc(p.name)}</h3><span class="spec">${esc(p.spec)}</span><div class="row"><span>${esc(p.plazo)}</span><b>Cotizar →</b></div></div></a>`).join("");
}
$("#filters").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  history.replaceState(null, "", b.dataset.cat === "todo" ? "#tienda" : "#cat-" + b.dataset.cat);
  renderShop(b.dataset.cat);
});

/* ================= PRODUCTO / CONFIGURADOR ================= */
let pdpFiles = [];
function renderPDP(slug) {
  const p = byId(slug), root = $("#pdp");
  if (!p) { root.innerHTML = `<div class="page-head"><h1>No encontramos ese producto.</h1><a class="btn btn-y" href="#tienda">Ir a la tienda</a></div>`; return; }
  pdpFiles = [];
  const c = catById(p.cat);
  const optHTML = o => {
    if (o.type === "text") return `<div class="opt"><label for="o-${o.id}">${esc(o.label)}</label><input class="in" id="o-${o.id}" name="${o.id}" placeholder="${esc(o.placeholder || "")}"></div>`;
    if (o.type === "select") return `<div class="opt"><label for="o-${o.id}">${esc(o.label)}</label><select class="in" id="o-${o.id}" name="${o.id}">${o.values.map(v => `<option>${esc(v)}</option>`).join("")}</select></div>`;
    return `<div class="opt" role="radiogroup" aria-labelledby="l-${o.id}"><span class="lab" id="l-${o.id}">${esc(o.label)}</span><div class="seg">${o.values.map((v, i) => `<input type="radio" name="${o.id}" id="o-${o.id}-${i}" value="${esc(v)}" ${i === 0 ? "checked" : ""}><label for="o-${o.id}-${i}">${esc(v)}</label>`).join("")}</div></div>`;
  };
  root.innerHTML = `
  <div class="pdp">
    <div class="pdp-media">${imgHTML(p.model, p.name)}<span class="ref-tag">IMAGEN DE REFERENCIA</span></div>
    <form class="pdp-info" id="cfg" novalidate>
      <div class="crumbs"><a href="#tienda">Tienda</a><span>/</span><a href="#cat-${c.id}">${esc(c.name)}</a></div>
      <div style="display:grid;gap:14px"><h1>${esc(p.name)}</h1><span class="mono" style="color:var(--muted)">${esc(p.spec)} · ${esc(p.plazo)}${p.expres ? " · ADMITE EXPRÉS" : ""}</span></div>
      ${p.note ? `<p class="note"><span class="reg"></span>${esc(p.note)}</p>` : ""}
      ${p.opts.map(optHTML).join("")}
      <div class="opt"><span class="lab" id="l-qty">Cantidad${p.unit ? ` · ${esc(p.unit)}` : ""}</span>
        <div class="seg" role="radiogroup" aria-labelledby="l-qty">${p.qtys.map((q, i) => `<input type="radio" name="qty" id="q-${i}" value="${q}" ${i === Math.min(2, p.qtys.length - 1) ? "checked" : ""}><label for="q-${i}">${fmtN(q)}</label>`).join("")}<input type="radio" name="qty" id="q-x" value="otra"><label for="q-x">Otra</label></div>
        <div class="qty" id="qtyOther" hidden><button type="button" data-d="-1" aria-label="Menos">−</button><input id="qtyIn" type="number" min="1" value="${p.qtys[0]}" aria-label="Cantidad"><button type="button" data-d="1" aria-label="Más">+</button></div>
      </div>
      ${optHTML(ART)}
      <div class="opt" id="artUp">
        <span class="lab">Archivos</span>
        <label class="drop" id="drop" for="fileIn"><input type="file" id="fileIn" multiple accept=".pdf,.ai,.psd,.png,.jpg,.jpeg,.svg,.eps,.zip"><b>Arrastra tu arte aquí o haz clic para elegir</b><span class="hint" style="font-size:13px;color:var(--muted)">PDF, AI, PSD, PNG o JPG a 300 dpi, con 3 mm de sangrado.</span></label>
        <div class="files" id="fileList"></div>
      </div>
      <div class="field"><label for="o-instr" id="instrLab">Instrucciones para la imprenta <span class="hint">(opcional)</span></label><textarea class="in" id="o-instr" name="instrucciones" placeholder="Textos, colores, referencias, o lo que debamos saber."></textarea></div>
      <div class="add-row"><button class="btn btn-y" type="submit">Añadir a la solicitud <span class="arr">→</span></button><span class="mono" style="color:var(--muted)">PRECIO: A COTIZAR</span></div>
      <p class="note"><span class="reg"></span>No pagas nada ahora. Te enviamos la cotización por WhatsApp y correo.</p>
    </form>
  </div>`;
  const form = $("#cfg");
  form.addEventListener("change", e => {
    if (e.target.name === "qty") $("#qtyOther").hidden = e.target.value !== "otra";
    if (e.target.name === "arte") {
      const need = e.target.value === "Necesito diseño";
      $("#instrLab").innerHTML = need ? `Cuéntanos qué necesitas en el diseño` : `Instrucciones para la imprenta <span class="hint">(opcional)</span>`;
      $("#artUp .lab").textContent = need ? "Logo, fotos o referencias (opcional)" : "Archivos";
    }
  });
  $("#qtyOther").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; const i = $("#qtyIn"); i.value = Math.max(1, (+i.value || 1) + +b.dataset.d); });
  const drop = $("#drop");
  const addFiles = fl => { [...fl].forEach(f => pdpFiles.push({ nombre: f.name, kb: Math.round(f.size / 1024) })); drawFiles(); };
  const drawFiles = () => { $("#fileList").innerHTML = pdpFiles.map((f, i) => `<div><span>${esc(f.nombre)}</span><span>${fmtN(f.kb)} KB · <button type="button" class="link-btn" data-rm="${i}">Quitar</button></span></div>`).join(""); };
  $("#fileIn").addEventListener("change", e => addFiles(e.target.files));
  ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", e => addFiles(e.dataTransfer.files));
  $("#fileList").addEventListener("click", e => { const b = e.target.closest("[data-rm]"); if (b) { pdpFiles.splice(+b.dataset.rm, 1); drawFiles(); } });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(form), opciones = {};
    p.opts.forEach(o => opciones[o.id] = (fd.get(o.id) || "").toString().trim());
    let q = fd.get("qty"); q = q === "otra" ? Math.max(1, parseInt($("#qtyIn").value, 10) || 1) : +q;
    cart.push({ id: Date.now().toString(36), slug: p.slug, nombre: p.name, model: p.model, opciones, cantidad: q, unidad: p.unit || "unidades",
      arte: fd.get("arte"), instrucciones: (fd.get("instrucciones") || "").toString().trim(), archivos: pdpFiles.slice() });
    saveCart(); toast(`${p.name} añadido a tu solicitud`);
    location.hash = "solicitud";
  });
}

/* ================= SOLICITUD ================= */
function itemHTML(it, editable) {
  return `<div class="item"><div class="thumb">${imgHTML(it.model, it.nombre)}</div>
    <div style="min-width:0"><h3>${esc(it.nombre)}</h3>
      <div class="spec"><span>${fmtN(it.cantidad)} ${esc(it.unidad || "unidades")}</span>${optsLine(it).map(l => `<span>${esc(l)}</span>`).join("")}<span>Arte: ${esc(it.arte)}</span>${it.archivos && it.archivos.length ? `<span>${it.archivos.length} archivo${it.archivos.length > 1 ? "s" : ""}</span>` : ""}</div>
      ${it.instrucciones ? `<p style="font-size:14px;color:var(--paper-2);margin-top:8px">${esc(it.instrucciones)}</p>` : ""}
    </div>
    ${editable ? `<div class="acts"><a class="link-btn" href="#p-${it.slug}">Pedir otro igual</a><button class="link-btn" data-del="${it.id}">Quitar</button></div>` : ""}</div>`;
}
function summaryHTML(withBtn) {
  const n = cart.reduce((a, it) => a + 1, 0);
  return `<h2>Resumen</h2><dl><dt>Productos</dt><dd>${n}</dd><dt>Precio</dt><dd>A cotizar</dd><dt>Pago</dt><dd>Según cotización</dd></dl>
  <p class="note"><span class="reg"></span>Recibirás la cotización en USD y en bolívares a tasa BCV del día.</p>
  ${withBtn ? `<a class="btn btn-y" href="#datos">Continuar <span class="arr">→</span></a><a class="btn btn-o" href="#tienda">Seguir agregando</a>` : ""}`;
}
function renderCart() {
  const b = $("#cartBody");
  if (!cart.length) { b.innerHTML = `<div class="empty"><h2>Tu solicitud está vacía.</h2><p class="lead">Elige un producto, configúralo y añádelo. Puedes sumar varios en la misma solicitud.</p><a class="btn btn-y" href="#tienda">Ir a la tienda <span class="arr">→</span></a></div>`; return; }
  b.innerHTML = `<div class="two"><div class="items">${cart.map(it => itemHTML(it, true)).join("")}</div><aside class="sum">${summaryHTML(true)}</aside></div>`;
}
$("#cartBody").addEventListener("click", e => {
  const d = e.target.closest("[data-del]"); if (!d) return;
  cart = cart.filter(it => it.id !== d.dataset.del); saveCart(); renderCart(); toast("Producto quitado");
});

/* ================= DATOS / ENVÍO ================= */
const draftKey = "imp.draft";
function renderCheckout() {
  if (!cart.length) { location.replace("#solicitud"); return; }
  $("#sum2").innerHTML = `<h2>Tu solicitud</h2>${cart.map(it => `<div style="display:flex;justify-content:space-between;gap:10px;font-size:14px"><span>${esc(it.nombre)}</span><span class="mono">${fmtN(it.cantidad)}</span></div>`).join("")}<dl><dt>Precio</dt><dd>A cotizar</dd></dl><a class="link-btn" href="#solicitud">Editar solicitud</a>`;
  const d = store.get(draftKey, {});
  Object.entries(d).forEach(([k, v]) => { const el = $(`#checkout [name="${k}"]`); if (el && el.type !== "radio" && el.type !== "checkbox") el.value = v; });
  syncCheckout();
}
function syncCheckout() {
  const f = $("#checkout"), t = f.entrega.value;
  $("#f-zona").hidden = t !== "delivery"; $("#f-envio").hidden = t !== "envio";
  $("#factFields").hidden = !$("#c-fact").checked;
}
$("#checkout").addEventListener("change", syncCheckout);
$("#checkout").addEventListener("input", e => {
  if (!e.target.name || e.target.type === "checkbox" || e.target.type === "radio") return;
  const d = store.get(draftKey, {}); d[e.target.name] = e.target.value; store.set(draftKey, d);
  e.target.classList.remove("err");
});
$("#checkout").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, err = $("#formErr"); err.textContent = "";
  const req = ["c-nombre", "c-doc", "c-tel", "c-mail"];
  if ($("#c-fact").checked) req.push("c-razon", "c-dirf");
  if (f.entrega.value === "delivery") req.push("c-zona");
  if (f.entrega.value === "envio") req.push("c-ofi");
  const bad = req.filter(id => !$("#" + id).value.trim());
  const mail = $("#c-mail").value.trim();
  if (mail && !/^\S+@\S+\.\S+$/.test(mail)) bad.push("c-mail");
  if (phoneIntl($("#c-tel").value).length < 11) bad.push("c-tel");
  bad.forEach(id => $("#" + id).classList.add("err"));
  if (bad.length) { err.textContent = "Revisa los campos marcados: faltan datos o tienen un formato que no reconocemos (correo o teléfono)."; $("#" + bad[0]).focus(); return; }
  if (!$("#c-ok").checked) { err.textContent = "Para enviar la solicitud, marca que aceptas las condiciones."; $("#c-ok").focus(); return; }
  const btn = $("#sendBtn"); btn.disabled = true; btn.textContent = "Enviando…";
  const now = new Date().toISOString();
  const order = {
    codigo: newCode(), creado: now, estado: "recibido",
    historial: [{ estado: "recibido", fecha: now, nota: "Solicitud enviada desde la web" }],
    cliente: { nombre: $("#c-nombre").value.trim(), documento: $("#c-doc").value.trim(), telefono: $("#c-tel").value.trim(), correo: mail, empresa: $("#c-emp").value.trim(),
      factura: $("#c-fact").checked, razonSocial: $("#c-razon").value.trim(), direccionFiscal: $("#c-dirf").value.trim() },
    entrega: { tipo: f.entrega.value, zona: $("#c-zona").value.trim(), agencia: $("#c-agencia").value, oficina: $("#c-ofi").value.trim() },
    fechaDeseada: $("#c-fecha").value, urgente: $("#c-urg").checked, notas: $("#c-notas").value.trim(),
    items: cart.map(({ id, ...it }) => it),
    cotizacion: { totalUSD: null, condicionesPago: "", nota: "" },
    pago: { metodo: null, referencia: null, estado: null, monto: null, fecha: null }
  };
  let remote = false;
  if (db) {
    try { await db.doc("pedidos/" + order.codigo).set(order); remote = true; }
    catch (x) { console.warn("db", x); }
  }
  order._remote = remote;
  saveLocalOrder(order);
  cart = []; saveCart(); store.set(draftKey, {});
  f.reset(); syncCheckout(); btn.disabled = false; btn.innerHTML = 'Enviar solicitud <span class="arr">→</span>';
  location.hash = "pedido-" + order.codigo;
});

/* ================= PEDIDO (enlace único) ================= */
let orderUnsub = null;
async function renderOrder(code) {
  const box = $("#orderBody");
  if (orderUnsub) { orderUnsub(); orderUnsub = null; }
  const local = localOrders()[code];
  const draw = (o, live) => {
    if (!o) { box.innerHTML = `<div class="page-head"><h1>No encontramos ese pedido.</h1><p class="lead">Revisa el código del enlace. Si acabas de enviarlo desde otro equipo, ábrelo en el mismo navegador o escríbenos.</p><a class="btn btn-y" href="#tienda">Ir a la tienda</a></div>`; return; }
    const e = estadoById(o.estado), msg = orderMessage(o);
    const idx = ESTADOS.findIndex(x => x.id === o.estado);
    const flow = ESTADOS.filter(x => x.id !== "cancelado");
    box.innerHTML = `<div class="conf">
      <span class="eyebrow"><span class="reg"></span>Solicitud recibida · guarda este enlace</span>
      <div class="ticket">
        <span class="cbar" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <span class="k">Código de pedido</span><span class="code">${esc(o.codigo)}</span>
        <div class="row"><span class="state" style="--sc:${e.c}"><i></i>${esc(e.label)}</span><span class="k">${new Date(o.creado).toLocaleString("es-VE")}</span>${live ? `<span class="k">· EN VIVO</span>` : ""}</div>
        ${o.cotizacion && o.cotizacion.totalUSD ? `<div style="display:grid;gap:4px"><span class="k">Cotización</span><b style="font-size:28px;font-family:var(--f-display)">USD ${fmtN(o.cotizacion.totalUSD)}</b>${o.cotizacion.condicionesPago ? `<span>${esc(o.cotizacion.condicionesPago)}</span>` : ""}${o.cotizacion.nota ? `<span style="color:#45474f">${esc(o.cotizacion.nota)}</span>` : ""}</div>` : `<p style="color:#45474f">Te enviaremos la cotización por WhatsApp al ${esc(o.cliente.telefono)} y al correo ${esc(o.cliente.correo)}.</p>`}
        <div class="row">
          ${CONFIG.whatsapp ? `<a class="btn btn-y" style="background:var(--key);color:var(--paper)" href="${waLink(CONFIG.whatsapp, msg)}" target="_blank" rel="noopener">Escribir por WhatsApp</a>` : `<span class="k">WhatsApp de la imprenta: por definir</span>`}
          <button class="btn btn-o" id="copyMsg">Copiar resumen</button>
          <button class="btn btn-o" id="copyLink">Copiar enlace</button>
        </div>
      </div>
      <div class="two" style="padding:0">
        <div class="items">${o.items.map(it => itemHTML(it, false)).join("")}</div>
        <aside class="sum"><h2>Estado</h2>
          <ol class="timeline">${(o.estado === "cancelado" ? [...flow.slice(0, 1), estadoById("cancelado")] : flow).map((s, i) => {
            const h = (o.historial || []).filter(x => x.estado === s.id).pop();
            const cls = s.id === o.estado ? "now" : (o.estado !== "cancelado" && i < idx ? "done" : "");
            return `<li class="${cls}"><i></i><span>${esc(s.label)}${h ? `<small>${new Date(h.fecha).toLocaleDateString("es-VE")}${h.nota ? " · " + esc(h.nota) : ""}</small>` : ""}</span></li>`;
          }).join("")}</ol>
          <dl><dt>Entrega</dt><dd style="font-family:var(--f-body)">${esc(entregaLine(o))}</dd>${o.fechaDeseada ? `<dt>Fecha deseada</dt><dd>${esc(o.fechaDeseada)}</dd>` : ""}<dt>Correo de la imprenta</dt><dd style="font-family:var(--f-body);user-select:all">${esc(CONFIG.email)}</dd></dl>
        </aside>
      </div>
      <textarea id="msgTxt" class="in" readonly aria-label="Resumen del pedido" style="min-height:160px;font-family:var(--f-mono);font-size:12.5px">${esc(msg)}</textarea>
    </div>`;
    $("#copyMsg").onclick = ev => copyText(msg, ev.currentTarget);
    $("#copyLink").onclick = ev => copyText(location.href, ev.currentTarget);
  };
  draw(local, false);
  if (db) {
    try {
      orderUnsub = db.doc("pedidos/" + code).onSnapshot(s => { if (s.exists) draw(s.data(), true); else if (!local) draw(null); }, () => {});
    } catch (_) {}
  } else if (!local) draw(null);
}

/* ================= PANEL ================= */
let panelUnsub = null, panelOrders = [], panelSel = null, panelFilter = "activos";
function renderPanel() {
  const body = $("#panelBody");
  if (!db) {
    body.innerHTML = `<div class="banner"><span class="reg"></span><div>El panel lee los pedidos guardados en la base de datos de esta página, y esta vista no tiene acceso a ella. Ábrela con tu sesión de Claude iniciada. En producción, este panel vive en Payload CMS con usuario y contraseña.</div></div>`;
    return;
  }
  if (!panelUnsub) {
    body.innerHTML = `<p class="lead">Cargando pedidos…</p>`;
    panelUnsub = db.collection("pedidos").orderBy("creado", "desc").limit(500).onSnapshot(s => {
      panelOrders = s.docs.map(d => d.data());
      if (currentView === "panel") drawPanel();
    }, er => { body.innerHTML = `<div class="banner"><span class="reg"></span><div>No se pudieron leer los pedidos (${esc(er.code)}). Revisa que tengas acceso de colaborador o editor a esta página.</div></div>`; });
  } else drawPanel();
}
function drawPanel() {
  const body = $("#panelBody");
  const active = o => !["entregado", "cancelado"].includes(o.estado);
  const list = panelOrders.filter(o => panelFilter === "todos" ? true : panelFilter === "activos" ? active(o) : o.estado === panelFilter);
  if (!panelOrders.length) {
    body.innerHTML = `<div class="empty"><h2>Aún no hay pedidos.</h2><p class="lead">Cuando un cliente envíe una solicitud desde la tienda, aparecerá aquí al instante con su código, productos, archivos y datos de entrega.</p><a class="btn btn-y" href="#tienda">Hacer un pedido de prueba</a></div>`;
    return;
  }
  if (!panelSel || !panelOrders.find(o => o.codigo === panelSel)) panelSel = (list[0] || panelOrders[0]).codigo;
  const sel = panelOrders.find(o => o.codigo === panelSel);
  const counts = id => panelOrders.filter(o => o.estado === id).length;
  body.innerHTML = `
  ${canEdit ? "" : `<div class="banner" style="margin-bottom:16px"><span class="reg"></span><div>Estás viendo el panel en modo lectura. Solo los editores de la página pueden cambiar estados y cotizaciones.</div></div>`}
  <div class="pfilters">${[["activos", "Activos"], ["todos", "Todos"], ...ESTADOS.map(e => [e.id, e.label])].map(([id, l]) => `<button class="chip" data-pf="${id}" aria-pressed="${panelFilter === id}">${esc(l)}${ESTADOS.find(e => e.id === id) ? ` · ${counts(id)}` : ""}</button>`).join("")}</div>
  <div class="panel">
    <div class="plist">${list.length ? list.map(o => { const e = estadoById(o.estado); return `<button class="prow" data-sel="${esc(o.codigo)}" aria-current="${o.codigo === panelSel}"><span class="state" style="--sc:${e.c};background:rgba(242,241,236,.06)"><i></i>${esc(e.label)}</span><span style="min-width:0"><b>${esc(o.codigo)}</b><span class="who" style="display:block">${esc(o.cliente.nombre)}${o.cliente.empresa ? " · " + esc(o.cliente.empresa) : ""}</span></span><small>${new Date(o.creado).toLocaleDateString("es-VE")}${o.urgente ? " · URGENTE" : ""}</small></button>`; }).join("") : `<p class="lead">No hay pedidos en este filtro.</p>`}</div>
    <div class="pdetail">${panelDetail(sel)}</div>
  </div>`;
}
function panelDetail(o) {
  const c = o.cliente, e = estadoById(o.estado), tel = phoneIntl(c.telefono);
  const msg = `Hola ${c.nombre.split(" ")[0]}, te escribimos de la imprenta por tu pedido ${o.codigo}. Estado: ${e.label}.${o.cotizacion && o.cotizacion.totalUSD ? ` Cotización: USD ${o.cotizacion.totalUSD}. ${o.cotizacion.condicionesPago || ""}` : ""} Puedes verlo aquí: ${location.href.split("#")[0]}#pedido-${o.codigo}`;
  return `
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center"><h2 style="font-size:30px">${esc(o.codigo)}</h2><span class="state" style="--sc:${e.c};background:rgba(242,241,236,.06)"><i></i>${esc(e.label)}</span></div>
    <dl class="kv">
      <dt>Cliente</dt><dd>${esc(c.nombre)} · ${esc(c.documento)}</dd>
      <dt>WhatsApp</dt><dd>${esc(c.telefono)}</dd><dt>Correo</dt><dd>${esc(c.correo)}</dd>
      ${c.empresa ? `<dt>Empresa</dt><dd>${esc(c.empresa)}</dd>` : ""}
      <dt>Factura fiscal</dt><dd>${c.factura ? `Sí · ${esc(c.razonSocial)} · ${esc(c.direccionFiscal)}` : "No"}</dd>
      <dt>Entrega</dt><dd>${esc(entregaLine(o))}</dd>
      <dt>Fecha deseada</dt><dd>${esc(o.fechaDeseada || "Sin fecha")}${o.urgente ? " · urgente" : ""}</dd>
      ${o.notas ? `<dt>Comentarios</dt><dd>${esc(o.notas)}</dd>` : ""}
    </dl>
    <div class="items">${o.items.map(it => itemHTML(it, false) + (it.archivos && it.archivos.length ? `<div class="files">${it.archivos.map(f => `<div><span>${esc(f.nombre)}</span><span>${fmtN(f.kb)} KB</span></div>`).join("")}</div>` : "")).join("")}</div>
    <form id="pedForm" style="display:grid;gap:14px;border-top:1px solid var(--line);padding-top:18px">
      <div class="grid2">
        <div class="field"><label for="pf-estado">Estado</label><select class="in" id="pf-estado" ${canEdit ? "" : "disabled"}>${ESTADOS.map(s => `<option value="${s.id}" ${s.id === o.estado ? "selected" : ""}>${esc(s.label)}</option>`).join("")}</select></div>
        <div class="field"><label for="pf-total">Total cotizado (USD)</label><input class="in" id="pf-total" inputmode="decimal" value="${esc(o.cotizacion && o.cotizacion.totalUSD || "")}" ${canEdit ? "" : "disabled"}></div>
      </div>
      <div class="field"><label for="pf-cond">Condiciones de pago</label><input class="in" id="pf-cond" placeholder="Ej. 50% de anticipo y 50% al retirar" value="${esc(o.cotizacion && o.cotizacion.condicionesPago || "")}" ${canEdit ? "" : "disabled"}></div>
      <div class="field"><label for="pf-nota">Nota del cambio <span class="hint">(la ve el cliente)</span></label><input class="in" id="pf-nota" ${canEdit ? "" : "disabled"}></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${canEdit ? `<button class="btn btn-y" type="submit">Guardar cambios</button>` : ""}
        ${tel.length >= 11 ? `<a class="btn btn-o" target="_blank" rel="noopener" href="${waLink(tel, msg)}">Escribir al cliente</a>` : ""}
        <button class="btn btn-o" type="button" id="pf-copy">Copiar mensaje</button>
        <a class="btn btn-o" href="#pedido-${esc(o.codigo)}">Ver como cliente</a>
      </div>
    </form>
    <div><span class="eyebrow" style="margin-bottom:10px">Historial</span><ol class="timeline">${(o.historial || []).slice().reverse().map(h => `<li class="done"><i></i><span>${esc(estadoById(h.estado).label)}<small>${new Date(h.fecha).toLocaleString("es-VE")}${h.nota ? " · " + esc(h.nota) : ""}</small></span></li>`).join("")}</ol></div>
    <textarea hidden id="pf-msg">${esc(msg)}</textarea>`;
}
$("#panelBody").addEventListener("click", e => {
  const f = e.target.closest("[data-pf]"); if (f) { panelFilter = f.dataset.pf; drawPanel(); return; }
  const s = e.target.closest("[data-sel]"); if (s) { panelSel = s.dataset.sel; drawPanel(); if (isMobile()) $(".pdetail").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); return; }
  if (e.target.id === "pf-copy") copyText($("#pf-msg").value, e.target);
});
$("#panelBody").addEventListener("submit", async e => {
  if (e.target.id !== "pedForm") return;
  e.preventDefault();
  const o = panelOrders.find(x => x.codigo === panelSel); if (!o || !db) return;
  const estado = $("#pf-estado").value, nota = $("#pf-nota").value.trim();
  const totalRaw = $("#pf-total").value.trim().replace(",", ".");
  const total = totalRaw ? Number(totalRaw) : null;
  if (totalRaw && !(total >= 0)) { toast("El total debe ser un número, por ejemplo 45.50"); return; }
  const cot = { totalUSD: total, condicionesPago: $("#pf-cond").value.trim(), nota: (o.cotizacion && o.cotizacion.nota) || "" };
  const patch = { cotizacion: cot };
  if (estado !== o.estado || nota) patch.historial = [...(o.historial || []), { estado, fecha: new Date().toISOString(), nota }];
  patch.estado = estado;
  try { await db.doc("pedidos/" + o.codigo).update(patch); toast("Cambios guardados"); }
  catch (x) { toast(x && x.code === "invalid_argument" ? "No tienes permiso para editar pedidos" : "No se pudo guardar. Intenta de nuevo."); }
});

/* ================= CAPACIDADES (db + user) ================= */
async function initCaps() {
  if (!window.claude || !window.claude.use) return;
  try {
    const [d, u] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    db = d; user = u;
    if (user) { try { canEdit = !!(await user.canEdit()); } catch (_) { canEdit = false; } }
    if (currentView === "panel") { panelUnsub = null; renderPanel(); }
    if (currentView === "pedido") renderOrder(parseHash().code);
  } catch (_) {}
}
