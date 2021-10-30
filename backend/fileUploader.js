const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const configurations = require('./config.json');

const s3 = new aws.S3({
  accessKeyId: configurations.S3_ACCESS_KEY,
  secretAccessKey: configurations.S3_SECRET_ACCESS_KEY,
  region: configurations.S3_BUCKET_REGION,
});

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, './public/images');
//   },
//   filename(req, file, cb) {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
// eslint-disable-next-line max-len
//     const uniqueFileName = `${file.originalname.substring(0, file.originalname.length - 4)}_${uniqueSuffix}${file.originalname.slice(-4)}`;
//     console.log(uniqueFileName);
//     cb(null, uniqueFileName);
//   },
// });
// const upload = multer({ storage });

const upload = multer({
  storage: multerS3({
    s3,
    bucket: configurations.S3_BUCKET_NAME,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(null, `image-${Date.now()}.jpeg`);
    },
  }),
});

module.exports = upload;
