const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION;

module.exports = {
    jwtSecret,
    jwtExpiration,
    jwtRefreshSecret,
    jwtRefreshExpiration,
};
