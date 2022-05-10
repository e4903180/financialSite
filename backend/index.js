var express = require('express');
var app = express();
var cors = require('cors');
var router = require("./router");
const session = require('express-session')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin : "http://localhost:8080",
    credentials: true,
}));

app.use('/user', router.router)

app.listen(3000, function () {
    console.log('app listening on port 3000!');
});