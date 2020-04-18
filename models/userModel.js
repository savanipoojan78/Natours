const mongoose = require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Tell us your name'],
    },
    email:{
        type:String,
        required:[true,'Please provide your Email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide correct EmailId']
    },
    photo:{
        type:String,
    },
    roles:{
        type:String,
        enum:['admin','user','guide','lead-guide'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please Provide password'],
        minlength:[8,'length of password must br greater than 8'],
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password'],
        validate:{
            validator:function(el){
                return el===this.password
            },
            message:'Password are not same'
        }
    },
    passwordChanged:Date,
    passwordResetToken:String,
    passwordResetTokenExpire:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) next();

    this.password= await bcrypt.hash(this.password,12);
    this.passwordConfirm= undefined;
    next();

})
userSchema.pre('save',function(next){
    if(this.isModified('password') || this.isNew){
        next();
    } 
    this.passwordChanged=Date.now()-1000;
    next();
})
userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}})
    next();
})
userSchema.methods.isPasswordChanged=function(JWtTokenTime){
    if(this.passwordChanged){
        const passChangesTime=parseInt(this.passwordChanged.getTime()/1000,10);
        return JWtTokenTime < passChangesTime;
    }
    return false;
}
userSchema.methods.correctPassword =async function(candidatePassword,password){
    return await bcrypt.compare(candidatePassword,password)
}
userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpire=Date.now()+10*60*1000;//10 min password expire 
    return resetToken;
}
const User=mongoose.model('User',userSchema);
module.exports=User;