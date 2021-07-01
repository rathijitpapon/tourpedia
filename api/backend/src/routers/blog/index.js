const express = require("express");

const blogRouter = require("./blog");

const blog = express.Router();

blog.use("/", blogRouter);

module.exports = blog;