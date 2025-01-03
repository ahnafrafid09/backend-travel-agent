const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Product = require('./Product.js');
const ProductPrice = require('./ProductPrice.js');

const ProductDiscount = sequelize.define('master_product_discount', {
    uuid_product_discount: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    productUUID: {
        type: DataTypes.UUID,
        references: {
            model: Product,
            key: 'uuid_product',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    productPriceUUID: {
        type: DataTypes.UUID,
        references: {
            model: ProductPrice,
            key: 'uuid_product_price',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    discount_type: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['percentage', 'amount']],
        },
    },
    discount_value: {
        type: DataTypes.DOUBLE,
        validate: {
            min: 0,
        },
    },

    discount_start: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    discount_end: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    is_for_all_products: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    freezeTableName: true,
    timestamps: true,
});

ProductDiscount.belongsTo(Product, { foreignKey: 'productUUID', as: "product" });
Product.hasMany(ProductDiscount, { foreignKey: 'productUUID', as: "discount" });

ProductDiscount.belongsTo(ProductPrice, { foreignKey: 'productPriceUUID', as: "price" });
ProductPrice.hasMany(ProductDiscount, { foreignKey: 'productPriceUUID', as: "discount" });


module.exports = ProductDiscount;
