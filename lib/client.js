// client.js
// 用于从服务器上获取内容
// 
var _header = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'If-Modified-Since': '0',
    'Cache-Control': 'no-cache'
  },
  _token,
  $q = require('q'),
  http = require('http'),
  url = require('url');

/**
 * [$http description]
 * @param  {object} options 
 * {
 *   method://
 *   url://
 *   params://
 *   data://
 *   headers://
 *   transformRequest://
 *   transformResponse://
 * }
 * @return {[type]}         [description]
 */
var $http = function(options) {
  var deferred = $q.defer();

};

module.exports = function(configs) {

  return {
    content: function(tag, courseid) {
      var _url = '/v1/www/content';
      var options = url.parse(configs.server + _url);
      options.headers = _header;
      http.get(options, function(res) {

      });

    },
    link: function(tag) {

    },
    token: function(token) {
      if (typeof token == 'string') {
        _header['X-Auth-Token'] = token;
        _token = token;
      }
      return _token;
    },
    signup: function(data) {},
    search: function(keywords) {

    },

    feedback: function() {

    }

  };


};