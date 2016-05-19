(function(angular) {
  angular.module('app', ['ngAnimate', 'ngSanitize', 'ngRoute', 'ngCookies', 'app.register', 'app.login']);

  angular.module('app')
  .config("config", ['$routeProvider', '$locationProvider',
  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        controller: 'HomeController',
        templateUrl: 'templates/index.html'
      })
      .when('/', {
        controller: 'LoginController',
        templateUrl: 'templates/login.html'
      })
      .when('/', {
        controller: 'SignUpController',
        templateUrl: 'templates/signup.html'
      })

    .otherwise({
      redirectTo: '/'
    });
    }]);

})(window.angular);
