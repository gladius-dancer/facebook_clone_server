const {Schema, model} = require("mongoose");

const PostsSchema = new Schema({
    user_id: {type: String, required: true},
    text: {type: String, required: true},
    date: {type: Date, required: true},
    // file: { type: Buffer, required: true },
    filename: { type: String, required: true },
    // mimetype: { type: String, required: true },
    likes: {type: Number}
});

module.exports = model("Posts", PostsSchema);
