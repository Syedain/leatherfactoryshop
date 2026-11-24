/* =========================================================
   Leather Factory Shop — shared site core
   Header, mega menu, search, footer, cart drawer, cursor,
   page transitions, scroll reveals and hanger physics.
   ========================================================= */
(() => {
  "use strict";
  const D = window.LFS_DATA;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = document.body.dataset.page || "";

  const money = n => "$" + Number(n).toFixed(0);
  const range = p => p.price[0] === p.price[1] ? money(p.price[0]) : `${money(p.price[0])} – ${money(p.price[1])}`;
  const stars = r => {
    if (!r) return `<span class="stars stars--none">No reviews yet</span>`;
    const full = Math.round(r * 2) / 2;
    let s = "";
    for (let i = 1; i <= 5; i++) s += `<i class="${full >= i ? "on" : full >= i - 0.5 ? "half" : ""}"></i>`;
    return `<span class="stars" aria-label="Rated ${r.toFixed(2)} out of 5">${s}<b>${r.toFixed(1)}</b></span>`;
  };
  const catOf = p => D.CATS.find(c => c.slug === p.cat);
  const url = { product: p => `product.html?p=${p.slug}`, cat: slug => `category.html?cat=${slug}` };

  /* ---------------------------------------------------------
     SHARED MARKUP
  --------------------------------------------------------- */
  const SVG_DEFS = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9a46a"/><stop offset=".55" stop-color="#a8703f"/><stop offset="1" stop-color="#6e4424"/></linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d7d86"/><stop offset=".45" stop-color="#f4f4f7"/><stop offset="1" stop-color="#8a8a93"/></linearGradient>
    <symbol id="hanger" viewBox="0 0 260 120">
      <path d="M130 50 V30 C130 14 150 8 157 20 C162 29 155 37 146 34" fill="none" stroke="url(#metal)" stroke-width="5" stroke-linecap="round"/>
      <rect x="124" y="46" width="12" height="12" rx="3" fill="#b9b9c2"/>
      <path d="M14 104 C70 78 100 62 130 56 C160 62 190 78 246 104" fill="none" stroke="url(#wood)" stroke-width="15" stroke-linecap="round"/>
      <path d="M24 106 H236" stroke="url(#metal)" stroke-width="3" stroke-linecap="round"/>
    </symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
    <symbol id="i-bag" viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z M9 7a3 3 0 016 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  </defs></svg>`;

  const men = D.CATS.filter(c => c.group === "Men"), women = D.CATS.filter(c => c.group === "Women");
  const feat = slug => D.PRODUCTS.find(p => p.slug === slug);
  const mega = (cats, title, pr) => `
    <div class="mega">
      <div class="mega__col"><span class="mega__label">${title}</span>
        <a href="${url.cat(cats[0].slug)}">All ${title.toLowerCase()}'s jackets</a>
        ${cats.map(c => `<a href="${url.cat(c.slug)}">${c.name} <small>${c.count}</small></a>`).join("")}
      </div>
      <a class="mega__feat" href="${url.product(pr)}"><img src="${pr.img || pr.photo}" alt=""><span>${pr.name}<b>${range(pr)}</b></span></a>
    </div>`;

  const HEADER = `
  <div class="announce" aria-label="Announcement"><div class="announce__track">
    ${Array(2).fill(`<span>Premium handmade leather jackets</span><i>✦</i><span>All-new premium cowhide &amp; lambskin</span><i>✦</i><span>Cut and sewn by the hands of qualified craftspeople</span><i>✦</i><span>Customer care replies within minutes</span><i>✦</i>`).join("")}
  </div></div>
  <header class="hdr" id="hdr">
    <button class="hdr__burger" id="burger" aria-label="Open menu"><span></span><span></span></button>
    <a class="hdr__logo" href="index.html" aria-label="Leather Factory Shop home"><img src="assets/logo-tan.png" alt="Leather Factory Shop"></a>
    <nav class="hdr__nav" aria-label="Main">
      <a href="shop.html" data-nav="shop">Shop</a>
      <div class="hdr__dd"><a href="${url.cat("men-biker")}" data-nav="men">Men</a>${mega(men, "Men", feat("black-bomber-leather-jacket"))}</div>
      <div class="hdr__dd"><a href="${url.cat("women-bomber")}" data-nav="women">Women</a>${mega(women, "Women", feat("back-skull-speckled-chic-pink"))}</div>
      <a href="${url.cat("new-arrivals")}" data-nav="new-arrivals">New Arrivals</a>
      <a href="${url.cat("last-call")}" data-nav="last-call">Last Call</a>
      <a href="about.html" data-nav="about">Our History</a>
      <a href="contact.html" data-nav="contact">Contact</a>
    </nav>
    <div class="hdr__actions">
      <button class="icon-btn" id="searchBtn" aria-label="Search"><svg><use href="#i-search"/></svg></button>
      <button class="icon-btn" id="cartBtn" aria-label="Open cart"><svg><use href="#i-bag"/></svg><span class="cart-count" id="cartCount">0</span></button>
    </div>
  </header>
  <div class="mmenu" id="mmenu" aria-hidden="true">
    <nav>
      <a href="shop.html">Shop</a>
      <span class="mmenu__label">Men</span>${men.map(c => `<a class="sub" href="${url.cat(c.slug)}">${c.name}</a>`).join("")}
      <span class="mmenu__label">Women</span>${women.map(c => `<a class="sub" href="${url.cat(c.slug)}">${c.name}</a>`).join("")}
      <a href="${url.cat("new-arrivals")}">New Arrivals</a>
      <a href="${url.cat("last-call")}">Last Call</a>
      <a href="about.html">Our History</a>
      <a href="sizing.html">Sizing</a>
      <a href="contact.html">Contact</a>
    </nav>
  </div>`;

  const FOOTER = `
  <footer class="ftr">
    <div class="ftr__news">
      <div><span class="eyebrow">LFS News</span><h3>Get yourself updated with our latest articles and offers.</h3></div>
      <form class="news" id="newsForm"><input type="email" required placeholder="Your email address" aria-label="Email address"><button class="btn" type="submit"><span>Sign up</span></button></form>
    </div>
    <div class="ftr__grid">
      <div class="ftr__brand"><img src="assets/logo-tan.png" alt="Leather Factory Shop"><p>Premium handmade leather jackets for the leather lovers, the road lovers and the rebellious inside everyone.</p></div>
      <div><h5>Shop</h5><a href="shop.html">Walk the store</a><a href="${url.cat("men-biker")}">Men</a><a href="${url.cat("women-bomber")}">Women</a><a href="${url.cat("new-arrivals")}">New Arrivals</a><a href="${url.cat("last-call")}">Last Call</a></div>
      <div><h5>Information</h5><a href="help.html#privacy">Privacy Policy</a><a href="help.html#terms">Terms &amp; Conditions</a><a href="about.html">Our History</a><a href="sizing.html">Sizing</a></div>
      <div><h5>Customer Service</h5><a href="contact.html">Contact</a><a href="help.html#shipping">Shipping &amp; Payments</a><a href="help.html#returns">Exchange &amp; Returns</a><a href="help.html#faqs">FAQs</a></div>
      <div><h5>Talk to us</h5><a href="mailto:${D.CONTACT.email}">${D.CONTACT.email}</a><a href="tel:+12109433934">${D.CONTACT.phone}</a><a href="${D.CONTACT.instagram}" target="_blank" rel="noopener">Instagram</a><a href="${D.CONTACT.facebook}" target="_blank" rel="noopener">Facebook</a></div>
    </div>
    <div class="ftr__giant" aria-hidden="true">LEATHER FACTORY SHOP</div>
    <div class="ftr__bottom"><span>© ${new Date().getFullYear()} Leather Factory Shop. All rights reserved.</span><span class="ftr__pay"><i>SSL secure checkout</i><i>Visa</i><i>Mastercard</i><i>PayPal</i></span></div>
  </footer>`;

  const OVERLAYS = `
  <div class="search" id="search" aria-hidden="true" role="dialog" aria-label="Search">
    <div class="search__box"><svg><use href="#i-search"/></svg><input id="searchInput" type="search" placeholder="Search jackets…" autocomplete="off"><button class="x-btn" id="searchClose" aria-label="Close search"><span></span><span></span></button></div>
    <p class="search__hint">Hit enter to search or ESC to close</p>
    <div class="search__results" id="searchResults"></div>
  </div>
  <aside class="cart" id="cart" aria-label="Shopping cart" aria-hidden="true">
    <div class="cart__head"><h3>Your bag</h3><button class="x-btn" id="cartClose" aria-label="Close cart"><span></span><span></span></button></div>
    <div class="cart__items" id="cartItems"></div>
    <div class="cart__foot"><div class="cart__total"><span>Subtotal</span><b id="cartTotal">$0</b></div>
      <a class="btn btn--full" href="cart.html"><span>View bag &amp; checkout</span></a></div>
  </aside>
  <div class="shade" id="shade"></div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
  <div class="cursor" aria-hidden="true"><span class="cursor__label"></span></div>
  <div class="veil" aria-hidden="true"><img src="assets/logo-tan.png" alt=""></div>`;

  document.body.insertAdjacentHTML("afterbegin", SVG_DEFS + HEADER);
  document.body.insertAdjacentHTML("beforeend", FOOTER + OVERLAYS);
  const active = document.body.dataset.nav;
  if (active) $$(`[data-nav="${active}"]`).forEach(a => a.classList.add("is-current"));

  /* ---------------------------------------------------------
     SMOOTH SCROLL + REVEALS
  --------------------------------------------------------- */
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  let lenis = null;
  if (typeof Lenis !== "undefined" && !reduced) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  let locks = 0;
  const lock = () => { locks++; lenis && lenis.stop(); document.documentElement.classList.add("is-locked"); };
  const unlock = () => { locks = Math.max(0, locks - 1); if (!locks) { lenis && lenis.start(); document.documentElement.classList.remove("is-locked"); } };

  function splitWords(el) {
    if (el.dataset.splitDone) return $$(".w > span", el);
    el.dataset.splitDone = 1;
    const walk = node => {
      Array.from(node.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(t => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const i = document.createElement("span"); i.textContent = t; w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    return $$(".w > span", el);
  }

  function reveals(scope = document) {
    $$("[data-split]", scope).forEach(el => {
      const words = splitWords(el);
      const now = el.hasAttribute("data-now");
      gsap.fromTo(words, { yPercent: 115 }, {
        yPercent: 0, duration: 1.2, stagger: 0.04, ease: "expo.out", delay: now ? 0.35 : 0,
        scrollTrigger: now ? null : { trigger: el, start: "top 88%" }
      });
    });
    $$("[data-reveal]", scope).forEach(el => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: +(el.dataset.delay || 0),
        scrollTrigger: el.hasAttribute("data-now") ? null : { trigger: el, start: "top 90%" }
      });
    });
    $$("[data-stagger]", scope).forEach(el => {
      gsap.fromTo(el.children, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });
  }

  /* header behaviour */
  const hdr = $("#hdr");
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle("is-solid", y > 30);
    hdr.classList.toggle("is-hidden", y > lastY && y > 500 && !locks);
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* mobile menu */
  const burger = $("#burger"), mmenu = $("#mmenu");
  burger.addEventListener("click", () => {
    const open = !mmenu.classList.contains("is-open");
    mmenu.classList.toggle("is-open", open); burger.classList.toggle("is-open", open);
    mmenu.setAttribute("aria-hidden", String(!open));
    if (open) { lock(); gsap.fromTo($$("#mmenu a, #mmenu .mmenu__label"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.03, duration: 0.6, delay: 0.2, ease: "power3.out" }); } else unlock();
  });

  /* ---------------------------------------------------------
     CURSOR
  --------------------------------------------------------- */
  const cursorEl = $(".cursor"), cursorLabel = $(".cursor__label");
  if (!isTouch) {
    const cx = gsap.quickTo(cursorEl, "x", { duration: 0.22, ease: "power3" }), cy = gsap.quickTo(cursorEl, "y", { duration: 0.22, ease: "power3" });
    window.addEventListener("pointermove", e => { cx(e.clientX); cy(e.clientY); cursorEl.style.opacity = 1; });
    document.addEventListener("mouseover", e => {
      const t = e.target.closest("[data-cursor]");
      if (t) cursor.set(true, t.dataset.cursor);
      else if (!cursor.manual) cursor.set(false);
    });
  }
  const cursor = {
    manual: false,
    set(on, text) { cursorEl.classList.toggle("is-view", !!on); if (on && text) cursorLabel.textContent = text; }
  };

  /* ---------------------------------------------------------
     PAGE TRANSITIONS (veil)
  --------------------------------------------------------- */
  const veil = $(".veil");
  gsap.fromTo(veil, { opacity: 1 }, { opacity: 0, duration: 0.8, delay: 0.15, ease: "power2.out", onComplete: () => (veil.style.visibility = "hidden") });
  gsap.fromTo(".veil img", { scale: 1 }, { scale: 0.85, opacity: 0, duration: 0.6, ease: "power2.in" });
  function leaveTo(href) {
    veil.style.visibility = "visible";
    gsap.fromTo(".veil img", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, delay: 0.15, ease: "back.out(2)" });
    gsap.to(veil, { opacity: 1, duration: 0.45, ease: "power2.in", onComplete: () => (location.href = href) });
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute("download")) return;
    const href = a.getAttribute("href");
    if (/^(#|mailto:|tel:|https?:)/.test(href) || !/\.html/.test(href)) return;
    if (a.pathname === location.pathname && a.search === location.search && a.hash) return;
    e.preventDefault();
    leaveTo(a.href);
  });
  window.addEventListener("pageshow", e => { if (e.persisted) { veil.style.opacity = 0; veil.style.visibility = "hidden"; } });

  /* ---------------------------------------------------------
     SEARCH
  --------------------------------------------------------- */
  const search = $("#search"), sInput = $("#searchInput"), sRes = $("#searchResults");
  function openSearch() { search.classList.add("is-open"); search.setAttribute("aria-hidden", "false"); lock(); setTimeout(() => sInput.focus(), 300); renderSearch(); }
  function closeSearch() { if (!search.classList.contains("is-open")) return; search.classList.remove("is-open"); search.setAttribute("aria-hidden", "true"); unlock(); }
  function renderSearch() {
    const q = sInput.value.trim().toLowerCase();
    const list = (q ? D.PRODUCTS.filter(p => (p.name + " " + catOf(p).full).toLowerCase().includes(q)) : D.PRODUCTS.filter(p => p.isNew)).slice(0, 8);
    sRes.innerHTML = (q ? "" : `<span class="search__label">New arrivals</span>`) + (list.length ? list.map(p => `
      <a class="sres" href="${url.product(p)}"><span class="sres__img"><img src="${p.photo}" alt=""></span><span><b>${p.name}</b><small>${catOf(p).full} · ${range(p)}</small></span></a>`).join("") : `<p class="search__none">No jackets match “${q}”.</p>`);
    gsap.fromTo($$(".sres", sRes), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.03, duration: 0.4 });
  }
  $("#searchBtn").addEventListener("click", openSearch);
  $("#searchClose").addEventListener("click", closeSearch);
  sInput.addEventListener("input", renderSearch);
  sInput.addEventListener("keydown", e => { if (e.key === "Enter") { const a = $(".sres", sRes); if (a) leaveTo(a.href); } });

  /* ---------------------------------------------------------
     TOAST + CART
  --------------------------------------------------------- */
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("is-on"), 2600);
  }
  let items = [];
  try { items = JSON.parse(localStorage.getItem("lfs-cart") || "[]"); } catch (e) { items = []; }
  const save = () => { try { localStorage.setItem("lfs-cart", JSON.stringify(items)); } catch (e) {} };
  const cartEl = $("#cart"), shade = $("#shade");
  const listeners = [];
  const cart = {
    items: () => items,
    count: () => items.reduce((n, c) => n + c.qty, 0),
    total: () => items.reduce((n, c) => { const p = D.PRODUCTS.find(x => x.id === c.id); return n + (p ? D.sizePrice(p, c.size) * c.qty : 0); }, 0),
    onChange(fn) { listeners.push(fn); },
    set(i, qty) { if (qty <= 0) items.splice(i, 1); else items[i].qty = qty; save(); cart.render(); },
    render() {
      $("#cartCount").textContent = cart.count();
      const box = $("#cartItems");
      if (!items.length) box.innerHTML = `<p class="cart__empty">Your bag is empty.<br>Take something off the rack.</p>`;
      else box.innerHTML = items.map((c, i) => {
        const p = D.PRODUCTS.find(x => x.id === c.id); if (!p) return "";
        return `<div class="c-item"><a class="c-item__img" href="${url.product(p)}"><img src="${p.img || p.photo}" alt=""></a>
          <div><h4>${p.name}</h4><p>Size ${c.size} · Qty ${c.qty}</p></div>
          <div class="c-item__right"><b>${money(D.sizePrice(p, c.size) * c.qty)}</b><button data-rm="${i}">Remove</button></div></div>`;
      }).join("");
      $("#cartTotal").textContent = money(cart.total());
      listeners.forEach(fn => fn());
    },
    add(p, size, qty, fromImg) {
      const ex = items.find(c => c.id === p.id && c.size === size);
      if (ex) ex.qty += qty; else items.push({ id: p.id, size, qty });
      save();
      const btn = $("#cartBtn");
      const done = () => { cart.render(); gsap.fromTo(btn, { scale: 1.35 }, { scale: 1, duration: 0.7, ease: "elastic.out(1, .4)" }); toast(`${p.name} added to your bag`); };
      if (!fromImg) return done();
      const r = fromImg.getBoundingClientRect(), b = btn.getBoundingClientRect();
      const fly = fromImg.cloneNode(); fly.className = "flyer";
      Object.assign(fly.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
      document.body.appendChild(fly);
      gsap.timeline({ onComplete: () => { fly.remove(); done(); } })
        .to(fly, { x: b.left + b.width / 2 - (r.left + r.width / 2), duration: 0.9, ease: "power2.inOut" }, 0)
        .to(fly, { y: b.top + b.height / 2 - (r.top + r.height / 2), duration: 0.9, ease: "back.in(1.4)" }, 0)
        .to(fly, { scale: 0.06, rotate: 25, opacity: 0.6, duration: 0.9, ease: "power2.in" }, 0);
    },
    open() { cartEl.classList.add("is-open"); shade.classList.add("is-on"); cartEl.setAttribute("aria-hidden", "false"); lock(); },
    close() { if (!cartEl.classList.contains("is-open")) return; cartEl.classList.remove("is-open"); shade.classList.remove("is-on"); cartEl.setAttribute("aria-hidden", "true"); unlock(); }
  };
  cart.render();
  $("#cartItems").addEventListener("click", e => { const b = e.target.closest("[data-rm]"); if (b) cart.set(+b.dataset.rm, 0); });
  $("#cartBtn").addEventListener("click", () => (page === "cart" ? null : cart.open()));
  $("#cartClose").addEventListener("click", cart.close);
  shade.addEventListener("click", cart.close);
  document.addEventListener("keydown", e => { if (e.key === "Escape") { cart.close(); closeSearch(); } });
  $("#newsForm").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); toast("Thanks! You're on the LFS News list."); });

  /* ---------------------------------------------------------
     HANGERS: markup + pendulum physics
  --------------------------------------------------------- */
  function itemHTML(p, opts = {}) {
    const tag = opts.tag !== false && (p.isNew ? "NEW" : p.lastCall ? "LAST CALL" : "");
    const body = p.img
      ? `<div class="item__img"><img src="${p.img}" alt="${p.name}" draggable="false"></div>`
      : `<div class="item__card"><i class="clip clip--l"></i><i class="clip clip--r"></i><img src="${p.photo}" alt="${p.name}" draggable="false"></div>`;
    return `<svg class="item__hanger" viewBox="0 0 260 120"><use href="#hanger"/></svg>${body}${tag ? `<div class="item__tag"><span>${tag}</span></div>` : ""}`;
  }
  function stepBody(b, dt, i, t) {
    b.omega += (-0.011 * b.theta - 0.05 * b.omega) * dt;
    b.omega += Math.sin(t * 0.8 + i * 1.7) * 0.00005 * dt;
    b.theta = Math.max(-0.6, Math.min(0.6, b.theta + b.omega * dt));
    b.tagW = (b.tagW || 0) + (-0.03 * (b.tagT || 0) - 0.06 * (b.tagW || 0) - b.omega * 0.09) * dt;
    b.tagT = (b.tagT || 0) + b.tagW * dt;
  }
  function renderBody(b) {
    b.item.style.transform = `rotate(${b.theta}rad)`;
    if (b.tag) b.tag.style.transform = `rotate(${b.tagT - b.theta * 0.6}rad)`;
  }

  /* product card used in grids / carousels */
  function cardHTML(p) {
    const tag = p.isNew ? "NEW" : p.lastCall ? "LAST CALL" : "";
    return `<a class="pcard" href="${url.product(p)}" data-cursor="View">
      <span class="pcard__media">${tag ? `<span class="pcard__tag">${tag}</span>` : ""}<img src="${p.photo}" alt="${p.name}" loading="lazy">${p.img ? `<img class="pcard__alt" src="${p.img}" alt="" loading="lazy">` : ""}</span>
      <span class="pcard__body"><small>${catOf(p).full}</small><b>${p.name}</b><span class="pcard__row"><em>${range(p)}</em>${p.rating ? stars(p.rating) : ""}</span></span>
    </a>`;
  }

  /* small "rack" card linking to a category */
  function miniHTML(c) {
    const ps = D.inCat(c.slug).slice(0, 3);
    return `<a class="mini" href="${url.cat(c.slug)}" data-cursor="Browse">
      <span class="mini__rail"></span>
      <span class="mini__imgs">${ps.map(p => p.img ? `<img class="cut" src="${p.img}" alt="">` : `<img src="${p.photo}" alt="">`).join("")}</span>
      <span class="mini__meta"><b>${c.group ? c.group + "'s " : ""}${c.name}</b><span>${c.count} jacket${c.count === 1 ? "" : "s"} →</span></span>
    </a>`;
  }

  window.LFS = { $, $$, D, isTouch, reduced, lenis, lock, unlock, reveals, splitWords, cursor, cart, toast, leaveTo, itemHTML, stepBody, renderBody, cardHTML, miniHTML, money, range, stars, catOf, url };

  // run reveals after the page script has added its markup
  window.addEventListener("DOMContentLoaded", () => {
    reveals();
    gsap.from(".ftr__giant", { yPercent: 60, opacity: 0, ease: "none", scrollTrigger: { trigger: ".ftr", start: "top 90%", end: "bottom bottom", scrub: true } });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  });
})();
