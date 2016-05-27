var app = angular.module('app', [ 'ui.router', 'ngMaterial', 'ngFileUpload'])

//add quote gen for vehicles server side and client side
//also render the html like the credit check template

  app.config(function($stateProvider, $httpProvider ,$urlRouterProvider, $locationProvider) {

      $httpProvider.interceptors.push('AuthInterceptor');
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
        url:'/login',
        controller: 'LoginController',
        templateUrl: 'templates/login.html'
      })
      $stateProvider
        .state('loginVehicle', {
        url:'/loginVehicle',
        controller: 'LoginVehicleController',
        templateUrl: 'templates/loginVehicle.html'
      })
      $stateProvider
        .state('signup', {
        url:'/signup',
        controller: 'SignupController',
        templateUrl: 'templates/signup.html'
      })
      $stateProvider
        .state('signupVehicle', {
        url:'/signupVehicle',
        controller: 'SignupVehicleController',
        templateUrl: 'templates/signupVehicle.html',
      })
      $stateProvider
        .state('profile', {
        url:'/profile',
        controller: 'ProfileController',
        templateUrl: 'templates/profile.html'
      })
      $stateProvider
        .state('sellerProfile', {
        url:'/sellerProfile',
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
      $stateProvider
        .state('inspection', {
            url: '/inspection',
        templateUrl: 'templates/inspection.html',
      })


  })
      .factory('AuthInterceptor', function ($window, $q, $location) {
      return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.getItem('token')) {
                config.headers.authorization =  $window.sessionStorage.getItem('token');
            }
            // console.log(config.headers);
            return config || $q.when(config);
        },
        response: function(response) {
            if (response.status === 401) {
               $location.path('/auth');
            }
            return response || $q.when(response);
           }
        };
      })

      .controller('mainController', function MainController($scope, $location, $window, $http, $rootScope){
          $scope.hello = "hello fucker";
      })


      .controller('BrowseController', function BrowseController($scope, $location, $window, $http, $rootScope ) {
          $http.get('/vehicles').then(function(response){
          console.log(response);
          $scope.vehicles = response.data;
          });

          $scope.selectVehicle = function(vehicle){
            console.log(vehicle);
            $window.sessionStorage.setItem('vehicleId', vehicle._id);
            $window.sessionStorage.setItem('make', vehicle.make);
            $window.sessionStorage.setItem('model', vehicle.model);
            $window.sessionStorage.setItem('year', vehicle.year);
            $location.path('/vehicleView');
          }


      })

      .controller('LoginController', function LoginController($scope, $location, $window, $http, $rootScope){
        $scope.login = function(buyer){
         $http.post('/login', buyer).then(function(response){
            $window.sessionStorage.setItem('token', response.data.token)
            $location.path('/profile')
          });
        }
      })

      .controller('LoginVehicleController', function LoginVehicleController($scope, $location, $window, $http, $rootScope){
        $scope.loginVeh = function(vehicle){
         $http.post('/loginVehicle', vehicle).then(function(response){
          console.log(response.data.token);
            $window.sessionStorage.setItem('token', response.data.token)
            $location.path('/sellerProfile')
          });
        }
      })

      .controller('SignupController', function SignupController($scope, $location, $window, $http, $rootScope){
        $scope.signup = function(buyer){
         $http.post('/signup', buyer).success(function(response){
            console.log(response.data);
            $scope.profile = response.data;
            $window.sessionStorage.setItem('token', response.data.token)
            $location.path('/profile')
          });
        }
      })

      .controller('SignupVehicleController', function SignupVehicleController($scope, $location, $window, $http, $rootScope){
        $scope.signupVehicle = function(vehicle){
         $http.post('/signupVehicle', vehicle)
         .success(function(response){
            console.log(response.data);
            $window.sessionStorage.setItem('token', response.data.token)
            // $scope.profile = response.data;
            $location.path('/congratulations')
          })
        }
      })

      .controller('VehicleViewController', function VehicleViewController($scope, $location, $window, $http, $rootScope){

            $scope.vehicle = {
              year: $window.sessionStorage.year,
              make: $window.sessionStorage.make,
              model: $window.sessionStorage.model
            }




         $scope.purchaseVehicle = function(user){
          $http.put('/vehicles/' + $window.sessionStorage.vehicleId).then(function(response){
            $scope.purchaseData = response.data;
            $location.path('/profile')
          })
         }
      })

      .controller('SellerProfileController', function SellerProfileController($scope, $location, $window, $http, $rootScope){
         $http.get('/sellerProfile').then(function(response){
            console.log(response.data);
            $scope.profile = response.data.data;
          });
        $scope.logoutSeller = function(){
         $http.get('/logout').then(function(response){
          $window.sessionStorage.setItem('token', '')
          $location.path('/home')
        })
        }
      })

      .controller('ProfileController', function ProfileController($scope, $location, $window, $http, $rootScope){
         $http.get('/profile').then(function(response){
            console.log(response);
            $scope.profile = response.data.data;
          });
         $scope.creditCheck = function(){
          $http.get('/creditCheck').then(function(response){
            console.log(response);
            $scope.results = response.data;
          })
         },
        $scope.logout = function(){
         $http.get('/logout').then(function(response){
          $window.sessionStorage.setItem('token', '')
          $location.path('/home')
        })
        }
      })

      .controller('CreditCheckController', function LoginVehicleController($scope, $location, $window, $http, $rootScope){
         $http.get('/creditCheck').then(function(response){
            $scope.results = response.data;
            $location.path('/creditCheck.html')
          });
      })
  .controller('MyController', function($scope, $mdBottomSheet) {
  $scope.openBottomSheet = function() {
    $mdBottomSheet.show({
      templateUrl: 'login'
    });
  };
})


      .directive("myNavscroll", function($window) {
       return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            if (!scope.scrollPosition) {
                scope.scrollPosition = 0
            }

            if (this.pageYOffset > scope.scrollPosition) {
                scope.boolChangeClass = true;
            } else {
                scope.boolChangeClass = false;
            }
            scope.scrollPosition = this.pageYOffset;
            scope.$apply();
            });
          };
       });
