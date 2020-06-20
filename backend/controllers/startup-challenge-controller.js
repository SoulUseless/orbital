//const { uuid } = require("uuidv4");
//const { validationResult } = require("express-validator");
//const mongoose = require("mongoose");
//const fs = require("fs");

const HttpError = require("../models/http-error");
//const StartupChallenge = require("../models/startupChallenge");
//const Startup = require("../models/startup");

const DUMMY_CHALLENGE = [
    {
        id: "c1",
        name: "Factorial",
        owner: "google", //startup profile name
        description: "my first challenge",
        requirements: [
            { tier: "javascript", level: "silver" },
            { tier: "java", level: "gold" },
        ], //to be populated to show more information
        taskDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        url: "https://cdn.worldvectorlogo.com/logos/google-icon.svg", //startup profile pic
        testCases: {
            publicTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
            privateTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
        },
    },
    {
        id: "c2",
        name: "Factorial",
        owner: "google", //startup profile name
        description: "my first challenge",
        requirements: [
            { tier: "java", level: "gold" },
            { tier: "python", level: "gold" },
        ], //to be populated to show more information
        taskDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        url: "https://cdn.worldvectorlogo.com/logos/google-icon.svg", //startup profile pic
        testCases: {
            publicTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
            privateTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
        },
    },
    {
        id: "c3",
        name: "Factorial",
        owner: "facebook", //startup profile name
        description: "my first challenge",
        requirements: [{ tier: "python", level: "gold" }], //to be populated to show more information
        taskDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        testCases: {
            publicTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
            privateTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
        },
        url:
            "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-facebook-2019-square1-512.png",
    },
    {
        id: "c4",
        name: "Factorial",
        owner: "tencent", //startup profile name
        description: "my first challenge",
        requirements: [{ tier: "python", level: "silver" }], //to be populated to show more information
        taskDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        testCases: {
            publicTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
            privateTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
        },
        url:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv_MNlp6gBL_CAc8mnwUirBnqJIBN7yjtxZZhjxAMwExKm0beX&s",
    },
    {
        id: "c5",
        name: "Factorial",
        owner: "facebook", //startup profile name
        description: "my first challenge",
        requirements: [{ tier: "java", level: "silver" }], //to be populated to show more information
        taskDescription:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        testCases: {
            publicTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
            privateTestCases: [
                { input: "factorial(3)", output: "6" },
                { input: "factorial(5)", output: "120" },
            ],
        },
        url:
            "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-facebook-2019-square1-512.png",
    },
];

const getChallengeById = async (req, res, next) => {
    const challengeId = req.params.cid; // stored as keys: { pid: "XXX" }

    const place = DUMMY_CHALLENGE.find(c => challengeId === c.id);

    console.log("GET request places");

    /* reference code to be implemented later
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }
    */

    //json is automatically sent back
    if (place) {
        res.json(place);
        //res.json({ place: place.toObject({ getters: true }) }); // => { place } === { place: place }

        //convert the object from mongoose object to js object
        //getters: true converts fields into strings
        return;
    } else {
        next(new HttpError("Place not found", 404));
        return;
        /*
        res.status(404).json({ message: "place not found" }); //default is 200: success
        //can method chain to send responses 
        */
    }   
}

const getChallengeByStartup = async (req, res, next) => {
    const startupId = req.params.sid;

    const challenges = DUMMY_CHALLENGE.filter(c => startupId === c.owner);

    /*
    //findById doesnt return promise, can use .exec() to get a promise
    //let places;

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate("places");

        //places = await Place.find({ creator: userId });
        //can use .find() to search using other params
        //mongoose directly returns an array
    } catch (err) {
        console.log(err);
        next(new HttpError("Search failed", 500));
        return;
    }
    */
  
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
    const userId = req.userData.userId;
}

exports.getChallengeById = getChallengeById;
exports.getChallengeByStartup = getChallengeByStartup;
exports.createStartupChallenge = createStartupChallenge;