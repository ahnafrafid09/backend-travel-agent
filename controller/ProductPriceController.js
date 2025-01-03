const ProductPrice = require("../models/ProductPrice")
const ProductDiscount = require("../models/ProductDiscount")
const Product = require("../models/Product.js")
const Translation = require("../models/Translation.js")
const sequelize = require("../../config/database.js");

const GetProductPrices = async (req, res) => {
    const { lang } = req.query
    const price = await ProductPrice.findAll({
        include: [
            {
                model: Translation,
                attributes: ["attribute", "value"],
                where: lang ? { lang: lang } : {},
                as: "translations"
            },
            {
                model: Product,
                include: {
                    model: Translation,
                    attributes: ["attribute", "value"],
                    where: lang ? { lang: lang } : {},
                    as: "translations"
                }
            }
        ]
    })
    res.json({ data: price })
}

module.exports = {
    GetProductPrices
}