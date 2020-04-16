const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Morgan Middleware
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Output look like this :- GET /api/v1/tours 200 263.782 ms - 8642
}

//MidleWare
//to get access of body parameter in response
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//this two are middleware , Mount Our Router // if we get Router like '/api/v1/tours' then go to this @tourRouter Function
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*',(req,res,next)=>{
    res.status(400).json({
        status:'failed',
        message:`route ${req.originalUrl} is not defined`
    })
    next();
});

module.exports = app;