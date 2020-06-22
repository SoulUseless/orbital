const express = require('express');
//const { check } = require("express-validator");

const studentControllers = require('../controllers/student-controllers');

const router = express.Router();

router.get("/:sid/submissions", studentControllers.getSubmissionsByStudentId);

router.get("/:sid/credentials", studentControllers.getCredentialsByStudentId);

router.get("/:sid", studentControllers.getStudentById);

router.post("/login", studentControllers.studentLogin);

router.post("/signup", studentControllers.studentSignup);

router.get("/", studentControllers.getAllStudents);

//TODO verify token
router.post("/:sid/update", studentControllers.studentUpdate);

module.exports = router;