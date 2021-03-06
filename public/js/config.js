var app = angular.module('app', ['ui.router', 'ui.bootstrap', 'angular-stripe', 'ngMaterial', 'ngMessages', 'ngFileUpload', 'ngTouch', 'mgo-angular-wizard'])

app.config(function($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html'
            })

        $stateProvider
            .state('congratulations', {
                url: '/congratulations',
                templateUrl: 'templates/congratulations.html'
            })

        $stateProvider
            .state('lendingtree', {
                url: '/lendingtree',
                controller: 'LendingTreeController',
                templateUrl: 'templates/lendingtree.html'
            })

        $stateProvider
            .state('buyercongratulations', {
                url: '/hooray',
                templateUrl: 'templates/buyercongratulations.html'
            })

        $stateProvider
            .state('inspection', {
                url: '/inspection',
                templateUrl: 'templates/inspection.html'
            })


        $stateProvider
            .state('faq', {
                url: '/faq',
                templateUrl: 'templates/faq.html'
            })


        $stateProvider
            .state('browse', {
                url: '/search',
                controller: 'BrowseController',
                templateUrl: 'templates/browseVehicle.html'
            })
        $stateProvider
            .state('vehicleView', {
                url: '/vehicleView',
                controller: 'VehicleViewController',
                templateUrl: 'templates/vehicleView.html'
            })

        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'templates/login.html'
            })
        $stateProvider
            .state('loginVehicle', {
                url: '/loginVehicle',
                controller: 'LoginVehicleController',
                templateUrl: 'templates/loginVehicle.html'
            })
        $stateProvider
            .state('signup', {
                url: '/signup',
                controller: 'SignupController',
                templateUrl: 'templates/signup.html'
            })
        $stateProvider
            .state('signupVehicle', {
                url: '/signupVehicle',
                controller: 'SignupVehicleController',
                templateUrl: 'templates/form.html',
            })
        $stateProvider
            .state('profile', {
                url: '/profile',
                controller: 'ProfileController',
                templateUrl: 'templates/profile.html'
            })
        $stateProvider
            .state('sellerProfile', {
                url: '/sellerProfile',
                controller: 'SellerProfileController',
                templateUrl: 'templates/sellerProfile.html'
            })
        $stateProvider
            .state('creditCheck', {
                controller: 'CreditCheckController',
                templateUrl: 'templates/creditCheck.html'
            })
        $stateProvider
            .state('logout', {
                controller: 'LogoutController',
            })
        $stateProvider
            .state('terms', {
                url: '/terms',
                templateUrl: 'templates/terms.html'
            })
        $stateProvider
            .state('privacy', {
                url: '/privacy',
                templateUrl: 'templates/privacypolicy.html'
            }) 

    })

.config(function(stripeProvider) {
  stripeProvider.setPublishableKey('pk_test_OCo8uPAjPuNPNplSVJRYSUty');
})
.controller('AccordionDemoCtrl', function ($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
})

.controller('BrowseController', function BrowseController($scope, $location, $window, $http, $rootScope) {
    $http.get('/vehicles').then(function(response) {
        console.log(response);
        $scope.vehicles = response.data;
    });

    $scope.selectVehicle = function(vehicle) {
        console.log(vehicle);
        $window.sessionStorage.setItem('vehicleId', vehicle._id);
        $location.path('/vehicleView');
    }

})

.controller('LoginController', function LoginController($scope, $location, $window, $http, $rootScope) {
    $scope.login = function(buyer) {
        $http.post('/login', buyer).then(function(response) {
            $location.path('/profile')
        });
    }
})

.controller('LoginVehicleController', function LoginVehicleController($scope, $location, $window, $http, $rootScope) {
    $scope.loginVeh = function(vehicle) {
        $http.post('/loginVehicle', vehicle).then(function(response) {
            $location.path('/sellerProfile')
        });
    }
})

.controller('SignupController', function SignupController($scope, $location, $window, $http, $rootScope) {
    $scope.signup = function(buyer) {
        $http.post('/signup', buyer).then(function(response) {
            $location.path('/profile')
        });
    }
})

.controller('SignupVehicleController', function SignupVehicleController($scope, $location, $window, $http, $rootScope) {
    $scope.signupVehicle = function(vehicle) {
        $http.post('/signupVehicle', vehicle)
            .then(function(response) {
                $location.path('/congratulations')
        })
    }
})

