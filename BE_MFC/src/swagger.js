import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Management Football Club",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8081",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Tìm các file route chứa Swagger annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
