const Language = require("../models/data_master/Language");

const VerifyLanguage = async (req, res, next) => {
    const { lang } = req.query
    try {
        if (!lang) {
            return res.status(400).json({
                statusCode: 400,
                status: "bad request",
                message: "Language parameter is required"
            });
        }
        const language = await Language.findOne({
            attributes: ["slug", "id"],
            where: { slug: lang }
        })
        if (!language) return res.status(404).json({ statusCode: 404, status: "not found", message: "Language not found" })
        req.language = language;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            status: "internal server error",
            message: "Failed to validate language",
            error: error.message
        });
    }
}

module.exports = VerifyLanguage