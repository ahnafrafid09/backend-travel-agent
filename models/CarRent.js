import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Category from './Category.js';
import SubCategory from './SubCategory.js'

const CarRent = sequelize.define('car_rent', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    car_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capasity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    model_year: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    },
    subCategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: SubCategory,
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
    timestamps: true
})

Category.hasMany(CarRent, { foreignKey: 'categoryId' });
CarRent.belongsTo(Category, { foreignKey: 'categoryId' });

SubCategory.hasMany(CarRent, { foreignKey: 'subCategoryId' });
CarRent.belongsTo(SubCategory, { foreignKey: 'subCategoryId' });

export default CarRent