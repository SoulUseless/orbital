/* OUTPUT format

{
        id: "c1",
        name: "Factorial",
        description: "my first challenge",
        language: "javascript",
        requirements: ["c3", "c5"], //to be populated to show more information
        requiredFor: ["c2", "c4"],
        taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        tier: "bronze",
        url: "https://cdn.worldvectorlogo.com/logos/javascript.svg",
        testCases: {
            publicTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
            privateTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
        },
        //add course here also?
    },

*/

const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Challenge = require("../models/challenge");
const Student = require("../models/student");
const Submission = require("../models/submission");

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
    console.log(challenges);
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
    console.log("trig");
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
    const user = req.userData;
    if (user.userType != "student") {
        return next(new HttpError("You do not have permissions to upload submissions", 401));
    }

    const filePath = "haha.txt"; //DUMMY VARIABLE
    //const file = req.file;
    //const filePath = req.file.path;

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
        challenge = await Challenge.findById(challengeId).populate("course");
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

    //SEND THE FILE TO JDOODLE USING THEIR API TO RUN THE CODE
    /* sample json request -> needs axios integration i think
    {
        script : "", //script
        language: "php", //language
        versionIndex: "0", //language version
        clientId: ${process.env.JDOODLE_ID},
        clientSecret:${process.env.JDOODLE_SECRET}
    }

    send to:
    {
        url: 'https://api.jdoodle.com/v1/execute',
        method: "POST",
        json: program
    }

    sample responses 
        (success):
        {output, statusCode, memory, cpuTime}
        (error):
        {error, statusCode}
    */

    //DUMMY CHECKS
    const isSuccess = true;
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
        if (completedCourse) {
            student.credentials.push(challenge.course);
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
        return res.json({message: "submission success"});
    }
    //maybe send back data to be rendered on error page?
    return res.json({message: "Submitted, but incorrect"});
};

exports.getAllChallenges = getAllChallenges;
exports.getChallengeById = getChallengeById;
exports.uploadSubmissionById = uploadSubmissionById;