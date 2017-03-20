'use strict';

var timekit = require('../src/timekit.js');
var utils = require('./helpers/utils');
var base64 = require('base-64');

var fixtures = {
  app:              'demo',
  app2:             'demo2',
  apiBaseUrl:       'http://api-localhost.timekit.io/',
  inputTimestampFormat: 'Y-m-d H:i',
  userEmail:        'timebirdcph@gmail.com',
  userApiToken:     'password',
  userEmailTemp:    'timebirdcph2@gmail.com',
  userApiTokenTemp: 'password2',
  convertResponseToCamelcase: true,
  createApp: {
    name:         'TestApplication',
    settings: {
      contactName: 'John Doe',
      contactEmail: 'john@doe.com'
    }
  },
  autoFlattenResponse: true
}

/**
 * Intilialise the library
 */
describe('Configuration', function() {

  beforeEach(function() {
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

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
        done();
      });
    });

  });

  it('should be able to make a request and convert POST data to snake_case', function(done) {
    var response, request;

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
        done();
      });
    });

  });

  it('should support setting headers for next request only (fluent)', function(done) {
    var response, request;

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    timekit.setUser(fixtures.userEmail, fixtures.userApiToken);

    timekit
    .headers({
      MyTestHeader: 'test',
      MyTestHeader2: 'test2'
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

      utils.tick(function () {
        // Check for headers set
        expect(response.config.headers.MyTestHeader).toBe('test');
        expect(request.requestHeaders.MyTestHeader).toBe('test');
        expect(response.config.headers.MyTestHeader2).toBe('test2');
        expect(request.requestHeaders.MyTestHeader2).toBe('test2');
        done();
      });
    });

  });

  it('should support setting user for next request only (fluent)', function(done) {
    var response, request;

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    timekit.setUser(fixtures.userEmail, fixtures.userApiToken);

    timekit
    .asUser(fixtures.userEmailTemp, fixtures.userApiTokenTemp)
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

      utils.tick(function () {

        // Check that the temp user is set as auth header
        var userAuthHeaderTemp = 'Basic ' + base64.encode(fixtures.userEmailTemp + ':' + fixtures.userApiTokenTemp);
        expect(response.config.headers['Authorization']).toBe(userAuthHeaderTemp);
        expect(request.requestHeaders['Authorization']).toBe(userAuthHeaderTemp);

        var newUser = timekit.getUser();
        expect(newUser.email).toEqual(fixtures.userEmail);
        expect(newUser.apiToken).toEqual(fixtures.userApiToken);

        timekit
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

          utils.tick(function () {

            // Check that the temp user is not set as auth header
            var userAuthHeader = 'Basic ' + base64.encode(fixtures.userEmail + ':' + fixtures.userApiToken);
            expect(response.config.headers['Authorization']).toBe(userAuthHeader);
            expect(request.requestHeaders['Authorization']).toBe(userAuthHeader);

            done();
          })
        });
      });
    });

  });

  it('should support setting app for next request only (fluent)', function(done) {
    var response, request;

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    timekit.setUser(fixtures.userEmail, fixtures.userApiToken);

    timekit
    .asApp(fixtures.app2)
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

      utils.tick(function () {

        // Check that the temp app is set as auth header
        expect(response.config.headers['Timekit-App']).toBe(fixtures.app2);
        expect(request.requestHeaders['Timekit-App']).toBe(fixtures.app2);

        // Make sure that the old configued app slug is still set
        var config = timekit.getConfig();
        expect(config.app).toEqual(fixtures.app);

        timekit
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

          utils.tick(function () {

            // Check that the temp user is not set as auth header
            expect(response.config.headers['Timekit-App']).toBe(fixtures.app);
            expect(request.requestHeaders['Timekit-App']).toBe(fixtures.app);

            done();
          })
        });
      });
    });

  });

  it('should be able to flatten response data and maintain metaData', function(done) {
    var response, request;

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl,
      autoFlattenResponse: fixtures.autoFlattenResponse
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
        responseText: '{ "data": { "slug": "testapplication", "contact_email": "2312312312@timekit.io", "contact_name": "John Doe", "id": "k3FXhXOAvF0BcT2cpSbQUhp5kHZmHoEe", "settings": { "name": "TestApplication" } }, "other_meta_key": "other_meta_value" }'
      });

      utils.tick(function () {
        // Response
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(typeof response.data.slug).toBe('string');
        expect(response.metaData).toBeDefined();
        expect(response.metaData.other_meta_key).toBe('other_meta_value');
        done();
      });
    });

  });

});
