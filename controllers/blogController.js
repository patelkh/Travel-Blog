//Scope: Create, read and delete posts

const Blog = require('../models/blog');
const Comment = require('../models/comment');
const async = require('async');
const { render } = require('ejs');
const moment = require('moment');
const mongoose = require('mongoose')

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

    //use as api
    const blog = new Blog({
        title: req.body.title,
        description: req.body.desc,
        date: req.body.date,
        location: req.body.location,
        author: req.body.author,
        comments: req.body.comment
    }).save((err) => {
        if(err) return res.json(err)
        let blog = req.body
        res.json(blog)
    })
}

exports.blog_detail = (req, res, next) => {
    Blog.findById(req.params.id, (err, blog) => {
        if(err) return res.json(err)
        res.json(blog)
    } )
}

exports.delete_blog = (req, res, next) => {
    console.log(req.params.id)
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err) return res.json(err)
        // res.redirect("/")
        res.json({
            message: "Deleted"
        })
    })
}

exports.manage_blogs = (req, res, next) => {
    Blog.find().sort({date:1}).exec((err, results)=>{
        res.render("manage", {
            id: mongoose.Types.ObjectId(results.id), 
            date: moment(results.date).format("YYYY-MM-DD"),
            blogs: results})

    })
}