const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
})

//compile schema
let User = mongoose.model('User', UserSchema)

module.exports = mongoose.model("User", UserSchema)