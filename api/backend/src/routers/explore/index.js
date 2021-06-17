const express = require("express");

const categoryRouter = require("./category");
const countryRouter = require("./country");
const placeRouter = require("./place");

const explore = express.Router();

explore.use("/category", categoryRouter);
explore.use("/country", countryRouter);
explore.use("/place", placeRouter);

module.exports = explore;