'use strict';

var utils = {};

utils.randomNumberGenerator = function() {
    return Math.floor((Math.random() * 100000) + 1);
};

utils.emailGenerator = function() {
    return utils.randomNumberGenerator() + '@timekit.io';
};

utils.tick = function(fn, timing) {
  if(!timing) { timing = 0; }
  setTimeout(fn,timing);
};

module.exports = utils;
