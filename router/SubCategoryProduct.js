const express = require("express");
const { GetSubCategory, GetSubCategoryById, CreateSubCategory, UpdateSubCategory, DeleteSubCategory } = require("../controller/SubCategoryController.js");
const VerifyLanguage = require("../middleware/VerifyLanguage.js");

const SubCategoryRoute = express.Router()

SubCategoryRoute.get('/', VerifyLanguage, GetSubCategory)
SubCategoryRoute.get('/:id', VerifyLanguage, GetSubCategoryById)
SubCategoryRoute.post('/', CreateSubCategory)
SubCategoryRoute.patch('/:id', UpdateSubCategory)
SubCategoryRoute.delete('/:id', DeleteSubCategory)

module.exports = SubCategoryRoute;