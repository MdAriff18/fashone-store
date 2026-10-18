
import { useEffect, useMemo, useState } from "react";
import "./index.css";

const products = [
  {
    id: 1,
    name: "Essential Oversized Tee",
    category: "T-Shirts",
    price: 799,
    oldPrice: 999,
    color: "Jet Black",
    image:
      "https://i.pinimg.com/1200x/fd/20/76/fd2076a69a8ba6688dfc42d03a4516bc.jpg",
    badge: "BESTSELLER",
  },
  {
    id: 2,
    name: "Classic Oxford Shirt",
    category: "Shirts",
    price: 1499,
    oldPrice: 1799,
    color: "Pure White",
    image:
      "https://i.pinimg.com/1200x/1e/ef/6a/1eef6a0bbb726c763c4c822c3668c87c.jpg",
    badge: "NEW",
  },
  {
    id: 3,
    name: "Everyday Relaxed Tee",
    category: "T-Shirts",
    price: 699,
    oldPrice: 899,
    color: "Cloud White",
    image:
      "https://i.pinimg.com/1200x/1f/bc/ee/1fbceebdc7420cf3c5bd2bfcde1a573e.jpg",
    badge: "",
  },
  {
    id: 4,
    name: "Modern Straight Trousers",
    category: "Trousers",
    price: 1699,
    oldPrice: 1999,
    color: "Stone Grey",
    image:
      "https://i.pinimg.com/736x/ac/36/6d/ac366df52325ceb7b57c04017234c015.jpg",
    badge: "NEW",
  },
  {
    id: 5,
    name: "Premium Casual Shirt",
    category: "Shirts",
    price: 1399,
    oldPrice: 1699,
    color: "Olive",
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=85",
    badge: "",
  },
  {
    id: 6,
    name: "Urban Bomber Jacket",
    category: "Jackets",
    price: 2499,
    oldPrice: 2999,
    color: "Black",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85",
    badge: "LIMITED",
  },
  {
    id: 7,
    name: "Minimal Everyday Tee",
    category: "T-Shirts",
    price: 749,
    oldPrice: 949,
    color: "Charcoal",
    image:
      "https://i.pinimg.com/736x/cb/34/10/cb34109d2bfbae145b560ccb622380f6.jpg",
    badge: "",
  },
  {
    id: 8,
    name: "Relaxed Fit Trousers",
    category: "Trousers",
    price: 1599,
    oldPrice: 1899,
    color: "Beige",
    image:
      "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=800&q=85",
    badge: "",
  },
];

const categories = [
  "All",
  "T-Shirts",
  "Shirts",
  "Trousers",
  "Jackets",
];

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

export default function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(readSavedCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");

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
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
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
    <div className="site-shell">
      <div className="announcement">
        NEW SEASON, NEW ESSENTIALS — FREE SHIPPING ON ORDERS ABOVE ₹1,999
      </div>

      <header className="header">
        <a className="wordmark" href="#home" aria-label="FASHONE home">
          FASHONE.<span></span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#home">HOME</a>
          <a href="#collection">SHOP MEN</a>
          <a href="#story">OUR STORY</a>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button search-toggle"
            onClick={() =>
              document.getElementById("product-search")?.focus()
            }
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
            src="/images/Fashone.jpeg"
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

        <section className="intro-strip" id="story">
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
                  />
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  <button
                    className="quick-add"
                    onClick={() => addToCart(product)}
                  >
                    ADD TO BAG <span>+</span>
                  </button>
                </div>
                <div className="product-info">
                  <div>
                    <h3>{product.name}</h3>
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

        <section className="brand-banner">
          <p className="eyebrow light">THE FASHONE PHILOSOPHY</p>
          <h2>YOUR STYLE.<br />YOUR RULES.</h2>
          <p>Less, but better. Pieces you'll reach for again and again.</p>
          <a href="#collection" className="outline-light-button">
            FIND YOUR FIT ↗
          </a>
        </section>

        <section className="newsletter">
          <p className="eyebrow">STAY IN THE LOOP</p>
          <h2>GOOD STYLE. NO SPAM.</h2>
          <p>Be first to hear about new drops and collection updates.</p>
          <form
            className="newsletter-form"
            onSubmit={(event) => {
              event.preventDefault();
              setNotice("Newsletter signup needs an email service to be connected.");
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
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <p>{item.color}</p>
                        <strong>{money(item.price)}</strong>
                        <div className="quantity-control">
                          <button
                            onClick={() => changeQuantity(item.id, -1)}
                            aria-label={`Remove one ${item.name}`}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => changeQuantity(item.id, 1)}
                            aria-label={`Add one ${item.name}`}
                          >
                            +
                          </button>
                        </div>
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
  );
}
