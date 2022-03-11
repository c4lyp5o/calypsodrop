const express = require('express');
const router = express.Router();
const dropCommand = require('../controllers/calypsodrop');

// configure multer
const multer = require('multer');
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split(".")[1];
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

const upload = multer({ storage: multerStorage });


router.get('/', dropCommand.whoAreYou);
router.post('/', upload.single('thefile'), dropCommand.uploadFile);

module.exports = router;