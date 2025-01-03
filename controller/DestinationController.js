const sequelize = require("../config/database");
const Destination = require("../models/data_master/Destination");

const GetDestination = async (req, res) => {
    try {
        const response = await Destination.findAll({
            attributes: ['name', "uuid_destination"],
        });
        if (response.length === 0) return res.status(404).json({ statusCode: 404, status: "not found", message: "Destination Not Found" });
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Destination Success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};


const GetDestinationById = async (req, res) => {
    const { uuid_destination } = req.params
    try {
        const response = await Destination.findByPk(uuid_destination, {
            attributes: ['name'],
        });

        if (!response) return res.status(404).json({ statusCode: 404, status: "not found", message: "Destination Not Found" });
        res.status(200).json({ statusCode: 200, status: "success", message: "Search Destination Success", data: response });

    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const CreateDestination = async (req, res) => {
    try {
        const { name } = req.body;

        const destination = await Destination.create({ name })

        res.status(201).json({ statusCode: 201, status: 'created', message: 'Destination created successfully', data: destination });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const UpdateDestination = async (req, res) => {
    const { uuid_destination } = req.params;
    try {
        const { name } = req.body;
        const destination = await Destination.findByPk(uuid_destination)
        if (!destination) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Destination not found",
            });
        }

        await Destination.update({ name }, { where: { uuid_destination: destination.uuid_destination } })

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Destination updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

const DeleteDestination = async (req, res) => {
    const { uuid_destination } = req.params;
    try {
        const destination = await Destination.findByPk(uuid_destination)
        if (!destination) {
            await transaction.rollback();
            return res.status(404).json({
                statusCode: 404,
                status: "Not Found",
                message: "Destination not found",
            });
        }
        await destination.destroy();

        res.status(200).json({ statusCode: 200, status: 'success', message: "Destination Deleted" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, status: "internal server error", message: "internal server error", error: error });
    }
};

module.exports = {
    GetDestination, GetDestinationById, CreateDestination, UpdateDestination, DeleteDestination
}
