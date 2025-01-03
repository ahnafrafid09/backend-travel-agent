const path = require('path');
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../../config/database.js");
const Product = require('../models/data_master/Product.js');
const Category = require('../models/data_master/Category.js');
const CategoryTranslation = require('../models/translation/CategoryTranslation.js');
const Language = require('../models/data_master/Language.js');
const ProductTranslation = require('../models/translation/ProductTranslatoin.js');
const SubCategory = require('../models/data_master/SubCategory.js');
const SubCategoryTranslation = require("../models/translation/SubCategoryTranslation.js");
const ProductPrice = require('../models/data_master/ProductPrice.js');
const ProductPriceDetail = require('../models/data_master/ProductPriceDetail.js');
const { IncludeLanguage } = require('../helper/IncludeLanguage.js');
const Uom = require('../models/data_master/Uom.js');

const GetPorduct = async (req, res) => {
    const { language } = req
    try {
        const response = await Product.findAll({
            attributes: ["uuid_product", "img_url"],
            include: [
                {
                    model: ProductTranslation,
                    as: "translations",
                    attributes: ["name", "description"],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["slug"],
                    include: {
                        model: CategoryTranslation,
                        as: "translations",
                        attributes: ["name"],
                        include: IncludeLanguage(language.slug)
                    }
                },
                {
                    model: SubCategory,
                    as: "subCategory",
                    attributes: ["slug"],
                    include: {
                        model: SubCategoryTranslation,
                        as: "translations",
                        attributes: ["name"],
                        include: IncludeLanguage(language.slug)
                    }
                },
                {
                    model: ProductPrice,
                    as: "price",
                    attributes: ["price"]
                }
            ]
        })
        if (response.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "not found",
                message: "Product Not Found"
            });
        }

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Get Product Success",
            data: response
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            statusCode: 500,
            status: "internal server error",
            message: "internal server error", error: error
        });
    }
}

const GetProductByUUID = async (req, res) => {
    const { language } = query
    const { id } = req.params
    const uuid_product = id

    try {
        const response = await Product.findByPk(uuid_product, {
            attributes: ["uuid_product", "img_url"],
            include: [
                {
                    model: ProductTranslation,
                    as: "translations",
                    attributes: ["name", "description"],
                },
                {
                    model: Category,
                    as: "category",
                    attributes: ["slug"],
                    include: {
                        model: CategoryTranslation,
                        as: "translations",
                        attributes: ["name"],
                        include: IncludeLanguage(language.slug)
                    }
                },
                {
                    model: SubCategory,
                    as: "subCategory",
                    attributes: ["slug"],
                    include: {
                        model: SubCategoryTranslation,
                        as: "translations",
                        attributes: ["name"],
                        include: IncludeLanguage(language.slug)
                    }
                },
                {
                    model: ProductPrice,
                    as: "price",
                    attributes: ["price"],
                    include: [IncludeLanguage(language.slug), {
                        model: ProductPriceDetail,
                        attributes: ["price", "people"],
                        include: {
                            model: Uom,
                            attributes: [""],
                            include: IncludeLanguage(language.slug)
                        }
                    },
                    {
                        model: Uom,
                        attributes: [""],
                        include: IncludeLanguage(language.slug)
                    }
                    ]
                }
            ]
        });


        if (response.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "not found",
                message: "Product Not Found"
            });
        }

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Get Product Success",
            data: response
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            statusCode: 500,
            status: "internal server error",
            message: "internal server error", error: error
        });
    }
}

