const
    bodyParser = require('body-parser'),
    express = require('express');

var app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send({"message": "Hello World!"})
});

app.listen(4841, function () {
    console.log('port 4841!')
})
