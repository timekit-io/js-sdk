'use strict';

var moment = require('moment');
var timekit = require('../src/timekit.js');
var utils = require('./helpers/utils');

var fixtures = {
  app:            'demo',
  apiBaseUrl:     'http://api-localhost.timekit.io/',
  calendarToken:  '1e396a70-1919-11e5-a165-080027c7e7dd',
  userEmail:      'timebirdcph@gmail.com',
  userInvalidEmail: 'invaliduser@gmail.com',
  userPassword:   'password',
  userApiToken:   'password',
  findTimeEmail1: 'timebirdcph@gmail.com',
  findTimeEmail2: 'timebirdnyc@gmail.com',
  findTimeFuture: '3 days',
  findTimeLength: '30 minutes',
  eventsStart:    moment().format(),
  eventsEnd:      moment().add(3,'weeks').format(),
  availabilityEmail: 'timebirdnyc@gmail.com',
  meetingToken:   '7zdMNR48cJTjIRhz',
  newMeeting: {
    what:         'test title',
    where:        'test location',
    suggestions: [
      {
        start:    '2015-09-22T14:30:00.000Z',
        end:      '2015-09-22T16:00:00.000Z'
      },
      {
        start:    '2015-09-23T09:15:00.000Z',
        end:      '2015-09-23T09:45:00.000Z'
      }
    ]
  },
  updateMeetingData: {
    what:         'new test title',
    where:        'new test location'
  },
  meetingAvailability: {
    suggestionId: '1',
    available:    true
  },
  inviteToMeetingEmails: [
    'some_test_user@timekit.io',
    'some_other_test_user@timekit.io'
  ],
  newUser: {
    firstName:    'John',
    lastName:     'Doe',
    email:        utils.emailGenerator(),
    password:     'password',
    timezone:     'Europe/Copenhagen'
  },
  updateUser: {
    first_name:   'Jane',
    timezone:     'Europe/Berlin'
  },
  getUserPropertyKey: 'timebirdcphgmailcom-google-next-sync-token',
  setUserProperties: {
    testKey1:      'testValue1',
    testKey2:      'testValue2'
  }
}

/**
 * Call API endpoints that doesnt require auth headers
 */
