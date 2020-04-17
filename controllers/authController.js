const User=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError')
const jwt=require('jsonwebtoken')

const signInToken=(id)=>{
    console.log(id)
    return jwt.sign({id},process.env.JWT_SECRECT,{
        expiresIn:process.env.JWT_EXPIRE_IN
    })
}
exports.signup=catchAsync(async (req,res)=>{
    const newUser=await User.create(req.body);
    const token=signInToken(newUser._id)
    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
    })
});
exports.login= catchAsync(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password){
        return next(new AppError('Please Provide email and password',400))
    }
    const user=await User.findOne({email}).select('+password');
     if(!user || !await user.correctPassword(password,user.password)){
         return next(new AppError("Please entered correct email & password",401));
     }
     const token=signInToken(user._id);
     res.status(200).json({
         status:'success',
         token
     })
});