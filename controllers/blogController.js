const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");
const moment = require("moment");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//CMS LOGIN
exports.api_login = (req, res, next) => {
  // console.log(`req.body: ${req.body}`);
  User.findOne({ username: req.body.username }, (error, user) => {
    if (error) {
      res.sendStatus(500);
    } else if (!user) {
      return res.json({ message: "Invalid user" });
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) {
          return next(err);
        } else if (!isMatch) {
          return res.json({ message: "Invalid Password" });
        } else {
          jwt.sign({ user }, process.env.secret, (err, token) => {
            res.json({
              token,
              message: "Success",
            });
          });
        }
      });
    }
  });
};

//CMS GET BLOGS
exports.api_view_blogs = (req, res, next) => {
  jwt.verify(req.token, process.env.secret, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Blog.find()
        .select("_id date author title location description publish")
        .exec((err, results) => {
          if(err) {
            res.sendStatus(500)
          } else {
            res.json(results)
          }
        });
    }
  });
};

//CMS EDIT A BLOG
exports.api_update_blog = (req, res, next) => {
  jwt.verify(req.token, process.env.secret, (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Blog.findByIdAndUpdate(
        req.body.blog_id,
        {
          title: req.body.title,
          description: req.body.desc,
          date: req.body.date,
          location: req.body.location,
          author: req.body.author,
        },
        (err) => {
          if (err) {
            res.sendStatus(500);
          } else {
            console.log("updated")
            res.sendStatus(200);
          }
        }
      );
    }
  });
};

//CMS DELETE A BLOG
exports.api_delete_blog = (req, res, next) => {
  jwt.verify(req.token, process.env.secret, (err) => {
    if (err) {
      console.log('error in token')
      res.sendStatus(403);
    } else {
      Blog.findByIdAndRemove(req.body.blog_id, (err) => {
        if (err) {
          res.sendStatus(500);
          console.log('error in finding record')
        } else {
          console.log('deleted successfully')
          res.sendStatus(200);
        }
      });
    }
  });
};

//JWT Middleware
exports.verifyToken = (req, res, next) => {
  //Get auth header value
  const bearerHeader = req.headers["authorization"];
  //Check if bearer is undefined
  if (typeof bearerHeader != "undefined") {
    //Split at the space
    const bearer = bearerHeader.split(" ");
    //Get Token from array
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    console.log('error in passing token')
    res.sendStatus(403);
  }
};


//----------------------------------------------------------------------//
//Client System View Blogs
exports.view_blogs = (req, res, next) => {
  Blog.find()
    .select("_id date author title location description publish")
    .exec((err, results) => {
      res.json(results);
    });
};

//Client System View Blog
exports.blog_detail = (req, res, next) => {
  //API
  Blog.findById(req.params.id, (err, blog) => {
    if (err) return res.json(err);
    res.json(blog);
  });
};

//Client System View Blog Comments
exports.view_comments = (req, res, next) => {
  //API
  console.log(req.params.id);
  Comment.find({ blogId: mongoose.Types.ObjectId(req.params.id) })
    .sort("-_id")
    .exec((err, results) => {
      res.json(results);
    });
};

//Client System Add Blog Comment 
exports.add_comment_post = (req, res, next) => {
  console.log(req.body);
  const comment = new Comment({
    fname: req.body.fname,
    lname: req.body.lname,
    comment: req.body.comment,
    blogId: mongoose.Types.ObjectId(req.body.blog_id),
  }).save((err) => {
    res.json({ message: "Success" });
  });
};


//----------------------------------------------------------------------//
//Additional Frontend Support
exports.sign_up = (req, res, next) => {
  User.findOne({ username: req.body.username }, (error, user) => {
    if(error) {
      next()
    } else if(user) {
      console.log(`User ${user.username} already exists`);
      res.render("signup", {
        message: "User already exists!",
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return console.error(err);
        } else {
          const user = new User({
            username: req.body.username,
            password: hashedPassword,
          }).save((err) => {
            if (err) {
              return next(err);
            } else {
              res.redirect("/");
            }
          });
        }
      });
    }
  });
};

exports.login = (req, res, next) => {
  User.findOne({ username: req.body.username }, (error, user) => {
    if(error){
      return next(error)
    } else if(!user) {
      res.render("login", {
        message: "Invalid username",
      });
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) {
          return next();
        } else if (!isMatch) {
          res.render("login", {
            message: "Invalid password",
          });
        } else {
          res.redirect("/blogs/manage");
        }
      });
    }
  });
};

exports.manage_blogs = (req, res, next) => {
  Blog.find()
    .sort({ date: 1 })
    .exec((err, results) => {
      res.render("manage", {
        date: moment(results.date).format("YYYY-MM-DD"),
        blogs: results,
      });
    });
};

exports.edit_blog_get = (req, res, next) => {
  console.log(`req.params.id: ${req.params.id}`);
  // let id = mongoose.Types.ObjectId(req.params.id)
  Blog.findById(req.params.id).exec((err, doc) => {
    //console.log(`date: ${moment(doc.date).format("YYYY-MM-DD")}`)
    res.render("editBlog", {
      blog: doc,
      date: moment(doc.date).format("YYYY-MM-DD"),
    });
  });
};

exports.edit_blog_post = (req, res, next) => {
  // console.log(`updating: ${req.body.blog_id}`)
  Blog.findByIdAndUpdate(
    req.body.blog_id,
    {
      title: req.body.title,
      description: req.body.desc,
      date: req.body.date,
      location: req.body.location,
      author: req.body.author,
    },
    (err, doc) => {
      // console.log(`updated blog: ${doc}`)
      res.redirect("/blogs/manage");
    }
  );
};

exports.delete_blog = (req, res, next) => {
  console.log(req.params.id);
  Blog.findByIdAndRemove({ _id: req.params.id }, (err) => {
    if (err) return res.json(err);
    res.redirect("/blogs/manage");
    // res.json({
    //     message: "Deleted"
    // })
  });
};

exports.add_comment_get = (req, res, next) => {
  console.log(`Adding a comment on blog: ${req.params.id}`);
  Blog.findById(req.params.id).exec((err, doc) => {
    res.render("comment", { blog: doc });
  });
};





