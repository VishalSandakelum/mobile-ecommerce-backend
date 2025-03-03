const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  (req, res, next) => {
    req.body.user_id = req.user.id;
    next();
  },
  cartController.addProductToCart
);
router.delete(
  "/remove",
  authMiddleware,
  (req, res, next) => {
    req.body.user_id = req.user.id;
    next();
  },
  cartController.removeProductFromCart
);
router.put(
  "/update",
  authMiddleware,
  (req, res, next) => {
    req.body.user_id = req.user.id;
    next();
  },
  cartController.updateProductInCart
);
router.get(
  "/all",
  authMiddleware,
  (req, res, next) => {
    req.body.user_id = req.user.id;
    next();
  },
  cartController.getCartByUserId
);
router.get(
  "/one",
  authMiddleware,
  (req, res, next) => {
    req.body.user_id = req.user.id;
    next();
  },
  cartController.getSingleCartProduct
);

module.exports = router;
