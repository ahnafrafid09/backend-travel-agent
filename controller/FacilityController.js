import Facility from "../models/Facility.js";
import Translation from "../models/Translation.js";

export const GetFacility = async (req, res) => {
    const { lang } = req.query
    try {
        const response = await Facility.findAll({
            attributes: ['id', 'facility_type'],
            include: [{
                model: Translation,
                attributes: ['attribute', 'value'],
                where: lang ? { lang: lang } : {},
                as: "translations"
            }]
        })
        if (response.length === 0) return res.status(404).json({ statusCode: 404, status: "not found", message: "Facility Not Found" })
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Facility Success", data: response })
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "Internal Server Error" })
    }
}

export const GetFacilityById = async (req, res) => {
    const { id } = req.params;
    const { lang } = req.query
    try {
        const response = await Facility.findByPk(id, {
            include: [{
                model: Translation,
                attributes: ['attribute', 'value'],
                where: lang ? { lang: lang } : {},
                as: "translations"
            }]
        });

        if (!response) return res.status(404).json({ statusCode: 404, status: "not found", message: "Facility Not Found" })
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Facility Success", data: response })

    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "Internal Server Error" })
    }
};


export const CreateFacility = async (req, res) => {
    try {
        const { facilityType, translations } = req.body;

        const facility = await Facility.create({ facility_type: facilityType });
        console.log('Facility created with ID:', facility.id);

        if (translations && translations.length > 0) {
            await Translation.bulkCreate(translations.map(t => ({
                entityId: facility.id,
                lang: t.lang,
                entityType: 'facility',
                attribute: 'name_facility',
                value: t.name
            })));
            console.log('Translations added successfully.');
        }
        res.status(201).json({ statusCode: 201, status: 'created', message: 'Facility created successfully', data: facility });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "Internal Server Error" });
    }
}

export const UpdateFacility = async (req, res) => {
    const { id } = req.params;
    try {
        const { facilityType, translations } = req.body;

        const [updated] = await Facility.update({ facility_type: facilityType }, {
            where: { id }
        });

        if (updated) {
            await Translation.destroy({ where: { entityId: id, entityType: 'facility' } });
            if (translations && translations.length > 0) {
                await Translation.bulkCreate(translations.map(t => ({
                    entityId: id,
                    entityType: 'facility',
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
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "Internal Server Error" });
    }
};


export const DeleteFacility = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Facility.destroy({ where: { id } });

        if (deleted) {
            res.status(200).json({ statusCode: 200, status: 'success', message: "Facility Deleted" });
        } else {
            res.status(404).json({ statusCode: 404, status: "not found", message: 'Facility not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "Internal Server Error" });
    }
};
