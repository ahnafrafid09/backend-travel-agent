const sequelize = require("../config/database");
const { IncludeLanguage } = require("../helper/IncludeLanguage");
const Category = require("../models/data_master/Category");
const Facility = require("../models/data_master/Facility");
const Language = require("../models/data_master/Language");
const CategoryTranslation = require("../models/translation/CategoryTranslation");
const FacilityTranslation = require("../models/translation/FacilityTranslation");

const GetFacility = async (req, res) => {
    const { language } = req;
    try {
        const response = await Facility.findAll({
            attributes: ['uuid_facility'],
            include: [{
                model: FacilityTranslation,
                attributes: ["name"],
                as: "translations",
                include: IncludeLanguage(language.slug)
            }, {
                model: Category,
                as: "category",
                attributes: ["slug"],
                include: [{
                    model: CategoryTranslation,
                    attributes: ["name"],
                    as: "translations",
                    include: IncludeLanguage(language.slug)
                }]
            }]
        });
        if (response.length === 0) return res.status(404).json({ statusCode: 404, status: "not found", message: "Facility Not Found" });
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Facility Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const GetFacilityByCategory = async (req, res) => {
    const { categoryId } = req.params
    const { language } = req
    try {

        if (!categoryId) return res.status(400).json({ message: "Category Not Found" })

        const facilities = await Facility.findAll({
            attributes: ['uuid_facility'],
            include: [{
                model: FacilityTranslation,
                attributes: ["name"],
                as: "translations",
                include: IncludeLanguage(language.slug)
            }, {
                model: Category,
                as: "category",
                attributes: ["slug"],
                include: [{
                    model: CategoryTranslation,
                    attributes: ["name"],
                    as: "translations",
                    include: IncludeLanguage(language.slug)
                }]
            }]
        }, { where: categoryId });

        if (facilities.length === 0) return res.status(404).json({ statusCode: 404, status: "not found", message: "Facility Not Found" });

        res.status(200).json({ statusCode: 200, status: "success", message: "Search Facility Success", data: facilities });

    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}

const GetFacilityById = async (req, res) => {
    const { uuid_facility } = req.params;
    const { language } = req;
    try {
        const response = await Facility.findByPk(uuid_facility, {
            attributes: ['uuid_facility'],
            include: [{
                model: FacilityTranslation,
                attributes: ["name"],
                as: "translation",
                include: IncludeLanguage(language.slug)
            }, {
                model: Category,
                as: "category",
                attributes: ["slug"],
                include: [{
                    model: CategoryTranslation,
                    attributes: ["name"],
                    as: "translations",
                    include: IncludeLanguage(language.slug)
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
    const transaction = await sequelize.transaction()
    try {
        const { categoryId, translations } = req.body;

        const facility = await Facility.create({ categoryId }, { transaction });

        if (!translations && translations.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "Translations field is required"
            });
        }
        const validLanguages = await Language.findAll({
            attributes: ["id"],
            raw: true
        });
        const validLangIds = validLanguages.map(lang => lang.id);

        const validTranslations = translations.filter(t => validLangIds.includes(t.langId));

        if (validTranslations.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "All provided language are invalid"
            });
        }
        await FacilityTranslation.bulkCreate(
            validTranslations.map(t => ({
                facilityUUID: facility.uuid_facility,
                langId: t.langId,
                name: t.name
            })),
            { transaction }
        );
        await transaction.commit()
        res.status(201).json({ statusCode: 201, status: 'created', message: 'Facility created successfully', data: facility });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const UpdateFacility = async (req, res) => {
    const transaction = await sequelize.transaction()
    const { uuid_facility } = req.params
    try {
        const { categoryId, translations } = req.body;
        const facility = await Facility.findByPk(uuid_facility)
        if (!facility) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Facility not found",
            });
        }
        if (categoryId) {
            facility.cateogryId = categoryId;
            await facility.save({ transaction });
        }

        if (translations && translations.length > 0) {
            const validLanguages = await Language.findAll({
                attributes: ["id"],
                raw: true,
            });
            const validLangIds = validLanguages.map(lang => lang.id);

            const validTranslations = translations.filter(t =>
                validLangIds.includes(t.langId) && t.name
            );

            const existingTranslations = await FacilityTranslation.findAll({
                where: { facilityUUID: facility.uuid_facility },
                transaction,
            });

            const existingLangIds = existingTranslations.map(et => et.langId);

            for (const t of validTranslations) {
                if (existingLangIds.includes(t.langId)) {
                    const translation = existingTranslations.find(et => et.langId === t.langId);
                    translation.name = t.name;
                    await translation.save({ transaction });
                } else {
                    await FacilityTranslation.create({
                        facilityUUID: facility.uuid_facility,
                        langId: t.langId,
                        name: t.name,
                    }, { transaction });
                }
            }
        }


        await transaction.commit();

        const updatedTranslations = await FacilityTranslation.findAll({
            where: { facilityUUID: facility.uuid_facility },
        });
        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Facility updated successfully",
            data: {
                id: facility.uuid_facility,
                translations: updatedTranslations,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const DeleteFacility = async (req, res) => {
    const { uuid_facility } = req.params;
    const transaction = await sequelize.transaction()
    try {
        const facility = await Facility.findByPk(uuid_facility)
        if (!facility) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Facility not found",
            });
        }
        await facility.destroy({ transaction });

        await transaction.commit()

        res.status(200).json({ statusCode: 200, status: 'success', message: "Facility Deleted" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

module.exports = {
    GetFacility, GetFacilityById, CreateFacility, UpdateFacility, DeleteFacility, GetFacilityByCategory
}
