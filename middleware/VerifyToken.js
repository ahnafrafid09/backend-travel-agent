const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/token.js");

const VerifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            statusCode: 401,
            message: "Access token is missing"
        });
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                statusCode: 403,
                message: "Invalid or expired token"
            });
        }
        if (!decoded) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid token payload"
            });
        }
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email
        }
        next();
    });
};

module.exports = { VerifyToken };
