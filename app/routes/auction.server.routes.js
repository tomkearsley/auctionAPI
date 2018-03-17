const auctions = require('../controller/auction.server.controller');


module.exports =  function(app){

    app.route('/api/v1/auctions')
        //.get(auctions.getAuctions)
        .post(auctions.create);

    app.route('/api/v1/auctions/:id')
        .get(auctions.getOne);

};

