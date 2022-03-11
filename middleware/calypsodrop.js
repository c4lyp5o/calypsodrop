// configure stuff
const crypto = require('crypto');
const multer = require('multer');

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const ext = file.originalname.split(".")[1];
      cb(null, `${file.fieldname}-${fileHash}.${ext}`);
    },
  });

const uploadPara = multer({ storage: myStorage });

module.exports = uploadPara;