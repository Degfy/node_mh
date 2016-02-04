// $http.js

var $q = require('q'),
  http = require('http'),
  url = require('url'),
  utils = require('utils');



module.exports = function(base_url) {

  var _base_url = url.parse(base_url),
    _options = {
      method: 'GET'
    };

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

    if (options.data) {
      postData = JSON.stringify(options.data);
      http_options.headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Content-Length': postData.length;
      };
    }

    if (options.headers) {
      utils.extend(http_options.headers, options.headers);
    }

    for (var key in tmp_url) {
      if (!tmp_url[key]) {
        delete tmp_url[key];
      }
    }

    utils.extend(http_options, _base_url);
    utils.extend(http_options, tmp_url);

    if (options.params) {
      http_options.search = querystring.stringify(options.params);
      http_options.query = options.params;
    }

    var req = http.request(http_options, function(res) {

      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        deferred.resolse(data);
      });

      res.on('error', function(error) {
        deferred.reject(error);
      });
    });

    if (options.data) {
      req.write(postData);
      req.end();
    }

    return deferred.promise;
  };

  return $http;
};