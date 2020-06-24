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
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Course",
        },
    ],
    //rest should be private information
    //pending information like credentials etc
});

module.exports = mongoose.model("Student", studentSchema);