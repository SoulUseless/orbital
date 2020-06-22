const express = require('express');

const languageControllers = require('../controllers/language-controllers');

const router = express.Router();

router.get("/", languageControllers.getAllLanguages);

module.exports = router;