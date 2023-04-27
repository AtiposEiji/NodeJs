const Review = require("../../models/review/reviewModel");
const factory = require("../handler/handlerFactory");
// const APIFeatures = require("../../utils/apiFeatures");
// const appError = require("../../utils/appError");
// const catchAsync = require("../../utils/catchAsync");

exports.getAllReviews = factory.getAll(Review);

// catchAsync(async (req, res, next) => {
//     let filter = {};

//     if(req.params.tourId){
//         filter = { tour: req.params.tourId };
//     }
    
//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status: "success",
//         results: reviews.length,
//         data: {
//             reviews
//         }
//     })
// })

exports.setTourUserId = (req, res, next) => {
    // Allow nested routes
    if(!req.body.tour){
        req.body.tour = req.params.tourId
    }

    if(!req.body.user){
        req.body.user = req.user.id
    }
    next();
}

exports.postReview = factory.postOne(Review);

// catchAsync(async (req, res, next) => {
//     // Allow nested routes
//     if(!req.body.tour){
//         req.body.tour = req.params.tourId
//     }

//     if(!req.body.user){
//         req.body.user = req.user.id
//     }

//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: "success",
//         data: {
//             review: newReview
//         }
//     })
// })

exports.getReview = factory.getOne(Review);
exports.patchReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);