const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { jwtSecret, jwtRefreshSecret, jwtExpiration, jwtRefreshExpiration } = require("../config/token.js");

const Login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ statusCode: 400, message: "Username and password do not matchs" });
        }

        const { uuid_user: userId, username, email, role } = user;

        const accessToken = jwt.sign({ role, userId, username, email }, jwtSecret, {
            expiresIn: jwtExpiration
        });

        const refreshToken = jwt.sign({ role, userId, username, email }, jwtRefreshSecret, {
            expiresIn: jwtRefreshExpiration
        });

        await User.update({ refreshToken }, {
            where: {
                uuid_user: userId
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
            role: role,
            token: accessToken
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ statusCode: 500, message: "Username and password do not match" });
    }
};

const Register = async (req, res) => {
    const { username, email, password, confPassword } = req.body;
    if (!username || !email || !password || !confPassword) return res.status(400).json({ message: "Please fill in all" });

    if (password.length < 8) return res.status(400).json({ message: "Password less than 8 characters" });
    if (password !== confPassword) return res.status(400).json({ message: "Password dan Confirm Password Tidak Cocok" });

    if (username.includes(" ")) return res.status(400).json({ message: "Password and confirm password do not match" });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username: username }, { email: email }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email has been registered" });
        }

        await User.create({
            username: username,
            email: email,
            password: hashPassword,
        });
        res.status(201).json({ statusCode: 201, message: "Registration Success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, message: error });
    }
};

const RefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        const user = await User.findAll({
            where: {
                refreshToken: refreshToken
            }
        });
        if (!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, jwtRefreshSecret, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const userId = user[0].uuid_user;
            const username = user[0].username;
            const email = user[0].email;
            const accessToken = jwt.sign({ userId, username, email }, jwtSecret, {
                expiresIn: jwtExpiration
            });
            res.json({ token: accessToken });
        });
    } catch (error) {
        console.log(error);
    }
};

const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await User.findAll({
        where: {
            refreshToken: refreshToken
        }
    });

    if (!user[0]) return res.sendStatus(204);

    const userId = user[0].uuid_user;
    await User.update({ refreshToken: null }, {
        where: {
            uuid_user: userId
        }
    });

    res.clearCookie('refreshToken');
    return res.status(200).json({ statusCode: 200, message: 'Logout Success' });
};

module.exports = {
    Login, Register, RefreshToken, Logout
}