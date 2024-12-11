const express = require("express");
const { Login, Register, Logout, RefreshToken } = require("../controller/AuthController.js");

const Router = express.Router();

Router.get("/token", RefreshToken)
Router.post("/login", Login)
Router.delete("/logout", Logout)
Router.post("/register", Register)

module.exports = Router;
