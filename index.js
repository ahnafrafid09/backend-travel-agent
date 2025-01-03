const dotenv = require('dotenv');
const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const fileUpload = require('express-fileupload');
const sequelize = require("./config/database.js");
const path = require('path');
const { swaggerSpec, swaggerUi } = require("./config/swagger.js");
const Route = require('./router/Router.js');
// const User = require('./models/User.js');
// const Profile = require('./models/Profile.js');
// const { Category, Translation, ProductDiscount, SubCategory, Product, ProductPrice, Schedule, Facility, TimeSlot } = require('./models/RelationTranslation.js');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const app = express();
app.use(cors());
app.use(fileUpload({
    createParentPath: true
}));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, './public')));
app.use(cookieParser());

const port = process.env.PORT || 5000;

app.use("/api/v1", Route);

// Generate Swagger Specification
const swaggerDefinition = swaggerSpec(app);

// Swagger UI
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

app.get('/', (req, res) => {
    res.status(200).send('Selamat Datang di API Website Travel Agent');
});

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // await sequelize.sync({ alter: true });
        // console.log('All models were synchronized successfully.');
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database or sync:', error);
    }
}

startServer();
