const express = require("express");
const Product = require("../models/product");
const productController = require("../controllers/product");

const router = express.Router();

router.get("/products", productController.getAllProducts);

router.get("/products/category", productController.getProductsCategory);

router.get("/products/:productId", productController.getProductDetail);

module.exports = router;
