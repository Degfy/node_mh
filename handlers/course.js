var configs = require('../config.js'),
  course = require('express')();

course.get('/', function(req, res) {
  res.send('课程页面');
});

module.exports = course;