const sequelize = require("../../config/database.js")
const { DataTypes } = require('sequelize');

const Language = sequelize.define('master_language', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255],
        },
    },
    file_flag: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    timestamps: true,
    freezeTableName: true,
});

module.exports = Language;