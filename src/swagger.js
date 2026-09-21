const path = require('path'); // <-- Requerir el módulo 'path'
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Marketplace API',
      version: '1.0.0',
      description: 'Documentación de la API RESTful para el Marketplace con autenticación JWT, subida de archivos y gestión de productos.',
    },
    servers: [
      {
        url: 'https://marketplace-backend-2kcd.onrender.com',
        description: 'Servidor de Producción (Render)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local de Desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Usar path.join con __dirname para que funcione siempre en producción
 apis: [path.join(__dirname, 'routes/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📄 Swagger docs disponible en: http://localhost:3000/api-docs');
};

module.exports = setupSwagger;