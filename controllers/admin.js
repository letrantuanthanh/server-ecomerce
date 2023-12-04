const User = require("../models/user");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET;

exports.adminLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Admin with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      // const error = new Error("Wrong password!");
      // error.statusCode = 401;
      // throw error;
      res.status(401).send({ message: "Wrong password!" });
    }
    if (user.role === "customer") {
      res.status(401).send({ message: "Unauthorized!" });
    }
    if (user.role === "admin" || user.role === "counselor") {
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllOrders = (req, res, next) => {
  Order.find()
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
