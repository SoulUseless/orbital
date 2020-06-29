const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const startupChallengeSchema = new Schema({
    name: { type: String, required: true },
    owner: { 
        type: mongoose.Types.ObjectId,
        required: true, 
        ref: "Startup" 
    },
    description: { type: String, required: true },
    requirements: [
        {type: mongoose.Types.ObjectId, required: true, ref: "Course"}
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