/* =========================================================
   LFS — Product page
   ========================================================= */
(() => {
  "use strict";
  const L = window.LFS, D = L.D, { $, $$ } = L;
  const slug = new URLSearchParams(location.search).get("p");
  const p = D.PRODUCTS.find(x => x.slug === slug) || D.PRODUCTS[0];
  const cat = L.catOf(p);

  document.title = `${p.name} | Leather Factory Shop`;
  document.body.dataset.nav = cat.group.toLowerCase();
  $$(`[data-nav="${document.body.dataset.nav}"]`).forEach(a => a.classList.add("is-current"));
  $("#crumbs").innerHTML = `<a href="index.html">Home</a><span>/</span><a href="shop.html">Shop</a><span>/</span><a href="${L.url.cat(cat.slug)}">${cat.full}</a><span>/</span><b>${p.name}</b>`;
  $("#pCat").textContent = cat.full + (p.isNew ? " · New arrival" : p.lastCall ? " · Last call" : "");
  $("#pName").textContent = p.name;
  $("#pStars").innerHTML = L.stars(p.rating);
  $("#pRange").textContent = p.price[0] !== p.price[1] ? `Price range ${L.range(p)}` : "";
  const desc = `The ${p.name} is cut from premium leather and finished by hand for the leather lovers and the road lovers. Built for warmth this season and the many ahead.`;
  $("#pDesc").textContent = desc;
  $("#accDesc").textContent = desc + " (Sample description: replace with this product's own text from WooCommerce.)";

  /* ---------- gallery: photo (zoom) + on the hanger (swinging) ---------- */
  const photo = $("#photo"), img = $("#photoImg"), hang = $("#hang"), badge = $("#badge");
  img.src = p.photo; img.alt = p.name;
  const views = [{ type: "photo", src: p.photo, label: "Product photo" }];
  if (p.img) views.unshift({ type: "hang", src: p.img, label: "On the hanger" });
  $("#thumbs").innerHTML = views.map((v, i) => `<button class="${v.type === "hang" ? "t-hang" : ""}${i ? "" : " is-on"}" data-i="${i}" aria-label="${v.label}"><img src="${v.src}" alt=""></button>`).join("");

  let body = null;
  if (p.img) {
    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = L.itemHTML(p);
    hang.appendChild(el);
    body = { item: el, tag: $(".item__tag", el), theta: 0.15, omega: 0 };
    let lx = null;
    hang.addEventListener("pointermove", e => { const dx = lx === null ? 0 : e.clientX - lx; lx = e.clientX; body.omega += Math.max(-0.03, Math.min(0.03, dx * 0.0009)); });
    hang.addEventListener("click", () => (body.omega += 0.06));
    gsap.ticker.add((t, ms) => { L.stepBody(body, Math.min(ms / 16.67, 3), 2, t); L.renderBody(body); });
  }
  function show(i) {
    const v = views[i];
    $$("#thumbs button").forEach((b, k) => b.classList.toggle("is-on", k === i));
    const isHang = v.type === "hang";
    hang.classList.toggle("is-on", isHang);
    photo.style.display = isHang ? "none" : "block";
    badge.textContent = isHang ? "Move your mouse to swing it" : "Hover to zoom";
    gsap.fromTo(isHang ? hang : photo, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    if (isHang && body) { body.theta = -0.25; body.omega = 0.02; gsap.from(body.item, { y: -200, duration: 0.9, ease: "back.out(1.4)" }); }
  }
  $("#thumbs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) show(+b.dataset.i); });
  show(0);

  photo.addEventListener("mousemove", e => {
    const r = photo.getBoundingClientRect();
    img.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`;
    photo.classList.add("is-zoom");
  });
  photo.addEventListener("mouseleave", () => photo.classList.remove("is-zoom"));

  /* ---------- sizes, price, qty, add ---------- */
  let size = "M", qty = 1;
  $("#sizes").innerHTML = D.SIZES.map(s => `<button class="${s === size ? "is-on" : ""}">${s}</button>`).join("");
  const price = () => { $("#pPrice").textContent = L.money(D.sizePrice(p, size)); $("#pSize").textContent = size; };
  price();
  $("#sizes").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    size = b.textContent;
    $$("#sizes button").forEach(x => x.classList.toggle("is-on", x === b));
    gsap.fromTo("#pPrice", { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
    price();
    if (body) body.omega += 0.03;
  });
  $$(".qty button").forEach(b => b.addEventListener("click", () => { qty = Math.max(1, Math.min(9, qty + +b.dataset.q)); $("#qty").textContent = qty; }));
  const flyImg = () => (hang.classList.contains("is-on") ? $(".item__img img, .item__card img", hang) : img);
  $("#add").addEventListener("click", () => { L.cart.add(p, size, qty, flyImg()); if (body) body.omega += 0.06; });
  $("#buyNow").addEventListener("click", e => { e.preventDefault(); L.cart.add(p, size, qty, null); setTimeout(() => L.leaveTo("cart.html"), 300); });

  /* accordions */
  $$(".acc__item").forEach(it => {
    const a = $(".acc__a", it);
    if (it.classList.contains("is-open")) a.style.height = "auto";
    $(".acc__q", it).addEventListener("click", () => {
      const open = !it.classList.contains("is-open");
      it.classList.toggle("is-open", open);
      gsap.to(a, { height: open ? "auto" : 0, duration: 0.5, ease: "power3.inOut", onComplete: () => ScrollTrigger.refresh() });
    });
  });

  /* related */
  const rel = D.PRODUCTS.filter(x => x !== p && x.cat === p.cat).concat(D.PRODUCTS.filter(x => x !== p && x.cat !== p.cat && L.catOf(x).group === cat.group)).slice(0, 4);
  $("#related").innerHTML = rel.map(L.cardHTML).join("");
  $("#moreLink").href = L.url.cat(cat.slug);
})();
