const { config } = require('./constant');

const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./router.js'];

const options = {
    host: config["SWAGGER_HOST"], 
    basePath: "/api",
    tags: [
        {
            name: "User",
            description: "User router"
        },
        {
            name: "Data",
            description: "Data router"
        },
    ],
}

swaggerAutogen(outputFile, endpointsFiles, options);