const User = require('../model/users.server.model');

const Auction = require('../model/auction.server.model');



exports.create = function(req,res){
    let token = req.get('X-Authorization');
    let auction = [[
        req.body.title,
        req.body.categoryId,
        req.body.description,
        req.body.reservePrice,
        req.body.startingBid,
        req.body.startDateTime,
        req.body.endDateTime
    ]];
    User.checkToken(req,function(result){
        if(result){
            Auction.createAuction(token,auction,function(isInserted){
                if(isInserted){
                    res.status(200).send("OK");
                }

            });
        } else {
            res.status(401).send("Unauthorized");
        }


    });

};