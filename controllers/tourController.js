const Tour = require('../models/tourModel');

exports.aliasTopTours = async(req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingAverage,difficulty';
    next();
};
exports.getAllTours = async(req, res) => {
    try {
        // const query = await Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');

        //BUILD QUERY

        //1A) Filtering
        const queryObj = {...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);

        //1B) Advance Filtering

        // { difficulty: 'easy', duration: { gte: '5' } } // Convert this req response to the given below
        // { difficulty: 'easy', duration: { $gte: '5' } }

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        //2) Sorting

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            //By default sorting by createdAt in asc order
            query = query.sort('-createdAt');
        }

        //3) Fileds limiting

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields); //Projecting
        } else {
            //here - indicate that that field is excluded.
            query = query.select('-__v');
        }

        //Paging
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;
        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) {
                throw new Error("This Page Doesn't exit ");
            }
        }

        query = query.skip(skip).limit(limit);

        // EXECUTE THE QUERY
        const tours = await query;

        //SEND RESPONSE
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
};

exports.getTour = async(req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
};

exports.updateTour = async(req, res) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err
        });
    }
};

exports.createTour = async(req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err
        });
        //console.log()
    }
};

exports.deleteTour = async(req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'Success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err
        });
    }
};