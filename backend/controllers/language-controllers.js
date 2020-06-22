const HttpError = require("../models/http-error");
const Language = require("../models/language");

const getAllLanguages = async (req, res, next) => {
    let languages;
    try {
        languages = await Language.find({});
    } catch (err) {
        //console.log(err);
        next(new HttpError("database access error", 500));
        return;
    }

    //const users = User.find()
    res.status(200).json({
        languages: languages.map((language) => language.toObject({ getters: true })),
    });
};

exports.getAllLanguages = getAllLanguages;