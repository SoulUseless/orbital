const mongoose = require("mongoose");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const HttpError = require("../models/http-error");
const Challenge = require("../models/challenge");
const Student = require("../models/student");
const Submission = require("../models/submission");

const TestCaseAdder = require("../util/testCaseAdder");

const getAllChallenges = async (req, res, next) => {
    let challenges;
    try {
        challenges = await Challenge.find({}).populate([
            {
                path: "course",
                populate: {
                    path: "language tier",
                },
            },
            { path: "requirements requiredFor" },
        ]);
    } catch (err) {
        console.log(err);
        next(new HttpError("database access error", 500));
        return;
    }
    //console.log(challenges);
    res.status(200).json({
        challenges: challenges.map( challenge => {
            return {
                id: challenge._id,
                name: challenge.name,
                description: challenge.description,
                language: challenge.course.language.name,
                requirements: challenge.requirements, //to be populated to show more information
                requiredFor: challenge.requiredFor,
                taskDescription: challenge.taskDescription,
                tier: challenge.course.tier.name,
                url: challenge.course.language.logo,
                testCases: challenge.testCases,
                //course: challenge.course,
                //add course here also? -- see if needed can just un-comment
            };
        }),
    });
};

const getChallengeById = async (req, res, next) => {
    const challengeId = req.params.cid;
    let challenge;
    try {
        challenge = await Challenge.findById(challengeId).populate([
            {
                path: "course",
                populate: {
                    path: "language tier",
                },
            },
            { path: "requirements requiredFor" },
        ]);
    } catch (err) {
        //console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }

    //json is automatically sent back
    if (challenge) {
        const challengeOutput = {
            id: challenge._id,
            name: challenge.name,
            description: challenge.description,
            language: challenge.course.language.name,
            languageExtension: challenge.course.language.fileExtension,
            requirements: challenge.requirements, //to be populated to show more information
            requiredFor: challenge.requiredFor,
            taskDescription: challenge.taskDescription,
            tier: challenge.course.tier,
            url: challenge.course.language.logo,
            testCases: challenge.testCases,
            //course: challenge.course
            //add course here also? -- see if needed can just un-comment
        };
        res.json({challenge: challengeOutput});
        return;
    } else {
        next(new HttpError("Challenge not found", 404));
        return;
    }   
};


const uploadSubmissionById = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    const user = req.userData;
    if (user.userType != "student") {
        return next(new HttpError("You do not have permissions to upload submissions", 401));
    }

    const file = req.file;
    const filePath = req.file.path;

    //console.log(file);
    //console.log(challenge.course.language);
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

            const challengeId = req.params.cid;
            let challenge;
            try {
                challenge = await Challenge.findById(challengeId).populate({
                    path: "course",
                    populate: {
                        path: "language tier",
                    },
                });
                //pending population when startup is developed
            } catch (err) {
                //console.log(err);
                next( new HttpError("Database error", 500));
                return;
            }

            if (!challenge) {
                return next(new HttpError("No such challenge found", 404));
            }

            //check if student has completed pre-requisites
            let completedPrerequisites = true;
            //console.log(student.completedChallenges);
            //console.log(challenge.requirements);
            for (let i = 0; i < challenge.requirements.length; i++) {
                if (!student.completedChallenges.includes(challenge.requirements[i])){
                    completedPrerequisites = false;
                }
            }

            if (!completedPrerequisites) {
                return next(new HttpError("You have not completed the prerequisite challenges", 401));
            }

            if (challenge.course.language.name === "java" && data.includes("public static void main")) {
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

            try {
                //console.log(TestCaseAdder.addTestCase(challenge.course.language.name, data, challenge.testCases));
                const response = await axios({ //sending the file to axios
                    method: 'post',
                    url: 'https://api.jdoodle.com/v1/execute',
                    data: {
                        script: TestCaseAdder.addTestCase(challenge.course.language.name, data, challenge.testCases),
                        language: challenge.course.language.jdoodleName,
                        versionIndex: challenge.course.language.jdoodleVersion,
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
                    student.completedChallenges.push(challenge);
                    //check if course is completed
                    let completedCourse = true;
                    for (let i = 0; i < challenge.course.challenges.length; i++) {
                        if (!student.completedChallenges.includes(challenge.course.challenges[i])){
                            completedCourse = false;
                        }
                    }
                    //console.log(challenge.course);
                    if (completedCourse && !student.credentials.includes(challenge.course)) {
                        student.credentials.push(challenge.course);
                    } else {
                        completedCourse = false;
                        //flips this in the case that it includes
                        //useful for subsequent lines
                    }
            
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
                    if (completedCourse) {
                        return res.json({
                            message: `Submission Success\n Congratulations you have completed: ${challenge.course.language.name} - ${challenge.course.tier.name}`,
                        });
                    }
                    return res.json({message: "Submission Success"});
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
    })
};


exports.getAllChallenges = getAllChallenges;
exports.getChallengeById = getChallengeById;
exports.uploadSubmissionById = uploadSubmissionById;