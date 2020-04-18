const catchAsync = require('./../utils/catchAsync')
const AppError=require('./../utils/appError')
const Review=require('./../models/reviewModel');

exports.getAllReviews=catchAsync(async(req,res,next)=>{
    const review=await Review.find();
    res.status(200).json({
        status:'sucess',
        results:review.length,
        data:[
            review
        ]
    })
});

exports.createReview=catchAsync(async(req,res,next)=>{
    const review=await Review.create(req.body);
    console.log(JSON.stringify(review,null,4))
    res.status(201).json({
        status:'sucess',
        data:{review}
    }) 
});