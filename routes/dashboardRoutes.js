const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/metrics", authMiddleware, dashboardController.getDashboardMetrics);
router.get(
  "/monthly-revenue",
  authMiddleware,
  dashboardController.getMonthlyRevenue
);
router.get(
  "/category-stock",
  authMiddleware,
  dashboardController.getCategoryStockCount
);
router.get(
  "/order-status",
  authMiddleware,
  dashboardController.getOrderStatusCounts
);
router.get(
  "/top-selling",
  authMiddleware,
  dashboardController.getTopSellingProducts
);

module.exports = router;
