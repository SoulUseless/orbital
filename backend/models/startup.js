const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const startupSchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String }, //should be url
    description: { type: String },
    challenges: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "StartupChallenge",
        },
    ],
    //rest should be private information
    email: { type: String, required: true, minlength: 6 },
    password: { type: String, required: true },
});

module.exports = mongoose.model("Startup", startupSchema);