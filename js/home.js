/* =========================================================
   LFS — Home page interactions
   ========================================================= */
(() => {
  "use strict";
  const L = window.LFS, D = L.D, { $, $$ } = L;

  /* ---------------------------------------------------------
     HERO: one jacket at a time slides along the rail
  --------------------------------------------------------- */
  const hero = $("#hero"), stage = $("#heroStage"), hang = $("#heroHangers");
  const heroList = ["black-bomber-leather-jacket", "classic-moto-jacket", "back-skull-speckled-chic-pink", "bomber-leather-jacket-blue", "biker-brown-retro-padded-style", "asymmetric-gray-dual-zipper-jacket"]
    .map(s => D.PRODUCTS.find(p => p.slug === s)).filter(Boolean);
  const bodies = heroList.map((p, i) => {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = L.itemHTML(p);
    el.addEventListener("click", () => L.leaveTo(L.url.product(p)));
    el.setAttribute("data-cursor", "View");
    hang.appendChild(el);
    return { p, item: el, tag: $(".item__tag", el), x: i === 0 ? 0 : -2000, theta: 0, omega: 0, lastX: null };
  });
  $("#heroTotal").textContent = String(bodies.length).padStart(2, "0");
  let cur = 0, autoT = null;

  function setInfo(p) {
    const info = $("#heroInfo");
    gsap.to(info, { opacity: 0, y: 10, duration: 0.25, onComplete: () => {
      $("#heroCat").textContent = L.catOf(p).full;
      $("#heroName").textContent = p.name;
      $("#heroPrice").textContent = L.range(p);
      info.href = L.url.product(p);
      gsap.to(info, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
    } });
    $("#heroNum").textContent = String(cur + 1).padStart(2, "0");
  }
  function go(dir) {
    const w = stage.clientWidth * 1.1;
    const out = bodies[cur];
    cur = (cur + dir + bodies.length) % bodies.length;
    const inn = bodies[cur];
    gsap.to(out, { x: dir * w, duration: 1.1, ease: "power3.inOut" });
    inn.x = -dir * w; inn.lastX = inn.x;
    gsap.to(inn, { x: 0, duration: 1.2, ease: "power3.inOut", delay: 0.12 });
    setInfo(inn.p);
  }
  const auto = () => { clearInterval(autoT); autoT = setInterval(() => go(1), 5200); };
  $("#heroNext").addEventListener("click", () => { go(1); auto(); });
  $("#heroPrev").addEventListener("click", () => { go(-1); auto(); });
  setInfo(bodies[0].p); auto();
  // first jacket drops onto the rail
  gsap.from(hang, { y: -innerHeight * 0.8, duration: 1.4, delay: 0.3, ease: "back.out(1.1)", onComplete: () => (bodies[0].omega += 0.05) });
  gsap.from(".hh__rail", { scaleX: 0, transformOrigin: "right", duration: 1.2, ease: "expo.out", delay: 0.15 });

  /* spotlight + ibex parallax + brushing the jacket */
  const ibex = $(".hh__ibex");
  let lastPX = null;
  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--sx", ((e.clientX - r.left) / r.width * 100) + "%");
    hero.style.setProperty("--sy", ((e.clientY - r.top) / r.height * 100) + "%");
    gsap.to(ibex, { x: (e.clientX / innerWidth - 0.5) * -40, y: (e.clientY / innerHeight - 0.5) * -30, duration: 1.2, ease: "power3" });
    const dx = lastPX === null ? 0 : e.clientX - lastPX; lastPX = e.clientX;
    const b = bodies[cur], ir = b.item.getBoundingClientRect();
    if (e.clientX > ir.left && e.clientX < ir.right && e.clientY > ir.top && e.clientY < ir.bottom) {
      b.omega += Math.max(-0.05, Math.min(0.05, dx * 0.0012));
    }
  });
  stage.addEventListener("mouseenter", () => clearInterval(autoT));
  stage.addEventListener("mouseleave", auto);

  /* ---------------------------------------------------------
     WALK RACK teaser
  --------------------------------------------------------- */
  const walk = $("#walkRack");
  const walkProducts = D.PRODUCTS.filter(p => p.img);
  const walkBodies = walkProducts.map((p, i) => {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = L.itemHTML(p, { tag: false });
    el.setAttribute("data-cursor", "View");
    el.addEventListener("click", () => L.leaveTo(L.url.product(p)));
    walk.appendChild(el);
    return { p, item: el, tag: null, theta: (Math.random() - 0.5) * 0.2, omega: 0, i };
  });
  function layoutWalk() {
    const w = walk.clientWidth;
    const n = walkBodies.length;
    const jw = Math.round(Math.min(220, Math.max(120, w / (n * 1.12))));
    walk.style.setProperty("--jw", jw + "px");
    const gap = Math.min(jw * 1.12, (w - jw) / Math.max(1, n - 1));
    const start = (w - (gap * (n - 1) + jw)) / 2;
    walkBodies.forEach((b, i) => { b.item.style.left = start + i * gap + "px"; });
  }
  layoutWalk();
  window.addEventListener("resize", layoutWalk);
  let wLast = null;
  walk.addEventListener("pointermove", e => {
    const dx = wLast === null ? 0 : e.clientX - wLast; wLast = e.clientX;
    walkBodies.forEach(b => {
      const r = b.item.getBoundingClientRect();
      if (e.clientX > r.left + r.width * 0.1 && e.clientX < r.right - r.width * 0.1 && e.clientY > r.top && e.clientY < r.bottom)
        b.omega += Math.max(-0.05, Math.min(0.05, dx * 0.0014));
    });
  });
  ScrollTrigger.create({ trigger: walk, start: "top 85%", once: true, onEnter: () => {
    walkBodies.forEach((b, i) => gsap.from(b.item, { y: -300, opacity: 0, duration: 1, delay: i * 0.08, ease: "back.out(1.3)", onComplete: () => (b.omega += 0.04) }));
  } });

  /* one ticker for all pendulums */
  gsap.ticker.add((time, ms) => {
    const dt = Math.min(ms / 16.67, 3);
    bodies.forEach((b, i) => {
      if (b.lastX !== null) b.omega += Math.max(-0.012, Math.min(0.012, -(b.x - b.lastX) * 0.0005));
      b.lastX = b.x;
      L.stepBody(b, dt, i, time);
      b.item.style.transform = `translateX(${b.x}px) rotate(${b.theta}rad)`;
      if (b.tag) b.tag.style.transform = `rotate(${b.tagT - b.theta * 0.6}rad)`;
    });
    walkBodies.forEach((b, i) => { L.stepBody(b, dt, i + 9, time); L.renderBody(b); });
  });

  /* ---------------------------------------------------------
     MARQUEE (reacts to scroll speed)
  --------------------------------------------------------- */
  const row = $(".mq__row"), inner = $(".mq__inner");
  for (let k = 0; k < 3; k++) { const c = inner.cloneNode(true); row.appendChild(c); }
  const inners = $$(".mq__inner");
  let mx = 0, vel = 0, dir = -1;
  ScrollTrigger.create({ start: 0, end: "max", onUpdate: s => { vel = s.getVelocity(); if (vel) dir = vel > 0 ? -1 : 1; } });
  gsap.ticker.add((t, ms) => {
    const w = inner.offsetWidth; if (!w) return;
    mx += (1 + Math.min(Math.abs(vel) / 120, 14)) * dir * (ms / 16.67);
    mx = gsap.utils.wrap(-w, 0, mx);
    vel *= 0.92;
    inners.forEach(el => (el.style.transform = `translate3d(${mx}px,0,0)`));
  });

  /* ---------------------------------------------------------
     INTRO: words light up as you read
  --------------------------------------------------------- */
  const it = $("#introText");
  it.innerHTML = it.textContent.trim().split(/\s+/).map(w => `<span class="wd">${w}</span>`).join(" ");
  gsap.to($$(".wd", it), { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: it, start: "top 80%", end: "bottom 45%", scrub: true } });

  /* TILES reveal */
  $$(".tile").forEach((t, i) => {
    gsap.fromTo(t, { clipPath: "inset(100% 0% 0% 0% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.4, delay: (i % 2) * 0.12, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 90%" } });
    gsap.fromTo($("img", t), { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 90%" } });
  });

  /* ---------------------------------------------------------
     CRAFT: hide → cut → stitch → finished (pinned)
  --------------------------------------------------------- */
  const steps = $$(".craft__steps li"), num = $("#craftNum");
  const ctl = gsap.timeline({
    scrollTrigger: { trigger: ".craft__pin", start: "top top", end: "+=" + innerHeight * 2.6, pin: true, scrub: 1 },
    onUpdate: () => {
      const p = ctl.progress(), i = Math.min(3, Math.floor(p * 4 * 0.999));
      steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
      num.textContent = "0" + (i + 1);
    }
  });
  ctl.to(".jk__hide", { opacity: 0.25, duration: 1 })
    .fromTo(".jk", { rotate: -4, scale: 0.92 }, { rotate: 0, scale: 1, duration: 1 }, 0)
    .to(".jk__cut", { strokeDashoffset: 0, duration: 1 }, 1)
    .to(".jk__mask", { strokeDashoffset: 0, duration: 1 }, 2)
    .to(".jk__detail path", { strokeDashoffset: 0, duration: 0.8, stagger: 0.05 }, 2.1)
    .to(".jk__hide", { opacity: 1, duration: 1 }, 3)
    .to(".jk__cut", { opacity: 0, duration: 0.5 }, 3.2)
    .to(".jk", { y: -10, duration: 1 }, 3);

  /* ---------------------------------------------------------
     NEW ARRIVALS carousel (drag + buttons)
  --------------------------------------------------------- */
  const sc = $("#arrivals");
  sc.innerHTML = D.PRODUCTS.filter(p => p.isNew).map(L.cardHTML).join("");
  gsap.fromTo($$(".pcard", sc), { x: 120, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.07, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: sc, start: "top 85%" } });
  const step = () => ($(".pcard", sc).offsetWidth + 20) * 2;
  $("#arrNext").addEventListener("click", () => sc.scrollBy({ left: step(), behavior: "smooth" }));
  $("#arrPrev").addEventListener("click", () => sc.scrollBy({ left: -step(), behavior: "smooth" }));
  let down = false, sx = 0, sl = 0, moved = false;
  sc.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = sc.scrollLeft; });
  window.addEventListener("pointermove", e => { if (!down) return; const d = e.clientX - sx; if (Math.abs(d) > 5) { moved = true; sc.classList.add("is-drag"); } sc.scrollLeft = sl - d; });
  window.addEventListener("pointerup", () => { if (!down) return; down = false; setTimeout(() => sc.classList.remove("is-drag"), 0); });
  sc.addEventListener("click", e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  /* MOTO banner: the frame opens up as you scroll in */
  gsap.to(".moto__media", { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: ".moto", start: "top 85%", end: "top 10%", scrub: true } });
  gsap.fromTo(".moto__media img", { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".moto", start: "top bottom", end: "bottom top", scrub: true } });
})();
