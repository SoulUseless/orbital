const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const HttpError = require("../models/http-error");
const StartupChallenge = require("../models/startupChallenge");
const Startup = require("../models/startup");
const Student = require("../models/student");
const Submission = require("../models/submission");
const Language = require("../models/language");
const Tier = require("../models/tier");
const Course = require("../models/course");
const TestCaseAdder = require("../util/testCaseAdder");

async function asyncMap(array, callback) {
    let result = [];
    for (let index = 0; index < array.length; index++) {
        const newElement = await callback(array[index], index, array);
        result.push(newElement);
    }
    return result;
}

const getAllChallenge = async (req, res, next) => {
    let startupChallenges;
    try {
        startupChallenges = await StartupChallenge.find({}).populate([
            { path: "owner" },
            { path: "requirements", populate: { path: "language tier" } },
        ]);
    } catch (err) {
        //console.log(err);
        next(new HttpError("database access error", 500));
        return;
    }

    //const users = User.find()
    res.status(200).json({
        startupChallenges: startupChallenges.map((c) => c.toObject({ getters: true })),
    });
};

const getChallengeById = async (req, res, next) => {
    //console.log(req.params);
    const challengeId = req.params.cid; 
    let challenge;
    try {
        challenge = await StartupChallenge.findById(challengeId).populate([
            { path: "owner" },
            { path: "requirements", populate: { path: "language tier" } },
        ]);
    } catch (err) {
        console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }

    //json is automatically sent back
    if (challenge) {
        res.json({challenge: challenge});
        //convert the object from mongoose object to js object
        //getters: true converts fields into strings
        return;
    } else {
        next(new HttpError("Challenge not found", 404));
        return;
        /*
        res.status(404).json({ message: "place not found" }); //default is 200: success
        //can method chain to send responses 
        */
    }   
}

const getChallengeByStartup = async (req, res, next) => {
    const startupId = req.params.sid;

    let startupWithChallenges;
    let challenges;
    try {
        startupWithChallenges = await Startup.findById(startupId).populate("challenges");
        challenges = startupWithChallenges.challenges;
    } catch (err) {
        //console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }
  
    if ( challenges && challenges.length > 0) {
    //if (userWithPlaces && userWithPlaces.places.length > 0) {
        res.json({
            //places: userWithPlaces.places.map((place) => place.toObject({ getters: true }))
            challenges: challenges
        });
        return;
    } else {
        next(new HttpError("Startup has no places", 404));
        return;
    }
}

const createStartupChallenge = async (req, res, next) => {
    const errors = validationResult(req);

    if (req.userData.userType != "startup") {
        next(new HttpError("Invalid Credentials", 422));
    }

    //console.log(req.body);
    //CONVERT REQUIREMENTS TO COURSES FOR BACKEND STORAGE
    let courses = await asyncMap(req.body.requirements, async (req) => {
        const { language, tier } = req;
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

        //console.log(language);
        //console.log(tier);
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
                return existingCourse;
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
                return newCourse;
            } catch (err) {
                console.log(err);
                next (new HttpError("Commit Failed", 500));
                return;
            }
        } else {
            return next (new HttpError("Database Corrupted", 500));
        }
    });

    if (errors.isEmpty()) {
        //owner to be replaced by token retrieval
        const userData = req.userData;
        const {name, description, taskDescription, testCases} = req.body;
        const createdChallenge = new StartupChallenge({
            name,
            owner: userData.userId, 
            description,
            requirements: courses,
            taskDescription,
            testCases,
            submissions: []
        });

        let startup;
        try {
            startup = await Startup.findById(userData.userId); //owner to be replaced with token retrieval
        } catch (err) {
            //console.log(err);
            next(new HttpError("database error", 500));
            return; 
        }

        if (!startup) {
            return next(new HttpError("indicated creator user not found", 404));
        }

        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            await createdChallenge.save({ session });
            startup.challenges.push(createdChallenge);
            await startup.save({ session }); 
            await session.commitTransaction();
            //console.log("success");
        } catch (err) {
            console.log(err);
            next (new HttpError("Commit Failed", 500));
            return;
        }
        res.status(201); //code represents something new created on server
        return res.json({ message: "creation of new challenge success", challenge: createdChallenge });
    } else {
        console.log(errors);
        next(HttpError("Invalid Inputs Detected", 422));
        return;
    }
}

