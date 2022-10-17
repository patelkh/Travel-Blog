const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Blog = require('./blog')

const CommentSchema = new Schema({
    fname: {type: String},
    lname: {type: String},
    comment: {type: String},
    blog: {type: Schema.Types.ObjectId, ref: "Blog"}
})

//compile schema
let Comment = mongoose.model('Comment', CommentSchema)

module.exports = mongoose.model("Comment", CommentSchema)