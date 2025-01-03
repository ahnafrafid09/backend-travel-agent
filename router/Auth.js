const express = require("express");
const { Login, Register, Logout, RefreshToken } = require("../controller/AuthController.js");

const AuthRoute = express.Router();

AuthRoute.get("/token", RefreshToken)
AuthRoute.post("/login", Login)
AuthRoute.delete("/logout", Logout)
AuthRoute.post("/register", Register)

module.exports = AuthRoute;
