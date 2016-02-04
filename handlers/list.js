var configs = require('../config.js'),
  list = require('express')();

list.get('/', function(req, res) {
  res.send('列表页');
});

module.exports = list;