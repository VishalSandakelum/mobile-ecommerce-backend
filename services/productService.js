const Product = require("../models/productSchema");

const productService = {
  async addProducts(products) {
    try {
      const savedProducts = await Product.insertMany(products);
      return savedProducts;
    } catch (error) {
      throw new Error("Error adding products: " + error.message);
    }
  },

  async getAllProducts() {
    try {
      return await Product.find({ is_deleted: false }).populate("category_id");
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  },

  async getProductById(productId) {
    try {
      const product = await Product.findById(productId).populate("category_id");
      if (!product) throw new Error("Product not found");
      return product;
    } catch (error) {
      throw new Error("Error fetching product: " + error.message);
    }
  },

  async updateProduct(productId, updateData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      );
      if (!updatedProduct) throw new Error("Product not found");
      return updatedProduct;
    } catch (error) {
      throw new Error("Error updating product: " + error.message);
    }
  },

  async deleteProduct(productId) {
    try {
      const deletedProduct = await Product.findByIdAndUpdate(
        productId,
        { is_deleted: true },
        { new: true }
      );
      if (!deletedProduct) throw new Error("Product not found");
      return { message: "Product marked as deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting product: " + error.message);
    }
  },
};

module.exports = productService;
