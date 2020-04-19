const mongoose = require('mongoose');
const Tour=require('./tourModel');
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
reviewSchema.statics.calculateAvgRating=async function(tourId){
    console.log(tourId);
    const stats=await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ]);
    console.log(stats);
    await Tour.findByIdAndUpdate(tourId,{
        ratingsQuantity:stats[0].nRating,
        ratingsAverage:stats[0].avgRating
    })
}

reviewSchema.post('save',function(){
    this.constructor.calculateAvgRating(this.tour)
})
reviewSchema.pre(/^find/,function(next){
    // this.populate({
    //     path:'tour',
    //     select:'name'
    // }).populate({
    //     path:'user',
    //     select:'name photo'
    // })
    this.populate({
        path:'user',
        select:'name photo'
    })
    next();
})


const Review=mongoose.model('Reivew',reviewSchema);
module.exports=Review;