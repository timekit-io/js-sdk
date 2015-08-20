'use strict';

var moment = require('moment');
var timekit = require('../src/timekit.js');
var utils = require('./helpers/utils');

var fixtures = {
  app:            'timebird',
  apiBaseUrl:     'http://api-localhost.timekit.io/',
  userEmail:      'timebirdcph@gmail.com',
  userApiToken:   'password',
  includesSingle: ['calendars.events'],
  includesMulti:  ['meetings','calendars.events']
}

/**
 * Call API endpoints that requires auth headers
 */
describe('API endpoints using dynamic includes', function() {

  beforeEach(function() {
    jasmine.Ajax.install();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

    timekit.setUser(fixtures.userEmail, fixtures.userApiToken);

  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it('should support requests with single dynamic include', function(done) {
    var response, request;

    timekit
    .include(fixtures.includesSingle[0])
    .getUserInfo()
    .then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "image": "http:\/\/www.gravatar.com\/avatar\/7a613e5348d6347627693502580f5aad", "activated": true, "timezone": "America\/Los_Angeles", "token": "UZpl3v3PTP1PRwqIrU0DSVpbJkNKl5gN", "last_sync": null, "token_generated_at": null } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        // Response data
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.email).toBe('string');
        // Dynamic include query params
        expect(response.config.params).toBeDefined();
        expect(response.config.params.include).toBe(fixtures.includesSingle.join());
        expect(request.url).toBe(fixtures.apiBaseUrl + 'v2/users/me?include=' + fixtures.includesSingle.join());
        done();
      }, 0);
    }, 0);

  });

  it('should support requests with multiple dynamic includes', function(done) {
    var response, request;

    timekit
    .include(fixtures.includesMulti[0],fixtures.includesMulti[1])
    .getUserInfo()
    .then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "image": "http:\/\/www.gravatar.com\/avatar\/7a613e5348d6347627693502580f5aad", "activated": true, "timezone": "America\/Los_Angeles", "token": "UZpl3v3PTP1PRwqIrU0DSVpbJkNKl5gN", "last_sync": null, "token_generated_at": null } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        // Response data
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.email).toBe('string');
        // Dynamic include query params
        expect(response.config.params).toBeDefined();
        expect(response.config.params.include).toBe(fixtures.includesMulti.join());
        expect(request.url).toBe(fixtures.apiBaseUrl + 'v2/users/me?include=' + fixtures.includesMulti.join());
        done();
      }, 0);
    }, 0);

  });

  it('should support resource-specific GET requests with dynamic includes', function(done) {
    var response, request;

    timekit
    .include(fixtures.includesMulti[0],fixtures.includesMulti[1])
    .getCalendar('123')
    .then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "image": "http:\/\/www.gravatar.com\/avatar\/7a613e5348d6347627693502580f5aad", "activated": true, "timezone": "America\/Los_Angeles", "token": "UZpl3v3PTP1PRwqIrU0DSVpbJkNKl5gN", "last_sync": null, "token_generated_at": null } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        // Response data
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.email).toBe('string');
        // Dynamic include query params
        expect(response.config.params).toBeDefined();
        expect(response.config.params.include).toBe(fixtures.includesMulti.join());
        expect(request.url).toBe(fixtures.apiBaseUrl + 'v2/calendars/123?include=' + fixtures.includesMulti.join());
        done();
      }, 0);
    }, 0);

  });

  it('should apply no dynamic includes if method is called without arguments', function(done) {
    var response, request;

    timekit
    .include()
    .getUserInfo()
    .then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "image": "http:\/\/www.gravatar.com\/avatar\/7a613e5348d6347627693502580f5aad", "activated": true, "timezone": "America\/Los_Angeles", "token": "UZpl3v3PTP1PRwqIrU0DSVpbJkNKl5gN", "last_sync": null, "token_generated_at": null } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        // Response data
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.email).toBe('string');
        // Dynamic include query params
        expect(response.config.params).toBeUndefined();
        expect(request.url).toBe(fixtures.apiBaseUrl + 'v2/users/me');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to run sequential requests with/without dynamic includes', function(done) {

    // First request

    var response, request;

    timekit
    .include(fixtures.includesMulti[0],fixtures.includesMulti[1])
    .getUserInfo()
    .then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "image": "http:\/\/www.gravatar.com\/avatar\/7a613e5348d6347627693502580f5aad", "activated": true, "timezone": "America\/Los_Angeles", "token": "UZpl3v3PTP1PRwqIrU0DSVpbJkNKl5gN", "last_sync": null, "token_generated_at": null } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        // Response data
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.email).toBe('string');
        // Dynamic include query params
        expect(response.config.params).toBeDefined();
        expect(response.config.params.include).toBe(fixtures.includesMulti.join());
        expect(request.url).toBe(fixtures.apiBaseUrl + 'v2/users/me?include=' + fixtures.includesMulti.join());
      }, 0);
    }, 0);

    // Second request

    setTimeout(function () {

      var response2, request2;

      timekit
      .getUserInfo()
      .then(function(res) {
        response2 = res;
      });

      setTimeout(function () {
        request2 = jasmine.Ajax.requests.mostRecent();

        request2.respondWith({
          status: 200,
          statusText: 'OK',
          responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "image": "http:\/\/www.gravatar.com\/avatar\/7a613e5348d6347627693502580f5aad", "activated": true, "timezone": "America\/Los_Angeles", "token": "UZpl3v3PTP1PRwqIrU0DSVpbJkNKl5gN", "last_sync": null, "token_generated_at": null } }',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setTimeout(function () {
          // Response2 data
          expect(response2.status).toBe(200);
          expect(response2.data).toBeDefined();
          expect(typeof response2.data.data.email).toBe('string');
          // Dynamic include query params
          expect(response2.config.params).toBeUndefined();
          expect(request2.url).toBe(fixtures.apiBaseUrl + 'v2/users/me');
        }, 0);
      }, 0);
    }, 10);

    // Third request

    setTimeout(function () {
      var response3, request3;

      timekit
      .include(fixtures.includesSingle[0])
      .getUserInfo()
      .then(function(res) {
        response3 = res;
      });

      setTimeout(function () {
        request3 = jasmine.Ajax.requests.mostRecent();

        request3.respondWith({
          status: 200,
          statusText: 'OK',
          responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "image": "http:\/\/www.gravatar.com\/avatar\/7a613e5348d6347627693502580f5aad", "activated": true, "timezone": "America\/Los_Angeles", "token": "UZpl3v3PTP1PRwqIrU0DSVpbJkNKl5gN", "last_sync": null, "token_generated_at": null } }',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setTimeout(function () {
          // Response3 data
          expect(response3.status).toBe(200);
          expect(response3.data).toBeDefined();
          expect(typeof response3.data.data.email).toBe('string');
          // Dynamic include query params
          expect(response3.config.params).toBeDefined();
          expect(response3.config.params.include).toBe(fixtures.includesSingle.join());
          expect(request3.url).toBe(fixtures.apiBaseUrl + 'v2/users/me?include=' + fixtures.includesSingle.join());
          done();
        }, 0);
      }, 0);
    }, 20);

  });

});
