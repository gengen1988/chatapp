function ChatController($scope, ChatService) {

  var vm = this;

  vm.messageList = [];
  vm.users = [];

  var userIndex = {};

  function display(message) {
    vm.messageList.push({
      message: message
    });
  }

  ChatService.getAllSockets().then(function (sockets) {
    console.log(sockets);
    sockets.forEach(function (socket) {
      userIndex[socket.id] = socket;
    });
    vm.users = sockets;
  });

  ChatService.addListener('leave', function (id) {
    console.log('leave', id);
    var socket = userIndex[id];
    var index = vm.users.indexOf(socket);
    vm.users.splice(index, 1);
    delete userIndex[id];
    $scope.$apply();
  });

  ChatService.addListener('enter', function (id) {
    console.log('enter', id);
    var socket = {
      id: id
    };
    userIndex[id] = socket;
    vm.users.push(socket);
    $scope.$apply();
  });

  ChatService.addListener('news', function (message) {
    display(message);
    $scope.$apply();
  });

  ChatService.addListener('yourid', function (id) {
    vm.meid = id;
    var socket = userIndex[id];
    var index = vm.users.indexOf(socket);
    vm.users.splice(index, 1);
    delete userIndex[id];
    $scope.$apply();
  });

  var filterUser = function (users) {
    return users.filter(function (user) {
      return user.selected;
    });
  };

  var send = function (users) {
    ChatService.send(vm.sendingMessage, users);
    display(vm.sendingMessage);
    vm.sendingMessage = undefined;
  };

  this.send = function (users, e) {
    switch (e.which) {
    case 13:
      send(filterUser(users));
      break;
    }
  };

}

ChatController.$inject = ['$scope', 'ChatService'];

angular.module('app').controller('ChatController', ChatController);
