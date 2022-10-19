//Scope: Create, read and delete posts

const Blog = require('../models/blog');
const Comment = require('../models/comment');
const async = require('async');
const { render } = require('ejs');
const moment = require('moment');
const mongoose = require('mongoose');
const blog = require('../models/blog');
const { json } = require('body-parser');
const fs = require('fs');

exports.view_blogs = (req, res, next) => {
    //use with ejs view
    // Blog.find().exec((err, results) => {
    //     res.render("blogs", {blogs: results})
    // })

    //use as api
    Blog.find().exec((err,results)=>{
        res.json(results)
    })
}

exports.create_blog = (req, res, next) => {
    //use with ejs view
    // const blog = new Blog({
    //     title: req.body.title,
    //     description: req.body.desc,
    //     date: req.body.date,
    //     location: req.body.location,
    //     author: req.body.author,
    //     comments: req.body.comment
    // }).save((err)=> {
    //     if(err) return res.json(err)
    //     res.render("index")
    // })

    // let imageUploadObject = {
    //     image: {
    //         data: req.file.buffer,
    //         contentType: req.file.mimetype
    //     }
    // }
    
    //use as api
    const blog = new Blog({
        title: req.body.title,
        description: req.body.desc,
        date: req.body.date,
        location: req.body.location,
        author: req.body.author,
        publish: true,
        blogImage: {
            data: fs.readFileSync(path.join(__dirname + '/uploads' + req.file.filename)),
            contentType: 'image/png'
        }
        
    }).save((err, doc) => {
        if(err) return res.json(err)
        res.redirect("/blogs/manage")
    })
}

exports.edit_blog_get = (req, res, next) => {
    console.log(`req.params.id: ${req.params.id}`)
    // let id = mongoose.Types.ObjectId(req.params.id)
    Blog.findById(req.params.id).exec((err, doc) => {
        //console.log(`date: ${moment(doc.date).format("YYYY-MM-DD")}`)
        res.render("editBlog", {
            blog: doc, 
            date: moment(doc.date).format("YYYY-MM-DD")})
    })
}

exports.edit_blog_post = (req, res, next) => {
    // console.log(`updating: ${req.body.blog_id}`)
    Blog.findByIdAndUpdate(req.body.blog_id, {
        title: req.body.title,
        description: req.body.desc,
        date: req.body.date,
        location: req.body.location,
        author: req.body.author
    }, (err, doc) => {
        // console.log(`updated blog: ${doc}`)
        res.redirect('/blogs/manage')
    })
}

exports.delete_blog = (req, res, next) => {
    console.log(req.params.id)
    Blog.findByIdAndRemove({_id: req.params.id}, (err) => {
        if(err) return res.json(err)
        res.redirect("/blogs/manage")
        // res.json({
        //     message: "Deleted"
        // })
    })
}

exports.blog_detail = (req, res, next) => {
    Blog.findById(req.params.id, (err, blog) => {
        if(err) return res.json(err)
        res.json(blog)
    } )
}

exports.manage_blogs = (req, res, next) => {
    Blog.find().sort({date:1}).exec((err, results)=>{
        res.render("manage", { 
            date: moment(results.date).format("YYYY-MM-DD"),
            blogs: results})
    })
}

exports.add_comment_get = (req, res, next) => {
    console.log(`Adding a comment on blog: ${req.params.id}`)
    Blog.findById(req.params.id).exec((err, doc) => {
        res.render("comment", {blog: doc})
    })
}

exports.add_comment_post = (req, res, next) => {
    console.log(req.body)
    const comment = new Comment({
        fname: req.body.fname,
        lname: req.body.lname,
        comment: req.body.comment,
        blogId: mongoose.Types.ObjectId(req.body.blog_id)
    }).save((err) => {
        res.redirect("/blogs/manage")
    })
}

exports.view_comments = (req, res, next) => {
    console.log(req.params.id)
    Comment.find({blogID: mongoose.Types.ObjectId(req.params.id)}).sort('-_id').exec((err, results) => {
        res.json(results)
    })
}