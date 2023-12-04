const express = require("express");
const Product = require("../models/product");
const User = require("../models/user");
const cartController = require("../controllers/cart");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/carts", isAuth, cartController.getCart);

router.post("/carts/add", isAuth, cartController.postCart);

router.delete("/carts/delete", isAuth, cartController.postCartDeleteProduct);

router.put("/carts/update", isAuth, cartController.updateCart);

router.post("/email", isAuth, cartController.postOrder);

router.get("/histories", isAuth, cartController.getOrders);

router.get("/histories/:orderId", isAuth, cartController.getOrderDetail);

module.exports = router;
