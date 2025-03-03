const express = require("express");
const specificationController = require("../controllers/specificationController");
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
  specificationController.addSpecification
);

router.get(
  "/all",
  authMiddleware,
  specificationController.getAllSpecifications
);

router.get("/one", authMiddleware, specificationController.getSpecification);

router.put(
  "/update",
  authMiddleware,
  adminOnly,
  specificationController.updateSpecification
);

router.delete(
  "/delete",
  authMiddleware,
  adminOnly,
  specificationController.deleteSpecification
);

module.exports = router;
