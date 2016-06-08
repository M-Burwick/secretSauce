var mongoose = require('mongoose');
var Vehicle = require('./vehicle');
var inquirySchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },

    make: {
        type: String
    },

    phone: {
        type: Number
    },

    model: {
         type: String
    },

    style: {
        type: String
    },

    year: {
        type: Number
    },

    price: {
        type: Number
    },

    vehicleId: {
         type: String
    },



})


module.exports = mongoose.model('Inquiry', inquirySchema);
