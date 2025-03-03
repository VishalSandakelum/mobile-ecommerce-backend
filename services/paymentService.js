const Payment = require("../models/paymentSchema");
const Order = require("../models/orderSchema");

const paymentService = {
  async addPayment(data) {
    try {
      const { order_id, user_id, amount, payment_status, payment_method } =
        data;

      const order = await Order.findById(order_id);
      if (!order) {
        throw new Error("Order not found");
      }

      const payment = new Payment({
        order_id,
        user_id,
        amount,
        payment_status: payment_status || "Completed",
        payment_method,
      });

      await payment.save();
      return payment;
    } catch (error) {
      throw new Error("Error while adding payment: " + error.message);
    }
  },

  async getAllPayments(year, month) {
    try {
      let filter = {};

      if (year && month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        filter.createdAt = { $gte: startDate, $lte: endDate };
      }

      const payments = await Payment.find(filter).populate("user_id order_id");
      return payments;
    } catch (error) {
      throw new Error("Error fetching payments: " + error.message);
    }
  },

  async getPaymentByOrderId(orderId) {
    try {
      const payment = await Payment.findOne({ order_id: orderId }).populate(
        "user_id order_id"
      );

      if (!payment) {
        throw new Error("Payment not found for the given order ID");
      }

      return payment;
    } catch (error) {
      throw new Error("Error fetching payment: " + error.message);
    }
  },

  async getPaymentsByUserId(userId) {
    try {
      const payments = await Payment.find({ user_id: userId }).populate(
        "user_id order_id"
      );

      if (!payments.length) {
        throw new Error("No payments found for the given user ID");
      }

      return payments;
    } catch (error) {
      throw new Error("Error fetching payments by user ID: " + error.message);
    }
  },
};

module.exports = paymentService;