const updateStartupChallengeById = async (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError("Invalid Inputs detected", 422));
    }

    const startupId = req.userData.userId;
    //CONVERT REQUIREMENTS TO COURSES FOR BACKEND STORAGE
    let courses = await asyncMap(req.body.requirements, async (req) => {
        const { language, tier } = req;
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

        console.log(language);
        console.log(tier);
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
                return existingCourse;
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
                return newCourse;
            } catch (err) {
                console.log(err);
                next (new HttpError("Commit Failed", 500));
                return;
            }
        } else {
            return next(new HttpError("Database Corrupted", 500));
        }
    });
    
    const challengeId = req.params.cid;

    let challenge;
    try {
        challenge = await StartupChallenge.findById(challengeId);
    } catch (err) {
        console.log(err);
        next(new HttpError("Challenge query failed", 500));
        return;
    }

    //run simple startupid check
    //console.log(challenge.owner.toString());
    //console.log(startupId);
    if (challenge.owner.toString() !== startupId) {
        next(new HttpError("You are not allowed to update this", 401));
        return;
    }

    const {name, description, taskDescription, testCases} = req.body;
    if (challenge) {
        challenge.name = name;
        challenge.description = description;
        challenge.requirements = courses;
        challenge.taskDescription = taskDescription;
        challenge.testCases = testCases;

        try {
            await challenge.save();
        } catch (err) {
            console.log(err);
            next(new HttpError("Update failed", 500));
            return;
        }

        res.status(200).json({
            challenge: challenge.toObject({ getters: true }),
        });
    } else {
        next(new HttpError("No Such Challenge Found", 404));
        return;
    }
};

const deleteStartupChallengeById = async (req, res, next) => {
    const challengeId = req.params.cid;
    
    const startupId = req.userData.userId;

    let challenge;
    try {
        challenge = await StartupChallenge.findById(challengeId).populate("owner");
    } catch (err) {
        console.log(err);
        next( new HttpError("Database error", 500));
        return;
    }

    if (!challenge) {
        return next(new HttpError("Search failed, nothing to delete", 404));
    }

    //run simple startupid check
    //console.log(challenge.owner._id.toString());
    //console.log(startupId);
    if (challenge.owner._id.toString() !== startupId) {
        next(new HttpError("You are not allowed to delete this", 401));
        return;
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await challenge.remove({session});

        //remove the challenge from the relevant startup also
        challenge.owner.challenges.pull(challenge);
        await challenge.owner.save({session});
        
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        next(new HttpError("Deletion Failed", 500));
        return;
    }

    res.status(200).json({message: "Successfully Deleted. "});
};

const getSubmissionsById = async (req, res, next) => {
    const challengeId = req.params.cid;
    
    const startupId = req.userData.userId;

    let challenge;
    try {
        challenge = await StartupChallenge.findById(challengeId).populate({
            path: "submissions",
            populate: { path: "owner" },
        });
        //pending population when startup is developed
    } catch (err) {
        console.log(err);
        next( new HttpError("Database error", 500));
        return;
    }

    //console.log(challenge.owner);
    if (challenge.owner.toString() !== startupId) {
        next(new HttpError("You are not allowed to access this information", 401));
        return;
    }

    if (!challenge) {
        return next(new HttpError("Search failed, nothing to delete", 404));
    }
    res.json(challenge.submissions);
    //res.json({ place: place.toObject({ getters: true }) }); // => { place } === { place: place }

    //convert the object from mongoose object to js object
    //getters: true converts fields into strings
    return;
};

