const ProductSpecification = require("../models/productSpecificationSchema");

exports.deleteProductSpecification = async (id) => {
  try {
    const deletedProduct = await ProductSpecification.findByIdAndDelete(id);
    if (!deletedProduct) throw new Error("Product specification not found");
    return {
      message: "Product Specification marked as deleted successfully",
    };
  } catch (error) {
    throw new Error("Error deleting product specification: " + error.message);
  }
};
