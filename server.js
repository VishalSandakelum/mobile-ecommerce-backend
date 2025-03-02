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

//Routes
app.use("/api/user", userRoutes);

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
