module.exports=(err,req,res,next)=>{
    err.status=err.status;
    res.status(err.status).json({
        status:`${err.status}`.startsWith(4)?'failed':'error',
        message:err.message
    })
}