.controller('LendingTreeController', function LendingTreeController($scope, $location, $window, $http, $rootScope) {
    // var req = {
    //     method: 'POST',
    //     url: 'https://qaaffiliates.lendingtree.com/v1/QFPostAuto.aspx',
    //     headers: {
    //     'Content-Type': 'text/xml'
    //     },
    //     data: { test: 'test' }
    // }


    $scope.getLoan= function() {
        $http.post('/xml').then(function(response) {
            console.log(response.data.data)
            var info = response.data.data;
            $http.post('https://qaaffiliates.lendingtree.com/v1/QFPostAuto.aspx', info).then(function(response){
                console.log(response)
                $scope.xml = response.data
            })
            // var req = {
            //     method: 'POST',
            //     url: 'https://qaaffiliates.lendingtree.com/v1/QFPostAuto.aspx',
            //     headers: {
            //         'Content-Type': 'text/xml'
            //     },
            //     data: { test: info}
            // }
            // $scope.xml = response.data.data; 
            // $http(req).then(function(response){
            //     console.log(response);
            // })
        })
    }
})

.controller('VehicleViewController', function VehicleViewController($scope, $location, $window, $http, $rootScope) {


    $http.get('/vehicles/' + $window.sessionStorage.vehicleId).then(function(response){
        console.log(response.data)
        $scope.vehicle = response.data;

        // $scope.vehicleInfo.make = response.data.make.name;
        $scope.slides = response.data.pics;
        $scope.links = response.data.pics;
        console.log($scope.links);
        // https://api.edmunds.com/api/vehicle/v2/{make}/{model}/{year}/styles?fmt=json&api_key={api key}

        $http.get("https://api.edmunds.com/api/vehicle/v2/"+response.data.make+"/"+response.data.model+"/"+response.data.year+"/grade?fmt=json&api_key=yuwtpfvpq5aja2bpxpyj8frg").then(function(edmundsresponse){
             console.log(edmundsresponse.data);
            $scope.edmunds = edmundsresponse.data.reviews;
        })

        $http.get("https://api.edmunds.com/api/tco/v1/details/allnewtcobystyleidzipandstate/200711761/90043/CA?fmt=json&api_key=yuwtpfvpq5aja2bpxpyj8frg").then(function(response){
            console.log(response);
        })
        $http.get("https://api.edmunds.com/api/vehicle/v2/vins/1ZVBP8EM7E5236358?&fmt=json&api_key=yuwtpfvpq5aja2bpxpyj8frg").then(function(response){
             console.log(response.data);

            $scope.vehicleStyles = response.data.years[0].styles;
        })
        // https://api.edmunds.com/api/vehicle/v2/vins/5NPEB4AC5CH333298?&fmt=json&api_key=yuwtpfvpq5aja2bpxpyj8frg
        // // https://api.edmunds.com/api/vehicle/v2/vins/{car VIN}?manufactureCode={manufacturer code}&fmt=json&api_key={api key}
        // https://api.edmunds.com/api/vehiclereviews/v2/honda/accord/2012?fmt=json&api_key={api key}
        // https://api.edmunds.com/api/vehicle/v2/{make}/{model}/{year}/grade?fmt=json&api_key={api_key}
    })




    $scope.inquire = function(inquiry){
        inquiry.make = $scope.vehicle.make;
        inquiry.model = $scope.vehicle.model;
        inquiry.year = $scope.vehicle.year;
        inquiry.style = $scope.vehicle.style;
        inquiry.price = $scope.vehicle.price;
        inquiry.vehicleid = $scope.vehicle._id;

        $http.post('/inquiry', inquiry).then(function(response) {
            console.log(response);
            $location.path('/hooray')
        });
    }


    $scope.purchaseVehicle = function(user) {
        $http.put('/vehicles/' + $window.sessionStorage.vehicleId).then(function(response) {
            $scope.purchaseData = response.data;
            $location.path('/profile')
        })
    }

    $scope.setFilters = function (event) {
        event.preventDefault();
    }

})

.controller('SellerProfileController', function SellerProfileController($scope, $location, $window, $http, $rootScope) {
    $http.get('/sellerProfile').then(function(response) {
        $scope.profile = response.data.data;
    });
    $scope.logoutSeller = function() {
        $http.get('/logout').then(function(response) {
            $location.path('/home')
        })
    }
})

