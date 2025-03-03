const cartService = require("../services/cartService");

const cartController = {
  async addProductToCart(req, res) {
    try {
      const cartItem = await cartService.addProductToCart(req.body);
      res.status(201).json({
        message: "Product added to cart successfully",
        cartItem,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async removeProductFromCart(req, res) {
    try {
      const { user_id, product_id } = req.body;
      const response = await cartService.removeProductFromCart(
        user_id,
        product_id
      );
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async updateProductInCart(req, res) {
    try {
      const cartItem = await cartService.updateProductInCart(req.body);
      res.status(200).json({
        message: "Product quantity updated successfully",
        cartItem,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getCartByUserId(req, res) {
    try {
      const { user_id } = req.body;
      const cartItems = await cartService.getCartByUserId(user_id);
      res.status(200).json({
        message: "Cart items fetched successfully",
        cartItems,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getSingleCartProduct(req, res) {
    try {
      const { user_id, product_id } = req.body;
      const cartItem = await cartService.getSingleCartProduct(
        user_id,
        product_id
      );
      res.status(200).json({
        message: "Cart product fetched successfully",
        cartItem,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = cartController;
