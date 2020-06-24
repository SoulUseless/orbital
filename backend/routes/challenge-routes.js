const express = require('express');

const challengeControllers = require('../controllers/challenge-controllers');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", challengeControllers.getAllChallenges);

router.get("/:cid", challengeControllers.getChallengeById);

router.use(checkAuth);

router.post("/:cid/submissions", challengeControllers.uploadSubmissionById); 
//going to have middleware for fileUpload

module.exports = router;


