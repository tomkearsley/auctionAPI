
const fs = require('fs');
const path = 'app/model/photos/';



exports.postPhoto = function(auctionId,contentType,req,done) {
    req.pipe(fs.createWriteStream(path + auctionId + '.' + contentType));
    done(true);

};

exports.deletePhoto = function(auctionId,contentType,done){

    fs.unlink(path + auctionId + '.' + contentType,function(err){
        if(err){
            done(false);
        } else {
            done(true);
        }

    })
};


exports.getPhoto = function(res, auctionId,contentType,done){

    let Photopath = path + auctionId + '.' + contentType;
    res.sendFile(Photopath, {root: './'});
    done(true);

};