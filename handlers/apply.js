var configs = require('../config.js'),
  apply = require('express')();


apply.get('/', function(req, res) {
  res.send('报名页面');
});

module.exports = apply;