const CreateProduct = async (req, res) => {
    const transaction = await sequelize.transaction();

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
        const filePath = `public/product/${imageName}`;
        const url = `${req.protocol}://${req.get("host")}/public/product/${imageName}`;


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

        const { categoryId, subCategoryId, facilityUUID, translations, price, schedules } = req.body;

        if (schedules && schedules.length > 0) {
            const scheduleData = JSON.parse(schedules);
            for (const schedule of scheduleData) {
                if (!schedule.time || schedule.time.length === 0) {
                    throw new Error("Each schedule must have at least one time slot");
                }
            }
        }

        const product = await Product.create(
            { categoryId, subCategoryId, image_url: url },
            { transaction }
        );

        if (facilityUUID && facilityUUID.length > 0) {
            const facilityData = JSON.parse(facilityUUID).map(uuid => ({
                productUUID: product.uuid_product,
                facilityUUID: uuid,
            }));
            await sequelize.models.ProductFacilities.bulkCreate(facilityData, { transaction });
        } else {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "Facility field is required"
            });
        }

        if (translations && translations.length > 0) {
            const translationProductData = JSON.parse(translations).flatMap(t => ([{
                entityId: product.uuid_product,
                lang: t.lang,
                entityType: 'product',
                attribute: 'name_product',
                value: t.name
            },
            {
                entityId: product.uuid_product,
                lang: t.lang,
                entityType: 'product',
                attribute: 'desc_product',
                value: t.tourdesc
            },
            {
                entityId: product.uuid_product,
                lang: t.lang,
                entityType: 'product',
                attribute: 'destination_product',
                value: t.tourdesc ? JSON.stringify(t.destination) : null
            }]));

            await Translation.bulkCreate(translationProductData, { transaction });
        } else {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "Translation field is required"
            });
        }

        if (price && price > 0) {
            const priceData = JSON.parse(price);
            let discount_price_amount = null;
            if (priceData.discountUUID) {
                const discount = await ProductDiscount.findOne({
                    where: { uuid_discount: priceData.discountUUID }
                });

                if (discount) {
                    if (discount.discount_type === 'percent') {
                        discount_price_amount = priceData.price - (priceData.price * (discount.discount_value / 100));
                    } else if (discount.discount_type === 'amount') {
                        discount_price_amount = priceData.price - discount.discount_value;
                    }
                }
            } else {
                discount_price_amount = priceData.price;
            }

            const productPrice = await ProductPrice.create({
                price: priceData.price,
                discount_price_amount,
                status: priceData.status,
                productUUID: product.uuid_product,
                discountUUID: priceData.discountUUID || null
            }, { transaction });

            const translationPriceData = JSON.parse(translations).flatMap(t => ([{
                entityId: productPrice.uuid_product_price,
                lang: t.lang,
                entityType: 'product_price',
                attribute: 'package_name',
                value: t.name
            }]));

            await Translation.bulkCreate(translationPriceData, { transaction });
        } else {
            return res.status(400).json({
                statusCode: 400,
                status: "Bad Request",
                message: "Translation field is required"
            });
        }


        if (schedules && schedules.length > 0) {
            const scheduleData = JSON.parse(schedules);
            for (const schedule of scheduleData) {
                const newSchedule = await Schedule.create({
                    productUUID: product.uuid_product,
                }, { transaction });

                if (schedule.translations && schedule.translations.length > 0) {
                    const scheduleTranslations = schedule.translations.map(t => ({
                        entityId: newSchedule.uuid_schedule,
                        lang: t.lang,
                        entityType: 'schedule',
                        attribute: 'day_schedule',
                        value: t.value
                    }));
                    await Translation.bulkCreate(scheduleTranslations, { transaction });
                }

                for (const timeSlot of schedule.time) {
                    const newTimeSlot = await TimeSlot.create({
                        scheduleUUID: newSchedule.uuid_schedule,
                        start_time: timeSlot.startTime,
                        end_time: timeSlot.endTime
                    }, { transaction });

                    if (timeSlot.translations && timeSlot.translations.length > 0) {
                        const timeSlotTranslations = timeSlot.translations.map(t => ({
                            entityId: newTimeSlot.uuid_timeslot,
                            lang: t.lang,
                            entityType: 'time',
                            attribute: 'desc_time',
                            value: t.value
                        }));
                        await Translation.bulkCreate(timeSlotTranslations, { transaction });
                    }
                }
            }
        }

        await transaction.commit();


        res.status(201).json({
            statusCode: 201,
            status: 'Created',
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            status: "Internal Server Error",
            message: "An error occurred while creating the product"
        });
    }
};

const UpdateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryId, subCategoryId, facilityUUID, translations, price, schedules } = req.body;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Product not found"
            });
        }

        let imageUrl = product.image_url;
        if (req.files && req.files.image) {
            const image = req.files.image;
            const imageSize = image.data.length;
            const ext = path.extname(image.name).toLowerCase();
            const imageName = uuidv4() + ext;
            const allowedType = ['.jpg', '.png', '.jpeg'];
            imageUrl = `${req.protocol}://${req.get("host")}/public/product/${imageName}`;

            if (!allowedType.includes(ext)) {
                return res.status(422).json({ message: "Images must be jpeg, jpg, png format" });
            }
            if (imageSize > 2000000) {
                return res.status(422).json({ message: "Images should not be more than 2MB" });
            }


            const oldFilePath = path.join(__dirname, '..', 'public', 'product', path.basename(product.image_url));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }

            await new Promise((resolve, reject) => {
                image.mv(`public/product/${imageName}`, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        product.categoryId = categoryId;
        product.subCategoryId = subCategoryId;
        product.imageUrl = imageUrl
        await product.save();

        if (facilityUUID && facilityUUID.length > 0) {
            await sequelize.models.ProductFacilities.destroy({
                where: { productUUID: product.uuid_product }
            });

            const facilityData = JSON.parse(facilityUUID).map(uuid => ({
                productUUID: product.uuid_product,
                facilityUUID: uuid,
            }));

            await sequelize.models.ProductFacilities.bulkCreate(facilityData);
        }

        if (translations) {
            await Translation.destroy({
                where: { entityId: product.uuid_product }
            });

            const translationProductData = JSON.parse(translations).flatMap(t => ([
                {
                    entityId: product.uuid_product,
                    lang: t.lang,
                    entityType: 'product',
                    attribute: 'name_product',
                    value: t.name
                },
                {
                    entityId: product.uuid_product,
                    lang: t.lang,
                    entityType: 'product',
                    attribute: 'desc_product',
                    value: t.tourdesc
                },
                {
                    entityId: product.uuid_product,
                    lang: t.lang,
                    entityType: 'product',
                    attribute: 'destination_product',
                    value: t.tourdesc ? JSON.stringify(t.destination) : null
                }
            ]));

            await Translation.bulkCreate(translationProductData);
        }

        if (price) {
            const priceData = JSON.parse(price);
            const productPrice = await ProductPrice.findOne({
                where: { productUUID: product.uuid_product }
            });

            let discount_price_amount = null;
            if (priceData.discountUUID) {
                const discount = await ProductDiscount.findOne({
                    where: { uuid_discount: priceData.discountUUID }
                });

                if (discount) {
                    if (discount.discount_type === 'percent') {
                        discount_price_amount = priceData.price - (priceData.price * (discount.discount_value / 100));
                    } else if (discount.discount_type === 'amount') {
                        discount_price_amount = priceData.price - discount.discount_value;
                    }
                }
            } else {
                discount_price_amount = priceData.price;
            }

            productPrice.price = priceData.price;
            productPrice.discount_price_amount = discount_price_amount;
            productPrice.status = priceData.status;
            productPrice.discountUUID = priceData.discountUUID || null;
            await productPrice.save();
        }

        res.status(200).json({
            statusCode: 200,
            status: 'OK',
            message: 'Product updated successfully',
            data: product
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
}

const DeleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ where: { uuid_product: id } });

        if (!product) {
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Product not found",
            });
        }
        const imagePath = product.image_url.split(`${req.protocol}://${req.get("host")}/`)[1];
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Translation.destroy({ where: { entityId: product.uuid_product, entityType: 'product' } });

        const productPrices = await ProductPrice.findAll({ where: { productUUID: product.uuid_product } });
        for (const productPrice of productPrices) {
            await Translation.destroy({ where: { entityId: productPrice.uuid_product_price, entityType: 'product_price' } });
        }
        await ProductPrice.destroy({ where: { productUUID: product.uuid_product } });

        const schedules = await Schedule.findAll({ where: { productUUID: product.uuid_product } });
        for (const schedule of schedules) {
            await Translation.destroy({ where: { entityId: schedule.uuid_schedule, entityType: 'schedule' } });
            const timeSlots = await TimeSlot.findAll({ where: { scheduleUUID: schedule.uuid_schedule } });
            for (const timeSlot of timeSlots) {
                await Translation.destroy({ where: { entityId: timeSlot.uuid_timeslot, entityType: 'time' } });
            }
            await TimeSlot.destroy({ where: { scheduleUUID: schedule.uuid_schedule } });
        }
        await Schedule.destroy({ where: { productUUID: product.uuid_product } });

        await sequelize.models.ProductFacilities.destroy({ where: { productUUID: product.uuid_product } });

        await product.destroy();

        // Kirim respons sukses
        res.status(200).json({
            statusCode: 200,
            status: "OK",
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            status: "Internal Server Error",
            message: "An error occurred while deleting the product",
        });
    }
};


module.exports = {
    GetProducts,
    GetProductByUUID,
    CreateProduct,
    DeleteProduct,
    UpdateProduct
}