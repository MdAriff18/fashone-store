
import { useState } from "react";

const API = "https://fashone-backend.onrender.com/api";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (!data.token) {
        throw new Error("Login response lo token dorakaledu.");
      }

      setToken(data.token);
      await loadOrders(data.token);
    } catch (err) {
      setError(err.message || "Backend connection failed");
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders(authToken = token) {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Orders load avvaledu");
      }

      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      setError(err.message || "Orders load avvaledu");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, status) {
    setError("");

    try {
      const response = await fetch(`${API}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_status: status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Status update failed");
      }

      await loadOrders();
    } catch (err) {
      setError(err.message || "Status update failed");
    }
  }

  function logout() {
    setToken("");
    setOrders([]);
    setUsername("");
    setPassword("");
    setError("");
  }

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  if (!token) {
    return (
      <main style={styles.page}>
        <form onSubmit={login} style={styles.login}>
          <p style={styles.eyebrow}>FASHONE / PRIVATE ACCESS</p>
          <h1>Admin Login</h1>
          <p style={styles.muted}>Sign in to manage customer orders.</p>

          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN →"}
          </button>
          <a href="/" style={styles.back}>← Back to store</a>
        </form>
      </main>
    );
  }

  return (
    <main style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>FASHONE / MANAGEMENT</p>
          <h1>Orders Dashboard</h1>
        </div>
        <div style={styles.actions}>
          <button style={styles.secondary} onClick={() => loadOrders()}>
            Refresh
          </button>
          <button style={styles.button} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {error && <p style={styles.error}>{error}</p>}
      <p style={styles.muted}>
        {orders.length} orders loaded
      </p>

      {loading && <p>Loading...</p>}

      {!loading && orders.length === 0 && (
        <section style={styles.card}>No orders found.</section>
      )}

      <div style={styles.grid}>
        {orders.map((order) => (
          <section key={order.id} style={styles.card}>
            <div style={styles.orderHead}>
              <strong>{order.order_number || `Order #${order.id}`}</strong>
              <strong>{money(order.total)}</strong>
            </div>

            <p><b>Customer:</b> {order.customer_name}</p>
            <p><b>Phone:</b> {order.phone}</p>
            <p>
              <b>Address:</b>{" "}
              {[order.address_line, order.city, order.state, order.postal_code]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p><b>Payment:</b> {order.payment_method || "COD"} · {order.payment_status || "Pending"}</p>
            <p><b>Date:</b> {order.created_at ? new Date(order.created_at).toLocaleString("en-IN") : "—"}</p>

            <h3>Items</h3>
            {Array.isArray(order.items) &&
              order.items.map((item, index) => (
                <p key={`${item.id || item.name}-${index}`}>
                  {item.name} {item.size ? `(Size ${item.size})` : ""} × {item.quantity} — {money(item.price * item.quantity)}
                </p>
              ))}

            <label style={styles.label}>Order status</label>
            <select
              style={styles.input}
              value={order.order_status || "Pending"}
              onChange={(e) => updateStatus(order.id, e.target.value)}
            >
              {["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </section>
        ))}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f2ee",
    display: "grid",
    placeItems: "center",
    padding: 20,
    fontFamily: "Arial, sans-serif",
    color: "#171717",
  },
  login: {
    background: "#fff",
    padding: 36,
    width: "100%",
    maxWidth: 400,
    boxSizing: "border-box",
    border: "1px solid #ddd",
  },
  eyebrow: {
    letterSpacing: 3,
    fontSize: 11,
    fontWeight: 700,
  },
  muted: { color: "#777", fontSize: 14 },
  label: {
    display: "block",
    marginTop: 18,
    marginBottom: 7,
    fontSize: 13,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    padding: 12,
    border: "1px solid #ccc",
    boxSizing: "border-box",
    background: "#fff",
    color: "#111",
  },
  button: {
    padding: "12px 18px",
    background: "#111",
    color: "#fff",
    border: 0,
    cursor: "pointer",
  },
  secondary: {
    padding: "12px 18px",
    background: "#fff",
    color: "#111",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  back: {
    display: "block",
    marginTop: 20,
    color: "#555",
    fontSize: 13,
  },
  error: { color: "#b00020", fontSize: 14 },
  dashboard: {
    minHeight: "100vh",
    padding: 28,
    background: "#f4f2ee",
    color: "#171717",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    borderBottom: "1px solid #ccc",
    paddingBottom: 20,
  },
  actions: { display: "flex", gap: 10 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
    marginTop: 20,
  },
  card: {
    background: "#fff",
    padding: 20,
    border: "1px solid #ddd",
    overflowWrap: "anywhere",
  },
  orderHead: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
};
