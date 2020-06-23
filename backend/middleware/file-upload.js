const multer = require("multer");
const { uuid } = require("uuidv4");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
}; //just a map to extract the file extensions

//fileUpload contains a set of multer middlewares
//arg parsed configures multer
const fileUpload = multer({
    limits: 50000, //in bytes
    storage: multer.diskStorage({
        destination: (req, file, cb) => { //relative storage path
            cb(null, "uploads/images")
        },
        filename: (req, file, cb) => { // filename
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid() + "." + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; //if undefined => converted to false
        let error = isValid ? null : new Error("Invalid mime type");
        cb(error, isValid);
    }
});

module.exports = fileUpload;