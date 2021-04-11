const express = require("express");

const userRouter = require("./user");
const adminRouter = require("./admin");
const travelAgencyRouter = require("./travelAgency");
const guideRouter = require("./guide");

const user = express.Router();

user.use("/general", userRouter);
user.use("/admin", adminRouter);
user.use("/travelagency", travelAgencyRouter);
user.use("/guide", guideRouter);

module.exports = user;