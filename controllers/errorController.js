const AppError=require('./../utils/appError')
const developmentError=(err,res)=>{
    err.status=err.status || 400;
    res.status(err.status).json({
        status:`${err.status}`.startsWith(4)?'failed':'error',
        message:err.message,
        error:err,
        stack:err.stack
    })
}
const ProdError=(err,res)=>{
    if(err.isOperational){
        err.status=err.status || 400;
    res.status(err.status).json({
        status:`${err.status}`.startsWith(4)?'failed':'error',
        message:err.message
    })
    }
    else{
        res.send(500).json({
            status:'failed',
            message:'Something Went Wrong'
        })
    }
}
const handleCastErrorDB = err =>{
    const message= `Invalid ${err.path}:${err.value}`
    return new AppError(message,400)
}
const handleDuplicateErrorDB = err=>{
    const message= `This Tour is ${err.keyValue.name} already there, Please Change the Name`;
    return new AppError(message,400);
}
module.exports=(err,req,res,next)=>{
    let error={...err};
    if(process.env.NODE_ENV==='development'){
        developmentError(error,res)
    }
    else if(process.env.NODE_ENV==='production'){
         if(err.name==='CastError'){
             error=handleCastErrorDB(err)
         }
         if(error.code===11000){
            error=handleDuplicateErrorDB(err)
         }
        ProdError(error,res)
    }
}