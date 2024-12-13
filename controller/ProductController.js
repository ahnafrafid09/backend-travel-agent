const Product = require("../models/Product.js")
const TimeSlot = require("../models/TimeSlot.js")
const Schedule = require("../models/Schedule.js");
const Category = require("../models/Category.js");
const SubCategory = require("../models/SubCategory.js");
const Facility = require("../models/Facility.js");
const Translation = require("../models/Translation.js");
const path = require('path');
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { fileURLToPath } = require('url');
const sequelize = require("../config/database.js");
const { dirname } = require('path');
const ProductPrice = require("../models/ProductPrice.js");
const ProductDiscount = require("../models/ProductDiscount.js");

const GetProducts = async (req, res) => {
    const { lang } = req.query;
    try {
        const response = await Product.findAll({
            attributes: ['uuid_product', 'image_url'],
            include: [
                {
                    model: Translation,
                    attributes: ["attribute", "value"],
                    where: lang ? { lang: lang } : {},
                    as: "translations"
                },
                {
                    model: Schedule,
                    attributes: ["uuid_schedule"],
                    include: [
                        {
                            model: Translation,
                            attributes: ["attribute", "value"],
                            where: lang ? { lang: lang } : {},
                            as: "translations"
                        },
                        {
                            model: TimeSlot,
                            as: "timeSlots",
                            attributes: ["start_time", "end_time", "scheduleUUID"],
                            include: {
                                model: Translation,
                                attributes: ["attribute", "value"],
                                where: lang ? { lang: lang } : {},
                                as: "translations"
                            }
                        }
                    ]
                },
                {
                    model: Category,
                    attributes: ["slug", "id"],
                    include: {
                        model: Translation,
                        attributes: ["attribute", "value"],
                        where: lang ? { lang: lang } : {},
                        as: "translations"
                    }
                },
                {
                    model: SubCategory,
                    attributes: ["slug", "id"],
                    include: {
                        model: Translation,
                        attributes: ["attribute", "value"],
                        where: lang ? { lang: lang } : {},
                        as: "translations"
                    }
                },
                {
                    model: Facility,
                    through: { attributes: ["facilityUUID"] },
                    include: {
                        model: Translation,
                        attributes: ['value', 'attribute'],
                        where: lang ? { lang: lang } : {},
                        as: "translations",
                    },
                }, {
                    model: ProductPrice,
                    attributes: ["uuid_product_price", "price", "discount_price_amount", "status", "discountUUID"],
                    include: [{
                        model: ProductDiscount,
                        attribute: ["uuid_product_discount", "discount_type", "discount_value", "status"],
                        include: {
                            model: Translation,
                            attributes: ['value', 'attribute'],
                            where: lang ? { lang: lang } : {},
                            as: "translations",
                        }
                    }, {
                        model: Translation,
                        attributes: ['value', 'attribute'],
                        where: lang ? { lang: lang } : {},
                        as: "translations",
                    }]
                }
            ]
        });

        if (response.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "not found",
                message: "Products Not Found"
            });
        }

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Get Products Success",
            data: response
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            statusCode: 500,
            status: "internal server error",
            message: "internal server error", error: error
        });
    }
};

