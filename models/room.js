const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    content: [
      {
        is_admin: { type: Boolean },
        message: { type: String },
      },
    ],
    creator: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
