module.exports = function(configs) {
  var app = require('express')();

  var Client = require('../client.js');
  var api = Client(configs.server);

  app.get('/', function(req, res) {

    api
      .content('index')
      .then(function(data) {
        res.send(data);
        //console.log(data);
      }, function(e) {
        res.send(e);
        console.log(e);
      });
  });
  return app;
};