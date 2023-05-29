const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;
const inactive = new mongoose.Schema(
  {
    createdBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    created: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("inactiveTime", inactive);
