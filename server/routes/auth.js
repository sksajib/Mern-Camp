const express = require("express");
const {
  register,
  login,
  currentUser,
  forgotPassword,
  addPicture,
  updateProfile,
} = require("../controllers/auth");
const { requireSignin, canUpdateProfile } = require("../Middlewares");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/addPicture", requireSignin, addPicture);
router.post("/update-user", requireSignin, canUpdateProfile, updateProfile);
module.exports = router;
