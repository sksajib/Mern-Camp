const express = require("express");
const {
  register,
  login,
  currentUser,
  forgotPassword,
  createPost,
} = require("../controllers/auth");
const { requireSignin } = require("../Middlewares");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);

module.exports = router;
