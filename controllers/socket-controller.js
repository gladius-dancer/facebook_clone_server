const {Server} = require("socket.io");
const OnlineUser = require("../models/online-users-model");
const UserModel = require("../models/user-model");
const uuid = require("uuid");

const io = new Server({
    cors: {
        origin: "http://localhost:3000",
    },
});

const  addNewUser = async (userId, socketId) => {
    const data = await OnlineUser.findOne({ socketId: socketId})
    if(!data){
        await OnlineUser.deleteMany({id: userId});
        await OnlineUser.create({id: userId,  socketId: socketId});
    }
};
const removeUser = async (socketId) => {
    await OnlineUser.deleteMany({socketId: socketId});
};

const getUser = async (id) => {
    const user = await OnlineUser.findOne({id: id});
    return user;
};
async function socket() {
    io.on("connection", (socket) => {
        console.log("Connected");
        socket.on("newUser", (userId) => {
            addNewUser(userId, socket.id);
        });

        socket.on("sendNotification", async (data) => {
            const {senderId, receiverId, type} = data;
            const sender = await UserModel.findOne({_id: senderId});
            await UserModel.findByIdAndUpdate(receiverId, {$push:{notifications: {id: uuid.v4(),type: type, sender: sender.firstName, avatar: sender.avatar  }}}, {new: true});
            const receiver = await getUser(receiverId);
            const user = await UserModel.findOne({_id: receiverId});
            if(receiver){
                io.to(receiver.socketId).emit("getNotification", user.notifications);
            }
        });

        socket.on("sendText", ({senderId, receiverId, text}) => {
            const receiver = getUser(receiverId);
            io.to(receiver.socketId).emit("getText", {
                senderId,
                text,
            });
        });

        socket.on("disconnect", () => {
            console.log("Disconnected");
            removeUser(socket.id);
        });
    });

    io.listen(7001);
}

module.exports = socket;