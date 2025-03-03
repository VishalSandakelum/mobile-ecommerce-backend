const express = require("express");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

router.post(
  "/add",
  authMiddleware,
  adminOnly,
  categoryController.addCategories
);

router.get("/all", categoryController.getAllCategories);

router.get("/one", categoryController.getCategoryById);

router.put(
  "/update",
  authMiddleware,
  adminOnly,
  categoryController.updateCategory
);

router.delete(
  "/delete",
  authMiddleware,
  adminOnly,
  categoryController.deleteCategory
);

module.exports = router;
