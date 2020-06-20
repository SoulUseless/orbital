class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //has message property
        this.errorCode = errorCode;
    }    
}

module.exports = HttpError;