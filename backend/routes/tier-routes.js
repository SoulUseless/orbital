const express = require('express');

const tierControllers = require('../controllers/tier-controllers');

const router = express.Router();

router.get("/", tierControllers.getAllTiers);

module.exports = router;