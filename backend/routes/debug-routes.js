const express = require('express');

const debugControllers = require('../controllers/debug-controller');

const router = express.Router();

router.post("/language/new", debugControllers.createNewLanguage);

router.post("/submission/new", debugControllers.createNewSubmission);

router.post("/tier/new", debugControllers.createNewTier);

router.post("/submission/link", debugControllers.linkSubmission);

router.post("/challenge/new", debugControllers.createNewChallenge);

router.post("/challenge/:cid/update", debugControllers.updateChallenge);

router.post("/challenge/:cid/delete", debugControllers.deleteChallenge);

router.post("/course/new", debugControllers.createNewCourse)

module.exports = router;