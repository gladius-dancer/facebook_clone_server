const postsService = require("../services/posts-service");
const userServices = require("../services/user-service");
const fs = require("fs");
const UserModel = require("../models/user-model");

class PostsController {
    async addPost(req, res, next) {

        try {
            const file = req.files.file;
            const user = await UserModel.findOne({_id: req.query.userId});

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({message: 'There no space on the disk'});
            }
            user.usedSpace = user.usedSpace + file.size;
            let path = `${process.env["FILE_PATH"]}\\${user._id}\\${file.name}`;

            if (fs.existsSync(path)) {
                return res.status(400).json({message: 'File already exist'});
            }
            file.mv(path);

            const type = file.name.split('.').pop();
            const {text} = req.body;
            const date = new Date().toString();
            const {size, name} = file;
            const postData = await postsService.addPost(text, date, type, size, name, path, user);
            res.json(postData)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Upload error"})
        }
    }

    async getAllPosts(req, res, next) {
        try {
            const userId = req.query.user_id;
            console.log(req);
            const posts = await postsService.getAllPosts(userId);
            return res.json(posts);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PostsController();
