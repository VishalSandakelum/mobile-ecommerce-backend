const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const mongo_uri = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoutes");
const specificationRoutes = require("./routes/specificationRoutes");
const productRoutes = require("./routes/productRoutes");
const productSpecificationRoutes = require("./routes/productSpecificationRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

//Routes
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/specification", specificationRoutes);
app.use("/api/product", productRoutes);
app.use("/api/productspecification", productSpecificationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);

mongoose
  .connect(mongo_uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("DB connection error : ", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
