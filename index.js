'use strict';

var minimist = require('minimist'),
  util = require('util'),
  url = require('url'),
  fs = require('fs'),
  config_file = 'config.js',

  //命令行参数获取
  options = minimist(process.argv.slice(2), {
    string: ['host', 'port', 'config_url', 'key'],
    default: {
      host: 'www.meihao.dev',
      port: '9900'
    }
  });

if (options.config_url) {
  var http = require('http'),
    req_options = url.parse(options.config_url);
  var headers = {};
  for (var key in options) {
    headers['x-options-' + key] = options[key];
  }

  req_options.headers = headers;

  http.get(req_options, function(res) {
    var pageData = '';
    res.on('data', function(chunk) {
      pageData += chunk;
    });
    res.on('end', function() {
      var config = JSON.parse(pageData),
        config_str = 'exports.configs = ' + JSON.stringify(config, '', 2) + ';';

      fs.writeFile(config_file, config_str, 'utf8', serverStart);

    });
  });
} else {
  fs.stat(config_file, function(err, stat) {
    if (!err) {
      serverStart();
    } else {
      var readable = fs.createReadStream(config_file + '.sample'),
        writeable = fs.createWriteStream(config_file);
      readable
        .pipe(writeable)
        .on('end', serverStart);
    }
  });
}


function serverStart() {
  console.log('开始服务了哦');
};