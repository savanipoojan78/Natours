const AppError=require('./../utils/appError')
const developmentError=(err,res)=>{
    err.status=err.status || 400;
    res.status(err.status).json({
        status:`${err.status}`.startsWith(4)?'failed':'error',
        message:err.errorMessage,
        error:err,
        stack:err.stack
    })
}
const ProdError=(err,res)=>{
    console.log(err)
    if(err.isOperational){
        err.status=err.status || 400;
    res.status(err.status).json({
        status:`${err.status}`.startsWith(4)?'failed':'error',
        message:err.errorMessage
    })
    }
    else{
        res.status(500).json({
            status:'failed',
            message:'Something Went Wrong'
        })
    }
}
const handleCastErrorDB = err =>{
    const message= `Invalid ${err.path}:${err.value}`
    console.log(message);
    return new AppError(message,400)
}
const handleDuplicateErrorDB = err=>{
    const message= `This ${Object.keys(err.keyValue)} is ${err.keyValue[Object.keys(err.keyValue)]} already there, Please Change it`;
    return new AppError(message,400);
}
const handleValidationErrorDB= err=>{
    const data=Object.values(err.errors).map(el=>el.message)
    const message=`Invalid data input ${data.join('. ')}`;
    return new AppError(message,400);
}
module.exports=(err,req,res,next)=>{
    let error={...err};
    if(process.env.NODE_ENV==='development'){
        developmentError(error,res)
    }
    else if(process.env.NODE_ENV==='production'){
         if(error.name==='CastError'){
             error=handleCastErrorDB(err)
         }
         else if(error.code===11000){
            error=handleDuplicateErrorDB(err)
         }
         else if(error.name==='ValidationError') error= handleValidationErrorDB(err)
        ProdError(error,res)
    }
}