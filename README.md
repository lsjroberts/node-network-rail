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

You must start by connecting to the feeds service, you should first [register with Network Rail](http://datafeeds.networkrail.co.uk), then use your username and password to connect.

```js
rail.feeds.connect(username, password);
```

### Listening to the stream

Once connected to the datafeeds you can then listen to the stream of data as it is received. You can either listen directly to the feed and get the raw data as it comes back, or use one of the provided transformers.

```js
// raw data
rail.feeds.listen('TRAIN_MVT_ALL_TOC', null, function(body, headers) {
    body.forEach(function(message) {
        console.log('Type:', message.header.msg_type); // e.g. 0001
        console.log('Train:', message.body.train_id);
        console.log('Timestamp:', message.body.actual_timestamp);
        console.log('Company:', message.body.toc_id);
        console.log('Delay:', message.body.timetable_varation');
    });
});

// formatted
rail.movements.listen(function(movements) {
    Object.keys(movements).forEach(function(type) {
        console.log(type); // e.g. activations
        movements[type].forEach(function(movement) {
            console.log('\tTrain:', movement.trainID);
            console.log('\t\tTimestamp:', movement.timestamp);
            console.log('\t\tCompany:', movement.company);
            console.log('\t\tDelay:', movement.timetableVariation, 'minutes');
        });
    });
});
```

### Services

...