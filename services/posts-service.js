const PostsModel = require("../models/posts-model");
const ApiError = require("../exceptions/api-error");

class PostsService{
    async addPost(user_id, posts_id, text, image, date, likes){
        const post = await PostsModel.create({user_id, posts_id, text, image, date, likes});
        return post;
    }

    async getAllPosts() {
        const posts = await PostsModel.find();
        return posts;
    }

}

module.exports = new PostsService();
