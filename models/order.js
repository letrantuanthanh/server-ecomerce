const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  carts: {
    type: Array,
    required: true,
  },
  delevery: {
    type: String,
  },
  status: {
    type: String,
  },
});

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", orderSchema);
