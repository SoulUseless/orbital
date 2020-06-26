//file contains pure routing

const express = require('express');
//const { check } = require("express-validator");

const startupControllers = require('../controllers/startup-controllers');
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");
//can just export the router to app.js

const router = express.Router();

router.get("/:sid", startupControllers.getStartupById);

router.post("/login", startupControllers.startupLogin);

router.post(
    "/signup",
    fileUpload.single("image"),
    startupControllers.startupSignup
);

router.get("/", startupControllers.getAllStartups);

router.use(checkAuth);
//TODO verify token
router.post(
    "/:sid/update",
    fileUpload.single("image"),
    startupControllers.startupUpdate
);

module.exports = router;