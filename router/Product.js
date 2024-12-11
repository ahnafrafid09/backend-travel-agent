const express = require("express");
const { GetProducts, CreateProduct } = require('../controller/ProductController.js')

const Router = express.Router()

Router.get("/", GetProducts)
Router.post("/", CreateProduct)

module.exports = Router