const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Blog = require('./blog')

const CommentSchema = new Schema({
    fname: {type: String},
    lname: {type: String},
    comment: {type: String},
    blogId: {type: mongoose.Types.ObjectId, ref: "Blog"}
})

//compile schema
let Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment