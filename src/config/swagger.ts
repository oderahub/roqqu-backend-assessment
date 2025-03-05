import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Roqqu Backend Assessment API',
      version: '1.0.0',
      description: 'A user management system with TypeScript, Node.js, TypeORM, and SQLite',
    },
    servers: [
      {
        url: 'https://roqqu-backend-assessment-wnmd.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
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
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phoneNumber: { type: 'string' },
            address: { $ref: '#/components/schemas/Address' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateUser: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            firstName: { type: 'string', minLength: 2, maxLength: 50 },
            lastName: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            phoneNumber: { type: 'string', pattern: '^\\+?[0-9]{10,15}$' },
          },
        },
        UpdateUser: {
          type: 'object',
          properties: {
            firstName: { type: 'string', minLength: 2, maxLength: 50 },
            lastName: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            phoneNumber: { type: 'string', pattern: '^\\+?[0-9]{10,15}$' },
          },
          minProperties: 1,
        },
        Address: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            street: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            country: { type: 'string' },
            zipCode: { type: 'string' },
            userId: { type: 'string', format: 'uuid' },
          },
        },
        CreateAddress: {
          type: 'object',
          required: ['street', 'city', 'state', 'country', 'zipCode'],
          properties: {
            street: { type: 'string', minLength: 2, maxLength: 100 },
            city: { type: 'string', minLength: 2, maxLength: 50 },
            state: { type: 'string', minLength: 2, maxLength: 50 },
            country: { type: 'string', minLength: 2, maxLength: 50 },
            zipCode: { type: 'string', pattern: '^\\d{4,10}$' },
          },
        },
        UpdateAddress: {
          type: 'object',
          properties: {
            street: { type: 'string', minLength: 2, maxLength: 100 },
            city: { type: 'string', minLength: 2, maxLength: 50 },
            state: { type: 'string', minLength: 2, maxLength: 50 },
            country: { type: 'string', minLength: 2, maxLength: 50 },
            zipCode: { type: 'string', pattern: '^\\d{4,10}$' },
          },
          minProperties: 1,
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            body: { type: 'string' },
            userId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreatePost: {
          type: 'object',
          required: ['title', 'body'],
          properties: {
            title: { type: 'string', minLength: 3, maxLength: 100 },
            body: { type: 'string', minLength: 10 },
          },
        },
        UpdatePost: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 3, maxLength: 100 },
            body: { type: 'string', minLength: 10 },
          },
          minProperties: 1,
        },
      },
    },
  },
  apis: ['src/routes/*.ts', 'src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
