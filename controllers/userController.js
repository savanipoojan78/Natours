const User=require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const multer=require('multer');
const AppError=require('./../utils/appError')
const factory=require('./handlerFactory');


const filterObj=(obj, ...filters)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
        if(filters.includes(el)) newObj[el]=obj[el]
    })
    return newObj;
}
const multerStorage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/img/users')
    },
    filename:function(req,file,cb){
        const ext=file.mimetype.split('/')[1];
        cb(null,`user-${req.user._id}-${Date.now()}.${ext}`)
    }
})
const filter=(req,file,cb)=>{
    console.log(file);
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else
    cb(new AppError('Upload image only',400),false)
}
const upload=multer({
    storage:multerStorage,
    fileFilter:filter,
    limits:{
        fileSize:5
    }
});
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
        status:'success',
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
exports.uploadPhoto= (req,res,next)=>{
    var uploadPic=upload.single('photo');
    uploadPic(req, res, function (err) {
        if(err){
            if(err.isOperational){
                next(new AppError(err.errorMessage,err.status));
            }
            else{
                console.log(JSON.stringify(err,null,4));
                next(new AppError(err.message,400)); 
            }
        }
    })
    next();
}