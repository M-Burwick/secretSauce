var mongoose = require('mongoose');
// define the schema for our user model
var userSchema = mongoose.Schema({
    _id: {
    type: String,
    unique: true,
    required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    access_token: {
      type: String,
      required: true
    },
    nameFirst: {
        type: String
    },
    nameLast: {
        type: String
    },
    photos: {
        type: String
    },
    username:{
        type: String
    },
    make: {
        type: String,
    },
    model: {
        type: String,
    },
    year: {
        type: Number,
    },
    condition: {
        type: String
    },
    style: {
        type:String
    },
    styleId: {
        type:Number
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
    views: {
        type: Number
    },
    zip: {
        type:Number
    }
});


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
