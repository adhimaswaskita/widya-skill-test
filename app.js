require('./database/db')
const express = require('express');
const bodyParser= require('body-parser')

const userRoute = require('./routes/user');
const app = express();

app.use(
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.use('/user', userRoute);

app.listen(3000, function() {
    console.log('listening on 3000')
})