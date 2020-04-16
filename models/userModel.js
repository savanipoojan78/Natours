const mongoose = require('mongoose');
const validator=require('validator');

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
        minlength:[8,'length of password must br greater than 8']
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password']
    }
})
const User=mongoose.model('User',userSchema);
module.exports=User;