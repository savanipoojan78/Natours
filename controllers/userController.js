const User=require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError=require('./../utils/appError')
const factory=require('./handlerFactory');

const filterObj=(obj, ...filters)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
        if(filters.includes(el)) newObj[el]=obj[el]
    })
    return newObj;
}

exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id;
    next();
}
exports.updateMe=catchAsync(async(req,res,next)=>{
    if(req.body.password || req.body.passwordConfirm){
        next(new AppError('This is not For changing the password',400));
    }
    const filterBody=filterObj(req.body,'name','email');
    const user=await User.findByIdAndUpdate(req.user._id,filterBody,{runValidators:true,new :true}).select('-__v')
    res.status(200).json({
        status:'sucess',
        data:{
            user
        }
    })
});

exports.deleteMe=catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user._id,{active:false})
    res.status(200).json({
        status:'success',
        data:null
    })
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet Define'
    });
};
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// Do not Update Password With
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);