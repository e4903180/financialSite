const { config } = require('./constant');

const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./router.js'];

const options = {
    withCredentials: true,
    info: {
        title: "API for cosbi financial site",
        description: "API document for cosbi financial site made by express",
    },
    host: config["SWAGGER_HOST"], 
    basePath: "/api",
    tags: [
        {
            name: "Token",
            description: "Swagger token"
        },
        {
            name: "User",
            description: "Controll user behavior(must login first)"
        },
        {
            name: "Authenticate check",
            description: "Check user's auth"
        },
        {
            name: "File download",
            description: "Controll download file request(auth required)"
        },
        {
            name: "File upload",
            description: "Controll upload file request(auth required)"
        },
        {
            name: "Get data",
            description: "Get data from db(auth required)"
        },
        {
            name: "Search data from db",
            description: "Search data from db(auth required)"
        },
        {
            name: "Update data",
            description: "Update data from frontend(auth required)"
        },
        {
            name: "Delete data from table",
            description: "Delete data from frontend(auth required)"
        },
        {
            name: "Python tool",
            description: "Controll python tool behavior(auth required)"
        },
        {
            name: "Notify",
            description: "Controll notify behavior(need login from frontend)"
        },
        {
            name: "Subscribe",
            description: "Controll subscribe behavior(need login from frontend)"
        },
    ],
    securityDefinitions : {
        apiAuth: {
            type : "apiKey",
            in : "header",
            name : "swagger_token"
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, options);