describe('API endpoints without auth', function() {

  beforeEach(function() {
    jasmine.Ajax.install();
    timekit.configure({
      app: fixtures.app,
      apiBaseUrl: fixtures.apiBaseUrl
    });

  });

  afterEach(function () {
    jasmine.Ajax.uninstall();
  });

  it('should be able to authenticate by calling [GET] /auth', function(done) {
    var response, request;

    timekit.auth(fixtures.userEmail, fixtures.userPassword)
    .then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "img": "http:\/\/www.gravatar.com\/avatar\/35b00087ea20066e5da95f8359183f04", "activated": true, "timezone": "America\/Los_Angeles", "token": "TWXVID51gpqKcLVMQauomHqIrw92acw8", "last_sync": null, "api_token": "nvHfRSlhvsnlg4rS7Wt28Ty47qdgegwSu3YK7hPW" } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.data.data.email).toBeDefined();
        expect(typeof response.data.data.email).toBe('string');
        expect(response.data.data.api_token).toBeDefined();
        expect(typeof response.data.data.api_token).toBe('string');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to fail authentication with wrong credentials by calling [GET] /auth', function(done) {
    var response, request;

    timekit.auth(fixtures.userInvalidEmail, fixtures.userPassword)
    .catch(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 401,
        statusText: 'Unauthorized',
        responseText: {error:{message: "Email and password does not match any user"}},
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(typeof response.data.error.message).toBe('string');
        expect(response.status).toBe(401);
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [GET] /accounts/google/signup endpoint', function() {

    var result = timekit.accountGoogleSignup();

    // should match a valid HTTP(S) url
    expect(result).toMatch(/^((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)?([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*/gmi);

  });

});

/**
 * Call API endpoints that requires auth headers
 */
describe('API endpoints with auth', function() {

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

  it('should be able to call [POST] /findtime endpoint', function(done) {
    var response, request;
    timekit.findTime(
      [fixtures.findTimeEmail1, fixtures.findTimeEmail2],
      fixtures.findTimeFuture,
      fixtures.findTimeLength
    ).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": [ { "start": "2015-03-24 15:00:00", "end": "2015-03-24 16:00:00" }, { "start": "2015-03-24 21:45:00", "end": "2015-03-24 22:45:00" }, { "start": "2015-03-25 07:30:00", "end": "2015-03-25 08:30:00" }, { "start": "2015-03-25 16:30:00", "end": "2015-03-25 17:30:00" }, { "start": "2015-03-25 18:15:00", "end": "2015-03-25 19:15:00" } ] }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.data).toBeDefined();
        expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [GET] /accounts endpoint', function(done) {
    var request, response;

    timekit.getAccounts().then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": [ { "provider": "google", "provider_id": "timebirdcph@gmail.com", "last_sync": "2015-03-17 15:51:43" }, { "provider": "google", "provider_id": "timebirdnyc@gmail.com", "last_sync": "2015-03-17 15:51:43" } ] }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.data).toBeDefined();
        expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
        done();
      }, 0);
    }, 0);


  });

  // it('should be able to call [GET] /accounts/google/calendars endpoint', function(done) {

  //   timekit.getAccountGoogleCalendars().then(function(response) {
  //     expect(response.data).toBeDefined();
  //     expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
  //     done();
  //   });

  // });

  // it('should be able to call [GET] /accounts/sync endpoint', function(done) {

  //   timekit.accountSync().then(function(response) {
  //     expect(response.data).toBeDefined();
  //     expect(typeof response.data.count).toBe('number');
  //     done();
  //   });

  // });

  it('should be able to call [GET] /calendars', function(done) {
    var request, response;
    timekit.getCalendars().then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": [ { "name": "MyCalendar", "token": "2e911aa8-05b4-11e5-af06-000000007ed6", "description": "Laboriosam vitae minus", "system": false, "foregroundcolor": "#938710", "backgroundcolor": "#518d83" }, { "name": "Work", "token": "3e614av8-05g4-11e5-af06-000205005eg6", "description": "Consequatur doloribus", "system": false, "foregroundcolor": "#ed2ba6", "backgroundcolor": "#9b502a" } ] }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [GET] /calendar/:token', function(done) {
    var request, response;

    timekit.getCalendar(fixtures.calendarToken).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "name": "MyCalendar", "description": "Laboriosam vitae", "token": "2e921aa8-05b4-15e5-af06-000000007ed6", "system": false, "foregroundcolor": "#938710", "backgroundcolor": "#518d83" } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.name).toBe('string');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [GET] /contacts', function(done) {
    var request, response;

    timekit.getContacts().then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": [ { "name": "Timebird Copenhagen", "email": "timebirdcph@gmail.com", "isUser": true, "users": { "token": "zeokguHPBwiEydJEvhwh5Wvk7J74QhQBXvsM5NGX", "first_name": "Timebird", "last_name": "Copenhagen", "name": "Timebird Copenhagen", "email": "timebirdcph@gmail.com", "image": "http:\/\/lorempixel.com\/250\/250\/", "timezone": "Europe\/Copenhagen" } }, { "name": "Peter Jensen", "email": "peter-jensen@timekit.io", "isUser": true } ] }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [GET] /events', function(done) {
    var request, response;

    timekit.getEvents(
      fixtures.eventsStart,
      fixtures.eventsEnd
    ).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": [ { "id": 1, "what": "Ut voluptatum distinctio hic et est consequuntur fugiat.", "where": "Sunt fugiat reprehenderit delectus quo odit saepe ipsam.", "rsvp": "tentative", "allDay": false, "start": "2015-04-19T08:00:00+00:00", "end": "2015-04-19T13:00:00+00:00" }, { "id": 2, "what": "Et molestiae numquam aut facilis beatae.", "where": "Debitis rerum qui accusamus minima accusamus.", "rsvp": "tentative", "allDay": false, "start": "2015-03-25T21:00:00+00:00", "end": "2015-03-25T23:00:00+00:00" }, { "id": 3, "what": "Et vitae occaecati expedita sit consequuntur aliquam in.", "where": "Sequi ratione sunt dignissimos quis id.", "rsvp": "accepted", "allDay": false, "start": "2015-04-03T09:00:00+00:00", "end": "2015-04-03T11:30:00+00:00" }, { "id": 4, "what": "Voluptatibus iure est dolores optio alias.", "where": "Dolor et odio cum totam numquam incidunt.", "rsvp": "declined", "allDay": false, "start": "2015-04-20T21:00:00+00:00", "end": "2015-04-20T23:00:00+00:00" } ] }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [GET] /events/availability', function(done) {
    var request, response;

    timekit.getAvailability(
      fixtures.eventsStart,
      fixtures.eventsEnd,
      fixtures.availabilityEmail
    ).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": [ { "what": "Peter is busy!", "where": "Undisclosed", "start": "2015-04-04T09:00:00+00:00", "end": "2015-04-04T10:00:00+00:00", "allDay": false }, { "what": "Peter is busy!", "where": "Undisclosed", "start": "2015-03-28T16:00:00+00:00", "end": "2015-03-28T17:00:00+00:00", "allDay": false }, { "what": "Peter is busy!", "where": "Undisclosed", "start": "2015-04-06T16:00:00+00:00", "end": "2015-04-06T20:30:00+00:00", "allDay": false }, { "what": "Peter is busy!", "where": "Undisclosed", "start": "2015-03-30T22:00:00+00:00", "end": "2015-03-30T23:30:00+00:00", "allDay": false } ] }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [GET] /meetings', function(done) {
    var request, response;

    timekit.getMeetings().then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": [ { "id": 13, "what": "nemo", "where": "679 Harvey Spring Suite 784\ Sipesberg, LA 17622-1093", "token": "quqVQTOdyfA1t66K", "completed": false, "status_text": "COMPLETED", "status_code": 100, "start": null, "end": null }, { "id": 15, "what": "enim", "where": "081 Osinski Crescent Suite 774\ New Delfinachester, PW 03356", "token": "7kXN0aC9uCJYMi0P", "completed": false, "status_text": "COMPLETED", "status_code": 100, "start": null, "end": null }, { "id": 17, "what": "consequatur", "where": "690 Elouise Crossroad Suite 711\ Kuhlmanland, AZ 08572-8003", "token": "7B0k9nqyVFaAhu7Q", "completed": false, "status_text": "COMPLETED", "status_code": 100, "start": null, "end": null }, { "id": 22, "what": "Important business meeting", "where": "168 Aylin Divide Suite 336\ Tatumport, VT 75243", "token": "kFadq3XctXgyamuj", "completed": false, "status_text": "SCHEDULED", "status_code": 200, "start": "2015-03-24 10:30:00", "end": "2015-03-24 14:30:00" } ] }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [GET] /meetings/:token', function(done) {
    var request, response;
    timekit.getMeeting(fixtures.meetingToken).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "id": 1, "what": "molestiae", "where": "7173 McClure Manors Apt. 807\ Gulgowskitown, HI 02306-4030", "token": "A2hYcGJAppb2LreJ", "completed": true, "status_text": "COMPLETED", "status_code": 100, "start": "2015-03-24 10:30:00", "end": "2015-03-24 13:30:00" } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.what).toBe('string');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [POST] /meetings', function(done) {

    timekit.createMeeting(
      fixtures.newMeeting.what,
      fixtures.newMeeting.where,
      fixtures.newMeeting.suggestions
    ).then(function(response) {
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(typeof response.data.data.what).toBe('string');
      done();
    });

  });

  it('should be able to call [PUT] /meetings/:token', function(done) {

    timekit.updateMeeting(
      fixtures.meetingToken,
      fixtures.updateMeetingData
    ).then(function(response) {
      expect(response.status).toBe(204);
      done();
    });

  });

  it('should be able to call [POST] /meetings/availability', function(done) {

    timekit.setMeetingAvailability(
      fixtures.meetingAvailability.suggestionId,
      fixtures.meetingAvailability.available
    ).then(function(response) {
      expect(response.status).toBe(204);
      done();
    });

  });

  // it('should be able to call [POST] /meetings/book', function(done) {

  //   timekit.createMeeting(
  //     fixtures.newMeeting.what,
  //     fixtures.newMeeting.where,
  //     fixtures.newMeeting.suggestions
  //   ).then(function(response) {
  //     var suggestionId = response.data.data.suggestions[0].id;
  //     return timekit.bookMeeting(
  //       suggestionId
  //     )
  //   }).then(function(response) {
  //     expect(response.status).toBe(204);
  //     done();
  //   });;

  // });

  // it('should be able to call [POST] /meetings/:token/invite', function(done) {

  //   timekit.inviteToMeeting(
  //     fixtures.meetingToken,
  //     fixtures.inviteToMeetingEmails
  //   ).then(function(response) {
  //     expect(response.status).toBe(204);
  //     done();
  //   });

  // });

  it('should be able to call [POST] /users', function(done) {

    timekit.createUser(
      fixtures.newUser.firstName,
      fixtures.newUser.lastName,
      fixtures.newUser.email,
      fixtures.newUser.password,
      fixtures.newUser.timezone
    ).then(function(response) {
      expect(response.status).toBe(201);
      expect(response.data).toBeDefined();
      expect(typeof response.data.data.email).toBe('string');
      done();
    });

  });

  it('should be able to call [GET] /users/me', function(done) {

    timekit.getUserInfo().then(function(response) {
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(typeof response.data.data.email).toBe('string');
      done();
    });

  });

  it('should be able to call [PUT] /users/me', function(done) {

    timekit.updateUser({
      first_name: fixtures.updateUser.firstName,
      timezone: fixtures.updateUser.timezone,
    }).then(function(response) {
      expect(response.status).toBe(204);
      done();
    });

  });

  it('should be able to call [GET] /properties', function(done) {

    timekit.getUserProperties().then(function(response) {
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(Object.prototype.toString.call(response.data.data)).toBe('[object Array]');
      done();
    });

  });

  it('should be able to call [GET] /properties/:key', function(done) {

    timekit.getUserProperty(fixtures.getUserPropertyKey).then(function(response) {
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(typeof response.data.data.value).toBe('string');
      done();
    });

  });

  it('should be able to call [PUT] /properties', function(done) {

    timekit.setUserProperties(fixtures.setUserProperties).then(function(response) {
      expect(response.status).toBe(204);
      done();
    });

  });

});
