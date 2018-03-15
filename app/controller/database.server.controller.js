const database = require('../model/database.server.model');

exports.reset = function (req, res) {
    database.reset(function(result) {
        if (result) {
            res.status(200).send('OK');
        } else {
            res.status(400).send('Malformed request.');
        }
    });
};

exports.resample = function (req, res) {
    database.resample(function(result) {
        if (result) {
            res.status(201).send('Sample of data has been reloaded.');
        } else {
            res.status(400).send('Malformed request.');
        }
    });
};