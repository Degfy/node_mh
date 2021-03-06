// client.js
// 用于从服务器上获取内容
// 
var _header = {
  'Accept': 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  'If-Modified-Since': '0',
  'Cache-Control': 'no-cache'
};
var $q = require('q');

function res_deal(res) {
  var deffered = $q.defer();
  // console.log(typeof res);
  res = JSON.parse(res);
  // console.log(res);

  if (res.error_code == 0) {
    res.data = res.data || {};
    deffered.resolve(res.data);
  } else {
    deffered.reject(res);
  }
  return deffered.promise;
}


module.exports = function(url) {
  var http_factory = require('./$http.js'),
    $http = http_factory({
      url: url,
      headers: _header
    });

  return {
    /**
     * [content description]
     * @param  {[type]} tag      [description]
     * @param  {[type]} courseid [description]
     * @return {[type]}          [description]
     */
    content: function(tag, courseid) {
      var _url = '/v1/www/content',
        config = {};
      config.params = {
        tag: tag
      };
      if (courseid) {
        config.courseid = courseid;
      }
      return $http
        .get(_url, config)
        .then(res_deal);
    },

    /**
     * [link description]
     * @param  {[type]} tag [description]
     * @return {[type]}     [description]
     */
    link: function(tag) {
      var _url = '/v1/www/link';
      return $http
        .get(_url + '?tag=' + tag)
        .then(res_deal);
    },

    /**
     * [search description]
     * @param  {[type]} keywords [description]
     * @return {[type]}          [description]
     */
    search: function(keywords) {

    },


    signup: function(data) {},



    feedback: function() {

    },

    set_token: function(token) {
      if (typeof token == 'string') {
        _header['X-Auth-Token'] = token;
        $http = http_factory({
          url: configs.server,
          headers: _header
        });
      }
    }
  };
};