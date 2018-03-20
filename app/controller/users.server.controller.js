const User = require('../model/users.server.model'),
    authenticate = require('./authentication.server.controller');

exports.create = function(req, res) {
    let user_data = [[
        req.body.username,
        req.body.givenName,
        req.body.familyName,
        req.body.email,
        req.body.password
    ]];
    User.insert(user_data, function(result) {
        if (result === false) {
            console.log(result);
            res.status(400).send("malformed request");
        } else {
            res.status(200).send(result);
        }
    });
};

exports.read = function(req,res){
    let userIdentifier = req.query.username;
    if (userIdentifier === undefined){
        userIdentifier = req.query.email;
    }
    let password = req.query.password;
    User.login(userIdentifier,password,function(result){
        if(result){
            let userReply = authenticate.generateToken(userIdentifier,password,result);
            res.json(userReply);
            let user_id = userReply['id'];
            let token = userReply['token'];

            User.insertToken(token,user_id,function(result){
            });

        } else {
            res.status(400).send("Invalid username/email/password supplied");
        }
    });
};


/**
 * Return Json file of user.
 * @param req
 * @param res
 */
exports.getUser = function(req,res){
    let userID = req.params.id;
    User.checkToken(req,function(result){
        if(result == userID){
            User.getUserJson(result,function(resultantUser){
                res.json(resultantUser);
            });

        } else {
            res.status(404).send("Not Found")
        }
    });





};

/**
 * Logout Function
 * If Token is valid, it will log out. Else 401 error will be returned
 * @param req used in check token method.
 * @param res Used to throw correct code
 */
exports.logOut = function(req,res){
    User.checkToken(req,function(result){
        if(result){
            User.ResetToken(result,function(leavingUser){
                res.status(200).send("OK");
            });

        } else {
            res.status(401).send("Unauthorized");
        }
    });

};


exports.updateUser = function (req,res){

    let user_data = [req.body.username,req.body.givenName,req.body.familyName,req.body.email,req.body.password,req.body.accountBalance];

    let DataNames = ['username','givenName','familyName','email','password','accountBalance','reputation'];

    User.checkToken(req,function(correctToken){
        if(correctToken){
            User.getUserJson(correctToken,function(resultantUser){
                let user = resultantUser;
                for (let i = 0; i < 6; i++){
                    if(user_data[i] === undefined){
                        user_data[i] = user[0][DataNames[i]];
                    }

                }
                user_data.push(correctToken);
                User.updateUserDetails(user_data,function(result) {
                    if(result){
                        res.status(200).send("OK");
                    } else {
                        res.status(500).send("Internal server error");
                    }
                });

            });


        } else {
            res.status(401).send("Unauthorized");
        }
    });
};