.controller('ProfileController', function ProfileController($scope, $location, $window, $http, $rootScope) {
    $http.get('/profile').then(function(response) {
        $scope.profile = response.data.data;
        $scope.pickedLoan;

        if($scope.profile.loan.length){
            $scope.pickedLoan = true;
        } else {
            $scope.pickedLoan = false;
        }

    });

    $scope.creditCheck = function() {
            $http.get('/creditCheck').then(function(response) {
              console.log(response.data);
                $scope.results = response.data;
            })
        }
        $scope.pickLoan = function(loan) {
          $http.post('/pickedLoan', loan).then(function(response) {
            console.log(response.data);
          });
        }

        $scope.logout = function() {
            $http.get('/logout').then(function(response) {
                $location.path('/home')
            })
        }
})

.controller('WizardCtrl', function WizardCtrl($scope, stripe,  $http, $window, $rootScope){
    $scope.model = {};

     $scope.fblogin = function() {
        $window.location.href = '/login/facebook/';

    }

    $scope.googleLogin = function() {
        $window.location.href = '/auth/google/';
    }

  
  $http.get('/sellerIsLogged').then(function(response){
        $scope.loggedUser = response.data;
  })

    $scope.inputVin = function(vin){
        $http.get("https://api.edmunds.com/api/vehicle/v2/vins/" + vin.vin + "?&fmt=json&api_key=yuwtpfvpq5aja2bpxpyj8frg").then(function(response){
            console.log(response.data.years[0].year);
            var year = response.data.years[0].year;
            if(year < 2010){
                $scope.error = 'Sorry, At this time vehicles must be six years or newer.';
            }
            $scope.passed ='true';
            $scope.vehicleInfo = response.data
            $scope.vehicleInfo.make = response.data.make.name;     
             console.log(response.data.years[0].styles);
            $scope.vehicleStyles = response.data.years[0].styles;
        })
    }


    $scope.stripeCallback = function (card) {
      return stripe.card.createToken(card)
        .then(function(response){
            console.log('token created for card ending in ', response.card.last4, response.id);
            var payment = response;
            payment.card = response.card;
            payment.token = response.id;
            console.log(payment);
            return $http.post('/payment', payment);
        })
        .then(function (payment) {
            console.log(payment.data.data);
            console.log('successfully submitted payment for $', payment.data.data.amount);
            $scope.successfulPayment = payment.data.data.amount;

        })
        .catch(function (err) {
            if (err.type && /^Stripe/.test(err.type)) {
                $scope.unsuccessfulPayment('Stripe error: ', err.message);
            }
            else{
                console.log('Other error occurred, possibly with your API', err.message);
            }
        });
    };

    $scope.isCheckboxChecked = function() {
        return ($scope.checkbox1 || $scope.checkbox2);
    }



    $scope.selectStyle= function(input){
        console.log(input.id);
        $window.sessionStorage.styleId = input.id
       
    }

    $scope.completeForm = function(form){
        $http.get('https://api.edmunds.com/v1/api/tmv/tmvservice/calculateusedtmv?styleid=' + window.sessionStorage.styleId +'&condition=Outstanding&mileage=' + form.mileage + '&zip=' + form.zip + '&fmt=json&api_key=yuwtpfvpq5aja2bpxpyj8frg').then(function(response) {
            console.log(response.data.tmv);
            $scope.vehicleData = response.data.tmv.totalWithOptions;
        });
    }

    $scope.enterValidation = function(){
        return true;
    };

    $scope.exitValidation = function(){
        return true;
    };

   

})

.controller('CreditCheckController', function LoginVehicleController($scope, $location, $window, $http, $rootScope) {
        $http.get('/creditCheck').then(function(response) {
            $scope.results = response.data;
            $location.path('/creditCheck.html')
        });
    })
