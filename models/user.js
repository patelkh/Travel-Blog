const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

let User = mongoose.model("User", UserSchema);

module.exports = User;
