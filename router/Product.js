const express = require("express");
const { GetProducts, GetProductByUUID, CreateProduct } = require('../controller/ProductController.js')

const Router = express.Router()

Router.get("/", GetProducts)
Router.get("/:id", GetProductByUUID)
Router.post("/", CreateProduct)

module.exports = Router