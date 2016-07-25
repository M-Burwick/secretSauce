var Buyer = require('./models/buyer'),
    Vehicle = require('./models/vehicle'),
    Inquiry = require('./models/inquiry'),
    stripe = require("stripe")("sk_test_C0z4bZowWOpnePAoj52sMJBZ"),
    jwt = require('jwt-simple'),
    passport = require('passport'),
    config = require('./config/main'),
    xml2js = require('xml2js'),
    builder = require('xmlbuilder'),
    fs = require('fs'),
    requestsource = require('./config/sourceofrequest'),
    cors = require('cors'),
    needle = require('needle'),
    random = require("random-js")(),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'jarred.stiger@gmail.com',
        pass: 'deeznutzlilfoot'
    }
}))




module.exports = function(app, passport) {

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }



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
            successRedirect: 'https://www.redrive.co/#/signupVehicle',
            failureRedirect: '/'
        })
    );

    app.post('https://qaaffiliates.lendingtree.com/v1/QFPostAuto.aspx',function(req, res, next){
        console.log(res);
        next();
    })

    app.post('/xml', function(req, res){
                   var xml = builder.create({
                      LendingTreeAffiliateRequestAuto: {
                        Request: {
                          '@created': '2016-07-15 03:32:12', // attributes start with @ 
                          '@updated': '2016-07-15 03:32:12',
                          '@AppID': '9CA2B044-AF93-4A43-BBD4-7A20A97E6DEB',
                          SourceOfRequest: {
                            LendingTreeAffiliatePartnerCode: {
                              '#text':'26615'
                            },

                            LendingTreeAffiliateUserName: {
                              '#text':'CARISTAUSER'
                            },

                            LendingTreeAffiliatePassword: {
                              '#text':'BESTGRAPE87'
                            },

                            LendingTreeAffiliateEsourceID: {
                              '#text':'6217796'
                            },

                            VisitorIPAddress: {
                              '#text':'192.168.0.4'
                            },

                            VisitorURL: {
                              '#text': 'http://www.drivecarista.com'
                            }
 
                          },
                          AutoLoanProduct: {
                            Purchase:{
                                RequestedLoanAmount: {
                                    '#text': '30000'
                                },
                                RequestedLoanPeriod: {
                                    '#text': '33'
                                },
                                DownPayment: {
                                     '#text': '5000'
                                },
                                SubjectVehicle: {
                                    Class: {
                                     '#text': 'USED'
                                    },
                                    Year: {
                                     '#text': '2010'
                                    },
                                    Make: {
                                     '#text': 'Honda' 
                                    },
                                    Model: {
                                     '#text': 'Accord'
                                    },
                                    Trim: {
                                     '#text': 'EX'
                                    },
                                    State: {
                                     '#text': 'AR'
                                    },
                                    Mileage:{
                                    '#text': '50000'
                                    },
                                    IdentificationNumber:{
                                    '#text': '1234567890abcdefg'
                                    },
                                    WholesalePrice: {
                                    '#text': '20000.00'    
                                    },
                                    VehiclePurchaseSource: {
                                    '#text': 'DEALER'
                                    }
                                }
                            }
                          },

                          Applicant:{
                            FirstName: {
                                '#text': 'Mandy'
                            },
                            LastName: {
                                '#text': 'Foe'
                            },
                            Street: {
                                '#text': '3267 Test Dr'
                            },
                            City: {
                                '#text': 'Charlotte'
                            },
                            State: {
                                '#text': 'NC'
                            },
                            Zip: {
                                '#text': '28277'
                            },
                            DateOfBirth: {
                                '#text': '09/02/1975'
                            },
                            HomePhone: {
                                '#text': '1112223333'
                            },
                            EmailAddress: {
                                '#text': 'cindy@test.com'
                            },
                            Password: {
                                '#text': 'cindy'
                            },
                            SSN: {
                                '#text': '123-45-6789'
                            },
                            CreditHistory: {
                                BankruptcyDischarged:{
                                    '#text': 'NEVER'
                                } 
                            },
                            Finance: {
                                MonthlyEmploymentIncome:{
                                    '#text': '8333'
                                },
                                TotalAssetValue: {
                                    '#text': '222222'
                                } 
                            },
                            Employment: {
                                EmployerName:{
                                    '#text': 'Lendingtree.com'
                                },
                                EmployeeTitle: {
                                    '#text': 'Title'
                                }, 
                                EmploymentYears: {
                                    '#text': '0'
                                },
                                EmploymentMonths: {
                                    '#text': '9'
                                },
                                EmploymentStatus: {
                                    '#text': 'FULLTIME'
                                },
                            },
                            EmailOptIn: {
                                '#text': 'N'
                            },
                            Housing: {
                                OwnOrRent:{
                                    '#text': 'OWN'
                                },
                                TimeAtCurrentResidenceYears: {
                                    '#text': '5'
                                }, 
                                TimeAtCurrentResidenceMonths: {
                                    '#text': '6'
                                },
                                MonthlyPayment: {
                                    '#text': '1000'
                                }
                            }

                          }
                        }
                      }
         })
        .end({ pretty: true});
        console.log(xml);
        res.send({
            success:true,
            data:xml
        })
    })

        // app.get('/creditCheck', function(req, res) {
        //     function getRandomArbitrary(min, max) {
        //         return (Math.floor(Math.random() * (max - min) + min));
        //     }

        //     var one = {
        //             months: 48,
        //             apr: (Math.random() * (13.74 - 5.76) + 5.76),
        //             payment: 400,
        //             approval: (getRandomArbitrary(25000, 45000))
        //         },

        //         two = {
        //             months: 36,
        //             apr: (Math.random() * (15.74 - 7.76) + 7.76),
        //             payment: 500,
        //             approval: (getRandomArbitrary(18000, 38000))
        //         },

        //         three = {
        //             months: 60,
        //             apr: (Math.random() * (9.74 - 4.76) + 4.76),
        //             payment: 300,
        //             approval: (getRandomArbitrary(25000, 55000))
        //         },

        //         firstTier = [one, two, three],

        //         four = {
        //             months: 48,
        //             apr: (Math.random() * (18.74 - 12.76) + 12.76),
        //             payment: 500,
        //             approval: (getRandomArbitrary(15000, 35000))
        //         },

        //         five = {
        //             months: 36,
        //             apr: (Math.random() * (19.74 - 11.76) + 11.76),
        //             payment: 600,
        //             approval: (getRandomArbitrary(18000, 38000))
        //         },

        //         six = {
        //             months: 60,
        //             apr: (Math.random() * (15.74 - 8.76) + 8.76),
        //             payment: 450,
        //             approval: (getRandomArbitrary(25000, 55000))
        //         },

        //         secondTier = [four, five, six],

        //         seven = {
        //             months: 48,
        //             apr: (Math.random() * (22.74 - 12.76) + 12.76),
        //             payment: 550,
        //             approval: (getRandomArbitrary(15000, 22000))
        //         },

        //         eight = {
        //             months: 36,
        //             apr: (Math.random() * (24.74 - 11.76) + 11.76),
        //             payment: 690,
        //             approval: (getRandomArbitrary(18000, 28000))
        //         },

        //         nine = {
        //             months: 60,
        //             apr: (Math.random() * (20.74 - 14.76) + 8.76),
        //             payment: 500,
        //             approval: (getRandomArbitrary(19000, 25000))
        //         },

        //         thirdTier = [seven, eight, nine];

        //     function underWriting(credScore) {
        //         var options = {}
        //         if (credScore > 750) {
        //             options.loans = firstTier;
        //             options.creditScore = credScore
        //             res.json(options);
        //         } else if (credScore > 700) {
        //             options.loans = secondTier;
        //             options.creditScore = credScore
        //             res.json(options);
        //         } else if (credScore > 600) {
        //             options.loans = thirdTier;
        //             options.creditScore = credScore
        //             res.json(options);
        //         } else {
        //             res.json("no approval");
        //         }
        //     }
        //     underWriting(getRandomArbitrary(550, 850));
        // });
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

    app.post('/payment', function(req, res){
        var stripeToken = req.body.token;
        var charge = stripe.charges.create({
            amount: 19999, // amount in cents, again
            currency: "usd",
            source: stripeToken,
            description: "Example charge"
            }, function(err, charge) {
            if (err && err.type === 'StripeCardError') {
                console.log(err);// The card has been declined
            } else {
                res.send({
                    success:true,
                    data: charge
                });
            }
        })

    })

    app.get('/vehicles', function(req, res) {
        console.log(req.user);
        Vehicle.find({}, function(err, vehicles) {
            if(err){
                res.json(err)
            }
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

    

    app.get('/sellerIslogged', function(req, res){
        var token = req.user;
        if (token) {
            Vehicle.findOne({
                email: token.email
            }, function(err, vehicle) {
                if (err) throw err;
                if (!vehicle) {
                    return res.status(403).send({
                        success: false,
                        msg: 'Authentication failed. vehicle not found.'
                    });
                } else {
                    res.json({
                        success: true,
                        msg: 'Welcome in the member area ',
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
        
        var token = req.user;

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
