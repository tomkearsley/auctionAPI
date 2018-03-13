const users = require('../controller/users.server.controller');

module.exports = function(app){
    app.route('/api/users')
        .post(users.create);
};