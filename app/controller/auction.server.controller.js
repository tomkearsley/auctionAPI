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

    let new_data = [req.body.categoryId,req.body.title,req.body.description,req.body.startingDate,req.body.endingDate,
    req.body.reservePrice,req.body.startingBid];
    let packetDataNames = ["auction_categoryid","auction_title","auction_description","auction_reserveprice",
        "auction_startingprice","auction_startingdate","auction_endingdate"];
    let auctionId = req.params.id;

    try {
        Auction.getEditableData(auctionId,function(auctionExists){
            current_data = auctionExists;
            if(auctionExists){
                Auction.getBidHistory(auctionId,function(result){
                    if(result.length > 0){
                        res.status(403).send("Forbidden - bidding has begun on the auction.");
                    } else {
                        User.checkToken(req,function(result){
                            let user_id = result;
                            if(isNaN(user_id) == false && user_id === current_data[0]['auction_userid']){
                                for(let i = 0; i < 7; i++){
                                    if(new_data[i] == undefined){
                                        new_data[i] = (current_data[0][packetDataNames[i]]);
                                    }
                                }
                                new_data.push(parseInt(auctionId));
                                Auction.updateAuction(new_data,function(updatedAuction){
                                    if(updatedAuction){
                                        res.status(200).send("OK");
                                    } else {
                                        res.status(400).send("Bad request.")
                                    }
                                });

                            } else {
                                res.status(401).send("Unauthorized");
                            }

                        });
                    }
                });
            } else {
                res.status(404).send("Not found.");
            }
        });

    } catch(Exception){
        res.status(500).send("Internal server error");
    }





};