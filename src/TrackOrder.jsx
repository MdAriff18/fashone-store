
import { useState } from "react";

const API = "https://fashone-backend.onrender.com/api";

const prettyStatus = (status = "") => {
  const labels = {
    PLACED: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  return labels[status.toUpperCase()] || status;
};

const money = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function trackOrder(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const params = new URLSearchParams({
        order_number: orderNumber.trim(),
        phone: phone.trim(),
      });

      const response = await fetch(`${API}/track-order?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to find your order.");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err.message || "Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const status = order ? prettyStatus(order.order_status) : "";

  const items = Array.isArray(order?.items)
    ? order.items
    : typeof order?.items === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(order.items);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

  return (
    <main style={styles.page}>
      <a href="/" style={styles.back}>← BACK TO FASHONE</a>

      <section style={styles.card}>
        <p style={styles.eyebrow}>FASHONE / ORDER SERVICES</p>
        <h1 style={styles.heading}>Track your order.</h1>
        <p style={styles.muted}>
          Enter your order number and phone number to see your order status and details.
        </p>

        <form onSubmit={trackOrder}>
          <label style={styles.label}>Order number</label>
          <input
            style={styles.input}
            placeholder="FASH-123456789-1234"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
          />

          <label style={styles.label}>Phone number</label>
          <input
            style={styles.input}
            type="tel"
            inputMode="tel"
            placeholder="Phone used at checkout"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "CHECKING..." : "TRACK ORDER →"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        {order && (
          <section style={styles.result}>
            <p style={styles.eyebrow}>ORDER FOUND</p>
            <p style={styles.orderNumber}>{order.order_number}</p>

            <p style={styles.label}>Current status</p>
            <h2 style={styles.status}>{status}</h2>

            <p style={styles.muted}>
              Payment: {order.payment_status || "PENDING"}
            </p>
            <p style={styles.muted}>
              Method: {order.payment_method || "COD"}
            </p>
            <p style={styles.muted}>
              Ordered: {new Date(order.created_at).toLocaleString("en-IN")}
            </p>

            <div style={styles.divider} />

            <h3 style={styles.sectionHeading}>ORDER SUMMARY</h3>

            {items.length > 0 ? (
              items.map((item, index) => (
                <div key={`${item.id || item.name}-${item.size || ""}-${index}`} style={styles.item}>
                  <div style={styles.itemInfo}>
                    <p style={styles.productName}>
                      {item.name || item.title || "Product"}
                    </p>
                    {item.size && (
                      <p style={styles.itemDetail}>Size: {item.size}</p>
                    )}
                    <p style={styles.itemDetail}>
                      Qty: {Number(item.quantity || 1)}
                    </p>
                  </div>

                  <p style={styles.itemPrice}>
                    {money(
                      Number(item.price || 0) *
                      Number(item.quantity || 1)
                    )}
                  </p>
                </div>
              ))
            ) : (
              <p style={styles.muted}>
                Product details are not available for this order.
              </p>
            )}

            <div style={styles.divider} />

            <div style={styles.totalRow}>
              <span>Subtotal</span>
              <span>{money(order.subtotal)}</span>
            </div>
            <div style={styles.totalRow}>
              <span>Shipping</span>
              <span>{money(order.shipping_fee)}</span>
            </div>
            <div style={styles.totalRow}>
              <strong>Total</strong>
              <strong>{money(order.total)}</strong>
            </div>

            <button
              type="button"
              style={styles.secondary}
              onClick={() => {
                setOrder(null);
                setError("");
              }}
            >
              TRACK ANOTHER ORDER
            </button>
          </section>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f2ee",
    color: "#171717",
    padding: "32px 18px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  back: {
    display: "inline-block",
    color: "#171717",
    textDecoration: "none",
    fontSize: 12,
    letterSpacing: 1.5,
    fontWeight: 700,
    marginBottom: 28,
  },
  card: {
    background: "#fff",
    maxWidth: 520,
    margin: "0 auto",
    padding: "32px 24px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2.5,
  },
  heading: {
    fontSize: "clamp(30px, 6vw, 44px)",
    letterSpacing: -1.5,
    margin: "18px 0 10px",
  },
  muted: { color: "#666", fontSize: 14, lineHeight: 1.6 },
  label: {
    display: "block",
    margin: "18px 0 7px",
    fontSize: 12,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 13,
    border: "1px solid #ccc",
    background: "#fff",
    color: "#111",
    fontSize: 14,
  },
  button: {
    width: "100%",
    marginTop: 22,
    padding: 15,
    border: 0,
    background: "#111",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondary: {
    width: "100%",
    marginTop: 24,
    padding: 12,
    border: "1px solid #ccc",
    background: "#fff",
    color: "#111",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
  },
  error: { color: "#b00020", fontSize: 13, lineHeight: 1.5 },
  result: {
    marginTop: 28,
    paddingTop: 22,
    borderTop: "1px solid #ddd",
    overflowWrap: "anywhere",
  },
  orderNumber: { fontSize: 14, fontWeight: 700 },
  status: { fontSize: 26, margin: "8px 0" },
  divider: {
    height: 1,
    background: "#ddd",
    margin: "22px 0",
  },
  sectionHeading: {
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 18,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    padding: "14px 0",
    borderBottom: "1px solid #eee",
  },
  itemInfo: { minWidth: 0 },
  productName: {
    fontSize: 14,
    fontWeight: 700,
    margin: "0 0 7px",
  },
  itemDetail: {
    color: "#666",
    fontSize: 12,
    margin: "4px 0",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: 700,
    whiteSpace: "nowrap",
    margin: 0,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "8px 0",
    fontSize: 13,
  },
};
