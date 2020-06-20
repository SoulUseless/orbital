const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tierSchema = new Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model("Tier", tierSchema);