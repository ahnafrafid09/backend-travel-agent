import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Translation from "./Translation.js";
import Category from "./Category.js";

const Travel = sequelize.define('travel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departure_schedule: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departure_place: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departure_destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: "id"
        }
    },
}, {
    freezeTableName: true,
    timestamps: true
})



Category.hasMany(Travel, { foreignKey: 'categoryId' });
Travel.belongsTo(Category, { foreignKey: 'categoryId' });


export default Travel