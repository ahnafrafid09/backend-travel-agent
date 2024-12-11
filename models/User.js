const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');


const User = sequelize.define('user', {
    uuid_user: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("Admin", "User"),
        defaultValue: "User",
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.TEXT,
    }
}, {
    timestamps: true,
    freezeTableName: true
});


module.exports = User;
