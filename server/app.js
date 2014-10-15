var express = require('express');
var socketIO = require('socket.io');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

server.listen(3000);

io.on('connection', function (socket) {
  console.log('connect', socket.id);

  socket.broadcast.emit('enter', socket.id);

  socket.on('disconnect', function () {
    socket.broadcast.emit('leave', socket.id);
  });

  socket.on('news', function (message, users) {
    if (users.length === 0) {
      socket.broadcast.emit('news', message);
      return;
    }
    users.forEach(function (user) {
      io.sockets.sockets.forEach(function (socket) {
        if (user.id === socket.id) {
          socket.emit('news', message);
        }
      });
    });
  });

  socket.emit('yourid', socket.id);
});

app.get('/api/sockets', function (req, res) {
  var ids = io.sockets.sockets.map(function (socket) {
    return {
      id: socket.id
    };
  });
  res.send(ids);
});
