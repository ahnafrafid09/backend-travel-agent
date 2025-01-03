const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Product = require('./Product.js');
const Uom = require('./Uom.js');


const ProductPrice = sequelize.define('master_product_price', {
    uuid_product_price: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    productUUID: {
        type: DataTypes.UUID,
        references: {
            model: Product,
            key: 'uuid_product'
        },
        onDelete: "CASCADE"
    },
    uomId: {
        type: DataTypes.INTEGER,
        references: {
            model: Uom,
            key: 'id'
        },
        onDelete: 'SET NULL'
    }
}, {
    freezeTableName: true,
    timestamps: true
});


Product.hasMany(ProductPrice, { foreignKey: 'productUUID', as: "price" })
ProductPrice.belongsTo(Product, { foreignKey: 'productUUID', as: "product" })

Uom.hasMany(ProductPrice, { foreignKey: 'uomId', as: "price" })
ProductPrice.belongsTo(Uom, { foreignKey: 'uomId', as: "uom" })

module.exports = ProductPrice;
