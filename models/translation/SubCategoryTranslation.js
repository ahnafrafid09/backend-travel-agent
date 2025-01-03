const { DataTypes } = require('sequelize');
const sequelize = require("../../config/database.js")
const Language = require("../data_master/Language.js")
const SubCategory = require("../data_master/SubCategory.js");


const SubCategoryTranslation = sequelize.define('sub_category_translation', {
    uuid_sub_category_translation: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    subCategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: SubCategory,
            key: 'id'
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
    },
}, {
    timestamps: true,
    freezeTableName: true,

});

SubCategory.hasMany(SubCategoryTranslation, { foreignKey: 'subCategoryId', as: "translations" })
SubCategoryTranslation.belongsTo(SubCategory, { foreignKey: 'subCategoryId', as: "subCategory" });

SubCategoryTranslation.belongsTo(Language, { foreignKey: "langId", as: "language" })
Language.hasMany(SubCategoryTranslation, { foreignKey: "langId", as: "subCategory" })

module.exports = SubCategoryTranslation;
