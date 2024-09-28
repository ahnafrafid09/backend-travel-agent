import User from "../models/User.js";

export const GetUser = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['email', 'username'],
        })
        res.status(200).json({ statusCode: 200, message: "Search user data success", data: response })
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, error: error })
    }
}