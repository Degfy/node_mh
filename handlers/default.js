var configs = require('../config.js'),
  _default = require('express')();


_default.get('/', function(req, res) {
  res.send('默认页面');
});

module.exports = _default;