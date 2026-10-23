
import { useState } from "react";

const API = "https://fashone-backend.onrender.com/api";

const INITIAL_PRODUCT_FORM = {
  name: "",
  category: "T-Shirts",
  price: "",
  oldPrice: "",
  color: "",
  image: "",
  stockQuantity: "0",
};

const STATUS_OPTIONS = [
  { value: "PLACED", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_MAP = {
  PLACED: {
    label: "Pending",
    color: "#92400e",
    dot: "#eab308",
    background: "#fef9c3",
  },
  PENDING: {
    label: "Pending",
    color: "#92400e",
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

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [success, setSuccess] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [productLoading, setProductLoading] = useState(false);
  const [productSaving, setProductSaving] = useState(false);
  const [productMessage, setProductMessage] = useState("");

  const [productForm, setProductForm] = useState(INITIAL_PRODUCT_FORM);
  const [editingProductId, setEditingProductId] = useState(null);

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  async function readResponse(response, fallbackMessage) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || fallbackMessage);
    }

    return data;
  }

  // LOAD ORDERS
  async function loadOrders(authToken = token) {
    if (!authToken) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/orders`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await readResponse(
        response,
        "Orders load avvaledu."
      );

      setOrders(
        Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
          ? data.orders
          : []
      );
    } catch (err) {
      setError(err.message || "Orders load avvaledu.");
    } finally {
      setLoading(false);
    }
  }

  // LOAD PRODUCTS
  async function loadProducts(authToken = token) {
    if (!authToken) return;

    setProductLoading(true);

    try {
      const response = await fetch(`${API}/products`);

      const data = await readResponse(
        response,
        "Products load avvaledu."
      );

      setProducts(
        Array.isArray(data)
          ? data
          : Array.isArray(data.products)
          ? data.products
          : []
      );
    } catch (err) {
      setProductMessage(
        err.message || "Products load avvaledu."
      );
    } finally {
      setProductLoading(false);
    }
  }

  // ADMIN LOGIN
  async function login(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await readResponse(response, "Login failed.");

      if (!data.token) {
        throw new Error("Login token dorakaledu.");
      }

      setToken(data.token);

      await Promise.all([
        loadOrders(data.token),
        loadProducts(data.token),
      ]);
    } catch (err) {
      setError(err.message || "Backend connection failed.");
    } finally {
      setLoading(false);
    }
  }

  // UPDATE ORDER STATUS
  async function updateStatus(orderId, status) {
    setError("");
    setSuccess("");
    setUpdatingOrderId(orderId);

    try {
      const response = await fetch(
        `${API}/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_status: status,
          }),
        }
      );

      await readResponse(response, "Status update failed.");

      await loadOrders();

      setSuccess(
        `Order #${orderId} status updated successfully.`
      );
    } catch (err) {
      setError(err.message || "Status update failed.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  // HANDLE PRODUCT FORM INPUTS
  function handleProductChange(event) {
    const { name, value } = event.target;

    setProductForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // RESET PRODUCT FORM / CANCEL EDIT
  function resetProductForm() {
    setProductForm(INITIAL_PRODUCT_FORM);
    setEditingProductId(null);
    setProductMessage("");
  }

  // START EDITING A PRODUCT
  function editProduct(product) {
    setEditingProductId(product.id);

    setProductForm({
      name: product.name || "",
      category: product.category || "T-Shirts",
      price: String(product.price ?? ""),
      oldPrice:
        product.oldPrice == null && product.old_price == null
          ? ""
          : String(product.oldPrice ?? product.old_price ?? ""),
      color: product.color || "",
      image: product.image || "",
      stockQuantity: String(
        product.stockQuantity ?? product.stock_quantity ?? 0
      ),
    });

    setProductMessage("");

    document
      .getElementById("admin-product-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }

  // ADD OR UPDATE PRODUCT
  async function saveProduct(event) {
    event.preventDefault();

    setProductMessage("");
    setProductSaving(true);

    try {
      if (
        !productForm.name.trim() ||
        !productForm.category.trim() ||
        !productForm.color.trim() ||
        !productForm.image.trim()
      ) {
        throw new Error("Please fill all required fields.");
      }

      const price = Number(productForm.price);
      const stockQuantity = Number(productForm.stockQuantity);
      const oldPrice =
        productForm.oldPrice === ""
          ? null
          : Number(productForm.oldPrice);

      if (
        productForm.price.trim() === "" ||
        !Number.isFinite(price) ||
        price < 0
      ) {
        throw new Error("Please enter a valid selling price.");
      }

      if (
        productForm.oldPrice !== "" &&
        (!Number.isFinite(oldPrice) || oldPrice < 0)
      ) {
        throw new Error("Please enter a valid old price.");
      }

      if (
        productForm.stockQuantity.trim() === "" ||
        !Number.isSafeInteger(stockQuantity) ||
        stockQuantity < 0
      ) {
        throw new Error("Enter a valid whole-number stock quantity.");
      }

      if (!/^https?:\/\//i.test(productForm.image.trim())) {
        throw new Error("Enter a valid product image URL starting with http:// or https://.");
      }

      const payload = {
        name: productForm.name.trim(),
        category: productForm.category,
        price,
        oldPrice,
        color: productForm.color.trim(),
        image: productForm.image.trim(),
        stockQuantity,
      };

      let response;

      if (editingProductId !== null) {
        // UPDATE EXISTING PRODUCT
        response = await fetch(
          `${API}/products/${editingProductId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // ADD NEW PRODUCT
        const nextId =
          products.length > 0
            ? Math.max(
                ...products.map((product) => Number(product.id))
              ) + 1
            : 1;

        response = await fetch(`${API}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: nextId,
            ...payload,
          }),
        });
      }

      const data = await readResponse(
        response,
        editingProductId !== null
          ? "Product update avvaledu."
          : "Product add avvaledu."
      );

      const wasEditing = editingProductId !== null;

      await loadProducts();

      setProductForm(INITIAL_PRODUCT_FORM);
      setEditingProductId(null);

      setProductMessage(
        data.message ||
          (wasEditing
            ? "Product updated successfully."
            : "Product added successfully.")
      );
    } catch (err) {
      setProductMessage(
        err.message || "Product save avvaledu."
      );
    } finally {
      setProductSaving(false);
    }
  }

  // LOGOUT
  function logout() {
    setToken("");
    setOrders([]);
    setProducts([]);

    setUsername("");
    setPassword("");

    setError("");
    setSuccess("");
    setProductMessage("");

    setSearchTerm("");
    setStatusFilter("ALL");

    setProductForm(INITIAL_PRODUCT_FORM);
    setEditingProductId(null);
  }

  // SEARCH AND FILTER ORDERS
  const filteredOrders = orders.filter((order) => {
    const query = searchTerm.toLowerCase().trim();

    const matchesSearch = [
      order.order_number,
      order.customer_name,
      order.phone,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );

    const currentStatus = (
      order.order_status || "PLACED"
    ).toUpperCase();

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "PENDING"
        ? currentStatus === "PLACED" ||
          currentStatus === "PENDING"
        : currentStatus === statusFilter);

    return matchesSearch && matchesStatus;
  });

  // LOGIN SCREEN
  if (!token) {
    return (
      <main style={styles.loginPage}>
        <form onSubmit={login} style={styles.loginCard}>
          <p style={styles.eyebrow}>FASHONE / PRIVATE ACCESS</p>

          <h1 style={styles.loginTitle}>Admin Login</h1>

          <p style={styles.muted}>
            Sign in to manage customer orders and products.
          </p>

          <label style={styles.label} htmlFor="admin-username">
            Username
          </label>

          <input
            id="admin-username"
            style={styles.input}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <label style={styles.label} htmlFor="admin-password">
            Password
          </label>

          <input
            id="admin-password"
            style={styles.input}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            style={styles.button}
            disabled={loading}
            type="submit"
          >
            {loading ? "SIGNING IN..." : "SIGN IN →"}
          </button>

          <a href="/" style={styles.backLink}>
            ← Back to store
          </a>
        </form>

        <style>{responsiveStyles}</style>
      </main>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <main style={styles.dashboard}>
      <style>{responsiveStyles}</style>

      <header
        className="admin-dashboard-header"
        style={styles.header}
      >
        <div>
          <p style={styles.eyebrow}>FASHONE / MANAGEMENT</p>

          <h1 style={styles.dashboardTitle}>Store Dashboard</h1>

          <p style={styles.muted}>
            Manage customer orders and store inventory.
          </p>
        </div>

        <div
          className="admin-dashboard-actions"
          style={styles.actions}
        >
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => {
              loadOrders();
              loadProducts();
            }}
          >
            Refresh All
          </button>

          <button
            type="button"
            style={styles.buttonCompact}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {error && <p style={styles.error}>{error}</p>}

      {success && (
        <p style={styles.successMessage}>
          <span style={styles.successDot} />
          {success}
        </p>
      )}

      {/* ORDERS SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>SALES & FULFILMENT</p>

            <h2 style={styles.sectionTitle}>Orders</h2>

            <p style={styles.muted}>
              {filteredOrders.length} of {orders.length} orders
            </p>
          </div>

          <div style={styles.filters}>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search order, customer or phone..."
              style={{
                ...styles.input,
                minWidth: 220,
                flex: "1 1 240px",
              }}
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              style={{
                ...styles.input,
                minWidth: 150,
                flex: "0 1 170px",
              }}
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

        {loading && <p style={styles.muted}>Loading orders...</p>}

        {!loading && filteredOrders.length === 0 && (
          <div style={styles.emptyState}>No orders found.</div>
        )}

        {filteredOrders.length > 0 && (
          <div style={styles.orderList}>
            <div
              className="admin-order-list-heading"
              style={styles.listHeading}
            >
              <span>ORDER DETAILS</span>
              <span>CUSTOMER</span>
              <span>AMOUNT</span>
              <span>STATUS</span>
            </div>

            {filteredOrders.map((order) => {
              const currentStatus = (
                order.order_status || "PLACED"
              ).toUpperCase();

              const statusInfo =
                STATUS_MAP[currentStatus] || STATUS_MAP.PLACED;

              return (
                <section
                  className="admin-order-row"
                  key={order.id}
                  style={styles.orderRow}
                >
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
                            {" × "}
                            {item.quantity}
                            {" — "}
                            {money(
                              Number(item.price) * Number(item.quantity)
                            )}
                          </p>
                        ))}
                    </div>

                    <span style={styles.smallText}>
                      Payment: {order.payment_method || "COD"}
                      {" · "}
                      {order.payment_status || "Pending"}
                    </span>
                  </div>

                  <div style={styles.customerInfo}>
                    <strong>{order.customer_name || "Customer"}</strong>
                    <span>{order.phone}</span>
                    <span>
                      {[
                        order.address_line,
                        order.city,
                        order.state,
                        order.postal_code,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>

                  <strong
                    className="admin-order-amount"
                    style={styles.orderAmount}
                  >
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
                      onChange={(event) =>
                        updateStatus(order.id, event.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>

                    {updatingOrderId === order.id && (
                      <span style={styles.smallText}>
                        Updating status...
                      </span>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>

      {/* PRODUCT MANAGEMENT */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.eyebrow}>INVENTORY</p>

            <h2 style={styles.sectionTitle}>Product Management</h2>

            <p style={styles.muted}>
              {products.length} products in your store
            </p>
          </div>

          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => loadProducts()}
            disabled={productLoading}
          >
            {productLoading ? "Loading..." : "Refresh Products"}
          </button>
        </div>

        {productMessage && (
          <p
            style={
              productMessage.toLowerCase().includes("successfully")
                ? styles.successText
                : styles.error
            }
          >
            {productMessage}
          </p>
        )}

        <form
          id="admin-product-form"
          onSubmit={saveProduct}
          style={styles.productForm}
        >
          {editingProductId !== null && (
            <div style={styles.editNotice}>
              <strong>Editing product ID: {editingProductId}</strong>
              <span>
                Update the details below and save your changes.
              </span>
            </div>
          )}

          <label style={styles.label}>
            Product name
            <input
              style={styles.input}
              name="name"
              value={productForm.name}
              onChange={handleProductChange}
              required
            />
          </label>

          <label style={styles.label}>
            Category
            <select
              style={styles.input}
              name="category"
              value={productForm.category}
              onChange={handleProductChange}
              required
            >
              {[
                "T-Shirts",
                "Shirts",
                "Trousers",
                "Jeans",
                "Hoodies",
                "Jackets",
                "Accessories",
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Selling price (₹)
            <input
              style={styles.input}
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={productForm.price}
              onChange={handleProductChange}
              required
            />
          </label>

          <label style={styles.label}>
            Old price (₹) — optional
            <input
              style={styles.input}
              name="oldPrice"
              type="number"
              min="0"
              step="0.01"
              value={productForm.oldPrice}
              onChange={handleProductChange}
            />
          </label>

          <label style={styles.label}>
            Colour
            <input
              style={styles.input}
              name="color"
              value={productForm.color}
              onChange={handleProductChange}
              required
            />
          </label>

          <label style={styles.label}>
            Stock quantity
            <input
              style={styles.input}
              name="stockQuantity"
              type="number"
              min="0"
              step="1"
              value={productForm.stockQuantity}
              onChange={handleProductChange}
              required
            />
          </label>

          <label
            className="admin-product-image-field"
            style={styles.label}
          >
            Product image URL
            <input
              style={styles.input}
              name="image"
              type="url"
              placeholder="https://example.com/product.jpg"
              value={productForm.image}
              onChange={handleProductChange}
              required
            />
          </label>

          <div className="admin-product-form-actions">
            <button
              style={styles.button}
              type="submit"
              disabled={productSaving}
            >
              {productSaving
                ? "SAVING..."
                : editingProductId !== null
                ? "SAVE CHANGES"
                : "+ ADD PRODUCT"}
            </button>

            {editingProductId !== null && (
              <button
                style={styles.cancelButton}
                type="button"
                onClick={resetProductForm}
                disabled={productSaving}
              >
                CANCEL EDIT
              </button>
            )}
          </div>
        </form>

        {/* PRODUCT LIST */}
        <div style={styles.productTableWrap}>
          {productLoading && (
            <p style={styles.muted}>Loading products...</p>
          )}

          <table style={styles.productTable}>
            <thead>
              <tr>
                {[
                  "PRODUCT",
                  "CATEGORY",
                  "PRICE",
                  "STOCK",
                  "ACTION",
                ].map((heading) => (
                  <th key={heading} style={styles.tableHeading}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const stock =
                  product.stockQuantity ??
                  product.stock_quantity ??
                  0;

                return (
                  <tr key={product.id}>
                    <td style={styles.tableCell}>
                      <strong>{product.name}</strong>

                      <div style={styles.smallText}>
                        ID: {product.id}
                        {" · "}
                        {product.color}
                      </div>
                    </td>

                    <td style={styles.tableCell}>
                      {product.category}
                    </td>

                    <td style={styles.tableCell}>
                      {money(product.price)}
                    </td>

                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.stockBadge,
                          color:
                            Number(stock) === 0
                              ? "#b91c1c"
                              : Number(stock) <= 5
                              ? "#92400e"
                              : "#166534",
                          background:
                            Number(stock) === 0
                              ? "#fee2e2"
                              : Number(stock) <= 5
                              ? "#fef3c7"
                              : "#dcfce7",
                        }}
                      >
                        {stock} {Number(stock) === 1 ? "item" : "items"}
                      </span>
                    </td>

                    <td style={styles.tableCell}>
                      <button
                        type="button"
                        style={styles.editButton}
                        onClick={() => editProduct(product)}
                        disabled={productSaving}
                      >
                        EDIT
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!productLoading && products.length === 0 && (
            <p style={styles.emptyState}>
              No products found. Refresh products or check the backend API.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

const styles = {
  loginPage: {
    minHeight: "100vh",
    background: "#0b0b0b",
    display: "grid",
    placeItems: "center",
    padding: 20,
    fontFamily: "'Inter', Arial, sans-serif",
    color: "#171717",
    boxSizing: "border-box",
  },

  loginCard: {
    background: "#fff",
    padding: "clamp(26px, 5vw, 44px)",
    width: "100%",
    maxWidth: 420,
    boxSizing: "border-box",
    border: "1px solid #e5e5e5",
    borderRadius: 3,
    boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
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

  dashboardTitle: {
    margin: "4px 0 8px",
    fontSize: "clamp(26px, 4vw, 38px)",
    letterSpacing: "-1.2px",
  },

  loginTitle: {
    margin: "8px 0",
    fontSize: 30,
    letterSpacing: "-0.8px",
  },

  section: {
    marginTop: 28,
    padding: "clamp(18px, 3vw, 28px)",
    background: "#fff",
    border: "1px solid #e4e4df",
    borderRadius: 4,
    boxShadow: "0 4px 16px rgba(0,0,0,0.025)",
    minWidth: 0,
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 20,
  },

  sectionTitle: {
    margin: "4px 0 6px",
    fontSize: 23,
    letterSpacing: "-0.5px",
  },

  eyebrow: {
    margin: "0 0 8px",
    letterSpacing: 2.5,
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
    margin: "4px 0",
  },

  label: {
    display: "block",
    marginTop: 8,
    marginBottom: 4,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#555",
    minWidth: 0,
  },

  input: {
    display: "block",
    width: "100%",
    marginTop: 8,
    padding: "12px 13px",
    border: "1px solid #dedede",
    borderRadius: 2,
    boxSizing: "border-box",
    background: "#fff",
    color: "#111",
    fontSize: 13,
    outline: "none",
    minWidth: 0,
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
    width: "100%",
    marginTop: 12,
  },

  buttonCompact: {
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
  },

  secondaryButton: {
    padding: "12px 16px",
    background: "#fff",
    color: "#111",
    border: "1px solid #d8d8d8",
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  editButton: {
    padding: "9px 14px",
    background: "#111",
    color: "#fff",
    border: "1px solid #111",
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
  },

  cancelButton: {
    padding: "13px 20px",
    background: "#fff",
    color: "#111",
    border: "1px solid #ccc",
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    width: "100%",
    marginTop: 8,
  },

  editNotice: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    padding: 14,
    background: "#f5f5f2",
    border: "1px solid #deded9",
    color: "#222",
    fontSize: 12,
  },

  stockBadge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  filters: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    width: "min(100%, 540px)",
  },

  backLink: {
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

  successText: {
    color: "#15803d",
    fontSize: 13,
    overflowWrap: "anywhere",
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

  emptyState: {
    padding: 20,
    color: "#777",
    fontSize: 13,
    background: "#fafaf8",
    border: "1px dashed #deded9",
  },

  orderList: {
    marginTop: 18,
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

  productForm: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: 14,
    marginTop: 20,
  },

  productTableWrap: {
    marginTop: 28,
    overflowX: "auto",
  },

  productTable: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: 13,
  },

  tableHeading: {
    padding: 12,
    borderBottom: "1px solid #e5e5e5",
    fontSize: 10,
    letterSpacing: 1,
    background: "#f7f7f5",
    color: "#777",
    whiteSpace: "nowrap",
  },

  tableCell: {
    padding: 12,
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
  },
};

const responsiveStyles = `
  * {
    box-sizing: border-box;
  }

  button:disabled {
    opacity: .6;
    cursor: not-allowed;
  }

  .admin-product-form-actions {
    grid-column: 1 / -1;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .admin-product-form-actions button {
    flex: 1 1 180px;
  }

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
`;
