const sequelize = require("../config/database");
const { IncludeLanguage } = require("../helper/IncludeLanguage");
const Category = require("../models/data_master/Category");
const Language = require("../models/data_master/Language");
const SubCategory = require("../models/data_master/SubCategory");
const CategoryTranslation = require("../models/translation/CategoryTranslation");
const SubCategoryTranslation = require("../models/translation/SubCategoryTranslation");

const GetSubCategory = async (req, res) => {
    const { language } = req;
    try {
        const response = await SubCategory.findAll({
            attributes: ["slug", "id"],
            include: [{
                model: SubCategoryTranslation,
                attributes: ["name"],
                as: "translations",
                include: IncludeLanguage(language.slug)
            }, {
                model: Category,
                as: "category",
                attributes: ["slug", "id"],
                include: [{
                    model: CategoryTranslation,
                    attributes: ["name"],
                    as: "translations",
                    include: IncludeLanguage(language.slug)
                }]
            }]
        });
        if (response.length === 0) return res.status(404).json({ statusCode: 404, status: "not found", message: "Sub Category Not Found" });
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Sub Category Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const GetSubCategoryById = async (req, res) => {
    const { language } = req;
    const { id } = req.params;
    try {
        const response = await SubCategory.findByPk(id, {
            attributes: ["slug", "id"],
            include: [{
                model: SubCategoryTranslation,
                attributes: ["name"],
                as: "translations",
                include: IncludeLanguage(language.slug)
            }, {
                model: Category,
                as: "category",
                attributes: ["slug", "id"],
                include: [{
                    model: CategoryTranslation,
                    attributes: ["name"],
                    as: "translations",
                    include: IncludeLanguage(language.slug)
                }]
            }]
        });
        if (response === null) return res.status(404).json({ statusCode: 404, status: "not found", message: "Sub Category Not Found" });
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Sub Category Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const CreateSubCategory = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { slug, translations, categoryId } = req.body;

        if (!slug) {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "Slug is required"
            });
        }

        const existingSubCategory = await SubCategory.findOne({
            where: {
                slug: slug
            }
        });

        let subCategory

        if (existingSubCategory) {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "Slug already in use"
            });
        } else {
            subCategory = await SubCategory.create({
                slug: slug,
                categoryId
            }, { transaction });
        }

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

        await SubCategoryTranslation.bulkCreate(
            validTranslations.map(t => ({
                subCategoryId: subCategory.id,
                langId: t.langId,
                name: t.name
            })),
            { transaction }
        );
        await transaction.commit();

        res.status(201).json({
            statusCode: 201,
            status: "success",
            message: "Category created successfully",
            data: subCategory
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

const UpdateSubCategory = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { slug, translations, categoryId } = req.body;

        const subCategory = await SubCategory.findByPk(id);
        if (!subCategory) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Sub Category not found",
            });
        }

        if (slug) {
            subCategory.slug = slug;
            await subCategory.save({ transaction });
        }
        if (categoryId) {
            subCategory.categoryId = categoryId;
            await subCategory.save({ transaction });
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

            const existingTranslations = await SubCategoryTranslation.findAll({
                where: { subCategoryId: subCategory.id },
                transaction,
            });

            const existingLangIds = existingTranslations.map(et => et.langId);

            for (const t of validTranslations) {
                if (existingLangIds.includes(t.langId)) {
                    const translation = existingTranslations.find(et => et.langId === t.langId);
                    translation.name = t.name;
                    await translation.save({ transaction });
                } else {
                    await SubCategoryTranslation.create({
                        subCategoryId: subCategory.id,
                        langId: t.langId,
                        name: t.name,
                    }, { transaction });
                }
            }
        }


        await transaction.commit();

        const updatedTranslations = await SubCategoryTranslation.findAll({
            where: { subCategoryId: subCategory.id },
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Sub category updated successfully",
            data: {
                id: subCategory.id,
                slug: subCategory.slug,
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

const DeleteSubCategory = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        const subCategory = await SubCategory.findByPk(id);
        if (!subCategory) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Sub category not found",
            });
        }

        await subCategory.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Sub category and related translations deleted successfully",
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
    GetSubCategory,
    GetSubCategoryById,
    CreateSubCategory,
    UpdateSubCategory,
    DeleteSubCategory
};
