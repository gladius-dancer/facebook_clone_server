const {Schema, model} = require("mongoose");

const PostsSchema = new Schema({
    user_id: {type: String, required: true},
    text: {type: String, required: true},
    date: {type: Date, required: true},
    image: {type: String},
    likes: {type: Number}
});

module.exports = model("Posts", PostsSchema);
