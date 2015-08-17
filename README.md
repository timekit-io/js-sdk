# Timekit JS SDK

[![Circle CI](https://img.shields.io/circleci/project/timekit-io/js-sdk.svg)](https://circleci.com/gh/timekit-io/js-sdk)
[![Code Coverage](https://img.shields.io/badge/coverage-92%25-green.svg)](https://github.com/timekit-io/js-sdk)

**Latest release:**  *v0.0.6*

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

## Installation

Comes in two flavours: minified (21.3 kb) and plain. See `/dist` folder.

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
    id          // [String] id of the calendar to fetch (get with timekit.getCalendars())
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
    id          // [String] the meeting id to fetch info for
);

timekit.createMeeting(
    what,       // [String] the title of the meeting
    where,      // [String] the location of the meeting
    suggestions // [Array] time suggestions for the meeting, as object with 'start' and 'end' timestamps
);

timekit.updateMeeting(
    id,         // [String] the meeting id
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
    id,         // [String] the id of the meeting to invite to
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

timekit.createApp(
    name,        // [String] Human friendly name of the Timekit app (will be slugged automatically)
    settings     // [Object] Contain key/value pairs of settings like 'contact_name', 'contact_email' & 'callback'
);

timekit.getApps();

timekit.getApp(
    slug         // [String] Slug of the Timekit app you want to retrieve
);

timekit.updateApp(
    slug,        // [String] Slug of the Timekit app you want to update
    data         // [Object] Settings for the app you want to update (e.g. key 'callback')
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
- Support for dynamic includes (potentially restructure method arguments)
- Add to bower and npm (when we hit v0.1.0)
- Make standalone version without dependencies bundled
- Fix CommonJS2 webpack build (some Axios dependency error)
