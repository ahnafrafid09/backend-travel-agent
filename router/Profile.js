const express = require("express");
const { CreateProfile, UpdateProfile, GetProfile } = require("../controller/ProfileController");
const { VerifyToken } = require("../middleware/VerifyToken.js")

const ProfileRoute = express.Router();

ProfileRoute.get("/", VerifyToken, GetProfile);
ProfileRoute.post("/", VerifyToken, CreateProfile);
ProfileRoute.patch("/", VerifyToken, UpdateProfile)


module.exports = ProfileRoute;