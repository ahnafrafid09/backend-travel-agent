const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const Schedule = require('./Schedule.js');

const TimeSlot = sequelize.define('timeslot', {
    uuid_timeslot: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    scheduleUUID: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Schedule,
            key: 'uuid_schedule'
        }
    },
}, {
    timestamps: true,
    freezeTableName: true
});

Schedule.hasMany(TimeSlot, { foreignKey: 'scheduleUUID', as: 'timeSlots' })
TimeSlot.belongsTo(Schedule, { foreignKey: 'scheduleUUID', as: 'schedule' });

module.exports = TimeSlot;
