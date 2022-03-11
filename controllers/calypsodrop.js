const Crypto = require('crypto');
const Drop = require('../models/calypsodrop');

exports.whoAreYou = async (req, res, next) => {
    res.render('index', { title: 'Calypsodrop' });
}

exports.uploadFile = async (req, res) => {
    console.log(req.file);
    try {
        const unique = Crypto.randomBytes(3*24).toString('hex');
        const theFile = req.file;
        const pasted = new Drop({
            name: theFile.filename,
            created_at: new Date(),
            created_by: 'Public',
            uniqueID: unique,
            itsPath: theFile.path
        })

        // make sure file is available
        if (!theFile) {
            res.status(400).send({
                status: false,
                data: 'No file is selected.'
            });
        } else {
            // send response
            pasted.save();
            res.send({
                status: true,
                message: 'File is uploaded.',
                data: {
                    name: theFile.originalname,
                    mimetype: theFile.mimetype,
                    size: theFile.size
                }
            });
        }

    } catch (err) {
        res.status(500).send(err);
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