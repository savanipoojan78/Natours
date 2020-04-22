const express = require('express');
const morgan = require('morgan');
const helmet=require('helmet');
const path=require('path');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean')
const hpp=require('hpp')
const rateLimit=require('express-rate-limit')
const AppError=require('./utils/appError')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter=require('./routes/reviewRoutes');
const globalErrorController=require('./controllers/errorController')

const app = express();
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

// *** Global MidleWare ****

// security Middlware
app.use(helmet())

//Morgan Middleware for Development logger
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Output look like this :- GET /api/v1/tours 200 263.782 ms - 8642
}

//Rating middleware fir the same api
const limit=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many Request from this IP ,please try again after one hour'
});
app.use('/api',limit)

//To get access of body parameter in response
app.use(express.json({max:'10kb'}));

//To server Static file middlware
app.use(express.static(`${__dirname}/public`));

//DATA sanitization agaist Nosql query injection
app.use(mongoSanitize())

//Data sanitization agaist XSS
app.use(xss())

//Prevent Parameter Pollution
app.use(hpp({
    whitelist:[
        'ratingsAverage',
        'ratingsQuantity',
        'duration',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}))

// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
app.get('/', (req, res) => {
    res.status(200).render('base',{
        tour:'Poojan'
    });
})
app.get('/overview',(req,res)=>{
    res.status(200).render('overview',{
        title:"All Tours"
    })
})
app.get('/tour',(req,res)=>{
    res.status(200).render('overview',{
        title:"The Forest Hiker"
    })
})
//this two are middleware , Mount Our Router // if we get Router like '/api/v1/tours' then go to this @tourRouter Function
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews',reviewRouter);

app.all('*',(req,res,next)=>{
    next(new AppError(`route ${req.originalUrl} is not defined`,400))
});
app.use(globalErrorController)

module.exports = app;