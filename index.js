'use strict';

var minimist = require('minimist'),

  //命令行参数获取
  options = minimist(process.argv.slice(2), {
    string: ['protocol', 'host', 'port'],
    default: {
      protocol: 'http',
      host: 'student.meihao.dev',
      port: '9900'
    }
  });


  console.log(options);