const mongoose = require("mongoose");
let Hotel = mongoose.model("Hotel");

module.exports.getHotels = (req, res, next) => {
    let offset = 0;
    let count = 5;
    if (req.query && req.query.offset) {
        offset = req.query.offset;
    }
    if (req.query && req.query.count) {
        count = req.query.count;
    }
    Hotel
        .find()
        // .skip(offset).limit(count)
        .exec(function (error, hotels) {
            if (error) {
                console.log(error);
                res
                    .status(404)
                    .json({
                        message: "Hotels Record Not Found",
                        error: error
                    });
            } else {
                res
                    .status(200)
                    .json(hotels);
            }
        });
};

module.exports.getOneHotel = (req, res, next) => {
    if (req.params && req.params.hotelId) {
        Hotel
            .findById({
                _id: req.params.hotelId
            })
            .exec(function (error, hotel) {
                if (error) {
                    console.log(error);
                    res
                        .status(404)
                        .json({
                            message: "Requested Hotel Not Found"
                        });
                } else {
                    res
                        .status(200)
                        .json(hotel);
                }
            });
    } else {
        res
            .status(404)
            .json({
                message: "Request params does not contain any hotelId to search for"
            });
    }
};

module.exports.addOneHotel = (req, res, next) => {
    if (req.body && req.body.name && req.body.address && req.body.stars) {
        // let bodyReviews = req.body.reviews;
        // let codeReviews = [];
        // for (let index = 0; index < bodyReviews.length; index++) {
        //     codeReviews.push({
        //         name: bodyReviews[index].name,
        //         review: bodyReviews[index].review,
        //         rating: bodyReviews[index].rating
        //     });
        // }
        let newHotel = new Hotel({
            name: req.body.name,
            stars: req.body.stars,
            "location.address": req.body.address,
            reviews: req.body.reviews,
            services: [req.body.services]
        });
        newHotel
            .save((error, response) => {
                if (error) {
                    res
                        .status(500)
                        .json({
                            message: "Internal Server Error",
                            error: error
                        });
                } else {
                    res
                        .status(200)
                        .json(response);
                }
            });
    } else {
        res
            .status(203)
            .json({
                message: "Required Fields are not passed in request body"
            });
    }
};

module.exports.updateOneHotel = (req, res, next) => {
    let hotelId = req.params.hotelId;
    let updateQuery = {
        $set: {
            "name": req.body.name
        }
    };
    // console.log(hotelId);

    Hotel
        .findByIdAndUpdate(hotelId, updateQuery, function (error, response) {
            if (error) {
                // console.log("Update FAILED");
                res
                    .status(404)
                    .json({
                        message: "The hotel document update FAILED",
                        error: error
                    });
            } else {
                res
                    .status(200)
                    .json({
                        message: "The hotel document is updated successfully"
                    });
            }
        });
};

module.exports.oneReviewOneHotel = (req, res, next)=>{
    let hotelId = req.params.hotelId;
    Hotel
    .findById(hotelId, {"reviews":true})
    // .select("reviews")
    .exec(function(error, reviews){
        if(error){
            res
            .status(404)
            .json({
                message:"Hotel Not Found",
                error:error
            });
        }else{
            let findReview = reviews.reviews.find(function(element){
                if(element.id === req.params.reviewId || element._id === req.params.reviewId){
                    console.log(element.review);
                    return element.review;
                }
            });
            
            // let findReview = reviews.reviews.id(req.params.reviewId);
            res
            .status(200)
            .json(findReview);
        }
    });
};