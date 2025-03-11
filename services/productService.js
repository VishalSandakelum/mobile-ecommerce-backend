const Product = require("../models/productSchema");
const ProductSpecification = require("../models/productSpecificationSchema");
const mongoose = require("mongoose");

const productService = {
  async addProducts(products) {
    const session = await mongoose.startSession(); // Start transaction
    session.startTransaction();
    try {
      const savedProducts = await Product.insertMany(products, { session });
      let productSpecifications = [];

      products.forEach((product, index) => {
        if (product.specifications && product.specifications.length > 0) {
          productSpecifications.push(
            ...product.specifications.map((spec) => ({
              product_id: savedProducts[index]._id,
              specification_id: spec.specification_id,
              value: spec.value,
            }))
          );
        }
      });

      if (productSpecifications.length > 0) {
        await ProductSpecification.insertMany(productSpecifications, {
          session,
        });
      }

      await session.commitTransaction();
      session.endSession();
      return savedProducts;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Error adding products: " + error.message);
    }
  },

  async getAllProducts() {
    try {
      const products = await Product.find({ is_deleted: false }).populate(
        "category_id"
      );

      const productIds = products.map((product) => product._id);
      const specifications = await ProductSpecification.find({
        product_id: { $in: productIds },
      }).populate("specification_id");

      const productMap = products.map((product) => {
        product = product.toObject();
        product.specifications = specifications.filter(
          (spec) => spec.product_id.toString() === product._id.toString()
        );
        return product;
      });

      return productMap;
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  },

  async getProductById(productId) {
    console.log(productId);
    try {
      let product = await Product.findById(productId).populate("category_id");
      if (!product) throw new Error("Product not found");

      const specifications = await ProductSpecification.find({
        product_id: productId,
      }).populate("specification_id");

      product = product.toObject();
      product.specifications = specifications;

      return product;
    } catch (error) {
      throw new Error("Error fetching product: " + error.message);
    }
  },

  async updateProduct(productId, updateData) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, session }
      );
      if (!updatedProduct) throw new Error("Product not found");

      await ProductSpecification.deleteMany(
        { product_id: productId },
        { session }
      );
      if (updateData.specifications && updateData.specifications.length > 0) {
        const newSpecifications = updateData.specifications.map((spec) => ({
          product_id: productId,
          specification_id: spec.specification_id,
          value: spec.value,
        }));
        await ProductSpecification.insertMany(newSpecifications, { session });
      }

      await session.commitTransaction();
      session.endSession();
      return updatedProduct;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
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
