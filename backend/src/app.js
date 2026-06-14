require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const socketConfig = require("./config/socket");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);

// CORS options
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Initialize Socket.io
const io = socketConfig.init(server, corsOptions);
app.set("io", io);

// Security, logs, and limiters
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));

// Custom verify function to store rawBody for Polar webhook signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl && req.originalUrl.includes("/polar/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use(limiter);

// Mount API routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/floors", require("./routes/floor.routes"));
app.use("/api/tables", require("./routes/table.routes"));
app.use("/api/payment-methods", require("./routes/paymentMethod.routes"));
app.use("/api/coupons", require("./routes/coupon.routes"));
app.use("/api/promotions", require("./routes/promotion.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/sessions", require("./routes/session.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
app.use("/api/kds", require("./routes/kds.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/reports", require("./routes/report.routes"));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
