const express = require("express");

const { adminAuth } = require("../../middlewares/auth");
const { categoryController } = require("../../controllers/explore");

const categoryRouter = express.Router();

categoryRouter.post('/create', adminAuth, categoryController.createCategory);

categoryRouter.post('/update', adminAuth, categoryController.updateCategory);

categoryRouter.delete('/remove', adminAuth, categoryController.deleteCategory);

categoryRouter.get('/', categoryController.getCategoryByName);

categoryRouter.get('/all', categoryController.getAllCategory);

module.exports = categoryRouter;