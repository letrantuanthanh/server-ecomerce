const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const nodemailer = require("nodemailer");
const mailer = require("../utils/mailer");
const convert = require("../utils/convertMoney");
// const mailgunTransport = require("nodemailer-mailgun-transport");

// const transporter = nodemailer.createTransport(mailgunTransport({
//   auth: {
//     api_user: ,
//     api_key:
//   }
// }))

exports.getCart = (req, res, next) => {
  const userId = req.userId;
  const user = User.findById({ _id: userId });
  user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.status(200).json(products);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.query.idProduct;
  const quantity = req.query.count;
  const userId = req.userId;

  const user = User.findById(userId);

  // console.log(user);

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product, Number(quantity));
    })
    .then((result) => {
      console.log(result);
      res.status(200).send({ message: "Added Cart" });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.query.idProduct;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.status(200).send({ message: "Deleted!" });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.updateCart = (req, res, next) => {
  const prodId = req.query.idProduct;
  const quantity = req.query.count;
  const userId = req.userId;

  Product.findById(prodId)
    .then((product) => {
      return req.user.updateCart(product, Number(quantity));
    })
    .then((result) => {
      // console.log(result);
      res.status(200).send({ message: "Updated Cart" });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = async (req, res, next) => {
  const address = req.body.address;
  const email = req.body.email;
  const fullName = req.body.fullname;
  const phone = req.body.phone;
  const carts = req.body.carts;
  const total = req.body.total;
  const userId = req.body.idUser;

  try {
    const data = {
      address: address,
      email: email,
      name: fullName,
      phone: phone,
      carts: carts,
      total: total,
      userId: userId,
    };

    const order = new Order(data);

    mailer.sendMail(
      data.email,
      "Đặt hàng thành công",
      `<div style="background-color: black;color: #fff;padding: 20px">
      <h1>Xin Chào ${data.name}</h1>
      <h3>Phone: ${data.phone}</h3>
      <h3>Address: ${data.address}</h3>
      <div className="table-responsive mb-4">
      <table className="table" border="1" style="border-collapse:collapse; border-color: #fff">
        <thead className="bg-light">
          <tr className="text-center">
            <th className="border-1" scope="col">
              <strong className="text-small text-uppercase">Tên Sản Phẩm</strong>
            </th>
            <th className="border-1" scope="col">
              <strong className="text-small text-uppercase">Hình ảnh</strong>
            </th>
            <th className="border-1" scope="col">
              <strong className="text-small text-uppercase">Giá</strong>
            </th>
            <th className="border-1" scope="col">
              <strong className="text-small text-uppercase">Số Lượng</strong>
            </th>
            <th className="border-1" scope="col">
              <strong className="text-small text-uppercase">Thành tiền</strong>
            </th>
          </tr>
        </thead>
        <tbody>
      ${data.carts
        .map((value, index) => {
          return `
        <tr className="text-center" style="text-align: center;" key=${index}>
          <td className="align-middle border-1">
            <div className="media align-items-center justify-content-center"> 
              ${value?.productId?.name}
            </div>
          </td>
          <td className="pl-0 border-1">
            <div className="media align-items-center justify-content-center">
              <img src=${value?.productId?.img1} alt="..." width="70" />
            </div>
          </td>
          <td className="align-middle border-1">
            <p className="mb-0 small">
              ${convert.convertMoney(value?.productId?.price)} VND
            </p>
          </td>
          <td className="align-middle border-1">
            <div className="quantity justify-content-center">
              ${value?.quantity}
            </div>
          </td>
          <td className="align-middle border-1">
            <p className="mb-0 small">
              ${convert.convertMoney(
                parseInt(value?.productId?.price) * parseInt(value?.quantity)
              )}
              VND
            </p>
          </td>
        </tr>
        `;
        })
        .join("")}
      </tbody>
      </table>
      </div>
      <h2>Tổng Thanh Toán:</h2>
      <h2>${convert.convertMoney(data?.total)} VND</h2>
      <h2>Cảm ơn bạn!</h2>
      </div>
      `
    );

    const result = await order.save();
    req.user.clearCart();
    res.status(201).json({ message: "Order created!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getOrders = (req, res, next) => {
  const userId = req.query.idUser;
  Order.find({ userId: userId })
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrderDetail = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      res.status(200).json(order);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
