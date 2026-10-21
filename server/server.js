
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(express.json());


const jwt = require("jsonwebtoken");

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    !process.env.ADMIN_TOKEN_SECRET
  ) {
    return res.status(500).json({
      error: "Admin authentication is not configured."
    });
  }

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      error: "Invalid username or password."
    });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.ADMIN_TOKEN_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ message: "Admin login successful.", token });
});

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Admin login required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required." });
    }

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}


app.get("/", (req, res) => {
  res.json({ message: "FASHONE API is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", service: "FASHONE Backend" });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS database_time"
    );

    res.json({
      status: "Connected",
      databaseTime: result.rows[0].database_time,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({
      status: "Error",
      message: "Database connection failed",
    });
  }
});


app.get("/api/orders", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, order_number, customer_name, phone,
              address_line, city, state, postal_code,
              items, subtotal, shipping_fee, total,
              payment_method, payment_status, order_status,
              created_at
       FROM public.orders
       ORDER BY created_at DESC`
    );

    res.json({ orders: result.rows });
  } catch (error) {
    console.error("Fetch orders failed:", error.message);
    res.status(500).json({ error: "Unable to fetch orders." });
  }
});


app.patch("/api/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const allowedStatuses = [
      "PLACED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED"
    ];


    const rawStatus = req.body.order_status;

    const order_status =
    typeof rawStatus === "string"
        ? rawStatus.trim().toUpperCase()
        : "";

    if (!allowedStatuses.includes(order_status)) {
    return res.status(400).json({
        error: "Invalid order status.",
        receivedStatus: rawStatus,
        allowedStatuses,
    });
    }


    const result = await pool.query(
      `UPDATE public.orders
       SET order_status = $1
       WHERE id = $2
       RETURNING id, order_number, order_status`,
      [order_status, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json({ message: "Order status updated.", order: result.rows[0] });
  } catch (error) {
    console.error("Update order failed:", error.message);
    res.status(500).json({ error: "Unable to update order." });
  }
});


app.post("/api/orders", async (req, res) => {
  try {
    const {
      customer_name,    
      phone,
      address_line,
      city,
      state,
      postal_code,
      items,
      subtotal,
      shipping_fee = 0,
      total,
      payment_method = "COD",
    } = req.body;

    if (
      !customer_name ||
      !phone ||
      !address_line ||
      !city ||
      !state ||
      !postal_code ||
      !Array.isArray(items) ||
      items.length === 0 ||
      subtotal == null ||
      total == null
    ) {
      return res.status(400).json({
        error: "Please provide all required order details.",
      });
    }

    if (
      !["COD"].includes(payment_method) ||
      !Number.isFinite(Number(subtotal)) ||
      !Number.isFinite(Number(shipping_fee)) ||
      !Number.isFinite(Number(total)) ||
      Number(subtotal) < 0 ||
      Number(shipping_fee) < 0 ||
      Number(total) < 0
    ) {
      return res.status(400).json({
        error: "Invalid order amounts or payment method.",
      });
    }

    const orderNumber =
      "FASH-" + Date.now() + "-" +
      Math.floor(1000 + Math.random() * 9000);

    const result = await pool.query(
      `INSERT INTO public.orders (
        order_number, customer_name, phone, address_line,
        city, state, postal_code, items, subtotal,
        shipping_fee, total, payment_method
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
      RETURNING id, order_number, order_status, created_at`,
      [
        orderNumber,
        customer_name,
        phone,
        address_line,
        city,
        state,
        postal_code,
        JSON.stringify(items),
        subtotal,
        shipping_fee,
        total,
        payment_method,
      ]
    );

    res.status(201).json({
      message: "Order placed successfully!",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Order creation failed:", error.message);
    res.status(500).json({
      error: "Unable to place order. Please try again.",
    });
  }
});


app.get("/api/track-order", async (req, res) => {
  try {
    const orderNumber = String(req.query.order_number || "").trim();
    const phone = String(req.query.phone || "").trim();

    if (!orderNumber || !phone) {
      return res.status(400).json({
        error: "Enter your order number and phone number.",
      });
    }

    const result = await pool.query(
      `SELECT
         id,
         order_number,
         customer_name,
         items,
         subtotal,
         shipping_fee,
         total,
         payment_method,
         payment_status,
         order_status,
         created_at
       FROM public.orders
       WHERE LOWER(order_number) = LOWER($1)
         AND regexp_replace(phone, '\\D', '', 'g') =
             regexp_replace($2, '\\D', '', 'g')
       LIMIT 1`,
      [orderNumber, phone]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Order not found. Check your order number and phone number.",
      });
    }

    res.json({ order: result.rows[0] });
  } catch (error) {
    console.error("Track order failed:", error.message);
    res.status(500).json({
      error: "Unable to track order right now.",
    });
  }
});


app.listen(PORT, () => {
  console.log(`FASHONE API running on http://localhost:${PORT}`);
});
