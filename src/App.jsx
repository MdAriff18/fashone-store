import PolicyPage from "./PolicyPage";
import { useEffect, useMemo, useState } from "react";
import "./index.css";
import MyOrders from "./MyOrders";


const fallbackProducts = [
  {
    id: 1,
    name: "Everyday Relaxed Tee",
    category: "T-Shirts",
    price: 699,
    oldPrice: 899,
    color: "Cloud White",
    image: "https://i.pinimg.com/1200x/1f/bc/ee/1fbceebdc7420cf3c5bd2bfcde1a573e.jpg",
    badge: "",
  },
  {
    id: 2,
    name: "Classic Oxford T-Shirt",
    category: "T-Shirts",
    price: 1499,
    oldPrice: 1799,
    color: "Pure White",
    image: "https://i.pinimg.com/1200x/1e/ef/6a/1eef6a0bbb726c763c4c822c3668c87c.jpg",
    badge: "NEW",
  },
  {
    id: 3,
    name: "LINEN Shirt",
    category: "Shirts",
    price: 1599,
    oldPrice: 1899,
    color: "Teal Blue",
    image: "https://i.pinimg.com/736x/20/8a/a3/208aa3f0560d3b7b21638dd73138d5c3.jpg",
    badge: "",
  },
  {
    id: 4,
    name: "Premium Casual Shirt",
    category: "Shirts",
    price: 1399,
    oldPrice: 1699,
    color: "Jeans Blue",
    image: "https://i.pinimg.com/736x/02/32/0c/02320c44fcf14d1d32e53ab5e190f844.jpg",
    badge: "",
  },
  {
    id: 5,
    name: "Relaxed Fit Trousers",
    category: "Trousers",
    price: 1599,
    oldPrice: 1899,
    color: "Black",
    image: "https://i.pinimg.com/1200x/be/e6/6f/bee66f924b5abdc97b3528bae1c871cc.jpg",
    badge: "",
  },
  {
    id: 6,
    name: "Formal Trouser",
    category: "Trousers",
    price: 1599,
    oldPrice: 1899,
    color: "Brownie",
    image: "https://i.pinimg.com/1200x/db/35/f9/db35f975e1b72573e806fa73c0b514f5.jpg",
    badge: "",
  },
  {
    id: 7,
    name: "Essential Oversized Tee",
    category: "T-Shirts",
    price: 799,
    oldPrice: 999,
    color: "Jet Black",
    image: "https://i.pinimg.com/1200x/fd/20/76/fd2076a69a8ba6688dfc42d03a4516bc.jpg",
    badge: "BESTSELLER",
  },
  {
    id: 8,
    name: "Modern Oversized T-shirt",
    category: "T-Shirts",
    price: 1699,
    oldPrice: 1999,
    color: "Stone Black",
    image: "https://i.pinimg.com/736x/ac/36/6d/ac366df52325ceb7b57c04017234c015.jpg",
    badge: "NEW",
  },
  {
    id: 9,
    name: "Urban Bomber Jacket",
    category: "Jackets",
    price: 2499,
    oldPrice: 2999,
    color: "Black",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
    badge: "LIMITED",
  },
  {
    id: 10,
    name: "Minimal Everyday Tee",
    category: "T-Shirts",
    price: 749,
    oldPrice: 949,
    color: "Brown",
    image: "https://i.pinimg.com/736x/cb/34/10/cb34109d2bfbae145b560ccb622380f6.jpg",
    badge: "",
  },
  {
    id: 11,
    name: "LINEN Shirt",
    category: "Shirts",
    price: 1599,
    oldPrice: 1899,
    color: "Ocean Blue",
    image: "https://i.pinimg.com/736x/dd/bd/72/ddbd726388d59b175e1bab2a7c5a4457.jpg",
    badge: "",
  },
  {
    id: 12,
    name: "Premium Casual Shirt",
    category: "Shirts",
    price: 1399,
    oldPrice: 1699,
    color: "Olive",
    image: "https://i.pinimg.com/1200x/64/b4/7d/64b47db02697a4095843ada1e3610775.jpg",
    badge: "",
  },
  {
    id: 13,
    name: "Premium Casual Shirt",
    category: "Shirts",
    price: 1399,
    oldPrice: 1699,
    color: "Pastal Coral",
    image: "https://i.pinimg.com/1200x/8d/44/76/8d4476aad26ec7d36e2ee28be27edd82.jpg",
    badge: "",
  },
  {
    id: 14,
    name: "Relaxed Trouser",
    category: "Trousers",
    price: 1599,
    oldPrice: 1899,
    color: "Beige",
    image: "https://i.pinimg.com/1200x/ff/4f/95/ff4f95ea44fe57e5184b3cca434f2fae.jpg",
    badge: "",
  },
  {
    id: 15,
    name: "Dotted Trouser",
    category: "Trousers",
    price: 1599,
    oldPrice: 1899,
    color: "White",
    image: "https://i.pinimg.com/1200x/79/27/b6/7927b68555354b63c51b4309ef16addf.jpg",
    badge: "",
  },
  {
    id: 16,
    name: "Formal Trouser",
    category: "Trousers",
    price: 1599,
    oldPrice: 1899,
    color: "Navy Blue",
    image: "https://i.pinimg.com/736x/17/6c/65/176c65940a58000cb13268a7d3cf75cc.jpg",
    badge: "",
  },
];

