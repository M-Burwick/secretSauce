// app/routes.js

// var passport = require('passport');
// var LocalStrategy = require('passport-jwt').Strategy
var User = require('./models/user');
var Vehicle = require('./models/vehicle');

var jwt = require('jwt-simple');
var passport = require('passport');
var config = require('./config/main');
var random = require("random-js")(); // uses the nativeMath engine



module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    //Simulates credit check
    app.get('/creditCheck', function(req,res){
        var token = getToken(req.headers);
        var decoded = jwt.decode(token, config.secret);
        var value = random.integer(500, 800);
        var aprvAmt = random.integer(15000, 55000);
      function algo(credScore){
        if(credScore > 700){
             User.findById(decoded._id, function(err, user){
                user.approval = true;
                user.approvalAmount = aprvAmt;
                user.creditScore = credScore;
                user.save();
                res.json({msg: 'user approved', data: user.approvalAmount, credScore})

             })

        } else if(credScore > 550){
            User.findById(decoded._id, function(err, user){
                user.unapproval = true;
                user.creditScore = credScore;
                user.save();
                res.json({msg: 'user not approved'})

             })

        } else {
            User.findById(decoded._id, function(err, user){
                user.unapproval = true;
                user.creditScore = credScore;
                user.save()
                res.json({msg: 'user not approved'})
             })
        }

        };

        algo(value);



    })
    //login for buyers
    app.post('/login', function(req, res){
        console.log(req.headers);
      User.findOne({
         email: req.body.email
         }, function(err, user) {
          if (err) throw err;

        if (!user) {
          res.send({success: false, msg: 'Authentication failed. User not found.'});
         } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
        var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.send({success: true, token: 'JWT ' + token, data: user});

        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
               }
            });
        }
        });
    })
    //login for sellers
    app.post('/carLogin', function(req, res){
      Vehicle.findOne({
         email: req.body.email
         }, function(err, vehicle) {
          if (err) throw err;

        if (!vehicle) {
          res.send({success: false, msg: 'Authentication failed. vehicle not found.'});
         } else {
        // check if password matches
        vehicle.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if vehicle is found and password is right create a token
        var token = jwt.encode(vehicle, config.secret);
          // return the information including token as JSON
          res.send({success: true, token: 'JWT ' + token, data: vehicle});

        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
               }
            });
        }
        });
    })
    //route to get all vehicles
    app.get('/vehicles', function(req, res){
        Vehicle.find({}, function(err, vehicles){
            res.json(vehicles);
        })
    })

//route to add a buyer to a vehicle when purchased
//working to add the vehicle document to the buyer so query can
//will just be to profile instead of the db to see which
//vehicle has the current user's id in its buyers subdoc
  app.put('/vehicles/:vehicle_id', function (req, res){
  var token = getToken(req.headers);
  var decoded = jwt.decode(token, config.secret);
  Vehicle.findById(req.params.vehicle_id, function(err, vehicle){
    console.log(decoded)

      if(err){
        res.send(err);
      } else {
        vehicle.buyer.push(decoded);
        vehicle.save();
        console.log(vehicle);
        res.json(vehicle);
    }   
    //push 
    User.findById(decoded._id, function(err, user){
            user.car.push(vehicle);
            user.save();
        })
  })
})
  //signup a new User who is a buyer ill probably rename next commit
    app.post('/signup', function(req, res) {
        if (!req.body.email || !req.body.password) {
         res.json({success: false, msg: 'Please pass name and password.'});
        } else {
        var newUser = new User({
        email: req.body.email,
        password: req.body.password
        });
        // save the user
        newUser.save(function(err) {
        if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successful created new user.', data: newUser});
        });
    }
});
    //create new vehicle post and user associated with car
  app.post('/signupCar', function(req, res) {
        if (!req.body.make || !req.body.model) {
         res.json({success: false, msg: 'Please pass name and password.'});
        } else {
        var newVehicle = new Vehicle({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        email: req.body.email,
        password: req.body.password
        });
        // save the user
        newVehicle.save(function(err) {
        if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successful created new vehicle.', data: newVehicle});
        });
    }
  });

//get profile of the buyer
//will include vehicle once other route is resolved
//in one fetch instead of additional
app.get('/profile', function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      email: decoded.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});
//get vehicle profile for sellers they login and
//see vehicle data upon auth
app.get('/vehicleProfile', function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    Vehicle.findOne({
      email: decoded.email
    }, function(err, vehicle) {
        if (err) throw err;

        if (!vehicle) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + vehicle + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});


    //need a logout to remove auth.headers
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};


getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
