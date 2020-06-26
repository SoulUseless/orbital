const multer = require("multer");
const { uuid } = require("uuidv4");

const IMAGE_TYPE_MAP = {
    "image/png": "png",
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
}; //just a map to extract the file extensions

//TO DO: optimise code

//fileUpload contains a set of multer middlewares
//arg parsed configures multer
const fileUpload = (subfolder) => {
    if (subfolder === "images") {
        return multer({
            limits: 50000, //in bytes
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    //relative storage path
                    cb(null, `uploads/${subfolder}`);
                },
                filename: (req, file, cb) => {
                    // filename
                    const ext = IMAGE_TYPE_MAP[file.mimetype];
                    cb(null, uuid() + "." + ext);
                },
            }),
            fileFilter: (req, file, cb) => {
                const isValid = !!IMAGE_TYPE_MAP[file.mimetype]; //if undefined => converted to false
                let error = isValid ? null : new Error("Invalid mime type");
                cb(error, isValid);
            },
        });
    } else {
        console.log(subfolder);
        return multer({
            limits: 50000, //in bytes
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    //relative storage path
                    cb(null, `uploads/${subfolder}`);
                },
                filename: (req, file, cb) => {
                    // filename
                    cb(null, uuid());
                    //stored as extensionless files until i find a good way
                }
            }),
        });
    }
};

module.exports = fileUpload;