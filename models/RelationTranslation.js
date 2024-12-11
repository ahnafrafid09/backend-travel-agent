const Category = require("./Category.js");
const Facility = require("./Facility.js");
const Product = require("./Product.js");
const ProductDiscount = require("./ProductDiscount.js");
const ProductPrice = require("./ProductPrice.js");
const Schedule = require("./Schedule.js");
const SubCategory = require("./SubCategory.js");
const TimeSlot = require("./TimeSlot.js");
const Translation = require("./Translation.js");

Category.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "category"
    },
    as: 'translations'
});

Facility.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "facility"
    },
    as: 'translations'
});

ProductDiscount.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "product_discount"
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
});

Product.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "product"
    },
    as: 'translations'
});

Schedule.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "schedule"
    },
    as: 'translations'
});

ProductPrice.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "product_price"
    },
    as: 'translations'
});

TimeSlot.hasMany(Translation, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
        entityType: "time"
    },
    as: 'translations'
});

module.exports = { Category, Translation, ProductDiscount, SubCategory, Product, ProductPrice, Schedule, Facility, TimeSlot };
