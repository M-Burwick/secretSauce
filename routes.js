var Buyer = require('./models/buyer'),
    Vehicle = require('./models/vehicle'),
    Inquiry = require('./models/inquiry'),

    jwt = require('jwt-simple'),
    passport = require('passport'),
    config = require('./config/main'),
    random = require("random-js")(),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport')
    transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'jarred.stiger@gmail.com',
        pass: 'deeznutzlilfoot'
    }
}))




module.exports = function(app, passport) {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['email']
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#/signupVehicle',
            failureRedirect: '/'
        }));

    app.get('/login/facebook',
        passport.authenticate('facebook', {
            scope: 'email'
        }));

    app.get('/login/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#/signupVehicle',
            failureRedirect: '/'
        })

    );

    app.get('/creditCheck', function(req, res) {
        function getRandomArbitrary(min, max) {
            return (Math.floor(Math.random() * (max - min) + min));
        }

        var one = {
                months: 48,
                apr: (Math.random() * (13.74 - 5.76) + 5.76),
                payment: 400,
                approval: (getRandomArbitrary(25000, 45000))
            },

            two = {
                months: 36,
                apr: (Math.random() * (15.74 - 7.76) + 7.76),
                payment: 500,
                approval: (getRandomArbitrary(18000, 38000))
            },

            three = {
                months: 60,
                apr: (Math.random() * (9.74 - 4.76) + 4.76),
                payment: 300,
                approval: (getRandomArbitrary(25000, 55000))
            },

            firstTier = [one, two, three],

            four = {
                months: 48,
                apr: (Math.random() * (18.74 - 12.76) + 12.76),
                payment: 500,
                approval: (getRandomArbitrary(15000, 35000))
            },

            five = {
                months: 36,
                apr: (Math.random() * (19.74 - 11.76) + 11.76),
                payment: 600,
                approval: (getRandomArbitrary(18000, 38000))
            },

            six = {
                months: 60,
                apr: (Math.random() * (15.74 - 8.76) + 8.76),
                payment: 450,
                approval: (getRandomArbitrary(25000, 55000))
            },

            secondTier = [four, five, six],

            seven = {
                months: 48,
                apr: (Math.random() * (22.74 - 12.76) + 12.76),
                payment: 550,
                approval: (getRandomArbitrary(15000, 22000))
            },

            eight = {
                months: 36,
                apr: (Math.random() * (24.74 - 11.76) + 11.76),
                payment: 690,
                approval: (getRandomArbitrary(18000, 28000))
            },

            nine = {
                months: 60,
                apr: (Math.random() * (20.74 - 14.76) + 8.76),
                payment: 500,
                approval: (getRandomArbitrary(19000, 25000))
            },

            thirdTier = [seven, eight, nine];

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
    app.post('/pickedLoan', function(req, res) {
        Buyer.findOne({
            email: req.user.email
        }, function(err, buyer) {
            if (err) throw err;
            if (!buyer) {
                res.send({
                    success: false,
                    msg: 'Authentication failed. buyer not found.'
                });
            } else {
                console.log(req.body)
                buyer.loan = req.body
                buyer.save();
            }
        });
    });

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

    app.get('/vehicles', function(req, res) {
        console.log(req.user);
        Vehicle.find({}, function(err, vehicles) {
            res.json(vehicles);
        })
    })

    app.get('/vehicles/:vehicle_id', function(req, res) {
        Vehicle.findById(req.params.vehicle_id, function(err, vehicle){
            console.log(vehicle);
            vehicle.views++;
            vehicle.save();
            res.json(vehicle);
        })
    })

    app.put('/vehicles/:vehicle_id', function(req, res) {
        Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
            if (err) {
                res.send(err);
            } else {
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

    app.post('/inquiry', function(req, res){
        if (!req.body.make || !req.body.model) {
            res.json({
                success: false,
                msg: 'Please pass name and password.'
            });
        } else {
            var newInquiry = new Inquiry({
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                make: req.body.make,
                model: req.body.model,
                style: req.body.style,
                price: req.body.price,
                vehicleId: req.body.vehicleid,
                year: req.body.year
            });

            newInquiry.save(function(err){
                if (err) {
                    console.log(err);
                    return res.json({
                        success: false,
                        msg: 'Buyername already exists.'
                    });
                }
                res.json({
                    success: true,
                    msg: 'Successful created new inquiry.',
                    data: newInquiry
                });
            })
            console.log(newInquiry);

        }
    })

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
                style: req.body.style,
                styleId: req.body.styleId,
                zip: req.body.zip,
                views: 0,
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

app.post('/contact', function(req, res){
    var data = req.body;
    console.log(data);

    transporter.sendMail({
    from: data.email,
    to: 'jarred.stiger@gmail.com',
    subject: data.firstName + data.lastName,
    text: data.message
    }, function(error, response) {
   if (error) {
        console.log(error);
   } else {
        console.log('Message sent');
    }
})
})

    

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};
