# Timekit JS SDK

[![Semver](http://img.shields.io/SemVer/0.0.3.png)](http://semver.org/spec/v0.0.3.html)

Make API calls to Timekit with our easy-to-use JavaScript SDK. It supports all our endpoints as documented on [developers.timekit.io](http://developers.timekit.io).

Visit [timekit.io](http://timekit.io) to learn more and don't hesitate to contact Lasse Boisen Andersen ([la@timekit.io](mailto:la@timekit.io) or create an Issue) for questions. PR's are more than welcome!

Features:
- Returns ES-6/A+ style promises
- Works in both node.js and in the browser (>=IE8 and evergreen)
- Supports custom timestamp formats and timezones

*TODO:* Support for dynamic includes

## Dependencies

The following libraries are bundled together with the SDK:

- [axios](https://github.com/mzabriskie/axios) - a promise-based HTTP client for the browser (using [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)) and node.js (using [http](http://nodejs.org/api/http.html))
- [base64](https://github.com/mathiasbynens/base64) - a robust base64 encoder/decoder, used for basic auth headers

## Installation

Comes in two flavours: minified (21.3 kb) and plain. See `/dist` folder.

*TODO:* Add to bower and npm

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
*Note: use src/timekit.js directly in node.js for now, dist/timekit.js wont work*

**As a global variable (old-school)**
```html
<script src="timekit.js"></script>
<script>
    console.log(timekit);
</script>
```

## Endpoints and methods

```javascript
// overwrites default config with supplied object, possible keys with default values below
timekit.configure({
    app:        'demo'                      // app name registered with timekit (get in touch)
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

timekit.auth(
    email,      // [String] email of the user
    password    // [String] password of the user
);

timekit.findTime(
    emails,     // [Array] list of emails as strings for users
    filters,    // [Mixed] specify advanced filters to slice data (see http://developers.timekit.io/v2/docs/find-time-filters)
    future,     // [String] max time into the future, written as "3 months"
    length,     // [String] length of the timeslots, written as "30 minutes"
    sort        // [String] how should the resulting events be sorted (asc or desc)
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

timekit.getMeetings();

timekit.getMeeting(
    token       // [String] the meeting token to fetch info for
);

timekit.createMeeting(
    what,       // [String] the title of the meeting
    where,      // [String] the location of the meeting
    suggestions // [Array] time suggestions for the meeting, as object with 'start' and 'end' timestamps
);

timekit.updateMeeting(
    token,      // [String] the meeting token
    data        // [Object] meeting data to update (what & where as key value pairs)
);

timekit.setMeetingAvailability(
    suggestionId, // [Number] the suggestion ID to update availability for
    available   // [Boolean] is the user avaialable on the suggestion? true or false
);

timekit.bookMeeting(
    suggestionId // [Number] which suggestion to book the meeting 
);

timekit.inviteToMeeting(
    token,      // [String] the token of the meeting to invite to
    emails      // [Array] which emails to send the invitiation to
);

timekit.createUser(
    firstName,  // [String] first name of the user
    lastName    // [String] last name of the user
    email,      // [String] email of the user
    password,   // [String] password of the user
    timezone    // [String] timezone that the user is in (formatted as Europe/Copenhagen)
);

timekit.getUserInfo();

timekit.updateUser(
    data        // [Object] key value pair of user fields to update (e.g. first_name or timezone)
);

timekit.getUserProperties();

timekit.getUserProperty(
    key         // [String] the user property key to get (can be any custom string)
);

timekit.setUserProperties(
    data        // [Object] key value pairs with the user properties to set or overwrite
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

*TODO:* Make standalone version without dependencies bundled

## Running tests

We use [jasmine](http://jasmine.github.io) + [karma](http://karma-runner.github.io/) for unit testing, which works together with webpack.
Please note that most tests will fail if run against the live API url, as users won't be present.

To run the test suite, simply do:
```bash
# install dev dependencies
npm install
# start karma and run once
karma start
```

*TODO:* Mock API responses for independent tests
