require("dotenv").config()
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const router = require("./routes/index");
const socket = require("./controllers/socket-controller");
const errorMiddleware = require("./middlewares/error-middleware");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(fileUpload({}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

socket();

app.use("/api", router);

app.use(errorMiddleware);
const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
    } catch (e) {
        console.log(e)
    }
}

start();
