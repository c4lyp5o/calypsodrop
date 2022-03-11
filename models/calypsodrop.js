const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create the schema
var dropSchema = new Schema({
    ori_name: String,
    name: String,
    created_at: String,
    created_by: String,
    uniqueID: String,
    itsPath: String,
    itsSize: Number
});

const Drop = mongoose.model('Drop', dropSchema);

module.exports = Drop;