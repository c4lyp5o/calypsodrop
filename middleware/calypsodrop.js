// configure stuff
const crypto = require('crypto');
const multer = require('multer');
const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

// multer stuff
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

// auth stuff
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.cookie("currentUser", 'Public', { maxAge: 600000 });
    return res.render('index', { title: 'Calypsodrop', user: 'Public' });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
    res.clearCookie('currentUser');
    res.cookie("currentUser", decoded.user_name, { maxAge: 600000 });
  } catch (err) {
    console.log(err);
    res.clearCookie('token');
    res.clearCookie('currentUser');
    res.render('index', { title: 'Calypsodrop', user: 'Public' });
  }
  return next();
}

function dontLoginAndRegister(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    return res.redirect('/');
  }
  return next();
}

module.exports = { uploadPara, verifyToken, dontLoginAndRegister };