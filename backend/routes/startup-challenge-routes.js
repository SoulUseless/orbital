//file contains pure routing

const express = require('express');
const { check } = require("express-validator");

const startupChallengeControllers = require('../controllers/startup-challenge-controller');
//can just export the router to app.js

const router = express.Router();

router.get("/all", startupChallengeControllers.getAllChallenge);

router.get("/:cid", startupChallengeControllers.getChallengeById); 

router.get("/startup/:sid", startupChallengeControllers.getChallengeByStartup);

//TODO: token check
//router.use(checkAuth);

router.get("/:cid/submissions", startupChallengeControllers.getSubmissionsById);

//TO DO
//router.post("/:cid/submissions", startupChallengeControllers.uploadSubmissionById)

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