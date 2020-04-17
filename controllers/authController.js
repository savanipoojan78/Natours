const User=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError')
const {promisify}=require('util')
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

exports.protect=catchAsync(async(req,res,next)=>{
    let token;
    //1 check that in req header token exist
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    }
    if(!token){
        next(new AppError('You are not logged in , please login',401))
    }
    //2 verify that token is correct
    const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRECT)

    //3 check if User Exist
    const currentUser=await User.findById(decoded.id);
    if(!currentUser){
        next(new AppError('the User beloging to this User No Longer Exist',401))
    }

    //4 check if token given before password is expire
    if(currentUser.isPasswordChanged(decoded.iat))
    {
        next(new AppError('Password is changed please Login Again',401))
    }
    req.user=currentUser;
    next();
});

exports.restrict=(...roles)=>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.roles)){
            return next(new AppError('You are not Authorized to perform this action',403))
        }
        next()
    }
};

exports.forgetPassword= catchAsync(async(req,res,next)=>{
    //check if user exist 
    const user=await User.findOne({email:req.body.email});
    if(!user){
        next(new AppError('There is no User With this email address'),404);
    }
    //2 generate a random reset token
    const resetToken=user.createPasswordResetToken();
    await user.save({validateBeforeSave:false})
})

exports.resetPassword=catchAsync(async(req,res,next)=>{
    res.status(400).json({
        status:'this router in not define'
    })
})