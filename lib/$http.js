// $http.js

var $q = require('q'),
  http = require('http'),
  url = require('url'),
  utils = require('utils')._;


/**
 * $http 的构造函数
 * @param  {object} config_options 支持配置默认的url和headers
 * @return {[type]}                [description]
 */
module.exports = function(config_options) {
  var _config = {};
  if (config_options.url) {
    _config = url.parse(config_options.url);
  }

  _config.method = 'GET';

  _config.headers = {};
  if (config_options.headers) {
    _config.headers = config_options.headers;
  }

  /**
   * [$http description]
   * @param  {object} options 
   * {
   *   method://
   *   url://
   *   params://
   *   data://
   *   headers://
   * }
   * @return {[type]}         [description]
   */
  var $http = function(options) {
    if (!options.url) {
      throw new Error("url is required!");
    }

    var deferred = $q.defer(),
      http_options = {},
      tmp_url = url.parse(options.url),
      postData = '';

    utils.defaults(http_options, _config);
    if (options.method) {
      http_options.method = options.method;
    }

    for (var key in tmp_url) {
      if (tmp_url[key]) {
        http_options[key] = tmp_url[key];
      }
    }
    if (options.headers) {
      utils.extend(http_options.headers, options.headers);
    }

    if (options.params) {
      http_options.search = querystring.stringify(options.params);
      http_options.query = options.params;
    }

    if (options.data) {
      postData = JSON.stringify(options.data);
      http_options.headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Content-Length': postData.length
      };
    }

    var req = http.request(http_options, function(res) {
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        deferred.resolve(data);
      });

      res.on('error', function(error) {
        deferred.reject(error);
      });
    });
    console.log(options.data);
    if (options.data) {
      req.write(postData);
    }
    req.end();
    return deferred.promise;
  };

  function createShortMethods(names) {
    utils.forEach(arguments, function(name) {
      $http[name] = function(url, config) {
        return $http(utils.extend(config || {}, {
          method: name,
          url: url
        }));
      };
    });
  }


  function createShortMethodsWithData(name) {
    utils.forEach(arguments, function(name) {
      $http[name] = function(url, data, config) {
        return $http(utils.extend(config || {}, {
          method: name,
          url: url,
          data: data
        }));
      };
    });
  }

  createShortMethods('get', 'delete', 'head', 'jsonp');
  createShortMethodsWithData('post', 'put');
  return $http;
};