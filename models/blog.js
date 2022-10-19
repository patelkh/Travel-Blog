const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment')

const BlogSchema = new Schema({
    date: {type: Date},
    author: {type: String},
    image: {type: String},
    title: {type: String, required: true},
    location: {type: String},
    description: {type: String},
    publish: {type: Boolean},
    blogImage: {
        data: Buffer,
        contentType: String
    }
})

//compile schema
let Blog = mongoose.model('Blog', BlogSchema)

module.exports = Blog