(function(angular) {
 angular.module('app', [ 'ui.router'])
.controller('browseControler', ['$scope', '$location', '$window', '$http', '$rootScope',
  function browseController($scope, $location, $window, $http, $rootScope ) {
  	  $http.get('/vehicles').then(function(response){
        console.log(response);
        $scope.vehicles = response.data;
      })
  }]);
})(window.angular);