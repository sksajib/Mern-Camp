const Post = require("../Models/post");

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
module.exports = { requireSignin, canEditDelete };
