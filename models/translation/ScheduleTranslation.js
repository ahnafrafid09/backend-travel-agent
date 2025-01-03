const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Language = require("../data_master/Language.js")
const Schedule = require("../data_master/Schedule.js");


const ScheduleTranslation = sequelize.define('schedule_translation', {
    uuid_schedule_translation: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    scheduleUUID: {
        type: DataTypes.UUID,
        references: {
            model: Schedule,
            key: 'uuid_schedule'
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    langId: {
        type: DataTypes.INTEGER,
        references: {
            model: Language,
            key: "id"
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    freezeTableName: true,

});

Schedule.hasMany(ScheduleTranslation, { foreignKey: 'scheduleUUID', as: "translation" })
ScheduleTranslation.belongsTo(Schedule, { foreignKey: 'scheduleUUID', as: "translation" });

ScheduleTranslation.belongsTo(Language, { foreignKey: "langId", as: "language" })
Language.hasMany(ScheduleTranslation, { foreignKey: "langId", as: "language" })

module.exports = ScheduleTranslation;
