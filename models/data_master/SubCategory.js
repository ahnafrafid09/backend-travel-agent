const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Category = require('./Category.js');

const SubCategory = sequelize.define('master_sub_category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    slug: {
        type: DataTypes.STRING,
        set(value) {
            this.setDataValue('slug', value.replace(/\s+/g, '-').toLowerCase())
        }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        },
        allowNull: false,
    }
}, {
    timestamps: true,
    freezeTableName: true,
});

Category.hasMany(SubCategory, { foreignKey: 'categoryId', as: "subCategory" })
SubCategory.belongsTo(Category, { foreignKey: 'categoryId', as: "category" });

module.exports = SubCategory;
