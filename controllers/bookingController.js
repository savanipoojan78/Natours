const catchAsync = require('./../utils/catchAsync')
const AppError=require('./../utils/appError')
const stripe=require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');


exports.getSession=catchAsync(async(req,res,next)=>{
    const tour=await Tour.findById(req.params.tourId);
    const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        line_items:[{
            name:`${tour.name} Tour`,
            description: tour.summary,
            images:[`https://www.natours.dev/img/tours/tour-2-1.jpg`],
            amount:tour.price*100,
            currency:'inr',
            quantity:1,

        }]
    });
    res.status(200).json({
        status:'success',
        session
    })

})

exports.createBookingCheckout=catchAsync(async(req,res,next)=>{
    const {user,tour,price}=req.query;
    console.log(user,tour,price);
    if(!user && !tour && !price) return next();
    await Booking.create({user,tour,price});

    res.redirect(req.originalUrl.split('?')[0]);
})