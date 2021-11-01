const upload = require('../fileUploader');

/* Upload image */
// router.post('/uploadImage', checkAuth, upload.single('image'), async (req, res) => {
const handle_request = async (req, callback) => {
  const res = {};
  try {
    const uploadSingle = upload.single('image');

    uploadSingle(req, res, async (err) => {
      if (err) {
        console.log('File upload failed');
        throw new Error('File upload failed');
      } else if (req.file) {
        req.file.imageUrl = req.file.location;
        console.log(req.file);
        res.status = 200;
        res.data = req.file;
        callback(null, res);
      } else {
        console.log('File upload failed');
        throw new Error('File upload failed');
      }
    });
  } catch (e) {
    console.error('Error uploading image file:');
    console.error(e);
    res.status = 400;
    res.data = {
      msg: `Error uploading image file: ${e}`,
    };
    callback(null, res);
  }
};

exports.handle_request = handle_request;
