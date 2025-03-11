const orderService = require("../services/orderService");

const orderController = {
  async createOrder(req, res) {
    try {
      const { user_id, orderItems } = req.body;
      const order = await orderService.createOrder(user_id, orderItems);
      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAllOrders(req, res) {
    try {
      const { user_id } = req.body;
      const orders = await orderService.getAllOrders(user_id);
      res.status(200).json({ message: "Orders fetched successfully", orders });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getOrderById(req, res) {
    try {
      const { orderId } = req.body;
      const order = await orderService.getOrderById(orderId);
      res.status(200).json({ message: "Order fetched successfully", order });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async updateOrder(req, res) {
    try {
      const { orderId } = req.body;
      const updatedOrder = await orderService.updateOrder(orderId, req.body);
      res
        .status(200)
        .json({ message: "Order updated successfully", updatedOrder });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteOrder(req, res) {
    try {
      const { orderId } = req.body;
      await orderService.deleteOrder(orderId);
      res.status(200).json({ message: "Order canceled successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getOrdersByUserId(req, res) {
    try {
      const { user_id } = req.body;
      const orders = await orderService.getOrdersByUserId(user_id);
      res.status(200).json({ message: "Orders fetched successfully", orders });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = orderController;
