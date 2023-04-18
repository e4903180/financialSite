const { config } = require('./constant');

const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./router.js'];

const options = {
    host: `${config["API_BASE_IP"]}:${config["API_PORT"]}`, 
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