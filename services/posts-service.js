const PostsModel = require("../models/posts-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class PostsService{
    async addPost(user_id, text, date, image){
        const post = await PostsModel.create({user_id, text, date, image, likes: 0});
        return post;
    }

    async getAllPosts(user_id) {
        const users = await UserModel.find();
        const posts = await PostsModel.find();
        const user = await UserModel.findOne({ _id: user_id });
        const friendIds = user?.friends;
        const friendsPosts = await PostsModel.find({ user_id: { $in: friendIds } });
        console.log(friendsPosts);
        return friendsPosts;
    }


}

module.exports = new PostsService();
