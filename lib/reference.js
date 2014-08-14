var _ = require('underscore')
  , referencePath = __dirname + '/../fixtures/reference.tsv'
  , corpusPath = __dirname + '/../fixtures/corpus.json'
  , tocCodesPath = __dirname + '/../fixtures/toc_codes.json'
  , prettyjson = require('prettyjson')
  , fs = require('fs')
  , readline = require('readline')
  , dsv = require('dsv')
  , OSPoint = require('ospoint')
;

var Reference = function() {

};

Reference.prototype.tocCodes = require(tocCodesPath);

// http://nrodwiki.rockshore.net/index.php/Train_Planning_Data_Structure#Record_types
Reference.prototype.recordTypes = {
    'PIF': [ // Control Record
        'fileVersion',
        'sourceSystem',
        'tocID',
        'startAt',
        'endAt',
        'cycleType',
        'createdAt',
        'sequenceNumber',
    ],
    'REF': [ // Reference Codes
        'actionCode',
        'referenceCodeType',
        'description',
    ],
    'TLD': [ // Timing Load
        'actionCode',
        'tractionType',
        'trailingLoad',
        'speed',
        'routeAvailabilityGauge',
        'description',
        'itpsPowerType',
        'itpsLoad',
        'limitingSpeed',
    ],
    'LOC': [ // Geographic data
        'actionCode',
        'locationCode',
        'locationName',
        'startAt',
        'endAt',
        'osEasting',
        'osNorthing',
        'timingPointType',
        'zone',
        'stanox',
        'offNetwork',
        'forceLPB',
    ],
    'PLT': [ // Platform / Sidings
        'actionCode',
        'locationCode',
        'platformID',
        'startAt',
        'endAt',
        'platformLength',
        'powerSupplyType',
        'dooPassenger',
        'dooNonPassenger',
    ],
    'NWK': [ // Network Link
        'actionCode',
        'originLocation',
        'destinationLocation',
        'runningLineCode',
        'runningLineDescription',
        'startAt',
        'endAt',
        'initialDirection',
        'finalDirection',
        'distance',
        'dooPassenger',
        'dooNonPassenger',
        'retb',
        'zone',
        'reversibleLine',
        'powerSupplyLine',
        'routeAvailability',
        'maximumTrainLength',
    ],
    'TLK': [ // Timing Link
        'actionCode',
        'originLocation',
        'destinationLocation',
        'runningLineCode',
        'tractionType',
        'trailingLoad',
        'speed',
        'routeAvailabilityGauge',
        'entrySpeed',
        'exitSpeed',
        'startDate',
        'endDate',
        'sectionalRunningTime',
        'description',
    ],
    'PIT': false
}

Reference.prototype.parseReferenceFile = function(lineCallback) {
    var self = this
      , rd
      , line
      , parsedLine
      , key
      , value
      , data = []
    ;

    rd = readline.createInterface({
        input: fs.createReadStream(referencePath),
        output: process.stdout,
        terminal: false
    });

    rd.on('line', function(line) {
        line = line.split("\t");

        // console.log(new Date, line[0]);

        if (self.recordTypes[line[0]] == false) {
            return;
        }

        parsedLine = {
            'recordType': line[0],
        };
        for (var i = 1, len = line.length; i < len; i++) {
            key = self.recordTypes[line[0]][i-1];
            if (key) {
                value = line[i];

                switch (key) {
                    // date (dd-mm-yyyy hh:mm:ss)
                    case 'startAt':
                    case 'endAt':
                    case 'createdAt':
                        if (value.length > 0) {
                            v = value.split(/[\s\-\:]+/);
                            value = new Date(v[2], v[1], v[0], v[3], v[4], v[5]);
                        } else {
                            value = null;
                        }
                        break;

                    // bool
                    case 'retb':
                    case 'zone':
                    case 'dooPassenger':
                    case 'dooNonPassenger':
                    case 'offNetwork':
                        value = (value == 'Y') ? true : false;
                        break;

                    // ordnance survey coordinate
                    case 'osEasting':
                        key = 'latitude';
                        point = new OSPoint(0, value);
                        value = point.toWGS84().latitude;
                        break;
                    case 'osNorthing':
                        key = 'longitude';
                        point = new OSPoint(value, 0);
                        value = point.toWGS84().longitude;
                        break;

                    default:
                        if (value.trim().length == 0) {
                            value = null
                        }
                        break;
                }

                parsedLine[key] = value;
            }
        }

        lineCallback(parsedLine, line);

        data.push(parsedLine);
    });

    return data;
};

Reference.prototype.findCorpusLocations = function(options) {
    var corpus = require(corpusPath)
      , locations;

    options = _.defaults(options || {}, {});

    locations = corpus.TIPLOCDATA.filter(function(location) {
        var include = false;
        Object.keys(options).forEach(function(option) {
            include = include || (location[option.toUpperCase()] == options[option]);
        });
        return include;
    });

    return locations;
};

Reference.prototype.findCorpusLocationByStanox = function(stanox) {
    var corpus = require(corpusPath)
      , location
    ;

    corpus.TIPLOCDATA.forEach(function(l) {
        if (l.STANOX == stanox) {
            location = l;
            return;
        }
    });

    return location;
};

module.exports = new Reference();