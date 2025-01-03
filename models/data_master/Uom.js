const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');


const Uom = sequelize.define('master_uom', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = Uom;
