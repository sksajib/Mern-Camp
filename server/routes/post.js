const express = require("express");
const formidable = require("express-formidable");
const {
  createPost,
  uploadImage,
  postByUser,
  postByLoggedInUser,
  userPost,
  clearImage,
  userPostUpdate,
  userPostDelete,
} = require("../controllers/post");
const { requireSignin, canEditDelete } = require("../Middlewares");
const router = express.Router();

router.post("/createPost", requireSignin, createPost);
router.post(
  "/uploadImage",
  requireSignin,
  formidable({ maxFileSize: 10 * 1024 * 1024 }),
  uploadImage
);
router.get("/user-posts", requireSignin, postByUser);
router.get("/user-posts-loggedin", requireSignin, postByLoggedInUser);
router.get(`/user-post/:_id`, requireSignin, userPost);
router.post("/clear-photo/:_id", requireSignin, canEditDelete, clearImage);
router.post(`/post-update/:_id`, requireSignin, canEditDelete, userPostUpdate);
router.delete(
  `/delete-post/:_id`,
  requireSignin,
  canEditDelete,
  userPostDelete
);

module.exports = router;
