// calling all things
const express = require('express');
const router = express.Router();
const dropCommand = require('../controllers/calypsodrop');
const uploadPara = require('../middleware/calypsodrop');

// init routes
router.get('/', dropCommand.whoAreYou);
router.post('/', uploadPara.single('drops'), dropCommand.uploadFile);
router.get('/drops/:uniqueID', dropCommand.sendDrop);
router.get('/register', dropCommand.registerUserForm);
router.post('/register', dropCommand.registerUser);
router.get('/login', dropCommand.loginUserForm);
router.post('/login', dropCommand.loginUser);

module.exports = router;