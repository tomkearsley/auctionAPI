let jwt = require('jsonwebtoken');

exports.generateToken = function(username,password,user_id) {

    let user = {
        "username": username,
        "password": password

    };
    let token = jwt.sign(user,process.env.SECRET_KEY, {
        expiresIn: 4000
    });
    return { "id": user_id, "token": token };
};