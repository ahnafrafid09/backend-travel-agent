const Category = require("../models/Category.js");
const Translation = require("../models/Translation.js");

const GetCategory = async (req, res) => {
    const { lang } = req.query;
    try {
        const response = await Category.findAll({
            attributes: ["slug", "id"],
            include: {
                model: Translation, as: "translations",
                attributes: ["attribute", "value", "lang"],
                where: lang ? { lang: lang } : {},
                as: "translations"
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
    const { lang } = req.query;
    const { id } = req.params;
    try {
        const response = await Category.findByPk(id, {
            attributes: ["slug", "id"],
            include: {
                model: Translation, as: "translations",
                attributes: ["attribute", "value", "lang"],
                where: lang ? { lang: lang } : {},
                as: "translations"
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
    try {
        const { slug, translations } = req.body;

        const category = await Category.create({ slug });

        if (translations && translations.length > 0) {
            await Translation.bulkCreate(translations.map(t => ({
                entityId: category.id,
                lang: t.lang,
                entityType: 'category',
                attribute: 'category_name',
                value: t.name,
            })));
        }

        res.status(201).json({ statusCode: 201, status: 'created', message: 'Category created successfully', data: category });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}

const UpdateCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const { slug, translations } = req.body;

        const [updated] = await Category.update({ slug }, {
            where: { id }
        });

        if (updated) {
            await Translation.destroy({ where: { entityId: id, entityType: 'category' } });
            if (translations && translations.length > 0) {
                await Translation.bulkCreate(translations.map(t => ({
                    entityId: id,
                    entityType: 'category',
                    attribute: 'name_category',
                    lang: t.lang,
                    value: t.name
                })));
            }
            res.status(200).json({ statusCode: 200, status: "success", message: 'Category updated' });
        } else {
            res.status(404).json({ statusCode: 404, status: "not found", message: 'Category not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const DeleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Category.destroy({ where: { id } });

        if (deleted) {
            await Translation.destroy({ where: { entityId: id, entityType: 'category' } });
            res.status(200).json({ statusCode: 200, status: 'success', message: "Category Deleted" });
        } else {
            res.status(404).json({ statusCode: 404, status: "not found", message: 'Category not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

module.exports = {
    GetCategory, GetCategoryById, CreateCategory, UpdateCategory, DeleteCategory
}