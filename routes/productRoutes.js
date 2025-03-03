const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.post("/add", productController.addProducts);

router.get("/all", productController.getAllProducts);

router.get("/one", productController.getProductById);

router.put("/update", productController.updateProduct);

router.delete("/delete", productController.deleteProduct);

module.exports = router;
