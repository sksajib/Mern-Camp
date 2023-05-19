const Post = require("../Models/post");
const User = require("../Models/user");

const { expressjwt: jwt } = require("express-jwt");
const requireSignin = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
const canEditDelete = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params._id);
    if (req.auth._id != post.postedBy) {
      res.status(400).send("Unauthorized");
    } else {
      next();
    }
  } catch (err) {}
};
const canUpdateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.id);
    if (req.auth._id != user._id) {
      res.status(400).send("Unauthorized");
    } else {
      next();
    }
  } catch (err) {
    res.status(400).send("Unexpected error Occured");
  }
};
module.exports = { requireSignin, canEditDelete, canUpdateProfile };