const categories = ["All", "T-Shirts", "Shirts", "Trousers", "Jackets"];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function readSavedCart() {
  try {
    return JSON.parse(localStorage.getItem("fashone-cart")) || [];
  } catch {
    return [];
  }
}

function BrandIntro() {
  return (
    <div className="fashone-intro" role="status" aria-label="FASHONE">
      <div className="intro-image" />

      <svg
        className="intro-mask"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <mask
            id="fashone-cutout"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1000"
            height="500"
          >
            <rect
              x="0"
              y="0"
              width="1000"
              height="500"
              fill="white"
            />
            <text
              className="intro-signature"
              x="500"
              y="315"
              textAnchor="middle"
              fontFamily="Italianno, cursive"
              fontSize="300"
              fontWeight="400"
              fill="none"
              stroke="black"
              strokeWidth="1.2"
            >
              Fashone
            </text>
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="1000"
          height="500"
          fill="#777"
          fillOpacity="0.85"
          mask="url(#fashone-cutout)"
        />
      </svg>
    </div>
  );
}



function StoreApp() {
    const [products, setProducts] = useState(fallbackProducts);


  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "https://fashone-backend.onrender.com"}/api/products`
        );

        if (!response.ok) {
          throw new Error("Unable to load products");
        }

        const data = await response.json();

        if (!Array.isArray(data.products)) {
          throw new Error("Invalid products response");
        }

        const loadedProducts = data.products.map((product) => {
          const rawStock =
            product.stockQuantity ?? product.stock_quantity;

          return {
            ...product,
            id: Number(product.id),
            price: Number(product.price),
            oldPrice:
              product.oldPrice == null
                ? 0
                : Number(product.oldPrice),
            stockQuantity:
              rawStock == null ? 0 : Number(rawStock),
            badge:
              fallbackProducts.find(
                (item) => item.id === Number(product.id)
              )?.badge || "",
          };
        });

        if (!cancelled) {
          setProducts(loadedProducts);

          setSelectedProduct((current) => {
            if (!current) return current;

            return (
              loadedProducts.find(
                (product) => product.id === Number(current.id)
              ) || current
            );
          });
        }
      } catch (error) {
        console.error("Products API failed:", error.message);
      }
    }

    loadProducts();

    // Refresh stock when the visitor returns to the store.
    const refreshOnFocus = () => loadProducts();

    window.addEventListener("focus", refreshOnFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, []);

  const [showIntro, setShowIntro] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(readSavedCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [customer, setCustomer] = useState({
    customer_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
  });


  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, 3800);

    return () => window.clearTimeout(timer);
  }, []);


  useEffect(() => {
    localStorage.setItem("fashone-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.color.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async (event) => {
  event.preventDefault();

  if (cart.length === 0) {
    setNotice("Your bag is empty.");
    return;
  }

  setPlacingOrder(true);
  setNotice("");

  try {
    const response = await fetch("https://fashone-backend.onrender.com/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...customer,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          size: item.size || null,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        shipping_fee: 0,
        total: subtotal,
        payment_method: "COD",
      }),
    });

    const data = await response.json();
    console.log("FASHONE API PRODUCTS:", data.products);

    if (!response.ok) {
      throw new Error(data.error || "Unable to place order.");
    }

    setOrderSuccess(data.order);
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setCustomer({
      customer_name: "",
      phone: "",
      address_line: "",
      city: "",
      state: "",
      postal_code: "",
    });
    setNotice("");
  } catch (error) {
    setNotice(
      error.message === "Failed to fetch"
        ? "Backend connection failed. Please check that your server is running."
        : error.message
    );
  } finally {
    setPlacingOrder(false);
  }
};


  function addToCart(product) {
    const stock = Number(product.stockQuantity ?? 0);

    if (stock <= 0) {
      setNotice("Sorry, this product is out of stock.");
      setCartOpen(true);
      return;
    }

    const existing = cart.find(
      (item) =>
        item.id === product.id &&
        item.size === product.size
    );

    if (existing && existing.quantity >= stock) {
      setNotice(`Only ${stock} item(s) available in stock.`);
      setCartOpen(true);
      return;
    }

    setCart((current) => {
      const currentItem = current.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size
      );

      if (currentItem) {
        if (currentItem.quantity >= stock) {
          return current;
        }

        return current.map((item) =>
          item.id === product.id &&
          item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setNotice(`${product.name} added to your bag`);
    setCartOpen(true);
  }



  function changeQuantity(id, size, amount) {
    const cartItem = cart.find(
      (item) => item.id === id && item.size === size
    );

    if (!cartItem) return;

    const product = products.find(
      (item) => item.id === id
    );

    const stock = Number(product?.stockQuantity ?? 0);
    const nextQuantity = cartItem.quantity + amount;

    if (nextQuantity > stock) {
      setNotice(`Only ${stock} item(s) available in stock.`);
      return;
    }

    setCart((current) =>
      current
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

    setNotice("");
  }


  return (
    <>
      {showIntro && <BrandIntro />}

      <div className="site-shell">
        <header className="header">
        <a className="wordmark" href="#home" aria-label="FASHONE home">
          <img
            src="/images/fashone-logo-transparent.png"
            alt="FASHONE"
            className="wordmark-image"
          />
        </a>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#home">HOME</a>
            <a href="#collection">SHOP MEN</a>
            <a href="#story">OUR STORY</a>
            <a href="/orders">ORDERS</a>
          </nav>

          <div className="header-actions">
            <button
              className="icon-button search-toggle"
              onClick={() => {
                document.getElementById("product-search")?.focus();
                document.getElementById("collection")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              aria-label="Search products"
            >
              SEARCH
            </button>

            <button
              className="bag-button"
              onClick={() => setCartOpen(!cartOpen)}
            >
              BAG ({cartCount})
            </button>
          </div>
        </header>

        <main>
          <section className="hero" id="home">
            <img
              className="hero-image"
              src="/images/hero.png"
              alt="FASHONE premium men's fashion"
            />

            <div className="hero-shade" />

            <div className="hero-copy">
              <p className="eyebrow light">FASHONE / COLLECTION 01</p>

              <h1>
                LESS NOISE.
                <br />
                MORE STYLE.
              </h1>

              <p className="hero-description">
                Everyday essentials. Elevated design.
                <br />
                Made for the way you move.
              </p>

              <a className="primary-button" href="#collection">
                SHOP THE COLLECTION <span>↗</span>
              </a>
            </div>

            <div className="hero-index">01 — 04 / THE NEW STANDARD</div>
          </section>

          <div className="announcement">
            NEW SEASON, NEW ESSENTIALS — FREE SHIPPING ON ORDERS ABOVE ₹1,999
          </div>

          <section className="intro-strip">
            <p>BUILT FOR EVERY DAY.</p>
            <p>DESIGNED TO STAND OUT.</p>
            <p>MADE TO BE YOURS.</p>
          </section>

          <section className="collection section-wrap" id="collection">
            <div className="section-heading">
              <div>
                <p className="eyebrow">THE FASHONE EDIT</p>
                <h2>MEN'S COLLECTION</h2>
                <p className="muted">
                  Considered essentials for your everyday wardrobe.
                </p>
              </div>

              <div className="search-box">
                <span>⌕</span>
                <input
                  id="product-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products"
                  aria-label="Search products"
                />
              </div>
            </div>

            <div className="collection-toolbar">
              <div className="category-list">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={
                      category === item ? "category active" : "category"
                    }
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <span className="result-count">
                {filteredProducts.length} PRODUCTS
              </span>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedSize("M");
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedProduct(product);
                          setSelectedSize("M");
                        }
                      }}
                      aria-label={`View ${product.name} details`}
                    />

                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}


                    <button
                      className="quick-add"
                      disabled={Number(product.stockQuantity ?? 0) <= 0}
                      onClick={() => addToCart({ ...product, size: "M" })}
                    >
                      {Number(product.stockQuantity ?? 0) <= 0
                        ? "SOLD OUT"
                        : "ADD TO BAG"}
                      {Number(product.stockQuantity ?? 0) > 0 && <span>+</span>}
                    </button>
                  </div>

                  <div className="product-info">
                    <div>
                      <h3
                        className="clickable-product-name"
                        onClick={() => {
                          setSelectedProduct(product);
                          setSelectedSize("M");
                        }}
                      >
                        {product.name}
                      </h3>
                      <p className="product-color">{product.color}</p>
                    </div>

                    <div className="price-wrap">
                      <span className="price">{money(product.price)}</span>
                      <span className="old-price">
                        {money(product.oldPrice)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-results">
                <h3>No products found</h3>
                <p>Try another search or choose a different category.</p>

                <button
                  className="outline-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  CLEAR FILTERS
                </button>
              </div>
            )}
          </section>


          <section className="our-story section-wrap" id="story">
            <div className="story-label">
              <span className="story-line"></span>
              <p className="eyebrow">GET TO KNOW FASHONE</p>
            </div>

            <div className="story-content">
              <div className="story-heading">
                <p className="story-number">01 — OUR STORY</p>
                <h2>
                  LESS NOISE.
                  <br />
                  <span>MORE MEANING.</span>
                </h2>

              </div>

              <div className="story-description">
                <p className="story-intro">
                  Style doesn't need to be loud to make a statement.
                </p>

                <p>
                  FASHONE was built around a simple idea — everyday clothing
                  should feel effortless, look refined, and reflect who you are.
                </p>

                <p>
                  We believe in timeless essentials, thoughtful details, and
                  versatile pieces that go beyond passing trends. Our approach
                  to fashion is rooted in simplicity: pieces that work together,
                  feel comfortable, and give you confidence wherever the day takes you.
                </p>

                <p>
                  From everyday essentials to elevated looks, our vision is to
                  make getting dressed feel natural. No unnecessary noise.
                  No need to follow every trend. Just a style that feels like you.
                </p>

                <a href="#collection" className="story-link">
                  DISCOVER THE COLLECTION <span>↗</span>
                </a>
              </div>
            </div>

            <div className="story-bottom">
              <span>TIMELESS BY DESIGN</span>
              <span>MADE FOR YOUR EVERYDAY</span>
              <span>FASHONE®</span>
            </div>
          </section>

          <section className="our-story section-wrap" id="about">
            <div className="story-label">
              <span className="story-line"></span>
              <p className="eyebrow">ABOUT FASHONE</p>
            </div>

            <div className="story-content">
              <div className="story-heading">
                <p className="story-number">02 — ABOUT US</p>
                <h2>
                  MORE THAN
                  <br />
                  <span>JUST CLOTHING.</span>
                </h2>
              </div>

              <div className="story-description">
                <p className="story-intro">
                  Modern essentials. Everyday confidence.
                </p>

                <p>
                  FASHONE is a modern menswear brand built around clean design,
                  versatile essentials, and a confident approach to everyday style.
                </p>

                <p>
                  We believe great style comes from the details — a considered
                  fit, a simple silhouette, and colours that work effortlessly
                  with the rest of your wardrobe.
                </p>

                <p>
                  Our aim is to make fashion feel approachable and personal.
                  Whether you're dressing for a casual day out or putting
                  together a more refined look, we want your wardrobe to feel
                  effortless and true to you.
                </p>

                <div className="about-values">
                  <div>
                    <span>01</span>
                    <h3>OUR VISION</h3>
                    <p>
                      Timeless style that feels relevant today and beyond
                      passing trends.
                    </p>
                  </div>

                  <div>
                    <span>02</span>
                    <h3>OUR APPROACH</h3>
                    <p>
                      Clean design, versatile essentials, and a simple
                      shopping experience.
                    </p>
                  </div>
                </div>

                <a href="#collection" className="story-link">
                  EXPLORE OUR COLLECTION <span>↗</span>
                </a>
              </div>
            </div>

            <div className="story-bottom">
              <span>MINIMAL BY DESIGN</span>
              <span>TIMELESS IN STYLE</span>
              <span>FASHONE®</span>
            </div>
          </section>




          <section className="brand-banner">
            <p className="eyebrow light">THE FASHONE PHILOSOPHY</p>
            <h2>
              YOUR STYLE.
              <br />
              YOUR RULES.
            </h2>
            <p>
              Less, but better. Pieces you'll reach for again and again.
            </p>

            <a href="#collection" className="outline-light-button">
              FIND YOUR FIT ↗
            </a>
          </section>

          <section className="newsletter">
            <p className="eyebrow">STAY IN THE LOOP</p>
            <h2>GOOD STYLE. NO SPAM.</h2>
            <p>
              Be first to hear about new drops and collection updates.
            </p>

            <form
              className="newsletter-form"
              onSubmit={(event) => {
                event.preventDefault();
                setNotice(
                  "Newsletter signup needs an email service to be connected."
                );
                setCartOpen(true);
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Your email address"
                required
              />
              <button type="submit">SIGN ME UP ↗</button>
            </form>
          </section>
        </main>



      <footer className="footer">
        <a className="wordmark footer-logo" href="/#home">
          FASHONE<span>.</span>
        </a>

        <p>MODERN ESSENTIALS. EVERYDAY CONFIDENCE.</p>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="/about">ABOUT US</a>
          <a href="/contact">CONTACT</a>
          <a href="/shipping-policy">SHIPPING POLICY</a>
          <a href="/return-policy">RETURNS &amp; REFUNDS</a>
          <a href="/track-order">TRACK ORDER</a>
        </nav>

        <p className="footer-small">
          © {new Date().getFullYear()} FASHONE. ALL RIGHTS RESERVED.
        </p>
      </footer>



        {selectedProduct && (
          <div
            className="product-modal-backdrop"
            onClick={() => setSelectedProduct(null)}
          >
            <section
              className="product-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedProduct.name} details`}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="product-modal-close"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details"
              >
                ×
              </button>

              <div className="product-modal-image-wrap">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                />
              </div>

              <div className="product-modal-info">
                <p className="eyebrow">FASHONE / COLLECTION 01</p>

                {selectedProduct.badge && (
                  <span className="modal-product-badge">
                    {selectedProduct.badge}
                  </span>
                )}

                <h2>{selectedProduct.name}</h2>

                <p className="modal-product-color">
                  Colour: {selectedProduct.color}
                </p>

                <div className="modal-product-price">
                  <strong>{money(selectedProduct.price)}</strong>
                  <span>{money(selectedProduct.oldPrice)}</span>
                </div>

                <p className="modal-product-description">
                  A considered everyday essential with a modern fit. Designed
                  to bring effortless style to your wardrobe.
                </p>

                <p className="size-label">SELECT SIZE</p>

                <div className="size-options">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      className={
                        selectedSize === size
                          ? "size-option selected"
                          : "size-option"
                      }
                      onClick={() => setSelectedSize(size)}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button
                  className="modal-add-button"
                  disabled={Number(selectedProduct.stockQuantity ?? 0) <= 0}
                  onClick={() => {
                    if (Number(selectedProduct.stockQuantity ?? 0) <= 0) {
                      setNotice("Sorry, this product is out of stock.");
                      return;
                    }

                    addToCart({
                      ...selectedProduct,
                      size: selectedSize,
                    });

                    setSelectedProduct(null);
                  }}
                >
                  {Number(selectedProduct.stockQuantity ?? 0) <= 0
                    ? "SOLD OUT"
                    : `ADD TO BAG — ${money(selectedProduct.price)}`}
                </button>


                <p className="modal-small-note">
                  Easy everyday style. Made to be yours.
                </p>
              </div>
            </section>
          </div>
        )}

        {cartOpen && (
          <div
            className="drawer-backdrop"
            onClick={() => setCartOpen(false)}
          >
            <aside
              className="cart-drawer"
              onClick={(event) => event.stopPropagation()}
              aria-label="Shopping bag"
            >
              <div className="drawer-heading">
                <div>
                  <p className="eyebrow">YOUR SELECTION</p>
                  <h2>YOUR BAG ({cartCount})</h2>
                </div>

                <button
                  className="close-button"
                  onClick={() => setCartOpen(false)}
                  aria-label="Close bag"
                >
                  ×
                </button>
              </div>

              {notice && <p className="cart-notice">{notice}</p>}

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your bag is waiting for something good.</p>
                  <button
                    className="primary-button"
                    onClick={() => setCartOpen(false)}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div
                        className="cart-item"
                        key={`${item.id}-${item.size || "default"}`}
                      >
                        <img src={item.image} alt={item.name} />

                        <div className="cart-item-details">
                          <h3>{item.name}</h3>
                          <p>
                            {item.color}
                            {item.size ? ` · Size ${item.size}` : ""}
                          </p>
                          <strong>{money(item.price)}</strong>

                          <div className="quantity-control">
                            <button
                              onClick={() => changeQuantity(item.id, item.size, -1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              onClick={() => changeQuantity(item.id, item.size, 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="remove-item"
                            onClick={() =>
                              setCart((current) =>
                                current.filter(
                                  (cartItem) =>
                                    !(
                                      cartItem.id === item.id &&
                                      cartItem.size === item.size
                                    )
                                )
                              )
                            }
                          >
                            REMOVE ITEM ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-summary">
                    <div className="subtotal-row">
                      <span>SUBTOTAL</span>
                      <strong>{money(subtotal)}</strong>
                    </div>

                    <p>Shipping and taxes calculated at checkout.</p>

                    <button
                      className="checkout-button"
                      onClick={() => {
                        setNotice("");
                        setCheckoutOpen(true);
                      }}
                    >
                      PROCEED TO CHECKOUT ↗
                    </button>

                    <button
                      className="continue-button"
                      onClick={() => setCartOpen(false)}
                    >
                      CONTINUE SHOPPING
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>
        )}
        {checkoutOpen && (
          <div
            className="drawer-backdrop"
            onClick={() => setCheckoutOpen(false)}
          >
            <section
              className="cart-drawer checkout-panel"
              onClick={(event) => event.stopPropagation()}
              aria-label="Checkout"
            >
              <div className="drawer-heading">
                <div>
                  <p className="eyebrow">ALMOST YOURS</p>
                  <h2>DELIVERY DETAILS</h2>
                </div>

                <button
                  className="close-button"
                  onClick={() => setCheckoutOpen(false)}
                  aria-label="Close checkout"
                >
                  ×
                </button>
              </div>

              {notice && <p className="cart-notice">{notice}</p>}

              <form onSubmit={placeOrder} className="checkout-form">
                <label>
                  Full name
                  <input
                    required
                    autoComplete="name"
                    value={customer.customer_name}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        customer_name: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Phone number
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    title="Enter a 10-digit Indian phone number"
                    autoComplete="tel"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        phone: e.target.value,
                      })
                    }
                  />
                </label>

                
                <label>
                  Email address
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={customer.email || ""}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        email: e.target.value,
                      })
                    }
                  />
                </label>


                <label>
                  House number and street address
                  <textarea
                    required
                    autoComplete="street-address"
                    value={customer.address_line}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        address_line: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  City
                  <input
                    required
                    autoComplete="address-level2"
                    value={customer.city}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        city: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  State
                  <input
                    required
                    autoComplete="address-level1"
                    value={customer.state}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        state: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  PIN code
                  <input
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    title="Enter a 6-digit PIN code"
                    autoComplete="postal-code"
                    value={customer.postal_code}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        postal_code: e.target.value,
                      })
                    }
                  />
                </label>

                <div className="checkout-total">
                  <span>Payment method</span>
                  <strong>Cash on Delivery (COD)</strong>
                </div>

                <div className="checkout-total">
                  <span>Subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </div>

                <div className="checkout-total">
                  <span>Shipping</span>
                  <strong>FREE</strong>
                </div>

                <div className="checkout-total">
                  <span>Total</span>
                  <strong>{money(subtotal)}</strong>
                </div>

                <button
                  type="submit"
                  className="checkout-button"
                  disabled={placingOrder}
                >
                  {placingOrder ? "PLACING ORDER..." : "PLACE COD ORDER ↗"}
                </button>
              </form>
            </section>
          </div>
        )}

          {orderSuccess && (
            <div className="drawer-backdrop">
              <section className="cart-drawer order-success">
                <p className="eyebrow">THANK YOU FOR CHOOSING FASHONE</p>

                <h2>ORDER PLACED</h2>

                <p>Your order has been saved successfully.</p>

                <div className="order-number-box">
                  <span className="eyebrow">YOUR ORDER NUMBER</span>
                  <strong>{orderSuccess.order_number}</strong>
                  <span className="order-confirmed">✓ ORDER CONFIRMED</span>
                </div>

                <button
                  type="button"
                  className="continue-button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        orderSuccess.order_number
                      );
                      setNotice("Order number copied successfully!");
                    } catch {
                      setNotice(
                        `Your order number is ${orderSuccess.order_number}`
                      );
                    }
                  }}
                >
                  COPY ORDER NUMBER
                </button>

                {notice && <p role="status">{notice}</p>}

                <a
                  href="/track-order"
                  className="checkout-button"
                  style={{
                    display: "block",
                    textAlign: "center",
                    textDecoration: "none",
                    boxSizing: "border-box",
                    marginTop: 12,
                  }}
                >
                  TRACK YOUR ORDER →
                </a>

                <button
                  type="button"
                  className="continue-button"
                  style={{ marginTop: 12 }}
                  onClick={() => {
                    setOrderSuccess(null);
                    setNotice("");
                  }}
                >
                  CONTINUE SHOPPING
                </button>
              </section>
            </div>
          )}


      </div>
    </>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  const policyPaths = [
    "/about",
    "/contact",
    "/shipping-policy",
    "/return-policy",
  ];

  if (path === "/orders") {
  return <MyOrders />;
  }

  if (policyPaths.includes(path)) {
    return <PolicyPage path={path} />;
  }

  return <StoreApp />;
}