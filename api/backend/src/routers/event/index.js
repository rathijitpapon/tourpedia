const express = require("express");

const eventRouter = require("./event");

const event = express.Router();

event.use("/event", eventRouter);

module.exports = event;