const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create the schema
var dropSchema = new Schema({
    name: String,
    created_at: String,
    created_by: String,
    uniqueID: String,
    itsPath: String
});

const Drop = mongoose.model('Drop', dropSchema);

module.exports = Drop;