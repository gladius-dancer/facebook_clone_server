const PostsModel = require("../models/posts-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");
const {ObjectId} = require("mongodb");

class PostsService{
    async addPost(text, date, type, size, name, path, user){
        const post = await PostsModel.create({text, date, type, size, name, path, user, likes: 0});
        return post;
    }

    async getAllPosts(userId) {
        const user = await UserModel.findOne({ _id: userId });
        const friendIds = user?.friends;
        const friendsPosts = await PostsModel.find({ user: { $in: friendIds } });

        return friendsPosts;
    }


}

module.exports = new PostsService();
