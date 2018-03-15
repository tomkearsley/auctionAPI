const users = require('../controller/users.server.controller');

module.exports = function(app){
    app.route('/api/v1/users')
        .post(users.create);
    app.route('/api/v1/users/login')
        .post(users.read);
    app.route('/api/v1/users/:id')
        .get(users.getUser)
        .patch(users.updateUser);
    app.route('/api/v1/users/logout')
        .post(users.logOut);
};