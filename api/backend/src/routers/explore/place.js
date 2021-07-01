const express = require("express");

const { adminAuth } = require("../../middlewares/auth");
const { placeController } = require("../../controllers/explore");

const placeRouter = express.Router();

placeRouter.post('/create', adminAuth, placeController.createPlace);

placeRouter.post('/update', adminAuth, placeController.updatePlace);

placeRouter.get('/', placeController.getPlaceByName);

placeRouter.get('/all', placeController.getAllPlace);

placeRouter.get('/many', placeController.getManyPlacesByFilter);

module.exports = placeRouter;