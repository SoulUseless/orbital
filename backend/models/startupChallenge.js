const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const startupChallengeSchema = new Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Types.ObjectId, required: true, ref: "Startup" },
    description: { type: String, required: true },
    requirements: [
        {
            language: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Language",
            },
            level: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Tier",
            },
        },
    ],
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

module.exports = mongoose.model("StartupChallenge", startupChallengeSchema);