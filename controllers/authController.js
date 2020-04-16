const User=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const jwt=require('jsonwebtoken')

exports.signup=catchAsync(async (req,res)=>{
    const newUser=await User.create(req.body);
    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRECT,{
        expiresIn:process.env.JWT_EXPIRE_IN
    })
    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
    })
});