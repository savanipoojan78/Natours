const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFetures');
const catchAsync =require('../utils/catchAsync');

exports.aliasTopTours = async(req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingAverage,difficulty';
    next();
};

exports.getAllTours = catchAsync(async(req, res,next) => {
    
        //BUILD QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        // EXECUTE THE QUERY
        const tours = await features.query;

        //SEND RESPONSE
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
});

exports.getTour = catchAsync(async(req, res) => {
    
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
});

exports.updateTour = catchAsync(async(req, res) => {
    
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'Success',
            data: {
                tour
            }
        });
});

exports.createTour = catchAsync(async(req, res) => {
    
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
   
});

exports.deleteTour = catchAsync( async(req, res) => {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'Success',
            data: null
        });
});

exports.getTourStats =  catchAsync(async(req, res) => {
    
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

exports.getMonthlyPlan= catchAsync(async(req, res) => {
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