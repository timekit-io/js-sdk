# Timekit JS SDK

[![Circle CI](https://img.shields.io/circleci/project/timekit-io/js-sdk.svg)](https://circleci.com/gh/timekit-io/js-sdk)
[![Code Coverage](https://img.shields.io/badge/coverage-92%25-green.svg)](https://github.com/timekit-io/js-sdk)

[**Releases & changelog**](https://github.com/timekit-io/js-sdk/releases)

Make API calls to Timekit with our easy-to-use JavaScript SDK. It supports all our endpoints as documented on [https://reference.timekit.io/](https://reference.timekit.io/).

Visit [timekit.io](http://timekit.io) to learn more and don't hesitate to contact Lasse Boisen Andersen ([la@timekit.io](mailto:la@timekit.io) or create an Issue) for questions. PR's are more than welcome!

Features:
- Supports API auth with both app keys and resource keys
- Returns ES6/A+ style promises
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

**ES6 module**  
```javascript
import timekit from 'timekit-sdk'
console.log(timekit);
```

**AMD (with e.g. require.js)**  
```javascript
require(['timekit-sdk'], function(timekit) {
    console.log(timekit);
});
```

**CommonJS2 (in e.g. node.js)**  
```javascript
var timekit = require('timekit-sdk');
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

## Authentication

### App key
*Only for server-side integrations!*  

With app keys, your capabilities are scoped on an app-level which mean that you can access data (e.g. bookings) across all resources. It's essential that you only use this for server-side integrations as the key grants full access to your whole timekit app data.

```javascript
timekit.configure({
  appKey: 'live_api_key_4cY2KWMggw95mAdx51eYUO2CyIWI2xup'
})
```

Your app key can be found in the Timekit admin panel (https://admin.timekit.io)

### Resource keys
*For client-side integrations!*  

Resource keys are scoped by the resource and the data that they have access to. The primary use-case is together with our booking.js widget that only acts as a single resource at a time.

Resource keys needs to be accompanied by the resource's email and the app attribute. Note that two types of keys exist: `server-token` and `client-token`, where only the latter should be used. Please refer to the [API reference](https://developers.timekit.io/reference#credentials).

```javascript
timekit.configure({
  app: 'back-to-the-future',
  resourceEmail: 'marty.mcfly@timekit.io',
  resourceKey: '4cY2KWMggw95mAdx51eYUO2CyIWI2xup'
})
```

🚨 **Important!** Resource keys are being phased out as a supported authentication mechanism. We encourage you to use app keys for new Timekit integrations.

## Usage (init)
The only required configuration is that you set the "app" key to your registered app slug on Timekit.

Here's all the available options:

```javascript
// Overwrites default config with supplied object, possible keys with default values below
timekit.configure({
    apiBaseUrl:                 'https://api.timekit.io/',  // API endpoint (do not change)
    apiVersion:                 'v2',                       // version of API to call (do not change)
    inputTimestampFormat:       'Y-m-d h:ia',               // default timestamp format that you supply
    outputTimestampFormat:      'Y-m-d h:ia',               // default timestamp format that you want the API to return
    timezone:                   'Europe/Copenhagen',        // override user's timezone for custom formatted timestamps in another timezone
    convertResponseToCamelcase: false,                      // should keys in JSON response automatically be converted from snake_case to camelCase?
    convertRequestToSnakecase:  true,                       // should keys in JSON requests automatically be converted from camelCase to snake_case?
    autoFlattenResponse: true                               // if you keep this set to true, then responses with a "data" key will automatically be flattened to response.data (otherwise you need to access response.data.data). Pagination meta data can be found on response.metaData)
});

// Returns current config object
timekit.getConfig();
```

## Usage (endpoints)

All the Timekit API endpoints are supported as methods. For endpoints taking parameters/data, the method argument should be an object with keys named as referenced in the docs - see: https://developers.timekit.io/reference/

If you supply keys as camelCased, they will automatically be converted to snake_case for you. Responses can also be converted to camelCase automatically if you set the config variable `convertResponseToCamelcase` to true.

Endpoints/methods:

```javascript
// App endpoints
timekit.getApp()

// Resource endpoints
timekit.getResources()
timekit.getResource({ id })
timekit.createResource({ ... })
timekit.updateResource({ id, ... })
timekit.resetResourcePassword({ ... })
timekit.getResourceTimezone({ email })

// FindTime endpoints
timekit.findTime({ ... })
timekit.findTimeBulk({ ... })
timekit.findTimeTeam({ ... })

// Availability endpoints
timekit.fetchAvailability({ ... })

// Booking endpoints
timekit.getBookings([ include ])
timekit.getBooking({ id })
timekit.createBooking({ ... })
timekit.createBookingsBulk({ ... })
timekit.updateBooking({ id, action, ... })
timekit.updateBookingsBulk({ ... })
timekit.getGroupBookings()
timekit.getGroupBooking({ id })

// Account endpoints
timekit.getAccounts()
timekit.accountGoogleSignup({ callback }, shouldAutoRedirect)
timekit.accountGoogleSync()
timekit.accountMicrosoftSignup({ callback }, shouldAutoRedirect)
timekit.accountMicrosoftSync()

// Calendar endpoints
timekit.getCalendars()
timekit.getCalendar({ id })
timekit.createCalendar({ ... })
timekit.updateCalendar({ id, ... })
timekit.deleteCalendar({ id })

// Project endpoints
timekit.getProjects()
timekit.getProject({ id })
timekit.getHostedProject({ slug })
timekit.getEmbedProject({ id })
timekit.createProject({ ... })
timekit.updateProject({ id, ... })
timekit.deleteProject({ id })
timekit.addProjectResource({ id, ... })
timekit.setProjectResources({ id, resources })
timekit.removeProjectResource({ id, resourceId })

// Event endpoints
timekit.getEvents({ ... })
timekit.getEvent({ id })
timekit.createEvent({ ... })
timekit.updateEvent({ id, ... })
timekit.deleteEvent({ id })

// Auth endpoints (Note: only used to fetch a resource key)
timekit.auth({ ... })

// Credential endpoints (Note: only used to manage resource keys)
timekit.getCredentials()
timekit.createCredential({ ... })
timekit.deleteCredential({ id })
```

Request example:
```javascript
// Using promises
timekit.createBooking({
  resource_id: 'd187d6e0-d6cb-409a-ae60-45a8fd0ec879',
  graph: 'confirm_decline',
  start: '1955-11-12T21:30:00-07:00',
  end: '1955-11-12T22:15:00-07:00',
  what: 'Catch the lightning',
  where: 'Courthouse, Hill Valley, CA 95420, USA',
  description: 'The lightning strikes at 10:04 PM exactly! I need you to be there Doc!',
  customer: {
    name: 'Marty McFly',
    email: 'marty.mcfly@timekit.io',
    phone: '(916) 555-4385',
    voip: 'McFly',
    timezone: 'America/Los_Angeles'
  }
}).then(function(response){
  console.log(response);
}).catch(function(response){
  console.log(response);
});

// Using async/await
const response = await timekit.createBooking({ ... })
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

## Usage (low-level API)

If you, for some reason, would like direct access to axios's request API, you can call the `timekit.makeRequest()` method directly. We'll still set the correct config headers, base url and includes, but otherwise it supports all the settings that [axios](https://github.com/mzabriskie/axios) does.

Example:
```javascript

timekit.makeRequest({
  url: '/bookings',
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

## Usage (carry)

If you want to inject specific params/query string or data into the next API request, you can use the `carry` method. It's handy for e.g. filtering result (`search`) or adding pagination (`limit`).

Example:
```javascript
timekit
  .carry({
    params: {
      search: 'graph:confirm_decline',
      limit: 10
    }
  })
  .getBookings()
  .then(function(response) {
    // Response is filtered by the search query and limited to only 10 items
  });
```

## Usage (dynamic includes)

The Timekit API have support for [dynamically including related models](https://reference.timekit.io/reference#dynamic-includes) (aka. expand objects). We supports this functionality by providing a chainable/fluent method called `.include()` that can be called right before a request.

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
