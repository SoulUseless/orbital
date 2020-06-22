const HttpError = require("../models/http-error");

const Startup = require("../models/startup");
const Language = require("../models/language");
const Tier = require("../models/tier");
const Submission = require("../models/submission");
//const Challenge = require("../models/challenge");

const createNewLanguage = async (req, res, next) => {
    const { name, logo } = req.body;
    const newLanguage = new Language({ name, logo });
    try {
        await newLanguage.save();
        console.log("new language created successfully");
    } catch (err) {
        //console.log(err);
        next(new HttpError("failed to create new language"));
        return;
    }
    res.status(201).json({ language: newLanguage });
    return;
};

const createNewSubmission = async (req, res, next) => {

};

const createNewTier = async (req, res, next) => {
    const { name } = req.body;
    const newTier = new Tier({ name });
    try {
        await newTier.save();
        console.log("new language created successfully");
    } catch (err) {
        //console.log(err);
        next(new HttpError("failed to create new tier"));
        return;
    }
    res.status(201).json({ tier: newTier });
    return;
};

const linkSubmission  = async (req, res, next) => {

};

const createNewChallenge = async (req, res, next) => {

};

exports.createNewLanguage = createNewLanguage;
exports.createNewSubmission = createNewSubmission;
exports.createNewTier = createNewTier;
exports.linkSubmission = linkSubmission;
exports.createNewChallenge = createNewChallenge;