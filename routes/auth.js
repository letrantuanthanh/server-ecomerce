const express = require("express");
const { query } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/users", authController.getAllUsers);

router.post(
  "/users/signup",
  [
    query("email")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
  ],
  authController.signup
);

router.post("/users/login", authController.login);

router.get("/users/:userId", authController.getUserDetail);

module.exports = router;
