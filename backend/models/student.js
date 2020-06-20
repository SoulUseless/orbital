const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: { type: String, required: true },
    profilePicture: { type: String, required: true }, //should be url
    profile: { type: String, required: true },
    challengeSubmissions: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Submission",
        },
    ],
    email: { type: String, required: true, minlength: 6 },
    password: { type: String, required: true },
    
    //rest should be private information
    //pending information like credentials etc
});

module.exports = mongoose.model("Student", studentSchema);