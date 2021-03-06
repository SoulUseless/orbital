const fs = require("fs");
const path = require("path");

const cors = require("cors");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

//the imported constants are just middleware now
const challengeRoutes = require('./routes/challenge-routes.js');
const studentRoutes = require("./routes/student-routes");
const startupRoutes = require("./routes/startup-routes");
const startupChallengeRoutes = require("./routes/startup-challenge-routes");
const languageRoutes = require("./routes/language-routes");
const tierRoutes = require("./routes/tier-routes");
const debugRoutes = require("./routes/debug-routes");

const HttpError = require("./models/http-error");

const app = express().use('*', cors());;

//extract json data from all incoming requests
app.use(bodyParser.json());

/*
//workaround CORS error
//cannot anyhow send requests cross-url
app.use((req, res, next) => {
    //allow any domain to send requests to backend
    res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3000');
    //set allowed headers
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    //set allowed request types
    res.setHeader(
        "Access-Control-Allow-Methods", 
        "GET, POST, OPTIONS, PATCH, DELETE"
    );
    next();
});
*/
//app.use(cors());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use("/uploads/submissions", express.static(path.join("uploads", "submissions")));

app.use("/uploads/testcases", express.static(path.join("uploads", "testcases")));

app.get("/api/uploads/submission/:sid", (req, res, next) => {
    const file = path.join(__dirname, "/uploads/submission", req.params.sid);
    res.setHeader(
        "Access-Control-Expose-Headers",
        "Content-Disposition"
    );
    res.set('Content-Type', 'text/plain');
    res.set('Content-Disposition', `attachment; filename=${req.params.sid}`);
    //res.setHeader('Content-Type', 'text');
    res.download(file); // Set disposition and send it.
})

//requests must come from urls that start with following url 
app.use("/api/startup", startupRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/startup-challenge", startupChallengeRoutes);

app.use("/api/challenge", challengeRoutes);

app.use("/api/language", languageRoutes);

app.use("/api/tier", tierRoutes);

app.use("/api/debug", debugRoutes);

//only runs when all havent send requests
app.use((req, res, next) => {
     throw new HttpError("No Route found", 404);
});

//middleware function with 4 params gets treated as a ERROR HANDLING middleware func
app.use((error, req, res, next) => {
    if (req.file) { //multer adds file param in the req => if present means its a file
        //this triggers when theres an error and req contains a file
        //delete (unlink) the file using fs module
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        }); 
    }
    if (res.headerSent) {
        //wont send a response
        //error gets forwarded to next middleware
        return next(error);
    } else {
        res.status(error.code || 500); //500 means server problem
        res.json({ message: error.message || "Unknown error occured" });
    }

});

//now using environment variables
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0-un6y8.gcp.mongodb.net/orbital?retryWrites=true&w=majority`;
console.log(url);
mongoose
    .connect(url)
    .then(() => {
        console.log("db connected");
        app.listen(5000);
    })
    .catch((err) => {
        console.log(err);
    });