const userServices = require("../services/user-service");
const {validationResult} = require("express-validator");
const ApiError = require("../exceptions/api-error");
const fileController = require("./file-controller");

class UserController{
    async login(req, res, next){
        try {
            const {email, password} = req.body;
            const userData = await userServices.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30*24*3600*1000,
                httpOnly: true,
                secure: true,
                samaSite: 'none'
            });
            return res.json(userData);
        }catch (e){
            next(e);
        }
    }
    async logout(req, res, next){

        try {
            const {refreshToken} = req.cookies;
            console.log("Hello");
            const tokenData = await userServices.logout(refreshToken);
            res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: 'strict' });
            return res.json(tokenData);
        }catch (e){
            next(e);
        }
    }
    async register(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                throw next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const {firstName, lastName, date, email, password, gender} = req.body;
            const userData = await userServices.register(firstName, lastName, date, email, password, gender);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30*24*3600*1000, httpOnly: true});
            return res.json(userData);
        }catch (e){
            next(e);
        }
    }
    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await userServices.refresh(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30*24*3600*1000, httpOnly: true});
            return res.json(userData);
        }catch (e){
            next(e);
        }
    }
    async activate(req, res, next){
        try {
            const activationLink = await req.params.link;
            await userServices.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }catch (e){
            next(e);
        }
    }

    async addAvatar(req, res, next) {
        try {
            const file = req.files.file;
            const type = file.mimetype;
            const filePath = file.data;
            const fileData = await fileController.uploadFile(filePath, file.name, type);
            const publicURI = await fileController.generatePublicUrl(fileData.id);
            const pathToFile = publicURI.webContentLink;
            const avatarId = fileData.id;
            const userData = await userServices.addAvatar(req.query.userId, pathToFile, avatarId);

            res.json(userData)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Upload error"})
        }
    }

    async getUsers(req, res, next) {
        try {
            const id = req.query.id;
            const users = await userServices.getAllUsers(id);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
    async getFriends(req, res, next) {
        try {
            const id = req.query.userId;
            const users = await userServices.getFriends(id);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
    async getUnfriends(req, res, next) {
        try {
            const id = req.query.userId;
            const users = await userServices.getUnfriends(id);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
    async getFamilliars(req, res, next) {
        try {
            const id = req.query.userId;
            const users = await userServices.getFamilliars(id);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async friendRequest(req, res, next){
        try{
            const id = req.query.id;
            const сandidate = req.query.candidate;
            const user = await userServices.friendRequest(id, сandidate);
            return res.json(user);
        } catch (e){
            next(e);
        }
    }

    async cancelFriendRequest(req, res, next){
        try{
            const id = req.query.id;
            const сandidate = req.query.candidate;
            const user = await userServices.cancelFriendRequest(id, сandidate);
            return res.json(user);
        } catch (e){
            next(e);
        }
    }

    async addToFriend(req, res, next){
        try{
            const id = req.query.id;
            const сandidate = req.query.candidate;
            const user = await userServices.addToFriend(id, сandidate);
            return res.json(user);
        } catch (e){
            next(e);
        }
    }

    async deleteFriendRequest(req, res, next){
        try{
            const id = req.query.id;
            const сandidate = req.query.candidate;
            const user = await userServices.deleteFriendRequest(id, сandidate);
            return res.json(user);
        } catch (e){
            next(e);
        }
    }


}

module.exports = new UserController();
