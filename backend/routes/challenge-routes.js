const express = require('express');

const challengeControllers = require('../controllers/challenge-controllers');

const router = express.Router();

router.get("/", challengeControllers.getAllChallenges);

router.get("/:cid", challengeControllers.getChallengeById);

module.exports = router;


