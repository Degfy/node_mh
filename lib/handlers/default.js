module.exports = function(configs) {
  var app = require('express')(),
    Client = require('../client.js'),
    Cache = require('../cache.js'),
    $q = require('q'),
    fs = require('fs'),
    api = Client(configs.server),
    cache = Cache(configs);

  var header = fs.readFileSync(configs.template + '/header.html', 'utf8'),
    footer = fs.readFileSync(configs.template + '/footer.html', 'utf8');

  app.use('/', function(req, res, next) {
    var page_reg = {
        index: /^\/(index.html)?$/,
        course: /^\/course\/([0-9]*)$/,
        about: /^\/about.html$/
      },
      page_data = {
        tag: '',
        courseid: ''
      };

    for (var key in page_reg) {
      var matches = req.path.match(page_reg[key]);
      if (matches) {
        page_data.tag = key;
        if (key == 'course') {
          page_data.courseid = matches[1];
        }
      }
    }

    if (page_data.tag) {
      cache.middleWare(req, res, function() {
        console.log('build files');
        api
          .content(page_data.tag, page_data.courseid)
          .then(null, function(e) {
            var deffered = $q.defer();
            fs.readFile(configs.template + '/404.html', 'utf8', function(err, data) {
              if (!err) {
                data = 'read file error!';
              }
              deffered.resolve(data);
            });
            return deffered.promise;
          })
          .then(function(body) {
            var html = header + body + footer;
            cache(req.path, html);
            res.send(html);
          });
      });
    } else {
      next();
    }
  });
  return app;
};