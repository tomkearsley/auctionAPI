


const validToken = function (req,res,next) {
    if (isValidToken(req.get('X-Authorization'))) {
        next();
    } else {
        res.sendStatus(401);
    }
}