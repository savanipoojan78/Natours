const express=require('express');
const viewController=require('../controllers/viewsController');
const router=express.Router();
const authController=require('./../controllers/authController');

router.use(authController.isLoggedIn)
router.get('/',viewController.getOverview);
router.get('/tour/:slug',authController.protect,viewController.getTour);
router.get('/login',viewController.login);

module.exports=router;