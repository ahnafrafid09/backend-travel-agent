const express = require("express");
const { GetCategory, GetCategoryById, CreateCategory, UpdateCategory, DeleteCategory } = require("../controller/CategoryController.js");

const Router = express.Router()

Router.get('/', GetCategory)
Router.get('/:id', GetCategoryById)
Router.post('/', CreateCategory)
Router.patch('/:id', UpdateCategory)
Router.delete('/:id', DeleteCategory)

module.exports = Router;