const express = require('express');
const authController=require('./../controllers/authController');
const reviewController = require('../controllers/reviewController');
const router = express.Router({mergeParams:true});


router
    .route('/')
    .get(reviewController.getAllReviews) 
    .post(authController.protect,authController.restrict('user'), reviewController.setTourAndUserId, reviewController.createReview);

router.
    route('/:id')
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview)
    .get(reviewController.getOneReview);

module.exports=router;