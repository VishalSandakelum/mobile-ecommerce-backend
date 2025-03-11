const express = require("express");
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

const attachUserId = (req, res, next) => {
  req.body.user_id = req.user.id;
  next();
};

router.post(
  "/create",
  authMiddleware,
  attachUserId,
  orderController.createOrder
);

router.get("/all", authMiddleware, attachUserId, orderController.getAllOrders);

router.post("/one", authMiddleware, orderController.getOrderById);

router.put("/update", authMiddleware, adminOnly, orderController.updateOrder);

router.delete("/delete", authMiddleware, orderController.deleteOrder);

router.post(
  "/all/user",
  authMiddleware,
  attachUserId,
  orderController.getOrdersByUserId
);

module.exports = router;
