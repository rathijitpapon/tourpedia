const express = require("express");

const { adminAuth, travelAgencyAuth, guideAuth, userAuth } = require("../../middlewares/auth");
const { eventController } = require("../../controllers/event");

const eventRouter = express.Router();

eventRouter.post("/create", travelAgencyAuth, eventController.createEvent);

eventRouter.post("/update", travelAgencyAuth, eventController.updateEvent);

eventRouter.delete("/remove", travelAgencyAuth, eventController.removeEvent);

eventRouter.post("/approve", adminAuth, eventController.changeApproveEvent);

eventRouter.post("/ban", adminAuth, eventController.changeBanEvent);

eventRouter.post("/enroll", userAuth, eventController.changeEnrollEvent);

eventRouter.post("/save", userAuth, eventController.changeSaveEvent);

eventRouter.get("/many", eventController.getManyEvent);

eventRouter.get("/myevent", travelAgencyAuth, eventController.getMyEventsEvent);

eventRouter.get("/guidedevent", guideAuth, eventController.getMyEventsEvent);

eventRouter.get("/:id", eventController.getEventById);

module.exports = eventRouter;