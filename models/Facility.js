import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Translation from './Translation.js';

const Facility = sequelize.define('facility', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    facility_type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default Facility;
