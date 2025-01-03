const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database.js');
const Language = require("../data_master/Language.js")
const Uom = require('../data_master/Uom.js');


const UomTranslation = sequelize.define('uom_translation', {
    uuid_uom_translation: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    uomId: {
        type: DataTypes.INTEGER,
        references: {
            model: Uom,
            key: 'id'
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
    },
}, {
    timestamps: true,
    freezeTableName: true,

});

Uom.hasMany(UomTranslation, { foreignKey: 'uomId', as: "translations" })
UomTranslation.belongsTo(Uom, { foreignKey: 'uomId', as: "uom" });

UomTranslation.belongsTo(Language, { foreignKey: "langId", as: "language" })
Language.hasMany(UomTranslation, { foreignKey: "langId", as: "uom" })

module.exports = UomTranslation;
