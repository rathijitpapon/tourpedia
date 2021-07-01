const express = require("express");

const { adminAuth } = require("../../middlewares/auth");
const { countryController } = require("../../controllers/explore");

const countryRouter = express.Router();

countryRouter.post('/create', adminAuth, countryController.createCountry);

countryRouter.post('/update', adminAuth, countryController.updateCountry);

countryRouter.get('/', countryController.getCountryByName);

countryRouter.get('/all', countryController.getAllCountry);

module.exports = countryRouter;