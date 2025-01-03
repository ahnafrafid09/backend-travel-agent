const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Language = require("../data_master/Language.js")
const TimeSlot = require("../data_master/TimeSlot.js");


const TimeSlotTranslation = sequelize.define('timeslot_translation', {
    uuid_timeslot_translation: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    timeslotUUID: {
        type: DataTypes.INTEGER,
        references: {
            model: TimeSlot,
            key: 'uuid_timeslot'
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
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    freezeTableName: true,

});

TimeSlot.hasMany(TimeSlotTranslation, { foreignKey: 'timeslotUUID', as: "translation" })
TimeSlotTranslation.belongsTo(TimeSlot, { foreignKey: 'timeslotUUID', as: "translation" });

TimeSlotTranslation.belongsTo(Language, { foreignKey: "langId", as: "language" })
Language.hasMany(TimeSlotTranslation, { foreignKey: "langId", as: "language" })

module.exports = TimeSlotTranslation;
