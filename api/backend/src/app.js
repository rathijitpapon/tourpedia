const express = require("express");
const cors = require("cors");

const initDB = require("./db/mongoose");

const user = require("./routers/user");
const explore = require("./routers/explore");
const blog = require("./routers/blog");

var corsOptions = {
    origin: "*",
};

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

initDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  
app.use(cors(corsOptions));

app.use("/user", user);
app.use("/explore", explore);
app.use("/blog", blog);

module.exports = app;
