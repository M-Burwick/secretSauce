var mongoose = require('mongoose');
var Buyer = require('./buyer');
// define the schema for our user model
var vehicleSchema = mongoose.Schema({
    make: {
        type: String,
    },
    model: {
        type: String,
    },
    year: {
        type: Number,
    },
    pic: {
        type: String
    },
    condition: {
        type: String
    },
    style: {
        type:String
    },
    pics: [],
    tmv: {
        type: Number
    },
    phone: {
        type: String,
    },
    mileage: {
        type: Number
    },
    zip: {
        type:Number
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    buyer: [{
        type: mongoose.Schema.Types.Mixed,
        ref: 'Buyer'
    }]
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
