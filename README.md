# Timekit JS SDK

[![Circle CI](https://img.shields.io/circleci/project/timekit-io/js-sdk.svg)](https://circleci.com/gh/timekit-io/js-sdk)
[![Code Coverage](https://img.shields.io/badge/coverage-92%25-green.svg)](https://github.com/timekit-io/js-sdk)

[**Releases & changelog**](https://github.com/timekit-io/js-sdk/releases)

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
- [humps](https://github.com/domchristie/humps) - easy conversion from camelCase to snake_case and vice versa

## Installation

The library is hosted on NPM, so you can simply go:  

`npm install timekit-sdk --save`

## Module loading

The SDK is UMD (Universal Module Definition) compatible, which means that it can be loaded in various module formats across both browsers and server.

*Note: Use plain or minified builds in `/dist` when using in browser. In node, `/src/timekit.js` will be used through npm (or reference it manually in your require)*


**AMD (with e.g. require.js)**  
```javascript
require(['timekit'], function(timekit) {
    console.log(timekit);
});
```

**CommonJS2 (in e.g. node.js)**  
```javascript
var timekit = require('timekit');
console.log(timekit);
```

**As a global variable (in browsers)**  
```javascript
<script src="timekit-sdk.js"></script>
<script>
    console.log(timekit);
</script>
```

See `/examples` for implementation examples.

## Usage (init)
Using the SDK is easy. For default behaviour, you don't need to set any configuration. In case you need to, here's the available options:

```javascript
// Overwrites default config with supplied object, possible keys with default values below
timekit.configure({
    app:                        'demo'                      // app name registered with timekit (get in touch)
    apiBaseUrl:                 'https://api.timekit.io/',  // API endpoint (do not change)
    apiVersion:                 'v2'                        // version of API to call (do not change)
    inputTimestampFormat:       'Y-m-d h:ia',               // default timestamp format that you supply
    outputTimestampFormat:      'Y-m-d h:ia',               // default timestamp format that you want the API to return
    timezone:                   'Europe/Copenhagen',        // override user's timezone for custom formatted timestamps in another timezone
    convertResponseToCamelcase: false,                      // should keys in JSON response automatically be converted from snake_case to camelCase?
    convertRequestToSnakecase:  true,                       // should keys in JSON requests automatically be converted from camelCase to snake_case?
    autoFlattenResponse: true                               // if you keep this set to true, then responses with a "data" key will automatically be flattened to response.data (otherwise you need to access response.data.data). Note that pagination meta data is lost though.
});

// Returns current config object
timekit.getConfig();

// Set the user to auth with (gets automatically set after timekit.auth())
timekit.setUser(
    email,      // [String] email of the user
    apiToken    // [String] access token retrieved from API
);

// Returns current user that have been set previously (email and apiToken)
timekit.getUser();
```

## Usage (endpoints)

All the Timekit API endpoints are supported as methods. For endpoints taking parameters/data, the `data` argument should be an object with keys named as referenced in the docs - see: http://developers.timekit.io

If you supply keys as camelCased, they will automatically be converted to snake_case for you. Responses can also be converted to camelCase automatically if you set the config variable "convertResponseToCamelcase" to true.

Endpoints/methods:

```javascript
// Accounts endpoints
timekit.getAccounts();
timekit.accountGoogleSignup(data, shouldAutoRedirect:Boolean);
timekit.getAccountGoogleCalendars();
timekit.accountSync(data);
timekit.accountSyncCalendars(data);

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
timekit.updateCalendar(data);
timekit.deleteCalendar(data);

// Contacts endpoints
timekit.getContacts();

// Events endpoints
timekit.getEvents(data);
timekit.getEvent(data);
timekit.createEvent(data);
timekit.updateEvent(data);
timekit.getAvailability(data);

// FindTime endpoints
timekit.findTime(data);
timekit.findTimeBulk(data);

// Users endpoints
timekit.createUser(data);
timekit.getUserInfo();
timekit.updateUser(data);
timekit.resetUserPassword(data);
timekit.getUserTimezone(data);

// Credentials endpoints
timekit.getCredentials();
timekit.createCredential(data);
timekit.deleteCredential(data);

// Bookings endpoints
timekit.getBookings();
timekit.getBooking(data);
timekit.createBooking(data);
timekit.updateBooking(data);

// Widget endpoints
timekit.getWidgets();
timekit.getWidget(data);
timekit.getHostedWidget(data);
timekit.getEmbedWidget(data);
timekit.createWidget(data);
timekit.updateWidget();
timekit.deleteWidget();
```

Request example:
```javascript

timekit.createEvent({
  start:        '2015-10-26T15:45:00+00:07',
  end:          '2015-10-26T17:30:00+00:07',
  what:         'Coffee with the timelords',
  where:        'Timekit HQ @ San Francisco',
  participants: ['doc.brown@timekit.io', 'john@doe.com'],
  invite:       true,
  calendar_id:  '794f6cca-68b5-11e5-9d70-feff819cdc9f'
}).then(function(response){
  console.log(response);
}).catch(function(response){
  console.log(response);
});
```

Response example:
```javascript

{
  // data is the response that was provided by the server
  data: {},
  // status is the HTTP status code from the server response
  status: 200,
  // statusText is the HTTP status message from the server response
  statusText: 'OK',
  // headers the headers that the server responded with
  headers: {},
  // config is the config that was provided to `axios` for the request
  config: {}
}
```

## Usage (lowlevel API)

If you, for some reason, would like direct access to axios's request API, you can call the `timekit.makeRequest()` method directly. We'll still set the correct config headers, base url and includes, but otherwise it supports all the settings that [axios](https://github.com/mzabriskie/axios) does.

Example:
```javascript

timekit.makeRequest({
  url: '/endpoint/goes/here',
  method: 'post',
  data: {
    key: 'value'
  },
  timeout: 1000
}).then(function(response){
  console.log(response);
}).catch(function(response){
  console.log(response);
});
```

## Dynamic includes

The Timekit API have support for [dynamically including related models](http://developers.timekit.io/docs/dynamic-includes) (aka. expand objects). We supports this functionality by providing a chainable/fluent method called `.include()` that can be called right before a request.

The method takes unlimited string arguments, with each one being a model that you want included in the response. For nested data (e.g. events grouped by calendar), use the dot notation to dig into relations, like `calender.events`.

Example:

```javascript

timekit
.include('calendars.events', 'users')
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

See [Issues](https://github.com/timekit-io/js-sdk/issues) for feature requests, bugs etc.
