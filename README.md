# Network Rail - Node

This is a node package for interacting with the [Network Rail data feeds](https://datafeeds.networkrail.co.uk).

It comes with a tool for accessing this data directly via the command line, or can be used within your own projects.

## Installation

Install with:

```
$ npm install network-rail
```

_move binary to /usr/local/bin ?_

## Command-line Tool

...

## Using the package in your own projects

Require the `network-rail` package as usual:

```js
var rail = require('network-rail');
```

Since each command sends a request to the Network Rail api, the response is returned in a promise. For example, to get ??? you can call:

```js
rail.???.status({
    'incidents': true,
}).then(function(???) {
    console.log(???);
});
```

The function passed into `then()` will be called asynchronously once the request to the api has returned and been processed.

### Services

...