const developmentError=(err,res)=>{
    err.status=err.status;
    res.status(err.status).json({
        status:`${err.status}`.startsWith(4)?'failed':'error',
        message:err.message,
        error:err,
        stack:err.stack
    })
}
const ProdError=(err,res)=>{
    if(err.isOperational){
        err.status=err.status;
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

module.exports=(err,req,res,next)=>{
    if(process.env.NODE_ENV==='development'){
        developmentError(err,res)
    }
    else if(process.env.NODE_ENV==='production'){
        ProdError(err,res)
    }
}