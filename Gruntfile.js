var httpProxy = require('http-proxy');

var socketProxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000/socket.io'
});

var apiProxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000/api'
});

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    config: {
      app: 'app',
      framework: 'framework'
    },
    connect: {
      dev: {
        options: {
          keepalive: true,
          base: [
            '<%= config.app %>',
            '<%= config.framework %>'
          ],
          middleware: function (connect, options, middlewares) {
            var app = connect();
            var deps = app.use('/bower_components', connect.static('bower_components'));
            var api = app.use('/api', function (req, res) {
              apiProxy.web(req, res, function () {
                res.statusCode = 500;
                res.end();
              });
            });
            var socket = app.use('/socket.io', function (req, res) {
              socketProxy.web(req, res, function () {
                res.statusCode = 500;
                res.end();
              });
            });

            middlewares.unshift(deps);
            middlewares.unshift(socket);
            middlewares.unshift(api);
            return middlewares;
          }
        }
      },
      options: {
        port: 9000,
        hostname: '*'
      }
    }
  });

  grunt.registerTask('default', ['connect']);
};
