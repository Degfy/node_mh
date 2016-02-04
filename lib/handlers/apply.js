module.exports = function(configs) {
  var app = require('express')();


  app.get('/', function(req, res) {
    res.send('报名页面' + configs.app_path);
    console.log(configs.template);
  });


  return app;
};