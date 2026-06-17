require("dotenv").config();

const express = require("express");
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const categoryRoutes = require("./routes/category.routes");
const kitchenRoutes = require("./routes/kitchen.routes");
const tableRoutes = require("./routes/table.routes");
const customerRoutes = require("./routes/customer.routes");
const employeeRoutes = require("./routes/employee.routes");
const receiptRoutes = require("./routes/receipt.routes");
const reportRoutes = require("./routes/report.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    project: "PulsePOS Backend API",
    status: "Live",
    version: "1.0.0",
    github: "https://github.com/D4C-WOU/PulsePOS",
  });
});

app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/reports", reportRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);
});

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running...");
});
