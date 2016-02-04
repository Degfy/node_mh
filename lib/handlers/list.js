module.exports = function(configs) {
  var app = require('express')();


  app.get('/', function(req, res) {
    res.send('列表页');
  });

  return app;
};