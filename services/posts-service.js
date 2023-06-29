const PostsModel = require("../models/posts-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");

class PostsService{
    async addPost(user_id, text, date, image, likes){
        console.log(typeof(date));
        const post = await PostsModel.create({user_id, text, date, image, likes});
        return post;
    }

    async getAllPosts(user_id) {
        const users = await UserModel.find();
        const posts = await PostsModel.find();
        const user = await UserModel.findOne({ _id: user_id });
        const friendIds = user.friends;
        const friendsPosts = await PostsModel.find({ user_id: { $in: friendIds } }).toArray();
        return friendsPosts;
    }

}

module.exports = new PostsService();
