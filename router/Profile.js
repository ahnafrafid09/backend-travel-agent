const express = require("express");
const { CreateProfile, UpdateProfile, GetProfile } = require("../controller/ProfileController");
const { VerifyToken } = require("../middleware/VerifyToken.js")

const Router = express.Router();

Router.get("/", VerifyToken, GetProfile);
Router.post("/", VerifyToken, CreateProfile);
Router.patch("/", VerifyToken, UpdateProfile)


module.exports = Router;