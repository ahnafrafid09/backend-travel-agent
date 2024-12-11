const Category = require("../models/Category.js");
const Translation = require("../models/Translation.js");
const SubCategory = require("../models/SubCategory.js");

const GetSubCategory = async (req, res) => {
    const { lang } = req.query;
    try {
        const response = await SubCategory.findAll({
            attributes: ["slug", "id"],
            include: [{
                model: Translation,
                attributes: ["attribute", "value", "lang"],
                where: lang ? { lang: lang } : {},
                as: "translations"
            }, {
                model: Category,
                attributes: ["slug", "id"],
                include: {
                    model: Translation, as: "translations",
                    attributes: ["attribute", "value"],
                    where: lang ? { lang: lang } : {},
                    as: "translations"
                }
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
    const { lang } = req.query;
    const { id } = req.params;
    try {
        const response = await SubCategory.findByPk(id, {
            attributes: ["slug", "id"],
            include: [{
                model: Translation,
                attributes: ["attribute", "value", "lang"],
                where: lang ? { lang: lang } : {},
                as: "translations"
            }, {
                model: Category,
                attributes: ["slug", "id"],
                include: {
                    model: Translation, as: "translations",
                    attributes: ["attribute", "value", "lang"],
                    where: lang ? { lang: lang } : {},
                    as: "translations"
                }
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
    try {
        const { slug, translations, categoryId } = req.body;

        const subCategory = await SubCategory.create({ slug, categoryId });

        if (translations && translations.length > 0) {
            await Translation.bulkCreate(translations.map(t => ({
                entityId: subCategory.id,
                lang: t.lang,
                entityType: 'sub_category',
                attribute: 'name_sub_category',
                value: t.name
            })));
        }

        res.status(201).json({ statusCode: 201, status: 'created', message: 'Sub Category created successfully', data: subCategory });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const UpdateSubCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const { slug, translations, categoryId } = req.body;

        const [updated] = await SubCategory.update({ slug, categoryId }, {
            where: { id }
        });

        if (updated) {
            await Translation.destroy({ where: { entityId: id, entityType: 'sub_category' } });
            if (translations && translations.length > 0) {
                await Translation.bulkCreate(translations.map(t => ({
                    entityId: id,
                    entityType: 'sub_category',
                    lang: t.lang,
                    attribute: 'name_sub_category',
                    value: t.name
                })));
            }
            res.status(200).json({ statusCode: 200, status: "success", message: 'Sub Category updated' });
        } else {
            res.status(404).json({ statusCode: 404, status: "not found", message: 'Sub Category not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const DeleteSubCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await SubCategory.destroy({ where: { id } });

        if (deleted) {
            res.status(200).json({ statusCode: 200, status: 'success', message: "Sub Category Deleted" });
        } else {
            res.status(404).json({ statusCode: 404, status: "not found", message: 'Sub Category not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

module.exports = {
    GetSubCategory,
    GetSubCategoryById,
    CreateSubCategory,
    UpdateSubCategory,
    DeleteSubCategory
};
