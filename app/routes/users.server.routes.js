const users = require('../controller/users.server.controller');

module.exports = function(app){
    app.route('/api/v1/users')
        .post(users.create);
};