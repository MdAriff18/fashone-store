
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


app.listen(PORT, () => {
  console.log(`FASHONE API running on http://localhost:${PORT}`);
});