const GetProductByUUID = async (req, res) => {
    const { lang } = req.query
    const { id } = req.params
    const uuid_product = id

    try {
        const response = await Product.findByPk(uuid_product, {
            attributes: ['uuid_product', 'image_url'],
            include: [
                {
                    model: Translation,
                    attributes: ["attribute", "value"],
                    where: lang ? { lang: lang } : {},
                    as: "translations"
                },
                {
                    model: Schedule,
                    attributes: ["uuid_schedule"],
                    include: [
                        {
                            model: Translation,
                            attributes: ["attribute", "value"],
                            where: lang ? { lang: lang } : {},
                            as: "translations"
                        },
                        {
                            model: TimeSlot,
                            as: "timeSlots",
                            attributes: ["start_time", "end_time", "scheduleUUID"],
                            include: {
                                model: Translation,
                                attributes: ["attribute", "value"],
                                where: lang ? { lang: lang } : {},
                                as: "translations"
                            }
                        }
                    ]
                },
                {
                    model: Category,
                    attributes: ["slug", "id"],
                    include: {
                        model: Translation,
                        attributes: ["attribute", "value"],
                        where: lang ? { lang: lang } : {},
                        as: "translations"
                    }
                },
                {
                    model: SubCategory,
                    attributes: ["slug", "id"],
                    include: {
                        model: Translation,
                        attributes: ["attribute", "value"],
                        where: lang ? { lang: lang } : {},
                        as: "translations"
                    }
                },
                {
                    model: Facility,
                    through: { attributes: ["facilityUUID"] },
                    include: {
                        model: Translation,
                        attributes: ['value', 'attribute'],
                        where: lang ? { lang: lang } : {},
                        as: "translations",
                    },
                }, {
                    model: ProductPrice,
                    attributes: ["uuid_product_price", "price", "discount_price_amount", "status", "discountUUID"],
                    include: [{
                        model: ProductDiscount,
                        attribute: ["uuid_product_discount", "discount_type", "discount_value", "status"],
                        include: {
                            model: Translation,
                            attributes: ['value', 'attribute'],
                            where: lang ? { lang: lang } : {},
                            as: "translations",
                        }
                    }, {
                        model: Translation,
                        attributes: ['value', 'attribute'],
                        where: lang ? { lang: lang } : {},
                        as: "translations",
                    }]
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
    try {
        // Mengecek apakah ada file yang diupload
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

        // Validasi format gambar dan ukuran file
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

        // Memindahkan file gambar ke server
        await new Promise((resolve, reject) => {
            image.mv(filePath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        const { categoryId, subCategoryId, facilityUUID, translations, price, schedules } = req.body;

        // Membuat produk baru
        const product = await Product.create({
            categoryId,
            subCategoryId,
            image_url: url
        });

        if (facilityUUID && facilityUUID.length > 0) {
            const facilityData = JSON.parse(facilityUUID).map(uuid => ({
                productUUID: product.uuid_product,
                facilityUUID: uuid,
            }));
            await sequelize.models.ProductFacilities.bulkCreate(facilityData)
        }

        // Menyimpan data terjemahan produk
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

        // Menangani data harga dan diskon
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
            discount_price_amount = priceData.price
        }

        const productPrice = await ProductPrice.create({
            price: priceData.price,
            discount_price_amount: discount_price_amount,
            status: priceData.status,
            productUUID: product.uuid_product,
            discountUUID: priceData.discountUUID || null
        });

        const translationPriceData = JSON.parse(translations).flatMap(t => ([
            {
                entityId: productPrice.uuid_product_price,
                lang: t.lang,
                entityType: 'product_price',
                attribute: 'name',
                value: t.name
            },
            {
                entityId: productPrice.uuid_product_price,
                lang: t.lang,
                entityType: 'product_price',
                attribute: 'description',
                value: t.tourdesc
            }
        ]));

        await Translation.bulkCreate(translationPriceData);

        // Menyimpan jadwal jika ada
        if (schedules && schedules.length > 0) {
            const scheduleData = JSON.parse(schedules);
            for (const schedule of scheduleData) {
                const newSchedule = await Schedule.create({
                    productUUID: product.uuid_product,
                });

                if (schedule.translations && schedule.translations.length > 0) {
                    const scheduleTranslations = schedule.translations.map(t => ({
                        entityId: newSchedule.uuid_schedule,
                        lang: t.lang,
                        entityType: 'schedule',
                        attribute: 'day_schedule',
                        value: t.value
                    }));
                    await Translation.bulkCreate(scheduleTranslations);
                }

                for (const timeSlot of schedule.time) {
                    const newTimeSlot = await TimeSlot.create({
                        scheduleUUID: newSchedule.uuid_schedule,
                        start_time: timeSlot.startTime,
                        end_time: timeSlot.endTime
                    });
                    if (timeSlot.translations && timeSlot.translations.length > 0) {
                        const timeSlotTranslations = timeSlot.translations.map(t => ({
                            entityId: newTimeSlot.uuid_timeslot,
                            lang: t.lang,
                            entityType: 'time',
                            attribute: 'desc_time',
                            value: t.value
                        }));
                        await Translation.bulkCreate(timeSlotTranslations);
                    }
                }
            }
        }


        res.status(201).json({
            statusCode: 201,
            status: 'Created',
            message: 'Product and its price created successfully',
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






module.exports = {
    GetProducts,
    GetProductByUUID,
    CreateProduct
}