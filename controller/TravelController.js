const Category = require('../models/Category.js');
const Travel = require("../models/Travel.js");
const Translation = require('../models/Translation.js');
const Facility = require('../models/Facility.js');
const { TravelFacilities } = require("../models/RelationManyToMany.js");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require("fs");
const { fileURLToPath } = require('url');
const { dirname } = require('path');


const GetTravel = async (req, res) => {
    const { lang } = req.query;
    try {
        const response = await Travel.findAll({
            attributes: ['id', 'image_url', 'price', 'departure_schedule', 'departure_place', 'departure_destination'],
            include: [
                {
                    model: Translation,
                    attributes: ["attribute", "value"],
                    where: lang ? { lang: lang } : {},
                    as: "translations"
                },
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
                    model: Facility,
                    through: {
                        model: TravelFacilities,
                    },
                    include: {
                        model: Translation,
                        attributes: ['value', 'attribute'],
                        where: lang ? { lang: lang } : lang,
                        as: "translations",
                    }
                }
            ]
        });

        if (response.length === 0) return res.status(404).json({ statusCode: 404, status: "not found", message: "Travel Not Found" });
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Travel Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const GetTravelById = async (req, res) => {
    const { lang } = req.query;
    const { id } = req.params;
    try {
        const response = await Travel.findByPk(id, {
            attributes: ['id', 'image_url', 'price', 'departure_schedule', 'departure_place', 'departure_destination'],
            include: [
                {
                    model: Translation,
                    attributes: ["attribute", "value"],
                    where: lang ? { lang: lang } : {},
                    as: "translations"
                },
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
                    model: Facility,
                    through: {
                        model: TravelFacilities,
                        attributes: []
                    },
                    include: {
                        model: Translation,
                        attributes: ['value', 'attribute'],
                        where: lang ? { lang: lang } : lang,
                        as: "translations",
                    }
                }
            ]
        });

        if (!response) return res.status(404).json({ statusCode: 404, status: "not found", message: "Travel Not Found" });
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Travel Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const CreateTravel = async (req, res) => {
    try {
        if (!req.files || !req.files.image) return res.status(400).json({ message: "No image file uploaded" });

        const image = req.files.image;
        const imageSize = image.data.length;
        const ext = path.extname(image.name).toLowerCase();
        const imageName = uuidv4() + ext;
        const allowedType = ['.jpg', '.png', '.jpeg'];
        const filePath = `public/travel/${imageName}`;
        const url = `${req.protocol}://${req.get("host")}/public/travel/${imageName}`;

        if (!allowedType.includes(ext)) {
            return res.status(422).json({ message: "Images must be jpeg, jpg, png format" });
        }
        if (imageSize > 2000000) {
            return res.status(422).json({ message: "Images should not be more than 2MB" });
        }

        await new Promise((resolve, reject) => {
            image.mv(filePath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        const { categoryId, departureSchedule, departurePlace, departureDestination, facilityId, price, translations } = req.body;

        const travel = await Travel.create({
            categoryId,
            departure_schedule: departureSchedule,
            departure_place: departurePlace,
            departureDestination: departureDestination,
            price,
            image_url: url
        });

        if (translations && translations.length > 0) {
            await Translation.bulkCreate(translations.map(t => ({
                entityId: travel.id,
                lang: t.lang,
                entityType: 'travel',
                attribute: 'name_travel',
                value: t.name
            })));
        }

        if (facilityId || facilityId > 0) {
            const travelFacilities = JSON.parse(facilityId).map(facilityId => ({
                travelId: travel.id,
                facilityId,
            }));
            await TravelFacilities.bulkCreate(travelFacilities);
        }

        res.status(201).json({ statusCode: 201, status: 'created', message: 'Travel created successfully', data: travel });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const UpdateTravel = async (req, res) => {
    const { id } = req.params;
    try {
        const travel = await Travel.findByPk(id);
        if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
        }

        let imageUrl = travel.image_url;
        if (req.files && req.files.image) {
            const image = req.files.image;
            const imageSize = image.data.length;
            const ext = path.extname(image.name).toLowerCase();
            const imageName = uuidv4() + ext;
            imageUrl = `${req.protocol}://${req.get("host")}/public/travel/${imageName}`;

            const allowedType = ['.jpg', '.png', '.jpeg'];
            if (!allowedType.includes(ext)) {
                return res.status(422).json({ message: "Images must be jpeg, jpg, png format" });
            }
            if (imageSize > 2000000) {
                return res.status(422).json({ message: "Images should not be more than 2MB" });
            }

            const oldFilePath = path.join(__dirname, '..', 'public', 'travel', path.basename(travel.image_url));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            await new Promise((resolve, reject) => {
                image.mv(`public/travel/${imageName}`, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        const { categoryId, departureSchedule, departurePlace, departureDestination, facilityId, price, translations } = req.body;

        await Travel.update({
            categoryId,
            departure_schedule: departureSchedule,
            departure_place: departurePlace,
            departureDestination: departureDestination,
            price,
            image_url: imageUrl
        }, {
            where: { id }
        });

        if (translations && translations.length > 0) {
            await Translation.bulkCreate(translations.map(t => ({
                entityId: travel.id,
                lang: t.lang,
                entityType: 'travel',
                attribute: 'name_travel',
                value: t.name
            })));
        }

        if (facilityId && facilityId.length > 0) {
            const facilityIds = JSON.parse(facilityId);

            await TravelFacilities.destroy({ where: { travelId: id } });

            const travelFacilities = facilityIds.map(facilityId => ({
                travelId: id,
                facilityId
            }));
            await TravelFacilities.bulkCreate(travelFacilities);
        }

        res.status(200).json({ statusCode: 200, status: 'updated', message: 'Travel updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const DeleteTravel = async (req, res) => {
    const { id } = req.params;
    try {
        const travel = await Travel.findByPk(id);
        if (!travel) {
            return res.status(404).json({ message: "Travel not found" });
        }

        const imagePath = travel.image_url.split(`${req.protocol}://${req.get("host")}/`)[1];
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Travel.destroy({ where: { id } });
        await TravelFacilities.destroy({ where: { travelId: id } });
        res.status(204).json({ statusCode: 204, message: 'Travel deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

module.exports = {
    GetTravel,
    GetTravelById,
    CreateTravel,
    UpdateTravel,
    DeleteTravel
};
