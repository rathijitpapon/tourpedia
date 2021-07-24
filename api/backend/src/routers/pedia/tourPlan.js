const express = require("express");

const { adminAuth, userAuth } = require("../../middlewares/auth");
const { tourPlanController } = require("../../controllers/pedia");

const tourPlanRouter = express.Router();

tourPlanRouter.post("/create", adminAuth, tourPlanController.createTourPlan);

tourPlanRouter.post("/update", adminAuth, tourPlanController.updateTourPlan);

tourPlanRouter.delete("/remove", adminAuth, tourPlanController.removeTourPlan);

tourPlanRouter.post("/save", userAuth, tourPlanController.changeSaveTourPlan);

tourPlanRouter.get("/many", tourPlanController.getManyTourPlan);

tourPlanRouter.get("/all", adminAuth,tourPlanController.getAllTourPlans);

tourPlanRouter.get("/:id", tourPlanController.getTourPlanById);

module.exports = tourPlanRouter;