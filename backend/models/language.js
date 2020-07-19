const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const languageSchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true }, //should be url
    jdoodleName: { type: String, required: true },
    jdoodleVersion: { type: String, required: true },
    fileExtension: { type: String, required: true },
});

module.exports = mongoose.model("Language", languageSchema);