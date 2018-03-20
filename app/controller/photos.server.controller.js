const User = require('../model/users.server.model');

const Photos = require('../model/photos.server.model');




exports.post = function (req,res) {
    let auctionId = parseInt(req.params.id);
    let contentType = req.get("Content-Type");
    User.checkToken(req,function(result){
        if (contentType === 'jpeg' || contentType === 'png'||contentType === 'jpg')
            {
            Photos.postPhoto(auctionId,contentType,req,function(photoAdded){
            if(photoAdded){
                res.status(201).send("OK");
            } else {
                res.status(400).send("Bad request.");
            }
        })
        }

    });

};

exports.delete = function(req,res) {
    let auctionId = parseInt(req.params.id);
    let contentType = req.get("Content-Type");
    User.checkToken(req,function (result) {
        if (contentType === 'jpeg' || contentType === 'png'||contentType === 'jpg')
        {
            Photos.deletePhoto(auctionId,contentType,function(photoRemoved){
                if(photoRemoved){
                    res.status(201).send("OK");
                } else {
                    res.status(400).send("Bad request.");
                }
            })
        }

    })
};

exports.get = function(req,res){
    let auctionId = parseInt(req.params.id);
    let contentType = req.get('Content-Type')
    Photos.getPhoto(res, auctionId,contentType,function(result){
        if(result){
            //res.status(200).send("OK");
        } else {
            res.status(400).send("Bad request.")
        }
    })
};

