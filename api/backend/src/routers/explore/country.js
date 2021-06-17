const express = require("express");

const { adminAuth } = require("../../middlewares/auth");
const { countryController } = require("../../controllers/explore");

const countryRouter = express.Router();

module.exports = countryRouter;