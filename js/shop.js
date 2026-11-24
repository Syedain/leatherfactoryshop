/* =========================================================
   LFS — Shop page: the store floor
   One freestanding rack per category; scroll to walk past,
   click a rack to step up to it (opens the category page).
   ========================================================= */
(() => {
  "use strict";
  const L = window.LFS, D = L.D, { $, $$ } = L;
  const pin = $(".floor__pin"), track = $("#floorTrack");
  $("#floorNum").textContent = D.CATS.length;
  $("#floorJackets").textContent = D.PRODUCTS.length;

  let RW = 520, GAP = 140, PADL = 140, JW = 120;
  function measure() {
    const h = pin.clientHeight;
    RW = Math.round(Math.min(540, Math.max(290, innerWidth < 700 ? innerWidth * 0.8 : innerWidth * 0.36), h * 0.72));
    JW = Math.round(RW * 0.25);
    GAP = Math.round(RW * (innerWidth < 700 ? 0.2 : 0.28));
    PADL = Math.round(Math.max(innerWidth * 0.08, 40));
    pin.style.setProperty("--rw", RW + "px");
    pin.style.setProperty("--fjw", JW + "px");
  }
  measure();

  const racks = D.CATS.map((c, ci) => {
    const ps = D.inCat(c.slug).slice(0, 4);
    const a = document.createElement("a");
    a.className = "frack" + (ci % 2 ? " frack--back" : "");
    a.href = L.url.cat(c.slug);
    a.setAttribute("aria-label", `${c.full}: ${c.count} jackets`);
    a.dataset.cursor = "Browse";
    a.innerHTML = `
      <div class="frack__body">
        <div class="frack__light"></div>
        <div class="frack__sign"><i class="wire wire--l"></i><i class="wire wire--r"></i>
          <div class="board"><small>${c.group ? c.group.toUpperCase() : String(ci + 1).padStart(2, "0")}</small><b>${c.name}</b><span>${c.count} jacket${c.count === 1 ? "" : "s"}</span></div></div>
        <div class="frack__frame"><i class="pole pole--l"></i><i class="pole pole--r"></i><i class="bar"></i><i class="foot foot--l"></i><i class="foot foot--r"></i></div>
        <div class="frack__items">${ps.map(p => `<div class="item">${L.itemHTML(p, { tag: false })}</div>`).join("")}</div>
        <div class="frack__shadow"></div>
        <span class="frack__cta">Step up to the rack →</span>
      </div>`;
    track.appendChild(a);
    return { c, a, body: $(".frack__body", a), bodies: $$(".item", a).map(item => ({ item, tag: null, theta: (Math.random() - 0.5) * 0.08, omega: 0 })), x: 0, lastSX: null, factor: ci % 2 ? 0.86 : 1, products: D.inCat(c.slug) };
  });

  function layout() {
    racks.forEach((r, i) => {
      r.x = PADL + i * (RW + GAP) * 0.9;
      const items = $$(".item", r.a);
      items.forEach((it, k) => { it.style.left = `${RW * 0.05 + k * (RW * 0.9 - JW) / Math.max(1, items.length - 1)}px`; });
    });
    track.style.width = Math.max(innerWidth, racks[racks.length - 1].x + RW + PADL) + "px";
  }
  layout();

  const dist = () => Math.max(0, track.offsetWidth - innerWidth);
  gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + dist() * 1.1, pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: s => gsap.set("#floorBar", { scaleX: s.progress }) } });

  gsap.set(racks.map(r => r.body), { y: 90, opacity: 0 });
  ScrollTrigger.create({ trigger: pin, start: "top 80%", once: true, onEnter: () => racks.forEach((r, i) => gsap.to(r.body, { y: 0, opacity: 1, duration: 1.2, delay: i * 0.1, ease: "expo.out", onComplete: () => r.bodies.forEach(b => (b.omega += (Math.random() - 0.5) * 0.06)) })) });

  const trackX = () => gsap.getProperty(track, "x") || 0;
  const wall = $("#wall"), planks = $("#planks");
  gsap.ticker.add((time, ms) => {
    const dt = Math.min(ms / 16.67, 3), tx = trackX();
    racks.forEach((r, ri) => {
      const px = r.x + tx * (r.factor - 1);
      r.a.style.transform = `translate3d(${px}px,0,0)`;
      const sx = tx + px;
      if (r.lastSX !== null) { const v = sx - r.lastSX; r.bodies.forEach(b => (b.omega += Math.max(-0.008, Math.min(0.008, -v * 0.0005)))); }
      r.lastSX = sx;
      r.bodies.forEach((b, i) => { L.stepBody(b, dt, ri * 4 + i, time); L.renderBody(b); });
    });
    wall.style.transform = `translate3d(${tx * 0.35}px,0,0)`;
    planks.style.backgroundPositionX = `${tx * 1.15}px`;
  });

  let hovered = null, lastX = null;
  window.addEventListener("pointermove", e => {
    const dx = lastX === null ? 0 : e.clientX - lastX; lastX = e.clientX;
    const el = e.target.closest && e.target.closest(".frack");
    const r = el && racks.find(x => x.a === el);
    if (r) r.bodies.forEach(b => {
      const rc = b.item.getBoundingClientRect();
      if (e.clientX > rc.left && e.clientX < rc.right && e.clientY > rc.top && e.clientY < rc.bottom) b.omega += Math.max(-0.05, Math.min(0.05, dx * 0.0016));
    });
    if (r !== hovered) {
      hovered && hovered.a.classList.remove("is-hover");
      hovered = r;
      if (r) { r.a.classList.add("is-hover"); r.bodies.forEach(b => (b.omega += (Math.random() - 0.5) * 0.03)); }
    }
  });

  /* step up to the rack, then open the category */
  let leaving = false;
  racks.forEach(r => r.a.addEventListener("click", e => {
    e.preventDefault(); e.stopPropagation();
    if (leaving) return;
    leaving = true;
    L.cursor.set(false);
    const rect = r.body.getBoundingClientRect();
    const scale = Math.min(2.6, (innerHeight * 1.35) / rect.height);
    racks.forEach(o => { if (o !== r) gsap.to(o.a, { opacity: 0.08, filter: "blur(6px)", duration: 0.7 }); });
    gsap.to(".rack__hud, .floor__wall", { opacity: 0.2, duration: 0.6 });
    r.bodies.forEach(b => (b.omega += (Math.random() - 0.5) * 0.08));
    gsap.to(r.body, { x: innerWidth / 2 - (rect.left + rect.width / 2), y: innerHeight * 0.55 - (rect.top + rect.height * 0.45), scale, duration: 1.1, ease: "power3.inOut", transformOrigin: "50% 45%" });
    gsap.delayedCall(0.75, () => L.leaveTo(r.a.href));
  }, true));
  window.addEventListener("pageshow", e => {
    if (!e.persisted) return;
    leaving = false;
    racks.forEach(o => { gsap.set(o.a, { clearProps: "opacity,filter" }); gsap.set(o.body, { x: 0, y: 0, scale: 1 }); });
    gsap.set(".rack__hud, .floor__wall", { opacity: 1 });
  });

  /* search: dim racks with no match, walk to the best one */
  const input = $("#floorSearch"), hint = $("#floorHint");
  function search() {
    const q = input.value.trim().toLowerCase();
    let best = null, total = 0;
    racks.forEach(r => {
      const hits = !q ? r.products.length : r.products.filter(p => (p.name + " " + r.c.full).toLowerCase().includes(q)).length;
      r.hits = hits; if (q) total += hits;
      r.a.classList.toggle("is-dim", !!q && !hits);
      if (q && hits && (!best || hits > best.hits)) best = r;
    });
    hint.textContent = !q ? "" : best ? `${total} match${total === 1 ? "" : "es"} · Enter to open ${best.c.full}` : "No jackets found";
    return best;
  }
  input.addEventListener("input", () => {
    const best = search(); if (!best) return;
    const st = ScrollTrigger.getAll().find(t => t.pin === pin); if (!st) return;
    const target = st.start + (st.end - st.start) * Math.min(1, Math.max(0, (best.x - innerWidth / 2 + RW / 2) / Math.max(1, dist())));
    if (L.lenis) L.lenis.scrollTo(target, { duration: 1.2 }); else window.scrollTo({ top: target, behavior: "smooth" });
  });
  input.addEventListener("keydown", e => { if (e.key === "Enter") { const b = search(); if (b) b.a.click(); } });

  $("#catList").innerHTML = D.CATS.map(L.miniHTML).join("");
  gsap.fromTo($$(".mini"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: "#catList", start: "top 88%" } });

  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { measure(); layout(); ScrollTrigger.refresh(); }, 200); });
})();
