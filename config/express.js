const express = require('express'),
    bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');


process.env.SECRET_KEY = "tke29-secret-key";

module.exports = function () {
    const app = express();
    app.use(bodyParser.json());
    require('../app/routes/users.server.routes')(app);
    require('../app/routes/auction.server.routes')(app);
    require('../app/routes/database.server.routes')(app);
    //require('../app/routes/photos.server.routes')(app);
    return app;
};