import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { TourPackage } from './TourPackage.js';
import Travel from './Travel.js';
import CarRent from './CarRent.js';
import Facility from './Facility.js';

// CarRent and Facility Many-to-Many relation
const CarRentFacilities = sequelize.define('car_rent_facilities', {
    carRentId: {
        type: DataTypes.INTEGER,
        references: {
            model: CarRent,
            key: 'id'
        },
        allowNull: false
    },
    facilityId: {
        type: DataTypes.INTEGER,
        references: {
            model: Facility,
            key: 'id'
        },
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// TourPackage and Facility Many-to-Many relation
const TourPackageFacilities = sequelize.define('tour_package_facilities', {
    tourPackageId: {
        type: DataTypes.INTEGER,
        references: {
            model: TourPackage,
            key: 'id'
        },
        allowNull: false
    },
    facilityId: {
        type: DataTypes.INTEGER,
        references: {
            model: Facility,
            key: 'id'
        },
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// Travel and Facility Many-to-Many relation
const TravelFacilities = sequelize.define('travel_facilities', {
    travelId: {
        type: DataTypes.INTEGER,
        references: {
            model: Travel,
            key: 'id'
        },
        allowNull: false
    },
    facilityId: {
        type: DataTypes.INTEGER,
        references: {
            model: Facility,
            key: 'id'
        },
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

CarRent.belongsToMany(Facility, { through: CarRentFacilities, foreignKey: 'carRentId' });
Facility.belongsToMany(CarRent, { through: CarRentFacilities, foreignKey: 'facilityId' });

TourPackage.belongsToMany(Facility, { through: TourPackageFacilities, foreignKey: 'tourPackageId' });
Facility.belongsToMany(TourPackage, { through: TourPackageFacilities, foreignKey: 'facilityId' });

Travel.belongsToMany(Facility, { through: TravelFacilities, foreignKey: 'travelId' });
Facility.belongsToMany(Travel, { through: TravelFacilities, foreignKey: 'facilityId' });

export { TravelFacilities, CarRentFacilities, TourPackageFacilities };

