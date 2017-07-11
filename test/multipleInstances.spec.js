'use strict';

var timekit = require('../src/timekit.js');
var utils = require('./helpers/utils');
var base64 = require('base-64');

var fixtures = {
  app:              'demo',
  app2:             'demo2'
}

describe('Multiple instances', function() {

  beforeEach(function() {
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('should be able to create multiple isolated instances', function() {

    var instance1 = timekit.newInstance();
    var instance2 = timekit.newInstance();

    instance1.configure({
      app: fixtures.app
    });

    instance2.configure({
      app: fixtures.app2
    });

    var instance1App = instance1.getConfig().app;
    var instance2App = instance2.getConfig().app;

    expect(instance1App).not.toEqual(instance2App);

  });

});
