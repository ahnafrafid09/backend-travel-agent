import jwt from "jsonwebtoken"
import { jwtSecret } from "../config/token.js"

export const VerifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) return res.sendStatus(403)
        req.username = decoded.username;
        next();
    })
}