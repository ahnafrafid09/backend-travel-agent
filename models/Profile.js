const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const User = require('./User.js');

const Profile = sequelize.define('profile', {
    uuid_profile: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.TEXT,
    },
    phone_num: {
        type: DataTypes.STRING,
    },
    userUUID: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "uuid_user"
        }
    },
}, {
    timestamps: true,
    freezeTableName: true
});

Profile.belongsTo(User, { foreignKey: 'userUUID' });
User.hasOne(Profile, { foreignKey: 'userUUID' });

module.exports = Profile;
