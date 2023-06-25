const commentsService = require("../services/comments-service");
const {validationResult} = require("express-validator");
const ApiError = require("../exceptions/api-error");

class CommentsController{
    async addComment(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                throw next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const {user_id, posts_id, text, image, date, likes} = req.body;
            const commentData = await commentsService.addComment(user_id, posts_id, text, image, date, likes);
            return res.json(commentData);
        }catch (e){
            next(e);
        }
    }
    async getAllComments(req, res, next) {
        try {
            const comments = await commentsService.getAllComments();
            return res.json(comments);
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new CommentsController();
