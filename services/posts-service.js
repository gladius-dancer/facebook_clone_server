const PostsModel = require("../models/posts-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");
const {ObjectId} = require("mongodb");

class PostsService{
    async addPost(userId, text, date, image){
        const post = await PostsModel.create({userId, text, date, image, likes: 0});
        return post;
    }

    async getAllPosts(userId) {
        const user = await UserModel.findOne({ _id: userId });
        console.log(userId);
        const friendIds = user?.friends;

        const friendsPosts = await PostsModel.find({ user_id: { $in: friendIds } });

        return friendsPosts;
    }


}

module.exports = new PostsService();
