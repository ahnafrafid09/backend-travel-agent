import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Category from './Category.js';
import Translation from './Translation.js';

const SubCategory = sequelize.define('sub_category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    }
}, {
    timestamps: true,
    freezeTableName: true
});


Category.hasMany(SubCategory, { foreignKey: 'categoryId' });
SubCategory.belongsTo(Category, { foreignKey: 'categoryId' });

export default SubCategory