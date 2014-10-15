(function () {

  function config($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/root.html',
    });
  }

  config.$inject = ['$routeProvider'];

  angular.module('app', ['ngRoute']);
  angular.module('app').config(config);

})();
