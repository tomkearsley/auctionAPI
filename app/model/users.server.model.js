const db = require('../../config/db');


exports.insert = function(user_data, done) {
    let sql = "INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email, user_password) VALUES (?); SELECT LAST_INSERT_ID() AS user_id";
    db.get_pool().query(sql, user_data, function(err, rows) {
        if (err) {

            return done(false);
        } else {
            done({"id": rows[1][0]['user_id']});
        }
    });
};


exports.login = function(userIdentifier,password,done){
    db.get_pool().query('SELECT user_id FROM auction_user WHERE (user_username = ? OR user_email = ?) ' +
        'AND user_password = ?', [userIdentifier,userIdentifier,password],
        function (err, rows) {
        if (err){
            done(false);
            return;
        }
            try {
                done(rows[0]['user_id']);
            } catch (TypeError) {
                done(false);
            }


    });
};

/**
 * Inserts token into user after login has been completed.
 * @param token
 * @param user_id
 * @param done Returns true if successful
 */
exports.insertToken = function(token,user_id,done){
    db.get_pool().query('UPDATE auction_user SET user_token = ? WHERE user_id = ?',[token,user_id],function(err,result){
        if (err) return done(err);
        done(result);

    });
};
/**
 * Checks if the user provided token matches the token stored on the database.
 * @param req Header required to get provided X-Authorization header
 * @param done Returns false if token is incorrect, else returns the id of user.
 */
exports.checkToken = function(req,done){
    let userToken = req.get("X-Authorization");
    db.get_pool().query('SELECT user_id FROM auction_user WHERE user_token = ?', userToken,
        function (err, rows) {
            if (err){
                done(false);
                return;
            }
            try{
                done(rows[0]['user_id']);
            } catch (TypeError) {
                done(false);
            }


        });
};

exports.getUserJson = function(user_id,done){
    db.get_pool().query('SELECT user_username AS username ,user_givenname AS givenName ,user_familyname AS familyName, ' +
        'user_email AS email, user_accountbalance AS accountBalance FROM auction_user WHERE user_id = ?',user_id,
        function(err,result){
        if(err) {
            done(false);
            return;
        }
        done(result);
    });
};

exports.ResetToken = function(user_id,done){
    db.get_pool().query('UPDATE auction_user SET user_token = null WHERE user_id = ?',user_id,function(err,result){
        if (err) return done(err);
        done(result);
    });
};



exports.updateUserDetails = function(user_details,done){
    let id = user_details['id'];
    let username = user_details['username'];
    let givenName = user_details['givenName'];
    let familyName = user_details['familyName'];
    let email = user_details['email'];
    let password = user_details['password'];
    let salt = user_details['salt'];
    let token = user_details['token'];
    let accountBalance = user_details['accountBalance'];
    let reputation = user_details['reputation'];
    let sql = "UPDATE auction_user SET user_id = ?,user_username = ?, user_givenname = ?,user_familyname = ?,user_email = ?,user_password = ?,user_salt = ?, user_token = ?, user_accountbalance = ?,user_reputation = ? WHERE user_id = ?"
    db.get_pool().query(sql,[id,username,givenName,familyName,email,password,salt,token,accountBalance,reputation,id],function(err,result) {
        if (err){
            done(result);
        }
        done(result);
    });

};
