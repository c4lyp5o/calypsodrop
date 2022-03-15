const Crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Drop = require('../models/calypsodrop');
const User = require('../models/users');

exports.registerUserForm = async (req, res, next) => {
    res.render('register');
};

exports.registerUser = async (req, res, next) => {    
    try {
    // get details from body
    const { userName, password } = req.body;
    if (!(userName && password)) {
      res.status(400).send("All input is required");
    }
    // check if user exist
    const oldUser = await User.findOne({ user_name: userName });
    if (oldUser) {
      return res.render('login');
    }
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    const user = await User.create({
      user_name: userName,
      password: encryptedPassword
    });
    // Create token
    const token = jwt.sign(
      { user_id: user._id, user_name: user.user_name },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    // return new user
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
}

exports.loginUserForm = async (req, res, next) => {
    res.render('login');
}

exports.loginUser = async (req, res, next) => {
  try {
    // Get user input
    const { userName, password } = req.body;

    // Validate user input
    if (!(userName && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ user_name: userName });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, user_name: user.user_name },
        process.env.TOKEN_KEY,
        {
          algorithm: "HS256",
          expiresIn: "60m",
        }
      );
      user.token = token;
      // Here have a cookie
      res.cookie("token", token, { maxAge: 600000 });
      return res.redirect('/');
    }
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
}

exports.whoAreYou = async (req, res) => {
  res.render('index', { title: 'Calypsodrop', user: `${req.user.user_name}` });
}  

exports.uploadFile = async (req, res) => {  
      try {
        console.log(req.user);
        const upLoader = req.cookies.currentUser;
        const unique = Crypto.randomBytes(3*24).toString('hex');
        const theFile = req.file;
        const pasted = new Drop({
            ori_name: theFile.originalname,
            name: theFile.filename,
            created_at: new Date(),
            created_by: upLoader,
            uniqueID: unique,
            itsPath: theFile.path,
            itsSize: theFile.size
        })

        // make sure file is available
        if (!theFile) {
            res.status(400).send({
                status: false,
                data: 'No file is selected.'
            });
        } else {
            // send response
            pasted.save(function (err) {
                if (err) { return next(err); }
                res.render('show', { title: 'Calypsodrop', paste: pasted, user: upLoader });
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.sendDrop = async (req, res) => {
    try {
        Drop.findOne({ uniqueID: req.params.uniqueID })
        .exec(function (err, paste) {
            res.download(paste.itsPath);
        });
    } catch (err) {
        console.log(err);
        res.render('404', { title: 'Oh no.. 404', user: req.cookies.currentUser});
    }
}

exports.listUserFiles = async (req, res) => {
    try {
        const userFiles = await Drop.find({ created_by: req.user.user_name });
        res.render('filelist', { title: 'Calypsodrop', files: userFiles });
    } catch (err) {
        console.log(err);
        res.render('404', { title: 'Oh no.. 404', user: req.cookies.currentUser});
    }
}

exports.logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.render('404');
    }
}

exports.deleteDrop = async (req, res) => {
    try {
        const drop = await Drop.findOneAndDelete({ uniqueID: req.params.uniqueID });
        await drop.remove();
        const filePath = path.join(__dirname, "..", `${drop.itsPath}`);
        fs.unlinkSync(filePath);
        const msg = `${drop.ori_name} has been deleted`;        
        res.render('index', { title: 'Calypsodrop', user: req.cookies.currentUser, msg: msg });
    } catch (err) {
        console.log(err);
        res.render('404', { title: 'Oh no.. 404', user: req.cookies.currentUser});
    }
}