var app = angular.module('app', ['ui.router', 'ngMaterial', 'ngFileUpload'])

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
            .state('browse', {
                url: '/search',
                controller: 'BrowseController',
                templateUrl: 'templates/browseVehicle.html'
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
                templateUrl: 'templates/signupVehicle.html',
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
            .state('vehicleView', {
                url: '/vehicleView',
                controller: 'VehicleViewController',
                templateUrl: 'templates/vehicleView.html'
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

    })

.controller('mainController', function MainController($scope, $location, $window, $http, $rootScope) {
    $scope.hello = "hello fucker";
})

.controller('BrowseController', function BrowseController($scope, $location, $window, $http, $rootScope) {
    $http.get('/vehicles').then(function(response) {
        console.log(response);
        $scope.vehicles = response.data;
    });

    $scope.selectVehicle = function(vehicle) {
        console.log(vehicle);
        $window.sessionStorage.setItem('vehicleId', vehicle._id);
        $window.sessionStorage.setItem('make', vehicle.make);
        $window.sessionStorage.setItem('model', vehicle.model);
        $window.sessionStorage.setItem('year', vehicle.year);
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

.controller('VehicleViewController', function VehicleViewController($scope, $location, $window, $http, $rootScope) {
    $scope.vehicle = {
        year: $window.sessionStorage.year,
        make: $window.sessionStorage.make,
        model: $window.sessionStorage.model
    }

    $scope.purchaseVehicle = function(user) {
        $http.put('/vehicles/' + $window.sessionStorage.vehicleId).then(function(response) {
            $scope.purchaseData = response.data;
            $location.path('/profile')
        })
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
    });
    $scope.creditCheck = function() {
            $http.get('/creditCheck').then(function(response) {
              console.log(response.data);
                $scope.results = response.data;
            })
        },
        $scope.logout = function() {
            $http.get('/logout').then(function(response) {
                $location.path('/home')
            })
        }
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
                    return make
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
                    '<md-button id="confirmSaleBtn" class ="confirmBtn" ng-click ="signupVehicle(vehicle)">Sell My Car!</md-button>' +
                    '</md-dialog-content>' +
                    '</md-dialog>',
                controller: function DialogController($scope, $mdDialog, $http, $location, $window) {
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }

                    $scope.signupVehicle = function(vehicle) {
                        $http.get('https://api.edmunds.com/v1/api/tmv/tmvservice/calculateusedtmv?styleid=' + $scope.currentStyle.id + '&condition=' + vehicle.condition + '&mileage=' + vehicle.mileage + '&zip=' + vehicle.zip + '&fmt=json&api_key=yuwtpfvpq5aja2bpxpyj8frg').then(function(response) {

                            vehicle.tmv = response.data.tmv.certifiedUsedPrice;

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
