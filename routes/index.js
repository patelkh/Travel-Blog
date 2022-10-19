var express = require('express');
var router = express.Router();
var blogController = require('../controllers/blogController');

router.get('/', blogController.view_blogs);

//create blog
router.get('/blog/create', function(req, res) {res.render("index")});
router.post('/blog/create', blogController.create_blog);

//read blog
router.get('/blog/:id', blogController.blog_detail);

//update blog
router.get('/blog/update/:id', blogController.edit_blog_get);
router.post('/blog/update/:id', blogController.edit_blog_post);

//delete blog
router.get('/blog/delete/:id', blogController.delete_blog);

//manage blogs
router.get('/blogs/manage', blogController.manage_blogs);

//create comment
router.get('/blog/comment/:id', blogController.add_comment_get);
router.post('/blog/comment', blogController.add_comment_post);

//delete comment

//read comments
router.get('/blog/comments/:id', blogController.view_comments);



module.exports = router;