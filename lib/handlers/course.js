module.exports = function(configs) {
  var app = require('express')();


  app.get('/', function(req, res) {
    res.send('课程页面');
  });

  return app;
};