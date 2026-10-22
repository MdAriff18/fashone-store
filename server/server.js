
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
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


// ========================================
// RESEND EMAIL NOTIFICATION FOR NEW ORDERS
// ========================================

async function sendOrderNotification(order) {
  try {
    if (
      !process.env.RESEND_API_KEY ||
      !process.env.ORDER_NOTIFY_EMAIL
    ) {
      console.error(
        "Resend email notification is not configured."
      );
      return;
    }

    const itemsText = JSON.stringify(order.items, null, 2);

    console.log("Sending order email through Resend...");

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "FASHONE Orders <onboarding@resend.dev>",
          to: [process.env.ORDER_NOTIFY_EMAIL],
          subject: `New FASHONE Order: ${order.orderNumber}`,
          text: `
A new order has been placed on FASHONE.

Order Number: ${order.orderNumber}
Customer: ${order.customer_name}
Phone: ${order.phone}

Address:
${order.address_line}
${order.city}, ${order.state}
PIN: ${order.postal_code}

Items:
${itemsText}

Subtotal: Rs. ${order.subtotal}
Shipping: Rs. ${order.shipping_fee}
Total: Rs. ${order.total}
Payment: ${order.payment_method}

Please check the FASHONE Admin dashboard.
          `,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error(
        "Resend email failed:",
        response.status,
        data.message || JSON.stringify(data)
      );
      return;
    }

    console.log(
      "Order notification email sent:",
      order.orderNumber,
      "Resend ID:",
      data.id
    );
  } catch (error) {
    // Email failure must not cancel a saved customer order.
    console.error(
      "Resend email failed:",
      error.message
    );
  }
}


// ========================================
// CUSTOMER ORDER CONFIRMATION EMAIL
// ========================================

async function sendCustomerConfirmation(order) {
  try {
    const recipient =
      typeof order.email === "string"
        ? order.email.trim()
        : "";

    if (!process.env.RESEND_API_KEY || !recipient) {
      console.log(
        "Customer email not provided; skipping confirmation."
      );
      return;
    }

    const itemsText = (
      Array.isArray(order.items) ? order.items : []
    )
      .map((item) => {
        const sizeText = item.size
          ? ` (Size ${item.size})`
          : "";

        return `- ${item.name}${sizeText} x ${item.quantity} — Rs. ${item.price}`;
      })
      .join("\n");

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "FASHONE Orders <onboarding@resend.dev>",
          to: [recipient],
          subject: `Your FASHONE Order Confirmed: ${order.orderNumber}`,
          text: `Hi ${order.customer_name || "Customer"},

Thank you for shopping with FASHONE! Your order has been received successfully.

Order Number: ${order.orderNumber}
Order Status: PLACED
Phone: ${order.phone}

Items:
${itemsText}

Subtotal: Rs. ${order.subtotal}
Shipping: Rs. ${order.shipping_fee}
Total: Rs. ${order.total}
Payment Method: ${order.payment_method}

Thank you for choosing FASHONE.`,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error(
        "Customer confirmation email failed:",
        response.status,
        data.message || JSON.stringify(data)
      );
      return;
    }

    console.log(
      "Customer confirmation email sent:",
      recipient,
      "Resend ID:",
      data.id
    );
  } catch (error) {
    // A customer email failure must never cancel a saved order.
    console.error(
      "Customer confirmation email failed:",
      error.message
    );
  }
}


// ========================================
// ADMIN LOGIN
// ========================================

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    !process.env.ADMIN_USERNAME ||
    !process.env.ADMIN_PASSWORD ||
    !process.env.ADMIN_TOKEN_SECRET
  ) {
    return res.status(500).json({
      error: "Admin authentication is not configured.",
    });
  }

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      error: "Invalid username or password.",
    });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.ADMIN_TOKEN_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    message: "Admin login successful.",
    token,
  });
});


// ========================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ========================================

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Admin login required.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ADMIN_TOKEN_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required.",
      });
    }

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired token.",
    });
  }
}


// ========================================
// HOME & HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "FASHONE API is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "FASHONE Backend",
  });
});


// ========================================
// DATABASE CONNECTION TEST
// ========================================

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
    console.error(
      "Database connection failed:",
      error.message
    );

    res.status(500).json({
      status: "Error",
      message: "Database connection failed",
    });
  }
});


// ========================================
// GET ALL ORDERS - ADMIN ONLY
// ========================================

