const User=require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
exports.getAllUsers = catchAsync(async(req, res,next) => {
    const user=await User.find().select('-__v')
    
    res.status(201).json({
        status:'success',
        user:{
           user
        }
    })
});

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