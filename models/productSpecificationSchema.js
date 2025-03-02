const mongoose = require("mongoose");

const productSpecificationSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    specification_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specification",
      required: true,
    },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ProductSpecification",
  productSpecificationSchema
);
