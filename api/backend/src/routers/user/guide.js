const express = require("express");

const { adminAuth, guideAuth, travelAgencyAuth } = require("../../middlewares/auth");
const { guideController } = require("../../controllers/user");

const guideRouter = express.Router();

guideRouter.post("/signup", travelAgencyAuth, guideController.signup);

guideRouter.post("/signin", guideController.signin);

guideRouter.get("/signout", guideAuth, guideController.signout);

guideRouter.get("/auth", guideAuth, guideController.auth);

guideRouter.get("/profile/:username", guideController.getProfile);

guideRouter.get("/email", guideAuth, guideController.getEmail);

guideRouter.post("/profile", guideAuth, guideController.editProfile);

guideRouter.post("/password", guideAuth, guideController.editPassword);

guideRouter.get("/forget", guideController.forgetPassword);

guideRouter.post("/ban/update", adminAuth, guideController.changeBannedStatus);

guideRouter.get("/all", adminAuth, guideController.getAllProfile);

guideRouter.get("/remove", travelAgencyAuth, guideController.removeGuide);

module.exports = guideRouter;