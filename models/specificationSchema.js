const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Specification", specificationSchema);
