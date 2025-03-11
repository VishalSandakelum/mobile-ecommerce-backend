const express = require("express");
const paymentController = require("../controllers/paymentController");
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

router.post("/add", authMiddleware, attachUserId, paymentController.addPayment);

router.get("/all", authMiddleware, adminOnly, paymentController.getAllPayments);

router.post("/one", authMiddleware, paymentController.getPaymentByOrderId);

router.get(
  "/author/all",
  authMiddleware,
  attachUserId,
  paymentController.getPaymentsByUserId
);

module.exports = router;
