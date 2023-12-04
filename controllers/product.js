const Product = require("../models/product");

exports.getAllProducts = (req, res, next) => {
  // Product.find()
  //   .then((products) => {
  //     res.status(200).json(products);
  //   })
  //   .catch((err) => console.log(err));

  const page = req.query.page;
  const limit = req.query.limit;
  const category = req.query.category;
  const search = req.query.search;

  if (!limit) {
    Product.find()
      .then((products) => {
        res.json(products);
      })
      .catch((err) => console.log(err));
  } else if (search) {
    Product.paginate(
      { name: { $regex: new RegExp(search, "i") } },
      { page: page, limit: limit }
    )
      .then((result) => {
        return {
          data: result.docs,
          page: result.page,
          totalPages: result.totalPages,
          total: result.totalDocs,
        };
      })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err));
  } else {
    Product.paginate({}, { page: page, limit: limit })
      .then((result) => {
        return {
          data: result.docs,
          page: result.page,
          totalPages: result.totalPages,
          total: result.totalDocs,
        };
      })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err));
  }
};

exports.getProductsCategory = (req, res, next) => {
  const page = req.query.page;
  const category = req.query.category;
  // const limit = req.query.limit;

  if (category === "all" || !category) {
    Product.paginate({}, { page: page, limit: 8 })
      .then((result) => {
        return {
          data: result.docs,
          page: result.page,
          totalPages: result.totalPages,
          total: result.totalDocs,
        };
      })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err));
  } else {
    Product.paginate({ category: category }, { page: page, limit: 8 })
      .then((result) => {
        return {
          data: result.docs,
          page: result.page,
          totalPages: result.totalPages,
          total: result.totalDocs,
        };
      })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log(err));
  }
};

exports.getProductDetail = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => console.log(err));
};
