const Post = require("../Models/post");
const User = require("../Models/user");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    //console.log(image.url);
    const contentC = content.replaceAll(/\s+/g, " ");
    //console.log(content);
    const contentClear = contentC.replaceAll(/(<([^>]+)>)/gi, "");

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
      // console.log(contentC);
      if (
        content &&
        contentClear !== " " &&
        contentClear !== "" &&
        !image.url
      ) {
        const post = new Post({
          content: contentC,
          image: "",
          postedBy: req.auth._id,
        });
        await post.save();
        const postWithUser = await Post.findById(post._id)
          .populate("postedBy", "_id name photo")
          .populate("comments.postedBy", "_id name photo");
        return res.json(postWithUser);
      }
      if (
        !(content && contentClear !== " " && contentClear !== "") &&
        image.url
      ) {
        const post = new Post({
          content: contentC,
          image: image.url,
          postedBy: req.auth._id,
        });
        await post.save();
        const postWithUser = await Post.findById(post._id)
          .populate("postedBy", "_id name photo")
          .populate("comments.postedBy", "_id name photo");
        return res.json(postWithUser);
      }
      if (content && contentClear !== " " && contentClear !== "" && image.url) {
        const post = new Post({
          content: contentC,
          image: image.url,
          postedBy: req.auth._id,
        });
        await post.save();
        const postWithUser = await Post.findById(post._id)
          .populate("postedBy", "_id name photo")
          .populate("comments.postedBy", "_id name photo");
        return res.json(postWithUser);
      }
    }
  } catch (err) {
    //console.log(err);
    return res.status(400).send(err);
  }
};
const uploadImage = async (req, res) => {
  //console.log("request files=>", req.files);
  try {
    const { url } = req.body;
    //console.log(image);
    if (url) {
      const publicId = url.split("/").pop().split(".")[0];

      const result2 = await cloudinary.uploader.destroy(publicId);
    }
    console.log(req.files.image.path);
    const result = await cloudinary.uploader.upload(req.files.image.path);

    //console.log("uploaded image url=>", result);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    //console.log(err);
  }
};
const postByUser = async (req, res) => {
  try {
    //const posts = await Post.find({ postedBy: req.auth._id })//returning posts only by the logged in user

    let user = await User.findById(req.auth._id);
    let following = user.following;
    const currentPage = req.params.page || 1;
    const perPage = 2;
    if (following) {
      following.push(user._id);
      const posts = await Post.find({ postedBy: { $in: following } })
        .skip((currentPage - 1) * perPage)
        .populate("postedBy", "_id name photo")
        .populate("comments.postedBy", "_id name photo")
        .sort({ createdAt: -1 })
        .limit(perPage);

      return res.json(posts);
    }

    if (!following) {
      const posts = await Post.find({ postedBy: req.auth._id })
        .skip((currentPage - 1) * perPage)
        .populate("postedBy", "_id name photo")
        .sort({ createdAt: -1 })
        .limit(perPage);

      return res.json(posts);
    }
  } catch (err) {
    console.log(err);
  }
};
const postByLoggedInUser = async (req, res) => {
  try {
    const currentPage = req.params.page || 1;
    const perPage = 2;
    //returning posts only by the logged in user
    //const posts = await Post.find() //returning all posts
    const posts = await Post.find({ postedBy: req.auth._id })
      .skip((currentPage - 1) * perPage)
      .populate("postedBy", "_id name photo")
      .populate("comments.postedBy", "_id name photo")
      .sort({ createdAt: -1 })
      .limit(perPage);

    return res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

const userPost = async (req, res) => {
  try {
    //console.log(req);
    const post = await Post.findById(req.params._id)
      .populate("postedBy", "_id name photo")
      .populate("comments.postedBy", "_id name photo");
    return res.json(post);
  } catch (err) {
    //console.log(err);
  }
};
const clearImage = async (req, res) => {
  try {
    const image = req.body.image;
    if (image) {
      const publicId = image.split("/").pop().split(".")[0];
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Deleted Succesfully ", image);
      return res.send({ ok: true });
    } else {
      return res.send({ ok: true });
    }
  } catch (err) {
    //console.log(err);
    return res.status(400);
  }
};

const userPostUpdate = async (req, res) => {
  try {
    const { content, image } = req.body;
    const _id = req.params._id;
    const contentC = content.replaceAll(/\s+/g, " ");

    const contentClear = contentC.replaceAll(/(<([^>]+)>)/gi, "");
    //if (!image.url) console.log("Fuck You");
    if (!content && !image) {
      return res.status(400).send("Invalid Post");
    }
    if (
      ((content && contentClear === " ") || (content && contentClear === "")) &&
      !image
    ) {
      return res.status(400).send("Invalid Post");
    }
    if ((content && contentClear !== " " && contentClear !== "") || image) {
      //console.log(contentC);
      if (content && contentClear !== " " && contentClear !== "" && !image) {
        const ok = await Post.updateOne({ _id: _id }, { content: contentC });
        const ok2 = await Post.updateOne(
          { _id: _id },

          { image: "" }
        );

        return res.send("Successfull");
      }
      if (!(content && contentClear !== " " && contentClear !== "") && image) {
        const ok = await Post.updateOne({ _id: _id }, { content: contentC });
        const ok2 = await Post.updateOne(
          { _id: _id },

          { image: image }
        );

        return res.send("Successfull");
      }
      if (content && contentClear !== " " && contentClear !== "" && image) {
        const ok = await Post.updateOne({ _id: _id }, { image: image });
        const ok2 = await Post.updateOne({ _id: _id }, { content: contentC });

        return res.send("Successfull");
      }
    }
  } catch (err) {
    //console.log(err);
    res.status(400);
  }
};
const userPostDelete = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params._id);

    if (post.image) {
      const imageURL = post.image;
      const publicId = imageURL.split("/").pop().split(".")[0];
      const image = await cloudinary.uploader.destroy(publicId);
      console.log("Deleted Succesfully ", image);
    }
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(404).send("Unsuccessfull");
  }
};
const likePost = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const post = await Post.findById(req.params._id);
    const likes = post.likes;
    if (likes.length > 0) {
      for (let i = 0; i < likes.length; i++) {
        if (likes[i] == req.auth._id) {
          likes.splice(i, 1);

          const ok = await Post.updateOne(
            { _id: post._id },
            {
              $set: {
                likes: likes,
              },
            }
          );
          return res.send({ ok: true });
        }
      }
    }
    likes.push(user._id);
    const ok = await Post.updateOne(
      { _id: post._id },
      {
        $set: {
          likes: likes,
        },
      }
    );
    return res.send({ ok: true });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};
const addComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const personId = req.auth._id;
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { text: comment, postedBy: personId } },
      },
      { new: true }
    )
      .populate("postedBy", "_id name photo")
      .populate("comments.postedBy", "_id name photo");

    return res.json(post);
  } catch (err) {
    return res.send(err);
  }
};

const removeComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const post = await Post.findById(postId);
    console.log(postId);
    const comments = post.comments;
    const comment2 = comments.filter((c) => c._id == comment._id);
    console.log(comment2);
    const person1Id = req.auth._id;
    const person2id = comment2[0].postedBy;
    const person3Id = post.postedBy;
    console.log(person1Id, " ", person2id, " ", person3Id);
    if (person3Id == person1Id || person2id == person1Id) {
      console.log("ok");
      const result = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { comments: { _id: comment._id } },
        },
        { new: true }
      );
      return res.json(result);
    }

    return res.status(400).send("You can't delete the comment");
  } catch (err) {}
};
const totalPostsHome = async (req, res) => {
  try {
    //const posts = await Post.find({ postedBy: req.auth._id })//returning posts only by the logged in user

    let user = await User.findById(req.auth._id);
    let following = user.following;

    if (following) {
      following.push(user._id);
      const posts = await Post.find({
        postedBy: { $in: following },
      });
      //console.log(posts.length);
      return res.json(posts.length);
    }
    if (!following) {
      const posts = await Post.find({
        postedBy: req.auth._id,
      });
      return res.json(posts.length);
    }
  } catch (err) {
    console.log(err);
  }
};
const totalPostsDashboard = async (req, res) => {
  try {
    //returning posts only by the logged in user
    //const posts = await Post.find() //returning all posts
    const posts = await Post.find({
      postedBy: req.auth._id,
    });

    return res.json(posts.length);
  } catch (err) {
    console.log(err);
  }
};

const fetchFriendPosts = async (req, res) => {
  try {
    const { id } = req.body.id;
    console.log(req.body.id);
    const currentPage = req.params.page || 1;
    const perPage = 5;
    //returning posts only by the logged in user
    //const posts = await Post.find() //returning all posts
    const user = await User.findById(req.auth._id);
    const following = user.following;
    let count = 0;
    if (following.length > 0) {
      for (let i = 0; i < following.length; i++) {
        if (following[i] == req.body.id) {
          const posts = await Post.find({ postedBy: req.body.id })
            .skip((currentPage - 1) * perPage)
            .populate("postedBy", "_id name photo")
            .populate("comments.postedBy", "_id name photo")
            .sort({ createdAt: -1 })
            .limit(perPage);
          count = 1;
          //console.log(posts);
          return res.json(posts);
        }
      }
    }
    if (!following || count === 0) {
      return res.json([]);
    }
  } catch (err) {
    console.log(err);
  }
};
const totalPostsFriend = async (req, res) => {
  try {
    //returning posts only by the logged in user
    //const posts = await Post.find() //returning all posts
    const posts = await Post.find({
      postedBy: req.body.id,
    });

    return res.json(posts.length);
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  createPost,
  uploadImage,
  postByUser,
  postByLoggedInUser,
  userPost,
  clearImage,
  userPostUpdate,
  userPostDelete,
  likePost,
  addComment,
  removeComment,
  totalPostsHome,
  totalPostsDashboard,
  totalPostsFriend,
  fetchFriendPosts,
};
