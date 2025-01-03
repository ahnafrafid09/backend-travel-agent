const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Language = require("../data_master/Language.js")
const ProductPrice = require('../data_master/ProductPrice.js');


const ProductPriceTranslation = sequelize.define('product_price_translation', {
    uuid_product_price_translation: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    priceUUID: {
        type: DataTypes.UUID,
        references: {
            model: ProductPrice,
            key: 'uuid_product_price'
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

ProductPrice.hasMany(ProductPriceTranslation, { foreignKey: 'priceUUID', as: "translation" })
ProductPriceTranslation.belongsTo(ProductPrice, { foreignKey: 'priceUUID', as: "price" });

ProductPriceTranslation.belongsTo(Language, { foreignKey: "langId", as: "language" })
Language.hasMany(ProductPriceTranslation, { foreignKey: "langId", as: "price" })

module.exports = ProductPriceTranslation;
