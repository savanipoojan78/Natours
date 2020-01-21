const mongoose = require('mongoose');

// SCHEMA
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour Must Have A Name'], //Validation
        unique: true,
        trim: true
    },
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
    startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;