const express = require('express');

const tourController = require('../controllers/tourController');
const router = express.Router();

//router.param('id', tourController.checkID);
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthy-plan/:year').get(tourController.getMonthlyPlan);
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