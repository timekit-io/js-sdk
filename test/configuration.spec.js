'use strict';

var timekit = require('../src/timekit.js');
var utils = require('./helpers/utils');

var fixtures = {
  app:            'demo',
  apiBaseUrl:     'http://api-localhost.timekit.io/',
  inputTimestampFormat: 'Y-m-d H:i',
  userEmail:      'timebirdcph@gmail.com',
  userApiToken:   'password',
  convertResponseToCamelcase: true,
  createApp: {
    name:         'TestApplication',
    settings: {
      contactName: 'John Doe',
      contactEmail: 'john@doe.com'
    }
  }
}

/**
 * Intilialise the library
 */
describe('Configuration', function() {

  it('should be able initialize the library', function() {

    expect(typeof timekit).toEqual('object');
    expect(typeof timekit.auth).toEqual('function');

  });

  it('should be configurable, set app', function() {

    timekit.configure({
      app: fixtures.app
    });

    var newConfig = timekit.getConfig();
    expect(newConfig.app).toEqual(fixtures.app);

  });

  it('should be configurable, set input timestamp format', function() {

    timekit.configure({
      inputTimestampFormat: fixtures.inputTimestampFormat
    });

    var newConfig = timekit.getConfig();
    expect(newConfig.inputTimestampFormat).toEqual(fixtures.inputTimestampFormat);

  });

  it('should be able to set user manually', function() {

    timekit.setUser(
      fixtures.userEmail,
      fixtures.userApiToken
    );

    var newUser = timekit.getUser();
    expect(newUser.email).toEqual(fixtures.userEmail);
    expect(newUser.apiToken).toEqual(fixtures.userApiToken);

  });

  it('should be configurable, set convertResponseToCamelcase to true', function() {

    timekit.configure({
      convertResponseToCamelcase: fixtures.convertResponseToCamelcase
    });

    var newConfig = timekit.getConfig();
    expect(newConfig.convertResponseToCamelcase).toEqual(fixtures.convertResponseToCamelcase);

  });

  it('should be able to convert response data to camelCase', function(done) {
    var response, request;

    jasmine.Ajax.install();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl,
      convertResponseToCamelcase: fixtures.convertResponseToCamelcase
    });

    timekit.setUser(fixtures.userEmail, fixtures.userApiToken);

    timekit.getApps()
    .then(function(res) {
      response = res;
    });

    utils.tick(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 201,
        responseText: '{ "data": { "slug": "testapplication", "contact_email": "2312312312@timekit.io", "contact_name": "John Doe", "id": "k3FXhXOAvF0BcT2cpSbQUhp5kHZmHoEe", "settings": { "name": "TestApplication" } } }'
      });

      utils.tick(function () {
        // Response
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(typeof response.data.slug).toBe('string');
        // camelCase conversion
        expect(response.data.contactEmail).toBeDefined();
        expect(response.data.contact_email).toBeUndefined();
        jasmine.Ajax.uninstall();
        done();
      });
    });

  });

  it('should be able to make a request and convert POST data to snake_case', function(done) {
    var response, request;

    jasmine.Ajax.install();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    timekit.setUser(fixtures.userEmail, fixtures.userApiToken);

    timekit.createApp({
      name: fixtures.createApp.name,
      settings: {
        contactName: fixtures.createApp.settings.contactName,
        contactEmail: fixtures.createApp.settings.contactEmail
      }
    }).then(function(res) {
      response = res;
    });

    utils.tick(function () {
      request = jasmine.Ajax.requests.mostRecent();

      expect(request.data()).toEqual({
        name: fixtures.createApp.name,
        settings: {
          contact_name: fixtures.createApp.settings.contactName,
          contact_email: fixtures.createApp.settings.contactEmail
        }
      });

      request.respondWith({
        status: 201,
        responseText: '{ "data": { "slug": "testapplication", "contact_email": "2312312312@timekit.io", "contact_name": "John Doe", "id": "k3FXhXOAvF0BcT2cpSbQUhp5kHZmHoEe", "settings": { "name": "TestApplication" } } }'
      });

      utils.tick(function () {
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(typeof response.data.slug).toBe('string');
        jasmine.Ajax.uninstall();
        done();
      });
    });

  });

 fit('should support setting headers for next request only (fluent)', function(done) {
    var response, request;

    jasmine.Ajax.install();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    timekit.setUser(fixtures.userEmail, fixtures.userApiToken);

    timekit
    .headers({
      MyTestHeader: 'test'
    })
    .getUserInfo()
    .then(function(res) {
      response = res;
    });

    utils.tick(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "image": "http:\/\/www.gravatar.com\/avatar\/7a613e5348d6347627693502580f5aad", "activated": true, "timezone": "America\/Los_Angeles", "token": "UZpl3v3PTP1PRwqIrU0DSVpbJkNKl5gN", "last_sync": null, "token_generated_at": null } }'
      });

      console.log(request);

      utils.tick(function () {
        // Check for headers set
        expect(response.config.headers.MyTestHeader).toBe('test');
        expect(request.requestHeaders.MyTestHeader).toBe('test');
        done();
      });
    });

  });

});
