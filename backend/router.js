var express = require('express')
var router = express.Router();
const User = require('./Controller/userController');

router.post('/login', User.login)

module.exports = {router};