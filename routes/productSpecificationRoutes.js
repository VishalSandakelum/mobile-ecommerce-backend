const express = require("express");
const router = express.Router();
const productSpecificationController = require("../controllers/productSpecificationController");
const authMiddleware = require("../middlewares/authMiddleware");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

router.delete(
  "/delete",
  authMiddleware,
  adminOnly,
  productSpecificationController.deleteProductSpecification
);

module.exports = router;
