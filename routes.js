// app/routes.js

// var LocalStrategy = require('passport-jwt').Strategy
var Buyer = require('./models/buyer');
var Vehicle = require('./models/vehicle');

var jwt = require('jwt-simple');
var passport = require('passport');
var config = require('./config/main');
var random = require("random-js")(); // uses the nativeMath engine
// var S3FS = require('s3fs');
// var multiparty= require('connect-multiparty');
// var multipartyMiddleWare = multiparty();
// var s3fsImpl = new S3FS('stigerdevbucket', {
//   accessKeyId:'AKIAIYO3JCQGJGWU4BWQ' ,
//   secretAccessKey: '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'
// });

// //requirements
// s3fsImpl.create();



module.exports = function(app, passport) {

    //Simulates credit check
    app.get('/creditCheck', function(req,res){
        var token = getToken(req.headers);
        var decoded = jwt.decode(token, config.secret);
        var value = random.integer(500, 800);
        var aprvAmt = random.integer(15000, 55000);
      function algo(credScore){
        if(credScore > 700){
             Buyer.findById(decoded._id, function(err, buyer){
                buyer.approval = true;
                buyer.approvalAmount = aprvAmt;
                buyer.creditScore = credScore;
                buyer.save();
                res.json({msg: 'Buyer approved', data: buyer})

             })

        } else if(credScore > 550){
            Buyer.findById(decoded._id, function(err, buyer){
                buyer.unapproval = true;
                buyer.creditScore = credScore;
                buyer.save();
                res.json({msg: 'buyer not approved'})

             })

        } else {
            Buyer.findById(decoded._id, function(err, buyer){
                buyer.unapproval = true;
                buyer.creditScore = credScore;
                buyer.save()
                res.json({msg: 'buyer not approved'})
             })
        }

        };

        algo(value);



    })
    //login for buyers
    app.post('/login', function(req, res){
      console.log(req.headers);
      Buyer.findOne({
         email: req.body.email
         }, function(err, buyer) {
          if (err) throw err;

        if (!buyer) {
          res.send({success: false, msg: 'Authentication failed. buyer not found.'});
         } else {
        // check if password matches
        buyer.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if Buyer is found and password is right create a token
        var token = jwt.encode(buyer, config.secret);
          // return the information including token as JSON
          res.send({success: true, token: 'JWT ' + token, data: buyer});

        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
               }
            });
        }
        });
    })
    //login for sellers
    app.post('/loginVehicle', function(req, res){
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
    //get vehicle a buyer is interested
    app.get('/vehicles/:vehicle_id', function(req, res){
      Vehicle.find({id: req.params.vehicle_id}, function(err, vehicle){
        console.log(vehicle);
        res.json(vehicle);
      })
    })
    //get a seller profile
    app.get('vehicles/:seller_id', function(req, res){
      var token = getToken(req.headers);
      var decoded = jwt.decode(token, config.secret);
      Vehicle.find({id: req.params.decoded_id}, function(err, profile){
        res.json(profile);
      })
    })

//route to add a buyer to a vehicle when purchased
//working to add the vehicle document to the buyer so query can
//will just be to profile instead of the db to see which
//vehicle has the current Buyer's id in its buyers subdoc
  app.put('/vehicles/:vehicle_id', function (req, res){
  var token = getToken(req.headers);
  var decoded = jwt.decode(token, config.secret);
  Vehicle.findById(req.params.vehicle_id, function(err, vehicle){
    console.log(decoded)

      if(err){
        res.send(err);
      } else {
        //i want this to only happen if there is no current buyer
        //also if there is no decoded then redirect to an
        //request for authorization page...
        vehicle.buyer.push(decoded);
        vehicle.save();
        console.log(vehicle);
        res.json(vehicle);
    }
    Buyer.findById(decoded._id, function(err, buyer){
            buyer.car.push(vehicle);
            buyer.save();
        })
  })
})
  //signup a new Buyer who is a buyer ill probably rename next commit
    app.post('/signup', function(req, res) {
        if (!req.body.email || !req.body.password) {
         res.json({success: false, msg: 'Please pass name and password.'});
        } else {
        var newBuyer = new Buyer({
        email: req.body.email,
        password: req.body.password
        });
        // save the Buyer
        newBuyer.save(function(err) {
        if (err) {
        return res.json({success: false, msg: 'Buyername already exists.'});
        }
        res.json({success: true, msg: 'Successful created new Buyer.', data: newBuyer});
        });
    }
});
    //create new vehicle post and Buyer associated with car
  app.post('/signupVehicle', function(req, res) {

        if (!req.body.make || !req.body.model) {
         res.json({success: false, msg: 'Please pass name and password.'});
        } else {

        var newVehicle = new Vehicle({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        email: req.body.email,
        password: req.body.password,
        });
        newVehicle.save(function(err) {
        console.log(err);
        if (err) {
        return res.json({success: false, msg: 'Buyername already exists.'});
        }
        res.json({success: true, msg: 'Successful created new vehicle.', data: newVehicle});
        console.log(newVehicle);
      })

    }
  });

app.get('/profile', function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    Buyer.findOne({
      email: decoded.email
    }, function(err, buyer) {
        if (err) throw err;

        if (!buyer) {
          return res.status(403).send({success: false, msg: 'Authentication failed. Buyer not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ', data: buyer});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});
//get vehicle profile for sellers they login and
//see vehicle data upon auth
app.get('/sellerProfile', function(req, res) {
  var token = getToken(req.headers);
  console.log(token);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    Vehicle.findOne({
      email: decoded.email
    }, function(err, vehicle) {
        if (err)
          res.send(err);
        if (!vehicle) {
          return res.status(403).send({success: false, msg: 'Authentication failed. Buyer not found.'});
        } else {
          res.json({success: true, data: vehicle});
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
