//file contains pure routing

const express = require('express');
//const { check } = require("express-validator");

const startupControllers = require('../controllers/startup-controllers');
//can just export the router to app.js

const router = express.Router();

router.get("/:sid", startupControllers.getStartupById);

router.post("/login", startupControllers.startupLogin);

router.post("/signup", startupControllers.startupSignup);

router.get("/", startupControllers.getAllStartups);

//TODO verify token
router.post("/:sid/update", startupControllers.startupUpdate);

module.exports = router;