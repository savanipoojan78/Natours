const catchAsync = require('./../utils/catchAsync')
const AppError=require('./../utils/appError')
const Review=require('./../models/reviewModel');
const factory=require('./handlerFactory');

exports.getAllReviews=catchAsync(async(req,res,next)=>{
    let filter={};
    const tourId=req.params.tourId;
    if(tourId)filter={tour:tourId};
    const review=await Review.find(filter);
    console.log(review);
    res.status(200).json({
        status:'sucess',
        results:review.length,
        data:[
            review
        ]
    })
});

exports.setTourAndUserId=(req,res,next)=>{
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user=req.user._id;
    next();
}

exports.createReview=factory.createOne(Review);
exports.deleteReview=factory.deleteOne(Review);
exports.updateReview=factory.updateOne(Review);