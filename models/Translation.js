import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Category from './Category.js';
import Facility from './Facility.js';

const Translation = sequelize.define('translation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    lang: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    entityType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    attribute: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    freezeTableName: true,
    timestamps: true
});



export default Translation;
