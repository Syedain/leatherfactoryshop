/* =========================================================
   LFS — small pages: about, contact, sizing, help, cart
   ========================================================= */
(() => {
  "use strict";
  const L = window.LFS, D = L.D, { $, $$ } = L;
  const page = document.body.dataset.page;

  function accordions(scope = document) {
    $$(".acc__item", scope).forEach(it => {
      const a = $(".acc__a", it);
      if (it.classList.contains("is-open")) a.style.height = "auto";
      $(".acc__q", it).addEventListener("click", () => {
        const open = !it.classList.contains("is-open");
        it.classList.toggle("is-open", open);
        gsap.to(a, { height: open ? "auto" : 0, duration: 0.5, ease: "power3.inOut", onComplete: () => ScrollTrigger.refresh() });
      });
    });
  }

  /* ---------------- ABOUT ---------------- */
  if (page === "about") {
    gsap.to("#abYear", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".ab-hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to("#tlFill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#timeline", start: "top 60%", end: "bottom 60%", scrub: true } });
    $$(".tl").forEach(t => {
      ScrollTrigger.create({ trigger: t, start: "top 60%", onEnter: () => t.classList.add("is-on"), onLeaveBack: () => t.classList.remove("is-on") });
      gsap.fromTo($(".tl__img", t), { clipPath: "inset(20% 20% 20% 20% round 22px)", opacity: 0 }, { clipPath: "inset(0% 0% 0% 0% round 22px)", opacity: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 80%" } });
      gsap.fromTo($(".tl__img img", t), { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 80%" } });
      gsap.fromTo($(".tl__txt", t), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: t, start: "top 80%" } });
    });
  }

  /* ---------------- CONTACT ---------------- */
  if (page === "contact") {
    $("#ctForm").addEventListener("submit", e => {
      e.preventDefault();
      e.target.reset();
      L.toast("Thanks! We'll reply within a few minutes.");
    });
  }

  /* ---------------- SIZING ---------------- */
  if (page === "sizing") {
    // sample chart: chest/waist/sleeve/length in inches
    const CH = {
      men: [["XS", 34, 28, 32.5, 25], ["S", 36, 30, 33, 26], ["M", 40, 34, 34, 27], ["L", 44, 38, 35, 28], ["XL", 48, 42, 35.5, 29], ["2XL", 52, 46, 36, 30], ["3XL", 56, 50, 36.5, 31]],
      women: [["XS", 31, 25, 30, 20], ["S", 33, 27, 30.5, 21], ["M", 35, 29, 31, 22], ["L", 38, 32, 31.5, 23], ["XL", 41, 35, 32, 24], ["2XL", 44, 38, 32.5, 25], ["3XL", 47, 41, 33, 26]]
    };
    let g = "men", unit = "in";
    const tbody = $("#chart");
    const draw = () => {
      tbody.innerHTML = CH[g].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join("");
      gsap.fromTo($$("tr", tbody), { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.04, duration: 0.5 });
      find();
    };
    function find() {
      let v = parseFloat($("#chest").value);
      $$("tr", tbody).forEach(tr => tr.classList.remove("is-hit"));
      if (!v) { $("#fitSize").textContent = "–"; $("#fitNote").textContent = "Your recommended size"; return; }
      if (unit === "cm") v = v / 2.54;
      const rows = CH[g];
      let i = rows.findIndex(r => v <= r[1]);
      if (i < 0) i = rows.length - 1;
      $$("tr", tbody)[i].classList.add("is-hit");
      $("#fitSize").textContent = rows[i][0];
      $("#fitNote").textContent = v > rows[rows.length - 1][1] ? "Largest size. Contact us for a custom fit." : `Fits a chest up to ${rows[i][1]} in`;
      gsap.fromTo("#fitSize", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" });
    }
    $("#gTabs").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; g = b.dataset.g; $$("#gTabs button").forEach(x => x.classList.toggle("is-on", x === b)); draw(); });
    $("#uTabs").addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; unit = b.dataset.u; $$("#uTabs button").forEach(x => x.classList.toggle("is-on", x === b)); $("#chest").placeholder = unit === "in" ? "e.g. 40" : "e.g. 102"; find(); });
    $("#chest").addEventListener("input", find);
    draw();
  }

  /* ---------------- HELP ---------------- */
  if (page === "help") {
    accordions();
    const links = $$("#helpNav a");
    $$(".help__sec").forEach(sec => ScrollTrigger.create({
      trigger: sec, start: "top 40%", end: "bottom 40%",
      onToggle: s => { if (s.isActive) links.forEach(a => a.classList.toggle("is-on", a.getAttribute("href") === "#" + sec.id)); }
    }));
    links.forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      const t = $(a.getAttribute("href"));
      if (L.lenis) L.lenis.scrollTo(t, { offset: -110, duration: 1.2 }); else t.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", a.getAttribute("href"));
    }));
    if (location.hash && $(location.hash)) setTimeout(() => { const t = $(location.hash); if (L.lenis) L.lenis.scrollTo(t, { offset: -110, immediate: true }); else t.scrollIntoView(); }, 400);
  }

  /* ---------------- CART ---------------- */
  if (page === "cart") {
    const lines = $("#cartLines");
    function draw() {
      const items = L.cart.items();
      if (!items.length) {
        lines.innerHTML = `<div class="empty"><h2 class="h-md">Your bag is <em>empty.</em></h2><p>Take something off the rack.</p><a class="btn" href="shop.html"><span>Walk the store</span><svg><use href="#i-arrow"/></svg></a></div>`;
        $("#summary").style.display = "none"; $("#cartPage").classList.add("is-empty");
      } else {
        $("#summary").style.display = ""; $("#cartPage").classList.remove("is-empty");
        lines.innerHTML = items.map((c, i) => {
          const p = D.PRODUCTS.find(x => x.id === c.id); if (!p) return "";
          return `<div class="cline">
            <a class="cline__img" href="${L.url.product(p)}"><img src="${p.photo}" alt="${p.name}"></a>
            <div><h3>${p.name}</h3><p>${L.catOf(p).full} · Size ${c.size}</p><button class="rm" data-i="${i}">Remove</button></div>
            <div class="cline__right"><b>${L.money(D.sizePrice(p, c.size) * c.qty)}</b>
              <div class="qty"><button data-i="${i}" data-q="-1" aria-label="Less">−</button><span>${c.qty}</span><button data-i="${i}" data-q="1" aria-label="More">+</button></div></div>
          </div>`;
        }).join("");
      }
      $("#sSub").textContent = $("#sTotal").textContent = L.money(L.cart.total());
    }
    lines.addEventListener("click", e => {
      const b = e.target.closest("button[data-i]"); if (!b) return;
      const i = +b.dataset.i, c = L.cart.items()[i];
      if (b.classList.contains("rm")) L.cart.set(i, 0);
      else L.cart.set(i, Math.min(9, c.qty + +b.dataset.q));
    });
    L.cart.onChange(draw);
    draw();
    gsap.fromTo(".cline", { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, delay: 0.3 });
    $("#checkout").addEventListener("click", () => L.toast("Design preview: checkout will run on WooCommerce."));
    const inBag = new Set(L.cart.items().map(c => c.id));
    $("#recs").innerHTML = D.PRODUCTS.filter(p => !inBag.has(p.id) && p.img).slice(0, 4).map(L.cardHTML).join("");
  }
})();
