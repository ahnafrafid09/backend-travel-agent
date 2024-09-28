import dotenv from 'dotenv';
dotenv.config();

export const jwtSecret = process.env.JWT_SECRET;
export const jwtExpiration = process.env.JWT_EXPIRATION;
export const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET
export const jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION