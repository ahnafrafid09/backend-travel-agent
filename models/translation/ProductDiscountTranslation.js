const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Language = require("../data_master/Language.js")
const ProductDiscount = require("../data_master/ProductDiscount.js");


const ProductDiscountTranslation = sequelize.define('product_discount_translation', {
    uuid_product_discount_translation: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    discountUUID: {
        type: DataTypes.UUID,
        references: {
            model: ProductDiscount,
            key: 'uuid_product_discount'
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    langId: {
        type: DataTypes.INTEGER,
        references: {
            model: Language,
            key: "id"
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255],
        },
    }
}, {
    timestamps: true,
    freezeTableName: true,

});

ProductDiscount.hasMany(ProductDiscountTranslation, { foreignKey: 'discountUUID', as: "translation" })
ProductDiscountTranslation.belongsTo(ProductDiscount, { foreignKey: 'discountUUID', as: "translation" });

ProductDiscountTranslation.belongsTo(Language, { foreignKey: "langId", as: "language" })
Language.hasMany(ProductDiscountTranslation, { foreignKey: "langId", as: "language" })

module.exports = ProductDiscountTranslation;
