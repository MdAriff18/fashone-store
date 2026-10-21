
import { useState } from "react";

const API = "https://fashone-backend.onrender.com/api";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [success, setSuccess] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);


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
  setSuccess("");
  setUpdatingOrderId(orderId);

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

    setSuccess(`Order #${orderId} status updated successfully.`);
  } catch (err) {
    setError(err.message || "Status update failed");
  } finally {
    setUpdatingOrderId(null);
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

  
  const statusMap = {
    PLACED: {
      label: "Pending",
      color: "#a16207",
      dot: "#eab308",
      background: "#fef9c3",
    },
    PENDING: {
      label: "Pending",
      color: "#a16207",
      dot: "#eab308",
      background: "#fef9c3",
    },
    PROCESSING: {
      label: "Processing",
      color: "#1d4ed8",
      dot: "#3b82f6",
      background: "#dbeafe",
    },
    SHIPPED: {
      label: "Shipped",
      color: "#c2410c",
      dot: "#f97316",
      background: "#ffedd5",
    },
    DELIVERED: {
      label: "Delivered",
      color: "#15803d",
      dot: "#22c55e",
      background: "#dcfce7",
    },
    CANCELLED: {
      label: "Cancelled",
      color: "#b91c1c",
      dot: "#ef4444",
      background: "#fee2e2",
    },
  };

  
const filteredOrders = orders.filter((order) => {
  const query = searchTerm.toLowerCase().trim();

  const matchesSearch = [
    order.order_number,
    order.customer_name,
    order.phone,
  ].some((value) => String(value || "").toLowerCase().includes(query));

  const currentStatus = (order.order_status || "PLACED").toUpperCase();
  const matchesStatus =
    statusFilter === "ALL" ||
    (statusFilter === "PENDING"
      ? currentStatus === "PLACED" || currentStatus === "PENDING"
      : currentStatus === statusFilter);

  return matchesSearch && matchesStatus;
});



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
          
          {success && (
            <p style={styles.successMessage}>
              <span style={styles.successDot} />
              {success}
            </p>
          )}


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
      <header className="admin-dashboard-header" style={styles.header}>
        <div>
          <p style={styles.eyebrow}>FASHONE / MANAGEMENT</p>
          <h1>Orders Dashboard</h1>
        </div>
        <div className="admin-dashboard-actions" style={styles.actions}>
          <button style={styles.secondary} onClick={() => loadOrders()}>
            Refresh
          </button>
          <button style={styles.button} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {error && <p style={styles.error}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 22 }}>
        <p style={styles.muted}>
          {filteredOrders.length} of {orders.length} orders
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", width: "min(100%, 520px)" }}>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order, customer or phone..."
            style={{ ...styles.input, flex: "1 1 220px", minWidth: 0 }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...styles.input, flex: "0 1 160px", minWidth: 130 }}
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>


      {loading && <p>Loading...</p>}

      {!loading && filteredOrders.length === 0 && (
        <section style={styles.card}>No orders found.</section>
      )}

      
  <div style={styles.orderList}>
    <div className="admin-order-list-heading" style={styles.listHeading}>
      <span>ORDER DETAILS</span>
      <span>CUSTOMER</span>
      <span>AMOUNT</span>
      <span>STATUS</span>
    </div>

    {filteredOrders.map((order) => {
      const currentStatus = (order.order_status || "PLACED").toUpperCase();
      const statusInfo = statusMap[currentStatus] || statusMap.PLACED;

      return (
        <section className="admin-order-row" key={order.id} style={styles.orderRow}>
          <div style={styles.orderInfo}>
            <strong style={styles.orderNumber}>
              {order.order_number || `Order #${order.id}`}
            </strong>
            <span style={styles.smallText}>
              {order.created_at
                ? new Date(order.created_at).toLocaleString("en-IN")
                : "Date unavailable"}
            </span>

            <div style={styles.itemsList}>
              {Array.isArray(order.items) &&
                order.items.map((item, index) => (
                  <p key={`${item.id || item.name}-${index}`}>
                    {item.name}
                    {item.size ? ` · Size ${item.size}` : ""}
                    {" × "}{item.quantity}
                    {" — "}{money(Number(item.price) * Number(item.quantity))}
                  </p>
                ))}
            </div>

            <span style={styles.smallText}>
              Payment: {order.payment_method || "COD"} ·{" "}
              {order.payment_status || "Pending"}
            </span>
          </div>

          <div style={styles.customerInfo}>
            <strong>{order.customer_name}</strong>
            <span>{order.phone}</span>
            <span>
              {[
                order.address_line,
                order.city,
                order.state,
                order.postal_code,
              ].filter(Boolean).join(", ")}
            </span>
          </div>

          <strong className="admin-order-amount" style={styles.orderAmount}>
            {money(order.total)}
          </strong>

          <div style={styles.statusColumn}>
            <span
              style={{
                ...styles.statusBadge,
                color: statusInfo.color,
                background: statusInfo.background,
              }}
            >
              <span
                style={{
                  ...styles.statusDot,
                  background: statusInfo.dot,
                }}
              />
              {statusInfo.label}
            </span>

            <label style={styles.label}>Update status</label>
            <select
              style={styles.statusSelect}
              disabled={updatingOrderId === order.id}
              value={currentStatus}
              onChange={(e) => updateStatus(order.id, e.target.value)}
            >
              {[
                { value: "PLACED", label: "Pending" },
                { value: "PROCESSING", label: "Processing" },
                { value: "SHIPPED", label: "Shipped" },
                { value: "DELIVERED", label: "Delivered" },
                { value: "CANCELLED", label: "Cancelled" },
              ].map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            
            {updatingOrderId === order.id && (
              <span style={styles.smallText}>Updating status...</span>
            )}

          </div>
        </section>
      );
    })}
  </div>

    </main>
  );
}


