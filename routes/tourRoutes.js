const express = require('express');
const authController=require('./../controllers/authController');
const tourController = require('../controllers/tourController');
const reviewController=require('../controllers/reviewController');
const router = express.Router();

//router.param('id', tourController.checkID);
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthy-plan/:year').get(tourController.getMonthlyPlan);
router
    .route('/')
    .get(authController.protect, tourController.getAllTours) // if route is /api/v1/users and it is http get methode then @getAllTours function will be Call.
    .post(tourController.createTour); // if route is /api/v1/users and it is http post methode then @createTour function will be Call.

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect,authController.restrict('admin','lead-guide'),tourController.deleteTour);

router.
    route('/:tourId/review')
    .post(authController.protect,authController.restrict('user'),reviewController.createReview);    
module.exports = router;