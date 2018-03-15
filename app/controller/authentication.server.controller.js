let jwt = require('jsonwebtoken');

exports.generateToken = function(userIdentifier,password,user_id) {

    let user = {
        "password": password

    };
    // let token = jwt.sign(user,process.env.SECRET_KEY, {
    //     expiresIn: 4000
    // });
    let token = "123456";

    token  = token.slice(0,31);
    return { "id": user_id, "token": token };
};
