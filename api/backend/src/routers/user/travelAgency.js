const express = require("express");

const { travelAgencyAuth } = require("../../middlewares/auth");
const { travelAgencyController } = require("../../controllers/user");

const travelAgencyRouter = express.Router();

travelAgencyRouter.post("/signup", travelAgencyController.signup);

travelAgencyRouter.post("/signin", travelAgencyController.signin);

travelAgencyRouter.get("/signout", travelAgencyAuth, travelAgencyController.signout);

travelAgencyRouter.get("/auth", travelAgencyAuth, travelAgencyController.auth);

travelAgencyRouter.get("/profile/:username", travelAgencyController.getProfile);

travelAgencyRouter.get("/email", travelAgencyAuth, travelAgencyController.getEmail);

travelAgencyRouter.post("/profile", travelAgencyAuth, travelAgencyController.editProfile);

travelAgencyRouter.post("/password", travelAgencyAuth, travelAgencyController.editPassword);

travelAgencyRouter.get("/forget", travelAgencyController.forgetPassword);

module.exports = travelAgencyRouter;