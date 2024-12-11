const express = require("express");
const { GetSubCategory, GetSubCategoryById, CreateSubCategory, UpdateSubCategory, DeleteSubCategory } = require("../controller/SubCategoryController.js");

const Router = express.Router()

Router.get('/', GetSubCategory)
Router.get('/:id', GetSubCategoryById)
Router.post('/', CreateSubCategory)
Router.patch('/:id', UpdateSubCategory)
Router.delete('/:id', DeleteSubCategory)

module.exports = Router;