const mongoose = require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

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
    passwordChanged:Date
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) next();

    this.password= await bcrypt.hash(this.password,12);
    this.passwordConfirm= undefined;
    next();

})

userSchema.methods.isPasswordChanged=function(JWtTokenTime){
    console.log("fhrufh")
    if(this.passwordChanged){
        const passChangesTime=parseInt(this.passwordChanged.getTime()/1000,10);
        return JWtTokenTime < passChangesTime;
    }
    return false;
}
userSchema.methods.correctPassword =async function(candidatePassword,password){
    return await bcrypt.compare(candidatePassword,password)
}
const User=mongoose.model('User',userSchema);
module.exports=User;