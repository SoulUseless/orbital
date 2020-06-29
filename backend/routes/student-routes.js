const express = require('express');
//const { check } = require("express-validator");

const studentControllers = require('../controllers/student-controllers');
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:sid/submissions", studentControllers.getSubmissionsByStudentId);

router.get("/:sid/credentials", studentControllers.getCredentialsByStudentId);

router.get("/:sid", studentControllers.getStudentById);

router.post("/login", studentControllers.studentLogin);

router.post(
    "/signup",
    fileUpload("images").single("image"),
    studentControllers.studentSignup
);

router.get("/", studentControllers.getAllStudents);

router.use(checkAuth);

router.patch(
    "/:sid",
    fileUpload("images").single("image"),
    studentControllers.studentUpdate
);

module.exports = router;