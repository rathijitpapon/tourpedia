const express = require("express");

const { adminAuth } = require("../../middlewares/auth");
const { adminController } = require("../../controllers/user");

const adminRouter = express.Router();

adminRouter.post("/signup", adminController.signup);

adminRouter.post("/signin", adminController.signin);

adminRouter.get("/signout", adminAuth, adminController.signout);

adminRouter.get("/auth", adminAuth, adminController.auth);

adminRouter.get("/profile", adminAuth, adminController.getProfile);

adminRouter.post("/password", adminAuth, adminController.editPassword);

module.exports = adminRouter;