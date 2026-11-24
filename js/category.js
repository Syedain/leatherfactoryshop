/* =========================================================
   LFS — Category page: one rack, up close (+ grid view)
   ========================================================= */
(() => {
  "use strict";
  const L = window.LFS, D = L.D, { $, $$ } = L;
  const slug = new URLSearchParams(location.search).get("cat");
  const CAT = D.CATS.find(c => c.slug === slug) || D.CATS[0];
  const ALL = D.inCat(CAT.slug);

  document.title = `${CAT.full} Leather Jackets | Leather Factory Shop`;
  document.body.dataset.nav = CAT.group ? CAT.group.toLowerCase() : CAT.slug;
  $$(`[data-nav="${document.body.dataset.nav}"]`).forEach(a => a.classList.add("is-current"));
  if (CAT.group) $("#crumbGroup").innerHTML = `<span>/</span><a href="${L.url.cat(D.CATS.find(c => c.group === CAT.group).slug)}">${CAT.group}</a><span>/</span>`;
  else $("#crumbGroup").innerHTML = `<span>/</span>`;
  $("#crumbCat").textContent = CAT.name;
  $("#catTitle").innerHTML = `${CAT.group ? CAT.group + "'s " : ""}${CAT.name}${CAT.virtual ? "" : " <em>jackets.</em>"} <span class="count-pill">${ALL.length}</span>`;
  $("#catTitle").setAttribute("data-split", ""); $("#catTitle").setAttribute("data-now", "");
  $("#catLine").textContent = CAT.line;

  /* ---------------------------------------------------------
     RACK
  --------------------------------------------------------- */
  const track = $("#track"), pin = $(".rack__pin");
  let JW = 300, SP = 345, PADL = 120;
  function measure() {
    const h = pin.clientHeight;
    JW = Math.round(Math.max(170, Math.min(innerWidth < 700 ? innerWidth * 0.56 : 290, (h * 0.62 - 100) / 1.25)));
    SP = Math.round(JW * (innerWidth < 700 ? 1.12 : 1.2));
    PADL = Math.round(Math.max(innerWidth * 0.12, 60));
    document.documentElement.style.setProperty("--jw", JW + "px");
  }
  const slots = ALL.map((p, i) => {
    const el = document.createElement("div");
    el.className = "slot";
    el.innerHTML = `<div class="slot__light"></div><div class="slot__shadow"></div>
      <a class="item" href="${L.url.product(p)}" data-cursor="View" aria-label="${p.name}, ${L.range(p)}">${L.itemHTML(p)}</a>
      <div class="slot__meta"><h3>${p.name}</h3><p>${L.range(p)}</p></div>`;
    track.appendChild(el);
    return { p, el, item: $(".item", el), tag: $(".item__tag", el), shadow: $(".slot__shadow", el), x: 0, y: -1600, visible: true, order: i, theta: (Math.random() - 0.5) * 0.1, omega: 0, lastSX: null };
  });
  function layout(animate) {
    let k = 0;
    slots.slice().sort((a, b) => a.order - b.order).forEach(s => {
      if (!s.visible) return;
      const tx = PADL + k * SP; k++;
      if (animate) gsap.to(s, { x: tx, duration: 1, ease: "power3.inOut" }); else s.x = tx;
    });
    track.style.width = Math.max(PADL * 2 + Math.max(0, k - 1) * SP + JW, innerWidth) + "px";
    $("#rackNum").textContent = k;
    return k;
  }
  measure(); layout(false);

  const dist = () => Math.max(0, track.offsetWidth - innerWidth);
  gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: pin, start: "top top", end: () => "+=" + Math.max(dist(), innerHeight * 0.5), pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: s => gsap.set("#rackBar", { scaleX: s.progress }) } });
  ScrollTrigger.create({ trigger: pin, start: "top 90%", once: true, onEnter: () => slots.forEach((s, i) => gsap.to(s, { y: 0, duration: 1.1, delay: 0.2 + i * 0.08, ease: "back.out(1.1)", onComplete: () => (s.omega += (Math.random() - 0.5) * 0.05) })) });

  const trackX = () => gsap.getProperty(track, "x") || 0;
  gsap.ticker.add((time, ms) => {
    const dt = Math.min(ms / 16.67, 3), tx = trackX();
    slots.forEach((s, i) => {
      const sx = tx + s.x;
      if (s.lastSX !== null) s.omega += Math.max(-0.008, Math.min(0.008, -(sx - s.lastSX) * 0.0004));
      s.lastSX = sx;
      L.stepBody(s, dt, i, time);
      s.el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      L.renderBody(s);
      s.shadow.style.transform = `translateX(${s.theta * JW * 0.9}px) scaleX(${1 - Math.abs(s.theta) * 0.4})`;
      s.shadow.style.opacity = s.y < -50 ? 0 : 1;
    });
  });

  let hovered = null, lastX = null;
  window.addEventListener("pointermove", e => {
    const dx = lastX === null ? 0 : e.clientX - lastX; lastX = e.clientX;
    if (view !== "rack") return;
    const pr = pin.getBoundingClientRect(), railY = pr.top + pr.height * 0.22, tx = trackX();
    let found = null;
    slots.forEach(s => {
      if (!s.visible) return;
      const left = pr.left + tx + s.x;
      if (e.clientX > left + JW * 0.08 && e.clientX < left + JW * 0.92 && e.clientY > railY && e.clientY < railY + JW * 1.3) {
        found = s;
        s.omega += Math.max(-0.05, Math.min(0.05, dx * 0.0011 * (0.35 + 0.65 * Math.min(1, (e.clientY - railY) / (JW * 1.1)))));
      }
    });
    if (found !== hovered) { hovered && hovered.el.classList.remove("is-hover"); hovered = found; hovered && hovered.el.classList.add("is-hover"); }
  });

  /* clicking a jacket lifts it off the rail before the product page opens */
  track.addEventListener("click", e => {
    const a = e.target.closest(".item"); if (!a) return;
    e.preventDefault();
    const s = slots.find(x => x.item === a);
    s.omega += 0.08;
    gsap.to(s, { y: -40, duration: 0.4, ease: "power2.out" });
    gsap.to(a, { scale: 1.08, duration: 0.4 });
    setTimeout(() => L.leaveTo(a.href), 250);
  });

  /* ---------------------------------------------------------
     FILTER + SORT (rack and grid)
  --------------------------------------------------------- */
  const F = { all: () => true, lo: p => p.price[0] < 150, mid: p => p.price[0] >= 150 && p.price[0] < 250, hi: p => p.price[0] >= 250 };
  const SORT = {
    default: (a, b) => ALL.indexOf(a) - ALL.indexOf(b),
    popularity: (a, b) => (b.rating || 0) - (a.rating || 0),
    rating: (a, b) => (b.rating || 0) - (a.rating || 0),
    latest: (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.id - a.id,
    "price-asc": (a, b) => a.price[0] - b.price[0],
    "price-desc": (a, b) => b.price[0] - a.price[0]
  };
  let filter = "all", sort = "default", view = "rack", busy = false;

  function applyRack() {
    busy = true;
    const order = ALL.slice().sort(SORT[sort]);
    slots.forEach(s => (s.order = order.indexOf(s.p)));
    const m = F[filter];
    const leaving = slots.filter(s => s.visible && !m(s.p)), coming = slots.filter(s => !s.visible && m(s.p));
    leaving.forEach((s, i) => { s.omega += (Math.random() - 0.5) * 0.12; gsap.to(s, { y: -innerHeight, duration: 0.7, delay: i * 0.05, ease: "power3.in", onComplete: () => { s.visible = false; s.el.style.visibility = "hidden"; } }); });
    gsap.delayedCall(leaving.length ? 0.75 + leaving.length * 0.05 : 0, () => {
      coming.forEach(s => { s.visible = true; s.el.style.visibility = "visible"; });
      let k = 0;
      slots.slice().sort((a, b) => a.order - b.order).forEach(s => { if (!s.visible) return; if (coming.includes(s)) { s.x = PADL + k * SP; s.lastSX = null; s.y = -innerHeight; } k++; });
      const n = layout(true);
      $(".rack__empty") && $(".rack__empty").remove();
      if (!n) pin.insertAdjacentHTML("beforeend", `<p class="rack__empty">Nothing on this rack in that price range.</p>`);
      coming.forEach((s, i) => gsap.to(s, { y: 0, duration: 1, delay: 0.2 + i * 0.07, ease: "back.out(1.2)", onComplete: () => (s.omega += (Math.random() - 0.5) * 0.06) }));
      gsap.delayedCall(1.3, () => { ScrollTrigger.refresh(); busy = false; });
    });
  }

  const grid = $("#pgrid");
  function applyGrid() {
    const list = ALL.filter(F[filter]).sort(SORT[sort]);
    grid.innerHTML = list.length ? list.map(L.cardHTML).join("") : `<p class="lead">Nothing in that price range.</p>`;
    gsap.fromTo($$(".pcard", grid), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.7, ease: "power3.out" });
    ScrollTrigger.refresh();
  }
  const apply = () => (view === "grid" ? applyGrid() : L.lenis ? L.lenis.scrollTo($("#rack"), { duration: 1, onComplete: applyRack }) : applyRack());

  $$(".chip").forEach(c => c.addEventListener("click", () => {
    if (busy || c.classList.contains("is-active")) return;
    $$(".chip").forEach(x => x.classList.toggle("is-active", x === c));
    filter = c.dataset.f; apply();
  }));
  $("#sort").addEventListener("change", e => { if (busy) return; sort = e.target.value; apply(); });

  $$(".view-toggle button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.view === view || busy) return;
    view = b.dataset.view;
    $$(".view-toggle button").forEach(x => x.classList.toggle("is-on", x === b));
    const rack = $("#rack"), gw = $("#gridWrap");
    if (view === "grid") {
      gsap.to(rack, { opacity: 0, duration: 0.3, onComplete: () => { rack.hidden = true; gw.hidden = false; applyGrid(); } });
    } else {
      gw.hidden = true; rack.hidden = false; gsap.set(rack, { opacity: 1 });
      const m = F[filter], order = ALL.slice().sort(SORT[sort]);
      slots.forEach(s => { s.order = order.indexOf(s.p); s.visible = m(s.p); s.el.style.visibility = s.visible ? "visible" : "hidden"; });
      layout(false); ScrollTrigger.refresh();
      slots.forEach((s, i) => { if (s.visible) { s.y = -innerHeight; gsap.to(s, { y: 0, duration: 1, delay: i * 0.06, ease: "back.out(1.2)" }); } });
    }
  }));

  $("#moreRacks").innerHTML = D.CATS.filter(c => c !== CAT).map(L.miniHTML).join("");
  gsap.fromTo($$(".mini"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: "#moreRacks", start: "top 88%" } });

  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { measure(); layout(false); ScrollTrigger.refresh(); }, 200); });
})();
