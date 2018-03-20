const db = require('../../config/db');

exports.createAuction = function(token, auction_data, done) {
    let userId = null;
    let sql_1 = "SELECT user_id FROM auction_user WHERE user_token = ?"
    let sql_2 = "INSERT INTO auction (auction_title, auction_categoryid, auction_description, auction_reserveprice, auction_startingprice, auction_startingdate, auction_endingdate,auction_creationdate, auction_userid) VALUES (?);";
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
    let sql = "SELECT * FROM auction WHERE auction_id = ?;"
    db.get_pool().query(sql,auctionId,function (err,rows) {
        if(err){
            done(false);
        } else{
            done(rows);
        }

    });
};


exports.getSeller = function(userId,done){
    db.get_pool().query("SELECT user_id AS id, user_username AS username FROM auction_user WHERE user_id = ? ",userId,function(err,result){
       if(err){
           done(false);
       }  else {
           done(result);
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

exports.addBid = function(amount,id,user_id,bidTime,done){
    db.get_pool().query("INSERT INTO bid (bid_auctionid,bid_amount,bid_userid,bid_datetime) VALUES (?, ?, ?,?)",[id,amount,user_id,bidTime],function(err,rows){
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
        function(err){
        if(err){
            done(false);
        } else {
            done(true);
        }
        });

};

exports.getHighestBid = function(auctionId,done){
    db.get_pool().query("SELECT max(bid_amount) AS currentBid FROM bid WHERE bid_auctionid = ?",auctionId,
        function(err,data){
            if(err){
                done(false);
            } else {
                done(data);
            }
        });
};
