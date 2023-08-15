const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    id: {type: String, required: true},

    history: {type: Array}
});

module.exports = model("User", UserSchema);
