const express = require("express");

const { adminAuth, userAuth } = require("../../middlewares/auth");
const { userController } = require("../../controllers/user");

const userRouter = express.Router();

userRouter.post("/signup", userController.signup);

userRouter.post("/signin", userController.signin);

userRouter.get("/signout", userAuth, userController.signout);

userRouter.get("/auth", userAuth, userController.auth);

userRouter.get("/profile/:username", userController.getProfile);

userRouter.get("/email", userAuth, userController.getEmail);

userRouter.post("/profile", userAuth, userController.editProfile);

userRouter.post("/password", userAuth, userController.editPassword);

userRouter.get("/forget", userController.forgetPassword);

userRouter.post("/ban/update", adminAuth, userController.changeBannedStatus);

userRouter.get("/all", adminAuth, userController.getAllProfile);

module.exports = userRouter;