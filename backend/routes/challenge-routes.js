const express = require('express');

const challengeControllers = require('../controllers/challenge-controllers');
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", challengeControllers.getAllChallenges);

router.get("/:cid", challengeControllers.getChallengeById);

router.use(checkAuth);

router.use(
    "/submissions/:cid/",
    fileUpload("submission").single("submission"),
    challengeControllers.uploadSubmissionById
); 
//going to have middleware for fileUpload

module.exports = router;


