const User = require('../model/users.server.model'),
    authenticate = require('./authentication.server.controller');

exports.create = function(req,res){
        let user_data =  {
            "username": req.body.username,
            "givenName": req.body.givenName,
            "familyName": req.body.familyName,
            "email": req.body.email,
            "password": req.body.password
        };

        let username = user_data['username'].toString();
        let givenName = user_data['givenName'].toString();
        let familyName = user_data['familyName'].toString();
        let email = user_data['email'].toString();
        let password = user_data['password'].toString();
        let user = [];
        user.push(username,givenName,familyName,email,password);

        let values = [
            [user]
        ];


        User.insert(values,function(result){
            res.json(result);
        });
};


exports.read = function(req,res){
    let userIdentifier = req.query.username;
    if (userIdentifier == undefined){
        let email = req.query.email;
        userIdentifier = email;
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
            res.send("Invalid token supplied")
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
                res.status(200).send();
            });

        } else {
            res.status(401).send();
        }
    });

};


exports.updateUser = function (req,res){
    User.updateUserDetails()
}

