const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const Startup = require("../models/startup");
const Language = require("../models/language");
const Tier = require("../models/tier");
const Submission = require("../models/submission");
const Course = require("../models/course");
const Challenge = require("../models/challenge");

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function asyncMap(array, callback) {
    let result = [];
    for (let index = 0; index < array.length; index++) {
        const newElement = await callback(array[index], index, array);
        result.push(newElement);
    }
    return result;
}

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

        let requirementChallenges;
        let requiredForChallenges;
        //populate first, make changes in transaction below
        try {
            requirementChallenges = await asyncMap(requirements, challengeId => {
                try {
                    return Challenge.findById(challengeId);
                } catch (err) {
                    //console.log(err);
                    throw new HttpError("Database query failed", 500);
                }
            });

            requiredForChallenges = await asyncMap(requiredFor, challengeId => {
                try {
                    return Challenge.findById(challengeId);
                } catch (err) {
                    //console.log(err);
                    throw new HttpError("Database query failed", 500);
                }
            });
        } catch (err) {
            return next(err);
        }

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

            await asyncForEach(requirementChallenges, async challenge => {
                challenge.requiredFor.push(createdChallenge);
                await challenge.save({session});
            });

            await asyncForEach(requiredForChallenges, async challenge => {
                challenge.requirements.push(createdChallenge);
                await challenge.save({session});
            });
        

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log(errors);
        return next(HttpError("Invalid Inputs detected", 422));
    }
    const challengeId = req.params.cid;
    let challenge;
    try {
        challenge = await Challenge.findById(challengeId).populate([
            { path: "course" },
            { path: "requirements" },
            { path: "requiredFor" },
        ]);
    } catch (err) {
        //console.log(err);
        next(new HttpError("Challenge query failed", 500));
        return;
    }

    if (challenge) {
        const {name, description, requirements, requiredFor, course, taskDescription, testCases} = req.body;
        //console.log(challenge);
        if (name) {
            challenge.name = name;
        }
        if (description) {
            challenge.description = description;
        }
        if (testCases) {
            challenge.testCases = testCases;
        }
        if (taskDescription) {
            challenge.taskDescription = taskDescription;
        }

        //these 3 needs special actions done to other challenges
        let oldRequirements = [...challenge.requirements];
        let requirementsChanged = false;
        let requirementObjects;
        if (requirements) {
            //remove this challenge from challenge.requirement's requiredFor
            //add this challenge to requirements's requiredFor
            requirementObjects = await asyncMap(requirements, challengeId => {
                try {
                    return Challenge.findById(challengeId);
                } catch (err) {
                    //console.log(err);
                    throw new HttpError("Database query failed", 500);
                }
            });
            requirementsChanged = true;
            challenge.requirements = requirements;
        }

        let oldRequiredFor = [...challenge.requiredFor];
        let requiredForChanged = false;
        let requiredForObjects;
        try {
            if (requiredFor) {
                requiredForObjects = await asyncMap(requiredFor, challengeId => {
                    try {
                        return Challenge.findById(challengeId);
                    } catch (err) {
                        //console.log(err);
                        throw new HttpError("Database query failed", 500);
                    }
                });
                requiredForChanged = true;
                challenge.requiredFor = requiredFor;
            }
        } catch (err) {
            //console.log(err);
            return next(err);
        }

        let oldCourse = challenge.course;
        let courseChanged = false;
        let courseObject;
        try {
            if (course) {
                try {
                    courseObject = await Course.findById(course);
                } catch (err) {
                    //console.log(err);
                    next(new HttpError("database error", 500));
                    return; 
                }

                if (!courseObject) {
                    return next(new HttpError("indicated course not found", 404));
                }
                courseChanged = true;
                challenge.course = course;
            }
        } catch (err) {
            return next(err);
        }

        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            await challenge.save({ session });

            if (courseChanged) {
                console.log(challenge.course);
                //update course
                courseObject.challenges.push(challenge);
                await courseObject.save({ session }); 
                oldCourse.challenges.pull(challenge);
                await oldCourse.save({ session });
            }

            if (requirementsChanged) {
                //update requirement
                //remove challenge from old req, then add challenge to new req
                await asyncForEach(oldRequirements, async (c) => {
                    c.requiredFor.pull(challenge);
                    await c.save({ session });
                });

                await asyncForEach(requirementObjects, async c => {
                    c.requiredFor.push(challenge);
                    await c.save({ session });
                });
            }

            if (requiredForChanged) {
                //update requiredFor
                //remove challenge from old req, then add challenge to new req
                await asyncForEach(oldRequiredFor, async c => {
                    c.requirements.pull(challenge);
                    await c.save({ session });
                });

                await asyncForEach(requiredForObjects, async c => {
                    c.requirements.push(challenge);
                    await c.save({ session });
                });

            }
        
            await session.commitTransaction();
            //console.log("success");
        } catch (err) {
            console.log(err);
            next (new HttpError("Commit Failed", 500));
            return;
        }
        res.status(201); //code represents something new created on server
        return res.json(challenge.toObject({ getters: true }));

    } else {
        return next(new HttpError("No such challenge", 404));
    }


};

const deleteChallenge = async (req, res, next) => {

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
//exports.updateChallengeTestCases = updateChallengeTestCases;
exports.deleteChallenge = deleteChallenge;