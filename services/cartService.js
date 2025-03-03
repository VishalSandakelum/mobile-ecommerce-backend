const Cart = require("../models/cartSchema");

const cartService = {
  async addProductToCart(data) {
    try {
      const { user_id, product_id, quantity } = data;

      const existingCartItem = await Cart.findOne({ user_id, product_id });

      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
        return existingCartItem;
      }

      // Create new cart item
      const cartItem = new Cart({ user_id, product_id, quantity });
      await cartItem.save();
      return cartItem;
    } catch (error) {
      throw new Error("Error adding product to cart: " + error.message);
    }
  },

  async removeProductFromCart(user_id, product_id) {
    try {
      const cartItem = await Cart.findOneAndDelete({ user_id, product_id });
      if (!cartItem) throw new Error("Product not found in cart");
      return { message: "Product removed from cart successfully" };
    } catch (error) {
      throw new Error("Error removing product from cart: " + error.message);
    }
  },

  async updateProductInCart(data) {
    try {
      const { user_id, product_id, quantity } = data;

      const cartItem = await Cart.findOne({ user_id, product_id });
      if (!cartItem) throw new Error("Product not found in cart");

      cartItem.quantity = quantity;
      await cartItem.save();
      return cartItem;
    } catch (error) {
      throw new Error("Error updating product in cart: " + error.message);
    }
  },

  async getCartByUserId(user_id) {
    try {
      const cartItems = await Cart.find({ user_id }).populate("product_id");
      return cartItems;
    } catch (error) {
      throw new Error("Error fetching cart items: " + error.message);
    }
  },

  async getSingleCartProduct(user_id, product_id) {
    try {
      const cartItem = await Cart.findOne({ user_id, product_id }).populate(
        "product_id"
      );
      if (!cartItem) throw new Error("Product not found in cart");
      return cartItem;
    } catch (error) {
      throw new Error("Error fetching product from cart: " + error.message);
    }
  },
};

module.exports = cartService;
