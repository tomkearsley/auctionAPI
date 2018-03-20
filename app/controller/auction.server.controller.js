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


exports.getOne = function(req,res) {
    let auctionId = req.params.id;
    Auction.getAuction(auctionId,function(resultantAuction){
        if(resultantAuction){
            res.json(resultantAuction);
        }
        else {

        }
    });
};


exports.getHistory = function(req,res) {
    let auctionId = req.params.id;
    Auction.getBidHistory(auctionId,function(result){
        if(result.length > 0){
            res.json(result);
        }
        else {
            res.status(404).send("Bad request.");
        }
    });
};


exports.makeBid = function(req,res){
    let amount = req.query.amount;
    let id = req.params.id;
    User.checkToken(req,function(result){
        let user_id = result;
        Auction.addBid(amount,id,user_id,function(bidAdded){
            if(bidAdded){
                res.status(200).send("OK");

            } else{
                res.status(400).send("Bad request.");
            }

        })
    });
};

exports.updateAuction = function(req,res){
    Auction.getBidHistory(auctionId,function(result){
        if(result.length > 0){
            res.status(403).send("Forbidden - bidding has begun on the auction.");
        } else {
            User.checkToken(req,function(result){

            });
        }
    });

};