var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Vehicle = require('./vehicle');
// define the schema for our user model
var buyerSchema = mongoose.Schema({
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
    loan: [],
    approval: {
        type: Boolean,
        default: false
    },
    approvalAmount: {
        type: Number,
    },
    creditScore: {
        type: Number,
    },
    car: [{
        type: mongoose.Schema.Types.Mixed,
        ref: 'Vehicle'
    }]
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Buyer', buyerSchema);
