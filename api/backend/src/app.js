const express = require("express");
const cors = require("cors");

// const initDB = require("./db/mongoose");

var corsOptions = {
    origin: "*",
};

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// initDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));  
app.use(cors(corsOptions));

app.get("/admin", (req, res) => {
    res.send({
        data: "Data For Admin",
    });
});

app.get("/travelagency", (req, res) => {
    res.send({
        data: "Data For Travel Agency",
    });
});

app.get("/tourpedia", (req, res) => {
    res.send({
        data: "Data For Tour Pedia",
    });
});

module.exports = app;
