const postsService = require("../services/posts-service");
const UserModel = require("../models/user-model");
const fileController = require("../controllers/file-controller");
const uuid = require("uuid");

class PostsController {
    async addPost(req, res, next) {
        try {
            const file = req.files.file;
            const user = await UserModel.findOne({_id: req.query.userId});
            const type = file.mimetype;
            const filePath = file.data;
            const fileData = await fileController.uploadFile(filePath, file.name, type);
            const publicURI = await fileController.generatePublicUrl(fileData.id);
            const pathToFile = publicURI.webContentLink;
            const {text} = req.body;
            const date = new Date().toString();
            const name = file.name;
            const idFile = fileData.id;
            const postData = await postsService.addPost(text, date, type, name, idFile, pathToFile, user);

            res.json(postData)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Upload error"})
        }
    }
    async getAllPosts(req, res, next) {
        try {
            const userId = req.query.userId;
            const posts = await postsService.getAllPosts(userId);
            return res.json(posts);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PostsController();
