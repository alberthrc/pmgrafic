
/* ================= MOVIMIENTO =================
   Animaciones adaptadas de programas.ruvaestudio.com, sumadas a las que ya tenía
   el sitio (escena 3D, rueda de reels, carruseles infinitos, inclinación de rubros):
   - cargador con telones y letras, barra de progreso de lectura, cursor con etiqueta
     y botones magnéticos (solo con mouse)
   - títulos que entran línea por línea con máscara y revelados en lote
   - marquesinas que aceleran y se inclinan con la velocidad del scroll
   - muro de trabajos en dos carriles opuestos que giran con el scroll
   - muro de materiales que se voltea desde el centro y se ilumina al azar
   - tarjetas de soluciones apiladas, lista con imagen flotante que sigue al cursor
   - historias de Instagram en un teléfono, banner que se abre con el scroll
   - línea de pasos que se llena, preguntas frecuentes en acordeón
   - logo gigante del footer letra por letra y barra fija de cotizar en móvil */
window.Motion = (() => {
  const G = () => !!(window.gsap && window.ScrollTrigger);
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const safe = fn => { try { fn(); } catch (e) { console.warn("[motion]", e); } };
  const tickers = new Set();
  let lastT = performance.now();
  (function loop(now) { const dt = Math.min((now - lastT) / 1000, .1); lastT = now; tickers.forEach(f => f(dt, now)); requestAnimationFrame(loop); })(lastT);

  /* velocidad de scroll compartida (px por cuadro, con signo) */
  const SV = { v: 0, dir: 1, boost: 0 };
  let lastScroll = scrollY;
  tickers.add(() => {
    const y = scrollY, vel = y - lastScroll; lastScroll = y;
    if (Math.abs(vel) > .5) SV.dir = vel > 0 ? 1 : -1;
    SV.boost = Math.min(Math.max(SV.boost * .9, Math.abs(vel) * .9), 60);
  });

  /* ---------- contenido generado ---------- */
  const pick = slugs => slugs.map(byId).filter(Boolean);
  const catName = p => (catById(p.cat) || {}).name || "";
  function buildContent() {
    const A = pick(["letreros-3d", "rotulado-flotas", "impresion-uv", "neon-flex", "vallas", "corte-laser", "vinil-seguridad", "exhibidores-pop"]);
    const B = pick(["tarjetas-de-presentacion", "etiquetas-producto", "canvas", "grabado-laser", "roll-up", "bordados", "cajas-plegables", "talonarios-de-factura"]);
    const clip = (p, i) => `<a class="vclip${i % 3 === 1 ? " w" : ""}" href="#p-${p.slug}" data-cursor="Ver"><figure style="margin:0;height:100%">${imgHTML(p.model, p.name)}<figcaption><small>${esc(catName(p))}</small><b>${esc(p.name)}</b></figcaption></figure></a>`;
    if ($("#vrowA") && !$("#vrowA").children.length) $("#vrowA").innerHTML = A.map(clip).join("");
    if ($("#vrowB") && !$("#vrowB").children.length) $("#vrowB").innerHTML = B.map(clip).join("");
    $$(".fcard-media[data-model]").forEach(m => { if (!m.children.length) m.innerHTML = imgHTML(m.dataset.model, ""); });
    const st = $("#stories");
    if (st && !$(".story", st)) {
      const S = [["sign", "Neón Flex para tu local", "Instalado ✓"], ["banner", "Flota rotulada lista para salir", "Nuevo trabajo"], ["cards", "Tarjetas UV con relieve", "¿Te gustan?"], ["rollup", "Exhibidores P.O.P. para ferias", "Cotiza aquí ↗"], ["box", "Corte láser a medida", "En el taller"]];
      st.insertAdjacentHTML("afterbegin", S.map(([m, t, k]) => `<div class="story">${imgHTML(m, t)}<div class="story-cap"><span class="story-sticker">${k}</span><b>${t}</b></div></div>`).join(""));
      $(".story-bars", st).innerHTML = S.map(() => "<i><b></b></i>").join("");
    }
  }

  /* ---------- marquesinas con velocidad de scroll ---------- */
  const marquees = [];
  function initMarquees() {
    $$("[data-marquee]").forEach(track => {
      if (track._mq) return;
      const m = track._mq = { track, speed: +track.dataset.speed || 80, rev: track.hasAttribute("data-reverse") ? -1 : 1, skew: track.hasAttribute("data-skew"), x: 0, w: 0, visible: true };
      marquees.push(m);
      if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { m.visible = en.isIntersecting; }, { rootMargin: "100px" }).observe(track);
    });
    measureMarquees();
  }
  function measureMarquees() { marquees.forEach(m => { m.w = m.track.firstElementChild ? m.track.firstElementChild.getBoundingClientRect().width : 0; }); }
  tickers.add(dt => {
    if (reduce) return;
    marquees.forEach(m => {
      if (!m.visible || !m.w) return;
      m.x -= m.speed * (1 + SV.boost / 8) * dt * m.rev * SV.dir;
      if (m.x <= -m.w) m.x += m.w; if (m.x > 0) m.x -= m.w;
      m.track.style.transform = `translate3d(${m.x.toFixed(2)}px,0,0)` + (m.skew ? ` skewX(${(-SV.boost * .18 * SV.dir).toFixed(2)}deg)` : "");
    });
  });

  /* ---------- muro de trabajos: carriles en movimiento ---------- */
  const rows = [];
  function layoutRow(st) {
    const row = st.row;
    row.classList.remove("is-live");
    $$(".vclip", row).forEach(t => t.style.transform = "");
    const gap = parseFloat(getComputedStyle(row).columnGap) || 14;
    let tiles = $$(".vclip", row), ws = tiles.map(t => t.getBoundingClientRect().width);
    let W = ws.reduce((a, w) => a + w + gap, 0);
    if (!st.cloned && W && W < innerWidth + Math.max(...ws) + 80) {
      tiles.forEach(t => { const c = t.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.tabIndex = -1; $$("img", c).forEach(i => i.alt = ""); row.appendChild(c); });
      st.cloned = true; tiles = $$(".vclip", row); ws = tiles.map(t => t.getBoundingClientRect().width); W = ws.reduce((a, w) => a + w + gap, 0);
    }
    let x = 0; st.tiles = tiles; st.ws = ws; st.xs = ws.map(w => { const p = x; x += w + gap; return p; }); st.W = W;
    if (W) row.classList.add("is-live");
  }
  function initRows() {
    $$("[data-vrow]").forEach(row => {
      if (row._st) return;
      const st = row._st = { row, speed: +row.dataset.speed || 40, dir: row.hasAttribute("data-reverse") ? -1 : 1, off: 0, hover: false, visible: true, cloned: false, W: 0 };
      rows.push(st);
      row.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") st.hover = true; });
      row.addEventListener("pointerleave", () => { st.hover = false; });
      if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { st.visible = en.isIntersecting; }, { rootMargin: "200px" }).observe(row);
    });
    if (reduce) { rows.forEach(st => st.row.style.overflowX = "auto"); return; }
    relayoutRows();
  }
  function relayoutRows() { rows.forEach(st => { if (st.row.offsetParent) layoutRow(st); }); }
  tickers.add(dt => {
    if (reduce) return;
    rows.forEach(st => {
      if (!st.visible || !st.W || !st.tiles) return;
      st.hs = (st.hs ?? 1) + ((st.hover ? .3 : 1) - (st.hs ?? 1)) * .08;
      const sp = st.speed * (innerWidth < 700 ? 1.6 : 1) * st.hs * (1 + SV.boost / 9);
      st.off -= sp * dt * st.dir * SV.dir;
      for (let i = 0; i < st.tiles.length; i++) {
        const w = st.ws[i], m = (((st.xs[i] + st.off + w) % st.W) + st.W) % st.W - w;
        st.tiles[i].style.transform = `translate3d(${m.toFixed(1)}px,0,0)`;
      }
    });
  });

  /* ---------- historias en el teléfono ---------- */
  function initStories() {
    const scr = $("#stories"); if (!scr || scr._init) return; scr._init = true;
    const stories = $$(".story", scr), bars = $$(".story-bars b", scr), DUR = 4.2;
    let i = 0, el = 0, inView = false;
    const show = n => {
      stories.forEach((s, k) => s.classList.toggle("is-active", k === n));
      bars.forEach((b, k) => b.style.transform = `scaleX(${k < n ? 1 : 0})`);
      const stk = $(".story-sticker", stories[n]);
      if (G() && !reduce && stk) gsap.fromTo(stk, { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, duration: .8, ease: "back.out(2.2)", delay: .15 });
      i = n; el = 0;
    };
    const next = () => show((i + 1) % stories.length);
    scr.addEventListener("click", next);
    scr.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); } });
    if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { inView = en.isIntersecting; }, { threshold: .3 }).observe(scr);
    show(0);
    tickers.add(dt => {
      if (!inView || reduce || !stories.length) return;
      el += dt;
      if (bars[i]) bars[i].style.transform = `scaleX(${Math.min(el / DUR, 1)})`;
      if (el >= DUR) next();
    });
  }

  /* ---------- muro de materiales: brillo al azar ---------- */
  function initMatWall() {
    const wall = $("#matWall"); if (!wall || wall._init) return; wall._init = true;
    const tiles = $$(".mat-tile", wall); let vis = false;
    if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { vis = en.isIntersecting; }).observe(wall);
    if (reduce) return;
    setInterval(() => {
      if (!vis || document.hidden) return;
      const t = tiles[Math.floor(Math.random() * tiles.length)];
      t.classList.add("is-lit", "is-shine");
      if (G()) gsap.fromTo($(".mat-in", t), { scale: .8 }, { scale: 1, duration: .9, ease: "elastic.out(1,.5)" });
      setTimeout(() => t.classList.remove("is-lit"), 900);
      setTimeout(() => t.classList.remove("is-shine"), 1200);
    }, 1100);
  }

  /* ---------- preguntas frecuentes ---------- */
  function initFAQ() {
    $$(".qa").forEach((qa, n) => {
      if (qa._init) return; qa._init = true;
      const b = $(".qa-q", qa), a = $(".qa-a", qa), id = "qa-" + (n + 1);
      a.id = id; a.setAttribute("role", "region"); b.setAttribute("aria-controls", id);
      b.addEventListener("click", () => {
        const open = !qa.classList.contains("is-open");
        $$(".qa.is-open").forEach(o => { if (o !== qa) { o.classList.remove("is-open"); $(".qa-q", o).setAttribute("aria-expanded", "false"); } });
        qa.classList.toggle("is-open", open); b.setAttribute("aria-expanded", String(open));
        if (G()) setTimeout(() => ScrollTrigger.refresh(), 650);
      });
    });
    const first = $(".qa");
    if (first && !$(".qa.is-open")) { first.classList.add("is-open"); $(".qa-q", first).setAttribute("aria-expanded", "true"); }
  }

  /* ---------- progreso de lectura y barra móvil ---------- */
  function initChrome() {
    const bar = $("#sprog"), mcta = $("#mcta");
    let ctaVisible = false;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(ens => { ens.forEach(en => { en.target._in = en.isIntersecting; }); ctaVisible = $$("#reunion, #contacto").some(e => e._in); }, { threshold: .1 });
      $$("#reunion, #contacto").forEach(e => io.observe(e));
    }
    tickers.add(() => {
      const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      if (mcta) {
        const show = y > vh * .75 && !ctaVisible && ["inicio", "tienda", "producto"].includes(currentView) && !document.body.classList.contains("menu-open");
        if (show !== mcta._s) { mcta._s = show; mcta.classList.toggle("is-visible", show); mcta.setAttribute("aria-hidden", String(!show)); $$("a", mcta).forEach(a => a.tabIndex = show ? 0 : -1); }
      }
    });
  }

  /* ---------- títulos divididos en líneas (sin plugins) ---------- */
  function splitLines(el) {
    if (!el.dataset.splitSrc) el.dataset.splitSrc = el.textContent.trim().replace(/\s+/g, " ");
    const words = el.dataset.splitSrc.split(" ");
    el.innerHTML = words.map(w => `<span class="sl-w" style="display:inline-block">${esc(w)}</span>`).join(" ");
    const lines = []; let top = null;
    $$(".sl-w", el).forEach(w => { const t = w.offsetTop; if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; } lines[lines.length - 1].push(w.textContent); });
    el.setAttribute("aria-label", el.dataset.splitSrc);
    el.innerHTML = lines.map(l => `<span class="sl-line" aria-hidden="true"><span class="sl-in">${esc(l.join(" "))}</span></span>`).join("");
    return $$(".sl-in", el);
  }
  let splitT;
  addEventListener("resize", () => {
    clearTimeout(splitT);
    splitT = setTimeout(() => { $$("[data-split][data-split-done]").forEach(el => { if (el.offsetParent) splitLines(el); }); relayoutRows(); measureMarquees(); }, 220);
  });

  /* ---------- cursor y botones magnéticos (solo mouse) ---------- */
  function initCursor() {
    if (!FINE || reduce || !G()) return;
    document.documentElement.classList.add("has-cursor");
    const c = $("#cursor"), dot = $(".cursor-dot", c), ring = $(".cursor-ring", c), label = $("#cursorLabel");
    const dx = gsap.quickTo(dot, "x", { duration: .1, ease: "power3" }), dy = gsap.quickTo(dot, "y", { duration: .1, ease: "power3" });
    const rx = gsap.quickTo([ring, label], "x", { duration: .5, ease: "power3" }), ry = gsap.quickTo([ring, label], "y", { duration: .5, ease: "power3" });
    addEventListener("pointermove", e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    document.addEventListener("pointerover", e => {
      const lab = e.target.closest("[data-cursor]"), link = e.target.closest("a, button, label, select, input, textarea, [role=button]");
      c.classList.toggle("is-label", !!lab);
      c.classList.toggle("is-link", !!link && !lab);
      if (lab) label.textContent = lab.dataset.cursor;
    });
    document.addEventListener("pointerleave", () => gsap.to(c, { opacity: 0, duration: .3 }));
    document.addEventListener("pointerenter", () => gsap.to(c, { opacity: 1, duration: .3 }));
    // botones magnéticos (los del header incluidos)
    $$(".hdr-actions .btn").forEach(b => b.setAttribute("data-magnetic", ""));
    magnetize(document);
  }
  function magnetize(root) {
    if (!FINE || reduce || !G()) return;
    $$("[data-magnetic]", root).forEach(btn => {
      if (btn._mag) return; btn._mag = true;
      btn.style.transitionProperty = "background, border-color, color";
      const xTo = gsap.quickTo(btn, "x", { duration: .8, ease: "elastic.out(1,.4)" }), yTo = gsap.quickTo(btn, "y", { duration: .8, ease: "elastic.out(1,.4)" });
      btn.addEventListener("pointermove", e => { const r = btn.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .22); yTo((e.clientY - r.top - r.height / 2) * .32); });
      btn.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- lista destacada: imagen flotante ---------- */
  function initStageFloat() {
    const fl = $("#stageFloat"); if (!fl || fl._init || !FINE || reduce || !G()) return; fl._init = true;
    const box = $(".sf-in", fl);
    const xTo = gsap.quickTo(fl, "x", { duration: .7, ease: "power3" }), yTo = gsap.quickTo(fl, "y", { duration: .7, ease: "power3" }), rTo = gsap.quickTo(fl, "rotation", { duration: .9, ease: "power3" });
    let lastX = 0;
    $$(".stage-row").forEach(row => {
      row.addEventListener("pointerenter", () => {
        const src = IMG[row.dataset.model];
        box.innerHTML = src ? `<img src="${src}" alt="">` : "";
        gsap.to(fl, { opacity: 1, scale: 1, duration: .55, ease: "back.out(1.7)", overwrite: "auto" });
        const im = $("img", box); if (im) gsap.fromTo(im, { scale: 1.3 }, { scale: 1, duration: .9, ease: "expo.out" });
      });
      row.addEventListener("pointerleave", () => gsap.to(fl, { opacity: 0, scale: .6, duration: .4, ease: "power3.out", overwrite: "auto" }));
    });
    addEventListener("pointermove", e => { xTo(e.clientX - fl.offsetWidth / 2 + 70); yTo(e.clientY - fl.offsetHeight / 2); rTo(gsap.utils.clamp(-16, 16, (e.clientX - lastX) * .9)); lastX = e.clientX; });
  }

  /* ---------- cargador con telones ---------- */
  function initLoader() {
    const ld = $("#loader"); if (!ld || !G() || reduce || ld.classList.contains("done")) return;
    ld.classList.add("curtain");
    gsap.from(".ld-l", { yPercent: 120, rotate: 10, duration: .9, stagger: .06, ease: "back.out(1.7)" });
    let ran = false;
    const out = () => {
      if (ran) return; ran = true;
      gsap.timeline({ onComplete: () => { ld.classList.add("gone"); if (G()) ScrollTrigger.refresh(); } })
        .to(".ld-l", { yPercent: -120, duration: .5, stagger: .035, ease: "power3.in" })
        .to(".loader-in > :not(.ld-word)", { opacity: 0, y: -12, duration: .35 }, "<")
        .to(".loader .lp-b", { yPercent: -100, duration: .85, ease: "expo.inOut" }, ">-0.1")
        .to(".loader .lp-a", { yPercent: -100, duration: .85, ease: "expo.inOut" }, "<0.12");
    };
    new MutationObserver(() => { if (ld.classList.contains("done")) out(); }).observe(ld, { attributes: true, attributeFilter: ["class"] });
  }

  /* ---------- footer: logo gigante (global, no depende de la vista) ---------- */
  function initFooter() {
    if (!G() || reduce) return;
    gsap.from(".foot-word .fl", { yPercent: 110, rotation: 6, ease: "power3.out", stagger: .08, scrollTrigger: { trigger: ".foot-word", start: "top 98%", end: "bottom bottom", scrub: 1 } });
  }

  /* ---------- animaciones del inicio (se crean al entrar y se revierten al salir) ---------- */
  let ctx = null;
  function enter() {
    buildContent();
    initMarquees(); initRows(); initStories(); initMatWall(); initFAQ(); initStageFloat();
    requestAnimationFrame(() => { relayoutRows(); measureMarquees(); });
    if (!G() || reduce) return;
    if (ctx) ctx.revert();
    ctx = gsap.context(() => {
      const once = (trigger, start = "top 88%") => ({ trigger, start, once: true });
      // títulos línea por línea
      $$("#v-inicio [data-split]").forEach(el => {
        if (!el.offsetParent) return;
        const lines = splitLines(el); el.dataset.splitDone = "1";
        gsap.from(lines, { yPercent: 115, duration: 1.15, ease: "expo.out", stagger: .09, scrollTrigger: once(el) });
      });
      // revelados en lote
      gsap.set("#v-inicio [data-reveal]", { y: 40, opacity: 0 });
      ScrollTrigger.batch("#v-inicio [data-reveal]", { start: "top 92%", once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: .09, overwrite: true }) });
      // marquesina gigante: palabras que suben
      gsap.from(".bigmq-g:first-child > *", { yPercent: 100, opacity: 0, duration: 1.2, stagger: .05, ease: "expo.out", scrollTrigger: once(".bigmq", "top 95%") });
      // muro de trabajos: entrada lateral y giro con el scroll
      gsap.from(".vrow", { xPercent: i => (i ? -12 : 12), opacity: 0, duration: 1.8, ease: "expo.out", stagger: .12, scrollTrigger: once(".vwall", "top 85%") });
      gsap.fromTo(".vwall", { rotate: -1.5 }, { rotate: 1.5, ease: "none", scrollTrigger: { trigger: ".vwall", start: "top bottom", end: "bottom top", scrub: true } });
      // muro de materiales: se voltea desde el centro
      gsap.from(".mat-tile", { rotationX: -95, y: 50, opacity: 0, transformOrigin: "50% 100%", duration: 1.2, ease: "expo.out", stagger: { each: .05, grid: "auto", from: "center" }, scrollTrigger: once("#matWall", "top 82%") });
      gsap.from(".topics-row", { xPercent: i => (i ? 10 : -10), opacity: 0, duration: 1.6, ease: "expo.out", stagger: .1, scrollTrigger: once(".topics", "top 92%") });
      // pasos: números con rebote y línea que se llena
      gsap.from("#steps .step .n", { scale: 0, duration: .9, stagger: .12, ease: "back.out(2.5)", delay: .3, scrollTrigger: once("#steps", "top 80%") });
      gsap.to(".steps-line span", { scaleX: 1, ease: "none", scrollTrigger: { trigger: "#steps", start: "top 70%", end: "bottom 60%", scrub: true } });
      // soluciones apiladas
      const cards = $$(".fcard");
      cards.forEach(card => {
        gsap.from($(".fcard-media", card), { clipPath: "inset(20% 20% 20% 20% round 28px)", duration: 1.4, ease: "expo.out", scrollTrigger: once(card, "top 75%") });
        gsap.from($$(".fcard-body > *", card), { y: 40, opacity: 0, duration: 1, stagger: .06, ease: "expo.out", scrollTrigger: once(card, "top 75%") });
      });
      gsap.matchMedia().add("(min-width: 901px)", () => {
        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;
          gsap.to(card, { scale: .9 + i * .015, "--dim": .38, ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 20%", scrub: true } });
        });
      });
      // catálogo y rubros (sus entradas ya existen en la escena 3D; aquí solo el rebote del punto)
      gsap.from(".rubro .dot", { scale: 0, rotation: () => gsap.utils.random(-25, 25), duration: 1.4, stagger: .09, ease: "elastic.out(1,.55)", scrollTrigger: once("#rubros", "top 80%") });
      // lista destacada
      gsap.from(".stage-row", { y: 50, opacity: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: once("#stageList", "top 85%") });
      // cifras
      gsap.from(".stat", { y: 50, opacity: 0, duration: 1, stagger: .07, ease: "expo.out", scrollTrigger: once(".stats", "top 88%") });
      // Instagram: banner que se abre, teléfono que entra y flota
      gsap.fromTo("#impact", { clipPath: "inset(8% 6% 8% 6% round 36px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none", scrollTrigger: { trigger: "#impact", start: "top 92%", end: "top 35%", scrub: true } });
      gsap.from(".phone-dev", { y: 120, rotation: 8, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: once("#phone", "top 85%") });
      gsap.to(".phone-dev", { y: -14, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6 });
      // zonas, preguntas y CTA
      gsap.from(".zone", { y: 50, opacity: 0, duration: 1, stagger: .1, ease: "expo.out", scrollTrigger: once(".zone-grid", "top 88%") });
      gsap.from(".zone .chips span", { scale: .4, opacity: 0, duration: .9, stagger: .04, ease: "back.out(2)", scrollTrigger: once(".zone-grid", "top 85%") });
      gsap.from(".qa", { y: 40, opacity: 0, duration: 1, stagger: .07, ease: "expo.out", scrollTrigger: once(".faq-list", "top 85%") });
      gsap.fromTo("#ctaBand", { clipPath: "inset(10% 8% 10% 8% round 36px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: "#ctaBand", start: "top 95%", end: "top 45%", scrub: true } });
      gsap.from("#ctaBand .btns > *, #ctaBand .phones", { y: 30, opacity: 0, duration: 1, stagger: .08, ease: "expo.out", scrollTrigger: once("#ctaBand", "top 70%") });
      // escena 3D: los textos siguen un poco al puntero
      if (FINE && $(".chap-area")) {
        const ax = gsap.quickTo(".chap-area", "x", { duration: 1.2, ease: "power3" }), ay = gsap.quickTo(".chap-area", "y", { duration: 1.2, ease: "power3" });
        $("#stage").addEventListener("pointermove", e => { ax((e.clientX / innerWidth - .5) * -22); ay((e.clientY / innerHeight - .5) * -12); });
      }
    }, "#v-inicio");
    magnetize($("#v-inicio"));
    // las imágenes de referencia llegan después: reacomodar carriles y recalcular
    setTimeout(() => { relayoutRows(); measureMarquees(); ScrollTrigger.refresh(); }, 900);
  }
  function leave() { if (ctx) { ctx.revert(); ctx = null; } $$("#v-inicio [data-split-done]").forEach(el => { el.textContent = el.dataset.splitSrc; el.removeAttribute("data-split-done"); el.removeAttribute("aria-label"); }); }

  /* ---------- arranque ---------- */
  safe(initLoader);
  safe(initChrome);
  safe(initCursor);
  safe(initFooter);
  safe(initMarquees);
  // cuando una imagen de referencia reemplaza su marcador, los anchos cambian
  if ("MutationObserver" in window) {
    let mt; new MutationObserver(() => { clearTimeout(mt); mt = setTimeout(() => { relayoutRows(); measureMarquees(); }, 150); }).observe($("#vwall") || document.body, { childList: true, subtree: true });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measureMarquees(); relayoutRows(); });
  return { enter: () => safe(enter), leave: () => safe(leave), magnetize };
})();
if (currentView === "inicio") Motion.enter();
