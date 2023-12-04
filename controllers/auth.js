const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET;

exports.getAllUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getUserDetail = (req, res, next) => {
  const userId = req.params.userId;

  User.find({ _id: userId })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => console.log(err));
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // const error = new Error("Validation failed.");
    // error.statusCode = 422;
    // error.data = errors.array();
    // throw error;
    res.status(400).json({ message: "E-Mail address already exists!" });
  } else {
    const fullName = req.query.fullname;
    const email = req.query.email;
    const password = req.query.password;
    const phone = req.query.phone;
    const role = req.query.role;
    try {
      const hashedPw = await bcrypt.hash(password, 12);

      const user = new User({
        email: email,
        password: hashedPw,
        fullName: fullName,
        phone: phone,
        role: role,
      });
      const result = await user.save();
      res.status(201).json({ message: "User created!", userId: result._id });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
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
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
