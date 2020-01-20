const Tour = require('../models/tourModel');

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'Failed',
            message: 'Missing name and Price'
        });
    }
    next();
};

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        // status: 'success',
        // requestedAt: req.requestTime,
        // results: tours.length,
        // data: {
        //     tours
        // }
    });
};

exports.getTour = (req, res) => {
    const id = parseInt(req.params.id);
    // const tour = tours.find(el => el.id === id);

    // if (!tour) {
    //     return res.status(404).json({
    //         status: 'Failed',
    //         message: 'Invalid id'
    //     });
    // }
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // });
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'Success',
        data: {
            tour: 'Update Sucessfull'
        }
    });
};

exports.createTour = (req, res) => {
    // console.log(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'Success',
        data: null
    });
};