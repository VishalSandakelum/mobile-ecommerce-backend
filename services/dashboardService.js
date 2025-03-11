const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Order = require("../models/orderSchema");
const OrderItem = require("../models/orderItemSchema");
const Payment = require("../models/paymentSchema");
const Category = require("../models/categorySchema");
const mongoose = require("mongoose");

const dashboardService = {
  async getDashboardMetrics() {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { payment_status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const lowestStockProduct = await Product.findOne(
      {},
      "stock_quantity name",
      {
        sort: { stock_quantity: 1 },
      }
    );
    const pendingOrders = await Order.countDocuments({ status: "Pending" });

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      lowestStockProduct,
      pendingOrders,
    };
  },

  async getMonthlyRevenue() {
    const currentYear = new Date().getFullYear();
    const revenue = await Payment.aggregate([
      { $match: { payment_status: "Completed" } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $match: { "_id.year": currentYear } },
      { $sort: { "_id.month": 1 } },
    ]);

    let monthlyRevenue = Array(12).fill(0);
    revenue.forEach((r) => (monthlyRevenue[r._id.month - 1] = r.total));

    return monthlyRevenue;
  },

  async getCategoryStockCount() {
    return await Product.aggregate([
      { $group: { _id: "$category_id", stock: { $sum: "$stock_quantity" } } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $project: { category: "$category.name", stock: 1 } },
    ]);
  },

  async getOrderStatusCounts() {
    const statuses = ["Delivered", "Shipped", "Pending", "Cancelled"];
    const orderCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return statuses.reduce((acc, status) => {
      acc[status] = orderCounts.find((o) => o._id === status)?.count || 0;
      return acc;
    }, {});
  },

  async getTopSellingProducts() {
    return await OrderItem.aggregate([
      {
        $group: {
          _id: "$product_id",
          soldUnits: { $sum: "$quantity" },
          revenue: { $sum: "$subtotal_price" },
        },
      },
      { $sort: { soldUnits: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $project: { name: "$product.name", soldUnits: 1, revenue: 1 } },
    ]);
  },
};

module.exports = dashboardService;
