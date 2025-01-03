const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Category = require('./Category.js');
const SubCategory = require('./SubCategory.js');
const Facility = require('./Facility.js');

const Destination = sequelize.define('master_destination', {
    uuid_destination: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: true,

});

Facility.belongsToMany(Destination, { through: 'product_destination', foreignKey: "facilityUUID", otherKey: 'destinationUUID' })
Destination.belongsToMany(Facility, { through: 'product_destination', foreignKey: "destinationUUID", otherKey: 'facilityUUID' })

module.exports = Destination;
