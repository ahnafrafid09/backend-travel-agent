const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Language = require("../data_master/Language.js")
const Category = require("../data_master/Category.js")


const CategoryTranslation = sequelize.define('category_translation', {
    uuid_category_translation: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
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
        validate: {
            notEmpty: true,
            len: [1, 255],
        },
    }
}, {
    timestamps: true,
    freezeTableName: true,

});
Category.hasMany(CategoryTranslation, { foreignKey: 'categoryId', as: "translations" })
CategoryTranslation.belongsTo(Category, { foreignKey: 'categoryId', as: "category" });

CategoryTranslation.belongsTo(Language, { foreignKey: "langId", as: "language" });
Language.hasMany(CategoryTranslation, { foreignKey: "langId", as: "category" });

module.exports = CategoryTranslation;
