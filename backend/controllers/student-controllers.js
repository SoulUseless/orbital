const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Student = require("../models/student");
const startup = require("../models/startup");

const getAllStudents = async (req, res, next) => {
    let students;
    try {
        students = await Student.find({}, "-password");
        //either whitelist with <name>, or blacklist with "-<name>""
    } catch (err) {
        //console.log(err);
        next(new HttpError("database access error", 500));
        return;
    }

    //const users = User.find()
    res.status(200).json({
        students: students.map((student) => student.toObject({ getters: true })),
    });
};

const getStudentById = async (req, res, next) => {
    const studentId = req.params.sid;

    let student;
    try {
        student = await Student.findById(studentId).populate("challengeSubmissions credentials");
    } catch (err) {
        //console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }

    if (student) {
        res.json(student);
        return;
    } else {
        next(new HttpError("No such student found", 404));
        return;
    }
}; 

const getSubmissionsByStudentId = async (req, res, next) => {
    const studentId = req.params.sid;

    let student;
    try {
        student = await Student.findById(studentId);
    } catch (err) {
        // console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }

    if (student) {
        res.json(student.challengeSubmissions);
        return;
    } else {
        next(new HttpError("No such student found", 404));
    }
};

const getCredentialsByStudentId = async (req, res, next) => {
    const studentId = req.params.sid;

    let student;
    try {
        student = await Student.findById(studentId);
    } catch (err) {
        // console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }

    if (student) {
        res.json(student.credentials); //check whether need to run .populate() or not
        return;
    } else {
        next(new HttpError("No such student found", 404));
    }
};

const studentLogin = async (req, res, next) => {
    const { email, password } = req.body;

    let student;
    try {
        student = await Student.findOne({email});
    } catch (err) {
        next(new HttpError("log in failed", 500));
        return;
    }

    if (student) {
        let isValidPassword = false;
        try {
            isValidPassword = await bcryptjs.compare(password, student.password);
        } catch (err) {
            // console.log(err);
            next(new HttpError("unknown log in error", 500));
            return;
        }

        if (isValidPassword) {
            // creating a token
            let token;
            try {
                token = jwt.sign(
                    {
                        userId: student.id,
                        email: student.email,
                        userType: "student",
                    },
                    process.env.JWT_SECRET, // server private key --> NOT TO BE SHARED
                    { expiresIn: "1h" } // can set self-destruction of the token to prevent token stealing also
                );
            } catch (err) {
                //console.log(err);
                next(new HttpError("sign in failed", 500));
                return;
            }

            res.status(200).json({
                message: "login success",
                userId: startup.id,
                email: startup.email, //other information up to us
                token: token, //impt to return token
            });

        } else {
            next(new HttpError("Password is incorrect", 403));
            return;
        }
    } else {
        next(new HttpError("Username is incorrect", 403));
        return;
    }
};

const studentSignup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log(errors);
        next(new HttpError("Invalid input detected", 422));
        return;
    }
    const { name, email, password } = req.body;

    let existingStudent;
    try {
        existingStudent = await Student.findOne({email});
    } catch (err) {
        //console.log(err);
        next(new HttpError("Failed to access database", 500));
        return;
    }

    if (existingStudent) {
        next(new HttpError("User already exists, log in instead", 422));
        return;
    }

    let hashedPassword;
    try {
        hashedPassword = await bcryptjs.hash(password, 12); //returns a promise
    } catch (err) {
        //console.log(err);
        next(new HttpError("Could not create user", 500));
        return;
    }

    const createdStudent = new Student({
        name,
        profilePicture: "", //should be url
        profileDescription: "",
        challengeSubmissions: [],
        email,
        password: hashedPassword,
        credentials: [],
        completedChallenges: [],
        completedStartupChallenges: [],
    });

    try {
        await createdStudent.save();
        console.log("new student created successfully");
    } catch (err) {
        //console.log(err);
        next(new HttpError("failed to create new user"));
        return;
    }

    // creating a token
    let token;
    try {
        token = jwt.sign(
            {
                userId: createdStudent.id,
                email: createdStudent.email,
                userType: "student",
            },
            process.env.JWT_SECRET, // server private key --> NOT TO BE SHARED
            { expiresIn: "1h" } // can set self-destruction of the token to prevent token stealing also
        );
    } catch (err) {
        //console.log(err);
        next(new HttpError("sign up failed", 500));
        return;
    }

    res.status(201).json({
        userId: createdStudent.id,
        email: createdStudent.email, //other information up to us
        token: token, //impt to return token
    });
};

const studentUpdate = async (req, res, next) => {
    errors = validationResult(req);
    const studentCredentials = req.userData.userId;
    const studentId = req.params.sid;

    if (studentId !== studentCredentials) {
        next(new HttpError("You are not allowed to update this page", 401));
        return;
    }

    if (! errors.isEmpty()) {
        //console.log(errors);
        return next(new HttpError("Invalid Inputs detected", 422));
    }

    let student;
    try {
        student = await Student.findById(studentId);
    } catch (err) {
        //console.log(err);
        next(new HttpError("Startup query failed", 500));
        return;
    }

    const {name, profilePicture, profileDescription, email, password} = req.body;
    if (student) {
        student.name = name;
        student.profileDescription = profileDescription;
        student.profilePicture = profilePicture;
        student.email = email;

        try {
            const noPasswordChange = await bcryptjs.compare(password, student.password);
            if (!noPasswordChange) {
                const newHashedPassword = await bcryptjs.hash(password, 12);
                student.password = newHashedPassword;
            }
        } catch (err) {
            // console.log(err);
            next(new HttpError("unknown error", 500));
            return;
        }

        try {
            await student.save();
        } catch (err) {
            //console.log(err);
            next(new HttpError("Update failed", 500));
            return;
        }

        res.status(200).json({
            student: student.toObject({ getters: true }),
        });
    } else {
        next(new HttpError("No Such Student Found", 404));
        return;
    }
};

exports.getAllStudents = getAllStudents;
exports.getStudentById = getStudentById;
exports.getSubmissionsByStudentId = getSubmissionsByStudentId;
exports.getCredentialsByStudentId = getCredentialsByStudentId;
exports.studentLogin = studentLogin;
exports.studentSignup = studentSignup;
exports.studentUpdate = studentUpdate;