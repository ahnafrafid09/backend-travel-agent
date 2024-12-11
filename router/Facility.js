const express = require('express')
const { GetFacility, GetFacilityById, CreateFacility, UpdateFacility, DeleteFacility, GetFacilityByCategory } = require('../controller/FacilityController.js')
const Router = express.Router()

Router.get('/', GetFacility)
Router.get('/:id', GetFacilityById)
Router.get('/:categoryId', GetFacilityByCategory)
Router.post('/', CreateFacility)
Router.patch('/:id', UpdateFacility)
Router.delete('/:id', DeleteFacility)

module.exports = Router