const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Language = require("../data_master/Language.js")
const Product = require("../data_master/Product.js");


const ProductTranslation = sequelize.define('product_translation', {
    uuid_product_translation: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    productUUID: {
        type: DataTypes.UUID,
        references: {
            model: Product,
            key: 'uuid_product'
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
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,
    freezeTableName: true,

});

Product.hasMany(ProductTranslation, { foreignKey: 'productUUID', as: "translations" })
ProductTranslation.belongsTo(Product, { foreignKey: 'productUUID', as: "product" });

ProductTranslation.belongsTo(Language, { foreignKey: "langId", as: "language" })
Language.hasMany(ProductTranslation, { foreignKey: "langId", as: "product" })

module.exports = ProductTranslation;
