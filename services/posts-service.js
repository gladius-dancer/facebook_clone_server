const PostsModel = require("../models/posts-model");
const ApiError = require("../exceptions/api-error");

class PostsService{
    async addPost(user_id, post_id, text, date, image, likes){
        console.log(typeof(date));
        const post = await PostsModel.create({user_id, post_id, text, date, image, likes});
        return post;
    }

    async getAllPosts() {
        const posts = await PostsModel.find();
        return posts;
    }

}

module.exports = new PostsService();
