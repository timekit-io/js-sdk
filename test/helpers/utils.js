'use strict';

var utils = {};

utils.randomNumberGenerator = function() {
    return Math.floor((Math.random() * 100000) + 1);
};

utils.emailGenerator = function() {
    return utils.randomNumberGenerator() + '@timekit.io';
};

module.exports = utils;
