const sequelize = require("../config/database.js");
const Language = require("../models/data_master/Language.js");
const path = require('path');
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { where } = require("sequelize");

const GetLanguage = async (req, res) => {
    try {
        const response = await Language.findAll({
            attributes: ["slug", "name", "file_flag", 'id'],
        });
        if (response.length === 0)
            return res.status(404).json({ statusCode: 404, status: "not found", message: "Language Not Found" });

        res.status(200).json({ statusCode: 200, status: "success", message: "Search Language Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}

const GetLanguageById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Language.findByPk(id, {
            attributes: ["slug", "id", "name"],
        });
        if (!response)
            return res.status(404).json({ statusCode: 404, status: "not found", message: "Language Not Found" });

        res.status(200).json({ statusCode: 200, status: "success", message: "Search Language Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}
const GetLanguageBySlug = async (slug) => {
    try {
        const response = await Language.findOne({
            attributes: ["slug", "id"],
            where: { slug }
        });
        return response;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch language");
    }
};

const CreateLanguage = async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "No image file uploaded"
            });
        }
        const image = req.files.image;
        const imageSize = image.data.length;
        const ext = path.extname(image.name).toLowerCase();
        const imageName = uuidv4() + ext;
        const allowedType = ['.jpg', '.png', '.jpeg'];
        const filePath = `public/flag/${imageName}`;
        const url = `${req.protocol}://${req.get("host")}/public/flag/${imageName}`;

        if (!allowedType.includes(ext)) {
            return res.status(415).json({
                statusCode: 415,
                status: "Unsupported Media Type",
                message: "Images must be jpeg, jpg, png format"
            });
        }

        if (imageSize > 2000000) {
            return res.status(413).json({
                statusCode: 413,
                status: "Content Too Large",
                message: "Images should not be more than 2MB"
            });
        }

        await new Promise((resolve, reject) => {
            image.mv(filePath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
        const { slug, name } = req.body;

        const existingLanguage = await Language.findOne({
            where: {
                slug: slug
            }
        })

        let language

        if (existingLanguage) {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "Slug already in use"
            });
        } else {
            language = await Language.create({
                slug: slug, name, file_flag: url
            });
        }

        res.status(201).json({ statusCode: 201, status: 'created', message: 'Language created successfully', data: language });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}

const UpdateLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const { slug, name } = req.body;

        const language = await Language.findOne({
            where: { id }
        });
        if (!language) {
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Language not found",
            });
        }

        let imageUrl = language.file_flag;
        if (req.files && req.files.image) {
            const image = req.files.image;
            const imageSize = image.data.length;
            const ext = path.extname(image.name).toLowerCase();
            const imageName = uuidv4() + ext;
            const allowedType = ['.jpg', '.png', '.jpeg'];
            imageUrl = `${req.protocol}://${req.get("host")}/public/flag/${imageName}`;

            if (!allowedType.includes(ext)) {
                return res.status(422).json({ message: "Images must be jpeg, jpg, png format" });
            }
            if (imageSize > 2000000) {
                return res.status(422).json({ message: "Images should not be more than 2MB" });
            }


            const oldFilePath = path.join(__dirname, '..', 'public', 'flag', path.basename(language.file_flag));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            await new Promise((resolve, reject) => {
                image.mv(`public/flag/${imageName}`, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }
        if (slug && slug !== language.slug) {
            const existingLanguage = await Language.findOne({
                where: { slug },
            });

            if (existingLanguage) {
                return res.status(400).json({
                    statusCode: 400,
                    status: "Bad Request",
                    message: "Slug already in use",
                });
            }
            language.slug = slug;
        }
        if (name) language.name = name;
        if (imageUrl) language.file_flag = imageUrl;

        await language.save()
        // await Language.update({ slug, name, file_flag: imageUrl }, { where: { id: id } });

        res.status(200).json({
            statusCode: 200,
            status: 'success',
            message: 'Language updated successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            status: "internal server error",
            message: "Internal Server Error",
            error: error,
        });
    }
};


const DeleteLanguage = async (req, res) => {
    try {
        const { id } = req.params;

        const language = await Language.findByPk(id);
        if (!language) {

            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Language not found",
            });
        }

        await Language.destroy({
            where: {
                id: id,
            },
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Language deleted successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            statusCode: 500,
            status: "internal server error",
            message: "Internal Server Error",
            error: error,
        });
    }
};


module.exports = {
    GetLanguage, GetLanguageById, GetLanguageBySlug, CreateLanguage, UpdateLanguage, DeleteLanguage
}