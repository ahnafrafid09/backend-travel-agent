const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/database.js');
const Product = require('./Product.js');

const Schedule = sequelize.define('schedule', {
    uuid_schedule: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    productUUID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Product,
            key: "uuid_product"
        }
    },
}, {
    timestamps: true, freezeTableName: true
});
Product.hasMany(Schedule, { foreignKey: 'productUUID' });
Schedule.belongsTo(Product, { foreignKey: 'productUUID' });



module.exports = Schedule;
