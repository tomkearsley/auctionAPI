const db = require('../../config/db');

exports.insert =  function(username,givenName,familyName,email,password,done){
  let values = [username,givenName,familyName,email,password];

  db.get_pool().query('INSERT INTO  auction_user (user_username,user_givenname,user_familyname,user_email,user_password) VALUES ?',
      values[0],values[1],values[2],values[3],values[4],function(err,result){
      if (err) return done(err);
      done(result);
    });
};


exports.getOne = function(username,password,done){
    db.get_pool().query('SELECT * FROM auction_user WHERE user_username = ? AND user_password = ?', [username,password],
        function (err,rows) {
        if (err) return done({"ERROR": "Error Selecting"});

    });
};