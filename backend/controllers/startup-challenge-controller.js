const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");

const HttpError = require("../models/http-error");
const StartupChallenge = require("../models/startupChallenge");
const Startup = require("../models/startup");
const Student = require("../models/student");
const Submission = require("../models/submission");

const getAllChallenge = async (req, res, next) => {
    let startupChallenges;
    try {
        startupChallenges = await StartupChallenge.find({});
    } catch (err) {
        //console.log(err);
        next(new HttpError("database access error", 500));
        return;
    }

    //const users = User.find()
    res.status(200).json({
        startupChallenges: startupChallenges.map((c) => c.toObject({ getters: true })),
    });
};

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
    let challenges;
    try {
        startupWithChallenges = await Startup.findById(startupId).populate("challenges");
        challenges = startupWithChallenges.challenges;
    } catch (err) {
        //console.log(err);
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
    if (req.userData.userType != "startup") {
        next(new HttpError("Invalid Credentials", 422));
    }
    if (errors.isEmpty()) {
        //owner to be replaced by token retrieval
        const userData = req.userData;
        const {name, description, requirements, taskDescription,testCases} = req.body;
        const createdChallenge = new StartupChallenge({
            name,
            owner: userData.userId, 
            description,
            requirements,
            taskDescription,
            testCases,
            submissions: []
        });

        let startup;
        try {
            startup = await Startup.findById(userData.userId); //owner to be replaced with token retrieval
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

    const startupId = req.userData.userId;

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
        //console.log(challenge.owner.toString());
        //console.log(startupId);
        if (challenge.owner.toString() !== startupId) {
            next(new HttpError("You are not allowed to update this", 401));
            return;
        }

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
    
    const startupId = req.userData.userId;

    let challenge;
    try {
        challenge = await StartupChallenge.findById(challengeId).populate("owner");
    } catch (err) {
        console.log(err);
        next( new HttpError("Database error", 500));
        return;
    }

    if (!challenge) {
        return next(new HttpError("Search failed, nothing to delete", 404));
    }

    //run simple startupid check
    //console.log(challenge.owner._id.toString());
    //console.log(startupId);
    if (challenge.owner._id.toString() !== startupId) {
        next(new HttpError("You are not allowed to delete this", 401));
        return;
    }

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
    
    const startupId = req.userData.userId;

    let challenge;
    try {
        challenge = await StartupChallenge.findById(challengeId).populate({
            path: "submissions",
            populate: { path: "owner" },
        });
        //pending population when startup is developed
    } catch (err) {
        console.log(err);
        next( new HttpError("Database error", 500));
        return;
    }

    //console.log(challenge.owner);
    if (challenge.owner.toString() !== startupId) {
        next(new HttpError("You are not allowed to access this information", 401));
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

const uploadSubmissionById = async (req, res, next) => {
    const user = req.userData;
    if (user.userType != "student") {
        return next(new HttpError("You do not have permissions to upload submissions", 401));
    }

    const filePath = "haha.txt"; //DUMMY VARIABLE
    //const file = req.file;
    //const filePath = req.file.path;

    const studentId = user.userId;
    let student;
    try {
        student = await Student.findById(studentId);
        //pending population when startup is developed;
    } catch (err) {
        //console.log(err);
        next( new HttpError("Database error", 500));
        return;
    }

    const challengeId = req.params.cid;
    let challenge;
    try {
        challenge = await StartupChallenge.findById(challengeId);
    } catch (err) {
        //console.log(err);
        next( new HttpError("Database error", 500));
        return;
    }

    if (!challenge) {
        return next(new HttpError("No such challenge found", 404));
    }

    const newSubmission = new Submission({
        file: filePath,
        owner: studentId,
        success: false
    });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newSubmission.save({session});

        student.challengeSubmissions.push(newSubmission);
        await student.save({ session });
        
        challenge.submissions.push(newSubmission);
        await challenge.save({ session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        next(new HttpError("Something went wrong during uploading, please try again", 500));
        return;
    }

    //SEND THE FILE TO JDOODLE USING THEIR API TO RUN THE CODE
    /* sample json request -> needs axios integration i think
    {
        script : "", //script
        language: "php", //language
        versionIndex: "0", //language version
        clientId: ${process.env.JDOODLE_ID},
        clientSecret:${process.env.JDOODLE_SECRET}
    }

    send to:
    {
        url: 'https://api.jdoodle.com/v1/execute',
        method: "POST",
        json: program
    }

    sample responses 
        (success):
        {output, statusCode, memory, cpuTime}
        (error):
        {error, statusCode}
    */

    //DUMMY CHECKS
    const isSuccess = false;
    if (isSuccess) {
        //update all relevant information
        newSubmission.success = true;
        student.completedStartupChallenges.push(challenge);
        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            await newSubmission.save({session});
            await student.save({ session });
            await session.commitTransaction();
        } catch (err) {
            console.log(err);
            next(new HttpError("Something went wrong during uploading, please try again", 500));
            return;
        }
        return res.json({message: "submission success"});
    }
    //maybe send back data to be rendered on error page?
    return res.json({message: "Submitted, but incorrect"});
};

exports.getChallengeById = getChallengeById;
exports.getChallengeByStartup = getChallengeByStartup;
exports.createStartupChallenge = createStartupChallenge;
exports.updateStartupChallengeById = updateStartupChallengeById;
exports.deleteStartupChallengeById = deleteStartupChallengeById;
exports.getSubmissionsById = getSubmissionsById;
exports.getAllChallenge = getAllChallenge;
exports.uploadSubmissionById = uploadSubmissionById;