const {promisify}=require('util')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')
const User=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError')
const sendEmail=require('./../utils/email')

const signInToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRECT,{
        expiresIn:process.env.JWT_EXPIRE_IN
    })
}

const createAndSendToken=(user,statusCode,res)=>{
    const token=signInToken(user._id)
    const options={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE_TIME*24*60*60*1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV==='production'){
        options.secure=false;
    }
    res.cookie('jwt',token,options)
    user.password=undefined;
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user:user
        }
    })
}
exports.signup=catchAsync(async (req,res)=>{
    const newUser=await User.create(req.body);
    createAndSendToken(newUser,200,res)
});
exports.login= catchAsync(async(req,res,next)=>{
    const {email,password}=req.body
    if(!email || !password){
        return next(new AppError('Please Provide email and password',400))
    }
    const user=await User.findOne({email}).select('+password').select('+active');
     if(!user || !await user.correctPassword(password,user.password)){
         return next(new AppError("Please entered correct email & password",401));
     }
     createAndSendToken(user,200,res)
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
        next(new AppError('the User beloging to this token No Longer Exist',401))
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

    const resetLink=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message=`Forget your password submit a request eith new Password and Confirm Password to :${resetLink}.\n
    if you did't forget your password forget this mail`;

    try{
        await sendEmail({
            email:user.email,
            subject:'Reset Password This Link valid for Only 10 Min',
            message:message
        });
    
        res.status(200).json({
            status:'success',
            message:'mail send Sucessfully'
        })
    }catch(err){
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpire=undefined;
        await user.save({validateBeforeSave:false})
        next(new AppError('failed to send the Email',500));
    }
    


})

exports.resetPassword=catchAsync(async(req,res,next)=>{
    const encryptPasswordResetToken=crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user=await User.findOne( {passwordResetToken:encryptPasswordResetToken,
        passwordResetTokenExpire:{$gt:Date.now()}}
    )
    console.log(user)
    if(!user){
        return next(new AppError('Forget Password link has Expired'),400)
    }
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpire=undefined;
    await user.save();
    createAndSendToken(user,200,res)
});

exports.updatePassword=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password');
     if(!user || !await user.correctPassword(req.body.passwordCurrent,user.password)){
         return next(new AppError("Please entered correct password",401));
     }
     user.password=req.body.password;
     user.passwordConfirm=req.body.passwordConfirm;
     await user.save()
     createAndSendToken(user,200,res)
});