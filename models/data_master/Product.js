const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Category = require('./Category.js');
const SubCategory = require('./SubCategory.js');
const Facility = require('./Facility.js');

const Product = sequelize.define('master_product', {
    uuid_product: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: "CASCADE"
    },
    subCategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: SubCategory,
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: "CASCADE"
    },

}, {
    freezeTableName: true,
    timestamps: true,

});

Facility.belongsToMany(Product, { through: 'product_facility', foreignKey: "facilityUUID", otherKey: 'productUUID' })
Product.belongsToMany(Facility, { through: 'product_facility', foreignKey: "productUUID", otherKey: 'facilityUUID' })

Category.hasMany(Product, { foreignKey: 'categoryId', as: "product" })
Product.belongsTo(Category, { foreignKey: 'categoryId', as: "category" })

SubCategory.hasMany(Product, { foreignKey: 'subCategoryId', as: "product" })
Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId', as: "subCategory" })

module.exports = Product;
