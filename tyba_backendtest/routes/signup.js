const express = require("express");
const { signup } = require("../jwt/handler");
const router = express.Router();

router.post("/", signup);

module.exports = router;
