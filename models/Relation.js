import Category from "./Category.js"
import Facility from "./Facility.js"
import SubCategory from "./SubCategory.js"
import CarRent from "./CarRent.js"
import Travel from "./Travel.js"
import { Schedule, TourPackage } from "./TourPackage.js"
import Translation from "./Translation.js"

Category.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "category"
    },
    as: 'translations'
})
Facility.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "facility"
    },
    as: 'translations'
})

SubCategory.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "sub_category"
    },
    as: 'translations'
})

TourPackage.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "tour_package"
    },
    as: 'translations'
})

Schedule.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "schedule"
    },
    as: 'translations'
})

Travel.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "travel"
    },
    as: 'translations'
})

export { Category, Translation, Travel, SubCategory, TourPackage, Schedule, Facility }
