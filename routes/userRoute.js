const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

router.post("/signup", userController.signUp);

router.post("/login", userController.login);

router.get("/users", authMiddleware, adminOnly, userController.getAllUsers);

router.put("/update", authMiddleware, userController.updateUserDetails);

router.put("/forgot-password", authMiddleware, userController.forgotPassword);

module.exports = router;
