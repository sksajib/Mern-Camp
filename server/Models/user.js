const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      min: 8,
      max: 64,
    },
    question: {
      type: String,
    },
    secret: {
      type: String,
      trim: true,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    about: {},
    photo: String,
    following: [{ type: Schema.ObjectId, ref: "User" }],
    followers: [{ type: Schema.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
