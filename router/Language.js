const express = require("express");
// const { GetCategory, GetCategoryById, CreateCategory, UpdateCategory, DeleteCategory } = require("../controller/CategoryController.js");
const { GetLanguage, CreateLanguage, GetLanguageById, UpdateLanguage, DeleteLanguage } = require("../controller/LanguageController.js");

const LanguageRoute = express.Router()

LanguageRoute.get('/', GetLanguage)
LanguageRoute.get('/:id', GetLanguageById)
LanguageRoute.post('/', CreateLanguage)
LanguageRoute.patch('/:id', UpdateLanguage)
LanguageRoute.delete('/:id', DeleteLanguage)

module.exports = LanguageRoute;