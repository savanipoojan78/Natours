const ApiError=require('./appError')
module.exports = fn =>{
    return (req,res,next)=>{
        fn(req,res,next).catch(err=>next(new ApiError(err,400)))
    }
}