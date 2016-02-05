module.exports = function(configs) {
  var app = require('express')();

  var $http = require('../$http.js')(configs.server);


  app.get('/', function(req, res) {

    res.render('index.html', function(err, html) {
      
    });

    // res.send('报名页面');
    // res.send(configs.app_path);

    // var pomise = $http.post('http://www.meihao.dev/test.php', {
    //   data: 'this is a test',
    //   code: 'this is code',
    //   object: {
    //     a: 123,
    //     b: 456
    //   }
    // });

    // pomise.then(function(data) {
    //   res.send(data);
    // }, function(e) {
    //   res.send(e);
    // });

  });


  return app;
};