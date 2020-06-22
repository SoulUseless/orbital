const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const Startup = require("../models/startup");
const Language = require("../models/language");
const Tier = require("../models/tier");
const Submission = require("../models/submission");
const Course = require("../models/course");
const Challenge = require("../models/challenge");

const createNewLanguage = async (req, res, next) => {
    const { name, logo } = req.body;
    const newLanguage = new Language({ name, logo });
    try {
        await newLanguage.save();
        console.log("new language created successfully");
    } catch (err) {
        //console.log(err);
        next(new HttpError("failed to create new language"));
        return;
    }
    res.status(201).json({ language: newLanguage });
    return;
};

const createNewSubmission = async (req, res, next) => {

};

const createNewTier = async (req, res, next) => {
    const { name } = req.body;
    const newTier = new Tier({ name });
    try {
        await newTier.save();
        console.log("new language created successfully");
    } catch (err) {
        //console.log(err);
        next(new HttpError("failed to create new tier"));
        return;
    }
    res.status(201).json({ tier: newTier });
    return;
};

const linkSubmission  = async (req, res, next) => {

};

const createNewChallenge = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const {name, description, requirements, requiredFor, course, taskDescription, testCases} = req.body;
        const createdChallenge = new Challenge({
            name,
            description, 
            requirements,
            requiredFor,
            course,
            taskDescription,
            testCases,
            submissions: []
        });
        
        //find course so that it can be updated also
        let courseObject;
        try {
            courseObject = await Course.findById(course); //owner to be replaced with token retrieval
        } catch (err) {
            //console.log(err);
            next(new HttpError("database error", 500));
            return; 
        }

        if (!courseObject) {
            return next(new HttpError("indicated course not found", 404));
        }

        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            await createdChallenge.save({ session });
            courseObject.challenges.push(createdChallenge);
            await courseObject.save({ session }); 
            await session.commitTransaction();
            //console.log("success");
        } catch (err) {
            console.log(err);
            next (new HttpError("Commit Failed", 500));
            return;
        }
        res.status(201); //code represents something new created on server
        return res.json({ challenge: createdChallenge });
    } else {
        console.log(errors);
        next(HttpError("Invalid Inputs Detected", 422));
        return;
    }

};

const updateChallenge = async (req, res, next) => {

};

const createNewCourse = async (req, res, next) => {
    const { language, tier } = req.body;

    let languageObject;
    let tierObject;
    try {
        languageObject = await Language.find({ name: language });
        tierObject = await Tier.find({ name: tier });
    } catch (err) {
        console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }

    if (languageObject && languageObject.length === 1 && tierObject && tierObject.length === 1) {

        //ensure no duplicate course
        let existingCourse;
        try {
            existingCourse = await Course.findOne({
                language: languageObject[0]._id.toString(),
                tier: tierObject[0]._id.toString(),
            });
        } catch (err) {
            //console.log(err);
            next(new HttpError("Failed to access database", 500));
            return;
        }

        if (existingCourse) {
            next(new HttpError("Course already exists, no need to create", 422));
            return;
        }

        const newCourse = new Course({
            language: languageObject[0]._id.toString(),
            tier: tierObject[0]._id.toString(),
            challenges: [],
        });
        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            await newCourse.save({ session });
            await session.commitTransaction();
            //console.log("success");
        } catch (err) {
            console.log(err);
            next (new HttpError("Commit Failed", 500));
            return;
        }
        res.status(201); //code represents something new created on server
        return res.json({ course: newCourse });
    } else {
        next(new HttpError("One or more parameters is invalid. Try creating them first", 404));
        return;
    }

};

exports.createNewLanguage = createNewLanguage;
exports.createNewSubmission = createNewSubmission;
exports.createNewTier = createNewTier;
exports.linkSubmission = linkSubmission;
exports.createNewChallenge = createNewChallenge;
exports.updateChallenge = updateChallenge;
exports.createNewCourse = createNewCourse;