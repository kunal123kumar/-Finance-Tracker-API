import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Financial Management API',
        description: 'API for managing finances, transactions, and dashboards.'
    },
    host: 'localhost:3000',
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