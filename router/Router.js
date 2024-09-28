import Express from "express"
import { Login, Logout, RefreshToken, Register } from "../controller/AuthController.js";
import { GetUser } from "../controller/UserController.js";
import { VerifyToken } from "../middleware/verifyToken.js";
import { CreateCategory, DeleteCategory, GetCategory, GetCategoryById, UpdateCategory } from "../controller/CategoryController.js";
import { CreateFacility, DeleteFacility, GetFacility, GetFacilityById, UpdateFacility } from "../controller/FacilityController.js";
import { CreateSubCategory, DeleteSubCategory, GetSubCategory, GetSubCategoryById, UpdateSubCategory } from "../controller/SubCategoryController.js";
import { CreateCarRent, DeleteCarRent, GetCarRent, GetCarRentById, UpdateCarRent } from "../controller/CarRentController.js";


const Router = Express.Router()

// auth
Router.get("/token", RefreshToken)
Router.post("/login", Login)
Router.delete("/logout", Logout)
Router.post("/register", Register)

// user
Router.get("/user", VerifyToken, GetUser)

// category
Router.get("/category", GetCategory)
Router.get("/category/:id", GetCategoryById)
Router.post("/category", CreateCategory)
Router.patch("/category/:id", UpdateCategory)
Router.delete("/category/:id", DeleteCategory)

// Sub Category
Router.get("/sub-category", GetSubCategory)
Router.get("/sub-category/:id", GetSubCategoryById)
Router.post("/sub-category", CreateSubCategory)
Router.patch("/sub-category/:id", UpdateSubCategory)
Router.delete("/sub-category/:id", DeleteSubCategory)

// facility
Router.get("/facility", GetFacility)
Router.get('/facility/:id', GetFacilityById)
Router.post("/facility", CreateFacility)
Router.patch('/facility/:id', UpdateFacility)
Router.delete('/facility/:id', DeleteFacility)

// car rent
Router.get("/car-rent", GetCarRent)
Router.get("/car-rent/:id", GetCarRentById)
Router.post("/car-rent", CreateCarRent)
Router.patch("/car-rent/:id", UpdateCarRent)
Router.delete("/car-rent/:id", DeleteCarRent)




export default Router