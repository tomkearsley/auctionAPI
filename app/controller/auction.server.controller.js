const User = require('../model/users.server.model');

const Auction = require('../model/auction.server.model');

const moment = require('moment');

exports.create = function(req,res){
    let token = req.get('X-Authorization');
    let auction = [[
        req.body.title,
        req.body.categoryId,
        req.body.description,
        req.body.reservePrice,
        req.body.startingBid,
        (moment(req.body.startDateTime).format("YYYY-MM-DD hh-mm-ss")),
        (moment(req.body.endDateTime).format("YYYY-MM-DD hh-mm-ss")),
        (moment(Date.now()).format("YYYY-MM-DD hh-mm-ss"))
    ]];
    if (req.body.categoryId < 1){
        res.status(400).send("Bad request.");
        return;
    }
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


exports.getOne = function(req, res) {
    let auctionId = req.params.id;
    let response = {
        "categoryId": 0,
        "categoryTitle": "string",
        "title": "string",
        "reservePrice": 0,
        "startDateTime": 0,
        "endDateTime": 0,
        "description": "string",
        "creationDateTime": 0,
        "seller": {
            "id": 0,
            "username": "string",
        },
        "currentBid": 0,
        "bids": []
    };
    Auction.getAuction(auctionId, function(auction) {
        if (auction) {
            response["categoryId"] = auction[0]["auction_categoryid"];
            response["categoryTitle"] = auction[0]["auction_title"];
            response["reservePrice"] = auction[0]["auction_reserveprice"];
            response["startDateTime"] = auction[0]["auction_startingdate"];
            response["endDateTime"] = auction[0]["auction_endingdate"];
            response["description"] = auction[0]["auction_description"];
            response["creationDateTime"] = auction[0]["auction_creationdate"];
        } else {
            res.send(404).send("Not found");
            return;
        }
        Auction.getHighestBid(auctionId,function(currentBid){
            response["currentBid"] = currentBid[0]['currentBid'];
        });
        let userId = auction[0]["auction_userid"];
        Auction.getSeller(userId, function(sellerRows) {
            let userName = sellerRows[0]["username"];
            response["seller"] = {"id": userId, "username": userName};
            Auction.getBidHistory(auctionId, function(bids) {
                response["bids"] = bids;
                res.status(200).send(response);
            });
        });
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
    let bidTime = (moment(Date.now()).format("YYYY-MM-DD hh-mm-ss"));
    User.checkToken(req,function(result){
        let user_id = result;
        Auction.addBid(amount,id,user_id,bidTime,function(bidAdded){
            if(bidAdded){
                res.status(200).send("OK");

            } else{
                res.status(400).send("Bad request.");
            }

        })
    });
};

exports.updateAuction = function(req,res){
    let startDate = moment(req.body.startDateTime.format("YYYY-MM-DD hh-mm-ss"));
    let endDate = moment(req.body.endDateTime.format("YYYY-MM-DD hh-mm-ss"));

    let new_data = [req.body.categoryId,req.body.title,req.body.description,startDate,endDate,
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