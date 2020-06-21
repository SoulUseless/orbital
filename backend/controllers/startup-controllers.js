const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const Startup = require("../models/startup");

const getAllStartups = async (req, res, next) => {
    let startups;
    try {
        startups = await Startup.find({}, "-password");
        //either whitelist with <name>, or blacklist with "-<name>""
    } catch (err) {
        console.log(err);
        next(new HttpError("database access error", 500));
        return;
    }

    //const users = User.find()
    res.status(200).json({
        users: startups.map((startup) => startup.toObject({ getters: true })),
    });
};

const getStartupById = async (req, res, next) => {
    const startupId = req.params.sid;

    let startup;
    try {
        startup = await Startup.findById(startupId);
    } catch (err) {
        //console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }

    if (startup) {
        res.json(startup);
        return;
    } else {
        next(new HttpError("No such startup found", 404));
        return;
    }
};

const startupLogin = async (req, res, next) => {
    const { email, password } = req.body;

    let startup;
    try {
        startup = await Startup.findOne({email});
    } catch (err) {
        next(new HttpError("log in failed", 500));
        return;
    }

    if (startup) {
        let isValidPassword = false;
        try {
            isValidPassword = await bcryptjs.compare(password, startup.password);
        } catch (err) {
            console.log(err);
            next(new HttpError("unknown log in error", 500));
            return;
        }

        if (isValidPassword) {
            // creating a token
            let token;
            try {
                token = jwt.sign( 
                    { startupId: startup.id, email: startup.email },
                    process.env.JWT_SECRET, // server private key --> NOT TO BE SHARED
                    { expiresIn: "1h" } // can set self-destruction of the token to prevent token stealing also
                );
            } catch (err) {
                //console.log(err);
                next(new HttpError("sign in failed", 500));
                return;
            }

            res.status(200).json({
                message: "login success",
                startupId: startup.id,
                email: startup.email, //other information up to us
                token: token, //impt to return token
            });

        } else {
            next(new HttpError("Password is incorrect", 403));
            return;
        }
    } else {
        next(new HttpError("Username is incorrect", 403));
        return;
    }

};

const startupSignup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log(errors);
        next(new HttpError("Invalid input detected", 422));
        return;
    }
    const { name, email, password } = req.body;

    let existingStartup;
    try {
        existingStartup = await Startup.findOne({email});
    } catch (err) {
        console.log(err);
        next(new HttpError("Failed to access database", 500));
        return;
    }

    if (existingStartup) {
        next(new HttpError("User already exists, log in instead", 422));
        return;
    }

    let hashedPassword;
    try {
        hashedPassword = await bcryptjs.hash(password, 12); //returns a promise
    } catch (err) {
        //console.log(err);
        next(new HttpError("Could not create user", 500));
        return;
    }

    const createdStartup = new Startup({
        name,
        password: hashedPassword, //encrypted now
        email,
        logo: "", //TO BE IMPLEMENTED
        challenges: [],
        description: "" //to be implemented in a way that startups can change themselves
    });

    try {
        await createdStartup.save();
        console.log("new startup created successfully");
    } catch (err) {
        console.log(err);
        next(new HttpError("failed to create new user"));
        return;
    }

    // creating a token
    let token;
    try {
        token = jwt.sign( 
            { startupId: createdStartup.id, email: createdStartup.email },
            process.env.JWT_SECRET, // server private key --> NOT TO BE SHARED
            { expiresIn: "1h" } // can set self-destruction of the token to prevent token stealing also
        );
    } catch (err) {
        //console.log(err);
        next(new HttpError("sign up failed", 500));
        return;
    }

    res.status(201).json({
        startupId: createdStartup.id,
        email: createdStartup.email, //other information up to us
        token: token, //impt to return token
    });
};

exports.getAllStartups = getAllStartups;
exports.getStartupById = getStartupById;
exports.startupLogin = startupLogin;
exports.startupSignup = startupSignup;