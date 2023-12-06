const multerS3 = require("multer-s3");
const multer = require('multer');
const aws = require("aws-sdk");

const s3 = new aws.S3({
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION
})

multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../data')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        },
    })
})

module.exports = { uploadS3 };