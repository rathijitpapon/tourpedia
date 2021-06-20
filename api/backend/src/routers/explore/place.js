const express = require("express");

const { adminAuth } = require("../../middlewares/auth");
const { placeController } = require("../../controllers/explore");

const placeRouter = express.Router();

placeRouter.post('/create', adminAuth, placeController.createPlace);

placeRouter.post('/update', adminAuth, placeController.updatePlace);

placeRouter.delete('/remove', adminAuth, placeController.deletePlace);

placeRouter.get('/', placeController.getPlaceByName);

placeRouter.get('/all', placeController.getAllPlace);

module.exports = placeRouter;