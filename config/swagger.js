const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const listEndpoints = require("express-list-endpoints");

const generateSwaggerDocs = (app) => {
    const routes = listEndpoints(app);
    const paths = {};

    routes.forEach((route) => {
        const path = route.path.replace(/\/$/, ""); // Hilangkan "/" di akhir path
        const methods = route.methods;

        methods.forEach((method) => {
            const lowerMethod = method.toLowerCase();

            if (!paths[path]) {
                paths[path] = {};
            }

            // Tentukan tag berdasarkan kategori API
            const tag = path.split("/")[3] || "General";

            // Definisi dasar untuk setiap route
            const pathDefinition = {
                summary: `Auto-generated summary for ${method} ${path}`,
                tags: [tag], // Tambahkan tag sesuai kategori
                description: `Auto-generated documentation for ${method} ${path}`,
                responses: {
                    200: {
                        description: `Success response for ${method} ${path}`,
                    },
                    400: {
                        description: "Bad Request",
                    },
                    500: {
                        description: "Server Error",
                    },
                },
            };

            // Jika metode adalah POST atau PUT, tambahkan requestBody dengan form-data dinamis
            if (lowerMethod === "post" || lowerMethod === "put") {
                pathDefinition.requestBody = {
                    required: true,
                    content: {
                        "multipart/form-data": {  // Menggunakan multipart/form-data untuk form-data
                            schema: {
                                type: "object",
                                properties: generateDynamicFormData(),  // Fungsi untuk membuat key/value dinamis
                            },
                        },
                    },
                };
            }

            paths[path][lowerMethod] = pathDefinition;
        });
    });

    // Tambahkan `openapi` versi yang valid
    return {
        openapi: "3.0.0", // Pastikan versi ini ada
        info: {
            title: "Anjangsana Trip Planner API Documentation",
            version: "1.0.0",
            description: "API documentation for Anjangsana Trip Planner",
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1/",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Masukkan token dengan format `Bearer <token>`",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        paths, // Pastikan path dihasilkan dengan benar
    };
};

// Fungsi untuk generate form-data dinamis
const generateDynamicFormData = () => {
    const dynamicFields = {};

    // Misalkan Anda ingin menambahkan field dinamis berdasarkan parameter atau model
    dynamicFields["exampleField"] = {
        type: "string",
        description: "Example dynamic field",
        example: "exampleValue",
    };

    dynamicFields["anotherField"] = {
        type: "string",
        description: "Another dynamic field",
        example: "anotherValue",
    };
    return dynamicFields;
};

// Buat Swagger Spec
const swaggerSpec = (app) => generateSwaggerDocs(app);

module.exports = { swaggerSpec, swaggerUi };
