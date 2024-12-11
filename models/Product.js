const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const Category = require('./Category.js');
const SubCategory = require('./SubCategory.js');
const Facility = require('./Facility.js')

const Product = sequelize.define('product', {
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
    timestamps: true
});

Facility.belongsToMany(Product, { through: 'ProductFacilities', foreignKey: "facilityUUID", otherKey: 'productUUID' })
Product.belongsToMany(Facility, { through: 'ProductFacilities', foreignKey: "productUUID", otherKey: 'facilityUUID' })

Category.hasMany(Product, { foreignKey: 'categoryId' })
Product.belongsTo(Category, { foreignKey: 'categoryId' })

SubCategory.hasMany(Product, { foreignKey: 'subCategoryId' })
Product.belongsTo(SubCategory, { foreignKey: 'subCategoryId' })



module.exports = Product;
