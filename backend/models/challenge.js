/*
    [{
        id: string,
        name: string,
        description: string,
        requirements: array of challenge objects, //to be populated to show more information
        requiredFor: array of challenge objects,
        taskDescription: string,
        course: course object
        testCases: {
            publicTestCases: [{ input: string, output: string }],
            privateTestCases: [{ input: string, output: string}]
        },
    }]
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [
        {type: mongoose.Types.ObjectId, required: true, ref: "Challenge"}
    ],
    requiredFor: [
        {type: mongoose.Types.ObjectId, required: true, ref: "Challenge"}
    ],
    course: {type: mongoose.Types.ObjectId, required: true, ref: "Course"},
    taskDescription: { type: String, required: true },
    testCases: {
        publicTestCases: [
            {
                input: { type: String, required: true },
                output: { type: String, required: true },
            },
        ],
        privateTestCases: [
            {
                input: { type: String, required: true },
                output: { type: String, required: true },
            },
        ],
    },
    submissions: [{type:mongoose.Types.ObjectId, required: true, ref: "Submission"}]
});

module.exports = mongoose.model("Challenge", challengeSchema);