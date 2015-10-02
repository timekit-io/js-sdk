# Timekit JS SDK

[![Circle CI](https://img.shields.io/circleci/project/timekit-io/js-sdk.svg)](https://circleci.com/gh/timekit-io/js-sdk)
[![Code Coverage](https://img.shields.io/badge/coverage-92%25-green.svg)](https://github.com/timekit-io/js-sdk)

**Latest release:**  *v0.0.7*

Make API calls to Timekit with our easy-to-use JavaScript SDK. It supports all our endpoints as documented on [developers.timekit.io](http://developers.timekit.io).

Visit [timekit.io](http://timekit.io) to learn more and don't hesitate to contact Lasse Boisen Andersen ([la@timekit.io](mailto:la@timekit.io) or create an Issue) for questions. PR's are more than welcome!

Features:
- Returns ES-6/A+ style promises
- Works in both node.js and in the browser (>=IE8 and evergreen)
- Supports custom timestamp formats and timezones

## Dependencies

The following libraries are bundled together with the SDK:

- [axios](https://github.com/mzabriskie/axios) - a promise-based HTTP client for the browser (using [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)) and node.js (using [http](http://nodejs.org/api/http.html))
- [base64](https://github.com/mathiasbynens/base64) - a robust base64 encoder/decoder, used for basic auth headers

## Module loading

The SDK is UMD (Universal Module Definition) compatible, which means that it can be loaded in various module formats:
See `/examples` for implementation examples.

**AMD (with e.g. require.js)**
```javascript
requirejs(['timekit'], function(timekit) {
    console.log(timekit);
});
```

**CommonJS2 (in e.g. node.js)**
```javascript
var timekit = require('timekit');
console.log(timekit);

```
*Reference `/src` when using in node*

**As a global variable (in browsers)**
```javascript
<script src="timekit.js"></script>
<script>
    console.log(timekit);
</script>
```
*Reference plain or minified builds in `/dist` when using in browser*

## Usage (init)

```javascript
// Overwrites default config with supplied object, possible keys with default values below
timekit.configure({
    app:        'demo'                      // app name registered with timekit (get in touch)
    apiBaseUrl: 'https://api.timekit.io/',  // API endpoint (do not change)
    apiVersion: 'v2'                        // version of API to call (do not change)
    inputTimestampFormat:  'Y-m-d h:ia',    // default timestamp format that you supply
    outputTimestampFormat: 'Y-m-d h:ia',    // default timestamp format that you want the API to return
    timezone:   'Europe/Copenhagen',        // override user's timezone for custom formatted timestamps in another timezone
    convertResponseToCamelcase: true        // should keys in JSON response automatically be converted from snake_case to camelCase?
});

// Returns current config object
timekit.getConfig(); 

// Set the user to auth with (gets automatically set after timekit.auth())
timekit.setUser(
    email,      // [String] email of the user
    apiToken    // [String] access token retrieved from API
);

// Returns current user object
timekit.getUser(); 
```

## Usage (endpoints)

All the Timekit API endpoints are supported as methods. For endpoints taking parameters/data, the `data` argument should be an object with keys named as referenced in the docs - see: http://developers.timekit.io
If you supply the keys as camelCased, they wil automatically be converted to snake_case for you. Responses will also be converted to camelCase automatically, which however can be changed in the config.

```javascript
// Accounts endpoints
timekit.getAccounts();
timekit.accountGoogleSignup(data, shouldAutoRedirect:Boolean);
timekit.getAccountGoogleCalendars();
timekit.accountSync();

// Auth endpoints
timekit.auth(data);

// Apps endpoints
timekit.getApps();
timekit.getApp(data);
timekit.createApp(data);
timekit.updateApp(data);
timekit.deleteApp(data);

// Calendars endpoints
timekit.getCalendars();
timekit.getCalendar(data);
timekit.createCalendar(data);
timekit.deleteCalendar(data);

// Contacts endpoints
timekit.getContacts();

// Events endpoints
timekit.getEvents(data);
timekit.getEvent(data);
timekit.createEvent(data);
timekit.getAvailability(data);

// FindTime endpoints
timekit.findTime(data);
timekit.findTimeBulk(data);

// Meetings endpoints
timekit.getMeetings();
timekit.getMeeting(data);
timekit.createMeeting(data);
timekit.updateMeeting(data);
timekit.setMeetingAvailability(data);
timekit.bookMeeting(data);
timekit.inviteToMeeting(data);

// Users endpoints
timekit.createUser(data);
timekit.getUserInfo();
timekit.updateUser(data);
timekit.resetUserPassword(data);

// User properties endpoints
timekit.getUserProperties();
timekit.getUserProperty(data);
timekit.setUserProperties(data);
```

## Dynamic includes

The Timekit API have support for [dynamically including related models](http://developers.timekit.io/docs/dynamic-includes) (aka. expand objects). We supports this functionality by providing a chainable/fluent method called `.include()` that can be called right before a request.

The method takes unlimited string arguments, with each one being a model that you want included in the response. For nested data (e.g. events grouped by calendar), use the dot notation to dig into relations, like `calender.events`.

Example:

```javascript

timekit
.include('meetings', 'calendars.events')
.getUserInfo()
.then(function(response) {
    // Response contains JSON data with nested info on the user's calendars, events and meetings
});
```

This is super powerful because it means that you can avoid unnecessary extra requests compared to fetching each resource sequentially.

## Building from source

We use [webpack](http://webpack.github.io) for packaging the library as a module. To build the source files in `/src` to `/dist`, run:
```bash
# install dev dependencies
npm install
# build plain
webpack
# build minified
webpack --config webpack.config.min.js 
```

## Running tests

We use [jasmine](http://jasmine.github.io) + [karma](http://karma-runner.github.io/) for unit testing, which works together with webpack.

To run the test suite, simply do:
```bash
# install dev dependencies
npm install
# install karma as global
npm install -g karma
# start karma and run 
karma start
```

## Roadmap/todos

Stuff to do, among others:
- Add to bower and npm (when we hit v0.1.0)
- Make standalone version without dependencies bundled
