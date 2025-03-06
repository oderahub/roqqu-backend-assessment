import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Roqqu Backend Assessment API',
      version: '1.0.0',
      description:
        'A robust user management API built with TypeScript, Node.js, TypeORM, and SQLite. Features include user creation, authentication, address management, and post handling with rate limiting and JWT-based security.',
      contact: {
        name: 'Support Team',
        email: 'support@roqqu-assessment.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'https://roqqu-backend-assessment-wnmd.onrender.com',
        description: 'Production Server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format `Bearer <token>` obtained from /auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            phoneNumber: { type: 'string', example: '+1234567890' },
            address: { $ref: '#/components/schemas/Address' },
            createdAt: { type: 'string', format: 'date-time', example: '2025-03-06T08:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-03-06T08:00:00Z' },
          },
        },
        CreateUser: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            firstName: { type: 'string', minLength: 2, maxLength: 50, example: 'John' },
            lastName: { type: 'string', minLength: 2, maxLength: 50, example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            phoneNumber: {
              type: 'string',
              pattern: '^\\+?[0-9]{10,15}$',
              example: '+1234567890',
              description: 'Optional phone number with 10-15 digits',
            },
          },
        },
        UpdateUser: {
          type: 'object',
          properties: {
            firstName: { type: 'string', minLength: 2, maxLength: 50, example: 'Johnny' },
            lastName: { type: 'string', minLength: 2, maxLength: 50, example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'johnny.doe@example.com' },
            phoneNumber: {
              type: 'string',
              pattern: '^\\+?[0-9]{10,15}$',
              example: '+1234567890',
            },
          },
          minProperties: 1,
          description: 'At least one field must be provided to update',
        },
        Address: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
            street: { type: 'string', example: '123 Main St' },
            city: { type: 'string', example: 'New York' },
            state: { type: 'string', example: 'NY' },
            country: { type: 'string', example: 'USA' },
            zipCode: { type: 'string', example: '10001' },
            userId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
        CreateAddress: {
          type: 'object',
          required: ['street', 'city', 'state', 'country', 'zipCode'],
          properties: {
            street: { type: 'string', minLength: 2, maxLength: 100, example: '123 Main St' },
            city: { type: 'string', minLength: 2, maxLength: 50, example: 'New York' },
            state: { type: 'string', minLength: 2, maxLength: 50, example: 'NY' },
            country: { type: 'string', minLength: 2, maxLength: 50, example: 'USA' },
            zipCode: { type: 'string', pattern: '^\\d{4,10}$', example: '10001' },
          },
        },
        UpdateAddress: {
          type: 'object',
          properties: {
            street: { type: 'string', minLength: 2, maxLength: 100, example: '456 Elm St' },
            city: { type: 'string', minLength: 2, maxLength: 50, example: 'Boston' },
            state: { type: 'string', minLength: 2, maxLength: 50, example: 'MA' },
            country: { type: 'string', minLength: 2, maxLength: 50, example: 'USA' },
            zipCode: { type: 'string', pattern: '^\\d{4,10}$', example: '02108' },
          },
          minProperties: 1,
          description: 'At least one field must be provided to update',
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440002' },
            title: { type: 'string', example: 'My First Post' },
            body: { type: 'string', example: 'This is the content of my first post.' },
            userId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            createdAt: { type: 'string', format: 'date-time', example: '2025-03-06T08:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2025-03-06T08:00:00Z' },
          },
        },
        CreatePost: {
          type: 'object',
          required: ['title', 'body'],
          properties: {
            title: { type: 'string', minLength: 3, maxLength: 100, example: 'My First Post' },
            body: {
              type: 'string',
              minLength: 10,
              example: 'This is the content of my first post.',
            },
          },
        },
        UpdatePost: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 3, maxLength: 100, example: 'Updated Post Title' },
            body: { type: 'string', minLength: 10, example: 'Updated post content.' },
          },
          minProperties: 1,
          description: 'At least one field must be provided to update',
        },
      },
    },
    tags: [
      { name: 'Public Users', description: 'User endpoints accessible without authentication' },
      { name: 'Authenticated Users', description: 'User endpoints requiring JWT authentication' },
      { name: 'Auth', description: 'Authentication endpoints' },
      {
        name: 'Public Addresses',
        description: 'Address endpoints accessible without authentication',
      },
      {
        name: 'Authenticated Addresses',
        description: 'Address endpoints requiring JWT authentication',
      },
      { name: 'Public Posts', description: 'Post endpoints accessible without authentication' },
      { name: 'Authenticated Posts', description: 'Post endpoints requiring JWT authentication' },
    ],
  },
  apis: ['src/routes/*.ts', 'src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
