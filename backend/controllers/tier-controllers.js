const HttpError = require("../models/http-error");
const Tier = require("../models/tier");

const getAllTiers = async (req, res, next) => {
    let tiers;
    try {
        tiers = await Tier.find({});
    } catch (err) {
        //console.log(err);
        next(new HttpError("database access error", 500));
        return;
    }

    //const users = User.find()
    res.status(200).json({
        tiers: tiers.map((tier) => tier.toObject({ getters: true })),
    });
};

exports.getAllTiers = getAllTiers;