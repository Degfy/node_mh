module.exports = function(configs) {
  var app = require('express')();


  app.get('/', function(req, res) {
    res.send('支付页面');
  });

  return app;
};