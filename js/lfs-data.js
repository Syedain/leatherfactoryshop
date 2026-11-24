/* =========================================================
   Leather Factory Shop — catalogue for the design preview
   Products, prices and photos come from leatherfactoryshop.com.
   In WordPress this file is replaced by live WooCommerce data.
   ========================================================= */
window.LFS_DATA = (() => {
  const CONTACT = {
    email: "support@leatherfactoryshop.com",
    phone: "+1 (210) 943-3934",
    phone2: "+1 (210) 889-4100",
    facebook: "https://web.facebook.com/leatherfactoryshop",
    instagram: "https://www.instagram.com/leatherfactoryshop/"
  };

  /* racks / categories (mirrors the current site menu) */
  const CATS = [
    { slug: "men-biker", group: "Men", name: "Biker", full: "Men's Biker", line: "Find the perfect look with protection for your motorcycle ride." },
    { slug: "men-bomber", group: "Men", name: "Bomber", full: "Men's Bomber", line: "Shearling collars, ribbed cuffs and flight-ready warmth." },
    { slug: "men-hooded", group: "Men", name: "Hooded & Coats", full: "Men's Hooded", line: "Long cuts and hoods for the coldest rides of the year." },
    { slug: "men-vest", group: "Men", name: "Vest", full: "Men's Vest", line: "All the attitude of a biker jacket, none of the sleeves." },
    { slug: "women-biker", group: "Women", name: "Biker", full: "Women's Biker", line: "Studded, padded and made to turn heads on and off the bike." },
    { slug: "women-bomber", group: "Women", name: "Bomber", full: "Women's Bomber", line: "Soft lambskin and suede bombers with a tailored fit." },
    { slug: "new-arrivals", group: "", name: "New Arrivals", full: "New Arrivals", line: "Boost your soul with style.", virtual: p => p.isNew },
    { slug: "last-call", group: "", name: "Last Call", full: "Last Call", line: "Final pieces of past collections. Once they're gone, they're gone.", virtual: p => p.lastCall }
  ];

  /* img: transparent cut-out (hangs on a hanger)  ·  photo: original product photo */
  const P = (slug, name, cat, min, max, rating, photo, img, extra = {}) =>
    Object.assign({ slug, name, cat, price: [min, max], rating, photo: "assets/photos/" + photo, img: img ? "assets/products/" + img : null }, extra);

  const PRODUCTS = [
    P("asymmetric-gray-dual-zipper-jacket", "Asymmetric Gray Dual Zipper Jacket", "men-biker", 150, 170, 3.8, "asymmetric-gray.jpg", "asymmetric-gray.png"),
    P("classic-moto-jacket", "Classic Moto Jacket", "men-biker", 300, 320, 4.25, "classic-moto.jpg", "classic-moto.png"),
    P("cowhide-warm", "Cowhide Warm", "men-biker", 170, 190, 3.89, "cowhide-warm.jpg", "cowhide-warm.png"),
    P("brute-moto-jacket", "Brute Moto Jacket", "men-biker", 125, 145, 4.67, "brute-moto.jpg", null, { lastCall: true }),
    P("adventuresome", "Adventuresome", "men-biker", 150, 170, 4.4, "adventuresome.jpg", null),
    P("black-bomber-leather-jacket", "Black Bomber Leather Jacket", "men-bomber", 160, 180, 4.43, "black-bomber.jpg", "black-bomber.png", { isNew: true }),
    P("bomber-leather-jacket-blue", "Bomber Leather Jacket Blue", "men-bomber", 140, 160, 3.0, "bomber-blue.jpg", "bomber-blue.png", { isNew: true }),
    P("brown-belted-cuffs-bomber-leather-jacket", "Brown Belted Cuffs Bomber Leather Jacket", "men-bomber", 280, 300, 4.11, "brown-belted-cuffs.webp", null, { isNew: true }),
    P("aviator-shearling", "Aviator Shearling", "men-bomber", 270, 290, 4.25, "aviator-shearling.jpg", null),
    P("coffee-hot", "Coffee Hot", "men-bomber", 290, 310, 4.29, "coffee-hot.jpg", null, { lastCall: true }),
    P("aeronaut-long-coat", "Aeronaut Long Shearling Coat", "men-hooded", 250, 270, 4.31, "aeronaut-long-coat.jpg", null),
    P("beast-cowhide-biker", "Beast Cowhide Biker", "men-vest", 100, 120, 3.67, "beast-cowhide-biker.jpg", null, { lastCall: true }),
    P("back-skull-speckled-chic", "Back Skull Speckled Chic", "women-biker", 190, 200, 0, "back-skull.jpg", "back-skull.png"),
    P("back-skull-speckled-chic-pink", "Back Skull Speckled Chic Pink Leather Jacket", "women-biker", 190, 200, 3.0, "back-skull-pink.jpg", "back-skull-pink.png"),
    P("biker-brown-retro-padded-style", "Biker Brown Retro Padded Style", "women-biker", 140, 150, 0, "biker-brown-retro.jpg", "biker-brown-retro.png"),
    P("a-1-mocha-suede-bomber-jacket", "A-1 Mocha Suede Bomber Jacket", "women-bomber", 120, 130, 0, "a1-mocha-suede.jpg", null, { isNew: true }),
    P("ava-ma-1-brown-leather-bomber-jacket", "Ava Ma-1 Brown Leather Bomber Jacket", "women-bomber", 130, 140, 0, "ava-ma1.jpg", null, { isNew: true }),
    P("black-leather-bomber-jacket", "Black Leather Bomber Jacket", "women-bomber", 110, 120, 0, "w-black-bomber.jpg", null, { isNew: true }),
    P("brown-bomber-leather-jacket-womens", "Brown Bomber Leather Jacket Women's", "women-bomber", 100, 110, 0, "w-brown-bomber.jpg", null, { isNew: true }),
    P("hooded-bomber-leather-jacket", "Hooded Bomber Leather Jacket", "women-bomber", 140, 150, 0, "w-hooded-bomber.jpg", null, { isNew: true }),
    P("roslyn-green-hooded-leather-bomber-jacket", "Roslyn Green Hooded Leather Bomber Jacket", "women-bomber", 150, 160, 0, "roslyn-green.jpg", null, { isNew: true }),
    P("sherilyn-b-3-brown-leather-bomber-jacket", "Sherilyn B-3 Brown Leather Bomber Jacket", "women-bomber", 170, 180, 0, "sherilyn-b3.jpg", null, { isNew: true }),
    P("stella-g-1-brown-leather-bomber-jacket", "Stella G-1 Brown Leather Bomber Jacket", "women-bomber", 160, 170, 0, "stella-g1.jpg", null, { isNew: true }),
    P("women-bomber-style-leather-jacket-burnt-red", "Women Bomber Style Leather Jacket Burnt Red", "women-bomber", 240, 250, 0, "burnt-red.jpg", null, { lastCall: true })
  ];
  PRODUCTS.forEach((p, i) => { p.id = i + 1; });

  const inCat = slug => {
    const c = CATS.find(x => x.slug === slug);
    if (!c) return [];
    return PRODUCTS.filter(p => (c.virtual ? c.virtual(p) : p.cat === slug));
  };
  CATS.forEach(c => { c.count = inCat(c.slug).length; });

  /* size-based pricing: the site shows a price range per jacket */
  const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const sizePrice = (p, size) => (SIZES.indexOf(size) >= 5 ? p.price[1] : p.price[0]);

  return { CONTACT, CATS, PRODUCTS, inCat, SIZES, sizePrice };
})();
