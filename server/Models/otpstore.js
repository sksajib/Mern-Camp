const mongoose = require("mongoose");
const { mongo } = require("mongoose");
const { ObjectId } = mongoose.Schema;
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });
module.exports = mongoose.model("OtpStore", otpSchema);
