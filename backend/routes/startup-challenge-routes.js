//file contains pure routing

const express = require('express');
const { check } = require("express-validator");

const startupChallengeControllers = require('../controllers/startup-challenge-controller');
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/all", startupChallengeControllers.getAllChallenge);

router.get("/:cid", startupChallengeControllers.getChallengeById); 

router.get("/startup/:sid", startupChallengeControllers.getChallengeByStartup);

router.use(checkAuth);

router.get("/submissions/:cid", startupChallengeControllers.getSubmissionsById);

router.post("/submissions/:cid", 
    fileUpload("submission").single("submission"), 
    startupChallengeControllers.uploadSubmissionById); 
//going to have middleware for fileUpload

router.patch(
    "/:cid",
    [
        check("name").not().isEmpty(),
        check("description").not().isEmpty(),
        check("taskDescription").not().isEmpty(),
        check("requirements").not().isEmpty(),
        check("testCases").not().isEmpty(),
    ],
    startupChallengeControllers.updateStartupChallengeById
);

router.delete("/:cid", startupChallengeControllers.deleteStartupChallengeById);

router.post(
    "/new",
    [
        check("name").not().isEmpty(),
        check("description").not().isEmpty(),
        check("taskDescription").not().isEmpty(),
        check("requirements").not().isEmpty(),
        check("testCases").not().isEmpty(),
    ],
    startupChallengeControllers.createStartupChallenge
);

module.exports = router;