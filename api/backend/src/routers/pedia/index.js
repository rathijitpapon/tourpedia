const express = require("express");

const pediaRouter = require("./pedia");
const tourPlanRouter = require("./tourPlan");

const pedia = express.Router();

pedia.use("/pedia", pediaRouter);
pedia.use("/tourplan", tourPlanRouter);

module.exports = pedia;