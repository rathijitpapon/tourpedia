const express = require("express");

const { adminAuth } = require("../../middlewares/auth");
const { pediaController } = require("../../controllers/pedia");

const pediaRouter = express.Router();

pediaRouter.post("/create", adminAuth, pediaController.createPedia);

pediaRouter.post("/update", adminAuth, pediaController.updatePedia);

pediaRouter.get("/many", pediaController.getManyPedia);

pediaRouter.get("/:id", pediaController.getPediaById);

module.exports = pediaRouter;