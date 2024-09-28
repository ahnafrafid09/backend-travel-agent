import dotenv from 'dotenv'
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

import express from "express"
import cookieParser from 'cookie-parser';
import cors from "cors"
import fileUpload from 'express-fileupload';
import sequelize from "./config/database.js";
import path from 'path';
import { fileURLToPath } from 'url';
import Router from './router/Router.js';
import { CarRentFacilities, TourPackageFacilities, TravelFacilities } from "./models/RelationManyToMany.js"
import CarRent from './models/CarRent.js';
import User from './models/User.js';
import { Facility, Translation, Travel, SubCategory, Category, TourPackage, Schedule } from './models/Relation.js'
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
app.use(cors());
app.use(fileUpload({
    createParentPath: true
}));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, './public')));
app.use(cookieParser())

const port = process.env.PORT || 3000



app.get('/', (req, res) => {
    res.status(200).send('Selamat Datang di API Website Travel Agent')
})

app.use("/api/v1/", Router)

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // await sequelize.sync({ force: true });
        // console.log('All models were synchronized successfully.');
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database or sync:', error);
    }
}

startServer();
