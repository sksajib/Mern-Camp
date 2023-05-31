const express = require("express");
const {
  sendOtp,
  register,
  login,
  currentUser,
  forgotPassword,
  addPicture,
  updateProfile,
  findPeople,
  sentRequest,
  findSentRequest,
  cancelRequest,
  findRequest,

  acceptRequest,
  deleteRequest,
  findFollowing,
  findFollowingAll,
  unfollowPeople,
  searchUser,
  fetchPrivateProfile,
  addInactive,
  deleteInactive,
  fetchActiveStatus,
  findActiveFriends,
} = require("../controllers/auth");
const { requireSignin, canUpdateProfile } = require("../Middlewares");
const router = express.Router();
router.post("/send-otp", sendOtp);
router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/addPicture", requireSignin, addPicture);
router.post("/update-user", requireSignin, canUpdateProfile, updateProfile);
router.get("/find-people", requireSignin, findPeople);
router.put("/send-request", requireSignin, canUpdateProfile, sentRequest);
router.get("/find-Sent-Request", requireSignin, findSentRequest);
router.put(
  "/send-request-people",
  requireSignin,
  canUpdateProfile,
  cancelRequest
);
router.get("/find-Received-Request", requireSignin, findRequest);

router.put(
  "/accept-request-people",
  requireSignin,
  canUpdateProfile,
  acceptRequest
);
router.put(
  "/delete-request-people",
  requireSignin,
  canUpdateProfile,
  deleteRequest
);
router.get("/find-following", requireSignin, findFollowing);
router.get("/find-following-all", requireSignin, findFollowingAll);
router.put("/unfollow-people", requireSignin, canUpdateProfile, unfollowPeople);
router.get("/search-user/:query", searchUser);
router.get("/fetch-private-profile/:_id", requireSignin, fetchPrivateProfile);
router.post("/add-inactive-time", requireSignin, addInactive);
router.post("/delete-inactive-time", deleteInactive);
router.get("/fetch-active-status/:_id", requireSignin, fetchActiveStatus);
router.get("/find-active-friends", requireSignin, findActiveFriends);
module.exports = router;
