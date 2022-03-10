const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create the schema
var dropSchema = new Schema({
    title: String,
    desc: String,
    image: String,
    image_id: String,
    created_at: Date
});

var Drop = mongoose.model('Drop', dropSchema);

module.exports = Drop;