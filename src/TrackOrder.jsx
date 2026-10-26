
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

  return (
    <main style={styles.page}>
      <a href="/" style={styles.back}>← BACK TO FASHONE</a>

      <section style={styles.card}>
        <p style={styles.eyebrow}>FASHONE / ORDER SERVICES</p>
        <h1 style={styles.heading}>
          <span style={{ color: "#111" }}>TRACK YOUR </span>
          <span style={{ color: "#888" }}>ORDER.</span>
        </h1>
        <p style={styles.muted}>
          Enter your order number and phone number to see your latest order status.
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
              Payment: {order.payment_status || "Pending"}
            </p>
            <p style={styles.muted}>
              Ordered: {new Date(order.created_at).toLocaleString("en-IN")}
            </p>
            <button
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
    fontFamily: "'DM Sans', sans-serif",
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
    fontFamily: "'Bebas Neue', sans-serif",
    fontWeight: 400,
    textTransform: "uppercase",
    fontSize: "clamp(52px, 7vw, 82px)",
    letterSpacing: "1.5px",
    lineHeight: 0.95,
    margin: "18px 0 10px",
  },
  muted: { color: "#666", fontSize: 14, lineHeight: 1.6 },
  label: {
    display: "block",
    margin: "18px 0 7px",
    fontSize: 12,
    fontWeight: 700,
  },
  muted: {
  fontFamily: "'DM Sans', sans-serif",
  color: "#666",
  fontSize: 14,
  lineHeight: 1.6,
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
};
