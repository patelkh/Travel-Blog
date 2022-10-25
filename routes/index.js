var express = require("express");
var router = express.Router();
var blogController = require("../controllers/blogController");
const upload = require("../models/upload");
const Blog = require("../models/blog");
const multer = require("../models/upload");
const fs = require("fs");
const path = require("path");

//Protected Routes for Content Management System (CMS)
router.post("/api/login", blogController.api_login);
router.post(
  "/api/blogs",
  blogController.verifyToken,
  blogController.api_view_blogs
);
router.post(
  "/api/update/:id",
  blogController.verifyToken,
  blogController.api_update_blog
);
router.post(
  "/api/delete/:id",
  blogController.verifyToken,
  blogController.api_delete_blog
);


//Unprotected Routes for Client System
//Blog List
router.get("/blogs/view", blogController.view_blogs);

//Read blog
router.get("/blog/:id", blogController.blog_detail);

//Read blog's comment list (id = blog id)
router.get("/blog/comments/:id", blogController.view_comments);

//Create comment (id = comment id)
router.post("/blog/comment/:id", blogController.add_comment_post);


//Alternate Content Management Option via EJS templates
//Signup
router.get("/signup", function (req, res) {
  res.render("signup", {
    message: "",
  });
});
router.post("/signup", blogController.sign_up);

//Login
router.get("/login", function (req, res) {
res.render("login", {
    message: "",
  });
});
router.post("/login", blogController.login);

//Redirection
router.get("/", function (req, res) {
  res.redirect("/blogs/manage");
});

//create blog
router.get("/create", function (req, res) {res.render("index")});

router.post("/blog/create", multer.upload.single("image"), (req, res, next) => {
  console.log(req.file);
  const blog = new Blog({
    title: req.body.title,
    description: req.body.desc,
    date: req.body.date,
    location: req.body.location,
    author: req.body.author,
    publish: true,
    blogImage: {
      data: fs.readFileSync(req.file.path),
      contentType: "image/png",
    },
  }).save((err, doc) => {
    if (err) return res.json(err);
    res.redirect("/blogs/manage");
  });
});

//update blog
router.get("/blog/update/:id", blogController.edit_blog_get);
router.post("/blog/update/:id", blogController.edit_blog_post);

//delete blog
router.get("/blog/delete/:id", blogController.delete_blog);

//manage blogs
router.get("/blogs/manage", blogController.manage_blogs);

//create comment
router.get("/blog/comment/:id", blogController.add_comment_get);

//delete comment



module.exports = router;
