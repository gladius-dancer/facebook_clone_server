const {Schema, model} = require("mongoose");
const {ObjectId} = require("mongodb");

const PostsSchema = new Schema({
    text: {type: String, required: true},
    file: {type: String},
    likes: {type: Number},
    name: {type: String, required: true},
    type: {type: String, required: true},
    accessLink: {type:String},
    // size: {type: String, default: 0},
    pathToFile: {type: String, default: ''},
    date: {type: Date, default: Date.now()},
    user: {type: ObjectId},
});

module.exports = model("Posts", PostsSchema);
