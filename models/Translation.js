// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/database.js');


// const Translation = sequelize.define('translation', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     lang: {
//         type: DataTypes.STRING(5),
//         allowNull: false
//     },
//     entityType: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     entityId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     attribute: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     value: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     }
// }, {
//     freezeTableName: true,
//     timestamps: true
// });



// module.exports = Translation