app.get("/api/orders", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         order_number,
         customer_name,
         phone,
         address_line,
         city,
         state,
         postal_code,
         items,
         subtotal,
         shipping_fee,
         total,
         payment_method,
         payment_status,
         order_status,
         created_at
       FROM public.orders
       ORDER BY created_at DESC`
    );

    res.json({
      orders: result.rows,
    });
  } catch (error) {
    console.error(
      "Fetch orders failed:",
      error.message
    );

    res.status(500).json({
      error: "Unable to fetch orders.",
    });
  }
});


// ========================================
// UPDATE ORDER STATUS - ADMIN ONLY
// ========================================

app.patch(
  "/api/orders/:id/status",
  requireAdmin,
  async (req, res) => {
    try {
      const allowedStatuses = [
        "PLACED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
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
        return res.status(404).json({
          error: "Order not found.",
        });
      }

      res.json({
        message: "Order status updated.",
        order: result.rows[0],
      });
    } catch (error) {
      console.error(
        "Update order failed:",
        error.message
      );

      res.status(500).json({
        error: "Unable to update order.",
      });
    }
  }
);


// ========================================
// CREATE NEW ORDER + EMAIL NOTIFICATIONS
// ========================================

app.post("/api/orders", async (req, res) => {
  console.log("NEW ORDER REQUEST RECEIVED");

  try {
    const {
      customer_name,
      phone,
      email,
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

    console.log(
      "Customer email received:",
      email ? "YES" : "NO"
    );

    // Validate required fields.
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

    // Validate amounts and payment method.
    if (
      payment_method !== "COD" ||
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

    // Generate order number.
    const orderNumber =
      "FASH-" +
      Date.now() +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    // Save the order in the database.
    const result = await pool.query(
      `INSERT INTO public.orders (
        order_number,
        customer_name,
        phone,
        address_line,
        city,
        state,
        postal_code,
        items,
        subtotal,
        shipping_fee,
        total,
        payment_method
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12
      )
      RETURNING
        id,
        order_number,
        order_status,
        created_at`,
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

    console.log("ORDER SAVED:", orderNumber);

    // Send admin notification email.
    // An email failure must not cancel a saved order.
    await sendOrderNotification({
      orderNumber,
      customer_name,
      phone,
      address_line,
      city,
      state,
      postal_code,
      items,
      subtotal,
      shipping_fee,
      total,
      payment_method,
    });

    // Send customer confirmation email.
    console.log("CALLING CUSTOMER CONFIRMATION");

    await sendCustomerConfirmation({
      email,
      orderNumber,
      customer_name,
      phone,
      items,
      subtotal,
      shipping_fee,
      total,
      payment_method,
    });

    console.log(
      "ORDER EMAIL PROCESS COMPLETED:",
      orderNumber
    );

    return res.status(201).json({
      message: "Order placed successfully!",
      order: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Order creation failed:",
      error.message
    );

    return res.status(500).json({
      error: "Unable to place order. Please try again.",
    });
  }
});


// ========================================
// TRACK A SPECIFIC ORDER
// Requires order number + phone number
// ========================================

app.get("/api/track-order", async (req, res) => {
  try {
    const orderNumber = String(
      req.query.order_number || ""
    ).trim();

    const phone = String(
      req.query.phone || ""
    ).trim();

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
        error:
          "Order not found. Check your order number and phone number.",
      });
    }

    res.json({
      order: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Track order failed:",
      error.message
    );

    res.status(500).json({
      error: "Unable to track order right now.",
    });
  }
});


// ========================================
// MY ORDERS - LOOK UP USING MOBILE NUMBER
// ========================================

app.get("/api/my-orders", async (req, res) => {
  try {
    const phone = String(
      req.query.phone || ""
    ).trim();

    const digits = phone.replace(/\D/g, "");

    // Accept Indian mobile number with optional country code.
    const mobile =
      digits.length >= 10
        ? digits.slice(-10)
        : "";

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        error: "Enter a valid 10-digit Indian mobile number.",
      });
    }

    const result = await pool.query(
      `SELECT
         id,
         order_number,
         items,
         subtotal,
         shipping_fee,
         total,
         payment_method,
         payment_status,
         order_status,
         created_at
       FROM public.orders
       WHERE RIGHT(
         regexp_replace(phone, '\\D', '', 'g'),
         10
       ) = $1
       ORDER BY created_at DESC`,
      [mobile]
    );

    res.json({
      orders: result.rows,
    });
  } catch (error) {
    console.error(
      "Order history failed:",
      error.message
    );

    res.status(500).json({
      error: "Unable to load order history right now.",
    });
  }
});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(
    `FASHONE API running on port ${PORT}`
  );
});
