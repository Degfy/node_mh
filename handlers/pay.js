var configs = require('../config.js'),
  pay = require('express')();


pay.get('/', function(req, res) {
  res.send('支付页面');
});

module.exports = pay;