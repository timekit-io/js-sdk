'use strict';

var timekit = require('../src/timekit');

/**
 * Intilialise the library
 */
describe('Library initialisation', function() {

  beforeEach(function() {

    timekit.configure({
      app: 'timebird',
      apiBaseUrl: 'http://api-localhost.timekit.io/'
    });

  });

  it('should be able initialize the library', function() {

    expect(typeof timekit).toEqual('object');
    expect(typeof timekit.auth).toEqual('function');

  });

  it('should be configurable', function() {

    var config = {
      inputTimestampFormat: 'Y-m-d H:i'
    };
    timekit.configure(config);

    var newConfig = timekit.getConfig();
    expect(newConfig.inputTimestampFormat).toEqual('Y-m-d H:i');

  });

});
