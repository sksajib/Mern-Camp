const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const { register, login, currentUser } = require("../controllers/auth");
const { requireSignin } = require("../Middlewares");
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignin, currentUser);

module.exports = router;
