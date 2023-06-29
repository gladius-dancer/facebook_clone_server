const postsService = require("../services/posts-service");

class PostsController{
    async addPost(req, res, next){
        try {
            const {user_id, text, image} = req.body;
            const date = new Date().toString();
            const postData = await postsService.addPost(user_id, text, date, image);
            return res.json(postData);
        }catch (e){
            next(e);
        }
    }
    async getAllPosts(req, res, next) {
        try {
            const {user_id} = req.query;
            const posts = await postsService.getAllPosts(user_id);
            return res.json(posts);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PostsController();
