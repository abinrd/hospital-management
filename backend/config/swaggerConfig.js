import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Hospital Management System API",
            version: "1.0.0",
            description: "API documentation for the Hospital Management System",
        },
        servers: [
            {
                url: "http://localhost:5000/api/v1", // Update port if necessary
                description: "Development Server",
            },
        ],
    },
    apis: ["/backend/routes/*.js"]
 // Auto-generate documentation from route files
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("📄 Swagger Docs available at http://localhost:5000/api-docs");
};

export default setupSwagger;
