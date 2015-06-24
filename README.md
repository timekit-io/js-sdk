# Timekit JS SDK

[![Semver](http://img.shields.io/SemVer/0.0.1.png)](http://semver.org/spec/v0.0.1.html)

Make API calls to Timekit with our easy-to-use JavaScript SDK. It supports all our endpoints as documented on [developers.timekit.io](http://developers.timekit.io).

Features:
- Returns ES-6/A+ style promises
- Works in both node.js and in the browser (>=IE8 and evergreen)

*TODO:* Implement last 50% of endpoints

## Dependencies

The following libraries are bundled together with the SDK:

- [axios](https://github.com/mzabriskie/axios) - a promise based HTTP client for the browser and node.js
- [base64](https://github.com/mathiasbynens/base64) - a robust base64 encoder/decoder, used for basic auth headers

## Installation

Comes in two flavours: minified and plain. See `/dist` folder.

*TODO:* add to bower and npm

## Usage/module loading

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

**As a global variable (old-school)**
```html
<script src="timekit.min.js"></script>
<script>
    console.log(timekit);
</script>
```

## Endpoints and methods

```javascript
// overwrites default config with supplied object, possible values below
timekit.configure({
    app:        'demo'                      // app name registered with timekit
    apiBaseUrl: 'https://api.timekit.io/',  // API endpoint (do not change)
    apiVersion: 'v2'                        // version of API to call (do not change)
    inputTimestampFormat:  'Y-m-d h:ia',    // default timestamp format that you supply
    outputTimestampFormat: 'Y-m-d h:ia',    // default timestamp format that you want the API to return
    timezone:   'Europe/Copenhagen'         // override user's timezone for custom formatted timestamps in another timezone
});

// returns current config object
timekit.getConfig(); 

// set the user to auth with (gets automatically set after timekit.auth())
timekit.setUser(
    email,      // [String] email of the user
    apiToken    // [String] access token retrieved from API
);

timekit.findTime(
    emails,     // [Array] list of emails as strings for users
    future,     // [String] max time into the future, written as "3 months"
    length      // [String] length of the timeslots, written as "30 minutes"
);

timekit.getAccoutns();

timekit.accountGoogleSignup(
    shouldRedirect // [Boolean] automatically redirect the browser to the google url?
);

timekit.getAccountGoogleCalendars();

timekit.accountSync();

timekit.getCalendars();

timekit.getCalendar(
    token       // [String] id of the calendar to fetch (get with timekit.getCalendars())
);

timekit.getContacts();

timekit.getEvents(
    start,      // [Timestamp] which point in time to get events from
    end         // [Timestamp] which point in time to get events to
);

timekit.getAvailability(
    start,      // [Timestamp] which point in time to get events from
    end,        // [Timestamp] which point in time to get events to
    email       // [String] email of the user to get events from
);
```

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

We use [jasmine](http://jasmine.github.io) + [karma](http://karma-runner.github.io/) for unit testing, that works together with webpack.

Please note that most tests will fail if run against the live API url, as users won't be present.

*TODO:* mock API responses for independent tests

To run the test suite, simply do:
```bash
# install dev dependencies
npm install
# start karma and run once
karma start
```
