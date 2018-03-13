const photos = require('../controller/photos.server.controller');

module.exports = function(app){
    app.route('/api/v1/auctions/:id/photos')
        .get(photos.read);
};