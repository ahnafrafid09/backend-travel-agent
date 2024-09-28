import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Category from './Category.js';
import SubCategory from './SubCategory.js';
import Translation from './Translation.js';

export const TourPackage = sequelize.define('tour_package', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.JSON,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: "id"
        }
    },
    subCategoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: SubCategory,
            key: "id"
        }
    }
}, {
    timestamps: true,
    freezeTableName: true
});



export const Schedule = sequelize.define('schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tourPackageId: {
        type: DataTypes.INTEGER,
        references: {
            model: TourPackage,
            key: 'id'
        },
        allowNull: false
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: true
});



TourPackage.hasMany(Schedule, { foreignKey: 'tourPackageId' });
Schedule.belongsTo(TourPackage, { foreignKey: 'tourPackageId' });

Category.hasMany(TourPackage, { foreignKey: 'categoryId' });
TourPackage.belongsTo(Category, { foreignKey: 'categoryId' });

SubCategory.hasMany(TourPackage, { foreignKey: 'subCategoryId' });
TourPackage.belongsTo(SubCategory, { foreignKey: 'subCategoryId' });
