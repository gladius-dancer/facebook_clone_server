const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenServices = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");
const PostsModel = require("../models/posts-model");

class UserService {
    async register(firstName, lastName, date, email, password, gender) {
        const candidat = await UserModel.findOne({email});
        if (candidat) {
            throw ApiError.BadRequest("A user with this email address already exists!")
        }
        const hashpassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({
            firstName,
            lastName,
            date,
            email,
            password: hashpassword,
            gender,
            friends: [],
            activationLink,
            avatar:""
        });
        await mailService.sendMailActivation(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenServices.generateTokens({...userDto});
        await tokenServices.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});
        if (!user) {
            throw ApiError.BadRequest("Not corrected link!");
        }

        user.isActive = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw ApiError.BadRequest("User not found!");
        }
        const isPasswordEquals = await bcrypt.compare(password, user.password);
        if (!isPasswordEquals) {
            throw ApiError.BadRequest("Incorrect password!");
        }
        const userDto = new UserDto(user);
        const tokens = tokenServices.generateTokens({...userDto});
        await tokenServices.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const tokenData = await tokenServices.removeToken(refreshToken);
        return tokenData;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = await tokenServices.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenServices.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenServices.generateTokens({...userDto});
        await tokenServices.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }
    async getUser(id) {
        const user = await UserModel.findOne({_id: id});
        return user;
    }
    async getAllUsers(id) {
        const users = await UserModel.find({_id: {$ne: id}});
        return users;
    }
    async getFriends(id) {
        const user = await UserModel.findOne({_id: id});
        const friendIds = user.friends;
        let friends = await UserModel.find({_id: {$in: friendIds}});
        friends = friends.map((friend)=> new UserDto(friend));
        return friends;
    }
    async getUnfriends(id) {
        const user = await UserModel.findOne({_id: id});
        const friendIds = user.friends;
        let unfriends = await UserModel.find({_id: {$not: {$eq: friendIds}}}).find({_id: {$ne: id}});
        unfriends = unfriends.map((unfriend)=> new UserDto(unfriend));
        return unfriends;
    }
}

module.exports = new UserService();
