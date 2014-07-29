var _ = require('underscore')
  , corpusPath = __dirname + '/../fixtures/corpus.json'
  , tocCodesPath = __dirname + '/../fixtures/toc_codes.json'
  , prettyjson = require('prettyjson')
;

var Reference = function() {

};

Reference.prototype.tocCodes = require(tocCodesPath);

Reference.prototype.findLocations = function(options) {
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

Reference.prototype.getLocationByStanox = function(stanox) {
    var corpus = require(corpusPath)
      , location;

    corpus.TIPLOCDATA.forEach(function(l) {
        if (l.STANOX == stanox) {
            location = l;
            return;
        }
    });

    return location;
};

module.exports = new Reference();