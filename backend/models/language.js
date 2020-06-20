const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const languageSchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true }, //should be url
});

module.exports = mongoose.model("Language", languageSchema);