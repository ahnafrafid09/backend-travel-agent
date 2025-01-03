const Language = require("../models/data_master/Language");

function IncludeLanguage(languageSlug) {
    return {
        model: Language,
        as: "language",
        attributes: ["slug"],
        where: { slug: languageSlug },
    };
}

module.exports = { IncludeLanguage };