const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    date: {type: String, required: true},
    gender: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActive: {type: Boolean, default: false},
    activationLink: {type: String},
    friends: {type: Array}
});


module.exports = model("User", UserSchema);
