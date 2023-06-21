const userServices = require("../services/user-service");
const {validationResult} = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController{

    async login(req, res, next){
        try {
            const {email, password} = req.body;
            const userData = await userServices.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {maxAge: 30*24*3600*1000, httpOnly: true});
            return res.json(userData);
        }catch (e){
            next(e);
        }
    }

    async logout(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const tokenData = await userServices.logout(refreshToken);
            res.clearCookie("refreshToken");
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
            const {email, password} = req.body;
            const userData = await userServices.register(email,password);
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

    async getUsers(req, res, next) {
        try {
            const users = await userServices.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new UserController();