const Tour = require('../models/tourModel');
const catchAsync =require('../utils/catchAsync');
const AppError=require('./../utils/appError');
const factory=require('./handlerFactory');

exports.aliasTopTours = async(req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingAverage,difficulty';
    next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour,{path:'reviews'});
exports.updateTour = factory.updateOne(Tour);
exports.createTour = factory.createOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats =  catchAsync(async(req, res,next) => {
    
        const stats = await Tour.aggregate([{
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    // _id: '$ratingsAverage',
                    numRatings: { $sum: '$ratingsQuantity' },
                    numTours: { $sum: 1 },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            // {
            //     $match: { _id: { $ne: 'EASY' } }
            // }
            
        ]);
        res.status(200).json({
            status: 'Success',
            stats
        });
    
});

exports.getMonthlyPlan= catchAsync(async(req, res,next) => {
        const year=req.params.year*1;
        const plan = await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte:new Date(`${year}-01-01`),
                        $lte:new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id:{$month:'$startDates'},
                    numTourStart:{$sum:1},
                    tours:{$push:'$name'}

                }
            },
            {
                $addFields:{
                    month:'$_id'
                }
            },
            {
                $project:{_id:0}
            },
            {
                $sort:{numTourStart:-1}
            }
        ]);
        res.status(200).json({
            status: 'Success',
            plan
        });

});
exports.getToursWithIn=catchAsync(async(req, res,next)=>{
    const {distance,latlng,unit}={...req.params};
    const [lat,lng]=latlng.split(',');
    const radius=unit==='mi'?distance/3963.2:distance/6378.1;
    if(!lat || !lng){
        next(new AppError('Please Provide Latitude and Longitude'));
    }
    const tour=await Tour.find({
        startLocation:{
            $geoWithin:{
                $centerSphere:[[lng,lat],radius]
            }
        }
    });
    console.log(`radius is ${radius}`);
    res.status(200).json({
        status:'sucess',
        results:tour.length,
        data:{
            data:tour
        },

    })
})