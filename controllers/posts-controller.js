const postsService = require("../services/posts-service");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

class PostsController{
    async addPost(req, res, next){
        upload.single('file');
        try {
            const {userId, text, image} = req.body;
            const date = new Date().toString();
            const postData = await postsService.addPost(userId, text, date, image);
            return res.json(postData);
        }catch (e){
            next(e);
        }
    }
    async getAllPosts(req, res, next) {
        try {
            const userId = req.query.user_id;
            console.log(req);
            const posts = await postsService.getAllPosts(userId);
            return res.json(posts);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PostsController();
