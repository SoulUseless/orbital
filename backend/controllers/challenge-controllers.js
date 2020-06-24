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
                tier: challenge.course.tier,
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
            requirements: challenge.requirements, //to be populated to show more information
            requiredFor: challenge.requiredFor,
            taskDescription: challenge.taskDescription,
            tier: challenge.course.tier,
            url: challenge.course.language.logo,
            testCases: challenge.testCases,
            //course: challenge.course
            //add course here also? -- see if needed can just un-comment
        };
        res.json(challengeOutput);
        return;
    } else {
        next(new HttpError("Challenge not found", 404));
        return;
    }   
}

exports.getAllChallenges = getAllChallenges;
exports.getChallengeById = getChallengeById;