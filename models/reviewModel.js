const mongoose = require('mongoose');

const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review Cannot be Empty']
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'A Review Must be belonging to a Tour']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Review Must Belong to a User ']
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

const Review=mongoose.model('Reivew',reviewSchema);
module.exports=Review;