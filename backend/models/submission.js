const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    file: { type: String, required: true }, //should be url, pending expansion of functionality
    owner: { type: mongoose.Types.ObjectId, required: true, ref: "Student" },
    success: { type: Boolean, required: true } //keep track whether submission is correct without recompiling
});

module.exports = mongoose.model("Submission", submissionSchema);