const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");

const HttpError = require("../models/http-error");
const StartupChallenge = require("../models/startupChallenge");
const Startup = require("../models/startup");

const getChallengeById = async (req, res, next) => {
    const challengeId = req.params.cid; // stored as keys: { pid: "XXX" }

    let challenge;
    try {
        challenge = await StartupChallenge.findById(challengeId);
    } catch (err) {
        console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }

    //json is automatically sent back
    if (challenge) {
        res.json(challenge);
        //res.json({ place: place.toObject({ getters: true }) }); // => { place } === { place: place }

        //convert the object from mongoose object to js object
        //getters: true converts fields into strings
        return;
    } else {
        next(new HttpError("Challenge not found", 404));
        return;
        /*
        res.status(404).json({ message: "place not found" }); //default is 200: success
        //can method chain to send responses 
        */
    }   
}

//TO DO: after startup is implemented properly
const getChallengeByStartup = async (req, res, next) => {
    const startupId = req.params.sid;

    let startupWithChallenges;
    try {
        startupWithChallenges = await User.findById(userId).populate("places");

        places = await StartupChallenge.find({ owner: userId });
    } catch (err) {
        console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }
  
    if ( challenges && challenges.length > 0) {
    //if (userWithPlaces && userWithPlaces.places.length > 0) {
        res.json({
            //places: userWithPlaces.places.map((place) => place.toObject({ getters: true }))
            challenges: challenges
        });
        return;
    } else {
        next(new HttpError("Startup has no places", 404));
        return;
    }
}

const createStartupChallenge = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        //owner to be replaced by token retrieval
        const {name, owner, description, requirements, taskDescription,testCases} = req.body;
        const createdChallenge = new StartupChallenge({
            name,
            owner, 
            description,
            requirements,
            taskDescription,
            testCases,
            submissions: []
        });

        let startup;
        try {
            startup = await Startup.findById(owner); //owner to be replaced with token retrieval
        } catch (err) {
            //console.log(err);
            next(new HttpError("database error", 500));
            return; 
        }

        if (!startup) {
            return next(new HttpError("indicated creator user not found", 404));
        }

        try {
            const session = await mongoose.startSession();
            session.startTransaction();

            await createdChallenge.save({ session });
            startup.challenges.push(createdChallenge);
            await startup.save({ session }); 
            await session.commitTransaction();
            //console.log("success");
        } catch (err) {
            console.log(err);
            next (new HttpError("Commit Failed", 500));
            return;
        }
        res.status(201); //code represents something new created on server
        return res.json({ challenge: createdChallenge });
    } else {
        console.log(errors);
        next(HttpError("Invalid Inputs Detected", 422));
        return;
    }
}

const updateStartupChallengeById = async (req, res, next) => {
    const errors = validationResult(req);

    //const startupId = req.userData.userId TO DO, when token is built properly

    if (!errors.isEmpty()) {
        console.log(errors);
        return next(HttpError("Invalid Inputs detected", 422));
    } else {
        const challengeId = req.params.cid;

        let challenge;
        try {
            challenge = await StartupChallenge.findById(challengeId);
        } catch (err) {
            console.log(err);
            next(new HttpError("Challenge query failed", 500));
            return;
        }

        //run simple startupid check
        /*
        if (place.creator.toString() !== userId) {
            next(new HttpError("You are not allowed", 401));
            return;
        }
        */

       const {name, description, requirements, taskDescription, testCases} = req.body;
       if (challenge) {
           challenge.name = name;
           challenge.description = description;
           challenge.requirements = requirements;
           challenge.taskDescription = taskDescription;
           challenge.testCases = testCases;

           try {
               await challenge.save();
           } catch (err) {
               console.log(err);
               next(new HttpError("Update failed", 500));
               return;
           }

           res.status(200).json({
               challenge: challenge.toObject({ getters: true }),
           });
       } else {
           next(new HttpError("No Such Challenge Found", 404));
           return;
       }
    }
};

const deleteStartupChallengeById = async (req, res, next) => {
    const challengeId = req.params.cid;
    //TO DO when token verification is up
    //const userId = req.userData.userId

    let challenge;
    try {
        challenge = await StartupChallenge.findById(challengeId).populate("owner");
        //pending population when startup is developed
    } catch (err) {
        console.log(err);
        next( new HttpError("Database error", 500));
        return;
    }

    if (!challenge) {
        return next(new HttpError("Search failed, nothing to delete", 404));
    }

    /* PENDING IMPLEMENTATION
    // this field is stored in string so dunnid toString on this
    if (place.owner.id !== userId) {
        next (HttpError("You are not allowed", 401));
        return;
    }  
    */  

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await challenge.remove({session});

        //remove the challenge from the relevant startup also
        challenge.owner.challenges.pull(challenge);
        await challenge.owner.save({session});
        
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        next(new HttpError("Deletion Failed", 500));
        return;
    }

    res.status(200).json({message: "Successfully Deleted. "});
};

const getSubmissionsById = async (req, res, next) => {
    const challengeId = req.params.cid;
    let challenge;
    try {
        challenge = await StartupChallenge.findById(challengeId)
        //pending population when startup is developed
    } catch (err) {
        console.log(err);
        next( new HttpError("Database error", 500));
        return;
    }

    if (!challenge) {
        return next(new HttpError("Search failed, nothing to delete", 404));
    }
    res.json(challenge.submissions);
    //res.json({ place: place.toObject({ getters: true }) }); // => { place } === { place: place }

    //convert the object from mongoose object to js object
    //getters: true converts fields into strings
    return;
};

exports.getChallengeById = getChallengeById;
exports.getChallengeByStartup = getChallengeByStartup;
exports.createStartupChallenge = createStartupChallenge;
exports.updateStartupChallengeById = updateStartupChallengeById;
exports.deleteStartupChallengeById = deleteStartupChallengeById;
exports.getSubmissionsById = getSubmissionsById;