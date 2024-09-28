import TouristPlace from "../models/TouristPlace.js";
import TouristPlaceTranslation from "../models/TouristPlaceTranslation.js";

export const GetTouristPlace = async (req, res) => {
    try {
        const response = await TouristPlace.findAll({
            include: [{
                model: TouristPlaceTranslation,
                attributes: ["name", "description", "lang"]
            }]
        })
        if (response.length === 0) return res.status(404).json({ statusCode: 404, message: "Tourist Place Not Found" })
        res.status(200).json({ statusCode: 200, message: "Search Tourist Place Success", data: response })
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, message: "Internal Server Error" })
    }
}

export const CreateTouristPlace = async (req, res) => {
    try {
        const { translations } = req.body;

        const touristPlace = await TouristPlace.create();

        if (translations && translations.length > 0) {
            const touristPlaceTranslations = translations.map(t => ({
                touristPlaceId: touristPlace.id,
                lang: t.lang,
                name: t.name,
                description: t.description
            }));
            await TouristPlaceTranslation.bulkCreate(touristPlaceTranslations);
        }
        res.status(201).json({ statusCode: 201, message: 'Facility created successfully', data: touristPlace });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}