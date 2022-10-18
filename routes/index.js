var express = require('express');
var router = express.Router();
var blogController = require('../controllers/blogController');

router.get('/', blogController.view_blogs);

//create
router.get('/blog/create', function(req, res) {res.render("index")});
router.post('/blog/create', blogController.create_blog);

//read
router.get('/blog/:id', blogController.blog_detail);

//update
router.get('/blog/update/:id', blogController.edit_blog_get);
router.post('/blog/update/:id', blogController.edit_blog_post);

//delete
router.get('/blog/delete/:id', blogController.delete_blog);

//manage
router.get('/blogs/manage', blogController.manage_blogs);


module.exports = router;

