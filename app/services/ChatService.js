function ChatService($http, $q) {
  var socket = io.connect('http://localhost:3000');

  this.addListener = function (name, callback, context) {
    socket.on(name, function () {
      callback.apply(context, arguments);
    });
  };

  this.send = function (message, users) {
    socket.emit('news', message, users);
  };

  this.getAllSockets = function () {
    var deferred = $q.defer();
    $http.get('/api/sockets').success(deferred.resolve).error(deferred.reject);
    return deferred.promise;
  };
}

ChatService.$inject = ['$http', '$q'];

angular.module('app').service('ChatService', ChatService);
