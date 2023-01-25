'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const utils = {};

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