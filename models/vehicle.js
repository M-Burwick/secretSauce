var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var User = require('./user')

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
        required: true
    },

    pic: {
        type: String
    },

    email: {
        type: String,
        unique: true,
        required: true

    },
    password: {
        type: String,
        unique: true,
        required: true

    },

    buyer: [{
        type: mongoose.Schema.Types.Mixed,
        ref: 'User'
    }]

});

// methods ======================
// generating a hash
vehicleSchema.pre('save', function(next) {
    var vehicle = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(vehicle.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                vehicle.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

vehicleSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Vehicle', vehicleSchema);
