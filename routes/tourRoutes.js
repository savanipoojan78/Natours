const express = require('express');

const tourController = require('../controllers/tourController');
const router = express.Router();

router.param('id', tourController.checkID);

router
    .route('/')
    .get(tourController.getAllTours) // if route is /api/v1/users and it is http get methode then @getAllTours function will be Call.
    .post(tourController.createTour); // if route is /api/v1/users and it is http post methode then @createTour function will be Call.

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;