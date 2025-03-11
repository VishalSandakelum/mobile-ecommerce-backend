const mongoose = require("mongoose");
const Order = require("../models/orderSchema");
const OrderItem = require("../models/orderItemSchema");
const Product = require("../models/productSchema");
const Payment = require("../models/paymentSchema");

const orderService = {
  async createOrder(user_id, orderItems) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of orderItems) {
        const product = await Product.findById(item.product_id).session(
          session
        );
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found.`);
        }
        if (product.stock_quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for product: ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`
          );
        }
      }

      const total_price = orderItems.reduce(
        (sum, item) => sum + item.subtotal_price,
        0
      );

      const order = await new Order({ user_id, total_price }).save({ session });

      const items = orderItems.map((item) => ({
        order_id: order._id,
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal_price: item.subtotal_price,
      }));

      await OrderItem.insertMany(items, { session });

      for (const item of orderItems) {
        await Product.findByIdAndUpdate(
          item.product_id,
          { $inc: { stock_quantity: -item.quantity } },
          { session }
        );
      }

      await session.commitTransaction();
      session.endSession();
      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Failed to place order: " + error.message);
    }
  },

  async getAllOrders(user_id) {
    const orders = await Order.find({ user_id }).populate("user_id");

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.find({
          order_id: order._id,
        }).populate("product_id");

        const payment = await Payment.findOne({ order_id: order._id });
        const paymentStatus = payment
          ? payment.payment_status === "Completed"
          : false;

        return {
          ...order.toObject(),
          items: orderItems,
          payment: paymentStatus,
        };
      })
    );

    return ordersWithItems;
  },

  async getOrderById(orderId) {
    const order = await Order.findById(orderId).populate("user_id");
    if (!order) throw new Error("Order not found");

    const orderItems = await OrderItem.find({ order_id: orderId }).populate(
      "product_id"
    );

    const payment = await Payment.findOne({ order_id: orderId });
    const paymentStatus = payment
      ? payment.payment_status === "Completed"
      : false;

    return { ...order.toObject(), items: orderItems, payment: paymentStatus };
  },

  async updateOrder(orderId, updateData) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    const hoursPassed =
      (Date.now() - new Date(order.createdAt)) / (1000 * 60 * 60);
    if (hoursPassed < 24)
      throw new Error("Order cannot be confirm before 24 hours");

    Object.assign(order, updateData);
    await order.save();

    return order;
  },

  async deleteOrder(orderId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (!order) throw new Error("Order not found");

      const hoursPassed =
        (Date.now() - new Date(order.createdAt)) / (1000 * 60 * 60);
      if (hoursPassed > 24)
        throw new Error("Order cannot be canceled after 24 hours");

      const orderItems = await OrderItem.find({ order_id: orderId }).session(
        session
      );

      for (const item of orderItems) {
        await Product.findByIdAndUpdate(
          item.product_id,
          { $inc: { stock_quantity: item.quantity } },
          { session }
        );
      }

      await OrderItem.deleteMany({ order_id: orderId }).session(session);
      await Order.deleteOne({ _id: orderId }).session(session);
      await Payment.deleteOne({ order_id: orderId }).session(session);

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Failed to cancel order: " + error.message);
    }
  },

  async getOrdersByUserId(user_id) {
    const orders = await Order.find({ user_id }).populate("user_id");

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItem.find({
          order_id: order._id,
        }).populate("product_id");

        const payment = await Payment.findOne({ order_id: order._id });
        const paymentStatus = payment
          ? payment.payment_status === "Completed"
          : false;

        return {
          ...order.toObject(),
          items: orderItems,
          payment: paymentStatus,
        };
      })
    );

    return ordersWithItems;
  },
};

module.exports = orderService;
