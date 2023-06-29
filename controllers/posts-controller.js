const postsService = require("../services/posts-service");

class PostsController{
    async addPost(req, res, next){
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
            const userId = req.params.userId;
            console.log(req.params);
            const posts = await postsService.getAllPosts(userId);
            return res.json(posts);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PostsController();
