const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const ProductDiscount = sequelize.define('product_discount', {
    uuid_product_discount: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    discount_type: {
        type: DataTypes.STRING,
    },
    discount_value: {
        type: DataTypes.DOUBLE,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = ProductDiscount;
