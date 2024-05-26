const express = require("express");

const { Router } = express;
const router = new Router();

const user = require("./user");
const session = require("./session");
const shifts = require("./shifts");
const provider = require("./provider");

router.use("/api/users", user);
router.use("/api/sessions", session);
router.use("/api/shifts", shifts);
router.use("/api/provider", provider);

module.exports = router;
