const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock_quantity: { type: Number, required: true },
    image_url: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
