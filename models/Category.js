import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    }
}, {
    timestamps: true, freezeTableName: true
});

export default Category

