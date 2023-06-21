const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenServices = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService{
    async register(email, password){
        const candidat = await UserModel.findOne({email});
        if(candidat){
            throw ApiError.BadRequest("A user with this email address already exists!")
        }
        const hashpassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashpassword, activationLink});
        await mailService.sendMailActivation(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenServices.generateTokens({...userDto});
        await tokenServices.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink});
        if(!user){
            throw ApiError.BadRequest("Not corrected link!");
        }


        user.isActive = true;
        await user.save();
    }

    async login(email, password){
        const user = await UserModel.findOne({email});
        if(!user){
            throw ApiError.BadRequest("User not found!");
        }
        const isPasswordEquals = await bcrypt.compare(password, user.password);
        if(!isPasswordEquals){
            throw ApiError.BadRequest("Incorrect password!");
        }
        const userDto = new UserDto(user);
        const tokens = tokenServices.generateTokens({...userDto});
        await tokenServices.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async logout(refreshToken){
        const tokenData = await tokenServices.removeToken(refreshToken);
        return tokenData;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }

        const userData = await tokenServices.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenServices.findToken(refreshToken);
        if(!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenServices.generateTokens({...userDto});
        await tokenServices.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

}

module.exports = new UserService();