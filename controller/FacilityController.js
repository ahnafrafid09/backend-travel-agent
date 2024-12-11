const Category = require("../models/Category.js");
const Facility = require("../models/Facility.js");
const Translation = require("../models/Translation.js");

const GetFacility = async (req, res) => {
    const { lang } = req.query;
    try {
        const response = await Facility.findAll({
            attributes: ['uuid_facility'],
            include: [{
                model: Translation,
                attributes: ['attribute', 'value', 'lang'],
                where: lang ? { lang: lang } : {},
                as: "translations"
            }, {
                model: Category,
                include: [{
                    model: Translation,
                    attributes: ['attribute', 'value', 'lang'],
                    where: lang ? { lang: lang } : {},
                    as: "translations"
                }]
            }]
        });
        // if (response.length === 0) return res.status(404).json({ statusCode: 404, status: "not found", message: "Facility Not Found" });
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Facility Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const GetFacilityByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params

        if (!categoryId) return res.status(400).json({ message: "Category Not Found" })

        const facilities = await Facility.findAll({
            attributes: ['uuid_facility'],
            include: [{
                model: Translation,
                attributes: ['attribute', 'value', 'lang'],
                where: lang ? { lang: lang } : {},
                as: "translations"
            }, {
                model: Category,
                include: [{
                    model: Translation,
                    attributes: ['attribute', 'value', 'lang'],
                    where: lang ? { lang: lang } : {},
                    as: "translations"
                }]
            }]
        })

        if (facilities.length === 0) return res.status(404).json({ statusCode: 404, status: "not found", message: "Facility Not Found" });

        res.status(200).json({ statusCode: 200, status: "success", message: "Search Facility Success", data: facilities });

    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}

const GetFacilityById = async (req, res) => {
    const { id } = req.params;
    const { lang } = req.query;
    try {
        const response = await Facility.findByPk(id, {
            attributes: ['uuid_facility'],
            include: [{
                model: Translation,
                attributes: ['attribute', 'value', 'lang'],
                where: lang ? { lang: lang } : {},
                as: "translations"
            }, {
                model: Category,
                include: [{
                    model: Translation,
                    attributes: ['attribute', 'value', 'lang'],
                    where: lang ? { lang: lang } : {},
                    as: "translations"
                }]
            }]
        });

        if (!response) return res.status(404).json({ statusCode: 404, status: "not found", message: "Facility Not Found" });
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Facility Success", data: response });

    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const CreateFacility = async (req, res) => {
    try {
        const { categoryId, translations } = req.body;

        const facility = await Facility.create({ categoryId });

        if (translations && translations.length > 0) {
            await Translation.bulkCreate(translations.map(t => ({
                entityId: facility.uuid_facility,
                lang: t.lang,
                entityType: 'facility',
                attribute: 'name_facility',
                value: t.name
            })));
        }
        res.status(201).json({ statusCode: 201, status: 'created', message: 'Facility created successfully', data: facility });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const UpdateFacility = async (req, res) => {
    const { id } = req.params;
    try {
        const { categoryId, translations } = req.body;

        const [updated] = await Facility.update({ categoryId }, {
            where: { uuid_facility: id }
        });

        if (updated) {
            await Translation.destroy({ where: { entityId: id, entityType: 'facility' } });
            if (translations && translations.length > 0) {
                await Translation.bulkCreate(translations.map(t => ({
                    entityId: id,
                    entityType: 'facility',
                    attribute: 'name_facility',
                    lang: t.lang,
                    value: t.name
                })));
            }
            res.status(200).json({ statusCode: 200, status: "success", message: 'Facility updated' });
        } else {
            res.status(404).json({ statusCode: 404, status: "not found", message: 'Facility not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const DeleteFacility = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Facility.destroy({ where: { uuid_facility: uuid_facility } });

        if (deleted) {
            await Translation.destroy({ where: { entityId: id, entityType: 'facility' } });
            res.status(200).json({ statusCode: 200, status: 'success', message: "Facility Deleted" });
        } else {
            res.status(404).json({ statusCode: 404, status: "not found", message: 'Facility not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

module.exports = {
    GetFacility, GetFacilityById, CreateFacility, UpdateFacility, DeleteFacility, GetFacilityByCategory
}
