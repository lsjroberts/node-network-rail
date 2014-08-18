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
rail.feeds.listen(rail.feeds.topics.movements.all, null, function(body, headers) {
    body.forEach(function(message) {
        console.log('Type:', message.header.msg_type); // e.g. 0001
        console.log('Train:', message.body.train_id);
        console.log('Timestamp:', message.body.actual_timestamp);
        console.log('Company:', message.body.toc_id); // e.g. 84
        console.log('Delay:', message.body.timetable_varation'); // e.g. 3
    });
});

// formatted
rail.movements.listen(function(movements) {
    movements.forEach(function(movement) {
        console.log('Type:', movement.type); // e.g. 'activation'
        console.log('Train:', movement.trainID);
        console.log('Timestamp:', movement.timestamp);
        console.log('Company:', movement.company); // e.g. 'South West Trains'
        console.log('Delay:', movement.timetableVariation, 'minutes');
    });
});
```

### Reference data

There are several reference files / sets that can be used in conjunction with the streams to gain more information regarding each movement etc.

#### Train planning references

The train planning reference data contains information regarding the location of stations and junctions, platforms, network links, timing loads and timing links.

This dataset is over 1 million lines long so it is recommended you import it into your database and access it from there. You can do this with:

```js
rail.reference.parseReferenceFile(function(line) {
   // insert line into database
});
```

This data is not seperated by type, but you can check the `line.recordType` value to filter the data you want. For example, to extract all location information you can use:

```js
rail.reference.parseReferenceFile(function(line) {
    if (line.recordType == 'LOC') {
        createLocationRecord(line);
    }
}
});
```

##### Record types

- `PIF`: Control record (indicates the start of the file)
- `REF`: Reference codes
- `TLD`: Timing loads
- `LOC`: Geographic data
- `PLT`: Platform / sidings data
- `NWK`: Network links
- `TLK`: Timing links
- `PIT`: Control record (indicates the end of the file)

To see all available attributes available for the record types, inspect `rail.reference.recordTypes`.

#### TOC Codes

Companies are assigned a few different codes that are referred to within the available data. These can be accessed with:

```js
var tocs = rail.reference.tocCodes;
/*
{
    "companies": {
        "71": {
            "name": "Arriva Trains Wales",
            "business": "HL",
            "atoc": "AW"
        },
        ...
    }
}
*/
 */
```

#### Corpus

The corpus is an additional data set relating to locations on the network. This provides additional information for each station in the format:

```
{
    "STANOX": "...",
    "UIC": "...",
    "3ALPHA": "...",
    "NLCDESC16": "...",
    "TIPLOC": "...",
    "NLC": "...",
    "NLCDESC": "..."
}
```

You can find this information from a stanox using:

```js
var corpus = rail.reference.findCorpusLocationByStanox(stanox);
```