'use strict';

var minimist = require('minimist'),
  utils = require('utils')._,
  url = require('url'),
  fs = require('fs'),
  path = require('path'),
  config_file = 'config.js',

  //命令行参数获取
  options = minimist(process.argv.slice(2), {
    string: ['host', 'port', 'config_url', 'key'],
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
      write_configfile(JSON.parse(pageData), read_origin_config(), serverStart);
    });
  });
} else {
  fs.stat(config_file, function(err, stat) {
    if (!err) {
      serverStart();
    } else {
      write_configfile('', read_origin_config(), serverStart);
    }
  });
}

function read_origin_config() {
  var _package = JSON.parse(fs.readFileSync('./package.json'));
  if (_package.appConfig) {
    return _package.appConfig;
  }
}

function write_configfile(configData, origin_config, success_fn) {
  configData = configData || {};
  origin_config = origin_config || {};

  utils.extend(origin_config, configData);
  utils.extend(origin_config, options);
  delete origin_config._;
  
  var config_str = 'module.exports = ' + JSON.stringify(origin_config, '', 2) + ';';
  fs.writeFile(config_file, config_str, 'utf8', success_fn);
}


function serverStart() {
  var configs = require('./config.js');
  configs.app_path = path.resolve(configs.app_path || '.');
  configs.template = path.resolve(configs.template || './template');
  utils.extend(options, configs);


  var express = require('express'),
    app = express(),

    //课程主页
    _course = require('./lib/handlers/course.js')(options),

    //课程列表页
    _list = require('./lib/handlers/list.js')(options),

    //支付页
    _pay = require('./lib/handlers/pay.js')(options),

    //报名页
    _apply = require('./lib/handlers/apply.js')(options),

    //默认处理
    _default = require('./lib/handlers/default.js')(options);

  console.log('开始服务了哦:http://' + options.host + (options.port == '80' ? '' : ':' + options.port));
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