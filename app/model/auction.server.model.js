const db = require('../../config/db');

exports.createAuction = function(token, auction_data, done) {
    let userId = null;
    let sql_1 = "SELECT user_id FROM auction_user WHERE user_token = ?"
    let sql_2 = "INSERT INTO auction (auction_title, auction_categoryid, auction_description, auction_reserveprice, auction_startingprice, auction_startingdate, auction_endingdate, auction_userid) VALUES (?);";
    sql_2 += "SELECT LAST_INSERT_ID() AS auction_id;";
    db.get_pool().query(sql_1, token, function(err, rows) {
        if (err) {
            done(false);
        } else {
            userId = rows[0]['user_id'];
            auction_data[0].push(userId);
        }
        db.get_pool().query(sql_2, auction_data, function(err, rows) {
            if (err) {
                console.log(err);
                done(false);
            } else {
                done(rows[1][0]['auction_id']);
            }
        });
    });
};
exports.getAuction = function(auctionId,done){
    let sql = "SELECT DISTINCT * FROM ((auction INNER JOIN auction_user ON auction.auction_userid = auction_user.user_id) INNER JOIN bid ON auction_userid = bid.bid_userid) WHERE auction_id = ?;"
    db.get_pool().query(sql,auctionId,function (err,rows) {
        if(err){
            done(false);
        } else{
            done(rows);
        }

    });
};


exports.getBidHistory = function(auctionId,done){
    let sql = "SELECT bid.bid_amount AS amount, bid.bid_datetime AS datetime, bid.bid_userid AS buyerId, auction_user.user_username AS buyerUsername FROM bid INNER JOIN " +
        "auction_user ON auction_user.user_id=bid.bid_userid WHERE bid.bid_auctionid = ?;";
  db.get_pool().query(sql,auctionId,function(err,rows){
     if(err){
         done(false);
     } else {
         done(rows);
     }
  });
};

exports.addBid = function(amount,id,user_id,done){
    db.get_pool().query("INSERT INTO bid (bid_auctionid,bid_amount,bid_userid) VALUES (?, ?, ?)",[id,amount,user_id],function(err,rows){
        if(err){
            console.log(err);
            done(false);
        } else {
            console.log(rows);
            done(rows);
        }
    });
};

exports.getEditableData = function(auctionId,done){
    db.get_pool().query("SELECT auction_title,auction_categoryid,auction_description,auction_reserveprice,auction_startingprice,auction_startingdate,auction_endingdate,auction_userid FROM auction WHERE auction_id = ?;",
        auctionId,function(err,data){
        if(err){
            console.log(err);
            done(false);
        } else {
            done(data);
        }
        });
};


exports.updateAuction =  function (auctionData,done) {
    sql = "UPDATE auction SET auction_categoryid = ?, auction_title = ?, auction_description = ?, auction_reserveprice = ?,  auction_startingprice = ? ,auction_startingdate = ?, auction_endingdate = ? WHERE auction_id = ?"
    db.get_pool().query(sql,auctionData,
        function(err,data){
        if(err){
            done(false);
        } else {
            done(true);
        }
        });

}
