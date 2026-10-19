
import { useEffect, useMemo, useState } from "react";
import "./index.css";

const products = [
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
  const letters = ["F", "A", "S", "H", "O", "N", "E"];

  return (
    <div className="fashone-intro" role="status" aria-label="FASHONE">
      <div className="intro-image" />

      <div className="intro-overlay">
        <div className="intro-word">
          {letters.map((letter, index) => (
            <span
              key={letter}
              className="intro-letter"
              style={{ animationDelay: `${index * 0.28}s, 3.1s` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(readSavedCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");


  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, 4000);

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
  }, [category, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id && item.size === product.size
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    setNotice(`${product.name} added to your bag`);
    setCartOpen(true);
  }

  function changeQuantity(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  return (
    <>
      {showIntro && <BrandIntro />}

      <div className="site-shell">
        <header className="header">
          <a className="wordmark" href="#home" aria-label="FASHONE home">
            FASHONE<span>.</span>
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#home">HOME</a>
            <a href="#collection">SHOP MEN</a>
            <a href="#story">OUR STORY</a>
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
                      onClick={() => addToCart({ ...product, size: "M" })}
                    >
                      ADD TO BAG <span>+</span>
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
                  versatile pieces that go beyond passing trends. No unnecessary
                  noise. Just style that feels like you.
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
          <a className="wordmark footer-logo" href="#home">
            FASHONE<span>.</span>
          </a>

          <p>MODERN ESSENTIALS. EVERYDAY CONFIDENCE.</p>

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
                  onClick={() => {
                    addToCart({
                      ...selectedProduct,
                      size: selectedSize,
                    });
                    setSelectedProduct(null);
                  }}
                >
                  ADD TO BAG — {money(selectedProduct.price)}
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
                              onClick={() => changeQuantity(item.id, -1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              onClick={() => changeQuantity(item.id, 1)}
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
                      onClick={() =>
                        setNotice(
                          "Demo checkout only. Connect a backend and payment gateway before accepting real orders."
                        )
                      }
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
      </div>
    </>
  );
}
