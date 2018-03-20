const db = require('../../config/db');


exports.checkToken = function(req,res){
    let userToken = req.get("X-Authorization");
    db.get_pool().query('SELECT user_id FROM auction_user WHERE user_token = ?', userToken,
        function (err, rows) {
            if (err){
                done(false);
                return;
            }
            done(rows[0]['user_token');

        });
}


