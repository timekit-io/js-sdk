'use strict';

var timekit = require('../../src/timekit.js');

console.log('timekit.js loaded!');

timekit.configure({
  app: 'demo',
  inputTimestampFormat: 'l h:i a Y-m-d'
});

timekit.auth('doc.brown@timekit.io', 'DeLorean').then(function(response) {
  console.log('user authenticated!');
  console.log(response);
}).catch(function(response) {
  console.log('an error occured!');
  console.log(response);
});
