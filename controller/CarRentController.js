const Category = require('../models/Category.js');
const SubCategory = require('../models/SubCategory.js');
const CarRent = require("../models/CarRent.js");
const Translation = require('../models/Translation.js');
const Facility = require('../models/Facility.js');
const { CarRentFacilities } = require("../models/RelationManyToMany.js");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require("fs");
const { fileURLToPath } = require('url');

const GetCarRent = async (req, res) => {
    const { lang } = req.query;
    try {
        const response = await CarRent.findAll({
            attributes: ['id', 'image_url', 'car_name', 'price', 'capasity', 'model_year'],
            include: [
                {
                    model: Category,
                    attributes: ["slug", "id"],
                    include: {
                        model: Translation,
                        attributes: ["attribute", "value"],
                        where: lang ? { lang: lang } : {},
                        as: "translations"
                    }
                },
                {
                    model: SubCategory,
                    attributes: ["slug", "id"],
                    include: {
                        model: Translation,
                        attributes: ["attribute", "value"],
                        where: lang ? { lang: lang } : {},
                        as: "translations"
                    }
                },
                {
                    model: Facility,
                    through: {
                        model: CarRentFacilities,
                    },
                    include: {
                        model: Translation,
                        attributes: ['value', 'attribute'],
                        where: lang ? { lang: lang } : {},
                        as: "translations",
                    }
                }
            ]
        });

        if (response.length === 0) {
            return res.status(404).json({ statusCode: 404, status: "not found", message: "Car Rent Not Found" });
        }
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Car Rent Success", data: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const GetCarRentById = async (req, res) => {
    const { lang } = req.query;
    const { id } = req.params;
    try {
        const response = await CarRent.findByPk(id, {
            attributes: ['id', 'image_url', 'car_name', 'price', 'capasity', 'model_year'],
            include: [
                {
                    model: Category,
                    attributes: ["slug", "id"],
                    include: {
                        model: Translation,
                        attributes: ["attribute", "value"],
                        where: lang ? { lang: lang } : {},
                        as: "translations"
                    }
                },
                {
                    model: SubCategory,
                    attributes: ["slug", "id"],
                    include: {
                        model: Translation,
                        attributes: ["attribute", "value"],
                        where: lang ? { lang: lang } : {},
                        as: "translations"
                    }
                },
                {
                    model: Facility,
                    through: {
                        model: CarRentFacilities,
                    },
                    include: {
                        model: Translation,
                        attributes: ['value', 'attribute'],
                        where: lang ? { lang: lang } : {},
                        as: "translations",
                    }
                }
            ]
        });

        if (!response) {
            return res.status(404).json({ statusCode: 404, status: "not found", message: "Car Rent Not Found" });
        }
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Car Rent Success", data: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const CreateCarRent = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "No image file uploaded" });
        }

        const image = req.files.image;
        const imageSize = image.data.length;
        const ext = path.extname(image.name).toLowerCase();
        const imageName = uuidv4() + ext;
        const allowedType = ['.jpg', '.png', '.jpeg'];
        const filePath = `public/car-rent/${imageName}`;
        const url = `${req.protocol}://${req.get("host")}/public/car-rent/${imageName}`;

        if (!allowedType.includes(ext)) {
            return res.status(422).json({ message: "Images must be jpeg, jpg, png format" });
        }
        if (imageSize > 2000000) {
            return res.status(422).json({ message: "Images should not be more than 2MB" });
        }

        await image.mv(filePath);

        const { categoryId, carName, subCategoryId, facilityId, price, capasity, modelYear } = req.body;

        const carRent = await CarRent.create({
            categoryId,
            car_name: carName,
            subCategoryId,
            price,
            capasity,
            model_year: modelYear,
            image_url: url
        });

        if (facilityId) {
            const carRentFacilities = JSON.parse(facilityId).map(facilityId => ({
                carRentId: carRent.id,
                facilityId,
            }));
            await CarRentFacilities.bulkCreate(carRentFacilities);
        }

        res.status(201).json({ statusCode: 201, status: 'created', message: 'Car rent created successfully', data: carRent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const UpdateCarRent = async (req, res) => {
    const { id } = req.params;
    try {
        const carRent = await CarRent.findByPk(id);
        if (!carRent) {
            return res.status(404).json({ message: "Car Rent not found" });
        }

        let imageUrl = carRent.image_url;
        if (req.files && req.files.image) {
            const image = req.files.image;
            const imageSize = image.data.length;
            const ext = path.extname(image.name).toLowerCase();
            const imageName = uuidv4() + ext;
            imageUrl = `${req.protocol}://${req.get("host")}/public/car-rent/${imageName}`;

            const allowedType = ['.jpg', '.png', '.jpeg'];
            if (!allowedType.includes(ext)) {
                return res.status(422).json({ message: "Images must be jpeg, jpg, png format" });
            }
            if (imageSize > 2000000) {
                return res.status(422).json({ message: "Images should not be more than 2MB" });
            }

            const oldFilePath = path.join(__dirname, '..', 'public', 'car-rent', path.basename(carRent.image_url));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            await image.mv(`public/car-rent/${imageName}`);
        }

        const { categoryId, carName, subCategoryId, facilityId, price, capasity, modelYear } = req.body;

        await CarRent.update({
            categoryId,
            car_name: carName,
            subCategoryId,
            price,
            capasity,
            model_year: modelYear,
            image_url: imageUrl
        }, {
            where: { id }
        });

        if (facilityId) {
            const facilityIds = JSON.parse(facilityId);
            await CarRentFacilities.destroy({ where: { carRentId: id } });

            const carRentFacilities = facilityIds.map(facilityId => ({
                carRentId: id,
                facilityId
            }));
            await CarRentFacilities.bulkCreate(carRentFacilities);
        }

        res.status(200).json({ statusCode: 200, status: 'updated', message: 'Car rent updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const DeleteCarRent = async (req, res) => {
    const { id } = req.params;
    try {
        const carRent = await CarRent.findByPk(id);
        if (!carRent) {
            return res.status(404).json({ message: "Car Rent not found" });
        }

        const imagePath = carRent.image_url.split(`${req.protocol}://${req.get("host")}/`)[1];
        const fullImagePath = path.join(__dirname, '..', 'public', imagePath);
        if (fs.existsSync(fullImagePath)) {
            fs.unlinkSync(fullImagePath);
        }

        await CarRentFacilities.destroy({
            where: { carRentId: id }
        });

        await CarRent.destroy({
            where: { id }
        });

        res.status(200).json({ statusCode: 200, status: 'deleted', message: 'Car Rent deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

module.exports = {
    GetCarRent, GetCarRentById, CreateCarRent, UpdateCarRent, DeleteCarRent
}
