const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const Category = require('./Category.js');


const Facility = sequelize.define('facility', {
    uuid_facility: {
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
        onDelete: 'SET NULL',
        onUpdate: "CASCADE"
    }
}, {
    freezeTableName: true,
    timestamps: true
});
Category.hasMany(Facility, { foreignKey: 'categoryId' })
Facility.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Facility;
