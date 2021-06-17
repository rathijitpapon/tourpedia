const express = require("express");

const { adminAuth } = require("../../middlewares/auth");
const { placeController } = require("../../controllers/explore");

const placeRouter = express.Router();

module.exports = placeRouter;