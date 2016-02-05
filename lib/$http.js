// $http.js

var $q = require('q'),
  http = require('http'),
  url = require('url'),
  qs = require('querystring'),
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
   * ##$http对象
   * @param  {object} options  一个对象，用于发起http请求，下面有一个示例
   * @return {object}         promise
   * 
   * ----------------------------------------------------------------------
   * ```
   * {
   *   //指定http使用的方法，该参数不允许为空
   *   method:'get',
   *   
   *   //指定http请求的地址，后面的querystring和params不能同时指定
   *   url: 'http://www.exampale.com/test.html?ok=test', 
   *
   *   //用于指定querystring，会被拼合到url中去，所以不要和url中querystring同时使用
   *   params:{test:100,ok:100},
   *
   *   //需要发送的数据，默认数的数据格式是json，可以在headers中设置其他的数据格式
   *   data: {data:'this is a test'},
   *   
   *   //设置http的头部信息
   *   headers:{}  //
   * }
   * ```
   * ----------------------------------------------------------------------
   * ##快捷方式
   * ### 1.$http.get
   * ### 2.$http.post
   * ### 3.$http.put
   * ### 4.$http.delete
   * ### 5.$http.head
   * ### 6.$http.jsonp
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

    if (options.params) {
      http_options.search = '?' + qs.stringify(options.params);
      http_options.query = qs.stringify(options.params);
      http_options.path += http_options.search;
      http_options.href += http_options.search;
    }

    if (options.data) {
      postData = JSON.stringify(options.data);
      http_options.headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'Content-Length': postData.length
      };
    }

    if (options.headers) {
      utils.extend(http_options.headers, options.headers);
    }

    // console.log(http_options);

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