// calling all things
const express = require('express');
const router = express.Router();
const dropCommand = require('../controllers/calypsodrop');
const upload = require('../middleware/calypsodrop').uploadPara;
const auth = require('../middleware/calypsodrop').verifyToken;
const alreadyIn = require('../middleware/calypsodrop').dontLoginAndRegister;

// init routes
router.get('/', auth, dropCommand.whoAreYou);
router.post('/', upload.single('drops'), dropCommand.uploadFile);
router.get('/drops/:uniqueID', dropCommand.sendDrop);
router.post('/drops/delete/:uniqueID', dropCommand.deleteDrop);
router.get('/register', alreadyIn, dropCommand.registerUserForm);
router.post('/register', dropCommand.registerUser);
router.get('/login', alreadyIn, dropCommand.loginUserForm);
router.post('/login', dropCommand.loginUser);
router.get('/logout', auth, dropCommand.logoutUser);
router.get('/files', auth, dropCommand.listUserFiles);

module.exports = router;