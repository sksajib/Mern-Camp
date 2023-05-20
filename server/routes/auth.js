const express = require("express");
const {
  register,
  login,
  currentUser,
  forgotPassword,
  addPicture,
  updateProfile,
  findPeople,
  sentRequest,
} = require("../controllers/auth");
const { requireSignin, canUpdateProfile } = require("../Middlewares");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/addPicture", requireSignin, addPicture);
router.post("/update-user", requireSignin, canUpdateProfile, updateProfile);
router.get("/find-people", requireSignin, findPeople);
router.put("/send-request", requireSignin, canUpdateProfile, sentRequest);
module.exports = router;
