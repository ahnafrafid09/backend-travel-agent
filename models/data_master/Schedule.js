const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../../config/database.js');
const Product = require('./Product.js');

const Schedule = sequelize.define('master_schedule', {
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
        },
        onDelete: "CASCADE"
    },
}, {
    timestamps: true,
    freezeTableName: true,
});
Product.hasMany(Schedule, { foreignKey: 'productUUID', as: "product" });
Schedule.belongsTo(Product, { foreignKey: 'productUUID', as: "product" });



module.exports = Schedule;
