exports.whoAreYou = async (req, res, next) => {
    res.render('index');
}

exports.uploadFile = async (req, res) => {
    try {
        const theFile = req.file;

        // make sure file is available
        if (!theFile) {
            res.status(400).send({
                status: false,
                data: 'No file is selected.'
            });
        } else {
            // send response
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