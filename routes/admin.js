const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.post("/admin/login", adminController.adminLogin);

// router.get("/admin/:userId", adminController.getUserDetail);

router.get("/histories/all", adminController.getAllOrders);

module.exports = router;
