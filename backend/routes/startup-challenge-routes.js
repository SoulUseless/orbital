//file contains pure routing

const express = require('express');
//const { check } = require("express-validator");

const startupChallengeControllers = require('../controllers/startup-challenge-controller');
//can just export the router to app.js

const router = express.Router();

//filter here refers to relative path after being parsed from app.js
router.get("/:cid", startupChallengeControllers.getChallengeById); 

router.get("/startup/:sid", startupChallengeControllers.getChallengeByStartup);

router.post("/new", startupChallengeControllers.createStartupChallenge);

module.exports = router;