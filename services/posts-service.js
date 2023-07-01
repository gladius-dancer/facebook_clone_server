const PostsModel = require("../models/posts-model");
const UserModel = require("../models/user-model");
const ApiError = require("../exceptions/api-error");
const {ObjectId} = require("mongodb");

class PostsService{
    async addPost(text, date, type, size, name, pathToFile, user){
        const post = await PostsModel.create({text, date, type, size, name, pathToFile, user, likes: 0});
        return post;
    }

    async getAllPosts(userId) {
        const user = await UserModel.findOne({ _id: userId });

        PostsModel.aggregate([
            {
                $lookup:{
                    from: "posts",
                    localField: "user",
                    foreignField: "_id",
                    as: "combinedData"

                }
            }
        ]).then((result)=>{
            // const friendIds = user?.friends;
            // const friendsPosts =  result.combinedData.find({ user: { $in: friendIds } });
            console.log(result);
            // return friendsPosts;
        }).catch((error)=>{
            console.error(error);
        })

    }
}

module.exports = new PostsService();
