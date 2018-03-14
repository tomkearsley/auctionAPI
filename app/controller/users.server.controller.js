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

        console.log(user_data);

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
    let username = req.query.user_username;
    let password = req.query.user_password;
    User.login(username,password,function(result){
        if(result){
            let userReply = authenticate.generateToken(username,password,result);
            res.json(userReply);
            let user_id = userReply['id'];
            let token = userReply['token'];

            User.insertToken(token,user_id,function(result){
            });

        } else {
            res.send("Invalid username/email/password supplied");
        }
    });
}

exports.getUser = function(req,res){
    User.checkToken(req,function(result){
        if(result){
            console.log("Working");
        }
    });





}

