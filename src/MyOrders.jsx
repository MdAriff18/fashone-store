import { useState } from "react";

const API = "https://fashone-backend.onrender.com/api";

export default function MyOrders() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function findOrders(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrders([]);
    setSearched(false);

    try {
        const params = new URLSearchParams({
        phone: phone.trim(),
        });

      const response = await fetch(`${API}/my-orders?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load your orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setSearched(true);
    } catch (err) {
      setError(err.message || "Unable to load your orders right now.");
    } finally {
      setLoading(false);
    }
  }

  function getItems(items) {
    if (Array.isArray(items)) return items;

    try {
      return JSON.parse(items || "[]");
    } catch {
      return [];
    }
  }

  function money(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatDate(value) {
    if (!value) return "Date unavailable";

    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function prettyStatus(status) {
    return String(status || "PLACED")
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return (
    <main style={styles.page}>
      <a href="/" style={styles.back}>← BACK TO FASHONE</a>

      <section style={styles.heading}>
        <p style={styles.eyebrow}>FASHONE / YOUR ACCOUNT</p>
        <h1 style={styles.title}>YOUR ORDERS.</h1>
        <p style={styles.subtitle}>
          View your previous purchases and check their latest status.
        </p>
      </section>

      <form onSubmit={findOrders} style={styles.form}>
        <label style={styles.label} htmlFor="phone">
        MOBILE NUMBER USED AT CHECKOUT
        </label>
        <input
        id="phone"
        style={styles.input}
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="Enter your 10-digit mobile number"
        required
        />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "LOADING ORDERS..." : "VIEW MY ORDERS"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>

      {searched && (
        <section style={styles.results}>
          <div style={styles.summary}>
            <h2 style={styles.sectionTitle}>ORDER HISTORY</h2>
            <span style={styles.count}>
              {orders.length} {orders.length === 1 ? "ORDER" : "ORDERS"}
            </span>
          </div>

          {orders.length === 0 ? (
            <p style={styles.empty}>No orders found.</p>
          ) : (
            orders.map((order) => (
              <article key={order.id || order.order_number} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <p style={styles.muted}>ORDER NUMBER</p>
                    <h3 style={styles.orderNumber}>{order.order_number}</h3>
                    <p style={styles.date}>{formatDate(order.created_at)}</p>
                  </div>

                  <span style={styles.status}>
                    {prettyStatus(order.order_status)}
                  </span>
                </div>

                <div style={styles.items}>
                  {getItems(order.items).map((item, index) => {
                    const quantity = Number(item.quantity || item.qty || 1);
                    const price = Number(item.price || 0);

                    return (
                      <div
                        key={`${item.id || item.name || "item"}-${index}`}
                        style={styles.item}
                      >
                        <div>
                          <p style={styles.itemName}>
                            {item.name || item.title || "Product"}
                          </p>
                          <p style={styles.muted}>
                            Size: {item.size || "—"} · Qty: {quantity}
                          </p>
                        </div>
                        <strong>{money(price * quantity)}</strong>
                      </div>
                    );
                  })}
                </div>

                <div style={styles.totals}>
                  <p>Subtotal <span>{money(order.subtotal)}</span></p>
                  <p>Shipping <span>{money(order.shipping_fee)}</span></p>
                  <p className="order-total">
                    Total <span>{money(order.total)}</span>
                  </p>
                </div>

                <div style={styles.payment}>
                  <span>Payment: {prettyStatus(order.payment_status)}</span>
                  <span>Method: {order.payment_method || "COD"}</span>
                </div>

                <a
                  href={`/track-order?order_number=${encodeURIComponent(
                    order.order_number
                  )}`}
                  style={styles.trackLink}
                >
                  TRACK THIS ORDER →
                </a>
              </article>
            ))
          )}
        </section>
      )}

    <p style={styles.note}>
    Enter the mobile number used when placing your orders.
    </p>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f8f6",
    color: "#111",
    padding: "32px 6%",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  back: {
    color: "#111",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    textDecoration: "none",
  },
  heading: {
    maxWidth: "700px",
    margin: "65px auto 35px",
    textAlign: "center",
  },
  eyebrow: {
    fontSize: "10px",
    letterSpacing: "2px",
    fontWeight: 700,
  },
  title: {
    fontSize: "clamp(34px, 6vw, 58px)",
    letterSpacing: "-2px",
    margin: "14px 0",
  },
  subtitle: { color: "#666", fontSize: "14px", lineHeight: 1.7 },
  form: {
    maxWidth: "480px",
    margin: "0 auto 55px",
    padding: "26px",
    background: "#fff",
    border: "1px solid #e5e5e5",
  },
  label: {
    display: "block",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1px",
    margin: "14px 0 8px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    border: "1px solid #ccc",
    background: "#fff",
    fontSize: "13px",
    outline: "none",
  },
  button: {
    width: "100%",
    marginTop: "22px",
    padding: "15px",
    background: "#111",
    color: "#fff",
    border: "none",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px",
    cursor: "pointer",
  },
  error: { color: "#b00020", fontSize: "13px", lineHeight: 1.5 },
  results: { maxWidth: "760px", margin: "0 auto" },
  summary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },
  sectionTitle: { fontSize: "18px", letterSpacing: "1px" },
  count: { fontSize: "11px", fontWeight: 700 },
  empty: { padding: "25px", background: "#fff" },
  card: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    padding: "22px",
    marginBottom: "18px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "15px",
  },
  muted: {
    color: "#777",
    fontSize: "10px",
    letterSpacing: "0.5px",
    margin: "5px 0",
  },
  orderNumber: { fontSize: "14px", margin: "7px 0" },
  date: { color: "#666", fontSize: "12px" },
  status: {
    border: "1px solid #ddd",
    padding: "8px 10px",
    fontSize: "10px",
    fontWeight: 700,
  },
  items: { borderTop: "1px solid #eee", marginTop: "20px", paddingTop: "10px" },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  itemName: { fontSize: "13px", fontWeight: 700, margin: "0 0 6px" },
  totals: {
    maxWidth: "340px",
    margin: "18px 0 18px auto",
    fontSize: "12px",
  },
  payment: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px",
    paddingTop: "14px",
    borderTop: "1px solid #eee",
    fontSize: "11px",
    color: "#555",
  },
  trackLink: {
    display: "inline-block",
    marginTop: "18px",
    color: "#111",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1px",
    textDecoration: "none",
  },
  note: {
    maxWidth: "480px",
    margin: "30px auto",
    color: "#777",
    fontSize: "11px",
    lineHeight: 1.6,
    textAlign: "center",
  },
};
