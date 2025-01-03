const User = require("../models/User.js");
const Profile = require("../models/data_master/Profile.js");

const GetProfile = async (req, res) => {
    const userId = req.user.userId
    try {
        const response = await Profile.findOne
            ({
                where: { userUUID: userId },
                attributes: ['name', 'phone_num', 'address'],
                include: [
                    {
                        model: User,
                        attributes: ['email', 'username']
                    }
                ]
            });
        res.status(200).json({ statusCode: 200, message: "Search user data success", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, error: error });
    }
};

const CreateProfile = async (req, res) => {
    const userId = req.user.userId;
    const { name, phone_num, address } = req.body;

    try {
        const user = await User.findOne({ where: { uuid_user: userId } });
        console.log(user.uuid_user)
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        let profile = await Profile.findOne({ where: { userUUID: user.uuid_user } });

        if (!profile) {
            profile = await Profile.create({
                userUUID: user.uuid_user,
                name,
                phone_num,
                address
            });

            return res.status(201).json({
                message: 'Profil pengguna berhasil dibuat.',
                profile: profile,
            });
        }

        return res.status(200).json({
            message: 'Profil pengguna sudah ada.',
            profile: profile,
        });

    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Terjadi kesalahan saat memproses data.' });
    }
};

const UpdateProfile = async (req, res) => {
    const userId = req.user.userId;
    const { name, phone_num, address } = req.body;

    try {
        const user = await User.findOne({ where: { uuid_user: userId } });

        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        let profile = await Profile.findOne({ where: { userUUID: user.uuid_user } });

        if (!profile) {
            return res.status(404).json({ message: 'Profil pengguna tidak ditemukan.' });
        }

        profile.name = name || profile.name;
        profile.phone_num = phone_num || profile.phone_num;
        profile.address = address || profile.address;

        await profile.save();

        return res.status(200).json({
            message: 'Profil pengguna berhasil diperbarui.',
            profile: profile,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat memproses data.' });
    }
};




module.exports = {
    CreateProfile,
    UpdateProfile,
    GetProfile
}
