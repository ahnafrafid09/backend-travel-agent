const express = require('express')
const { GetFacility, GetFacilityById, CreateFacility, UpdateFacility, DeleteFacility, GetFacilityByCategory } = require('../controller/FacilityController.js')
const VerifyLanguage = require('../middleware/VerifyLanguage.js')
const FacilityRoute = express.Router()


FacilityRoute.get('/', VerifyLanguage, GetFacility)
FacilityRoute.get('/:uuid_facility', VerifyLanguage, GetFacilityById)
FacilityRoute.get('/category/:categoryId', VerifyLanguage, GetFacilityByCategory)
FacilityRoute.post('/', CreateFacility)
FacilityRoute.patch('/:id', UpdateFacility)
FacilityRoute.delete('/:id', DeleteFacility)

module.exports = FacilityRoute