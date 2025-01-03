const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const ProductPrice = require('./ProductPrice.js');
const Uom = require('./Uom.js');


const ProductPriceDetail = sequelize.define('product_price_dtl', {
    uuid_product_price_dtl: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    people: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    productPriceUUID: {
        type: DataTypes.UUID,
        references: {
            model: ProductPrice,
            key: 'uuid_product_price'
        },
        onDelete: "CASCADE"
    },
    uomId: {
        type: DataTypes.INTEGER,
        references: {
            model: Uom,
            key: "id",
        },
        onDelete: "SET NULL"
    }
}, {
    freezeTableName: true,
    timestamps: true
});

ProductPrice.hasMany(ProductPriceDetail, { foreignKey: "productPriceUUID", as: "detail" })
ProductPriceDetail.belongsTo(ProductPrice, { foreignKey: "productPriceUUID", as: "price" })

Uom.hasMany(ProductPriceDetail, { foreignKey: "uomId", as: "details" })
ProductPriceDetail.belongsTo(Uom, { foreignKey: "uomId", as: "uom" })

module.exports = ProductPriceDetail;
