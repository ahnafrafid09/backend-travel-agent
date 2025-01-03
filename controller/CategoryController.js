const sequelize = require("../config/database.js");
const { IncludeLanguage } = require("../helper/IncludeLanguage.js");
const Category = require("../models/data_master/Category.js");
const Language = require("../models/data_master/Language.js");
const CategoryTranslation = require("../models/translation/CategoryTranslation.js");
const { GetLanguageById, GetLanguageBySlug } = require("./LanguageController.js");

const GetCategory = async (req, res) => {
    const { language } = req
    try {
        const response = await Category.findAll({
            attributes: ["slug", "id"],
            include: {
                model: CategoryTranslation,
                attributes: ["name"],
                as: "translations",
                include: IncludeLanguage(language.slug)
            }
        });
        if (response.length === 0)
            return res.status(404).json({ statusCode: 404, status: "not found", message: "Category Not Found" });

        res.status(200).json({ statusCode: 200, status: "success", message: "Search Category Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}

const GetCategoryById = async (req, res) => {
    const { id } = req.params;
    const { language } = req
    try {
        const response = await Category.findByPk(id, {
            attributes: ["slug", "id"],
            include: {
                model: CategoryTranslation,
                attributes: ["name"],
                as: "translations",
                include: IncludeLanguage(language.slug)
            }
        });
        if (!response)
            return res.status(404).json({ statusCode: 404, status: "not found", message: "Category Not Found" });

        res.status(200).json({ statusCode: 200, status: "success", message: "Search Category Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}

const CreateCategory = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { slug, translations } = req.body;

        if (!slug) {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "Slug is required"
            });
        }

        const existingCategory = await Category.findOne({
            where: {
                slug: slug
            }
        });

        let category

        if (existingCategory) {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "Slug already in use"
            });
        } else {
            category = await Category.create({
                slug: slug
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

        await CategoryTranslation.bulkCreate(
            validTranslations.map(t => ({
                categoryId: category.id,
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
            data: category
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


const UpdateCategory = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { slug, translations } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Category not found",
            });
        }

        if (slug) {
            category.slug = slug;
            await category.save({ transaction });
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

            const existingTranslations = await CategoryTranslation.findAll({
                where: { categoryId: category.id },
                transaction,
            });

            const existingLangIds = existingTranslations.map(et => et.langId);

            for (const t of validTranslations) {
                if (existingLangIds.includes(t.langId)) {
                    const translation = existingTranslations.find(et => et.langId === t.langId);
                    translation.name = t.name;
                    await translation.save({ transaction });
                } else {
                    await CategoryTranslation.create({
                        categoryId: category.id,
                        langId: t.langId,
                        name: t.name,
                    }, { transaction });
                }
            }
        }


        await transaction.commit();

        const updatedTranslations = await CategoryTranslation.findAll({
            where: { categoryId: category.id },
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Category updated successfully",
            data: {
                id: category.id,
                slug: category.slug,
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



const DeleteCategory = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        const category = await Category.findByPk(id);
        if (!category) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Category not found",
            });
        }

        await category.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Category and related translations deleted successfully",
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
    GetCategory, GetCategoryById, CreateCategory, UpdateCategory, DeleteCategory
}