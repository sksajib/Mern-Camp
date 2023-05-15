const express = require("express");
const {
  register,
  login,
  currentUser,
  forgotPassword,
  addPicture,
  createPost,
} = require("../controllers/auth");
const { requireSignin } = require("../Middlewares");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/addPicture", requireSignin, addPicture);
module.exports = router;
