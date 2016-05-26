var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Vehicle = require('./vehicle');
// define the schema for our user model
var buyerSchema = mongoose.Schema({
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
    approval: {
        type: Boolean,
        default: false
    },
    unapproval: {
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

// methods ======================
// generating a hash
buyerSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

buyerSchema.methods.comparePassword = function(passw, cb) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Buyer', buyerSchema);
