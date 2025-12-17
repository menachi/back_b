"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Movies & Comments API',
            version: '1.0.0',
            description: 'A RESTful API for managing movies and comments with user authentication',
            contact: {
                name: 'Menachi',
                email: 'developer@example.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT Bearer token',
                },
            },
            schemas: {
                Movie: {
                    type: 'object',
                    required: ['title', 'year'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Movie ID (MongoDB ObjectId)',
                            example: '507f1f77bcf86cd799439011',
                        },
                        title: {
                            type: 'string',
                            description: 'Movie title',
                            example: 'The Matrix',
                        },
                        year: {
                            type: 'number',
                            description: 'Release year',
                            example: 1999,
                        },
                        creatredBy: {
                            type: 'string',
                            description: 'ID of the user who created the movie',
                            example: '507f1f77bcf86cd799439012',
                        },
                    },
                },
                User: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User ID (MongoDB ObjectId)',
                            example: '507f1f77bcf86cd799439012',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            description: 'User password (hashed)',
                            example: 'password123',
                        },
                    },
                },
                Comment: {
                    type: 'object',
                    required: ['content', 'movieId'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Comment ID (MongoDB ObjectId)',
                            example: '507f1f77bcf86cd799439013',
                        },
                        content: {
                            type: 'string',
                            description: 'Comment content',
                            example: 'Great movie!',
                        },
                        movieId: {
                            type: 'string',
                            description: 'ID of the movie being commented on',
                            example: '507f1f77bcf86cd799439011',
                        },
                        userId: {
                            type: 'string',
                            description: 'ID of the user who wrote the comment',
                            example: '507f1f77bcf86cd799439012',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            description: 'User password',
                            example: 'password123',
                        },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                            description: 'User password (minimum 6 characters)',
                            example: 'password123',
                        },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        accessToken: {
                            type: 'string',
                            description: 'JWT access token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        refreshToken: {
                            type: 'string',
                            description: 'JWT refresh token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                    },
                },
                RefreshTokenRequest: {
                    type: 'object',
                    required: ['refreshToken'],
                    properties: {
                        refreshToken: {
                            type: 'string',
                            description: 'JWT refresh token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message',
                            example: 'An error occurred',
                        },
                        status: {
                            type: 'number',
                            description: 'HTTP status code',
                            example: 400,
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and authorization endpoints',
            },
            {
                name: 'Movies',
                description: 'Movie management endpoints',
            },
            {
                name: 'Comments',
                description: 'Comment management endpoints',
            },
        ],
    },
    apis: [
        './src/routes/*.ts', // Path to the API routes
        './src/controllers/*.ts', // Path to controllers if needed
    ],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
//# sourceMappingURL=swagger.js.map