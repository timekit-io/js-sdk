'use strict';

var timekit = require('../../dist/timekit.min.js');

console.log('timekit.js loaded!');
console.log(timekit);

timekit.configure({
  app: 'myNewApp',
  inputTimestampFormat: 'l h:i a Y-m-d'
});
