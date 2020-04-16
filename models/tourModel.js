const mongoose = require('mongoose');
const slugify = require('slugify');

// SCHEMA
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour Must Have A Name'], //Validation
        unique: true,
        trim: true
    },
    slug: {type:String},
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'it should have difficulty']
    },
    price: {
        required: [true, 'A tour must have a price'],
        type: Number
    },
    ratingsAverage: {
        default: 4.5,
        type: Number
    },
    ratingsQuantity: {
        default: 0,
        type: Number
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have an description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover photo']
    },
    images: [String],
    createsAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    isPublish : {
        type:Boolean,
        deafult:true,
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

tourSchema.virtual('tourWeekend').get(function(){
    return this.duration/7;
});

// DOC Middalware in mongoose this middlware called before .save() .create methode but in inserMany in didn't call this middlware.
tourSchema.pre('save', function(next){
this.slug = slugify(this.name,{lowercase:true});
next();
});

// tourSchema.post('save',function(doc,next){
//     console.log('post middware');
//     next();
// })

//QUERY Middleware

tourSchema.pre(/^find/,function(next){
    this.find({isPublish:{$ne:false}});
    next();
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;