const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0b0b",
    display: "grid",
    placeItems: "center",
    padding: 20,
    fontFamily: "'Inter', Arial, sans-serif",
    color: "#171717",
    boxSizing: "border-box",
  },
  login: {
    background: "#fff",
    padding: "clamp(26px, 5vw, 44px)",
    width: "100%",
    maxWidth: 420,
    boxSizing: "border-box",
    border: "1px solid #e5e5e5",
    borderRadius: 3,
    boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
  },
  eyebrow: {
    letterSpacing: 3,
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    color: "#777",
    lineHeight: 1.8,
  },
  muted: {
    color: "#777",
    fontSize: 13,
    lineHeight: 1.7,
  },
  label: {
    display: "block",
    marginTop: 20,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #dedede",
    borderRadius: 2,
    boxSizing: "border-box",
    background: "#fff",
    color: "#111",
    fontSize: 13,
    outline: "none",
  },
  button: {
    padding: "13px 20px",
    background: "#111",
    color: "#fff",
    border: "1px solid #111",
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    transition: "all 0.2s ease",
  },
  secondary: {
    padding: "13px 18px",
    background: "#fff",
    color: "#111",
    border: "1px solid #d8d8d8",
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  back: {
    display: "block",
    marginTop: 24,
    color: "#555",
    fontSize: 12,
    textDecoration: "none",
  },
  error: {
    color: "#a12626",
    fontSize: 13,
    padding: "12px 14px",
    background: "#fff1f1",
    border: "1px solid #f0d1d1",
    borderRadius: 2,
    overflowWrap: "anywhere",
  },
  dashboard: {
    minHeight: "100vh",
    padding: "clamp(18px, 4vw, 44px)",
    boxSizing: "border-box",
    background: "#f5f5f2",
    color: "#171717",
    fontFamily: "'Inter', Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    borderBottom: "1px solid #deded9",
    paddingBottom: 26,
  },
  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: 18,
    marginTop: 24,
    alignItems: "start",
  },
  card: {
    background: "#fff",
    padding: "clamp(18px, 3vw, 26px)",
    border: "1px solid #e4e4df",
    borderRadius: 3,
    overflowWrap: "anywhere",
    boxShadow: "0 4px 16px rgba(0,0,0,0.025)",
    lineHeight: 1.7,
    fontSize: 13,
    minWidth: 0,
  },
  orderHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
    paddingBottom: 16,
    marginBottom: 18,
    borderBottom: "1px solid #eeeeea",
    fontSize: 14,
  },
  
  orderList: {
    marginTop: 22,
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 4,
    overflow: "hidden",
  },
  listHeading: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1.2fr 0.7fr 0.8fr",
    gap: 20,
    padding: "15px 22px",
    background: "#f7f7f5",
    borderBottom: "1px solid #e5e5e5",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: "#777",
  },
  orderRow: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1.2fr 0.7fr 0.8fr",
    gap: 20,
    padding: "23px 22px",
    borderBottom: "1px solid #eaeaea",
    alignItems: "start",
    fontSize: 13,
    lineHeight: 1.6,
  },
  orderInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    minWidth: 0,
    overflowWrap: "anywhere",
  },
  orderNumber: {
    fontSize: 14,
    letterSpacing: 0.2,
    color: "#111",
  },
  smallText: {
    fontSize: 11,
    color: "#777",
    overflowWrap: "anywhere",
  },
  itemsList: {
    marginTop: 8,
    marginBottom: 5,
    color: "#444",
    fontSize: 12,
  },
  customerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 0,
    overflowWrap: "anywhere",
    color: "#555",
  },
  orderAmount: {
    fontSize: 15,
    color: "#111",
    whiteSpace: "nowrap",
  },
  statusColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    minWidth: 0,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "5px 10px",
    borderRadius: 30,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
  statusSelect: {
    width: "100%",
    maxWidth: 150,
    padding: "9px 8px",
    border: "1px solid #ddd",
    borderRadius: 2,
    background: "#fff",
    color: "#222",
    fontSize: 12,
  },

  
successMessage: {
  display: "flex",
  alignItems: "center",
  gap: 9,
  padding: "12px 16px",
  marginTop: 16,
  background: "#ecfdf3",
  border: "1px solid #bbf7d0",
  color: "#166534",
  fontSize: 13,
},
successDot: {
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#22c55e",
  flexShrink: 0,
},


};


<style>{`
@media (max-width: 700px) {
  .admin-order-list-heading {
    display: none !important;
  }

  .admin-order-row {
    grid-template-columns: 1fr !important;
    gap: 18px !important;
    padding: 20px 16px !important;
  }

  .admin-order-row > * {
    min-width: 0;
  }

  .admin-order-row .admin-order-amount {
    font-size: 20px;
  }

  .admin-dashboard-header {
    align-items: flex-start !important;
  }

  .admin-dashboard-actions {
    width: 100%;
  }

  .admin-dashboard-actions button {
    flex: 1;
  }
}
`}</style>

