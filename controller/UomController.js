const sequelize = require("../config/database.js");
const Uom = require("../models/data_master/Uom.js")
const Language = require("../models/data_master/Language.js");
const UomTranslation = require("../models/translation/UomTranslation.js");
const { IncludeLanguage } = require("../helper/IncludeLanguage.js");

const GetUom = async (req, res) => {
    const { language } = req
    try {
        const response = await Uom.findAll({
            attributes: ["id"],
            include: {
                model: UomTranslation,
                attributes: ["name"],
                as: "translations",
                include: IncludeLanguage(language.slug)
            }
        });
        if (response.length === 0)
            return res.status(404).json({ statusCode: 404, status: "not found", message: "Uom Not Found" });

        res.status(200).json({ statusCode: 200, status: "success", message: "Search Uom Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}

const GetUomById = async (req, res) => {
    const { id } = req.params;
    const { language } = req
    try {
        const response = await Uom.findByPk(id, {
            attributes: ["id"],
            include: {
                model: UomTranslation,
                attributes: ["name"],
                as: "translations",
                include: IncludeLanguage(language.slug)
            }
        });
        if (!response)
            return res.status(404).json({ statusCode: 404, status: "not found", message: "Uom Not Found" });

        res.status(200).json({ statusCode: 200, status: "success", message: "Search Uom Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}

const CreateUom = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { translations } = req.body
        const uom = await Uom.create({ transaction });
        if (!translations || translations.length === 0) {
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

        await UomTranslation.bulkCreate(
            validTranslations.map(t => ({
                uomId: uom.id,
                langId: t.langId,
                name: t.name
            })),
            { transaction }
        );
        await transaction.commit();

        res.status(201).json({
            statusCode: 201,
            status: "success",
            message: "Uom created successfully",
            data: uom
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(500).json({
            statusCode: 500,
            status: "internal server error",
            message: "Internal Server Error",
            error: error
        });
    }
};


const UpdateUom = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { translations } = req.body;

        const uom = await Uom.findByPk(id);
        if (!uom) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Uom not found",
            });
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

            const existingTranslations = await UomTranslation.findAll({
                where: { uomId: uom.id },
                transaction,
            });

            const existingLangIds = existingTranslations.map(et => et.langId);

            for (const t of validTranslations) {
                if (existingLangIds.includes(t.langId)) {
                    const translation = existingTranslations.find(et => et.langId === t.langId);
                    translation.name = t.name;
                    await translation.save({ transaction });
                } else {
                    await UomTranslation.create({
                        uomId: uom.id,
                        langId: t.langId,
                        name: t.name,
                    }, { transaction });
                }
            }
        }


        await transaction.commit();

        const updatedTranslations = await UomTranslation.findAll({
            where: { uomId: uom.id },
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Uom updated successfully",
            data: {
                id: uom.id,
                translations: updatedTranslations,
            },
        });
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        res.status(500).json({
            statusCode: 500,
            status: "internal server error",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



const DeleteUom = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        const uom = await Uom.findByPk(id);
        if (!uom) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Uom not found",
            });
        }

        await uom.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Uom and related translations deleted successfully",
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(500).json({
            statusCode: 500,
            status: "internal server error",
            message: "Internal Server Error",
            error: error,
        });
    }
};


module.exports = {
    GetUom, GetUomById, CreateUom, UpdateUom, DeleteUom
}