const {Schema, model} = require("mongoose");

const PostsSchema = new Schema({
    user_id: {type: String, required: true},
    post_id: {type: String, required: true},
    text: {type: String, required: true},
    image: {type: String},
    date: {type: Date, required: true},
    likes: {type: Number}
});

module.exports = model("Posts", PostsSchema);
