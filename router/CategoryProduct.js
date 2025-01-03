const express = require("express");
const { GetCategory, GetCategoryById, CreateCategory, UpdateCategory, DeleteCategory } = require("../controller/CategoryController.js");
const VerifyLanguage = require("../middleware/VerifyLanguage.js")
const CategoryRoute = express.Router()

CategoryRoute.get('/', VerifyLanguage, GetCategory)
CategoryRoute.get('/:id', VerifyLanguage, GetCategoryById)
CategoryRoute.post('/', CreateCategory)
CategoryRoute.patch('/:id', UpdateCategory)
CategoryRoute.delete('/:id', DeleteCategory)

module.exports = CategoryRoute;