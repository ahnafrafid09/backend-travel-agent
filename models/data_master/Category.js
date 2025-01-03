const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');


const Category = sequelize.define('master_category', {
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
    }
}, {
    timestamps: true,
    freezeTableName: true,
});

module.exports = Category;
