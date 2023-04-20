var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { swagger_password } = require('../constant');

exports.token = (req, res) => {
    /*
        #swagger.tags = ['Token']
        #swagger.description = 'Get swagger token.'

        #swagger.parameters['username'] = {
            in: 'query',
            description: 'Swagger username.',
            required: true,
            type: 'string',
            schema: "example_swagger_username"
        }

        #swagger.parameters['password'] = {
            in: 'query',
            description: 'Swagger password.',
            required: true,
            type: 'string',
            schema: "example_swagger_password"
        }
    */
    if((req.query.username === "swagger") &&
        (bcrypt.compareSync(req.query.password, swagger_password))){
        var token = jwt.sign({ username : 'swagger', password : req.query.password }, "secret", { expiresIn : 15 * 60 });
        return res.status(200).send(token);
    }

    return res.status(400).send("username or password error");
}