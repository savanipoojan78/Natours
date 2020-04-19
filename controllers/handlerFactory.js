const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');

exports.deleteOne=Model=>catchAsync( async(req, res,next) => {
    const doc=await Model.findByIdAndDelete(req.params.id);
    if(!doc){
        return next(new AppError('can not find this Document With Given Id',404))
    }
    res.status(204).json({
        status: 'Success',
        data: null
    });
});