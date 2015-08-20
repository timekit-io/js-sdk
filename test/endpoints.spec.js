'use strict';

var moment = require('moment');
var timekit = require('../src/timekit.js');
var utils = require('./helpers/utils');

var fixtures = {
  app:            'demo',
  apiBaseUrl:     'http://api-localhost.timekit.io/',
  calendarId:  '1e396a70-1919-11e5-a165-080027c7e7dd',
  userEmail:      'timebirdcph@gmail.com',
  userInvalidEmail: 'invaliduser@gmail.com',
  userPassword:   'password',
  userApiToken:   'password',
  findTime: {
    emails: ['timebirdcph@gmail.com', 'timebirdnyc@gmail.com'],
    filters: {
      'or': [
        { 'specific_day': {'day': 'Monday'} },
        { 'specific_day_and_time': {'day': 'Wednesday', 'start': 10, 'end': 12, 'timezone': 'Europe/Copenhagen'} }
      ],
      'and': [
        { 'business_hours': {'timezone': 'America/Los_angeles'} }
      ]
    },
    future: '3 days',
    lengthVar: '30 minutes',
    sort: 'asc'
  },
  eventsStart:    moment().format(),
  eventsEnd:      moment().add(3,'weeks').format(),
  availabilityEmail: 'timebirdnyc@gmail.com',
  meetingId:   '7zdMNR48cJTjIRhz',
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
    testKey1:     'testValue1',
    testKey2:     'testValue2'
  },
  createApp: {
    name:         'TestApplication',
    settings: {
      contact_name: 'John Doe',
      contact_email: utils.emailGenerator()
    }
  },
  getAppSlug:    'zvwrOk1Up58DwU0ue8q99VM0HnN22sQc',
  updateAppSlug: 'zvwrOk1Up58DwU0ue8q99VM0HnN22sQc',
  updateAppSettings: {
    callback:     'http://timekit.io'
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
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "img": "http:\/\/www.gravatar.com\/avatar\/35b00087ea20066e5da95f8359183f04", "activated": true, "timezone": "America\/Los_Angeles", "id": "TWXVID51gpqKcLVMQauomHqIrw92acw8", "last_sync": null, "api_token": "nvHfRSlhvsnlg4rS7Wt28Ty47qdgegwSu3YK7hPW" } }',
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
      fixtures.findTime.emails,
      fixtures.findTime.filters,
      fixtures.findTime.future,
      fixtures.findTime.lengthVar,
      fixtures.findTime.sort
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
        responseText: '{ "data": [ { "name": "MyCalendar", "id": "2e911aa8-05b4-11e5-af06-000000007ed6", "description": "Laboriosam vitae minus", "system": false, "foregroundcolor": "#938710", "backgroundcolor": "#518d83" }, { "name": "Work", "id": "3e614av8-05g4-11e5-af06-000205005eg6", "description": "Consequatur doloribus", "system": false, "foregroundcolor": "#ed2ba6", "backgroundcolor": "#9b502a" } ] }',
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

  it('should be able to call [GET] /calendar/:id', function(done) {
    var request, response;

    timekit.getCalendar(fixtures.calendarId).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "name": "MyCalendar", "description": "Laboriosam vitae", "id": "2e921aa8-05b4-15e5-af06-000000007ed6", "system": false, "foregroundcolor": "#938710", "backgroundcolor": "#518d83" } }',
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
        responseText: '{ "data": [ { "name": "Timebird Copenhagen", "email": "timebirdcph@gmail.com", "isUser": true, "users": { "id": "zeokguHPBwiEydJEvhwh5Wvk7J74QhQBXvsM5NGX", "first_name": "Timebird", "last_name": "Copenhagen", "name": "Timebird Copenhagen", "email": "timebirdcph@gmail.com", "image": "http:\/\/lorempixel.com\/250\/250\/", "timezone": "Europe\/Copenhagen" } }, { "name": "Peter Jensen", "email": "peter-jensen@timekit.io", "isUser": true } ] }',
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
        responseText: '{ "data": [ { "id": 13, "what": "nemo", "where": "679 Harvey Spring Suite 784\ Sipesberg, LA 17622-1093", "id": "quqVQTOdyfA1t66K", "completed": false, "status_text": "COMPLETED", "status_code": 100, "start": null, "end": null }, { "id": 15, "what": "enim", "where": "081 Osinski Crescent Suite 774\ New Delfinachester, PW 03356", "id": "7kXN0aC9uCJYMi0P", "completed": false, "status_text": "COMPLETED", "status_code": 100, "start": null, "end": null }, { "id": 17, "what": "consequatur", "where": "690 Elouise Crossroad Suite 711\ Kuhlmanland, AZ 08572-8003", "id": "7B0k9nqyVFaAhu7Q", "completed": false, "status_text": "COMPLETED", "status_code": 100, "start": null, "end": null }, { "id": 22, "what": "Important business meeting", "where": "168 Aylin Divide Suite 336\ Tatumport, VT 75243", "id": "kFadq3XctXgyamuj", "completed": false, "status_text": "SCHEDULED", "status_code": 200, "start": "2015-03-24 10:30:00", "end": "2015-03-24 14:30:00" } ] }',
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

  it('should be able to call [GET] /meetings/:id', function(done) {
    var request, response;

    timekit.getMeeting(fixtures.meetingId).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "id": 1, "what": "molestiae", "where": "7173 McClure Manors Apt. 807\ Gulgowskitown, HI 02306-4030", "id": "A2hYcGJAppb2LreJ", "completed": true, "status_text": "COMPLETED", "status_code": 100, "start": "2015-03-24 10:30:00", "end": "2015-03-24 13:30:00" } }',
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
    var request, response;

    timekit.createMeeting(
      fixtures.newMeeting.what,
      fixtures.newMeeting.where,
      fixtures.newMeeting.suggestions
    ).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 201,
        statusText: 'OK',
        responseText: '{ "data": { "id": 1, "what": "Travel back to the future", "where": "Hill Valley Clock Tower", "id": "PuicNx37V2pY", "completed": false, "status_text": "PENDING", "status_code": 300, "start": null, "end": null } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.what).toBe('string');
        done();
      }, 0);
    }, 0);


  });

  it('should be able to call [PUT] /meetings/:id', function(done) {
    var request, response;
    timekit.updateMeeting(
      fixtures.meetingId,
      fixtures.updateMeetingData
    ).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 204,
        statusText: 'No Content',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(204);
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [POST] /meetings/availability', function(done) {
    var request, response;

    timekit.setMeetingAvailability(
      fixtures.meetingAvailability.suggestionId,
      fixtures.meetingAvailability.available
    ).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 204,
        statusText: 'No Content',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(204);
        done();
      }, 0);
    }, 0);

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

  // it('should be able to call [POST] /meetings/:id/invite', function(done) {

  //   timekit.inviteToMeeting(
  //     fixtures.meetingId,
  //     fixtures.inviteToMeetingEmails
  //   ).then(function(response) {
  //     expect(response.status).toBe(204);
  //     done();
  //   });

  // });

  it('should be able to call [POST] /users', function(done) {
    var request, response;

    timekit.createUser(
      fixtures.newUser.firstName,
      fixtures.newUser.lastName,
      fixtures.newUser.email,
      fixtures.newUser.password,
      fixtures.newUser.timezone
    ).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 201,
        statusText: 'OK',
        responseText: '{ "data": { "first_name": "Peter", "last_name": "Hansen", "name": "Peter Hansen", "email": "ph@timekit.io", "image": "http://www.link-to-img.com/image.png", "activated": false, "timezone": "Europe/Copenhagen", "id": "msoP0NPkjb6ZSWPBXnBjVEvTKAhZ5sz4", "last_sync": null, "api_token": "qp9kzAxarYBUqJVqj6uZADKwIL0jvWdXfQfxEKwv" } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.email).toBe('string');
        done();
      }, 0);
    }, 0);


  });

  it('should be able to call [GET] /users/me', function(done) {
    var response, request;

    timekit.getUserInfo().then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 201,
        statusText: 'OK',
        responseText: '{ "data": { "first_name": "Dr. Emmett", "last_name": "Brown", "name": "Dr. Emmett Brown", "email": "doc.brown@timekit.io", "image": "http:\/\/www.gravatar.com\/avatar\/7a613e5348d6347627693502580f5aad", "activated": true, "timezone": "America\/Los_Angeles", "id": "UZpl3v3PTP1PRwqIrU0DSVpbJkNKl5gN", "last_sync": null, "token_generated_at": null } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.email).toBe('string');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [PUT] /users/me', function(done) {
    var response, request;

    timekit.updateUser({
      first_name: fixtures.updateUser.firstName,
      timezone: fixtures.updateUser.timezone,
    }).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 204,
        statusText: 'No Content',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(204);
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [GET] /properties', function(done) {
    var response, request;

    timekit.getUserProperties().then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": [ { "key": "timebirdcphgmailcom-google-next-sync-token", "value": "CPCVytehvsQCEPCVytehvsQCGAU=", "created_at": "2015-03-24 10:31:13", "updated_at": "2015-03-24 10:33:29" }, { "key": "synced-contacts", "value": "1", "created_at": "2015-03-24 10:31:13", "updated_at": "2015-03-24 10:33:30" } ] }',
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

  it('should be able to call [GET] /properties/:key', function(done) {
    var response, request;

    timekit.getUserProperty(fixtures.getUserPropertyKey).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "key": "synced-contacts", "value": "1", "created_at": "2015-03-24 10:31:13", "updated_at": "2015-03-24 10:33:30" } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.value).toBe('string');
        done();
      }, 0);
    }, 0);
  });

  it('should be able to call [PUT] /properties', function(done) {
    var response, request;

    timekit.setUserProperties(fixtures.setUserProperties).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 204,
        statusText: 'No Content',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(204);
        done();
      }, 0);
    }, 0);

  });

