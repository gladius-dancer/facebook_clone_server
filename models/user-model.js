const {Schema, model} = require("mongoose");
const {ObjectId} = require("mongodb");

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    date: {type: String, required: true},
    gender: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActive: {type: Boolean, default: false},
    activationLink: {type: String},
    friends: {type: Array},
    diskSpace: {type: Number, default: 1024**3*10},
    usedSpace: {type: Number, default: 0},
    // avatar: {type: String},
    files : [{type: ObjectId}]
});


module.exports = model("User", UserSchema);
