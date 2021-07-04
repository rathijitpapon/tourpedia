const express = require("express");

const { userAuth, adminAuth } = require("../../middlewares/auth");
const { blogController } = require("../../controllers/blog");

const blogRouter = express.Router();

blogRouter.post("/create", adminAuth, blogController.createBlog);

blogRouter.post("/update", adminAuth, blogController.updateBlog);

blogRouter.delete("/remove", adminAuth, blogController.deleteBlog);

blogRouter.get("/upvote", userAuth, blogController.upvoteBlog);

blogRouter.get("/downvote", userAuth, blogController.downvoteBlog);

blogRouter.get("/save", userAuth, blogController.saveBlog);

blogRouter.get("/unsave", userAuth, blogController.unsaveBlog);

blogRouter.get("/many", blogController.getManyBlog);

blogRouter.get("/:id", blogController.getBlogById);

module.exports = blogRouter;