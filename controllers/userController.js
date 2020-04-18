const User=require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError=require('./../utils/appError')

const filterObj=(obj, ...filters)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
        if(filters.includes(el)) newObj[el]=obj[el]
    })
    return newObj;
}
exports.getAllUsers = catchAsync(async(req, res,next) => {
    const user=await User.find().select('-__v')
    
    res.status(201).json({
        status:'success',
        user:{
           user
        }
    })
});

exports.updateMe=catchAsync(async(req,res,next)=>{
    if(req.body.password || req.body.passwordConfirm){
        next(new AppError('This is not For changing the password',400));
    }
    const filterBody=filterObj(req.body,'name','email');
    const user=await User.findByIdAndUpdate(req.user.id,filterBody,{runValidators:true,new :true}).select('-__v')
    res.status(200).json({
        status:'sucess',
        data:{
            user
        }
    })
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet Define'
    });
};
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet Define'
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet Define'
    });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet Define'
    });
};