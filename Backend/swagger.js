import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const doc = {
    info: {
        title: 'Financial Management API',
        description: 'API for managing finances, transactions, and dashboards.'
    },
    host: isProduction 
        ? 'finance-tracker-api-xd7k.onrender.com'
        : 'localhost:3000',                       
    schemes: isProduction ? ['https'] : ['http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Enter: Bearer <token>'
        }
    }
};

const outputFile = './swagger-output.json';

const routes = [
    './routes/auth.routes.js',
    './routes/users.routes.js',
    './routes/transactions.routes.js',
    './routes/dashboard.route.js'
];

swaggerAutogen(outputFile, routes, doc);