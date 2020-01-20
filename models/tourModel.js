const mongoose = require('mongoose');

// SCHEMA
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour Must Have A Name'], //Validation
        unique: true
    },
    price: {
        required: [true, 'A tour must have a price'],
        type: Number
    },
    rating: {
        default: 4.5,
        type: Number
    }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;