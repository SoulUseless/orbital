const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    tier: { 
        type: mongoose.Types.ObjectId, 
        required: true, 
        ref: "Tier" 
    },
    language: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Language",
    },
    challenges: [
        { type: mongoose.Types.ObjectId, required: true, ref: "challenge" },
    ],
});

module.exports = mongoose.model("Course", courseSchema);