const uploadSubmissionById = async (req, res, next) => {
    const user = req.userData;
    if (req.method === "OPTIONS") {
        return next();
    }

    if (user.userType != "student") {
        return next(new HttpError("You do not have permissions to upload submissions", 401));
    }

    const file = req.file;
    const filePath = req.file.path;

    fs.readFile(path.join(__dirname, "/../", filePath), "utf-8", async (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const studentId = user.userId;
            let student;
            try {
                student = await Student.findById(studentId);
            } catch (err) {
                //console.log(err);
                next( new HttpError("Database error", 500));
                return;
            }

            //main difference with challenge => process using the file extension instead of challenge language
            const fileExt = "." + file.originalname.split(".")[1];
            //console.log(fileExt);
            let fileLang;
            try {
                fileLang = await Language.find({fileExtension: fileExt});
                fileLang = fileLang[0];
            } catch (err) {
                next( new HttpError("Database error", 500));
                return;
            }
            if (!fileLang) {
                next(new HttpError("Invalid File Extension", 422));
                return;
            }
            //console.log(fileLang);

            const challengeId = req.params.cid;
            let challenge;
            try {
                challenge = await StartupChallenge.findById(
                    challengeId
                ).populate({
                    path: "requirements",
                    populate: { path: "language" },
                });
            } catch (err) {
                //console.log(err);
                next( new HttpError("Database error", 500));
                return;
            }

            if (!challenge) {
                return next(new HttpError("No such challenge found", 404));
            }
            
            if (challenge.requirements.map(x => x.language._id).includes(fileLang._id)) {
                return next(new HttpError("Invalid File uploaded", 422));
            }

            let completedPrerequisites = true;
            //check if credentials are satisfied

            if (!completedPrerequisites) {
                return next(new HttpError("You have not obtained the pre-requisite credentials", 401));
            }

            if (fileLang.name === "java" && data.includes("public static void main")) {
                next(new HttpError("Please do not include main() function inside your class"), 400);
            }

            const newSubmission = new Submission({
                file: filePath,
                owner: studentId,
                success: false
            });

            try {
                const session = await mongoose.startSession();
                session.startTransaction();
                await newSubmission.save({session});

                student.challengeSubmissions.push(newSubmission);
                await student.save({ session });
                
                challenge.submissions.push(newSubmission);
                await challenge.save({ session });
                await session.commitTransaction();
            } catch (err) {
                console.log(err);
                next(new HttpError("Something went wrong during uploading, please try again", 500));
                return;
            }
            //console.log(fileLang);
            try {
                //console.log(TestCaseAdder.addTestCase(fileLang.name, data, challenge.testCases));
                const response = await axios({ //sending the file to axios
                    method: 'post',
                    url: 'https://api.jdoodle.com/v1/execute',
                    data: {
                        script: TestCaseAdder.addTestCase(fileLang.name, data, challenge.testCases),
                        language: fileLang.jdoodleName,
                        versionIndex: fileLang.jdoodleVersion,
                        clientId: process.env.JDOODLE_ID,
                        clientSecret: process.env.JDOODLE_SECRET
                    }
                });

                //console.log(response.data);
                //console.log(challenge.testCases);

                //runs checks if there is any errors while running -> breaks out of whole function
                //can be bypassed tbh, if "error" is purposely printed
                if (response.data.output.includes("Error") ||response.data.output.includes("error")) {
                    return res.json({message: "Error in Code \n " + response.data.output});
                }

                //sliced in a way to prevent workarounds by printing
                const testCaseChecks = response.data.output //processes the outputs
                    .slice(0, -1)
                    .split("\n")
                    .slice(-challenge.testCases.publicTestCases.length-challenge.testCases.privateTestCases.length);

                //to catch if somehow length is different
                if (testCaseChecks.length != challenge.testCases.publicTestCases.length + challenge.testCases.privateTestCases.length) {
                    next(new HttpError("Something went wrong during uploading, please try again", 500));
                    return;
                }

                let isSuccess = true;

                let publicMistakes = [];
                let privateMistakes = false;
                let index = 0;
                //check which test case failed, or passed
                while (index < testCaseChecks.length) {
                    if (index < challenge.testCases.publicTestCases.length) {
                        if (testCaseChecks[index] === "False" || testCaseChecks[index] === "false") {
                            isSuccess = false;
                            publicMistakes.push(challenge.testCases.publicTestCases[index]);
                        }
                    } else {
                        if (testCaseChecks[index] === "False" || testCaseChecks[index] === "false") {
                            isSuccess = false;
                            privateMistakes = true;
                        }
                    }
                    index += 1;
                }                
                
                if (isSuccess) {
                    //update all relevant information
                    newSubmission.success = true;
                    student.completedStartupChallenges.push(challenge);
                    try {
                        const session = await mongoose.startSession();
                        session.startTransaction();
                        await newSubmission.save({session});
                        await student.save({ session });
                        await session.commitTransaction();
                    } catch (err) {
                        console.log(err);
                        next(new HttpError("Something went wrong during uploading, please try again", 500));
                        return;
                    }
                    return res.json({message: "submission success"});
                }                
                
                let message = "Submitted, but incorrect\n\n";
                if (publicMistakes.length > 0) {
                    message += "You have failed the following public test cases: \n"
                    message += publicMistakes.map(x => "Input: " + x.input + "Output: " + x.output + "\n");
                } 
                if (privateMistakes) {
                    message += "You have failed some private test cases"
                }
                return res.json({message: message});

            } catch (err) {
                console.log(err);
            }
            
        }
    });
};

exports.getChallengeById = getChallengeById;
exports.getChallengeByStartup = getChallengeByStartup;
exports.createStartupChallenge = createStartupChallenge;
exports.updateStartupChallengeById = updateStartupChallengeById;
exports.deleteStartupChallengeById = deleteStartupChallengeById;
exports.getSubmissionsById = getSubmissionsById;
exports.getAllChallenge = getAllChallenge;
exports.uploadSubmissionById = uploadSubmissionById;