const Crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Drop = require('../models/calypsodrop');
const User = require('../models/users');

exports.registerUserForm = async (req, res, next) => {
    res.render('register');
};

exports.registerUser = async (req, res, next) => {    
    try {
    // get details from body
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }
    // check if user exist
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
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
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email, user_name: user.first_name },
        process.env.TOKEN_KEY,
        {
          algorithm: "HS256",
          expiresIn: "5m",
        }
      );

      // save user token
      user.token = token;

      // user
      res.cookie("token", token, { maxAge: 60000 });
      return res.redirect('/users/welcome');
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}

exports.whoAreYou = async (req, res, next) => {
    res.render('index', { title: 'Calypsodrop' });
}

exports.uploadFile = async (req, res) => {
    console.log(req.file);
    try {
        const unique = Crypto.randomBytes(3*24).toString('hex');
        const theFile = req.file;
        const pasted = new Drop({
            ori_name: theFile.originalname,
            name: theFile.filename,
            created_at: new Date(),
            created_by: 'Public',
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
                res.render('show', { title: 'Calypsodrop', paste: pasted });
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
        res.render('404');
    }
}
// exports.uploadFile = async (req, res) => {
//     console.log(req.file);
//     try {
//         const theFile = await Drop.create({
//             name: req.file.originalname,
//         })
//         res.status(201).json({
//             status: true,
//             message: 'File is uploaded.',
//         })
//     } catch (err) {
//         res.json({error: err});
//     }
// }