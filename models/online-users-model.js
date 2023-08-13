const {Schema, model} = require("mongoose");

const OnlineUsersSchema = new Schema({
    id: {type: String, value: "online"},
    users: {type: Array},
});

module.exports = model("OnlineUser", OnlineUsersSchema);
