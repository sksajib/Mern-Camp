const Post = require("../Models/post");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const createPost = (req, res) => {
  try {
    const { content, image } = req.body;
    console.log(image.url);
    const contentC = content.replaceAll(/\s+/g, " ");
    console.log(content);
    const contentClear = contentC.replaceAll(/(<([^>]+)>)/gi, "");
    if (!image.url) console.log("Fuck You");
    if (!content && !image.url) {
      return res.status(400).send("Create a post");
    }
    if (
      ((content && contentClear === " ") || (content && contentClear === "")) &&
      !image.url
    ) {
      return res.status(400).send("Create a valid post");
    }
    if ((content && contentClear !== " " && contentClear !== "") || image.url) {
      console.log(contentC);
      if (
        content &&
        contentClear !== " " &&
        contentClear !== "" &&
        !image.url
      ) {
        const post = new Post({ content: contentC, postedBy: req.auth._id });
        post.save();
        return res.json(post);
      }
      if (
        !(content && contentClear !== " " && contentClear !== "") &&
        image.url
      ) {
        const post = new Post({
          content: contentC,
          image,
          postedBy: req.auth._id,
        });
        post.save();
        return res.json(post);
      }
      if (content && contentClear !== " " && contentClear !== "" && image.url) {
        const post = new Post({
          content: contentC,
          image,
          postedBy: req.auth._id,
        });
        post.save();
        return res.json(post);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};
const uploadImage = async (req, res) => {
  console.log("request files=>", req.files);
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    console.log("uploaded image url=>", result);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.log(err);
  }
};
const postByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.auth._id })
      .populate("postedBy", "_id name image")
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};
module.exports = { createPost, uploadImage, postByUser };
