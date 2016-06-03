// app/routes.js

// var LocalStrategy = require('passport-jwt').Strategy
var Buyer = require('./models/buyer');
var Vehicle = require('./models/vehicle');

var jwt = require('jwt-simple');
var passport = require('passport');
var config = require('./config/main');
var random = require("random-js")(); // uses the nativeMath engine




module.exports = function(app, passport) {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#/profile',
            failureRedirect: '/'
        }));

    // route for facebook authentication and login
    // different scopes while logging in
    app.get('/login/facebook',
        passport.authenticate('facebook', {
            scope: 'email'
        }));

    // handle the callback after facebook has authenticated the user
    app.get('/login/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#/profile',
            failureRedirect: '/'
        })

    );


    //Simulates credit check
    app.get('/creditCheck', function(req, res) {
        function getRandomArbitrary(min, max) {
            return (Math.floor(Math.random() * (max - min) + min));
        }

        var one = {
            months: 48,
            apr: (Math.random() * (13.74 - 5.76) + 5.76),
            payment: 400,
            approval: (getRandomArbitrary(25000, 45000))
        };

        var two = {
            months: 36,
            apr: (Math.random() * (15.74 - 7.76) + 7.76),
            payment: 500,
            approval: (getRandomArbitrary(18000, 38000))
        };


        var three = {
            months: 60,
            apr: (Math.random() * (9.74 - 4.76) + 4.76),
            payment: 300,
            approval: (getRandomArbitrary(25000, 55000))
        };

        var firstTier = [one, two, three];


        var four = {
            months: 48,
            apr: (Math.random() * (18.74 - 12.76) + 12.76),
            payment: 500,
            approval: (getRandomArbitrary(15000, 35000))
        };

        var five = {
            months: 36,
            apr: (Math.random() * (19.74 - 11.76) + 11.76),
            payment: 600,
            approval: (getRandomArbitrary(18000, 38000))
        };


        var six = {
            months: 60,
            apr: (Math.random() * (15.74 - 8.76) + 8.76),
            payment: 450,
            approval: (getRandomArbitrary(25000, 55000))
        };

        var secondTier = [four, five, six];

        var seven = {
            months: 48,
            apr: (Math.random() * (22.74 - 12.76) + 12.76),
            payment: 550,
            approval: (getRandomArbitrary(15000, 22000))
        };

        var eight = {
            months: 36,
            apr: (Math.random() * (24.74 - 11.76) + 11.76),
            payment: 690,
            approval: (getRandomArbitrary(18000, 28000))
        };

        var nine = {
            months: 60,
            apr: (Math.random() * (20.74 - 14.76) + 8.76),
            payment: 500,
            approval: (getRandomArbitrary(19000, 25000))
        };

        var thirdTier = [seven, eight, nine];

        function underWriting(credScore) {
          var options = {}
            if (credScore > 750) {

  options.loans = firstTier;
  options.creditScore = credScore
                res.json(options);

            } else if (credScore > 700) {
              options.loans = secondTier;
              options.creditScore = credScore
                            res.json(options);
            } else if (credScore > 600) {
              options.loans = thirdTier;
              options.creditScore = credScore
                            res.json(options);
            } else {
                res.json("no approval");
            }


        }

        underWriting(getRandomArbitrary(550, 850));

    });

    //login for buyers
    app.post('/login', function(req, res) {
            Buyer.findOne({
                email: req.body.email
            }, function(err, buyer) {
                if (err) throw err;

                if (!buyer) {
                    res.send({
                        success: false,
                        msg: 'Authentication failed. buyer not found.'
                    });
                } else {
                    // check if password matches
                    buyer.comparePassword(req.body.password, function(err, isMatch) {
                        if (isMatch && !err) {
                            // if Buyer is found and password is right create a token
                            var token = jwt.encode(buyer, config.secret);
                            // return the information including token as JSON
                            res.send({
                                success: true,
                                token: 'JWT ' + token,
                                data: buyer
                            });

                        } else {
                            res.send({
                                success: false,
                                msg: 'Authentication failed. Wrong password.'
                            });
                        }
                    });
                }
            });
        })
        //login for sellers
    app.post('/loginVehicle', function(req, res) {
        Vehicle.findOne({
            email: req.body.email
        }, function(err, vehicle) {
            if (err) throw err;

            if (!vehicle) {
                res.send({
                    success: false,
                    msg: 'Authentication failed. vehicle not found.'
                });
            } else {
                res.send({
                    success: true,
                    data: vehicle
                });
            }
        });
    });

    //route to get all vehicles
    app.get('/vehicles', function(req, res) {
            console.log(req.user);
            Vehicle.find({}, function(err, vehicles) {
                res.json(vehicles);
            })
        })
        //get vehicle a buyer is interested
    app.get('/vehicles/:vehicle_id', function(req, res) {
        Vehicle.find({
            id: req.params.vehicle_id
        }, function(err, vehicle) {
            console.log(vehicle);
            res.json(vehicle);
        })
    })

    //route to add a buyer to a vehicle when purchased
    //working to add the vehicle document to the buyer so query can
    //will just be to profile instead of the db to see which
    //vehicle has the current Buyer's id in its buyers subdoc
    app.put('/vehicles/:vehicle_id', function(req, res) {
        Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {

            if (err) {
                res.send(err);
            } else {
                //i want this to only happen if there is no current buyer
                //also if there is no decoded then redirect to an
                //request for authorization page...
                vehicle.buyer.push(req.user);
                vehicle.save();
                console.log(vehicle);
                res.json(vehicle);
            }
            Buyer.findById(req.user._id, function(err, buyer) {
                buyer.car.push(vehicle);
                console.log(buyer)
                buyer.save();
            })
        })
    })


    //signup a new Buyer who is a buyer ill probably rename next commit
    app.post('/signup', function(req, res) {
        if (!req.body.email || !req.body.password) {
            res.json({
                success: false,
                msg: 'Please pass name and password.'
            });
        } else {
            var newBuyer = new Buyer({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name
            });
            // save the Buyer
            newBuyer.save(function(err) {
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Buyername already exists.'
                    });
                }
                res.json({
                    success: true,
                    msg: 'Successful created new Buyer.',
                    data: newBuyer
                });
            });
        }
    });
    //create new vehicle post and Buyer associated with car
    app.post('/signupVehicle', function(req, res) {

        if (!req.body.make || !req.body.model) {
            res.json({
                success: false,
                msg: 'Please pass name and password.'
            });
        } else {

            var newVehicle = new Vehicle({
                make: req.body.make,
                model: req.body.model,
                year: req.body.year,
                email: req.body.email,
                phone: req.body.phone,
                style: req.body.stlye,
                zip: req.body.zip,
                mileage: req.body.mileage,
                condition: req.body.condition,
                tmv: req.body.tmv,
                pics: req.body.pics
            });
            newVehicle.save(function(err) {
                console.log(err);
                if (err) {
                    return res.json({
                        success: false,
                        msg: 'Buyername already exists.'
                    });
                }
                res.json({
                    success: true,
                    msg: 'Successful created new vehicle.',
                    data: newVehicle
                });
                console.log(newVehicle);
            })

        }
    });

    app.get('/profile', function(req, res) {
        var token = req.user;
        if (token) {
            Buyer.findOne({
                email: token.email
            }, function(err, buyer) {
                if (err) throw err;
                if (!buyer) {
                    return res.status(403).send({
                        success: false,
                        msg: 'Authentication failed. Buyer not found.'
                    });
                } else {
                    res.json({
                        success: true,
                        msg: 'Welcome in the member area ',
                        data: buyer
                    });
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                msg: 'No token provided.'
            });
        }
    });
    //get vehicle profile for sellers they login and
    //see vehicle data upon auth
    app.get('/sellerProfile', function(req, res) {
        var token = {
            email: "brick@gmail.com"
        };
        if (token) {
            Vehicle.findOne({
                email: token.email
            }, function(err, vehicle) {
                if (err)
                    res.send(err);
                if (!vehicle) {
                    return res.status(403).send({
                        success: false,
                        msg: 'Authentication failed. Buyer not found.'
                    });
                } else {
                    res.json({
                        success: true,
                        data: vehicle
                    });
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                msg: 'No token provided.'
            });
        }

    });


    //need a logout to remove auth.headers
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};


getToken = function(headers) {
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
