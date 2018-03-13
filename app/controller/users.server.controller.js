const User = require('../model/users.server.model');

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



