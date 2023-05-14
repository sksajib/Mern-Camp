const express = require("express");
const formidable = require("express-formidable");
const { createPost, uploadImage, postByUser } = require("../controllers/post");
const { requireSignin } = require("../Middlewares");
const router = express.Router();

router.post("/createPost", requireSignin, createPost);
router.post(
  "/uploadImage",
  requireSignin,
  formidable({ maxFileSize: 10 * 1024 * 1024 }),
  uploadImage
);
router.get("/user-posts", requireSignin, postByUser);
module.exports = router;
