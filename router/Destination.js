const express = require('express')
const { GetDestination, GetDestinationById, CreateDestination, UpdateDestination, DeleteDestination } = require('../controller/DestinationController')
const DestinationRoute = express.Router()


DestinationRoute.get('/', GetDestination)
DestinationRoute.get('/:uuid_destination', GetDestinationById)
DestinationRoute.post('/', CreateDestination)
DestinationRoute.patch('/:uuid_destination', UpdateDestination)
DestinationRoute.delete('/:uuid_destination', DeleteDestination)

module.exports = DestinationRoute