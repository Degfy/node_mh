'use strict';

var minimist = require('minimist'),
  utils = require('utils')._,
  url = require('url'),
  fs = require('fs'),
  config_file = 'config.js',

  //命令行参数获取
  options = minimist(process.argv.slice(2), {
    string: ['host', 'port', 'config_url', 'key'],
    // default: {
    //   host: 'www.meihao.dev',
    //   port: '80'
    // }
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
      write_configfile(JSON.parse(pageData), serverStart);
    });
  });
} else {
  fs.stat(config_file, function(err, stat) {
    if (!err) {
      serverStart();
    } else {
      var configs = JSON.parse(fs.readFileSync(config_file + '.json'));
      write_configfile(configs, serverStart);
    }
  });
}

function write_configfile(configData, success_fn) {
  utils.extend(configData, options);
  delete configData._;
  var config_str = 'module.exports = ' + JSON.stringify(configData, '', 2) + ';';
  fs.writeFile(config_file, config_str, 'utf8', success_fn);
}


function serverStart() {
  console.log('开始服务了哦');
  var configs = require('./config.js'),
    express = require('express'),
    app = express(),

    //课程主页
    _course = require('./handlers/course.js'),

    //课程列表页
    _list = require('./handlers/list.js'),

    //支付页
    _pay = require('./handlers/pay.js'),

    //报名页
    _apply = require('./handlers/apply.js'),

    //默认处理
    _default = require('./handlers/default.js');


  utils.extend(options, configs);

  app
    .use('/course', _course)
    .use('/list', _list)
    .use('/pay', _pay)
    .use('/apply', _apply)
    .use('/', _default)
    .use('/public', express.static('./public', {
      lastModified: true,
      maxAge: 2.592e+9
    }))
    .listen(options.port, options.host);
};