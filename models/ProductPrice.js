const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const ProductDiscount = require('./ProductDiscount.js');
const Product = require('./Product.js');


const ProductPrice = sequelize.define('product_price', {
    uuid_product_price: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    discount_price_amount: {
        type: DataTypes.DOUBLE,
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
        }
    },
    discountUUID: {
        type: DataTypes.UUID,
        references: {
            model: ProductDiscount,
            key: 'uuid_product_discount'
        },
        onDelete: 'SET NULL',
        onUpdate: "CASCADE"
    },
}, {
    freezeTableName: true,
    timestamps: true
});

ProductDiscount.hasMany(ProductPrice, { foreignKey: 'discountUUID' })
ProductPrice.belongsTo(ProductDiscount, { foreignKey: 'discountUUID' })

Product.hasMany(ProductPrice, { foreignKey: 'productUUID' })
ProductPrice.belongsTo(Product, { foreignKey: 'productUUID' })

module.exports = ProductPrice;
