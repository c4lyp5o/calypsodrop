const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;