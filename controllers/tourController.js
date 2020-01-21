const Tour = require('../models/tourModel');

exports.getAllTours = async(req, res) => {
    try {
        //BUILD QUERY
        //1) Filtering
        const queryObj = {...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);

        //console.log(req.query, queryObj);

        //2) Advance Filtering
        // { difficulty: 'easy', duration: { $gte: '5' } }
        // { difficulty: 'easy', duration: { gte: '5' } }

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        //console.log(JSON.parse(queryStr));

        const query = await Tour.find(JSON.parse(queryStr));
        console.log(req.query);
        // const query = await Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');

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