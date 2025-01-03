const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Language = require("../data_master/Language.js")
const Facility = require("../data_master/Facility.js")


const FacilityTranslation = sequelize.define('facility_translation', {
    uuid_facility_translation: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    facilityUUID: {
        type: DataTypes.UUID,
        references: {
            model: Facility,
            key: 'uuid_facility'
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 255],
        },
    }
}, {
    timestamps: true,
    freezeTableName: true,

});

Facility.hasMany(FacilityTranslation, { foreignKey: 'facilityUUID', as: "translations" })
FacilityTranslation.belongsTo(Facility, { foreignKey: 'facilityUUID', as: "facility" });

FacilityTranslation.belongsTo(Language, { foreignKey: "langId", as: "language" })
Language.hasMany(FacilityTranslation, { foreignKey: "langId", as: "facility" })

module.exports = FacilityTranslation;
