import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { jwtSecret, jwtRefreshSecret, jwtExpiration, jwtRefreshExpiration } from "../config/token.js";

export const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ statusCode: 400, message: "User dan Password Tidak Cocok" });
        }

        const { id: userId, username, email } = user;

        const accessToken = jwt.sign({ userId, username, email }, jwtSecret, {
            expiresIn: jwtExpiration
        });

        const refreshToken = jwt.sign({ userId, username, email }, jwtRefreshSecret, {
            expiresIn: jwtRefreshExpiration
        });

        await User.update({ refreshToken }, {
            where: {
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            statusCode: 200,
            message: "Login Success",
            token: accessToken
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ statusCode: 500, message: "User dan Password Tidak Cocok" });
    }
};

export const Register = async (req, res) => {
    const { username, email, password, confPassword } = req.body
    if (!username || !email || !password || !confPassword) return res.status(400).json({ message: "Harap Isi Semua" });

    if (password.length && confPassword.length < 8) return res.status(400).json({ message: "Password Kurang Dari 8 Karakter" })
    if (password !== confPassword) return res.status(400).json({ message: "Password dan Confirm Password Tidak Cocok" })

    if (username.includes(" ")) return res.status(400).json({ message: "Username tidak boleh mengandung spasi" });

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username: username }, { email: email }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ messagesage: "Username atau Email sudah terdaftar" });
        }

        await User.create({
            username: username,
            email: email,
            password: hashPassword,
        })
        res.status(201).json({ statusCode: 201, message: "Registrasi Success" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, message: error })
    }
}

export const RefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const user = await User.findAll({
            where: {
                refreshToken: refreshToken
            }
        })
        if (!user[0]) return res.sendStatus(403)
        jwt.verify(refreshToken, jwtRefreshSecret, (err, decoded) => {
            if (err) return res.sendStatus(403)
            const userId = user[0].id
            const username = user[0].username
            const email = user[0].email
            const accessToken = jwt.sign({ userId, username, email }, jwtSecret, {
                expiresIn: jwtExpiration
            })
            res.json({ token: accessToken })
        })
    } catch (error) {
        console.log(error);
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await User.findAll({
        where: {
            refreshToken: refreshToken
        }
    });

    if (!user[0]) return res.sendStatus(204);

    const userId = user[0].id;
    await User.update({ refreshToken: null }, {
        where: {
            id: userId
        }
    });

    res.clearCookie('refreshToken');
    return res.status(200).json({ statusCode: 200, message: 'Logout Success' });
}