.controller('AppCtrl', function($scope, $mdDialog, $mdMedia, $http, $window) {
        $scope.status = '  ';
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        $scope.fblogin = function() {
            $window.location.href = '/login/facebook/';
        }

        $scope.googleLogin = function() {
            $window.location.href = '/auth/google/';
        }
        $scope.selectedMake = function(make) {
            $scope.currentMake = make;
        }
        $scope.selectedModel = function(model) {
            $scope.currentModel = model;
        }
        $scope.handleStyle = function(style) {
            $scope.currentStyle = style;
        }
        $scope.selectedYear = function(year) {
            $scope.currentYear = year;
            $http.get('https://api.edmunds.com/api/vehicle/v2/' + $scope.currentMake.name + '/' + $scope.currentModel.name + '/' + $scope.currentYear.year + '?fmt=json&api_key=yuwtpfvpq5aja2bpxpyj8frg').then(function(response) {
                $scope.styles = response.data;
            });
        }
        $scope.showSellerAlert = function(ev) {
            $http.get('https://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=yuwtpfvpq5aja2bpxpyj8frg').then(function(response) {
                $scope.makes = _.map(response.data.makes, function(make) {
                    return make;
                });
            });

            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                template: '<md-dialog class="login-page">' +
                    '<md-dialog-content layout="column" layout-align="start center">' +
                    '<h4>SELL WITH CARISTA</h4>' +
                    '     <md-input-container>' +
                    '           <label>Email</label>' +
                    '           <input type="text" ng-model="vehicle.email">' +
                    '     </md-input-container>' +
                    '     <md-input-container>' +
                    '           <label>Make</label>' +
                    '           <md-select  ng-model="vehicle.make">' +
                    '           <md-option ng-repeat="make in makes" ng-click="selectedMake(make)">{{make.name}}</md-option>' +
                    '           </md-select>' +
                    '     </md-input-container>' +
                    '     <md-input-container>' +
                    '           <label>Model</label>' +
                    '           <md-select  ng-model="vehicle.model">' +
                    '           <md-option ng-repeat="model in currentMake.models" ng-click="selectedModel(model)">{{model.name}}</md-option>' +
                    '           </md-select>' +
                    '     </md-input-container>' +
                    '     <md-input-container>' +
                    '           <label>Year</label>' +
                    '           <md-select ng-model="vehicle.year">' +
                    '           <md-option ng-repeat="year in currentModel.years" ng-click="selectedYear(year)">{{year.year}}</md-option>' +
                    '           </md-select>' +
                    '     </md-input-container>' +
                    '     <md-input-container>' +
                    '           <label>Style</label>' +
                    '           <md-select ng-model="vehicle.style">' +
                    '           <md-option ng-repeat="style in styles.styles" ng-click="handleStyle(style)">{{style.name}}</md-option>' +
                    '           </md-select>' +
                    '     </md-input-container>' +
                    '     <md-input-container>' +
                    '           <label>Mileage</label>' +
                    '           <input type="mileage" ng-model="vehicle.mileage">' +
                    '     </md-input-container>' +
                    '     <md-input-container>' +
                    '           <label>Zipcode</label>' +
                    '           <input type="zipcode" ng-model="vehicle.zip">' +
                    '     </md-input-container>' +
                    '     <md-input-container>' +
                    '           <label>Condition</label>' +
                    '           <md-select ng-model="vehicle.condition">' +
                    '           <md-option>Outstanding</md-option>' +
                    '           <md-option>Clean</md-option>' +
                    '           <md-option>Average</md-option>' +
                    '           <md-option>Rough</md-option>' +
                    '           <md-option>Damaged</md-option>' +
                    '           </md-select>' +
                    '     </md-input-container>' +
                    '     <md-input-container>' +
                    '           <label>Phone</label>' +
                    '           <input type="text" ng-model="vehicle.phone">' +
                    '     </md-input-container>' +
                    '<p> By signing up you agree to the <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a>'+

                    '</p>'+
                    '<md-button id="confirmSaleBtn" class ="confirmBtn" ng-click ="signupVehicle(vehicle)">Sell My Car!</md-button>' +
                    '</md-dialog-content>' +
                    '</md-dialog>',
                controller: function DialogController($scope, $mdDialog, $http, $location, $window) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }

                    $scope.getValue = function(vehicle) {
                        console.log(vehicle.style);
                        $http.get('https://api.edmunds.com/v1/api/tmv/tmvservice/calculateusedtmv?styleid=' + $scope.currentStyle.id + '&condition=' + vehicle.condition + '&mileage=' + vehicle.mileage + '&zip=' + vehicle.zip + '&fmt=json&api_key=yuwtpfvpq5aja2bpxpyj8frg').then(function(response) {
                            console.log(response.data.tmv);
                            vehicle.tmv = response.data.tmv.certifiedUsedPrice;
                            vehicle.styleId = $scope.currentStyle.id;
                            vehicle.pics = ['tacoma.png', 'tacoma2.jpeg', 'tacoma3.JPG']
                            $http.post('/signupVehicle', vehicle)
                                .then(function(response) {
                                    $mdDialog.hide();
                                    $location.path('/congratulations')
                                });
                        });
                    }

                }

            })
        }

        $scope.showBuyerAlert = function(ev) {
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                template: '<md-dialog class="login-page">' +
                    '<md-dialog-content layout="column" layout-align="start center">' +
                    '<h4>BUY WITH CARISTA</h4>' +
                    '<md-button class="fb-login-btn" ng-click="fblogin()"></md-button>' +
                    '<md-button class="google-login-btn" ng-click="googleLogin()"></md-button>' +
                    '</md-dialog-content>' +
                    '</md-dialog>',
                controller: function DialogController($scope, $mdDialog, $http, $location, $window) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }

                $scope.signup = function(buyer, $mdDialog) {
                        $http.post('/signup', buyer)
                            .then(function(response) {

                                $scope.profile = response.data;
                                $location.path('/profile')
                            })
                    }
                }

            })
        };
       

        $scope.inquireAlert = function(ev) {
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                template: '<md-dialog class="login-page">' +
                    '<md-dialog-content layout="column" layout-align="start center">' +
                    '<h4>Buy with the best.</h4>' +
                    '     <md-input-container>' +
                    '           <label>Email</label>' +
                    '         <input ng-model="inquiry.email">'+          
                    '     </md-input-container>' +  
                    '     <md-input-container>' +
                    '           <label>Name</label>' +
                    '        <input ng-model="inquiry.name">'+
                    '     </md-input-container>' + 
                    '     <md-input-container>' +
                    '           <label>Phone</label>' +
                    '        <input ng-model="inquiry.phone">'+
                    '     </md-input-container>' + 
                    '<md-button id="confirmSaleBtn" class ="confirmBtn" ng-click ="inquire(inquiry)">Im interested!</md-button>'+
                    '</md-dialog-content>' +
                    '</md-dialog>',
                controller: function DialogController($scope, $mdDialog, $http, $location, $window) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }

      
                }

            })
        };


         $scope.contactForm = function(ev) {
            $mdDialog.show({
                clickOutsideToClose: true,
                scope: $scope,
                preserveScope: true,
                template: 
                '<md-dialog  class="login-page">'+
                '<md-dialog-content layout="column" layout-align="start center">'+
                '<h2>Give Us A Honk!</h2>'+
                '<form>'+
                    '<div class="form-group">'+
                    '<input ng-model="info.email" type="email" name="email" class="form-control" id="exampleInputEmail1" placeholder="Email *">'+
                    '</div>'+              
                      '<div class="form-group">'+
                      '<textarea ng-model="info.message" class="form-control" name="message" placeholder="What Can We Help With You With? *" rows="3"></textarea>'+
                      '</div>'+
                      '<div class="form-group">'+
                      '   <div class="col-sm-6"><input ng-model="info.firstName" type="text" name="firstName" class="form-control" placeholder="First Name *"></div>'+
                      '   <div class="col-sm-6"><input ng-model="info.lastName" type="text" name="lastName" class="form-control" placeholder="Last Name *"></div>'+
                      '</div>'+
                      '<br></br>'+
                      '<div class="form-group">'+
                      '   <div class="col-sm-6"><input ng-model="info.zipcode" type="text" name="zipcode" class="form-control" placeholder="Zipcode *"></div>'+
                      '   <div class="col-sm-6"><input ng-model="info.phone" type="number" name="phone"  class="form-control" placeholder="Phone Number *"></div>'+
                      '</div>'+
                      '<br></br>'+
                      '<div layout="column" layout-align="start center">'+
                      '<md-button type="submit" ng-click="contact(info)" class="contactBtn" id="navsellerBtn">Submit</md-button>'+
                      '</div>'+
                '</form>'+
                '</md-dialog-content>' +
                '</md-dialog>',
                controller: function ContactFormController ($scope, $mdToast, $animate,  $mdDialog, $http, $location, $window){
                            $scope.toastPosition = {
                                bottom: false,
                                top: true,
                                left: false,
                                right: true
                            };
                            $scope.getToastPosition = function() {
                                return Object.keys($scope.toastPosition)
                                    .filter(function(pos){
                                        return $scope.toastPosition[pos]
                                    })
                                    .join(' ')
                            };
                            $scope.contact = function(info){
                                $http.post('/contact',info).then(function(response){
                                        $mdDialog.hide();
                                        $location.path('/congratulations');
                                      
                                })
                            };

                            
                 }

            })

            
        };
    })




function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
