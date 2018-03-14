const db = require('../../config/db');


exports.insert =  function(username,givenName,familyName,email,password,done){
  let values = [username,givenName,familyName,email,password];

  db.get_pool().query('INSERT INTO  auction_user (user_username,user_givenname,user_familyname,user_email,user_password) V  `ALUES ?',
      values[0],values[1],values[2],values[3],values[4],function(err,result){
      if (err) return done(err);
      done(result);
    });
};


exports.login = function(username,password,done){
    db.get_pool().query('SELECT user_id FROM auction_user WHERE user_username = ? AND user_password = ?', [username,password],
        function (err, rows) {
        if (err){
            done(false);
            return;
        }
            done(rows[0]['user_id']);

    });
};


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
            done(rows[0]['user_id']);

        });
}