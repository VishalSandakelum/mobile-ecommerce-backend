const productService = require("../services/productService");

const productController = {
  async addProducts(req, res) {
    try {
      let products = Array.isArray(req.body) ? req.body : [req.body];
      products = products.map((product) => ({
        ...product,
        image_base64: product.image_base64 || "",
      }));
      const savedProducts = await productService.addProducts(products);
      res.status(201).json(savedProducts);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.body.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async updateProduct(req, res) {
    try {
      const updatedProduct = await productService.updateProduct(
        req.body.id,
        req.body
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteProduct(req, res) {
    try {
      const response = await productService.deleteProduct(req.body.id);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};

module.exports = productController;