it('should be able to call [POST] /apps', function(done) {
    var response, request;

    timekit.createApp(
      fixtures.createApp.name,
      fixtures.createApp.settings
    ).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 201,
        statusText: 'Created',
        responseText: '{ "data": { "slug": "testapplication", "contact_email": "2312312312@timekit.io", "contact_name": "John Doe", "id": "k3FXhXOAvF0BcT2cpSbQUhp5kHZmHoEe", "settings": { "name": "TestApplication" } } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(201);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.slug).toBe('string');
        done();
      }, 0);
    }, 0);

  });

  it('should be able to call [GET] /apps', function(done) {
    var response, request;

    timekit.getApps().then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": [ { "slug": "testapplication", "contact_email": "2312312312@timekit.io", "contact_name": "John Doe", "id": "k3FXhXOAvF0BcT2cpSbQUhp5kHZmHoEe", "settings": { "name": "TestApplication" } } ] }',
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

  it('should be able to call [GET] /apps/:slug', function(done) {
    var response, request;

    timekit.getApp(
      fixtures.getAppSlug
    ).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{ "data": { "slug": "testapplication", "contact_email": "2312312312@timekit.io", "contact_name": "John Doe", "id": "k3FXhXOAvF0BcT2cpSbQUhp5kHZmHoEe", "settings": { "name": "TestApplication" } } }',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        expect(typeof response.data.data.slug).toBe('string');
        done();
      }, 0);
    }, 0);

  });


  it('should be able to call [PUT] /apps/:slug', function(done) {
    var response, request;

    timekit.updateApp(
      fixtures.updateAppSlug,
      fixtures.updateAppSettings
    ).then(function(res) {
      response = res;
    });

    setTimeout(function () {
      request = jasmine.Ajax.requests.mostRecent();

      request.respondWith({
        status: 204,
        statusText: 'No Content',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setTimeout(function () {
        expect(response.status).toBe(204);
        done();
      }, 0);
    }, 0);

  });

});
