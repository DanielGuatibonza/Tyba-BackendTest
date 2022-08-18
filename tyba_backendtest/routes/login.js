const express = require("express");
const { login } = require("../jwt/handler");
const router = express.Router();

router.post("/", login);

module.exports = router;
