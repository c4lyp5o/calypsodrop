const express = require('express');
const router = express.Router();
const dropCommand = require('../controllers/calypsodrop');

// configure multer
const multer = require('multer');
const FILE_PATH = 'uploads';
const upload = multer({dest: `${FILE_PATH}/`});

router.get('/', (req, res) => {
    res.send('Welcome to CalypsoDrop!');
});

router.post('/upload-avatar', upload.single('avatar'), dropCommand.uploadFile);

module.exports = router;