const fs = require('fs');

//Read Data
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid Id'
        });
    }
    next();
};

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
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
};

exports.getTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = tours.find(el => el.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'Failed',
            message: 'Invalid id'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
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

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    //res.send('Done');
    tours.push(newTour);
    console.log(newTour);

    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        }
    );
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'Success',
        data: null
    });
};