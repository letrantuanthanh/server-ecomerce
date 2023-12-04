const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const adminRoutes = require("./routes/admin");
const chatRoutes = require("./routes/chat");

const MONGODB_URI = `mongodb+srv://${process.env.USER_NAME}:${process.env.DATABASE_PASSWORD}@cluster0.vmfrnps.mongodb.net/`;

const User = require("./models/user");

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(adminRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(chatRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(5000, () => {
      console.log("server started at port 5000!");
      const io = require("./socket").init(server);
      io.on("connection", (socket) => {
        console.log("Client connected");
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
