const express = require("express");
const data = require("../controllers/auth");
const router = express.Router();
router.post("/register", data);
module.exports = router;
