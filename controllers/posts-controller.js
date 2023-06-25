const postsService = require("../services/posts-service");
const {validationResult} = require("express-validator");
const ApiError = require("../exceptions/api-error");

class PostsController{
    async addPost(req, res, next){
        try {
            const {user_id, posts_id, text, image, date, likes} = req.body;
            const postData = await postsService.addPost(user_id, posts_id, text, image, date, likes);
            return res.json(postData);
        }catch (e){
            next(e);
        }
    }
    async getAllPosts(req, res, next) {
        try {
            const posts = await postsService.getAllPosts();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new PostsController();
