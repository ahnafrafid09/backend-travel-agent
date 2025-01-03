const express = require("express");
const VerifyLanguage = require("../middleware/VerifyLanguage.js");
const { GetUom, GetUomById, CreateUom, UpdateUom, DeleteUom } = require("../controller/UomController.js");

const UomRoute = express.Router()

UomRoute.get('/', VerifyLanguage, GetUom)
UomRoute.get('/:id', VerifyLanguage, GetUomById)
UomRoute.post('/', CreateUom)
UomRoute.patch('/:id', UpdateUom)
UomRoute.delete('/:id', DeleteUom)

module.exports = UomRoute;