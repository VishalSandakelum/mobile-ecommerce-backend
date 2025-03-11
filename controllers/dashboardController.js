const dashboardService = require("../services/dashboardService");

const dashboardController = {
  async getDashboardMetrics(req, res) {
    const data = await dashboardService.getDashboardMetrics();
    res.json(data);
  },

  async getMonthlyRevenue(req, res) {
    const data = await dashboardService.getMonthlyRevenue();
    res.json(data);
  },

  async getCategoryStockCount(req, res) {
    const data = await dashboardService.getCategoryStockCount();
    res.json(data);
  },

  async getOrderStatusCounts(req, res) {
    const data = await dashboardService.getOrderStatusCounts();
    res.json(data);
  },

  async getTopSellingProducts(req, res) {
    const data = await dashboardService.getTopSellingProducts();
    res.json(data);
  },
};

module.exports = dashboardController;
