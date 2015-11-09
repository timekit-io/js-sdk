'use strict';

var timekit = require('../../src/timekit.js');

console.log('timekit sdk loaded!');

timekit.configure({
  app: 'demo',
  inputTimestampFormat: 'l h:i a Y-m-d'
});

timekit.auth({
  email: 'doc.brown@timekit.io',
  password: 'DeLorean'
}).then(function(response) {
  console.log('user authenticated!');
  console.log(response);
  return timekit.findTime({
    emails: ['doc.brown@timekit.io', 'marty.mcfly@timekit.io'],
    future: '3 days',
    duration: '30 minutes'
  });
}).then(function(response) {
  console.log('findtime executed!');
  console.log(response);
}).catch(function(response) {
  console.log('an error occured!');
  console.log(response);
});
