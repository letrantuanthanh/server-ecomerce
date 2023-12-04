const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  img1: {
    type: String,
    required: true,
  },
  img2: {
    type: String,
    required: true,
  },
  img3: {
    type: String,
    required: true,
  },
  img4: {
    type: String,
    required: true,
  },
  long_desc: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  short_desc: {
    type: String,
    required: true,
  },
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", productSchema);
