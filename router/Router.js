const Express = require("express")
const AuthRoute = require('./Auth.js')
const ProfileRoute = require('./Profile.js')
const CategoryProductRoute = require('./CategoryProduct.js')
const SubCategoryProductRoute = require('./SubCategoryProduct.js')
const FacilityRoute = require('./Facility.js')
const ProductRoute = require("./Product.js")
// const { GetUser } = require("../controller/UserController.js")

// const { CreateCategory, DeleteCategory, GetCategory, GetCategoryById, UpdateCategory } = require("../controller/CategoryController.js")
// const { CreateFacility, DeleteFacility, GetFacility, GetFacilityById, UpdateFacility } = require("../controller/FacilityController.js")
// const { CreateSubCategory, DeleteSubCategory, GetSubCategory, GetSubCategoryById, UpdateSubCategory } = require("../controller/SubCategoryController.js")
// const { CreateCarRent, DeleteCarRent, GetCarRent, GetCarRentById, UpdateCarRent } = require("../controller/CarRentController.js")
// const { GetTravel, GetTravelById, CreateTravel, DeleteTravel, UpdateTravel } = require("../controller/TravelController.js")
// const { CreateTourPackage, DeleteTourPackage, GetTourPackage, GetTourPackageById, UpdateTourPackage } = require("../controller/TourPackageController.js")


const Route = Express.Router()

Route.use("/auth", AuthRoute)
Route.use("/profile", ProfileRoute)
Route.use("/category", CategoryProductRoute)
Route.use("/sub-category", SubCategoryProductRoute)
Route.use("/facility", FacilityRoute)
Route.use("/product", ProductRoute)

// // user
// Router.get("/user", VerifyToken, GetUser)

// // category
// Router.get("/category", GetCategory)
// Router.get("/category/:id", GetCategoryById)
// Router.post("/category", CreateCategory)
// Router.patch("/category/:id", UpdateCategory)
// Router.delete("/category/:id", DeleteCategory)

// // Sub Category
// Router.get("/sub-category", GetSubCategory)
// Router.get("/sub-category/:id", GetSubCategoryById)
// Router.post("/sub-category", CreateSubCategory)
// Router.patch("/sub-category/:id", UpdateSubCategory)
// Router.delete("/sub-category/:id", DeleteSubCategory)

// // facility
// Router.get("/facility", GetFacility)
// Router.get('/facility/:id', GetFacilityById)
// Router.post("/facility", CreateFacility)
// Router.patch('/facility/:id', UpdateFacility)
// Router.delete('/facility/:id', DeleteFacility)

// // car rent
// Router.get("/car-rent", GetCarRent)
// Router.get("/car-rent/:id", GetCarRentById)
// Router.post("/car-rent", CreateCarRent)
// Router.patch("/car-rent/:id", UpdateCarRent)
// Router.delete("/car-rent/:id", DeleteCarRent)

// // tour package
// Router.get('/tour-package', GetTourPackage)
// Router.get('/tour-package/:id', GetTourPackageById)
// Router.post("/tour-package", CreateTourPackage)
// Router.patch('/tour-package/:id', UpdateTourPackage)
// Router.delete("/tour-package/:id", DeleteTourPackage)

// // Shuttle
// Router.get('/shuttle', GetTravel)
// Router.get('/shuttle/:id', GetTravelById)
// Router.post("/shuttle", CreateTravel)
// Router.patch('/shuttle/:id', UpdateTravel)
// Router.delete("/shuttle/:id", DeleteTravel)

module.exports = Route;