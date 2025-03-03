const paymentService = require("../services/paymentService");

const paymentController = {
  async addPayment(req, res) {
    try {
      const paymentData = req.body;
      const payment = await paymentService.addPayment(paymentData);
      res.status(201).json({
        message: "Payment added successfully",
        payment,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getAllPayments(req, res) {
    try {
      const { year, month } = req.query;
      const payments = await paymentService.getAllPayments(year, month);
      res.status(200).json({
        message: "Payments retrieved successfully",
        payments,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getPaymentByOrderId(req, res) {
    try {
      const { orderId } = req.body;
      const payment = await paymentService.getPaymentByOrderId(orderId);
      res.status(200).json({
        message: "Payment retrieved successfully",
        payment,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async getPaymentsByUserId(req, res) {
    try {
      const { user_id } = req.body;
      const payments = await paymentService.getPaymentsByUserId(user_id);
      res.status(200).json({
        message: "Payments retrieved successfully",
        payments,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};

module.exports = paymentController;
