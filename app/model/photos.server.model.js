
const fs = require('fs');
const path = 'app/model/photos/';



exports.postPhoto = function(auctionId,contentType,req,done) {
    req.pipe(fs.createWriteStream(path + auctionId + '.' + contentType));
    done(true);

};

