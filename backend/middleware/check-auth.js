const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    //just allow OPTIONS (sent before POST request is sent) through
    if (req.method === "OPTIONS") {
        return next();
    }
    //token is encoded in headers, authorization
    try {
        //console.log(req.headers);
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new Error ("Authentication failed");
        }
        //console.log(token);
        //have token -> verify token -> jwt.verify returns a string value after decryption
        //contains payload before encryption
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        //appending user data to the request to be passed on
        req.userData = { userId: decodedToken.userId, userType: decodedToken.userType };
        //console.log(req);
        next();

    } catch (err) { //catches when string.split fails
        console.log(err);
        const error = new HttpError("Authentication failed", 403);
        next(error);
        return;
    }


}