'use strict';

var timekit = require('../../dist/timekit.js');

console.log('timekit.js loaded!');

timekit.configure({
  app: 'timebird',
  inputTimestampFormat: 'l h:i a Y-m-d',
  apiBaseUrl:     'http://api-localhost.timekit.io/'
});
