// cache.js
// 缓存机制
var fs = require('fs'),
  crypto = require('crypto');



module.exports = function(configs) {
  var path_to_key = function(path) {
    var md5 = crypto.createHash('md5');
    md5.update(path);
    return md5.digest('hex');
  };

  var Cache = function(path, value, fn) {
    var thefile = configs.cache_path + '/' + path_to_key(path);
    if (value) {
      fs.writeFile(thefile, value, 'utf8', fn);
    } else {
      fs.readFile(thefile, 'utf8', fn);
    }
  };

  Cache.remove = function(path, fn) {
    var thefile = configs.cache_path + '/' + path_to_key(path);
    fs.unlink(thefile, fn);
  };

  /**
   * 中间件
   * @param  {object} req request
   * @param  {object} res response
   * @return {void}
   */
  Cache.middleWare = function(req, res, failed_call) {
    var thefile = configs.cache_path + '/' + path_to_key(req.path);
    fs.stat(thefile, function(err, stats) {
      if (!err && stats.isFile()) {
        res.sendFile(thefile, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8'
          }
        });
      } else if (typeof failed_call == 'function') {
        failed_call();
      }
    });
  };

  return Cache;
};