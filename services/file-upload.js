const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uuid = require("uuid");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  secretKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
  bucketName: process.env.S3_BUCKET_NAME,
});

const s3 = new aws.S3();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const uploadImg = multer({
  limits: 10000000,
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, callback) {
      callback(null, { fieldName: file.fieldname });
    },
    key: function (req, file, callback) {
      const extension = MIME_TYPE_MAP[file.mimetype];
      callback(null, uuid.v1() + "." + extension);
    },
  }),
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(
        new Error("Podaj plik z rozszerzeniem .jpg, .jpeg lub .png")
      );
    }

    callback(undefined, true);
  },
});

module.exports = uploadImg;
