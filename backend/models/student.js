const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: { type: String, required: true },
    profilePicture: { type: String }, //should be url
    profileDescription: { type: String },
    challengeSubmissions: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Submission",
        },
    ],
    completedChallenges: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Challenge",
        },
    ],
    completedStartupChallenges: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "StartupChallenge",
        },
    ],
    email: { type: String, required: true, minlength: 6 },
    password: { type: String, required: true },
    credentials: [
        {
            langauge: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Language",
            },
            level: {
                //type: mongoose.Types.ObjectId, on hold when development
                type: String,
                required: true,
                //ref: "Tier",
            },
            //bronze, silver, gold
        },
    ],
    //rest should be private information
    //pending information like credentials etc
});

module.exports = mongoose.model("Student", studentSchema);